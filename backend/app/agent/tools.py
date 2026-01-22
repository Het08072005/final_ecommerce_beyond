# #tools.py
# import httpx
# from livekit.agents import function_tool, RunContext, ToolError
# from app.websocket.manager import manager

# FASTAPI_URL = "http://localhost:8000/api/search"  # FastAPI backend endpoint

# @function_tool(
#     name="search_products",
#     description="Search products from FastAPI backend and recommend the top result"
# )
# async def search_products(
#     ctx: RunContext,
#     query: str,
#     category: str | None = None
# ) -> dict:
#     """
#     LiveKit Agent Tool to search products from FastAPI backend and return recommendation
#     """

#     if not query or not query.strip():
#         raise ToolError("Search query is empty")

#     params = {"q": query.strip()}
#     if category:
#         params["category"] = category.strip()

#     try:
#         async with httpx.AsyncClient(timeout=10) as client:
#             res = await client.get(FASTAPI_URL, params=params)
#             res.raise_for_status()  # Raise exception for HTTP errors

#         products = res.json()

#         if not isinstance(products, list):
#             raise ToolError("Unexpected response format from backend")

#         if products:
#             recommendation = f"I found {len(products)} products for '{query}'. I recommend checking out '{products[0]['name']}'!"
#         else:
#             recommendation = f"Sorry, no products available for '{query}'."

#         return {
#             "status": "ok",
#             "query": query.strip(),
#             "recommendation": recommendation
#         }

#     except httpx.HTTPStatusError as e:
#         raise ToolError(f"FastAPI returned an error: {e.response.status_code}")
#     except Exception as e:
#         raise ToolError(f"Failed to search products: {str(e)}")












import httpx
import json
import asyncio
from livekit.agents import function_tool, RunContext, ToolError
# from app.websocket.manager import manager

FASTAPI_URL = "http://127.0.0.1:8000/api/search"

@function_tool(
    name="search_products",
    description="Search products from the lifestyle database based on user preferences like brand, color, and occasion."
)
async def search_products(
    ctx: RunContext,
    query: str,
    category: str | None = None
) -> dict:
    """
    Search products and trigger a navigation event on the frontend.
    """
    if not query or not query.strip():
        raise ToolError("Search query is empty")

    params = {"q": query.strip()}
    if category:
        params["category"] = category.strip()

    try:
        # Trigger navigation on frontend via data packet
        try:
            payload = json.dumps({"type": "navigate", "url": "/products"})
            # Note: The actual publishing is handled in agents.py wrapper or here if room is in ctx
            if hasattr(ctx, 'room') and ctx.room:
                 await ctx.room.local_participant.publish_data(payload.encode("utf-8"), reliable=True)
        except Exception as e:
            print(f"Navigation event failed: {e}")

        async with httpx.AsyncClient(timeout=10) as client:
            res = await client.get(FASTAPI_URL, params=params)
            res.raise_for_status()

        products = res.json()
        if not isinstance(products, list):
            raise ToolError("Unexpected response format from backend")

        if products:
            # Prepare detailed info for the top 5 products so the agent can talk about them
            detailed_products = []
            for p in products[:5]:
                detailed_products.append({
                    "name": p.get("name"),
                    "brand": p.get("brand"),
                    "colors": p.get("colors", []),
                    "price": p.get("price"),
                    "category": p.get("category"),
                    "occasions": p.get("occasions", []),
                    "description": p.get("description", "")[:200] + "..." if p.get("description") else ""
                })
            
            recommendation = f"I've found {len(products)} great options for you! I particularly like the '{products[0]['name']}'—it's a bestseller. Take a look at your screen!"
        else:
            detailed_products = []
            recommendation = f"I couldn't find an exact match for '{query}', but I have some other trending styles on the screen that you might love!"

        return {
            "status": "ok", 
            "query": query.strip(), 
            "recommendation": recommendation,
            "count": len(products),
            "top_products": detailed_products
        }

    except httpx.HTTPStatusError as e:
        raise ToolError(f"Database reflects an error: {e.response.status_code}")
    except Exception as e:
        raise ToolError(f"Search failed: {str(e)}")

@function_tool(
    name="end_conversation",
    description="Properly close the session when the user is finished or says goodbye."
)
async def end_conversation(ctx: RunContext):
    """
    Signals the frontend to start the exit sequence. 
    The frontend will wait a few seconds for the agent's goodbye 
    and then close automatically.
    """
    print("Tool: end_conversation called. Signaling frontend for delayed closure.")
    
    # 🔥 GLOBAL WS BROADCAST (Immediate signal)
    try:
        async with httpx.AsyncClient() as client:
            await client.post("http://127.0.0.1:8000/broadcast", json={"type": "END_SESSION"})
        print("Global END_SESSION signal sent via FastAPI broadcast.")
    except Exception as e:
        print(f"Global broadcast call failed: {e}")

    return "CONVERSATION_ENDED_SUCCESSFULLY_PLEASE_SAY_GOODBYE"





