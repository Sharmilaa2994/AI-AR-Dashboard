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
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/50
        p-3
        backdrop-blur-[2px]
        sm:p-4
        md:justify-end
        md:bg-transparent
        md:p-4
        lg:p-6
      "
      onClick={onClose}
    >
      <div
        className="
          relative
          w-full
          max-w-[420px]
          max-h-[calc(100vh-24px)]
          overflow-y-auto
          rounded-2xl
          border
          border-cyan-400/20
          bg-slate-950/95
          p-4
          shadow-[0_0_50px_rgba(34,211,238,0.12)]
          backdrop-blur-xl
          sm:p-5
          md:max-h-[calc(100vh-32px)]
          lg:p-6
        "
        onClick={(event) => event.stopPropagation()}
      >
        {/* HEADER */}

        <div
          className="
            flex
            min-w-0
            items-start
            justify-between
            gap-3
          "
        >
          <div className="min-w-0">
            <div
              className="
                text-[9px]
                uppercase
                tracking-[0.2em]
                text-cyan-400
                sm:text-[10px]
                sm:tracking-[0.25em]
              "
            >
              AR Detail Panel
            </div>

            <div
              className="
                mt-1.5
                break-words
                text-base
                font-semibold
                text-white
                sm:mt-2
                sm:text-lg
              "
            >
              {details.label}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              shrink-0
              rounded-lg
              border
              border-slate-700
              px-2.5
              py-1.5
              text-[10px]
              text-slate-400
              transition
              hover:border-cyan-400/40
              hover:text-cyan-300
              sm:px-3
              sm:text-xs
            "
          >
            CLOSE
          </button>
        </div>

        {/* MAIN VALUE */}

        <div
          className="
            mt-5
            rounded-xl
            border
            border-cyan-400/10
            bg-cyan-400/5
            p-4
            sm:mt-6
            sm:p-5
          "
        >
          <div
            className="
              text-[10px]
              text-slate-500
              sm:text-xs
            "
          >
            Current Value
          </div>

          <div
            className="
              mt-1
              break-words
              text-3xl
              font-semibold
              text-white
              sm:mt-2
              sm:text-4xl
            "
          >
            {details.value}
          </div>

          <div
            className="
              mt-2
              text-[11px]
              leading-5
              text-slate-400
              sm:text-xs
            "
          >
            {details.description}
          </div>
        </div>

        {/* METRICS */}

        {details.metrics.length > 0 && (
          <div
            className="
              mt-4
              grid
              grid-cols-1
              gap-2
              sm:mt-5
              sm:grid-cols-1
            "
          >
            {details.metrics.map(
              ([label, value]) => (
                <div
                  key={label}
                  className="
                    flex
                    min-w-0
                    items-center
                    justify-between
                    gap-3
                    rounded-xl
                    border
                    border-slate-800
                    bg-slate-900/70
                    px-3
                    py-2.5
                    sm:px-4
                    sm:py-3
                  "
                >
                  <span
                    className="
                      min-w-0
                      truncate
                      text-[11px]
                      text-slate-500
                      sm:text-xs
                    "
                  >
                    {label}
                  </span>

                  <span
                    className="
                      shrink-0
                      text-xs
                      font-medium
                      text-cyan-300
                      sm:text-sm
                    "
                  >
                    {value}
                  </span>
                </div>
              )
            )}
          </div>
        )}

        {/* STATUS */}

        <div
          className="
            mt-4
            flex
            min-w-0
            items-center
            gap-2
            sm:mt-5
          "
        >
          <span
            className="
              h-1.5
              w-1.5
              shrink-0
              rounded-full
              bg-emerald-400
              shadow-[0_0_10px_rgba(52,211,153,0.8)]
              sm:h-2
              sm:w-2
            "
          />

          <span
            className="
              text-[10px]
              text-emerald-400
              sm:text-xs
            "
          >
            Live AR data
          </span>
        </div>
      </div>
    </div>
  );
}

export default ARWidgetDetail;