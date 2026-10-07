import {
  FilesetResolver,
  HandLandmarker,
} from "@mediapipe/tasks-vision";


// ============================================================
// MEDIAPIPE HAND TRACKING
// ============================================================

let handLandmarker = null;
let initializationPromise = null;


// ============================================================
// CONFIGURATION
// ============================================================

const MEDIAPIPE_VERSION = "1.0.1";

const WASM_PATH =
  `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MEDIAPIPE_VERSION}/wasm`;

const HAND_MODEL_PATH =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";


// ============================================================
// INITIALIZE HAND TRACKING
// ============================================================

export async function initializeHandTracking() {

  // Already initialized
  if (handLandmarker) {
    console.log(
      "[HAND TRACKING] Already initialized"
    );

    return handLandmarker;
  }


  // Prevent multiple simultaneous initializations
  if (initializationPromise) {
    console.log(
      "[HAND TRACKING] Initialization already in progress..."
    );

    return initializationPromise;
  }


  initializationPromise = (async () => {

    try {

      console.log(
        "=================================================="
      );

      console.log(
        "[HAND TRACKING] Initializing MediaPipe..."
      );

      console.log(
        "[HAND TRACKING] Package version:",
        MEDIAPIPE_VERSION
      );

      console.log(
        "[HAND TRACKING] WASM:",
        WASM_PATH
      );

      console.log(
        "[HAND TRACKING] Model:",
        HAND_MODEL_PATH
      );


      // --------------------------------------------------------
      // LOAD WASM FILES
      // --------------------------------------------------------

      const vision =
        await FilesetResolver.forVisionTasks(
          WASM_PATH
        );


      console.log(
        "[HAND TRACKING] WASM loaded successfully"
      );


      // --------------------------------------------------------
      // CREATE HAND LANDMARKER
      // --------------------------------------------------------

      handLandmarker =
        await HandLandmarker.createFromOptions(
          vision,
          {
            baseOptions: {
              modelAssetPath:
                HAND_MODEL_PATH,

              // Start with CPU for maximum browser compatibility.
              // Once tracking works, GPU can be tested later.
              delegate: "CPU",
            },

            runningMode: "VIDEO",

            numHands: 2,

            minHandDetectionConfidence: 0.5,

            minHandPresenceConfidence: 0.5,

            minTrackingConfidence: 0.5,
          }
        );


      console.log(
        "[HAND TRACKING] HandLandmarker created successfully"
      );

      console.log(
        "[HAND TRACKING] READY"
      );

      console.log(
        "=================================================="
      );


      return handLandmarker;

    } catch (error) {

      console.error(
        "=================================================="
      );

      console.error(
        "[HAND TRACKING] INITIALIZATION FAILED"
      );

      console.error(
        "Error:",
        error
      );

      console.error(
        "Message:",
        error?.message
      );

      console.error(
        "Stack:",
        error?.stack
      );

      console.error(
        "=================================================="
      );


      // Important:
      // If initialization failed, allow another attempt.
      handLandmarker = null;

      throw error;

    } finally {

      initializationPromise = null;

    }

  })();


  return initializationPromise;
}


// ============================================================
// DETECT HANDS
// ============================================================

export function detectHands(
  video,
  timestamp
) {

  if (!handLandmarker) {

    console.warn(
      "[HAND TRACKING] detectHands() called before initialization"
    );

    return null;
  }


  if (!video) {
    return null;
  }


  if (
    video.readyState < 2 ||
    video.videoWidth <= 0 ||
    video.videoHeight <= 0
  ) {
    return null;
  }


  try {

    return handLandmarker.detectForVideo(
      video,
      timestamp
    );

  } catch (error) {

    console.error(
      "[HAND TRACKING] Frame detection error:",
      error
    );

    return null;
  }
}


// ============================================================
// READY STATUS
// ============================================================

export function isHandTrackingReady() {

  return handLandmarker !== null;
}


// ============================================================
// RESET
// ============================================================

export function resetHandTracking() {

  try {

    if (handLandmarker) {

      handLandmarker.close();

      console.log(
        "[HAND TRACKING] HandLandmarker closed"
      );
    }

  } catch (error) {

    console.warn(
      "[HAND TRACKING] Error while closing:",
      error
    );

  } finally {

    handLandmarker = null;

    initializationPromise = null;

  }
}