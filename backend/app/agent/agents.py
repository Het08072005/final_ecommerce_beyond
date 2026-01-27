import os
import sys
import httpx # 🔥 Added for broadcast calls

# 🔥 Add backend root to path so 'app' module can be found
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

import certifi

# Fix for SSL certificate verify failed on Mac
os.environ["SSL_CERT_FILE"] = certifi.where()

import asyncio, time, json
from dotenv import load_dotenv

from livekit import agents
from livekit.agents import (
    AgentServer,
    AgentSession,
    Agent,
    room_io,
    inference,
)

from livekit.plugins import noise_cancellation, bey, deepgram
from tools import search_products, end_conversation
from prompts import AGENT_INSTRUCTION, SESSION_INSTRUCTION

load_dotenv()

server = AgentServer()
USER_SILENCE_TIMEOUT = 300 # Increased to 5 minutes to prevent mid-conversation cutoffs


class Assistant(Agent):
    def __init__(self, tools=None):
        super().__init__(instructions=AGENT_INSTRUCTION, tools=tools or [])
        self.last_user_time = time.time()
        self.session_active = True

        self.user_session = None
        self.user_avatar = None
        self.user_ctx = None
        self.pending_exit = False

    async def on_user_message(self, message: str):
        self.last_user_time = time.time()
        print("User:", message)

    async def on_tool_result(self, name: str, result):
        if name == "end_conversation" and "CONVERSATION_ENDED" in result:
            print(f"End tool triggered. Session will close in 6 seconds (Safety Net).")
            self.pending_exit = True
            
            async def auto_kill():
                await asyncio.sleep(6.0) # Safety net
                await end_session_gracefully(self)
            
            asyncio.create_task(auto_kill())


@server.rtc_session()
async def my_agent(ctx: agents.JobContext):
    try:
        stt = inference.STT(model="deepgram/flux-general", language="en")
        tts = deepgram.TTS(model="aura-asteria-en")

        session = AgentSession(
            stt=stt,
            llm="google/gemini-3-flash-preview",
            tts=tts,
        )

        avatar = bey.AvatarSession(
            api_key=os.getenv("BEY_API_KEY"),
            avatar_id=os.getenv("BEY_AVATAR_ID"),
        )

        assistant = Assistant(tools=[search_products, end_conversation])
        assistant.user_session = session
        assistant.user_avatar = avatar
        assistant.user_ctx = ctx

        # Silence watchdog
        asyncio.create_task(silence_monitor(assistant))

        await avatar.start(session, ctx.room)

        @session.on("user_transcript")
        def on_transcript(transcript):
            if hasattr(transcript, 'text') and transcript.text.strip():
                assistant.last_user_time = time.time()
                print(f"Activity detected: {transcript.text}")

        await session.start(
            room=ctx.room,
            agent=assistant,
            room_options=room_io.RoomOptions(
                audio_input=room_io.AudioInputOptions(
                    noise_cancellation=lambda _: noise_cancellation.BVC()
                ),
                close_on_disconnect=False
            ),
        )

        await session.generate_reply(instructions=SESSION_INSTRUCTION)
    except Exception as e:
        print(f"Critical session error: {e}")


async def silence_monitor(agent: Assistant):
    while agent.session_active:
        await asyncio.sleep(5)
        if time.time() - agent.last_user_time > USER_SILENCE_TIMEOUT:
            print("Silence timeout reached")
            await end_session_gracefully(agent, silent=True)
            break


async def end_session_gracefully(agent: Assistant, silent=False):
    if not agent.session_active:
        return

    agent.session_active = False
    ctx = agent.user_ctx
    avatar = agent.user_avatar
    session = agent.user_session

    try:
        # 🔥 GLOBAL BROADCAST via FastAPI (Reliable cross-process signal)
        try:
            internal_url = os.getenv("INTERNAL_API_URL", "http://127.0.0.1:8000")
            async with httpx.AsyncClient() as client:
                await client.post(f"{internal_url}/broadcast", json={"type": "END_SESSION"})
            print(f"Global END_SESSION signal sent via {internal_url}/broadcast")
        except Exception as e:
            print(f"Global broadcast call failed: {e}")

        if silent and session:
            print("Ending session due to silence...")
            await session.generate_reply(
                instructions="It seems you've stepped away. Closing the session now. Goodbye!"
            )
            await asyncio.sleep(2) # Give a moment for TTS
        
        # 1. SEND DIRECT SIGNAL TO FRONTEND VIA LIVEKIT DATA
        if ctx and ctx.room:
            try:
                payload = json.dumps({"type": "end_conversation"})
                await ctx.room.local_participant.publish_data(
                    payload.encode("utf-8"),
                    reliable=True,
                )
                print("Direct end_conversation signal sent to frontend via LiveKit.")
            except Exception as e:
                print(f"Failed to send direct signal: {e}")

        # 2. DISCONNECT ROOM
        if ctx and ctx.room:
            print("Directly disconnecting room...")
            await ctx.room.disconnect()
            print("Room disconnected.")

        # 2. CLEANUP IN BACKGROUND
        if avatar:
            if hasattr(avatar, "stop"):
                asyncio.create_task(avatar.stop())
            elif hasattr(avatar, "close"):
                asyncio.create_task(avatar.close())

    except Exception as e:
        print(f"Error during fast shutdown: {e}")


if __name__ == "__main__":
    agents.cli.run_app(server)