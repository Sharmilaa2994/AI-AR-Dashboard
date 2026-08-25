from fastapi import APIRouter

from app.services.vision.opencv_service import OpenCVService
from app.services.vision.hand_tracking_service import HandTrackingService
from app.services.vision.object_detection_service import ObjectDetectionService

router = APIRouter(
    prefix="/vision",
    tags=["Computer Vision"],
)


vision_service = OpenCVService()
hand_tracking_service = HandTrackingService()
object_detection_service = ObjectDetectionService()

@router.get("/status")
def vision_status():
    return vision_service.get_status()


@router.post("/initialize")
def initialize_vision():
    return vision_service.initialize()


@router.get("/pipeline")
def pipeline_status():
    return {
        "pipeline": "computer_vision",
        "opencv": "ready",
        "frame_processing": "ready",
        "mediapipe": (
            "ready"
            if hand_tracking_service.initialized
            else "not_initialized"
        ),
        "object_detection": (
    "ready"
    if object_detection_service.initialized
    else "not_initialized"
),
    }


@router.post("/hands/initialize")
def initialize_hand_tracking():
    return hand_tracking_service.initialize()

@router.post("/objects/initialize")
def initialize_object_detection():
    return object_detection_service.initialize()


@router.get("/hands/status")
def hand_tracking_status():
    return hand_tracking_service.get_status()

@router.get("/objects/status")
def object_detection_status():
    return object_detection_service.get_status()