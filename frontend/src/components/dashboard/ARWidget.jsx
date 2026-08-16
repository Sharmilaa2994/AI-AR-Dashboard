import { forwardRef } from "react";

const ARWidget = forwardRef(
  (
    {
      title,
      value,
      description,
      icon,
      selected = false,
      onSelect,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        onClick={onSelect}
        className={`
          group relative cursor-pointer
          overflow-hidden rounded-2xl
          border p-5
          backdrop-blur-xl
          transition-all duration-200

          ${
            selected
              ? "border-cyan-400 bg-cyan-400/10 shadow-[0_0_30px_rgba(34,211,238,0.18)] scale-[1.02]"
              : "border-slate-800 bg-slate-900/70 hover:border-cyan-500/40"
          }
        `}
      >

        {/* Glow */}

        <div
          className="
            pointer-events-none
            absolute -right-10 -top-10
            h-24 w-24
            rounded-full
            bg-cyan-400/10
            blur-2xl
          "
        />

        {/* Header */}

        <div className="relative flex items-center justify-between">

          <div className="text-xs uppercase tracking-wider text-slate-500">
            {title}
          </div>

          <div className="text-xl">
            {icon}
          </div>

        </div>

        {/* Value */}

        <div className="relative mt-4 text-3xl font-semibold text-white">
          {value}
        </div>

        {/* Description */}

        <div className="relative mt-2 text-xs text-slate-500">
          {description}
        </div>

        {/* Selection indicator */}

        {selected && (
          <div className="
            absolute right-3 bottom-3
            rounded-full
            border border-cyan-400/30
            bg-cyan-400/10
            px-2 py-1
            text-[9px]
            uppercase
            tracking-wider
            text-cyan-300
          ">
            Selected
          </div>
        )}

      </div>
    );
  }
);

ARWidget.displayName = "ARWidget";

export default ARWidget;