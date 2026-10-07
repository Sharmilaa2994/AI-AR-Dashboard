function WidgetActionPanel({
  action,
  onClose,
  onConfirm,
}) {
  if (!action) {
    return null;
  }

  const getActionDetails = () => {
    switch (action.type) {
      case "OPEN_ANALYTICS":
        return {
          eyebrow: "AR ACTION",
          title: "User Analytics",
          description:
            "Open the live user analytics workspace and inspect current activity.",
          value: "1,284",
          label: "ACTIVE USERS",
          accent: "cyan",
        };

      case "OPEN_SYSTEM_LOAD":
        return {
          eyebrow: "AR ACTION",
          title: "System Load",
          description:
            "Inspect current CPU, memory and system resource utilization.",
          value: "42%",
          label: "CURRENT LOAD",
          accent: "emerald",
        };

      case "OPEN_PROCESSING":
        return {
          eyebrow: "AR ACTION",
          title: "Vision Processing",
          description:
            "Inspect the computer vision processing pipeline and latency.",
          value: "98.6%",
          label: "PROCESSING",
          accent: "purple",
        };

      case "OPEN_INTERACTIONS":
        return {
          eyebrow: "AR ACTION",
          title: "Gesture Interactions",
          description:
            "Inspect gesture events and interaction performance.",
          value: "8,492",
          label: "TOTAL EVENTS",
          accent: "amber",
        };

      default:
        return {
          eyebrow: "AR ACTION",
          title: action.title || "Unknown Action",
          description:
            action.message ||
            "Execute the selected AR dashboard action.",
          value: "--",
          label: "STATUS",
          accent: "cyan",
        };
    }
  };

  const details = getActionDetails();

  const accentClasses = {
    cyan: {
      border: "border-cyan-400/20",
      bg: "bg-cyan-400/5",
      text: "text-cyan-300",
      glow: "shadow-[0_0_40px_rgba(34,211,238,0.12)]",
    },

    emerald: {
      border: "border-emerald-400/20",
      bg: "bg-emerald-400/5",
      text: "text-emerald-300",
      glow: "shadow-[0_0_40px_rgba(52,211,153,0.12)]",
    },

    purple: {
      border: "border-purple-400/20",
      bg: "bg-purple-400/5",
      text: "text-purple-300",
      glow: "shadow-[0_0_40px_rgba(168,85,247,0.12)]",
    },

    amber: {
      border: "border-amber-400/20",
      bg: "bg-amber-400/5",
      text: "text-amber-300",
      glow: "shadow-[0_0_40px_rgba(251,191,36,0.12)]",
    },
  };

  const accent =
    accentClasses[details.accent] ||
    accentClasses.cyan;

  return (
    <div
      className="
        fixed
        inset-0
        z-40
        flex
        items-end
        justify-center
        bg-black/40
        p-3
        backdrop-blur-[2px]
        sm:items-center
        sm:p-4
        lg:justify-end
        lg:items-center
        lg:p-6
      "
      onClick={onClose}
    >
      <div
        className={`
          relative
          w-full
          max-w-[440px]
          max-h-[calc(100vh-24px)]
          overflow-y-auto
          rounded-2xl
          border
          bg-slate-950/95
          p-4
          backdrop-blur-xl
          sm:p-5
          lg:p-6
          ${accent.border}
          ${accent.glow}
        `}
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* TOP HANDLE - MOBILE */}

        <div
          className="
            mx-auto
            mb-4
            h-1
            w-10
            rounded-full
            bg-slate-700
            sm:hidden
          "
        />

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
                text-[8px]
                uppercase
                tracking-[0.22em]
                text-slate-500
                sm:text-[9px]
                sm:tracking-[0.25em]
              "
            >
              {details.eyebrow}
            </div>

            <div
              className="
                mt-1
                break-words
                text-base
                font-semibold
                text-white
                sm:text-lg
              "
            >
              {details.title}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close action panel"
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-lg
              border
              border-slate-700
              text-sm
              text-slate-400
              transition
              hover:border-cyan-400/40
              hover:text-cyan-300
              sm:h-9
              sm:w-9
            "
          >
            ×
          </button>
        </div>

        {/* ACTION DESCRIPTION */}

        <div
          className="
            mt-4
            text-[11px]
            leading-5
            text-slate-400
            sm:text-xs
          "
        >
          {details.description}
        </div>

        {/* CURRENT VALUE */}

        <div
          className={`
            mt-4
            rounded-xl
            border
            p-4
            sm:mt-5
            sm:p-5
            ${accent.border}
            ${accent.bg}
          `}
        >
          <div
            className="
              text-[8px]
              uppercase
              tracking-[0.18em]
              text-slate-500
            "
          >
            {details.label}
          </div>

          <div
            className="
              mt-1
              break-words
              text-3xl
              font-semibold
              text-white
              sm:text-4xl
            "
          >
            {details.value}
          </div>
        </div>

        {/* ACTION STATUS */}

        <div
          className="
            mt-4
            flex
            items-center
            gap-2
            rounded-xl
            border
            border-white/5
            bg-black/20
            px-3
            py-2.5
          "
        >
          <span
            className="
              h-1.5
              w-1.5
              shrink-0
              rounded-full
              bg-emerald-400
              shadow-[0_0_8px_rgba(52,211,153,0.8)]
            "
          />

          <span
            className="
              text-[9px]
              uppercase
              tracking-[0.15em]
              text-emerald-300
            "
          >
            Ready for AR interaction
          </span>
        </div>

        {/* ACTION BUTTONS */}

        <div
          className="
            mt-5
            grid
            grid-cols-1
            gap-2
            sm:grid-cols-2
          "
        >
          <button
            type="button"
            onClick={onClose}
            className="
              order-2
              rounded-xl
              border
              border-slate-700
              bg-slate-900/70
              px-4
              py-3
              text-[10px]
              font-medium
              uppercase
              tracking-[0.14em]
              text-slate-400
              transition
              hover:border-slate-500
              hover:text-white
              sm:order-1
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => {
              if (typeof onConfirm === "function") {
                onConfirm(action);
              }
            }}
            className={`
              order-1
              rounded-xl
              border
              px-4
              py-3
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.14em]
              transition
              sm:order-2
              ${accent.border}
              ${accent.bg}
              ${accent.text}
              hover:bg-white/10
            `}
          >
            Continue
          </button>
        </div>

        {/* FOOTER */}

        <div
          className="
            mt-4
            text-center
            text-[7px]
            uppercase
            tracking-[0.18em]
            text-slate-700
          "
        >
          AURA CORE · SPATIAL ACTION SYSTEM
        </div>
      </div>
    </div>
  );
}

export default WidgetActionPanel;