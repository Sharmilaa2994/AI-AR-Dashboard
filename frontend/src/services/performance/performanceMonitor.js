
// ============================================================
// REAL-TIME PERFORMANCE MONITOR
// ============================================================

const MAX_HISTORY = 20;

const performanceState = {
  processing: 0,
  gestureEvents: 0,
  cursorEvents: 0,
  widgetEvents: 0,
  fps: 0,
  latency: 0,

  history: [],
  listeners: new Set(),

  frameCount: 0,
  lastFrameTime: performance.now(),
};


// ============================================================
// INTERNAL NOTIFY
// ============================================================

const notifyListeners = () => {
  const snapshot = {
    processing: performanceState.processing,
    gestureEvents: performanceState.gestureEvents,
    cursorEvents: performanceState.cursorEvents,
    widgetEvents: performanceState.widgetEvents,
    fps: performanceState.fps,
    latency: performanceState.latency,
    history: [...performanceState.history],
  };

  performanceState.listeners.forEach((listener) => {
    try {
      listener(snapshot);
    } catch (error) {
      console.error(
        "Performance listener error:",
        error
      );
    }
  });
};


// ============================================================
// RECORD PERFORMANCE SAMPLE
// ============================================================

const recordSample = (value) => {

  const numericValue =
    Number(value);

  if (!Number.isFinite(numericValue)) {
    return;
  }

  performanceState.history.push(
    numericValue
  );

  if (
    performanceState.history.length >
    MAX_HISTORY
  ) {
    performanceState.history.shift();
  }

  performanceState.processing =
    Math.round(numericValue);

  notifyListeners();
};


// ============================================================
// RECORD FRAME
// ============================================================

export const recordFrame = (
  processingTime = 0
) => {

  performanceState.frameCount += 1;

  const now =
    performance.now();

  const elapsed =
    now -
    performanceState.lastFrameTime;

  if (elapsed >= 1000) {

    performanceState.fps =
      Math.round(
        (
          performanceState.frameCount /
          elapsed
        ) * 1000
      );

    performanceState.frameCount = 0;

    performanceState.lastFrameTime =
      now;
  }


  const frameProcessingTime =
  Math.round(
    Number(processingTime) || 0
  );

performanceState.latency =
  frameProcessingTime;


performanceState.history.push(
  frameProcessingTime
);


if (
  performanceState.history.length >
  MAX_HISTORY
) {

  performanceState.history.shift();

}


performanceState.processing =
  frameProcessingTime;


notifyListeners();
};


// ============================================================
// RECORD GESTURE
// ============================================================

export const recordGesture = (
  gesture
) => {

  if (!gesture || gesture === "UNKNOWN") {
    return;
  }

  performanceState.gestureEvents += 1;

  notifyListeners();
};


// ============================================================
// RECORD CURSOR MOVEMENT
// ============================================================

export const recordCursorEvent = () => {

  performanceState.cursorEvents += 1;

  notifyListeners();
};


// ============================================================
// RECORD WIDGET INTERACTION
// ============================================================

export const recordWidgetEvent = (
  widgetId,
  action = "interaction"
) => {

  if (!widgetId) {
    return;
  }

  performanceState.widgetEvents += 1;

  console.log(
    "Performance Monitor:",
    widgetId,
    action
  );

  notifyListeners();
};


// ============================================================
// UPDATE PERFORMANCE VALUE
// ============================================================

export const updatePerformance = (
  value
) => {

  recordSample(value);
};


// ============================================================
// SUBSCRIBE
// ============================================================

export const subscribePerformance = (
  listener
) => {

  if (
    typeof listener !==
    "function"
  ) {
    return () => {};
  }

  performanceState.listeners.add(
    listener
  );

  // Send current state immediately
  listener({
    processing:
      performanceState.processing,

    gestureEvents:
      performanceState.gestureEvents,

    cursorEvents:
      performanceState.cursorEvents,

    widgetEvents:
      performanceState.widgetEvents,

    fps:
      performanceState.fps,

    latency:
      performanceState.latency,

    history:
      [...performanceState.history],
  });


  return () => {

    performanceState.listeners.delete(
      listener
    );

  };
};


// ============================================================
// GET CURRENT PERFORMANCE
// ============================================================

export const getPerformance = () => {

  return {
    processing:
      performanceState.processing,

    gestureEvents:
      performanceState.gestureEvents,

    cursorEvents:
      performanceState.cursorEvents,

    widgetEvents:
      performanceState.widgetEvents,

    fps:
      performanceState.fps,

    latency:
      performanceState.latency,

    history:
      [...performanceState.history],
  };
};


// ============================================================
// RESET
// ============================================================

export const resetPerformance = () => {

  performanceState.processing = 0;

  performanceState.gestureEvents = 0;

  performanceState.cursorEvents = 0;

  performanceState.widgetEvents = 0;

  performanceState.fps = 0;

  performanceState.latency = 0;

  performanceState.history = [];

  performanceState.frameCount = 0;

  performanceState.lastFrameTime =
    performance.now();

  notifyListeners();
};
