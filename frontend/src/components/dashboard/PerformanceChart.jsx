
import { useEffect, useMemo, useState } from "react";

function PerformanceChart() {
  // =========================================================
  // INITIAL PERFORMANCE DATA
  // =========================================================

  const [data, setData] = useState([
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
  ]);

  // =========================================================
  // LIVE DATA UPDATE
  // =========================================================

  useEffect(() => {
    const interval = setInterval(() => {
      setData((previous) => {
        const lastValue =
          previous[previous.length - 1] ?? 50;

        const variation =
          Math.floor(Math.random() * 15) - 7;

        const nextValue = Math.max(
          20,
          Math.min(
            100,
            lastValue + variation
          )
        );

        return [
          ...previous.slice(1),
          nextValue,
        ];
      });
    }, 2500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // =========================================================
  // CALCULATIONS
  // =========================================================

  const max = Math.max(...data);

  const current =
    data[data.length - 1] ?? 0;

  const average =
    Math.round(
      data.reduce(
        (total, value) =>
          total + value,
        0
      ) / data.length
    );

  const peak =
    Math.max(...data);

  // =========================================================
  // PERFORMANCE STATUS
  // =========================================================

  const performanceStatus =
    current >= 80
      ? "Excellent"
      : current >= 60
      ? "Stable"
      : "Moderate";

  // =========================================================
  // TIME LABELS
  // =========================================================

  const timeLabels = useMemo(
    () => [
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "Now",
    ],
    []
  );

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-700/70
        bg-slate-900/70
        p-5
        backdrop-blur-xl
      "
    >

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div
        className="
          mb-6
          flex
          flex-col
          gap-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >

        <div>

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            <h3
              className="
                text-sm
                font-medium
                text-white
              "
            >
              Performance
            </h3>

            <span
              className="
                h-2
                w-2
                animate-pulse
                rounded-full
                bg-emerald-400
              "
            />

          </div>

          <p
            className="
              mt-1
              text-xs
              text-slate-500
            "
          >
            Real-time system analytics
          </p>

        </div>


        {/* LIVE INDICATOR */}

        <div
          className="
            flex
            items-center
            gap-2
            self-start
            rounded-lg
            border
            border-cyan-500/20
            bg-cyan-500/10
            px-3
            py-1
            text-xs
            text-cyan-300
          "
        >

          <span
            className="
              h-1.5
              w-1.5
              animate-pulse
              rounded-full
              bg-cyan-400
            "
          />

          LIVE

        </div>

      </div>


      {/* =====================================================
          METRICS
      ====================================================== */}

      <div
        className="
          mb-6
          grid
          grid-cols-3
          gap-3
        "
      >

        {/* CURRENT */}

        <div
          className="
            rounded-xl
            border
            border-slate-800
            bg-slate-950/50
            p-3
          "
        >

          <div
            className="
              text-[10px]
              uppercase
              tracking-wider
              text-slate-500
            "
          >
            Current
          </div>

          <div
            className="
              mt-1
              text-lg
              font-semibold
              text-cyan-300
            "
          >
            {current}%
          </div>

        </div>


        {/* AVERAGE */}

        <div
          className="
            rounded-xl
            border
            border-slate-800
            bg-slate-950/50
            p-3
          "
        >

          <div
            className="
              text-[10px]
              uppercase
              tracking-wider
              text-slate-500
            "
          >
            Average
          </div>

          <div
            className="
              mt-1
              text-lg
              font-semibold
              text-purple-300
            "
          >
            {average}%
          </div>

        </div>


        {/* PEAK */}

        <div
          className="
            rounded-xl
            border
            border-slate-800
            bg-slate-950/50
            p-3
          "
        >

          <div
            className="
              text-[10px]
              uppercase
              tracking-wider
              text-slate-500
            "
          >
            Peak
          </div>

          <div
            className="
              mt-1
              text-lg
              font-semibold
              text-emerald-300
            "
          >
            {peak}%
          </div>

        </div>

      </div>


      {/* =====================================================
          PERFORMANCE STATUS
      ====================================================== */}

      <div
        className="
          mb-4
          flex
          items-center
          justify-between
        "
      >

        <span
          className="
            text-xs
            text-slate-500
          "
        >
          System performance
        </span>

        <span
          className="
            text-xs
            font-medium
            text-emerald-400
          "
        >
          {performanceStatus}
        </span>

      </div>


      {/* =====================================================
          CHART
      ====================================================== */}

      <div
        className="
          flex
          h-44
          items-end
          gap-2
        "
      >

        {data.map(
          (value, index) => {

            const percentage =
              (value / max) * 100;

            const isCurrent =
              index ===
              data.length - 1;

            return (
              <div
                key={`${index}-${value}`}
                className="
                  group
                  relative
                  flex
                  h-full
                  flex-1
                  items-end
                "
              >

                {/* VALUE */}

                <span
                  className="
                    pointer-events-none
                    absolute
                    -top-6
                    left-1/2
                    hidden
                    -translate-x-1/2
                    text-[10px]
                    text-slate-300
                    group-hover:block
                  "
                >
                  {value}%
                </span>


                {/* BAR */}

                <div
                  className={`
                    w-full
                    rounded-t-md
                    transition-all
                    duration-700
                    ease-out
                    ${
                      isCurrent
                        ? "bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.35)]"
                        : "bg-cyan-400/60"
                    }
                    group-hover:bg-cyan-300
                  `}
                  style={{
                    height: `${percentage}%`,
                  }}
                />

              </div>
            );
          }
        )}

      </div>


      {/* =====================================================
          TIME AXIS
      ====================================================== */}

      <div
        className="
          mt-4
          flex
          justify-between
          text-[10px]
          text-slate-600
        "
      >

        {timeLabels.map(
          (label) => (
            <span key={label}>
              {label}
            </span>
          )
        )}

      </div>


      {/* =====================================================
          FOOTER
      ====================================================== */}

      <div
        className="
          mt-5
          flex
          items-center
          justify-between
          border-t
          border-slate-800
          pt-4
        "
      >

        <div
          className="
            flex
            items-center
            gap-2
            text-[10px]
            text-slate-500
          "
        >

          <span
            className="
              h-1.5
              w-1.5
              animate-pulse
              rounded-full
              bg-emerald-400
            "
          />

          Monitoring active

        </div>


        <div
          className="
            text-[10px]
            text-slate-600
          "
        >
          Updates every 2.5s
        </div>

      </div>

    </div>
  );
}

export default PerformanceChart;