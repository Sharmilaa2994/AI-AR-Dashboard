
import {
  useEffect,
  useRef,
  useState,
} from "react";

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


function CameraFeed({
  onCursorUpdate,
}) {

  const videoRef =
    useRef(null);

  const canvasRef =
    useRef(null);

  const animationFrameRef =
    useRef(null);

  const streamRef =
    useRef(null);


  const lastCursorRef =
    useRef({
      x: 0,
      y: 0,
      visible: false,
      gesture: "UNKNOWN",
    });


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


  // =========================================================
  // CURSOR UPDATE
  // =========================================================

  const updateCursor =
    (data) => {

      if (!onCursorUpdate) {
        return;
      }

      const previous =
        lastCursorRef.current;


      if (
        previous.x === data.x &&
        previous.y === data.y &&
        previous.visible === data.visible &&
        previous.gesture === data.gesture &&
        previous.confidence === data.confidence
      ) {
        return;
      }


      lastCursorRef.current =
        data;


      onCursorUpdate(
        data
      );
    };


  // =========================================================
  // CAMERA
  // =========================================================

  useEffect(() => {

    let mounted = true;


    const startCamera =
      async () => {

        try {

          setDebugMessage(
            "Requesting camera..."
          );


          const stream =
            await navigator.mediaDevices.getUserMedia({
              video: {
                width: {
                  ideal: 1280,
                },

                height: {
                  ideal: 720,
                },

                facingMode: "user",
              },

              audio: false,
            });


          if (!mounted) {

            stream
              .getTracks()
              .forEach(
                (track) =>
                  track.stop()
              );

            return;
          }


          streamRef.current =
            stream;


          setDebugMessage(
            "Camera stream received"
          );


          const video =
            videoRef.current;


          if (!video) {

            throw new Error(
              "Video element is not available"
            );
          }


          video.srcObject =
            stream;


          setCameraStatus(
            "Camera Connected"
          );


          setDebugMessage(
            "Waiting for video..."
          );


          await new Promise(
            (
              resolve,
              reject
            ) => {

              if (
                video.readyState >= 2
              ) {

                resolve();

                return;
              }


              const handleLoaded =
                () => {

                  cleanup();

                  resolve();
                };


              const handleError =
                () => {

                  cleanup();

                  reject(
                    new Error(
                      "Video failed to load"
                    )
                  );
                };


              const cleanup =
                () => {

                  video.removeEventListener(
                    "loadeddata",
                    handleLoaded
                  );

                  video.removeEventListener(
                    "error",
                    handleError
                  );
                };


              video.addEventListener(
                "loadeddata",
                handleLoaded
              );

              video.addEventListener(
                "error",
                handleError
              );
            }
          );


          if (!mounted) {
            return;
          }


          setDebugMessage(
            "Video ready"
          );


          await video.play();


          if (!mounted) {
            return;
          }


          setDebugMessage(
            "Video playing"
          );


          setTrackingStatus(
            "Initializing Hand Tracking..."
          );


          setDebugMessage(
            "Loading MediaPipe..."
          );


          await initializeHandTracking();


          if (!mounted) {
            return;
          }


          setTrackingStatus(
            "Hand Tracking Active"
          );


          setDebugMessage(
            "MediaPipe initialized successfully"
          );


          processFrame();

        } catch (error) {

          console.error(
            "HAND TRACKING STARTUP ERROR:",
            error
          );


          setTrackingStatus(
            "Hand Tracking Error"
          );


          setDebugMessage(
            `ERROR: ${
              error?.message ||
              "Unknown error"
            }`
          );


          updateCursor({
            x: 0,
            y: 0,
            visible: false,
            gesture: "UNKNOWN",
            confidence: 0,
          });
        }
      };


    // =======================================================
    // FRAME LOOP
    // =======================================================

    const processFrame =
      () => {

        if (!mounted) {
          return;
        }


        const video =
          videoRef.current;


        if (!video) {

          animationFrameRef.current =
            requestAnimationFrame(
              processFrame
            );

          return;
        }


        try {

          if (
            video.readyState >= 2 &&
            video.videoWidth > 0 &&
            video.videoHeight > 0
          ) {

            const timestamp =
              performance.now();


            const result =
              detectHands(
                video,
                timestamp
              );


            if (result) {

              drawLandmarks(
                result
              );
            }

          }

        } catch (error) {

          console.error(
            "FRAME PROCESSING ERROR:",
            error
          );


          setDebugMessage(
            `Frame error: ${
              error?.message ||
              "Unknown error"
            }`
          );
        }


        animationFrameRef.current =
          requestAnimationFrame(
            processFrame
          );
      };


    // =======================================================
    // DRAW + RECOGNIZE
    // =======================================================

    const drawLandmarks =
      (result) => {

        const canvas =
          canvasRef.current;

        const video =
          videoRef.current;


        if (
          !canvas ||
          !video
        ) {
          return;
        }


        const ctx =
          canvas.getContext(
            "2d"
          );


        if (!ctx) {
          return;
        }


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


        // ===================================================
        // NO HAND
        // ===================================================

        if (
          !result ||
          !result.landmarks ||
          result.landmarks.length === 0
        ) {

          setGesture(
            "UNKNOWN"
          );

          setInteractionAction(
            "NONE"
          );

          setInteractionDescription(
            "No hand detected"
          );


          updateCursor({
            x: 0,
            y: 0,
            visible: false,
            gesture: "UNKNOWN",
            confidence: 0,
          });


          return;
        }


        // ===================================================
        // FIRST HAND
        // ===================================================

        const landmarks =
          result.landmarks[0];


        if (
          !landmarks ||
          landmarks.length < 21
        ) {

          updateCursor({
            x: 0,
            y: 0,
            visible: false,
            gesture: "UNKNOWN",
            confidence: 0,
          });

          return;
        }


        // ===================================================
        // RECOGNIZE GESTURE
        // ===================================================

        const gestureResult =
          recognizeGesture(
            landmarks
          );


        const detectedGesture =
          String(
            gestureResult?.gesture ||
            "UNKNOWN"
          ).toUpperCase();


        const confidence =
          Number(
            gestureResult?.confidence
          ) || 0;


        setGesture(
          detectedGesture
        );


        // ===================================================
        // INTERACTION ENGINE
        // ===================================================

        try {

          const interaction =
            createInteractionEvent(
              detectedGesture,
              landmarks
            );


          setInteractionAction(
            interaction?.action ||
            "NONE"
          );


          setInteractionDescription(
            getActionDescription(
              interaction?.action ||
              "NONE"
            )
          );

        } catch (error) {

          console.warn(
            "Interaction engine error:",
            error
          );


          setInteractionAction(
            "NONE"
          );


          setInteractionDescription(
            "No interaction"
          );
        }


        // ===================================================
        // INDEX FINGER
        // ===================================================

        const indexFingerTip =
          landmarks[8];


        if (!indexFingerTip) {

          updateCursor({
            x: 0,
            y: 0,
            visible: false,
            gesture: detectedGesture,
            confidence,
          });

          return;
        }


        // ===================================================
        // SCREEN COORDINATES
        // ===================================================
        //
        // Webcam is mirrored visually.
        //
        // Therefore X is inverted so the virtual cursor
        // follows the user's actual hand movement naturally.
        //

        const screenX =
          Math.max(
            0,
            Math.min(
              window.innerWidth,
              (1 - indexFingerTip.x) *
                window.innerWidth
            )
          );


        const screenY =
          Math.max(
            0,
            Math.min(
              window.innerHeight,
              indexFingerTip.y *
                window.innerHeight
            )
          );


        // ===================================================
        // IMPORTANT:
        //
        // ONLY POINT controls the cursor.
        //
        // PINCH = SELECT
        // FIST = CLOSE
        // OPEN_PALM = RESET
        // TWO_FINGER = SECONDARY ACTION
        // ===================================================

        const cursorVisible =
          detectedGesture === "POINT";


        updateCursor({
          x: screenX,
          y: screenY,
          visible: cursorVisible,
          gesture: detectedGesture,
          confidence,
        });


        // ===================================================
        // DRAW VIRTUAL CURSOR ON CAMERA
        // ===================================================

        if (
          cursorVisible
        ) {

          const canvasX =
            indexFingerTip.x *
            canvas.width;

          const canvasY =
            indexFingerTip.y *
            canvas.height;


          // Outer ring

          ctx.beginPath();

          ctx.arc(
            canvasX,
            canvasY,
            24,
            0,
            Math.PI * 2
          );

          ctx.strokeStyle =
            "#67e8f9";

          ctx.lineWidth =
            2;

          ctx.stroke();


          // Inner point

          ctx.beginPath();

          ctx.arc(
            canvasX,
            canvasY,
            10,
            0,
            Math.PI * 2
          );

          ctx.fillStyle =
            "#22d3ee";

          ctx.fill();
        }


        // ===================================================
        // DRAW LANDMARKS
        // ===================================================

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
              4,
              0,
              Math.PI * 2
            );

            ctx.fillStyle =
              "#22d3ee";

            ctx.fill();
          }
        );


        // ===================================================
        // DRAW CONNECTIONS
        // ===================================================

        drawConnections(
          ctx,
          landmarks,
          canvas.width,
          canvas.height
        );
      };


    // =======================================================
    // CONNECTIONS
    // =======================================================

    const drawConnections =
      (
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


            if (!a || !b) {
              return;
            }


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


            ctx.lineWidth =
              2;


            ctx.stroke();
          }
        );
      };


    // =======================================================
    // START
    // =======================================================

    startCamera();


    // =======================================================
    // CLEANUP
    // =======================================================

    return () => {

      mounted = false;


      if (
        animationFrameRef.current
      ) {

        cancelAnimationFrame(
          animationFrameRef.current
        );

        animationFrameRef.current =
          null;
      }


      if (
        streamRef.current
      ) {

        streamRef.current
          .getTracks()
          .forEach(
            (track) =>
              track.stop()
          );


        streamRef.current =
          null;
      }


      updateCursor({
        x: 0,
        y: 0,
        visible: false,
        gesture: "UNKNOWN",
        confidence: 0,
      });
    };

  }, [onCursorUpdate]);


  // =========================================================
  // UI
  // =========================================================

  return (

    <div
      className="
        relative
        min-h-[500px]
        w-full
        overflow-hidden
        rounded-2xl
        bg-black
      "
    >

      {/* CAMERA */}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="
          absolute
          inset-0
          h-full
          w-full
          object-cover
          scale-x-[-1]
        "
      />


      {/* LANDMARK CANVAS */}

      <canvas
        ref={canvasRef}
        className="
          absolute
          inset-0
          h-full
          w-full
          scale-x-[-1]
        "
      />


      {/* STATUS */}

      <div
        className="
          absolute
          left-5
          top-5
          z-20
          flex
          flex-col
          gap-2
        "
      >

        <div
          className="
            flex
            items-center
            gap-2
            rounded-full
            border
            border-slate-700
            bg-slate-950/80
            px-4
            py-2
            text-xs
            text-white
            backdrop-blur
          "
        >

          <span
            className="
              h-2
              w-2
              rounded-full
              bg-emerald-400
            "
          />

          {cameraStatus}

        </div>


        <div
          className="
            flex
            items-center
            gap-2
            rounded-full
            border
            border-slate-700
            bg-slate-950/80
            px-4
            py-2
            text-xs
            text-white
            backdrop-blur
          "
        >

          <span
            className="
              h-2
              w-2
              rounded-full
              bg-cyan-400
            "
          />

          {trackingStatus}

        </div>


        <div
          className="
            flex
            items-center
            gap-2
            rounded-full
            border
            border-slate-700
            bg-slate-950/80
            px-4
            py-2
            text-xs
            text-white
            backdrop-blur
          "
        >

          <span
            className="
              h-2
              w-2
              rounded-full
              bg-purple-400
            "
          />

          Gesture: {gesture}

        </div>


        <div
          className="
            rounded-lg
            border
            border-slate-700
            bg-slate-950/80
            px-4
            py-2
            text-xs
            text-slate-300
            backdrop-blur
          "
        >

          Action:
          {" "}
          {interactionAction}

        </div>


        <div
          className="
            rounded-lg
            border
            border-slate-700
            bg-slate-950/80
            px-4
            py-2
            text-xs
            text-slate-300
            backdrop-blur
          "
        >

          {interactionDescription}

        </div>


        <div
          className="
            rounded-lg
            border
            border-yellow-500/30
            bg-slate-950/80
            px-3
            py-2
            text-xs
            text-yellow-300
          "
        >

          Debug:
          {" "}
          {debugMessage}

        </div>

      </div>


      {/* BORDER */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          border
          border-cyan-500/20
        "
      />

    </div>
  );
}


export default CameraFeed;