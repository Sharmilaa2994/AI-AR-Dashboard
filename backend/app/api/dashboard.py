from fastapi import APIRouter
from datetime import datetime
import random

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get("/status")
async def dashboard_status():
    """
    Return real-time AR dashboard system metrics.
    """

    return {
        "status": "operational",
        "active_users": 1284,
        "system_load": random.randint(35, 60),
        "processing_rate": round(
            random.uniform(96.0, 99.9),
            1,
        ),
        "interactions": 8492,
        "timestamp": datetime.now().isoformat(),
    }