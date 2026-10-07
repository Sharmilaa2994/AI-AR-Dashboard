import { useEffect, useRef, useState } from "react";

function VirtualCursor({ cursorPosition }) {
  const [pulse, setPulse] = useState(false);

  const previousGestureRef = useRef("UNKNOWN");

  const normalizedGesture =
    String(
      cursorPosition?.gesture || "UNKNOWN"
    ).toUpperCase();

  useEffect(() => {
    if (
      previousGestureRef.current !==
      normalizedGesture
    ) {
      setPulse(true);

      const timer = setTimeout(() => {
        setPulse(false);
      }, 260);

      previousGestureRef.current =
        normalizedGesture;

      return () => clearTimeout(timer);
    }
  }, [normalizedGesture]);


  if (
    !cursorPosition ||
    !cursorPosition.visible
  ) {
    return null;
  }

  const {
    x,
    y,
    confidence = 0,
  } = cursorPosition;

  if (
    typeof x !== "number" ||
    typeof y !== "number"
  ) {
    return null;
  }

  const confidencePercent = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        Number(confidence || 0) * 100
      )
    )
  );

  /*
   * POINT is the normal targeting state.
   * PINCH represents selection.
   */

  const isPoint =
    normalizedGesture === "POINT";

  const isPinch =
    normalizedGesture === "PINCH";


  return (
    <div
      className="
        pointer-events-none
        fixed
        z-[9999]
        select-none
      "
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform:
          "translate(-50%, -50%)",
      }}
    >

      {/* =================================================
          OUTER ENERGY RING
      ================================================== */}

      <div
        className={`
          absolute
          left-1/2
          top-1/2
          h-16
          w-16
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          border
          transition-all
          duration-200
          ${
            isPinch
              ? "scale-110 border-purple-300/80"
              : "border-cyan-300/25"
          }
        `}
      />


      {/* =================================================
          ROTATING TARGET RING
      ================================================== */}

      <div
        className={`
          absolute
          left-1/2
          top-1/2
          h-12
          w-12
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          border
          border-dashed
          transition-all
          duration-200
          ${
            isPinch
              ? "animate-spin border-purple-300"
              : "animate-[spin_5s_linear_infinite] border-cyan-300/60"
          }
        `}
      />


      {/* =================================================
          TARGET CROSSHAIR
      ================================================== */}

      <div className="absolute left-1/2 top-1/2">

        {/* Vertical */}

        <div
          className="
            absolute
            left-1/2
            top-[-22px]
            h-3
            w-px
            -translate-x-1/2
            bg-cyan-300/80
          "
        />

        <div
          className="
            absolute
            left-1/2
            top-[9px]
            h-3
            w-px
            -translate-x-1/2
            bg-cyan-300/80
          "
        />

        {/* Horizontal */}

        <div
          className="
            absolute
            left-[-22px]
            top-1/2
            h-px
            w-3
            -translate-y-1/2
            bg-cyan-300/80
          "
        />

        <div
          className="
            absolute
            left-[9px]
            top-1/2
            h-px
            w-3
            -translate-y-1/2
            bg-cyan-300/80
          "
        />

      </div>


      {/* =================================================
          CORE
      ================================================== */}

      <div
        className={`
          relative
          flex
          h-7
          w-7
          items-center
          justify-center
          rounded-full
          border-2
          transition-all
          duration-200
          ${
            isPinch
              ? "scale-90 border-purple-200 bg-purple-400/40 shadow-[0_0_30px_rgba(168,85,247,0.9)]"
              : "border-cyan-200 bg-cyan-400/25 shadow-[0_0_25px_rgba(34,211,238,0.85)]"
          }
          ${
            pulse
              ? "scale-125"
              : "scale-100"
          }
        `}
      >

        <div
          className={`
            h-2
            w-2
            rounded-full
            ${
              isPinch
                ? "bg-purple-100"
                : "bg-cyan-100"
            }
          `}
        />

      </div>


      {/* =================================================
          CONFIDENCE ARC
      ================================================== */}

      <div
        className="
          absolute
          left-1/2
          top-1/2
          h-[52px]
          w-[52px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          border
          border-transparent
        "
        style={{
          background: `
            conic-gradient(
              rgba(103,232,249,0.85)
              ${confidencePercent}%,
              transparent ${confidencePercent}%
            )
          `,
          mask:
            "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 0)",
          WebkitMask:
            "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 0)",
        }}
      />


      {/* =================================================
          TARGET LABEL
      ================================================== */}

      <div
        className="
          absolute
          left-8
          top-[-18px]
          whitespace-nowrap
          rounded-md
          border
          border-cyan-400/20
          bg-slate-950/80
          px-2.5
          py-1.5
          text-[9px]
          uppercase
          tracking-[0.16em]
          text-cyan-200
          shadow-lg
          backdrop-blur-md
        "
      >

        <div className="flex items-center gap-2">

          <span
            className={`
              h-1.5
              w-1.5
              rounded-full
              ${
                isPinch
                  ? "bg-purple-400"
                  : "bg-cyan-400"
              }
            `}
          />

          <span>
            {isPinch
              ? "SELECT"
              : "TARGET"}
          </span>

        </div>

      </div>


      {/* =================================================
          CONFIDENCE LABEL
      ================================================== */}

      <div
        className="
          absolute
          left-8
          top-[6px]
          whitespace-nowrap
          text-[8px]
          font-medium
          tracking-wider
          text-slate-500
        "
      >
        {confidencePercent}% CONF
      </div>


      {/* =================================================
          PINCH SELECTION RINGS
      ================================================== */}

      {isPinch && (
        <>
          <div
            className="
              absolute
              left-1/2
              top-1/2
              h-20
              w-20
              -translate-x-1/2
              -translate-y-1/2
              animate-ping
              rounded-full
              border
              border-purple-400/40
            "
          />

          <div
            className="
              absolute
              left-1/2
              top-1/2
              h-24
              w-24
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              border
              border-purple-400/20
            "
          />
        </>
      )}

    </div>
  );
}

export default VirtualCursor;