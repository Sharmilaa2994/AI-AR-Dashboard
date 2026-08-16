function distance(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = (a.z || 0) - (b.z || 0);

  return Math.sqrt(
    dx * dx +
    dy * dy +
    dz * dz
  );
}

function isFingerExtended(
  landmarks,
  tipIndex,
  pipIndex
) {
  const tip = landmarks[tipIndex];
  const pip = landmarks[pipIndex];

  return tip.y < pip.y;
}

export function recognizeGesture(
  landmarks
) {
  if (!landmarks || landmarks.length < 21) {
    return {
      gesture: "UNKNOWN",
      confidence: 0,
    };
  }

  const indexExtended =
    isFingerExtended(
      landmarks,
      8,
      6
    );

  const middleExtended =
    isFingerExtended(
      landmarks,
      12,
      10
    );

  const ringExtended =
    isFingerExtended(
      landmarks,
      16,
      14
    );

  const pinkyExtended =
    isFingerExtended(
      landmarks,
      20,
      18
    );

  const thumbIndexDistance =
    distance(
      landmarks[4],
      landmarks[8]
    );

  /*
   * PINCH
   */

  if (thumbIndexDistance < 0.08) {
    return {
      gesture: "PINCH",
      confidence: 0.95,
    };
  }

  /*
   * OPEN PALM
   */

  if (
    indexExtended &&
    middleExtended &&
    ringExtended &&
    pinkyExtended
  ) {
    return {
      gesture: "OPEN_PALM",
      confidence: 0.95,
    };
  }

  /*
   * POINT
   */

  if (
    indexExtended &&
    !middleExtended &&
    !ringExtended &&
    !pinkyExtended
  ) {
    return {
      gesture: "POINT",
      confidence: 0.90,
    };
  }

  /*
   * TWO FINGER
   */

  if (
    indexExtended &&
    middleExtended &&
    !ringExtended &&
    !pinkyExtended
  ) {
    return {
      gesture: "TWO_FINGER",
      confidence: 0.90,
    };
  }

  /*
   * FIST
   */

  if (
    !indexExtended &&
    !middleExtended &&
    !ringExtended &&
    !pinkyExtended
  ) {
    return {
      gesture: "FIST",
      confidence: 0.90,
    };
  }

  return {
    gesture: "UNKNOWN",
    confidence: 0.30,
  };
}