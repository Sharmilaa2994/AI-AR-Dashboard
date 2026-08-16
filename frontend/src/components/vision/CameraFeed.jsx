import { useEffect, useRef, useState } from "react";

import {
  detectHands,
  initializeHandTracking,
} from "../../services/vision/handTracking";
import {
  recognizeGesture,
} from "../../services/vision/gestureEngine";
import {
  createInteractionEvent,
  getActionDescription,
} from "../../services/interaction/interactionController";

function CameraFeed() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const animationFrameRef = useRef(null);

  const [cameraStatus, setCameraStatus] =
    useState("Connecting...");

  const [trackingStatus, setTrackingStatus] =
    useState("Initializing...");
  
  const [debugMessage, setDebugMessage] =
    useState("Starting...");

  const [gesture, setGesture] =
    useState("UNKNOWN");
  
  const [interactionAction, setInteractionAction] =
    useState("NONE");

  const [interactionDescription, setInteractionDescription] =
    useState("No interaction");

  const [pointer, setPointer] = useState({
  x: 0,
  y: 0,
  visible: false,
});

  useEffect(() => {
    let stream;
    let mounted = true;

    const startCamera = async () => {
  try {
    setDebugMessage("Requesting camera...");

    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: "user",
      },
      audio: false,
    });

    setDebugMessage("Camera stream received");

    if (!mounted) return;

    if (!videoRef.current) {
      throw new Error("Video element is not available");
    }

    videoRef.current.srcObject = stream;

    setCameraStatus("Camera Connected");
    setDebugMessage("Waiting for video...");

    await new Promise((resolve) => {
      if (videoRef.current.readyState >= 2) {
        resolve();
      } else {
        videoRef.current.onloadeddata = resolve;
      }
    });

    setDebugMessage("Video ready");

    await videoRef.current.play();

    setDebugMessage("Video playing");

    setTrackingStatus("Initializing Hand Tracking...");
    setDebugMessage("Loading MediaPipe...");

    await initializeHandTracking();

    setTrackingStatus("Hand Tracking Active");
    setDebugMessage("MediaPipe initialized successfully");

    processFrame();

  } catch (error) {
    console.error("HAND TRACKING STARTUP ERROR:", error);

    console.error("Message:", error?.message);
    console.error("Stack:", error?.stack);

    setTrackingStatus("Hand Tracking Error");

    setDebugMessage(
      `ERROR: ${error?.message || "Unknown error"}`
    );
  }
};

   const processFrame = () => {
  try {
    if (!videoRef.current) return;

    if (videoRef.current.readyState >= 2) {
      const timestamp = performance.now();

      const result = detectHands(
        videoRef.current,
        timestamp
      );

      if (result) {
        drawLandmarks(result);
      }
    }
  } catch (error) {
    setDebugMessage("Error processing frame");
    console.error(
      "========== FRAME PROCESSING ERROR =========="
    );

    console.error("Error object:", error);

    console.error(
      "Error message:",
      error?.message
    );

    console.error(
      "Error stack:",
      error?.stack
    );

    console.error(
      "============================================"
    );
  }

  animationFrameRef.current =
    requestAnimationFrame(processFrame);
};

    const drawLandmarks = (result) => {
      const canvas =
        canvasRef.current;

      const video =
        videoRef.current;

      if (!canvas || !video) return;

      const ctx =
        canvas.getContext("2d");

      canvas.width =
        video.videoWidth;

      canvas.height =
        video.videoHeight;

      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      if (
        !result ||
        !result.landmarks
      ) {
        return;
      }

      result.landmarks.forEach(
        (landmarks) => {
          const gestureResult =
  recognizeGesture(landmarks);

const interaction =
  createInteractionEvent(
    gestureResult.gesture,
    landmarks
  );

setGesture(
  gestureResult.gesture
);

setInteractionAction(
  interaction.action
);

setInteractionDescription(
  getActionDescription(
    interaction.action
  )
);

// ---------------------------------------
// VIRTUAL POINTER
// ---------------------------------------

const indexTip = landmarks[8];

if (
  indexTip &&
  (
    gestureResult.gesture === "POINT" ||
    gestureResult.gesture === "PINCH"
  )
) {
  setPointer({
    x: indexTip.x * canvas.width,
    y: indexTip.y * canvas.height,
    visible: true,
  });
} else {
  setPointer((previous) => ({
    ...previous,
    visible: false,
  }));
}
// ---------------------------------------
// DRAW VIRTUAL POINTER
// ---------------------------------------

if (pointer.visible) {
  ctx.beginPath();

  ctx.arc(
    pointer.x,
    pointer.y,
    14,
    0,
    Math.PI * 2
  );

  ctx.fillStyle =
    gesture === "PINCH"
      ? "#a855f7"
      : "#22d3ee";

  ctx.fill();

  ctx.beginPath();

  ctx.arc(
    pointer.x,
    pointer.y,
    24,
    0,
    Math.PI * 2
  );

  ctx.strokeStyle =
    gesture === "PINCH"
      ? "#c084fc"
      : "#67e8f9";

  ctx.lineWidth = 2;

  ctx.stroke();
}

          landmarks.forEach(
            (landmark) => {
              const x =
                landmark.x *
                canvas.width;

              const y =
                landmark.y *
                canvas.height;

              ctx.beginPath();

              ctx.arc(
                x,
                y,
                5,
                0,
                Math.PI * 2
              );

              ctx.fillStyle =
                "#22d3ee";

              ctx.fill();
            }
          );

          drawConnections(
            ctx,
            landmarks,
            canvas.width,
            canvas.height
          );
        }
      );
    };

    const drawConnections = (
      ctx,
      landmarks,
      width,
      height
    ) => {
      const connections = [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4],

        [0, 5],
        [5, 6],
        [6, 7],
        [7, 8],

        [5, 9],
        [9, 10],
        [10, 11],
        [11, 12],

        [9, 13],
        [13, 14],
        [14, 15],
        [15, 16],

        [13, 17],
        [17, 18],
        [18, 19],
        [19, 20],

        [0, 17],
      ];

      connections.forEach(
        ([start, end]) => {
          const a =
            landmarks[start];

          const b =
            landmarks[end];

          ctx.beginPath();

          ctx.moveTo(
            a.x * width,
            a.y * height
          );

          ctx.lineTo(
            b.x * width,
            b.y * height
          );

          ctx.strokeStyle =
            "#22d3ee";

          ctx.lineWidth = 3;

          ctx.stroke();
        }
      );
    };

    startCamera();

    return () => {
      mounted = false;

      if (
        animationFrameRef.current
      ) {
        cancelAnimationFrame(
          animationFrameRef.current
        );
      }

      if (stream) {
        stream
          .getTracks()
          .forEach(
            (track) =>
              track.stop()
          );
      }
    };
  }, []);

  return (
    <div className="relative min-h-[500px] w-full overflow-hidden rounded-2xl bg-black">

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 h-full w-full object-cover"
      />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
      />

      <div className="absolute left-5 top-5 flex flex-col gap-2">

        <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/80 px-4 py-2 text-xs backdrop-blur">

          <span className="h-2 w-2 rounded-full bg-emerald-400" />

          {cameraStatus}

        </div>

        <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/80 px-4 py-2 text-xs backdrop-blur">

          <span className="h-2 w-2 rounded-full bg-cyan-400" />

          {trackingStatus}

        </div>
        <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/80 px-4 py-2 text-xs backdrop-blur">


  <span className="h-2 w-2 rounded-full bg-purple-400" />

  Gesture: {gesture}

</div>
<div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/80 px-4 py-2 text-xs backdrop-blur">

  <span className="h-2 w-2 rounded-full bg-purple-400" />

  Action: {interactionAction}

</div>
<div className="rounded-lg border border-slate-700 bg-slate-950/80 px-4 py-2 text-xs text-slate-300 backdrop-blur">

  {interactionDescription}

</div>
<div className="rounded-lg border border-yellow-500/30 bg-slate-950/80 px-3 py-2 text-xs text-yellow-300">
  Debug: {debugMessage}
</div>

      </div>

      {pointer.visible && (
        <div
          className="pointer-events-none absolute h-4 w-4 rounded-full bg-cyan-500 shadow-lg"
          style={{
            left: pointer.x - 8,
            top: pointer.y - 8,
          }}
        />
      )}

    </div>
  );
}

export default CameraFeed;