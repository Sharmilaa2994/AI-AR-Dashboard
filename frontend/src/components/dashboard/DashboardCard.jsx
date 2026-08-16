function DashboardCard({
  title,
  value,
  subtitle,
  icon,
  selected = false,
}) {
  return (
    <div
      className={`
        relative
        overflow-hidden
        rounded-2xl
        border
        p-5
        backdrop-blur-xl
        transition-all
        duration-300
        ${
          selected
            ? "border-cyan-400 bg-cyan-500/10 shadow-[0_0_30px_rgba(34,211,238,0.25)]"
            : "border-slate-700/70 bg-slate-900/70"
        }
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 via-transparent to-purple-500/5" />

      <div className="relative">

        <div className="mb-4 flex items-center justify-between">

          <span className="text-sm text-slate-400">
            {title}
          </span>

          <span className="text-xl">
            {icon}
          </span>

        </div>

        <div className="text-3xl font-semibold text-white">
          {value}
        </div>

        <div className="mt-2 text-xs text-slate-500">
          {subtitle}
        </div>

      </div>
    </div>
  );
}

export default DashboardCard;