function SystemPage() {

  const services = [
    {
      name: "Backend API",
      status: "ONLINE",
    },
    {
      name: "OpenCV",
      status: "AVAILABLE",
    },
    {
      name: "MediaPipe Hand Tracking",
      status: "READY",
    },
    {
      name: "Frame Engine",
      status: "READY",
    },
    {
      name: "Object Detection",
      status: "STANDBY",
    },
  ];


  return (
    <div className="space-y-6">

      <div
        className="
          rounded-2xl
          border
          border-emerald-400/10
          bg-slate-950/80
          p-7
        "
      >

        <div
          className="
            text-[10px]
            uppercase
            tracking-[0.3em]
            text-emerald-400
          "
        >
          System Control
        </div>


        <h1 className="mt-2 text-3xl font-semibold">
          System Status
        </h1>


        <p className="mt-2 text-sm text-slate-400">
          Monitor the AI-AR workspace services and processing pipeline.
        </p>

      </div>


      {/* OVERALL */}

      <div
        className="
          rounded-2xl
          border
          border-emerald-400/20
          bg-emerald-400/[0.03]
          p-6
        "
      >

        <div className="flex items-center gap-3">

          <span
            className="
              h-3
              w-3
              rounded-full
              bg-emerald-400
              shadow-[0_0_15px_rgba(52,211,153,0.8)]
            "
          />

          <div>

            <div className="font-semibold">
              SYSTEM ONLINE
            </div>

            <div className="text-xs text-slate-500">
              AI-AR workspace operational
            </div>

          </div>

        </div>

      </div>


      {/* SERVICES */}

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
            text-emerald-300
          "
        >
          Service Monitor
        </div>


        <div className="space-y-3">

          {services.map(
            (service) => (

              <div
                key={service.name}
                className="
                  flex
                  items-center
                  justify-between
                  rounded-xl
                  border
                  border-slate-800
                  bg-slate-900/30
                  px-4
                  py-4
                "
              >

                <div className="text-sm">
                  {service.name}
                </div>


                <div
                  className="
                    flex
                    items-center
                    gap-2
                    text-xs
                    text-emerald-400
                  "
                >

                  <span
                    className="
                      h-2
                      w-2
                      rounded-full
                      bg-emerald-400
                    "
                  />

                  {service.status}

                </div>

              </div>

            )
          )}

        </div>

      </div>


      {/* SYSTEM INFO */}

      <div className="grid gap-4 md:grid-cols-3">

        <Info
          label="API"
          value="127.0.0.1:8000"
        />

        <Info
          label="FRONTEND"
          value="Vite"
        />

        <Info
          label="VISION"
          value="MediaPipe + OpenCV"
        />

      </div>

    </div>
  );
}


function Info({
  label,
  value,
}) {

  return (
    <div
      className="
        rounded-xl
        border
        border-slate-800
        bg-slate-950/80
        p-5
      "
    >

      <div className="text-[9px] text-slate-500">
        {label}
      </div>

      <div className="mt-3 text-sm text-emerald-300">
        {value}
      </div>

    </div>
  );
}


export default SystemPage;