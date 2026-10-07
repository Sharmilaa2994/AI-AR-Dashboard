import { useState } from "react";

import ARDashboard from "../dashboard/ARDashboard";
import CameraFeed from "../vision/CameraFeed";
import VirtualCursor from "../interaction/VirtualCursor";

function ARWorkspace() {
  const [cursor, setCursor] = useState({
    x: 0,
    y: 0,
    visible: false,
    gesture: "UNKNOWN",
    confidence: 0,
  });

  const isTracking =
    cursor.visible ||
    cursor.gesture !== "UNKNOWN";

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">

      {/* =====================================================
          GLOBAL AR ATMOSPHERE
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">

        {/* Ambient gradients */}

        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_50%_15%,rgba(34,211,238,0.08),transparent_32%),radial-gradient(circle_at_85%_70%,rgba(168,85,247,0.07),transparent_30%)]
          "
        />

        {/* Technical grid */}

        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,211,238,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.05) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Center atmosphere */}

        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-[650px]
            w-[650px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-cyan-500/[0.025]
            blur-[140px]
          "
        />

        {/* Right AI atmosphere */}

        <div
          className="
            absolute
            right-[-180px]
            top-[20%]
            h-[500px]
            w-[500px]
            rounded-full
            bg-purple-500/[0.025]
            blur-[140px]
          "
        />

      </div>


      {/* =====================================================
          TOP COMMAND BAR
      ====================================================== */}

      <header
        className="
          fixed
          left-0
          right-0
          top-0
          z-50
          h-16
          border-b
          border-white/[0.06]
          bg-slate-950/70
          backdrop-blur-xl
        "
      >

        <div className="flex h-full items-center justify-between px-5">

          {/* BRAND */}

          <div className="flex items-center gap-3">

            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                border
                border-cyan-400/30
                bg-cyan-400/10
                text-cyan-300
                shadow-[0_0_25px_rgba(34,211,238,0.08)]
              "
            >
              ◇
            </div>

            <div>

              <div
                className="
                  text-sm
                  font-semibold
                  tracking-[0.22em]
                  text-white
                "
              >
                AI-ARX
              </div>

              <div
                className="
                  text-[9px]
                  uppercase
                  tracking-[0.25em]
                  text-slate-500
                "
              >
                Vision Workspace
              </div>

            </div>

          </div>


          {/* CENTER SYSTEM STATUS */}

          <div className="hidden items-center gap-3 md:flex">

            <StatusIndicator
              label="SYSTEM"
              value="ONLINE"
              active
            />

            <StatusIndicator
              label="VISION"
              value="ACTIVE"
              active={isTracking}
            />

            <StatusIndicator
              label="GESTURE"
              value={cursor.gesture}
              active={isTracking}
            />

          </div>


          {/* RIGHT SIDE */}

          <div className="flex items-center gap-3">

            <div
              className="
                hidden
                rounded-full
                border
                border-slate-700/60
                bg-slate-900/70
                px-3
                py-1.5
                text-[10px]
                uppercase
                tracking-wider
                text-slate-400
                sm:block
              "
            >
              SESSION ACTIVE
            </div>

            <div
              className="
                flex
                items-center
                gap-2
                rounded-full
                border
                border-emerald-400/20
                bg-emerald-400/5
                px-3
                py-1.5
                text-[10px]
                text-emerald-300
              "
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              LIVE
            </div>

          </div>

        </div>

      </header>


      {/* =====================================================
          LEFT COMMAND RAIL
      ====================================================== */}

      <aside
        className="
          fixed
          bottom-0
          left-0
          top-16
          z-40
          hidden
          w-[72px]
          border-r
          border-white/[0.06]
          bg-slate-950/55
          backdrop-blur-xl
          lg:flex
          lg:flex-col
          lg:items-center
          lg:py-5
        "
      >

        <RailItem
          icon="◉"
          label="HOME"
          active
        />

        <RailItem
          icon="⌁"
          label="VISION"
        />

        <RailItem
          icon="◇"
          label="OBJECT"
        />

        <RailItem
          icon="◎"
          label="GESTURE"
        />

        <div className="my-4 h-px w-8 bg-slate-800" />

        <RailItem
          icon="◌"
          label="ANALYTICS"
        />

        <RailItem
          icon="⚙"
          label="SYSTEM"
        />

      </aside>


      {/* =====================================================
          MAIN APPLICATION AREA
      ====================================================== */}

      <section
        className="
          relative
          z-10
          min-h-screen
          pt-16
          lg:pl-[72px]
        "
      >

        {/* CAMERA */}

        <div className="absolute inset-0">

          <CameraFeed
            onCursorUpdate={setCursor}
          />

        </div>


        {/* =================================================
            ADVANCED VIEWPORT FRAME
        ================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            z-20
          "
        >

          {/* Outer frame */}

          <div
            className="
              absolute
              inset-4
              rounded-2xl
              border
              border-cyan-400/[0.08]
            "
          />

          {/* Corner markers */}

          <Corner
            position="left-5 top-5"
            borders="border-l border-t"
          />

          <Corner
            position="right-5 top-5"
            borders="border-r border-t"
          />

          <Corner
            position="left-5 bottom-5"
            borders="border-l border-b"
          />

          <Corner
            position="right-5 bottom-5"
            borders="border-r border-b"
          />


          {/* TOP CENTER TITLE */}

          <div
            className="
              absolute
              left-1/2
              top-20
              -translate-x-1/2
              rounded-full
              border
              border-cyan-400/20
              bg-slate-950/65
              px-5
              py-2
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.32em]
              text-cyan-300
              backdrop-blur-md
            "
          >
            Augmented Vision Environment
          </div>


          {/* TRACKING INDICATOR */}

          <div
            className="
              absolute
              right-6
              top-20
              flex
              items-center
              gap-2
              rounded-full
              border
              border-slate-700/60
              bg-slate-950/65
              px-3
              py-2
              text-[9px]
              uppercase
              tracking-wider
              text-slate-400
              backdrop-blur-md
            "
          >

            <span
              className={`
                h-1.5
                w-1.5
                rounded-full
                ${
                  isTracking
                    ? "bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                    : "bg-slate-600"
                }
              `}
            />

            {isTracking
              ? "TRACKING"
              : "SEARCHING"}

          </div>


          {/* BOTTOM TELEMETRY */}

          <div
            className="
              absolute
              bottom-6
              left-1/2
              flex
              -translate-x-1/2
              items-center
              gap-4
              rounded-full
              border
              border-slate-700/60
              bg-slate-950/75
              px-5
              py-2
              text-[9px]
              uppercase
              tracking-wider
              text-slate-400
              backdrop-blur-xl
            "
          >

            <TelemetryItem
              label="SYSTEM"
              value="ONLINE"
              active
            />

            <Divider />

            <TelemetryItem
              label="HAND"
              value={
                isTracking
                  ? "TRACKED"
                  : "SEARCHING"
              }
            />

            <Divider />

            <TelemetryItem
              label="GESTURE"
              value={cursor.gesture}
            />

            <Divider />

            <TelemetryItem
              label="CONF"
              value={`${Math.round(
                (cursor.confidence || 0) * 100
              )}%`}
            />

          </div>

        </div>


        {/* =================================================
            DASHBOARD / INTERACTION LAYER
        ================================================== */}

        <div
          className="
            relative
            z-30
            min-h-[calc(100vh-4rem)]
            pointer-events-none
          "
        >

          <div className="pointer-events-auto">

            <ARDashboard
              cursorPosition={cursor}
            />

          </div>

        </div>


        {/* =================================================
            VIRTUAL CURSOR
        ================================================== */}

        <VirtualCursor
          cursorPosition={cursor}
        />

      </section>

    </main>
  );
}


/* =========================================================
   STATUS INDICATOR
========================================================= */

function StatusIndicator({
  label,
  value,
  active = false,
}) {
  return (
    <div className="flex items-center gap-2">

      <span
        className={`
          h-1.5
          w-1.5
          rounded-full
          ${
            active
              ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]"
              : "bg-slate-600"
          }
        `}
      />

      <span className="text-[9px] uppercase tracking-wider text-slate-500">
        {label}
      </span>

      <span className="text-[9px] font-medium text-slate-300">
        {value}
      </span>

    </div>
  );
}


/* =========================================================
   COMMAND RAIL ITEM
========================================================= */

function RailItem({
  icon,
  label,
  active = false,
}) {
  return (
    <button
      type="button"
      className={`
        group
        relative
        mb-3
        flex
        h-12
        w-12
        flex-col
        items-center
        justify-center
        rounded-xl
        border
        transition-all
        duration-200
        ${
          active
            ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
            : "border-transparent text-slate-600 hover:border-slate-700 hover:bg-slate-900 hover:text-slate-300"
        }
      `}
    >

      <span className="text-base">
        {icon}
      </span>

      <span className="mt-0.5 text-[7px] tracking-wider">
        {label}
      </span>

      {active && (
        <span
          className="
            absolute
            -right-[1px]
            top-1/2
            h-5
            w-[2px]
            -translate-y-1/2
            rounded-full
            bg-cyan-400
          "
        />
      )}

    </button>
  );
}


/* =========================================================
   CORNER MARKER
========================================================= */

function Corner({
  position,
  borders,
}) {
  return (
    <div
      className={`
        absolute
        ${position}
        h-8
        w-8
        ${borders}
        border-cyan-400/40
      `}
    />
  );
}


/* =========================================================
   TELEMETRY
========================================================= */

function TelemetryItem({
  label,
  value,
  active = false,
}) {
  return (
    <div className="flex items-center gap-1.5">

      <span className="text-slate-600">
        {label}
      </span>

      <span
        className={
          active
            ? "text-emerald-400"
            : "text-cyan-300"
        }
      >
        {value}
      </span>

    </div>
  );
}


/* =========================================================
   DIVIDER
========================================================= */

function Divider() {
  return (
    <span className="h-3 w-px bg-slate-700/70" />
  );
}


export default ARWorkspace;