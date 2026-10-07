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
  });

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">

      {/* =====================================================
          FUTURISTIC AR BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">

        {/* BASE ATMOSPHERE */}

        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_50%_20%,rgba(34,211,238,0.08),transparent_35%),radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.06),transparent_35%)]
          "
        />

        {/* MOVING GRID */}

        <div
          className="
            ar-grid-animation
            absolute
            inset-0
            opacity-30
          "
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,211,238,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.06) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        {/* CENTER GLOW */}

        <div
          className="
            ar-pulse-glow
            absolute
            left-1/2
            top-1/3
            h-[500px]
            w-[500px]
            -translate-x-1/2
            rounded-full
            bg-cyan-500/5
            blur-[120px]
          "
        />

        {/* PURPLE AMBIENT GLOW */}

        <div
          className="
            ar-pulse-glow
            absolute
            right-[-150px]
            top-[20%]
            h-[400px]
            w-[400px]
            rounded-full
            bg-purple-500/5
            blur-[120px]
          "
          style={{
            animationDelay: "1.5s",
          }}
        />

        {/* =================================================
            SCANNING LINE
        ================================================== */}

        <div
          className="
            ar-scan-animation
            absolute
            left-0
            top-0
            h-[2px]
            w-full
            bg-gradient-to-r
            from-transparent
            via-cyan-400/40
            to-transparent
            blur-[1px]
          "
        />

        {/* =================================================
            FLOATING HUD LIGHTS
        ================================================== */}

        <div
          className="
            ar-float
            absolute
            left-[8%]
            top-[25%]
            h-1
            w-1
            rounded-full
            bg-cyan-400
            shadow-[0_0_15px_rgba(34,211,238,0.9)]
          "
        />

        <div
          className="
            ar-float
            absolute
            left-[85%]
            top-[35%]
            h-1.5
            w-1.5
            rounded-full
            bg-purple-400
            shadow-[0_0_15px_rgba(168,85,247,0.9)]
          "
          style={{
            animationDelay: "1s",
          }}
        />

        <div
          className="
            ar-float
            absolute
            left-[15%]
            top-[70%]
            h-1
            w-1
            rounded-full
            bg-cyan-300
            shadow-[0_0_12px_rgba(103,232,249,0.8)]
          "
          style={{
            animationDelay: "2s",
          }}
        />

        <div
          className="
            ar-float
            absolute
            right-[12%]
            top-[75%]
            h-1
            w-1
            rounded-full
            bg-purple-300
            shadow-[0_0_12px_rgba(216,180,254,0.8)]
          "
          style={{
            animationDelay: "3s",
          }}
        />

      </div>


      {/* =====================================================
          CAMERA LAYER
      ====================================================== */}

      <div className="absolute inset-0 z-0">

        <CameraFeed
          onCursorUpdate={setCursor}
        />

      </div>


      {/* =====================================================
          DASHBOARD LAYER
      ====================================================== */}

      <div className="relative z-10 min-h-screen">

        <ARDashboard
          cursorPosition={cursor}
        />

      </div>


      {/* =====================================================
          VIRTUAL CURSOR
      ====================================================== */}

      <VirtualCursor
        cursorPosition={cursor}
      />

    </div>
  );
}

export default ARWorkspace;