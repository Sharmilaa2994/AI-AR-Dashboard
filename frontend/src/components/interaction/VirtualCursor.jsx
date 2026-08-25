function VirtualCursor({
  cursorPosition,
}) {

  if (
    !cursorPosition ||
    !cursorPosition.visible
  ) {
    return null;
  }


  const {
    x,
    y,
  } = cursorPosition;


  if (
    typeof x !== "number" ||
    typeof y !== "number"
  ) {
    return null;
  }


  return (
    <div
      className="
        pointer-events-none
        fixed
        z-[9999]
        h-6
        w-6
        -translate-x-1/2
        -translate-y-1/2
        rounded-full
        border-2
        border-cyan-300
        bg-cyan-400/40
        shadow-[0_0_20px_rgba(34,211,238,0.8)]
      "
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
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
          bg-cyan-200
        "
      />
    </div>
  );
}


export default VirtualCursor;