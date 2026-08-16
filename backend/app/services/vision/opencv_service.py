import cv2


class OpenCVService:
    """
    Base computer vision service.

    Responsible for basic image processing.
    This service will later be extended with:
    - MediaPipe hand tracking
    - Gesture recognition
    - YOLO object detection
    """

    def __init__(self):
        self.initialized = False

    def initialize(self):
        """Initialize the OpenCV processing pipeline."""

        self.initialized = True

        return {
            "status": "success",
            "message": "OpenCV vision service initialized",
        }

    def process_frame(self, frame):
        """
        Perform basic OpenCV processing on a frame.

        Args:
            frame: OpenCV image.

        Returns:
            Processed image.
        """

        if frame is None:
            raise ValueError("Invalid frame received")

        # Flip the frame horizontally.
        processed_frame = cv2.flip(frame, 1)

        return processed_frame

    def get_status(self):
        """Return the current vision service status."""

        return {
            "status": "online",
            "service": "computer_vision",
            "opencv": "available",
            "initialized": self.initialized,
        }