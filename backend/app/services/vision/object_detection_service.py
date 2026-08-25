from pathlib import Path

from ultralytics import YOLO


class ObjectDetectionService:
    """
    YOLO object detection service.

    Responsible for loading the YOLO model and
    providing object detection on OpenCV frames.
    """

    def __init__(self):
        self.initialized = False
        self.model = None

        self.model_path = (
            Path(__file__).resolve().parents[3]
            / "models"
            / "yolo11n.pt"
        )

    def initialize(self):
        """
        Initialize the YOLO object detection model.
        """

        if self.initialized:
            return {
                "status": "success",
                "message": "YOLO object detection already initialized",
            }

        if not self.model_path.exists():
            raise FileNotFoundError(
                f"YOLO model not found: {self.model_path}"
            )

        self.model = YOLO(
            str(self.model_path)
        )

        self.initialized = True

        return {
            "status": "success",
            "message": "YOLO object detection initialized",
            "model": self.model_path.name,
            "device": "cpu",
        }

    def detect(self, frame):
        """
        Detect objects in an OpenCV BGR frame.
        """

        if not self.initialized:
            self.initialize()

        if frame is None:
            raise ValueError("Invalid frame received")

        results = self.model(
            frame,
            verbose=False
        )

        detections = []

        for result in results:

            boxes = result.boxes

            if boxes is None:
                continue

            for box in boxes:

                class_id = int(
                    box.cls[0].item()
                )

                confidence = float(
                    box.conf[0].item()
                )

                xyxy = [
                    int(value)
                    for value in box.xyxy[0].tolist()
                ]

                detections.append({
                    "class_id": class_id,
                    "class_name": result.names[class_id],
                    "confidence": confidence,
                    "bbox": xyxy,
                })

        return detections

    def get_status(self):
        """
        Return current object detection status.
        """

        return {
            "service": "object_detection",
            "provider": "YOLO",
            "initialized": self.initialized,
            "model": self.model_path.name,
            "model_loaded": self.model_path.exists(),
            "device": "cpu",
        }

    def close(self):
        """
        Release YOLO resources.
        """

        self.model = None
        self.initialized = False