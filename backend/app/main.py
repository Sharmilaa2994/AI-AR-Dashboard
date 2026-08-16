from fastapi import FastAPI

from app.api.vision import router as vision_router


app = FastAPI(
    title="AI-Powered AR Dashboard API",
    description="Backend API for the AI-Powered AR Dashboard with Computer Vision and Gesture-Based Interaction.",
    version="1.0.0",
)


app.include_router(vision_router)


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