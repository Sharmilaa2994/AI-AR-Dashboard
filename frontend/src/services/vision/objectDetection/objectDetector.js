import {
  FilesetResolver,
  ObjectDetector,
} from "@mediapipe/tasks-vision";

let objectDetector = null;


// ============================================================
// INITIALIZE
// ============================================================

export async function initializeObjectDetection() {

  if (objectDetector) {
    return {
      status: "ready",
      message: "Object detection already initialized",
    };
  }

  try {

    console.log(
      "Initializing object detection..."
    );

    const vision =
      await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm"
      );


    objectDetector =
      await ObjectDetector.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/float32/1/efficientdet_lite0.tflite",
          },

          runningMode: "VIDEO",

          maxResults: 5,

          scoreThreshold: 0.4,
        }
      );


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

    objectDetector =
      null;

    throw error;
  }
}


// ============================================================
// DETECT OBJECTS
// ============================================================

export function detectObjects(
  videoElement,
  timestamp
) {

  if (!objectDetector) {

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


  if (
    videoElement.readyState < 2 ||
    videoElement.videoWidth <= 0 ||
    videoElement.videoHeight <= 0
  ) {

    return {
      objects: [],
      status: "video_not_ready",
    };
  }


  try {

    const result =
      objectDetector.detectForVideo(
        videoElement,
        timestamp
      );


    const detections =
      result?.detections || [];


    const objects =
      detections.map(
        (detection) => {

          const category =
            detection.categories?.[0];

          const boundingBox =
            detection.boundingBox;


          return {
            label:
              category?.categoryName ||
              "unknown",

            confidence:
              Number(
                category?.score
              ) || 0,

            boundingBox: boundingBox
              ? {
                  originX:
                    boundingBox.originX,

                  originY:
                    boundingBox.originY,

                  width:
                    boundingBox.width,

                  height:
                    boundingBox.height,
                }
              : null,
          };
        }
      );


    return {
      objects,
      status: "ready",
      timestamp,
    };

  } catch (error) {

    console.error(
      "Object detection failed:",
      error
    );


    return {
      objects: [],
      status: "error",
      error:
        error?.message ||
        "Object detection failed",
    };
  }
}


// ============================================================
// RESET
// ============================================================

export function resetObjectDetection() {

  if (objectDetector) {

    objectDetector.close();

    objectDetector =
      null;
  }


  console.log(
    "Object detection service reset"
  );
}


// ============================================================
// STATUS
// ============================================================

export function isObjectDetectionReady() {

  return objectDetector !== null;
}