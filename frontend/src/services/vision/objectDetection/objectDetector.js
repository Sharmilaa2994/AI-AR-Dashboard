// ============================================================
// OBJECT DETECTION SERVICE
// ============================================================
//
// Responsible for:
// 1. Initializing object detection
// 2. Processing camera frames
// 3. Returning detected objects
// 4. Providing a clean interface for AR overlays
//
// Current stage:
// Detection pipeline preparation
// ============================================================

let initialized = false;


// ============================================================
// INITIALIZE
// ============================================================

export async function initializeObjectDetection() {

  if (initialized) {
    return {
      status: "ready",
      message: "Object detection already initialized",
    };
  }

  try {

    console.log(
      "Initializing object detection..."
    );

    // Object detection model will be connected
    // in the next stage.

    initialized = true;

    console.log(
      "Object detection service initialized"
    );

    return {
      status: "ready",
      message: "Object detection service initialized",
    };

  } catch (error) {

    console.error(
      "Object detection initialization failed:",
      error
    );

    initialized = false;

    throw error;
  }
}


// ============================================================
// DETECT OBJECTS
// ============================================================

export async function detectObjects(
  videoElement
) {

  if (!initialized) {

    return {
      objects: [],
      status: "not_initialized",
    };
  }

  if (!videoElement) {

    return {
      objects: [],
      status: "invalid_video",
    };
  }


  // ----------------------------------------------------------
  // Temporary response
  // ----------------------------------------------------------
  //
  // The actual computer-vision model will be connected next.
  //

  return {
    objects: [],
    status: "ready",
    timestamp: performance.now(),
  };
}


// ============================================================
// RESET
// ============================================================

export function resetObjectDetection() {

  initialized = false;

  console.log(
    "Object detection service reset"
  );
}


// ============================================================
// STATUS
// ============================================================

export function isObjectDetectionReady() {

  return initialized;
}