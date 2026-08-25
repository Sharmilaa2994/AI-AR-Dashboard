function WidgetActionPanel({
  action,
  onClose,
}) {
  if (!action) {
    return null;
  }

  const getIcon = () => {
    switch (action.type) {
      case "OPEN_ANALYTICS":
        return "👥";

      case "OPEN_SYSTEM_LOAD":
        return "⚡";

      case "OPEN_PROCESSING":
        return "◈";

      case "OPEN_INTERACTIONS":
        return "✋";

      default:
        return "◈";
    }
  };

  const getDetails = () => {
    switch (action.type) {
      case "OPEN_ANALYTICS":
        return {
          label: "USER ANALYTICS",
          value: "1,284",
          description:
            "Currently active users detected by the dashboard.",
        };

      case "OPEN_SYSTEM_LOAD":
        return {
          label: "SYSTEM LOAD",
          value: "42%",
          description:
            "System resources are operating within the optimal range.",
        };

      case "OPEN_PROCESSING":
        return {
          label: "VISION PROCESSING",
          value: "98.6%",
          description:
            "Current computer vision pipeline processing efficiency.",
        };

      case "OPEN_INTERACTIONS":
        return {
          label: "GESTURE INTERACTIONS",
          value: "8,492",
          description:
            "Gesture interaction events processed by the AR interface.",
        };

      default:
        return {
          label: "AR ACTION",
          value: "ACTIVE",
          description:
            "Widget interaction successfully triggered.",
        };
    }
  };

  const details = getDetails();

  return (
    <div
      className="
        mt-6
        relative
        overflow-hidden
        rounded-2xl
        border
        border-cyan-400/30
        bg-slate-950/80
        p-6
        shadow-[0_0_35px_rgba(34,211,238,0.12)]
        backdrop-blur-xl
      "
    >

      {/* =====================================================
          TOP GLOW
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -right-16
          -top-16
          h-40
          w-40
          rounded-full
          bg-cyan-400/10
          blur-3xl
        "
      />

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div
        className="
          relative
          flex
          items-start
          justify-between
          gap-4
        "
      >

        <div className="flex items-center gap-3">

          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-xl
              border
              border-cyan-400/30
              bg-cyan-400/10
              text-xl
              shadow-[0_0_20px_rgba(34,211,238,0.12)]
            "
          >
            {getIcon()}
          </div>

          <div>

            <div
              className="
                text-[10px]
                uppercase
                tracking-[0.25em]
                text-cyan-400
              "
            >
              AR Widget Action
            </div>

            <h3
              className="
                mt-1
                text-lg
                font-semibold
                text-white
              "
            >
              {action.title}
            </h3>

          </div>

        </div>

        {/* CLOSE */}

        <button
          type="button"
          onClick={onClose}
          className="
            rounded-lg
            border
            border-slate-700
            bg-slate-900
            px-3
            py-2
            text-xs
            text-slate-400
            transition
            hover:border-slate-500
            hover:text-white
          "
        >
          Close
        </button>

      </div>

      {/* =====================================================
          DETAILS
      ====================================================== */}

      <div
        className="
          relative
          mt-6
          grid
          gap-4
          md:grid-cols-3
        "
      >

        {/* VALUE */}

        <div
          className="
            rounded-xl
            border
            border-slate-800
            bg-slate-900/70
            p-4
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
            {details.label}
          </div>

          <div
            className="
              mt-2
              text-3xl
              font-semibold
              text-cyan-300
            "
          >
            {details.value}
          </div>

        </div>

        {/* ACTION TYPE */}

        <div
          className="
            rounded-xl
            border
            border-slate-800
            bg-slate-900/70
            p-4
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
            Action Type
          </div>

          <div
            className="
              mt-2
              break-all
              text-sm
              font-medium
              text-purple-300
            "
          >
            {action.type}
          </div>

        </div>

        {/* STATUS */}

        <div
          className="
            rounded-xl
            border
            border-slate-800
            bg-slate-900/70
            p-4
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
            Status
          </div>

          <div
            className="
              mt-2
              flex
              items-center
              gap-2
              text-sm
              text-emerald-400
            "
          >

            <span
              className="
                h-2
                w-2
                rounded-full
                bg-emerald-400
                shadow-[0_0_8px_rgba(52,211,153,0.8)]
              "
            />

            Action Executed

          </div>

        </div>

      </div>

      {/* =====================================================
          DESCRIPTION
      ====================================================== */}

      <div
        className="
          relative
          mt-4
          rounded-xl
          border
          border-cyan-500/10
          bg-cyan-500/5
          p-4
        "
      >

        <div
          className="
            text-xs
            uppercase
            tracking-wider
            text-cyan-400
          "
        >
          System Response
        </div>

        <p
          className="
            mt-2
            text-sm
            leading-6
            text-slate-400
          "
        >
          {details.description}
        </p>

        <p
          className="
            mt-2
            text-xs
            text-slate-500
          "
        >
          {action.message}
        </p>

      </div>

    </div>
  );
}

export default WidgetActionPanel;