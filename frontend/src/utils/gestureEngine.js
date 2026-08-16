/**
 * Gesture Engine
 * Converts MediaPipe hand landmarks into high-level gestures.
 *
 * Supported gestures:
 * - POINT
 * - PINCH
 * - OPEN_PALM
 * - FIST
 * - UNKNOWN
 */

const distance = (a, b) => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = (a.z || 0) - (b.z || 0);

  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

const isFingerExtended = (landmarks, tipIndex, pipIndex) => {
  return landmarks[tipIndex].y < landmarks[pipIndex].y;
};

export const detectGesture = (landmarks) => {
  if (!landmarks || landmarks.length < 21) {
    return {
      gesture: "UNKNOWN",
      confidence: 0,
    };
  }

  // MediaPipe landmark indexes
  const WRIST = 0;

  const THUMB_TIP = 4;

  const INDEX_TIP = 8;
  const INDEX_PIP = 6;

  const MIDDLE_TIP = 12;
  const MIDDLE_PIP = 10;

  const RING_TIP = 16;
  const RING_PIP = 14;

  const PINKY_TIP = 20;
  const PINKY_PIP = 18;

  // Check whether fingers are extended
  const indexExtended = isFingerExtended(
    landmarks,
    INDEX_TIP,
    INDEX_PIP
  );

  const middleExtended = isFingerExtended(
    landmarks,
    MIDDLE_TIP,
    MIDDLE_PIP
  );

  const ringExtended = isFingerExtended(
    landmarks,
    RING_TIP,
    RING_PIP
  );

  const pinkyExtended = isFingerExtended(
    landmarks,
    PINKY_TIP,
    PINKY_PIP
  );

  // ---------------------------------------
  // PINCH DETECTION
  // ---------------------------------------

  const thumbIndexDistance = distance(
    landmarks[THUMB_TIP],
    landmarks[INDEX_TIP]
  );

  if (thumbIndexDistance < 0.06) {
    return {
      gesture: "PINCH",
      confidence: 0.95,
      pointer: {
        x: landmarks[INDEX_TIP].x,
        y: landmarks[INDEX_TIP].y,
      },
    };
  }

  // ---------------------------------------
  // POINT DETECTION
  // ---------------------------------------

  if (
    indexExtended &&
    !middleExtended &&
    !ringExtended &&
    !pinkyExtended
  ) {
    return {
      gesture: "POINT",
      confidence: 0.90,
      pointer: {
        x: landmarks[INDEX_TIP].x,
        y: landmarks[INDEX_TIP].y,
      },
    };
  }

  // ---------------------------------------
  // OPEN PALM
  // ---------------------------------------

  if (
    indexExtended &&
    middleExtended &&
    ringExtended &&
    pinkyExtended
  ) {
    return {
      gesture: "OPEN_PALM",
      confidence: 0.90,
    };
  }

  // ---------------------------------------
  // FIST
  // ---------------------------------------

  if (
    !indexExtended &&
    !middleExtended &&
    !ringExtended &&
    !pinkyExtended
  ) {
    return {
      gesture: "FIST",
      confidence: 0.85,
    };
  }

  return {
    gesture: "UNKNOWN",
    confidence: 0.50,
  };
};