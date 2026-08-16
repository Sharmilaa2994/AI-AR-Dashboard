function VirtualCursor({
  x,
  y,
  visible,
  gesture,
}) {
  if (!visible) {
    return null;
  }

  const isPinching =
    gesture === "PINCH";

  return (
    <div
      className="pointer-events-none fixed z-[9999]"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: "translate(-50%, -50%)",
      }}
    >
      {/* Outer ring */}

      <div
        className={`
          flex h-10 w-10 items-center
          justify-center rounded-full
          border-2
          transition-all duration-100
          ${
            isPinching
              ? "border-purple-400 bg-purple-400/20 scale-75"
              : "border-cyan-300 bg-cyan-400/10"
          }
        `}
      >
        {/* Center point */}

        <div
          className={`
            h-2.5 w-2.5 rounded-full
            ${
              isPinching
                ? "bg-purple-400"
                : "bg-cyan-300"
            }
          `}
        />
      </div>

      {/* Gesture label */}

      <div
        className="
          absolute left-7 top-7
          whitespace-nowrap rounded-md
          border border-slate-700
          bg-slate-950/80
          px-2 py-1
          text-[10px]
          text-slate-300
          backdrop-blur-md
        "
      >
        {gesture}
      </div>
    </div>
  );
}

export default VirtualCursor;