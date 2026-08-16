function SystemStatus() {
  const services = [
    {
      name: "Computer Vision",
      status: "ONLINE",
    },
    {
      name: "Hand Tracking",
      status: "ACTIVE",
    },
    {
      name: "Gesture Engine",
      status: "ACTIVE",
    },
    {
      name: "Interaction Layer",
      status: "READY",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-5 backdrop-blur-xl">

      <div className="mb-5">
        <h3 className="text-sm font-medium text-white">
          System Status
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          AR platform services
        </p>
      </div>

      <div className="space-y-4">

        {services.map((service) => (
          <div
            key={service.name}
            className="flex items-center justify-between"
          >

            <div className="flex items-center gap-3">

              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]" />

              <span className="text-xs text-slate-300">
                {service.name}
              </span>

            </div>

            <span className="text-[10px] font-medium text-emerald-400">
              {service.status}
            </span>

          </div>
        ))}

      </div>

    </div>
  );
}

export default SystemStatus;