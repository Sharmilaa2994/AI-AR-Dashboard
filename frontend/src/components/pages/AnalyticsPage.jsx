function AnalyticsPage() {

  const metrics = [
    {
      label: "FRAMES / SEC",
      value: "42",
    },
    {
      label: "PIPELINE HEALTH",
      value: "98.6%",
    },
    {
      label: "INTERACTIONS",
      value: "128",
    },
    {
      label: "LATENCY",
      value: "LOW",
    },
  ];


  const events = [
    "POINT target acquired",
    "PINCH selection detected",
    "Widget interaction complete",
    "Object detection active",
    "Vision pipeline stable",
  ];


  return (
    <div className="space-y-6">

      <PageHeader
        eyebrow="PERFORMANCE"
        title="Analytics"
        description="Monitor vision performance, interaction activity and system metrics."
      />


      {/* METRICS */}

      <div
        className="
          grid
          gap-4
          sm:grid-cols-2
          lg:grid-cols-4
        "
      >

        {metrics.map(
          (metric) => (

            <div
              key={metric.label}
              className="
                rounded-2xl
                border
                border-slate-800
                bg-slate-950/80
                p-5
              "
            >

              <div className="text-[9px] text-slate-500">
                {metric.label}
              </div>

              <div className="mt-3 text-2xl font-semibold text-cyan-300">
                {metric.value}
              </div>

            </div>

          )
        )}

      </div>


      {/* ACTIVITY */}

      <div
        className="
          rounded-2xl
          border
          border-slate-800
          bg-slate-950/80
          p-6
        "
      >

        <div
          className="
            mb-5
            text-xs
            uppercase
            tracking-[0.25em]
            text-cyan-300
          "
        >
          Recent System Events
        </div>


        <div className="space-y-3">

          {events.map(
            (event, index) => (

              <div
                key={index}
                className="
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  border
                  border-slate-800
                  bg-slate-900/30
                  px-4
                  py-3
                "
              >

                <span
                  className="
                    h-2
                    w-2
                    rounded-full
                    bg-cyan-400
                    shadow-[0_0_8px_rgba(34,211,238,0.7)]
                  "
                />

                <span className="text-sm text-slate-300">
                  {event}
                </span>

              </div>

            )
          )}

        </div>

      </div>


      {/* PERFORMANCE BARS */}

      <div
        className="
          rounded-2xl
          border
          border-slate-800
          bg-slate-950/80
          p-6
        "
      >

        <h2 className="text-sm font-semibold">
          Pipeline Performance
        </h2>


        <PerformanceBar
          label="Vision"
          value={96}
        />

        <PerformanceBar
          label="Hand Tracking"
          value={91}
        />

        <PerformanceBar
          label="Gesture Recognition"
          value={94}
        />

        <PerformanceBar
          label="Object Detection"
          value={87}
        />

      </div>

    </div>
  );
}


function PageHeader({
  eyebrow,
  title,
  description,
}) {

  return (
    <div
      className="
        rounded-2xl
        border
        border-cyan-400/10
        bg-slate-950/80
        p-7
      "
    >

      <div className="text-[10px] uppercase tracking-[0.3em] text-cyan-400">
        {eyebrow}
      </div>

      <h1 className="mt-2 text-3xl font-semibold">
        {title}
      </h1>

      <p className="mt-2 text-sm text-slate-400">
        {description}
      </p>

    </div>
  );
}


function PerformanceBar({
  label,
  value,
}) {

  return (
    <div className="mt-5">

      <div className="mb-2 flex justify-between text-xs">

        <span className="text-slate-400">
          {label}
        </span>

        <span className="text-cyan-300">
          {value}%
        </span>

      </div>


      <div
        className="
          h-2
          overflow-hidden
          rounded-full
          bg-slate-800
        "
      >

        <div
          className="
            h-full
            rounded-full
            bg-cyan-400
          "
          style={{
            width: `${value}%`,
          }}
        />

      </div>

    </div>
  );
}


export default AnalyticsPage;