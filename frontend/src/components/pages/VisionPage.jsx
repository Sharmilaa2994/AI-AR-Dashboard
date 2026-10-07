import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useARInteraction,
} from "../../context/ARInteractionContext";


/* =========================================================
   VISION PAGE
   ---------------------------------------------------------
   Global AR interaction compatible.

   Supported interactions:
   - POINT       -> hover / target
   - PINCH       -> select
   - PINCH HOLD  -> drag
   - TWO FINGER  -> scroll
   - FIST        -> cancel
   - OPEN PALM   -> reset
========================================================= */

function VisionPage() {

  const {
    cursor,
    isTracking,
    selectedWidget,
    hoveredWidget,
    interactionMessage,
    setInteractionTarget,
    resetInteraction,
  } = useARInteraction();


  /* =======================================================
     LOCAL PAGE STATE
  ======================================================= */

  const [pipelineStatus, setPipelineStatus] =
    useState("ACTIVE");

  const [cameraStatus, setCameraStatus] =
    useState("ONLINE");

  const [handStatus, setHandStatus] =
    useState("TRACKING");

  const [selectedPanel, setSelectedPanel] =
    useState(null);


  /* =======================================================
     CURRENT GESTURE DESCRIPTION
  ======================================================= */

  const gestureDescription = useMemo(() => {

    switch (cursor?.gesture) {

      case "POINT":
        return "Targeting interface element";

      case "PINCH":
        return "Selection / drag mode";

      case "TWO_FINGER":
        return "Scrolling interface";

      case "FIST":
        return "Interaction cancelled";

      case "OPEN_PALM":
        return "Workspace reset";

      default:
        return "Waiting for gesture";

    }

  }, [
    cursor?.gesture,
  ]);


  /* =======================================================
     TRACK CURRENT CURSOR TARGET
  ======================================================= */

  useEffect(() => {

    if (!cursor) {
      setInteractionTarget(null);
      return;
    }

    /*
      The interaction context determines the real widget
      under the cursor.

      We expose the detected target here so the Vision page
      can display the current AR target.
    */

    setInteractionTarget(
      cursor.targetId || hoveredWidget || null
    );

  }, [
    cursor,
    hoveredWidget,
    setInteractionTarget,
  ]);


  /* =======================================================
     SYNCHRONIZE HAND STATUS
  ======================================================= */

  useEffect(() => {

    setHandStatus(
      isTracking
        ? "TRACKING"
        : "SEARCHING"
    );

  }, [
    isTracking,
  ]);


  /* =======================================================
     OPEN PALM RESET
  ======================================================= */

  useEffect(() => {

    if (
      cursor?.gesture === "OPEN_PALM"
    ) {

      setSelectedPanel(null);
      setPipelineStatus("ACTIVE");
      setCameraStatus("ONLINE");
      setHandStatus(
        isTracking
          ? "TRACKING"
          : "SEARCHING"
      );

    }

  }, [
    cursor?.gesture,
    isTracking,
  ]);


  /* =======================================================
     PANEL SELECTION
  ======================================================= */

  const handlePanelSelect = (id) => {

    setSelectedPanel(id);

  };


  /* =======================================================
     MANUAL RESET
  ======================================================= */

  const handleReset = () => {

    setSelectedPanel(null);

    setPipelineStatus("ACTIVE");
    setCameraStatus("ONLINE");
    setHandStatus(
      isTracking
        ? "TRACKING"
        : "SEARCHING"
    );

    resetInteraction();

  };


  /* =======================================================
     CURRENT AR TARGET
  ======================================================= */

  const currentTarget =
    hoveredWidget ||
    selectedWidget ||
    "NONE";


  /* =======================================================
     PAGE
  ======================================================= */

  return (

    <div
      className="
        mx-auto
        w-full
        max-w-[1500px]
        space-y-5
      "
    >

      {/* ===================================================
          PAGE HEADER
      =================================================== */}

      <PageHeader
        eyebrow="COMPUTER VISION"
        title="Vision Control Center"
        description="Real-time camera, hand tracking and spatial vision monitoring."
        gesture={cursor?.gesture}
        gestureDescription={gestureDescription}
      />


      {/* ===================================================
          STATUS CARDS
      =================================================== */}

      <div
        className="
          grid
          gap-4
          md:grid-cols-3
        "
      >

        <InteractiveStatusCard
          id="vision-status-engine"
          title="VISION ENGINE"
          value={pipelineStatus}
          description="Computer vision processing pipeline."
          selected={
            selectedPanel === "vision-status-engine" ||
            hoveredWidget === "vision-status-engine"
          }
          onSelect={handlePanelSelect}
        />


        <InteractiveStatusCard
          id="vision-status-hand"
          title="HAND TRACKING"
          value={
            isTracking
              ? "TRACKING"
              : handStatus
          }
          description="MediaPipe hand landmark tracking."
          selected={
            selectedPanel === "vision-status-hand" ||
            hoveredWidget === "vision-status-hand"
          }
          onSelect={handlePanelSelect}
        />


        <InteractiveStatusCard
          id="vision-status-camera"
          title="CAMERA"
          value={cameraStatus}
          description="Background camera input."
          selected={
            selectedPanel === "vision-status-camera" ||
            hoveredWidget === "vision-status-camera"
          }
          onSelect={handlePanelSelect}
        />

      </div>


      {/* ===================================================
          PIPELINE
      =================================================== */}

      <InteractivePanel
        id="vision-pipeline"
        title="VISION PIPELINE"
        subtitle="Real-time processing architecture"
        selected={
          selectedPanel === "vision-pipeline" ||
          hoveredWidget === "vision-pipeline"
        }
        onSelect={handlePanelSelect}
      >

        <div
          className="
            grid
            gap-4
            md:grid-cols-2
            xl:grid-cols-4
          "
        >

          <PipelineStep
            number="01"
            title="Camera"
            text="Video stream"
            status="ONLINE"
          />


          <PipelineStep
            number="02"
            title="Hand Tracking"
            text="21 landmarks"
            status={
              isTracking
                ? "ACTIVE"
                : "READY"
            }
          />


          <PipelineStep
            number="03"
            title="Gesture Engine"
            text="Gesture recognition"
            status={
              cursor?.gesture &&
              cursor.gesture !== "UNKNOWN"
                ? "ACTIVE"
                : "READY"
            }
          />


          <PipelineStep
            number="04"
            title="Interaction"
            text="Spatial command"
            status={
              interactionMessage
                ? "ACTIVE"
                : "READY"
            }
          />

        </div>

      </InteractivePanel>


      {/* ===================================================
          TRACKING + PROCESSING
      =================================================== */}

      <div
        className="
          grid
          gap-5
          lg:grid-cols-2
        "
      >

        {/* =================================================
            TRACKING
        ================================================= */}

        <InteractivePanel
          id="vision-tracking"
          title="SUPPORTED TRACKING"
          subtitle="Available spatial interaction capabilities"
          selected={
            selectedPanel === "vision-tracking" ||
            hoveredWidget === "vision-tracking"
          }
          onSelect={handlePanelSelect}
        >

          <div
            className="
              grid
              gap-3
              sm:grid-cols-2
            "
          >

            <FeatureItem
              icon="⌁"
              title="Index Fingertip"
              description="Real-time fingertip position."
            />


            <FeatureItem
              icon="◎"
              title="Hand Landmarks"
              description="21-point hand landmark detection."
            />


            <FeatureItem
              icon="◉"
              title="Cursor Mapping"
              description="Screen-space spatial cursor."
            />


            <FeatureItem
              icon="◇"
              title="Gesture Classification"
              description="Gesture-based command recognition."
            />

          </div>

        </InteractivePanel>


        {/* =================================================
            PROCESSING
        ================================================= */}

        <InteractivePanel
          id="vision-processing"
          title="VISION PROCESSING"
          subtitle="Current processing pipeline"
          selected={
            selectedPanel === "vision-processing" ||
            hoveredWidget === "vision-processing"
          }
          onSelect={handlePanelSelect}
        >

          <div
            className="
              space-y-3
            "
          >

            <ProcessingRow
              label="Camera Input"
              value={cameraStatus}
            />


            <ProcessingRow
              label="MediaPipe"
              value={
                isTracking
                  ? "ACTIVE"
                  : "READY"
              }
            />


            <ProcessingRow
              label="Object Detection"
              value="READY"
            />


            <ProcessingRow
              label="Gesture Engine"
              value={
                cursor?.gesture &&
                cursor.gesture !== "UNKNOWN"
                  ? "ACTIVE"
                  : "READY"
              }
            />


            <ProcessingRow
              label="Interaction Controller"
              value={
                interactionMessage
                  ? "ACTIVE"
                  : "READY"
              }
            />

          </div>

        </InteractivePanel>

      </div>


      {/* ===================================================
          LIVE INTERACTION INFORMATION
      =================================================== */}

      <div
        className="
          rounded-2xl
          border
          border-cyan-400/10
          bg-slate-950/70
          p-5
          backdrop-blur-xl
        "
      >

        <div
          className="
            flex
            flex-col
            gap-4
            md:flex-row
            md:items-center
            md:justify-between
          "
        >

          <div>

            <div
              className="
                text-[9px]
                uppercase
                tracking-[0.25em]
                text-slate-500
              "
            >
              LIVE SPATIAL INPUT
            </div>


            <div
              className="
                mt-2
                text-lg
                font-semibold
                text-white
              "
            >
              {cursor?.gesture || "UNKNOWN"}
            </div>


            <div
              className="
                mt-1
                text-xs
                text-slate-500
              "
            >
              {gestureDescription}
            </div>


            {/* CURRENT TARGET */}

            <div
              className="
                mt-3
                text-[10px]
                uppercase
                tracking-[0.18em]
                text-slate-600
              "
            >
              TARGET:{" "}
              <span className="text-cyan-400">
                {currentTarget}
              </span>
            </div>

          </div>


          <div
            className="
              grid
              grid-cols-3
              gap-3
            "
          >

            <Telemetry
              label="X"
              value={
                Math.round(
                  cursor?.x || 0
                )
              }
            />


            <Telemetry
              label="Y"
              value={
                Math.round(
                  cursor?.y || 0
                )
              }
            />


            <Telemetry
              label="CONF"
              value={`${Math.round(
                (cursor?.confidence || 0) * 100
              )}%`}
            />

          </div>

        </div>


        {/* =================================================
            INTERACTION MESSAGE
        ================================================= */}

        <div
          className="
            mt-5
            flex
            flex-col
            gap-3
            rounded-xl
            border
            border-slate-800
            bg-slate-900/40
            px-4
            py-3
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          <div>

            <div
              className="
                text-[8px]
                uppercase
                tracking-[0.2em]
                text-slate-600
              "
            >
              INTERACTION STATUS
            </div>


            <div
              className="
                mt-1
                text-xs
                text-slate-300
              "
            >
              {interactionMessage}
            </div>

          </div>


          <button
            type="button"
            onClick={handleReset}
            className="
              rounded-lg
              border
              border-cyan-400/20
              bg-cyan-400/5
              px-3
              py-2
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.15em]
              text-cyan-300
              transition
              hover:border-cyan-400/40
              hover:bg-cyan-400/10
            "
          >
            RESET INTERACTION
          </button>

        </div>

      </div>

    </div>

  );
}


/* =========================================================
   PAGE HEADER
========================================================= */

function PageHeader({
  eyebrow,
  title,
  description,
  gesture,
  gestureDescription,
}) {

  return (

    <div
      className="
        rounded-2xl
        border
        border-cyan-400/10
        bg-slate-950/70
        p-7
        backdrop-blur-xl
      "
    >

      <div
        className="
          flex
          flex-col
          gap-5
          xl:flex-row
          xl:items-center
          xl:justify-between
        "
      >

        <div>

          <div
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.3em]
              text-cyan-400
            "
          >
            {eyebrow}
          </div>


          <h1
            className="
              mt-2
              text-3xl
              font-semibold
              text-white
            "
          >
            {title}
          </h1>


          <p
            className="
              mt-2
              max-w-2xl
              text-sm
              leading-6
              text-slate-400
            "
          >
            {description}
          </p>

        </div>


        {/* LIVE GESTURE STATUS */}

        <div
          className="
            min-w-[220px]
            rounded-xl
            border
            border-cyan-400/10
            bg-slate-900/60
            px-4
            py-3
          "
        >

          <div
            className="
              text-[9px]
              uppercase
              tracking-[0.2em]
              text-slate-500
            "
          >
            CURRENT COMMAND
          </div>


          <div
            className="
              mt-2
              flex
              items-center
              gap-2
            "
          >

            <span
              className="
                h-2
                w-2
                rounded-full
                bg-cyan-400
                shadow-[0_0_10px_rgba(34,211,238,0.8)]
              "
            />


            <span
              className="
                text-xs
                font-semibold
                text-cyan-300
              "
            >
              {gesture || "UNKNOWN"}
            </span>

          </div>


          <div
            className="
              mt-1
              text-[10px]
              text-slate-500
            "
          >
            {gestureDescription}
          </div>

        </div>

      </div>

    </div>

  );
}


/* =========================================================
   INTERACTIVE STATUS CARD
========================================================= */

function InteractiveStatusCard({
  id,
  title,
  value,
  description,
  selected,
  onSelect,
}) {

  return (

    <InteractiveWrapper
      id={id}
      selected={selected}
      onSelect={onSelect}
    >

      <div
        className="
          h-full
          rounded-2xl
          border
          border-slate-800
          bg-slate-950/80
          p-5
          backdrop-blur-xl
        "
      >

        <div
          className="
            text-[9px]
            uppercase
            tracking-[0.2em]
            text-slate-500
          "
        >
          {title}
        </div>


        <div
          className="
            mt-4
            text-2xl
            font-semibold
            text-cyan-300
          "
        >
          {value}
        </div>


        <div
          className="
            mt-2
            text-xs
            leading-5
            text-slate-500
          "
        >
          {description}
        </div>

      </div>

    </InteractiveWrapper>

  );
}


/* =========================================================
   INTERACTIVE PANEL
========================================================= */

function InteractivePanel({
  id,
  title,
  subtitle,
  selected,
  onSelect,
  children,
}) {

  return (

    <InteractiveWrapper
      id={id}
      selected={selected}
      onSelect={onSelect}
    >

      <div
        className="
          rounded-2xl
          border
          border-slate-800
          bg-slate-950/80
          p-6
          backdrop-blur-xl
        "
      >

        <div>

          <div
            className="
              text-sm
              font-semibold
              tracking-wide
              text-white
            "
          >
            {title}
          </div>


          <div
            className="
              mt-1
              text-xs
              text-slate-500
            "
          >
            {subtitle}
          </div>

        </div>


        <div className="mt-5">
          {children}
        </div>

      </div>

    </InteractiveWrapper>

  );
}


/* =========================================================
   INTERACTIVE WRAPPER
   ---------------------------------------------------------
   IMPORTANT:
   The ref registers the REAL DOM element with the
   ARInteractionContext.

   This is required for:
   - POINT hover
   - PINCH selection
   - PINCH HOLD drag
   - TWO FINGER interaction
========================================================= */

function InteractiveWrapper({
  id,
  selected,
  onSelect,
  children,
}) {

  const {
    registerWidget,
    unregisterWidget,
    hoveredWidget,
    draggingWidget,
  } = useARInteraction();


  const elementRef = useRef(null);


  /* =======================================================
     REGISTER REAL DOM ELEMENT
  ======================================================= */

  useEffect(() => {

    const element = elementRef.current;

    if (!element) {
      return;
    }

    registerWidget(
      id,
      element
    );


    return () => {

      unregisterWidget(id);

    };

  }, [
    id,
    registerWidget,
    unregisterWidget,
  ]);


  /* =======================================================
     VISUAL INTERACTION STATES
  ======================================================= */

  const isHovered =
    hoveredWidget === id;

  const isDragging =
    draggingWidget === id;


  /* =======================================================
     WRAPPER
  ======================================================= */

  return (

    <div
      ref={elementRef}
      data-ar-widget={id}
      data-ar-interactive="true"

      onClick={() => {
        onSelect(id);
      }}

      className={`
        group
        relative
        transition-all
        duration-200

        ${
          selected
            ? "rounded-2xl ring-1 ring-cyan-400/50 shadow-[0_0_35px_rgba(34,211,238,0.08)]"
            : ""
        }

        ${
          isHovered
            ? "rounded-2xl ring-1 ring-cyan-400/30"
            : ""
        }

        ${
          isDragging
            ? "scale-[1.01] rounded-2xl ring-1 ring-cyan-300/60 shadow-[0_0_40px_rgba(34,211,238,0.12)]"
            : ""
        }
      `}
    >

      {/* =================================================
          SELECTION INDICATOR
      ================================================= */}

      {selected && (

        <div
          className="
            pointer-events-none
            absolute
            -inset-px
            z-20
            rounded-2xl
            border
            border-cyan-400/30
          "
        />

      )}


      {/* =================================================
          POINT HOVER INDICATOR
      ================================================= */}

      {isHovered && !selected && (

        <div
          className="
            pointer-events-none
            absolute
            -inset-px
            z-20
            rounded-2xl
            border
            border-cyan-400/20
          "
        />

      )}


      {/* =================================================
          DRAG INDICATOR
      ================================================= */}

      {isDragging && (

        <div
          className="
            pointer-events-none
            absolute
            left-3
            top-3
            z-30
            rounded-full
            border
            border-cyan-300/30
            bg-cyan-400/10
            px-2
            py-1
            text-[8px]
            uppercase
            tracking-wider
            text-cyan-300
          "
        >
          MOVING
        </div>

      )}


      {/* =================================================
          AR TARGET LABEL
      ================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          right-3
          top-3
          z-30
          hidden
          rounded-full
          border
          border-slate-700
          bg-slate-950/80
          px-2
          py-1
          text-[8px]
          uppercase
          tracking-wider
          text-slate-600
          transition-all
          group-hover:text-cyan-400
          sm:block
        "
      >
        AR TARGET
      </div>


      {children}

    </div>

  );
}


/* =========================================================
   PIPELINE STEP
========================================================= */

function PipelineStep({
  number,
  title,
  text,
  status,
}) {

  return (

    <div
      className="
        rounded-xl
        border
        border-slate-800
        bg-slate-900/50
        p-4
      "
    >

      <div
        className="
          flex
          items-center
          justify-between
        "
      >

        <div
          className="
            text-xs
            font-semibold
            text-cyan-400
          "
        >
          {number}
        </div>


        <div
          className="
            rounded-full
            border
            border-emerald-400/20
            bg-emerald-400/5
            px-2
            py-1
            text-[8px]
            uppercase
            tracking-wider
            text-emerald-400
          "
        >
          {status}
        </div>

      </div>


      <div
        className="
          mt-3
          font-medium
          text-white
        "
      >
        {title}
      </div>


      <div
        className="
          mt-1
          text-xs
          text-slate-500
        "
      >
        {text}
      </div>

    </div>

  );
}


/* =========================================================
   FEATURE ITEM
========================================================= */

function FeatureItem({
  icon,
  title,
  description,
}) {

  return (

    <div
      className="
        rounded-xl
        border
        border-slate-800
        bg-slate-900/40
        p-4
      "
    >

      <div
        className="
          flex
          items-center
          gap-3
        "
      >

        <div
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-lg
            border
            border-cyan-400/10
            bg-cyan-400/5
            text-cyan-300
          "
        >
          {icon}
        </div>


        <div>

          <div
            className="
              text-xs
              font-medium
              text-slate-200
            "
          >
            {title}
          </div>


          <div
            className="
              mt-1
              text-[10px]
              leading-4
              text-slate-500
            "
          >
            {description}
          </div>

        </div>

      </div>

    </div>

  );
}


/* =========================================================
   PROCESSING ROW
========================================================= */

function ProcessingRow({
  label,
  value,
}) {

  const active =
    value === "ACTIVE" ||
    value === "ONLINE";

  return (

    <div
      className="
        flex
        items-center
        justify-between
        rounded-xl
        border
        border-slate-800
        bg-slate-900/40
        px-4
        py-3
      "
    >

      <span
        className="
          text-xs
          text-slate-300
        "
      >
        {label}
      </span>


      <span
        className={`
          flex
          items-center
          gap-2
          text-[9px]
          uppercase
          tracking-wider

          ${
            active
              ? "text-emerald-400"
              : "text-cyan-400"
          }
        `}
      >

        <span
          className={`
            h-1.5
            w-1.5
            rounded-full

            ${
              active
                ? "bg-emerald-400"
                : "bg-cyan-400"
            }
          `}
        />

        {value}

      </span>

    </div>

  );
}


/* =========================================================
   TELEMETRY
========================================================= */

function Telemetry({
  label,
  value,
}) {

  return (

    <div
      className="
        min-w-[70px]
        rounded-lg
        border
        border-slate-800
        bg-slate-900/50
        px-3
        py-2
        text-center
      "
    >

      <div
        className="
          text-[8px]
          uppercase
          tracking-wider
          text-slate-600
        "
      >
        {label}
      </div>


      <div
        className="
          mt-1
          text-xs
          font-semibold
          text-cyan-300
        "
      >
        {value}

      </div>

    </div>

  );
}


/* =========================================================
   EXPORT
========================================================= */

export default VisionPage;