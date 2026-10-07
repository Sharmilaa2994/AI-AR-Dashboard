import {
  Activity,
  BrainCircuit,
  Camera,
  Cpu,
  Crosshair,
  Gauge,
  Hand,
  Radio,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";


/* =========================================================
   STATUS DOT
========================================================= */

function StatusDot({
  active = true,
  warning = false,
}) {
  return (
    <span
      className={`
        inline-block
        h-1.5
        w-1.5
        shrink-0
        rounded-full
        ${
          active
            ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]"
            : warning
            ? "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]"
            : "bg-slate-700"
        }
      `}
    />
  );
}


/* =========================================================
   METRIC
========================================================= */

function Metric({
  label,
  value,
  suffix = "",
}) {
  return (
    <div
      className="
        min-w-0
        rounded-xl
        border
        border-white/5
        bg-black/20
        px-2.5
        py-2
        sm:px-3
        sm:py-2.5
      "
    >
      <div
        className="
          truncate
          text-[7px]
          uppercase
          tracking-[0.16em]
          text-slate-600
          sm:text-[8px]
          sm:tracking-[0.18em]
        "
      >
        {label}
      </div>

      <div
        className="
          mt-1
          truncate
          text-xs
          font-semibold
          text-white
          sm:text-sm
        "
      >
        {value}

        {suffix && (
          <span
            className="
              ml-1
              text-[8px]
              text-cyan-400
              sm:text-[9px]
            "
          >
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}


/* =========================================================
   GESTURE THEME
========================================================= */

function getGestureTheme(gesture) {
  switch (gesture) {
    case "POINT":
      return {
        text: "text-cyan-300",
        border: "border-cyan-400/50",
        glow:
          "shadow-[0_0_30px_rgba(34,211,238,0.16)]",
        icon: "☝",
      };

    case "PINCH":
      return {
        text: "text-purple-300",
        border: "border-purple-400/50",
        glow:
          "shadow-[0_0_30px_rgba(168,85,247,0.16)]",
        icon: "🤏",
      };

    case "FIST":
      return {
        text: "text-rose-300",
        border: "border-rose-400/50",
        glow:
          "shadow-[0_0_30px_rgba(244,63,94,0.16)]",
        icon: "✊",
      };

    case "OPEN_PALM":
      return {
        text: "text-emerald-300",
        border: "border-emerald-400/50",
        glow:
          "shadow-[0_0_30px_rgba(52,211,153,0.16)]",
        icon: "✋",
      };

    case "TWO_FINGER":
      return {
        text: "text-amber-300",
        border: "border-amber-400/50",
        glow:
          "shadow-[0_0_30px_rgba(251,191,36,0.16)]",
        icon: "✌",
      };

    default:
      return {
        text: "text-slate-400",
        border: "border-slate-700",
        glow: "",
        icon: "◎",
      };
  }
}


/* =========================================================
   STATUS VALUE
========================================================= */

function normalizeStatus(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}


function isReady(value) {
  const normalized = normalizeStatus(value);

  return (
    normalized === "ready" ||
    normalized === "initialized" ||
    normalized === "available" ||
    normalized === "online" ||
    normalized === "active"
  );
}


/* =========================================================
   ADVANCED DASHBOARD CORE
========================================================= */

function AdvancedDashboardCore({
  cursorPosition,
  gestureStats,
  interactionCount,
  lastInteraction,
  backendStatus,
  visionStatus,
  pipelineStatus,
  selectedWidget,
  hoveredWidget,
  activeAction,
}) {
  /* =======================================================
     DERIVED STATE
  ======================================================= */

  const gesture = String(
    cursorPosition?.gesture || "UNKNOWN"
  ).toUpperCase();

  const confidence = Math.round(
    Math.max(
      0,
      Math.min(
        1,
        Number(
          cursorPosition?.confidence || 0
        )
      )
    ) * 100
  );

  const cursorActive = Boolean(
    cursorPosition?.visible
  );

  const totalGestures = Object.values(
    gestureStats || {}
  ).reduce(
    (sum, value) =>
      sum + Number(value || 0),
    0
  );

  const normalizedBackendStatus =
    String(
      backendStatus || ""
    ).toUpperCase();

  const visionReady =
    typeof visionStatus === "object"
      ? Boolean(
          visionStatus?.initialized
        )
      : Boolean(visionStatus);

  const healthScore =
    normalizedBackendStatus ===
      "ONLINE" &&
    visionReady
      ? 96
      : normalizedBackendStatus ===
        "CONNECTING"
      ? 82
      : 58;

  const theme = getGestureTheme(
    gesture
  );

  const handReady =
    isReady(
      pipelineStatus?.mediapipe
    );

  const objectReady =
    isReady(
      pipelineStatus?.object_detection
    );

  const frameReady =
    isReady(
      pipelineStatus?.frame_processing
    );

  const targetState =
    selectedWidget
      ? "LOCKED"
      : hoveredWidget
      ? "ACQUIRED"
      : "SEARCH";


  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      className="
        relative
        h-full
        min-h-0
        w-full
        overflow-hidden
        bg-gradient-to-br
        from-slate-950
        via-[#030a18]
        to-slate-950
        text-white
      "
    >

      {/* ===================================================
          RESPONSIVE BACKGROUND GRID
      =================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.035]
          sm:opacity-[0.045]
        "
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(34,211,238,0.8) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(34,211,238,0.8) 1px,
              transparent 1px
            )
          `,
          backgroundSize:
            "clamp(32px, 5vw, 50px) clamp(32px, 5vw, 50px)",
        }}
      />


      {/* ===================================================
          ATMOSPHERIC GLOW
      =================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-40
          w-40
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-cyan-400/[0.035]
          blur-3xl
          sm:h-56
          sm:w-56
          lg:h-72
          lg:w-72
        "
      />


      {/* ===================================================
          TOP BAR
      =================================================== */}

      <div
        className="
          absolute
          left-2
          right-2
          top-2
          z-20
          sm:left-3
          sm:right-3
          sm:top-3
          lg:left-4
          lg:right-4
          lg:top-4
        "
      >
        <div
          className="
            flex
            min-w-0
            items-center
            justify-between
            gap-2
            rounded-xl
            border
            border-white/5
            bg-slate-950/85
            px-2.5
            py-2
            backdrop-blur-xl
            sm:rounded-2xl
            sm:px-4
            sm:py-3
          "
        >

          {/* BRAND */}

          <div
            className="
              flex
              min-w-0
              items-center
              gap-2
              sm:gap-3
            "
          >

            <div
              className="
                flex
                h-7
                w-7
                shrink-0
                items-center
                justify-center
                rounded-lg
                border
                border-cyan-400/20
                bg-cyan-400/5
                sm:h-8
                sm:w-8
                sm:rounded-xl
              "
            >
              <BrainCircuit
                size={14}
                className="text-cyan-300 sm:h-[15px] sm:w-[15px]"
              />
            </div>

            <div className="min-w-0">

              <div
                className="
                  hidden
                  truncate
                  text-[7px]
                  uppercase
                  tracking-[0.2em]
                  text-cyan-400
                  xs:block
                  sm:text-[8px]
                  sm:tracking-[0.25em]
                "
              >
                AI Spatial Interface
              </div>

              <div
                className="
                  truncate
                  text-[10px]
                  font-semibold
                  text-white
                  sm:text-xs
                "
              >
                AURA CORE
              </div>

            </div>

          </div>


          {/* DESKTOP TELEMETRY */}

          <div
            className="
              hidden
              items-center
              gap-3
              md:flex
              lg:gap-5
            "
          >

            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              <StatusDot
                active={
                  normalizedBackendStatus ===
                  "ONLINE"
                }
                warning={
                  normalizedBackendStatus ===
                  "CONNECTING"
                }
              />

              <span
                className="
                  text-[8px]
                  uppercase
                  tracking-wider
                  text-slate-500
                "
              >
                Backend
              </span>

              <span
                className={`
                  text-[8px]
                  font-semibold
                  ${
                    normalizedBackendStatus ===
                    "ONLINE"
                      ? "text-emerald-300"
                      : normalizedBackendStatus ===
                        "CONNECTING"
                      ? "text-amber-300"
                      : "text-rose-300"
                  }
                `}
              >
                {normalizedBackendStatus ||
                  "UNKNOWN"}
              </span>
            </div>


            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              <Radio
                size={11}
                className="text-cyan-400"
              />

              <span
                className="
                  text-[8px]
                  uppercase
                  tracking-wider
                  text-slate-500
                "
              >
                Spatial
              </span>

              <span
                className={`
                  text-[8px]
                  font-semibold
                  ${
                    cursorActive
                      ? "text-cyan-300"
                      : "text-slate-500"
                  }
                `}
              >
                {cursorActive
                  ? "ACTIVE"
                  : "STANDBY"}
              </span>
            </div>


            <div
              className="
                rounded-lg
                border
                border-emerald-400/10
                bg-emerald-400/5
                px-2.5
                py-1.5
              "
            >
              <span
                className="
                  text-[8px]
                  font-semibold
                  text-emerald-300
                "
              >
                HEALTH {healthScore}%
              </span>
            </div>

          </div>


          {/* MOBILE STATUS */}

          <div
            className="
              flex
              items-center
              gap-1.5
              md:hidden
            "
          >
            <StatusDot
              active={
                normalizedBackendStatus ===
                "ONLINE"
              }
              warning={
                normalizedBackendStatus ===
                "CONNECTING"
              }
            />

            <span
              className="
                text-[7px]
                font-semibold
                uppercase
                tracking-wider
                text-slate-400
                sm:text-[8px]
              "
            >
              {normalizedBackendStatus ||
                "WAITING"}
            </span>
          </div>

        </div>
      </div>


      {/* ===================================================
          LEFT VISION PANEL — DESKTOP
      =================================================== */}

      <div
        className="
          absolute
          left-3
          top-[76px]
          z-10
          hidden
          w-[200px]
          xl:block
          2xl:left-4
          2xl:w-56
        "
      >
        <div
          className="
            rounded-2xl
            border
            border-white/5
            bg-slate-950/75
            p-3
            backdrop-blur-xl
            2xl:p-4
          "
        >

          <div
            className="
              mb-3
              flex
              items-center
              justify-between
            "
          >
            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              <ScanLine
                size={13}
                className="text-cyan-400"
              />

              <span
                className="
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-cyan-300
                "
              >
                Vision Core
              </span>
            </div>

            <StatusDot
              active={
                normalizedBackendStatus ===
                "ONLINE"
              }
            />
          </div>


          <div className="space-y-2">

            {/* CAMERA */}

            <div
              className="
                flex
                items-center
                justify-between
                gap-2
                rounded-lg
                border
                border-white/5
                bg-black/20
                px-2.5
                py-2
              "
            >
              <div
                className="
                  flex
                  min-w-0
                  items-center
                  gap-2
                "
              >
                <Camera
                  size={11}
                  className="shrink-0 text-slate-400"
                />

                <span
                  className="
                    truncate
                    text-[8px]
                    text-slate-300
                  "
                >
                  Camera
                </span>
              </div>

              <span
                className="
                  shrink-0
                  text-[7px]
                  text-emerald-400
                "
              >
                CONNECTED
              </span>
            </div>


            {/* HAND */}

            <div
              className="
                flex
                items-center
                justify-between
                gap-2
                rounded-lg
                border
                border-white/5
                bg-black/20
                px-2.5
                py-2
              "
            >
              <div
                className="
                  flex
                  min-w-0
                  items-center
                  gap-2
                "
              >
                <Hand
                  size={11}
                  className="shrink-0 text-cyan-400"
                />

                <span
                  className="
                    truncate
                    text-[8px]
                    text-slate-300
                  "
                >
                  Hand Tracking
                </span>
              </div>

              <span
                className={`
                  shrink-0
                  text-[7px]
                  ${
                    handReady
                      ? "text-emerald-400"
                      : "text-amber-400"
                  }
                `}
              >
                {handReady
                  ? "READY"
                  : "SYNC"}
              </span>
            </div>


            {/* OBJECT */}

            <div
              className="
                flex
                items-center
                justify-between
                gap-2
                rounded-lg
                border
                border-white/5
                bg-black/20
                px-2.5
                py-2
              "
            >
              <div
                className="
                  flex
                  min-w-0
                  items-center
                  gap-2
                "
              >
                <Target
                  size={11}
                  className="shrink-0 text-purple-400"
                />

                <span
                  className="
                    truncate
                    text-[8px]
                    text-slate-300
                  "
                >
                  Object Detection
                </span>
              </div>

              <span
                className={`
                  shrink-0
                  text-[7px]
                  ${
                    objectReady
                      ? "text-emerald-400"
                      : "text-amber-400"
                  }
                `}
              >
                {objectReady
                  ? "READY"
                  : "STANDBY"}
              </span>
            </div>


            {/* FRAME ENGINE */}

            <div
              className="
                flex
                items-center
                justify-between
                gap-2
                rounded-lg
                border
                border-white/5
                bg-black/20
                px-2.5
                py-2
              "
            >
              <div
                className="
                  flex
                  min-w-0
                  items-center
                  gap-2
                "
              >
                <Cpu
                  size={11}
                  className="shrink-0 text-amber-400"
                />

                <span
                  className="
                    truncate
                    text-[8px]
                    text-slate-300
                  "
                >
                  Frame Engine
                </span>
              </div>

              <span
                className={`
                  shrink-0
                  text-[7px]
                  ${
                    frameReady
                      ? "text-emerald-400"
                      : "text-cyan-300"
                  }
                `}
              >
                {frameReady
                  ? "READY"
                  : "SYNC"}
              </span>
            </div>

          </div>
        </div>
      </div>


      {/* ===================================================
          RIGHT AI INSIGHT — DESKTOP
      =================================================== */}

      <div
        className="
          absolute
          right-3
          top-[76px]
          z-10
          hidden
          w-[200px]
          xl:block
          2xl:right-4
          2xl:w-56
        "
      >
        <div
          className="
            rounded-2xl
            border
            border-purple-400/10
            bg-slate-950/75
            p-3
            backdrop-blur-xl
            2xl:p-4
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
                flex
                items-center
                gap-2
              "
            >
              <Sparkles
                size={13}
                className="text-purple-300"
              />

              <span
                className="
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-purple-300
                "
              >
                AI Insight
              </span>
            </div>

            <span
              className="
                rounded-full
                border
                border-purple-400/15
                bg-purple-400/5
                px-2
                py-1
                text-[7px]
                text-purple-300
              "
            >
              LIVE
            </span>
          </div>


          <div
            className="
              mt-3
              rounded-xl
              border
              border-purple-400/10
              bg-purple-400/[0.03]
              p-3
            "
          >
            <div
              className="
                text-[7px]
                uppercase
                tracking-[0.2em]
                text-slate-600
              "
            >
              Current Intent
            </div>

            <div
              className="
                mt-1
                truncate
                text-lg
                font-semibold
                text-white
              "
            >
              {gesture}
            </div>

            <div
              className="
                mt-1
                text-[8px]
                text-slate-500
              "
            >
              {cursorActive
                ? "Spatial tracking active"
                : "Waiting for input"}
            </div>
          </div>


          <div
            className="
              mt-2
              grid
              grid-cols-2
              gap-2
            "
          >
            <Metric
              label="Confidence"
              value={confidence}
              suffix="%"
            />

            <Metric
              label="Events"
              value={
                interactionCount || 0
              }
            />
          </div>


          <div
            className="
              mt-2
              rounded-xl
              border
              border-white/5
              bg-black/20
              p-3
            "
          >
            <div
              className="
                text-[7px]
                uppercase
                tracking-[0.18em]
                text-slate-600
              "
            >
              Active Target
            </div>

            <div
              className="
                mt-1
                truncate
                text-[10px]
                font-medium
                text-cyan-300
              "
            >
              {selectedWidget ||
                hoveredWidget ||
                "SEARCHING"}
            </div>
          </div>

        </div>
      </div>


      {/* ===================================================
          MOBILE / TABLET STATUS STRIP

          This replaces the desktop side panels on
          screens below xl.
      =================================================== */}

      <div
        className="
          absolute
          left-2
          right-2
          top-[60px]
          z-10
          md:left-3
          md:right-3
          md:top-[68px]
          xl:hidden
        "
      >
        <div
          className="
            grid
            grid-cols-3
            gap-1.5
            rounded-xl
            border
            border-white/5
            bg-slate-950/75
            p-1.5
            backdrop-blur-xl
            sm:gap-2
            sm:p-2
          "
        >

          {/* HAND */}

          <div
            className="
              flex
              min-w-0
              items-center
              gap-1.5
              rounded-lg
              border
              border-white/5
              bg-black/20
              px-2
              py-1.5
              sm:gap-2
              sm:px-2.5
            "
          >
            <Hand
              size={11}
              className="
                shrink-0
                text-cyan-400
                sm:h-3
                sm:w-3
              "
            />

            <div className="min-w-0">
              <div
                className="
                  hidden
                  text-[6px]
                  uppercase
                  tracking-wider
                  text-slate-600
                  sm:block
                "
              >
                Hand
              </div>

              <div
                className={`
                  truncate
                  text-[7px]
                  font-medium
                  sm:text-[8px]
                  ${
                    handReady
                      ? "text-emerald-300"
                      : "text-amber-300"
                  }
                `}
              >
                {handReady
                  ? "READY"
                  : "SYNC"}
              </div>
            </div>
          </div>


          {/* TARGET */}

          <div
            className="
              flex
              min-w-0
              items-center
              gap-1.5
              rounded-lg
              border
              border-white/5
              bg-black/20
              px-2
              py-1.5
              sm:gap-2
              sm:px-2.5
            "
          >
            <Target
              size={11}
              className="
                shrink-0
                text-purple-400
                sm:h-3
                sm:w-3
              "
            />

            <div className="min-w-0">
              <div
                className="
                  hidden
                  text-[6px]
                  uppercase
                  tracking-wider
                  text-slate-600
                  sm:block
                "
              >
                Target
              </div>

              <div
                className="
                  truncate
                  text-[7px]
                  font-medium
                  text-purple-300
                  sm:text-[8px]
                "
              >
                {targetState}
              </div>
            </div>
          </div>


          {/* AI */}

          <div
            className="
              flex
              min-w-0
              items-center
              gap-1.5
              rounded-lg
              border
              border-white/5
              bg-black/20
              px-2
              py-1.5
              sm:gap-2
              sm:px-2.5
            "
          >
            <Sparkles
              size={11}
              className="
                shrink-0
                text-purple-300
                sm:h-3
                sm:w-3
              "
            />

            <div className="min-w-0">
              <div
                className="
                  hidden
                  text-[6px]
                  uppercase
                  tracking-wider
                  text-slate-600
                  sm:block
                "
              >
                Intent
              </div>

              <div
                className="
                  truncate
                  text-[7px]
                  font-medium
                  text-white
                  sm:text-[8px]
                "
              >
                {gesture}
              </div>
            </div>
          </div>

        </div>
      </div>


      {/* ===================================================
          CENTER SPATIAL HUD
      =================================================== */}

      <div
        className="
          absolute
          left-1/2
          top-1/2
          z-10
          -translate-x-1/2
          -translate-y-1/2
        "
      >

        <div
          className="
            relative
            flex
            h-[clamp(130px,28vw,192px)]
            w-[clamp(130px,28vw,192px)]
            items-center
            justify-center
          "
        >

          {/* OUTER RING */}

          <div
            className="
              absolute
              inset-0
              rounded-full
              border
              border-cyan-400/10
            "
          />

          {/* SECOND RING */}

          <div
            className="
              absolute
              inset-[10%]
              rounded-full
              border
              border-cyan-400/10
            "
          />

          {/* INNER RING */}

          <div
            className="
              absolute
              inset-[20%]
              rounded-full
              border
              border-cyan-400/10
            "
          />


          {/* CROSSHAIR HORIZONTAL */}

          <div
            className="
              pointer-events-none
              absolute
              h-px
              w-full
              bg-cyan-400/10
            "
          />


          {/* CROSSHAIR VERTICAL */}

          <div
            className="
              pointer-events-none
              absolute
              h-full
              w-px
              bg-cyan-400/10
            "
          />


          {/* CENTER CORE */}

          <div
            className={`
              relative
              flex
              h-[clamp(48px,11vw,64px)]
              w-[clamp(48px,11vw,64px)]
              items-center
              justify-center
              rounded-full
              border
              bg-slate-950/90
              transition-all
              duration-300
              ${theme.border}
              ${theme.glow}
            `}
          >

            <div
              className="
                absolute
                inset-[14%]
                rounded-full
                border
                border-white/5
              "
            />

            {cursorActive ? (
              <span
                className="
                  relative
                  z-10
                  text-lg
                  sm:text-xl
                "
              >
                {theme.icon}
              </span>
            ) : (
              <Crosshair
                size={20}
                className="
                  text-cyan-300
                  sm:h-[22px]
                  sm:w-[22px]
                "
              />
            )}

          </div>

        </div>


        {/* GESTURE LABEL */}

        <div
          className={`
            mt-1
            whitespace-nowrap
            text-center
            text-[7px]
            uppercase
            tracking-[0.22em]
            sm:text-[8px]
            sm:tracking-[0.3em]
            ${theme.text}
          `}
        >
          {cursorActive
            ? `${gesture} TARGET`
            : "SPATIAL TARGETING"}
        </div>


        {/* TARGET STATE */}

        <div
          className="
            mt-1
            whitespace-nowrap
            text-center
            text-[6px]
            uppercase
            tracking-wider
            text-slate-600
            sm:text-[7px]
          "
        >
          {selectedWidget
            ? "TARGET LOCKED"
            : hoveredWidget
            ? "TARGET ACQUIRED"
            : "SEARCHING"}
        </div>

      </div>


      {/* ===================================================
          ACTIVE ACTION INDICATOR
      =================================================== */}

      {activeAction && (
        <div
          className="
            absolute
            left-1/2
            top-[calc(50%+115px)]
            z-20
            w-[min(85%,280px)]
            -translate-x-1/2
            rounded-xl
            border
            border-cyan-400/15
            bg-slate-950/85
            px-3
            py-2
            text-center
            backdrop-blur-xl
            sm:top-[calc(50%+125px)]
          "
        >
          <div
            className="
              flex
              items-center
              justify-center
              gap-2
            "
          >
            <Activity
              size={11}
              className="text-cyan-400"
            />

            <span
              className="
                text-[7px]
                uppercase
                tracking-[0.18em]
                text-cyan-300
              "
            >
              Active Action
            </span>
          </div>

          <div
            className="
              mt-1
              truncate
              text-[9px]
              font-medium
              text-white
            "
          >
            {activeAction?.message ||
              activeAction?.title ||
              "Action active"}
          </div>
        </div>
      )}


      {/* ===================================================
          BOTTOM TELEMETRY
      =================================================== */}

      <div
        className="
          absolute
          bottom-2
          left-2
          right-2
          z-20
          sm:bottom-3
          sm:left-3
          sm:right-3
          lg:bottom-4
          lg:left-4
          lg:right-4
        "
      >

        <div
          className="
            rounded-xl
            border
            border-white/5
            bg-slate-950/85
            p-2
            backdrop-blur-xl
            sm:rounded-2xl
            sm:p-3
          "
        >

          {/* METRICS */}

          <div
            className="
              grid
              grid-cols-2
              gap-1.5
              sm:gap-2
              md:grid-cols-4
            "
          >

            <Metric
              label="Gesture Events"
              value={totalGestures}
            />

            <Metric
              label="Interaction"
              value={
                interactionCount || 0
              }
            />

            <Metric
              label="Target"
              value={targetState}
            />

            <Metric
              label="Health"
              value={healthScore}
              suffix="%"
            />

          </div>


          {/* EVENT STREAM */}

          <div
            className="
              mt-2
              flex
              min-w-0
              items-center
              justify-between
              gap-2
              border-t
              border-white/5
              pt-2
            "
          >

            <div
              className="
                flex
                min-w-0
                items-center
                gap-1.5
              "
            >

              <Activity
                size={10}
                className="
                  shrink-0
                  text-cyan-400
                "
              />

              <span
                className="
                  hidden
                  shrink-0
                  text-[7px]
                  uppercase
                  tracking-[0.18em]
                  text-slate-600
                  sm:block
                "
              >
                Event Stream
              </span>

              <span
                className="
                  min-w-0
                  truncate
                  text-[7px]
                  text-slate-400
                  sm:text-[8px]
                "
              >
                {lastInteraction ||
                  "Waiting for input..."}
              </span>

            </div>


            <div
              className="
                flex
                shrink-0
                items-center
                gap-1.5
              "
            >

              <Gauge
                size={10}
                className="text-emerald-400"
              />

              <span
                className="
                  hidden
                  text-[7px]
                  uppercase
                  tracking-wider
                  text-emerald-400
                  sm:inline
                "
              >
                REAL-TIME
              </span>

              <ShieldCheck
                size={10}
                className="text-emerald-400"
              />

            </div>

          </div>

        </div>

      </div>


      {/* ===================================================
          CORNER MARKERS
      =================================================== */}

      <div
        className="
          absolute
          left-2
          top-14
          h-5
          w-5
          border-l
          border-t
          border-cyan-400/20
          sm:left-3
          sm:top-16
          sm:h-7
          sm:w-7
        "
      />

      <div
        className="
          absolute
          right-2
          top-14
          h-5
          w-5
          border-r
          border-t
          border-cyan-400/20
          sm:right-3
          sm:top-16
          sm:h-7
          sm:w-7
        "
      />

      <div
        className="
          absolute
          bottom-14
          left-2
          h-5
          w-5
          border-b
          border-l
          border-cyan-400/20
          sm:bottom-16
          sm:left-3
          sm:h-7
          sm:w-7
        "
      />

      <div
        className="
          absolute
          bottom-14
          right-2
          h-5
          w-5
          border-b
          border-r
          border-cyan-400/20
          sm:bottom-16
          sm:right-3
          sm:h-7
          sm:w-7
        "
      />

    </div>
  );
}


export default AdvancedDashboardCore;