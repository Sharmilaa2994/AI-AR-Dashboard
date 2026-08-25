function GestureStatus({ gesture = "UNKNOWN", confidence = 0 }) {
  const normalizedGesture =
    String(gesture).toUpperCase();

  const percentage = Math.round(
    Math.max(0, Math.min(1, Number(confidence))) * 100
  );

  const isPoint =
    normalizedGesture === "POINT";

  const isPinch =
    normalizedGesture === "PINCH";

  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-800
        bg-slate-900/70
        p-5
        backdrop-blur-xl
      "
    >
      <div
        className="
          text-[10px]
          uppercase
          tracking-[0.2em]
          text-cyan-400
        "
      >
        Gesture Status
      </div>

      <div
        className="
          mt-4
          flex
          items-center
          justify-between
        "
      >
        <div className="flex items-center gap-3">

          <span
            className={`
              h-3
              w-3
              rounded-full
              ${
                isPinch
                  ? "bg-purple-400"
                  : isPoint
                    ? "bg-cyan-400"
                    : "bg-slate-600"
              }
            `}
          />

          <span
            className="
              text-lg
              font-semibold
              text-white
            "
          >
            {normalizedGesture}
          </span>

        </div>

        <span
          className="
            text-sm
            text-slate-400
          "
        >
          {percentage}%
        </span>

      </div>

      <div
        className="
          mt-4
          h-2
          overflow-hidden
          rounded-full
          bg-slate-800
        "
      >
        <div
          className={`
            h-full
            rounded-full
            transition-all
            duration-200
            ${
              isPinch
                ? "bg-purple-400"
                : isPoint
                  ? "bg-cyan-400"
                  : "bg-slate-600"
            }
          `}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

      <div
        className="
          mt-3
          text-xs
          text-slate-500
        "
      >
        {isPoint
          ? "Widget targeting active"
          : isPinch
            ? "Selection gesture detected"
            : "Waiting for hand gesture"}
      </div>
    </div>
  );
}

export default GestureStatus;