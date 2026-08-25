import { forwardRef } from "react";

const ARWidget = forwardRef(
  (
    {
      title,
      value,
      description,
      icon,
      selected = false,
      hovered = false,
      onSelect,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        onClick={onSelect}
        className={`
          group relative cursor-pointer
          overflow-hidden rounded-2xl
          border p-5
          backdrop-blur-xl
          transition-all duration-200
          select-none

          ${
            selected
              ? `
                border-cyan-400
                bg-cyan-400/10
                shadow-[0_0_30px_rgba(34,211,238,0.25)]
                scale-[1.02]
              `
              : hovered
                ? `
                  border-purple-400
                  bg-purple-400/10
                  shadow-[0_0_25px_rgba(168,85,247,0.20)]
                  scale-[1.01]
                `
                : `
                  border-slate-800
                  bg-slate-900/70
                  hover:border-cyan-500/40
                `
          }
        `}
      >

        {/* =====================================================
            HOVER / SELECTION GLOW
        ====================================================== */}

        <div
          className={`
            pointer-events-none
            absolute -right-10 -top-10
            h-24 w-24
            rounded-full
            blur-2xl
            transition-opacity duration-200

            ${
              selected
                ? "bg-cyan-400/20 opacity-100"
                : hovered
                  ? "bg-purple-400/20 opacity-100"
                  : "bg-cyan-400/10 opacity-70"
            }
          `}
        />

        {/* =====================================================
            TOP STATUS LINE
        ====================================================== */}

        <div
          className={`
            pointer-events-none
            absolute left-0 top-0
            h-[2px] w-full
            transition-all duration-200

            ${
              selected
                ? "bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]"
                : hovered
                  ? "bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.6)]"
                  : "bg-transparent"
            }
          `}
        />

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="relative flex items-center justify-between">

          <div
            className={`
              text-xs
              uppercase
              tracking-wider
              transition-colors duration-200

              ${
                selected
                  ? "text-cyan-300"
                  : hovered
                    ? "text-purple-300"
                    : "text-slate-500"
              }
            `}
          >
            {title}
          </div>

          <div
            className={`
              text-xl
              transition-transform duration-200

              ${
                selected
                  ? "scale-110"
                  : hovered
                    ? "scale-105"
                    : ""
              }
            `}
          >
            {icon}
          </div>

        </div>

        {/* =====================================================
            VALUE
        ====================================================== */}

        <div
          className={`
            relative mt-4
            text-3xl
            font-semibold
            transition-colors duration-200

            ${
              selected
                ? "text-cyan-100"
                : hovered
                  ? "text-white"
                  : "text-white"
            }
          `}
        >
          {value}
        </div>

        {/* =====================================================
            DESCRIPTION
        ====================================================== */}

        <div
          className={`
            relative mt-2
            text-xs
            transition-colors duration-200

            ${
              selected
                ? "text-cyan-200/70"
                : hovered
                  ? "text-purple-200/70"
                  : "text-slate-500"
            }
          `}
        >
          {description}
        </div>

        {/* =====================================================
            HOVER INDICATOR
        ====================================================== */}

        {hovered && !selected && (
          <div
            className="
              absolute
              bottom-3
              right-3
              rounded-full
              border
              border-purple-400/30
              bg-purple-400/10
              px-2
              py-1
              text-[9px]
              uppercase
              tracking-wider
              text-purple-300
            "
          >
            Targeted
          </div>
        )}

        {/* =====================================================
            SELECTED INDICATOR
        ====================================================== */}

        {selected && (
          <div
            className="
              absolute
              bottom-3
              right-3
              flex
              items-center
              gap-1.5
              rounded-full
              border
              border-cyan-400/30
              bg-cyan-400/10
              px-2
              py-1
              text-[9px]
              uppercase
              tracking-wider
              text-cyan-300
            "
          >
            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-cyan-400
                shadow-[0_0_6px_rgba(34,211,238,0.9)]
              "
            />

            Selected
          </div>
        )}

      </div>
    );
  }
);

ARWidget.displayName = "ARWidget";

export default ARWidget;