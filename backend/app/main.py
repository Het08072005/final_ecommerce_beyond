import os
import certifi

# Fix for SSL certificate verify failed on Mac
os.environ["SSL_CERT_FILE"] = certifi.where()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import search
from app.agent.routes import router as livekit_router
from app.websocket.routes import router as ws_router

app = FastAPI(title="Shoe Store Smart API")

# Tables create karein (with error handling)
try:
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully")
except Exception as e:
    print(f"⚠️ Database initialization warning: {e}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(search.router, prefix="/api")
app.include_router(livekit_router, prefix="/api")
app.include_router(ws_router)


@app.get("/")
def home():
    return {"message": "API is running. Go to /docs for testing."}