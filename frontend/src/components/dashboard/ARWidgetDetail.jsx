function ARWidgetDetail({ action, onClose }) {
  if (!action) {
    return null;
  }

  const getDetails = () => {
    switch (action.type) {
      case "OPEN_ANALYTICS":
        return {
          label: "USER ANALYTICS",
          value: "1,284",
          description:
            "Current active users detected across the system.",
          metrics: [
            ["Active Now", "1,284"],
            ["Growth", "+12.8%"],
            ["Peak", "1,642"],
          ],
        };

      case "OPEN_SYSTEM_LOAD":
        return {
          label: "SYSTEM LOAD",
          value: "42%",
          description:
            "Current system resource utilization is within the optimal range.",
          metrics: [
            ["CPU Load", "42%"],
            ["Memory", "58%"],
            ["Status", "Optimal"],
          ],
        };

      case "OPEN_PROCESSING":
        return {
          label: "VISION PROCESSING",
          value: "98.6%",
          description:
            "Computer vision pipeline is operating efficiently.",
          metrics: [
            ["Processing", "98.6%"],
            ["Latency", "24 ms"],
            ["Pipeline", "Active"],
          ],
        };

      case "OPEN_INTERACTIONS":
        return {
          label: "GESTURE INTERACTIONS",
          value: "8,492",
          description:
            "Gesture interaction events processed by the AR interface.",
          metrics: [
            ["Total Events", "8,492"],
            ["Successful", "97.4%"],
            ["Latency", "31 ms"],
          ],
        };

      default:
        return {
          label: "UNKNOWN ACTION",
          value: "--",
          description:
            "No detailed information is available for this action.",
          metrics: [],
        };
    }
  };

  const details = getDetails();

  return (
    <div
      className="
        fixed
        right-6
        top-1/2
        z-50
        w-[360px]
        -translate-y-1/2
        rounded-2xl
        border
        border-cyan-400/20
        bg-slate-950/95
        p-6
        shadow-[0_0_50px_rgba(34,211,238,0.12)]
        backdrop-blur-xl
      "
    >
      {/* Header */}

      <div className="flex items-start justify-between">

        <div>
          <div
            className="
              text-[10px]
              uppercase
              tracking-[0.25em]
              text-cyan-400
            "
          >
            AR Detail Panel
          </div>

          <div
            className="
              mt-2
              text-lg
              font-semibold
              text-white
            "
          >
            {details.label}
          </div>
        </div>

        <button
          onClick={onClose}
          className="
            rounded-lg
            border
            border-slate-700
            px-3
            py-1
            text-xs
            text-slate-400
            transition
            hover:border-cyan-400/40
            hover:text-cyan-300
          "
        >
          CLOSE
        </button>

      </div>

      {/* Main Value */}

      <div
        className="
          mt-8
          rounded-xl
          border
          border-cyan-400/10
          bg-cyan-400/5
          p-5
        "
      >
        <div className="text-xs text-slate-500">
          Current Value
        </div>

        <div
          className="
            mt-2
            text-4xl
            font-semibold
            text-white
          "
        >
          {details.value}
        </div>

        <div
          className="
            mt-2
            text-xs
            leading-5
            text-slate-400
          "
        >
          {details.description}
        </div>
      </div>

      {/* Metrics */}

      <div className="mt-5 space-y-2">

        {details.metrics.map(
          ([label, value]) => (
            <div
              key={label}
              className="
                flex
                items-center
                justify-between
                rounded-xl
                border
                border-slate-800
                bg-slate-900/70
                px-4
                py-3
              "
            >
              <span
                className="
                  text-xs
                  text-slate-500
                "
              >
                {label}
              </span>

              <span
                className="
                  text-sm
                  font-medium
                  text-cyan-300
                "
              >
                {value}
              </span>
            </div>
          )
        )}

      </div>

      {/* Status */}

      <div
        className="
          mt-5
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
            shadow-[0_0_10px_rgba(52,211,153,0.8)]
          "
        />

        Live AR data
      </div>

    </div>
  );
}

export default ARWidgetDetail;