function ARWidget({
  title,
  value,
  description,
  icon,
  selected = false,
  onSelect,
}) {
  return (
    <div
      onClick={onSelect}
      className={`
        group relative cursor-pointer
        rounded-2xl border p-5
        backdrop-blur-xl
        transition-all duration-300
        ${
          selected
            ? "scale-[1.03] border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-500/20"
            : "border-slate-700/70 bg-slate-900/60 hover:border-cyan-400/50"
        }
      `}
    >
      {/* Selection indicator */}

      {selected && (
        <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400 text-xs font-bold text-slate-950">
          ✓
        </div>
      )}

      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-white">
            {value}
          </p>
        </div>

        <div className="text-2xl">
          {icon}
        </div>
      </div>

      {/* Description */}

      <p className="mt-3 text-sm text-slate-400">
        {description}
      </p>

      {/* AR highlight */}

      <div
        className={`
          pointer-events-none absolute inset-0 rounded-2xl
          transition-opacity duration-300
          ${
            selected
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100"
          }
        `}
      >
        <div className="absolute inset-0 rounded-2xl border border-cyan-400/30" />
      </div>
    </div>
  );
}

export default ARWidget;