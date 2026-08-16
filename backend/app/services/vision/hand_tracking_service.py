from pathlib import Path

import cv2
import mediapipe as mp

from mediapipe.tasks import python
from mediapipe.tasks.python import vision


class HandTrackingService:
    """
    MediaPipe Hand Landmarker service.

    Detects up to two hands and their 21 landmarks.
    """

    def __init__(self):
        self.initialized = False
        self.landmarker = None

        self.model_path = (
            Path(__file__).resolve().parents[3]
            / "models"
            / "hand_landmarker.task"
        )

    def initialize(self):
        """
        Initialize MediaPipe Hand Landmarker.
        """

        if self.initialized:
            return {
                "status": "success",
                "message": "MediaPipe hand tracking already initialized",
            }

        if not self.model_path.exists():
            raise FileNotFoundError(
                f"Hand landmark model not found: {self.model_path}"
            )

        base_options = python.BaseOptions(
            model_asset_path=str(self.model_path)
        )

        options = vision.HandLandmarkerOptions(
            base_options=base_options,
            running_mode=vision.RunningMode.VIDEO,
            num_hands=2,
            min_hand_detection_confidence=0.5,
            min_hand_presence_confidence=0.5,
            min_tracking_confidence=0.5,
        )

        self.landmarker = vision.HandLandmarker.create_from_options(
            options
        )

        self.initialized = True

        return {
            "status": "success",
            "message": "MediaPipe Hand Landmarker initialized",
            "model": "hand_landmarker.task",
            "max_hands": 2,
        }

    def process_frame(self, frame, timestamp_ms):
        """
        Process an OpenCV BGR frame.
        """

        if not self.initialized:
            self.initialize()

        if frame is None:
            raise ValueError("Invalid frame received")

        rgb_frame = cv2.cvtColor(
            frame,
            cv2.COLOR_BGR2RGB
        )

        mp_image = mp.Image(
            image_format=mp.ImageFormat.SRGB,
            data=rgb_frame
        )

        result = self.landmarker.detect_for_video(
            mp_image,
            timestamp_ms
        )

        hands_detected = len(result.hand_landmarks)

        return frame, {
            "hands_detected": hands_detected,
            "landmarks": result.hand_landmarks,
        }

    def get_status(self):
        """
        Return current hand tracking status.
        """

        return {
            "service": "hand_tracking",
            "mediapipe": "available",
            "initialized": self.initialized,
            "max_hands": 2,
            "model_loaded": self.model_path.exists(),
        }

    def close(self):
        """
        Release MediaPipe resources.
        """

        if self.landmarker:
            self.landmarker.close()
            self.landmarker = None

        self.initialized = False