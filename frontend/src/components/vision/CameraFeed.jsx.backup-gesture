
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
  detectObjects,
  initializeObjectDetection,
  resetObjectDetection,
} from "../../services/vision/objectDetection/objectDetector";

import {
  recognizeGesture,
} from "../../services/vision/gestureEngine";

import {
  createInteractionEvent,
  getActionDescription,
} from "../../services/interaction/interactionController";

import {
  recordFrame,
} from "../../services/performance/performanceMonitor";


function CameraFeed({
  onCursorUpdate,
}) {

  // =========================================================
  // REFS
  // =========================================================

  const videoRef =
    useRef(null);

  const canvasRef =
    useRef(null);

  const animationFrameRef =
    useRef(null);

  const streamRef =
    useRef(null);

  // Local visual AR cursor.
  // This is intentionally a ref instead of React state so
  // the entire component does not re-render on every frame.
  const cursorRef =
    useRef(null);

  const cursorRingRef =
    useRef(null);

  const lastCursorRef =
    useRef({
      x: 0,
      y: 0,
      visible: false,
      gesture: "UNKNOWN",
      confidence: 0,
    });


  // =========================================================
  // STATE
  // =========================================================

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
  // LOCAL AR CURSOR
  // =========================================================
  //
  // This cursor is rendered inside the camera itself.
  //
  // MediaPipe X is normalized:
  // 0 = left
  // 1 = right
  //
  // Because the webcam is visually mirrored, the cursor uses
  // (1 - x) for the horizontal position.
  //
  // =========================================================

  const updateLocalCursor =
    (
      landmark,
      detectedGesture,
      confidence,
      visible
    ) => {

      const cursor =
        cursorRef.current;

      const ring =
        cursorRingRef.current;

      if (!cursor) {
        return;
      }

      if (
        !landmark ||
        !visible
      ) {

        cursor.style.opacity =
          "0";

        cursor.style.transform =
          "translate3d(-50%, -50%, 0) scale(0.75)";

        return;
      }


      const x =
        Math.max(
          0,
          Math.min(
            1,
            1 - landmark.x
          )
        );

      const y =
        Math.max(
          0,
          Math.min(
            1,
            landmark.y
          )
        );


      cursor.style.left =
        `${x * 100}%`;

      cursor.style.top =
        `${y * 100}%`;

      cursor.style.opacity =
        "1";


      // =====================================================
      // POINT STATE
      // =====================================================

      if (
        detectedGesture === "POINT"
      ) {

        cursor.style.transform =
          "translate3d(-50%, -50%, 0) scale(1)";

        if (ring) {

          ring.style.borderColor =
            "rgba(103, 232, 249, 0.95)";

          ring.style.boxShadow =
            "0 0 18px rgba(34, 211, 238, 0.75)";

          ring.style.width =
            "48px";

          ring.style.height =
            "48px";
        }
      }


      // =====================================================
      // PINCH / SELECT STATE
      // =====================================================

      else if (
        detectedGesture === "PINCH"
      ) {

        cursor.style.transform =
          "translate3d(-50%, -50%, 0) scale(1.18)";

        if (ring) {

          ring.style.borderColor =
            "rgba(216, 180, 254, 0.98)";

          ring.style.boxShadow =
            "0 0 28px rgba(192, 132, 252, 0.95)";

          ring.style.width =
            "58px";

          ring.style.height =
            "58px";
        }
      }


      // =====================================================
      // OTHER GESTURES
      // =====================================================

      else {

        cursor.style.transform =
          "translate3d(-50%, -50%, 0) scale(0.85)";

        if (ring) {

          ring.style.borderColor =
            "rgba(148, 163, 184, 0.55)";

          ring.style.boxShadow =
            "0 0 12px rgba(148, 163, 184, 0.35)";

          ring.style.width =
            "40px";

          ring.style.height =
            "40px";
        }
      }


      // Prevent unused parameter warning in some linters.
      void confidence;
    };


  // =========================================================
  // CAMERA
  // =========================================================

  useEffect(() => {

    let mounted = true;


    // =======================================================
    // DRAW + RECOGNIZE
    // =======================================================

    const drawLandmarks =
      (
        result,
        objectResult
      ) => {

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
        // OBJECT DETECTION
        // ===================================================

        if (
          objectResult &&
          objectResult.objects &&
          objectResult.objects.length > 0
        ) {

          drawObjects(
            ctx,
            objectResult.objects,
            canvas.width,
            canvas.height
          );
        }


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


          updateLocalCursor(
            null,
            "UNKNOWN",
            0,
            false
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

          updateLocalCursor(
            null,
            "UNKNOWN",
            0,
            false
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

          updateLocalCursor(
            null,
            detectedGesture,
            confidence,
            false
          );


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
        // Parent cursor system receives screen coordinates.
        //
        // Webcam is mirrored visually, therefore X is inverted.
        //
        // ===================================================

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
        // CURSOR RULE
        // ===================================================
        //
        // POINT = cursor
        // PINCH = select
        // FIST = cancel
        // OPEN_PALM = dashboard
        // TWO_FINGER = navigate
        //
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
        // LOCAL AR CURSOR
        // ===================================================

        updateLocalCursor(
          indexFingerTip,
          detectedGesture,
          confidence,
          cursorVisible
        );


        // ===================================================
        // DRAW CURSOR ON CANVAS
        // ===================================================
        //
        // Existing canvas cursor is retained as a tracking
        // fallback / visual landmark indicator.
        //
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
    // OBJECT DETECTION OVERLAY
    // =======================================================

    const drawObjects =
      (
        ctx,
        objects,
        width,
        height
      ) => {

        objects.forEach(
          (object) => {

            const box =
              object.boundingBox;


            if (!box) {
              return;
            }


            const x =
              box.originX;


            const y =
              box.originY;


            const boxWidth =
              box.width;


            const boxHeight =
              box.height;


            // ===============================================
            // BOUNDING BOX
            // ===============================================

            ctx.strokeStyle =
              "#a78bfa";

            ctx.lineWidth =
              3;


            ctx.strokeRect(
              x,
              y,
              boxWidth,
              boxHeight
            );


            // ===============================================
            // LABEL
            // ===============================================

            const confidence =
              Math.round(
                (object.confidence || 0) *
                100
              );


            const label =
              `${object.label} ${confidence}%`;


            ctx.font =
              "bold 14px Arial";


            const textWidth =
              ctx.measureText(
                label
              ).width;


            const labelHeight =
              24;


            const labelY =
              Math.max(
                0,
                y - labelHeight
              );


            ctx.fillStyle =
              "rgba(15, 23, 42, 0.9)";


            ctx.fillRect(
              x,
              labelY,
              textWidth + 12,
              labelHeight
            );


            ctx.fillStyle =
              "#e9d5ff";


            ctx.fillText(
              label,
              x + 6,
              labelY + 17
            );
          }
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

            const frameStart =
              performance.now();


            const timestamp =
              frameStart;


            const handResult =
              detectHands(
                video,
                timestamp
              );


            const objectResult =
              detectObjects(
                video,
                timestamp
              );


            drawLandmarks(
              handResult,
              objectResult
            );


            const processingTime =
              performance.now() -
              frameStart;


            recordFrame(
              processingTime
            );
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
    // CAMERA STARTUP
    // =======================================================

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
            "Initializing Object Detection..."
          );


          await initializeObjectDetection();


          if (!mounted) {
            return;
          }


          setDebugMessage(
            "MediaPipe Hand + Object Detection initialized"
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


          updateLocalCursor(
            null,
            "UNKNOWN",
            0,
            false
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


      resetObjectDetection();


      updateLocalCursor(
        null,
        "UNKNOWN",
        0,
        false
      );


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

      {/* =====================================================
          CAMERA
          ===================================================== */}

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


      {/* =====================================================
          LANDMARK / OBJECT CANVAS
          ===================================================== */}

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


      {/* =====================================================
          LOCAL AR VIRTUAL CURSOR
          ===================================================== */}

      <div
        ref={cursorRef}
        className="
          pointer-events-none
          absolute
          z-40
          h-14
          w-14
          -translate-x-1/2
          -translate-y-1/2
          opacity-0
          transition-opacity
          duration-100
        "
        style={{
          left: "50%",
          top: "50%",
          transform:
            "translate3d(-50%, -50%, 0) scale(0.75)",
        }}
      >

        {/* Outer AR ring */}

        <div
          ref={cursorRingRef}
          className="
            absolute
            left-1/2
            top-1/2
            h-12
            w-12
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            border-2
            border-cyan-300/90
            shadow-[0_0_18px_rgba(34,211,238,0.75)]
          "
        />


        {/* Inner ring */}

        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-6
            w-6
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            border
            border-cyan-300/60
          "
        />


        {/* Center dot */}

        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-2
            w-2
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-cyan-300
            shadow-[0_0_14px_rgba(34,211,238,1)]
          "
        />


        {/* Horizontal crosshair */}

        <div
          className="
            absolute
            left-[-8px]
            right-[-8px]
            top-1/2
            h-px
            -translate-y-1/2
            bg-cyan-300/60
          "
        />


        {/* Vertical crosshair */}

        <div
          className="
            absolute
            bottom-[-8px]
            left-1/2
            top-[-8px]
            w-px
            -translate-x-1/2
            bg-cyan-300/60
          "
        />


        {/* Four targeting marks */}

        <div
          className="
            absolute
            left-0
            top-0
            h-2
            w-2
            border-l
            border-t
            border-cyan-200
          "
        />

        <div
          className="
            absolute
            right-0
            top-0
            h-2
            w-2
            border-r
            border-t
            border-cyan-200
          "
        />

        <div
          className="
            absolute
            bottom-0
            left-0
            h-2
            w-2
            border-b
            border-l
            border-cyan-200
          "
        />

        <div
          className="
            absolute
            bottom-0
            right-0
            h-2
            w-2
            border-b
            border-r
            border-cyan-200
          "
        />

      </div>


      {/* =====================================================
          STATUS
          ===================================================== */}

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

        {/* CAMERA STATUS */}

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
              shadow-[0_0_8px_rgba(52,211,153,0.8)]
            "
          />

          {cameraStatus}

        </div>


        {/* TRACKING STATUS */}

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
              shadow-[0_0_8px_rgba(34,211,238,0.8)]
            "
          />

          {trackingStatus}

        </div>


        {/* GESTURE */}

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
              shadow-[0_0_8px_rgba(192,132,252,0.8)]
            "
          />

          Gesture: {gesture}

        </div>


        {/* ACTION */}

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


        {/* DESCRIPTION */}

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


        {/* DEBUG */}

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


      {/* =====================================================
          AR HUD
          ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-30
        "
      >

        {/* HUD FRAME */}

        <div
          className="
            absolute
            inset-3
            rounded-xl
            border
            border-cyan-400/20
          "
        />


        {/* TOP LEFT */}

        <div
          className="
            absolute
            left-5
            top-5
            h-10
            w-10
            border-l-2
            border-t-2
            border-cyan-400/70
          "
        />


        {/* TOP RIGHT */}

        <div
          className="
            absolute
            right-5
            top-5
            h-10
            w-10
            border-r-2
            border-t-2
            border-cyan-400/70
          "
        />


        {/* BOTTOM LEFT */}

        <div
          className="
            absolute
            bottom-5
            left-5
            h-10
            w-10
            border-b-2
            border-l-2
            border-cyan-400/70
          "
        />


        {/* BOTTOM RIGHT */}

        <div
          className="
            absolute
            bottom-5
            right-5
            h-10
            w-10
            border-b-2
            border-r-2
            border-cyan-400/70
          "
        />


        {/* AR HEADER */}

        <div
          className="
            absolute
            left-1/2
            top-5
            -translate-x-1/2
            rounded-full
            border
            border-cyan-400/30
            bg-slate-950/75
            px-5
            py-2
            text-[11px]
            font-semibold
            tracking-[0.3em]
            text-cyan-300
            backdrop-blur-md
          "
        >
          AR VISION
        </div>


        {/* SCAN LINE */}

        <div
          className="
            absolute
            left-0
            right-0
            top-1/2
            h-px
            bg-cyan-400/20
            shadow-[0_0_12px_rgba(34,211,238,0.35)]
          "
        />


        {/* BOTTOM TELEMETRY */}

        <div
          className="
            absolute
            bottom-5
            left-1/2
            flex
            -translate-x-1/2
            items-center
            gap-5
            rounded-full
            border
            border-slate-700/70
            bg-slate-950/75
            px-5
            py-2
            text-[10px]
            uppercase
            tracking-wider
            text-slate-300
            backdrop-blur-md
          "
        >

          <span>
            SYSTEM{" "}
            <span className="text-emerald-400">
              ONLINE
            </span>
          </span>


          <span
            className="
              h-3
              w-px
              bg-slate-700
            "
          />


          <span>
            TRACK{" "}
            <span className="text-cyan-300">
              {trackingStatus}
            </span>
          </span>


          <span
            className="
              h-3
              w-px
              bg-slate-700
            "
          />


          <span>
            GESTURE{" "}
            <span className="text-purple-300">
              {gesture}
            </span>
          </span>

        </div>

      </div>


      {/* =====================================================
          OUTER BORDER
          ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-50
          rounded-2xl
          border
          border-cyan-500/20
        "
      />

    </div>
  );
}


export default CameraFeed;