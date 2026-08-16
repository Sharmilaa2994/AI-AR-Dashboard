function PerformanceChart() {
  const data = [
    42,
    55,
    48,
    68,
    61,
    78,
    72,
    88,
    81,
    94,
  ];

  const max = Math.max(...data);

  return (
    <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-5 backdrop-blur-xl">

      <div className="mb-6 flex items-center justify-between">

        <div>
          <h3 className="text-sm font-medium text-white">
            Performance
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Real-time system analytics
          </p>
        </div>

        <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
          LIVE
        </div>

      </div>

      <div className="flex h-44 items-end gap-2">

        {data.map((value, index) => (
          <div
            key={index}
            className="group relative flex h-full flex-1 items-end"
          >
            <div
              className="w-full rounded-t-md bg-cyan-400/70 transition-all duration-300 group-hover:bg-cyan-300"
              style={{
                height: `${(value / max) * 100}%`,
              }}
            />

            <span className="absolute -top-5 left-1/2 hidden -translate-x-1/2 text-[10px] text-slate-400 group-hover:block">
              {value}
            </span>
          </div>
        ))}

      </div>

      <div className="mt-4 flex justify-between text-[10px] text-slate-600">
        <span>10:00</span>
        <span>12:00</span>
        <span>14:00</span>
        <span>16:00</span>
        <span>Now</span>
      </div>

    </div>
  );
}

export default PerformanceChart;