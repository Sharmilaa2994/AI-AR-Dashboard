function StatusCard({ title, value, description }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <p className="text-sm text-slate-500">{title}</p>

      <h3 className="mt-2 text-2xl font-bold text-white">
        {value}
      </h3>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>
    </div>
  );
}

export default StatusCard;