import { detectGesture } from "../utils/gestureEngine";

export const processHandLandmarks = (landmarks) => {
  if (!landmarks || landmarks.length === 0) {
    return {
      gesture: "UNKNOWN",
      confidence: 0,
    };
  }

  return detectGesture(landmarks);
};