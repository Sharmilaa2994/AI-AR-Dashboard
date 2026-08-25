// ============================================================
// GESTURE ENGINE
// ============================================================
// Supported gestures:
//
// POINT       -> Index finger extended
// PINCH       -> Thumb + index finger touching
// FIST        -> Fingers folded
// OPEN_PALM   -> All fingers extended
// TWO_FINGER  -> Index + middle extended
// UNKNOWN     -> No reliable gesture
//
// MediaPipe hand landmarks:
//
// 0  = wrist
// 1  = thumb CMC
// 2  = thumb MCP
// 3  = thumb IP
// 4  = thumb tip
//
// 5  = index MCP
// 6  = index PIP
// 7  = index DIP
// 8  = index tip
//
// 9  = middle MCP
// 10 = middle PIP
// 11 = middle DIP
// 12 = middle tip
//
// 13 = ring MCP
// 14 = ring PIP
// 15 = ring DIP
// 16 = ring tip
//
// 17 = pinky MCP
// 18 = pinky PIP
// 19 = pinky DIP
// 20 = pinky tip
// ============================================================


// ============================================================
// DISTANCE
// ============================================================

function distance(a, b) {

  if (!a || !b) {
    return Infinity;
  }

  const dx =
    a.x - b.x;

  const dy =
    a.y - b.y;

  const dz =
    (a.z || 0) -
    (b.z || 0);

  return Math.sqrt(
    dx * dx +
    dy * dy +
    dz * dz
  );
}


// ============================================================
// REQUIRED LANDMARK VALIDATION
// ============================================================

function validLandmarks(landmarks) {

  return (
    Array.isArray(landmarks) &&
    landmarks.length >= 21
  );
}


// ============================================================
// FINGER EXTENSION
// ============================================================
//
// We compare the fingertip distance from the wrist against
// the PIP joint distance from the wrist.
//
// This works better across different hand sizes than using
// a fixed pixel distance.
//
// ============================================================

function isFingerExtended(
  landmarks,
  tipIndex,
  pipIndex,
  mcpIndex
) {

  const wrist =
    landmarks[0];

  const tip =
    landmarks[tipIndex];

  const pip =
    landmarks[pipIndex];

  const mcp =
    landmarks[mcpIndex];

  if (
    !wrist ||
    !tip ||
    !pip ||
    !mcp
  ) {
    return false;
  }

  const tipDistance =
    distance(
      wrist,
      tip
    );

  const pipDistance =
    distance(
      wrist,
      pip
    );

  const mcpDistance =
    distance(
      wrist,
      mcp
    );

  return (
    tipDistance >
    pipDistance * 1.10 &&
    tipDistance >
    mcpDistance * 1.25
  );
}


// ============================================================
// THUMB EXTENSION
// ============================================================

function isThumbExtended(landmarks) {

  const wrist =
    landmarks[0];

  const thumbTip =
    landmarks[4];

  const thumbIp =
    landmarks[3];

  const thumbMcp =
    landmarks[2];

  if (
    !wrist ||
    !thumbTip ||
    !thumbIp ||
    !thumbMcp
  ) {
    return false;
  }

  const tipDistance =
    distance(
      wrist,
      thumbTip
    );

  const ipDistance =
    distance(
      wrist,
      thumbIp
    );

  const mcpDistance =
    distance(
      wrist,
      thumbMcp
    );

  return (
    tipDistance >
    ipDistance * 1.08 &&
    tipDistance >
    mcpDistance * 1.20
  );
}


// ============================================================
// FINGER STATES
// ============================================================

function getFingerStates(landmarks) {

  return {

    thumb:
      isThumbExtended(
        landmarks
      ),

    index:
      isFingerExtended(
        landmarks,
        8,
        6,
        5
      ),

    middle:
      isFingerExtended(
        landmarks,
        12,
        10,
        9
      ),

    ring:
      isFingerExtended(
        landmarks,
        16,
        14,
        13
      ),

    pinky:
      isFingerExtended(
        landmarks,
        20,
        18,
        17
      ),

  };
}


// ============================================================
// PINCH DETECTION
// ============================================================
//
// Thumb tip = 4
// Index tip = 8
//
// Normalized MediaPipe coordinates make a threshold around
// 0.08-0.10 useful for most webcam distances.
//
// ============================================================

function isPinching(landmarks) {

  const thumbTip =
    landmarks[4];

  const indexTip =
    landmarks[8];

  if (
    !thumbTip ||
    !indexTip
  ) {
    return false;
  }

  const pinchDistance =
    distance(
      thumbTip,
      indexTip
    );

  return pinchDistance < 0.085;
}


// ============================================================
// FIST DETECTION
// ============================================================

function isFist(states) {

  return (
    !states.index &&
    !states.middle &&
    !states.ring &&
    !states.pinky &&
    !states.thumb
  );
}


// ============================================================
// OPEN PALM DETECTION
// ============================================================

function isOpenPalm(states) {

  return (
    states.index &&
    states.middle &&
    states.ring &&
    states.pinky &&
    states.thumb
  );
}


// ============================================================
// TWO FINGER DETECTION
// ============================================================
//
// Index + middle = extended
// Ring + pinky = folded
//
// Thumb can be either state because different hand positions
// may cause the thumb to appear extended.
//
// ============================================================

function isTwoFinger(states) {

  return (
    states.index &&
    states.middle &&
    !states.ring &&
    !states.pinky
  );
}


// ============================================================
// POINT DETECTION
// ============================================================

function isPoint(states) {

  return (
    states.index &&
    !states.middle &&
    !states.ring &&
    !states.pinky
  );
}


// ============================================================
// CONFIDENCE
// ============================================================

function calculateConfidence(
  gesture,
  states,
  landmarks
) {

  if (!validLandmarks(landmarks)) {
    return 0;
  }

  let confidence = 0.70;

  switch (gesture) {

    case "PINCH": {

      const d =
        distance(
          landmarks[4],
          landmarks[8]
        );

      if (d < 0.045) {
        confidence = 0.98;
      } else if (d < 0.065) {
        confidence = 0.92;
      } else if (d < 0.085) {
        confidence = 0.85;
      }

      break;
    }


    case "OPEN_PALM":

      confidence =
        states.index &&
        states.middle &&
        states.ring &&
        states.pinky &&
        states.thumb
          ? 0.95
          : 0.75;

      break;


    case "FIST":

      confidence =
        !states.index &&
        !states.middle &&
        !states.ring &&
        !states.pinky
          ? 0.94
          : 0.75;

      break;


    case "TWO_FINGER":

      confidence =
        states.index &&
        states.middle &&
        !states.ring &&
        !states.pinky
          ? 0.93
          : 0.75;

      break;


    case "POINT":

      confidence =
        states.index &&
        !states.middle &&
        !states.ring &&
        !states.pinky
          ? 0.94
          : 0.75;

      break;


    default:

      confidence = 0.20;

      break;
  }

  return Math.max(
    0,
    Math.min(
      1,
      confidence
    )
  );
}


// ============================================================
// MAIN GESTURE RECOGNIZER
// ============================================================

export function recognizeGesture(
  landmarks
) {

  if (
    !validLandmarks(
      landmarks
    )
  ) {

    return {
      gesture: "UNKNOWN",
      confidence: 0,
    };
  }


  const states =
    getFingerStates(
      landmarks
    );


  // ==========================================================
  // PRIORITY 1
  // PINCH
  // ==========================================================
  //
  // Pinch must be checked before POINT because a pinch can
  // sometimes leave the index finger partially extended.
  //

  if (
    isPinching(
      landmarks
    )
  ) {

    return {
      gesture: "PINCH",

      confidence:
        calculateConfidence(
          "PINCH",
          states,
          landmarks
        ),

      fingers: states,
    };
  }


  // ==========================================================
  // PRIORITY 2
  // OPEN PALM
  // ==========================================================

  if (
    isOpenPalm(
      states
    )
  ) {

    return {
      gesture: "OPEN_PALM",

      confidence:
        calculateConfidence(
          "OPEN_PALM",
          states,
          landmarks
        ),

      fingers: states,
    };
  }


  // ==========================================================
  // PRIORITY 3
  // FIST
  // ==========================================================

  if (
    isFist(
      states
    )
  ) {

    return {
      gesture: "FIST",

      confidence:
        calculateConfidence(
          "FIST",
          states,
          landmarks
        ),

      fingers: states,
    };
  }


  // ==========================================================
  // PRIORITY 4
  // TWO FINGER
  // ==========================================================

  if (
    isTwoFinger(
      states
    )
  ) {

    return {
      gesture: "TWO_FINGER",

      confidence:
        calculateConfidence(
          "TWO_FINGER",
          states,
          landmarks
        ),

      fingers: states,
    };
  }


  // ==========================================================
  // PRIORITY 5
  // POINT
  // ==========================================================

  if (
    isPoint(
      states
    )
  ) {

    return {
      gesture: "POINT",

      confidence:
        calculateConfidence(
          "POINT",
          states,
          landmarks
        ),

      fingers: states,
    };
  }


  // ==========================================================
  // UNKNOWN
  // ==========================================================

  return {
    gesture: "UNKNOWN",
    confidence: 0.25,
    fingers: states,
  };
}


// ============================================================
// OPTIONAL DEBUG HELPER
// ============================================================

export function getFingerState(
  landmarks
) {

  if (
    !validLandmarks(
      landmarks
    )
  ) {
    return null;
  }

  return getFingerStates(
    landmarks
  );
}