from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.vision import router as vision_router
from app.api.dashboard import router as dashboard_router

app = FastAPI(
    title="AI-Powered AR Dashboard API",
    description="Backend API for the AI-Powered AR Dashboard with Computer Vision and Gesture-Based Interaction.",
    version="1.0.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(vision_router)
app.include_router(dashboard_router)

@app.get("/")
def root():
    return {
        "message": "AI-Powered AR Dashboard API is running",
        "status": "success",
        "version": "1.0.0",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }