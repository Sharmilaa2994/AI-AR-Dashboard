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
          ar-fade-up
          group
          relative
          cursor-pointer
          overflow-hidden
          rounded-2xl
          border
          p-5
          backdrop-blur-xl
          select-none

          transition-all
          duration-500
          ease-out

          ${
            selected
              ? `
                border-cyan-300/80
                bg-cyan-400/[0.08]
                shadow-[0_0_40px_rgba(34,211,238,0.22)]
                scale-[1.025]
                -translate-y-1
              `
              : hovered
              ? `
                border-purple-400/70
                bg-purple-400/[0.07]
                shadow-[0_0_35px_rgba(168,85,247,0.20)]
                scale-[1.018]
                -translate-y-0.5
              `
              : `
                border-slate-800/80
                bg-slate-900/65
                hover:border-cyan-500/40
                hover:bg-slate-900/80
              `
          }
        `}
      >

        {/* =====================================================
            HOLOGRAPHIC SCAN
        ====================================================== */}

        <div
          className={`
            pointer-events-none
            absolute
            inset-0
            overflow-hidden
            opacity-0
            transition-opacity
            duration-500

            ${
              hovered || selected
                ? "opacity-100"
                : ""
            }
          `}
        >
          <div
            className="
              absolute
              -left-1/2
              top-0
              h-full
              w-1/3
              rotate-12
              bg-gradient-to-r
              from-transparent
              via-cyan-300/10
              to-transparent
              blur-xl
              transition-transform
              duration-[1800ms]
              group-hover:translate-x-[500%]
            "
          />
        </div>


        {/* =====================================================
            CORNER HUD MARKERS
        ====================================================== */}

        <div
          className={`
            pointer-events-none
            absolute
            left-2
            top-2
            h-3
            w-3
            border-l
            border-t
            transition-all
            duration-300

            ${
              selected
                ? "border-cyan-300"
                : hovered
                ? "border-purple-300"
                : "border-slate-700"
            }
          `}
        />

        <div
          className={`
            pointer-events-none
            absolute
            right-2
            top-2
            h-3
            w-3
            border-r
            border-t
            transition-all
            duration-300

            ${
              selected
                ? "border-cyan-300"
                : hovered
                ? "border-purple-300"
                : "border-slate-700"
            }
          `}
        />

        <div
          className={`
            pointer-events-none
            absolute
            bottom-2
            left-2
            h-3
            w-3
            border-b
            border-l
            transition-all
            duration-300

            ${
              selected
                ? "border-cyan-300"
                : hovered
                ? "border-purple-300"
                : "border-slate-700"
            }
          `}
        />

        <div
          className={`
            pointer-events-none
            absolute
            bottom-2
            right-2
            h-3
            w-3
            border-b
            border-r
            transition-all
            duration-300

            ${
              selected
                ? "border-cyan-300"
                : hovered
                ? "border-purple-300"
                : "border-slate-700"
            }
          `}
        />


        {/* =====================================================
            AMBIENT GLOW
        ====================================================== */}

        <div
          className={`
            pointer-events-none
            absolute
            -right-16
            -top-16
            h-32
            w-32
            rounded-full
            blur-3xl
            transition-all
            duration-700

            ${
              selected
                ? "bg-cyan-400/25 scale-125"
                : hovered
                ? "bg-purple-400/20 scale-110"
                : "bg-cyan-400/5"
            }
          `}
        />


        {/* =====================================================
            TOP STATUS LINE
        ====================================================== */}

        <div
          className={`
            pointer-events-none
            absolute
            left-0
            top-0
            h-[2px]
            w-full
            transition-all
            duration-500

            ${
              selected
                ? "bg-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.9)]"
                : hovered
                ? "bg-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.7)]"
                : "bg-transparent"
            }
          `}
        />


        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="relative z-10 flex items-center justify-between">

          <div
            className={`
              text-xs
              uppercase
              tracking-[0.18em]
              transition-colors
              duration-300

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


          {/* ICON */}

          <div
            className={`
              relative
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              border
              text-lg
              transition-all
              duration-500

              ${
                selected
                  ? `
                    border-cyan-400/40
                    bg-cyan-400/10
                    text-cyan-300
                    shadow-[0_0_20px_rgba(34,211,238,0.18)]
                    rotate-6
                  `
                  : hovered
                  ? `
                    border-purple-400/40
                    bg-purple-400/10
                    text-purple-300
                    shadow-[0_0_18px_rgba(168,85,247,0.15)]
                  `
                  : `
                    border-slate-800
                    bg-slate-950/50
                  `
              }
            `}
          >
            {icon}

            {(hovered || selected) && (
              <span
                className="
                  absolute
                  inset-0
                  rounded-xl
                  border
                  border-current
                  opacity-30
                  animate-ping
                "
              />
            )}
          </div>

        </div>


        {/* =====================================================
            VALUE
        ====================================================== */}

        <div
          className={`
            relative
            z-10
            mt-5
            text-3xl
            font-semibold
            tracking-tight
            transition-all
            duration-500

            ${
              selected
                ? "text-cyan-100 drop-shadow-[0_0_12px_rgba(34,211,238,0.35)]"
                : hovered
                ? "text-white drop-shadow-[0_0_8px_rgba(168,85,247,0.2)]"
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
            relative
            z-10
            mt-2
            text-xs
            transition-colors
            duration-300

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
            AR TARGET RETICLE
        ====================================================== */}

        {hovered && !selected && (
          <div
            className="
              absolute
              bottom-3
              right-3
              flex
              items-center
              gap-2
              rounded-full
              border
              border-purple-400/30
              bg-purple-400/10
              px-2.5
              py-1
              text-[9px]
              uppercase
              tracking-[0.15em]
              text-purple-300
            "
          >
            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-purple-400
                shadow-[0_0_8px_rgba(168,85,247,0.9)]
                animate-pulse
              "
            />

            TARGETED
          </div>
        )}


        {/* =====================================================
            SELECTED STATE
        ====================================================== */}

        {selected && (
          <div
            className="
              absolute
              bottom-3
              right-3
              flex
              items-center
              gap-2
              rounded-full
              border
              border-cyan-400/30
              bg-cyan-400/10
              px-2.5
              py-1
              text-[9px]
              uppercase
              tracking-[0.15em]
              text-cyan-300
            "
          >
            <span
              className="
                relative
                h-1.5
                w-1.5
                rounded-full
                bg-cyan-400
                shadow-[0_0_8px_rgba(34,211,238,0.9)]
              "
            />

            LOCKED
          </div>
        )}


        {/* =====================================================
            BOTTOM HUD DATA LINE
        ====================================================== */}

        <div
          className={`
            absolute
            bottom-0
            left-5
            right-5
            h-px
            transition-all
            duration-500

            ${
              selected
                ? "bg-cyan-400/30"
                : hovered
                ? "bg-purple-400/20"
                : "bg-slate-800/50"
            }
          `}
        />

      </div>
    );
  }
);
ARWidget.displayName = "ARWidget";

export default ARWidget;