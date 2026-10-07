import {
  useOutletContext,
} from "react-router-dom";


function GesturePage() {

  const {
    cursor,
    isTracking,
  } = useOutletContext();


  const gestures = [
    {
      name: "POINT",
      action: "Target / Select",
      icon: "☝",
    },
    {
      name: "PINCH",
      action: "Select / Drag",
      icon: "🤏",
    },
    {
      name: "TWO FINGER",
      action: "Scroll / Move",
      icon: "✌",
    },
    {
      name: "FIST",
      action: "Cancel",
      icon: "✊",
    },
    {
      name: "OPEN PALM",
      action: "Reset",
      icon: "✋",
    },
  ];


  return (
    <div className="space-y-6">

      <div
        className="
          rounded-2xl
          border
          border-cyan-400/10
          bg-slate-950/80
          p-7
        "
      >

        <div
          className="
            text-[10px]
            uppercase
            tracking-[0.3em]
            text-cyan-400
          "
        >
          Spatial Interaction Engine
        </div>


        <h1 className="mt-2 text-3xl font-semibold">
          Gesture Interface
        </h1>


        <p className="mt-2 text-sm text-slate-400">
          Real-time hand gesture recognition and spatial command mapping.
        </p>

      </div>


      {/* CURRENT GESTURE */}

      <div
        className="
          grid
          gap-4
          md:grid-cols-3
        "
      >

        <GestureStatus
          label="CURRENT GESTURE"
          value={cursor.gesture}
        />

        <GestureStatus
          label="CONFIDENCE"
          value={`${Math.round(
            (cursor.confidence || 0) * 100
          )}%`}
        />

        <GestureStatus
          label="TRACKING"
          value={
            isTracking
              ? "ACTIVE"
              : "SEARCHING"
          }
        />

      </div>


      {/* GESTURE MAP */}

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
          Gesture Command Map
        </div>


        <div className="grid gap-3">

          {gestures.map(
            (item) => {

              const active =
                cursor.gesture === item.name;


              return (
                <div
                  key={item.name}
                  className={`
                    flex
                    items-center
                    justify-between
                    rounded-xl
                    border
                    p-4
                    transition

                    ${
                      active
                        ? "border-cyan-400/40 bg-cyan-400/[0.06]"
                        : "border-slate-800 bg-slate-900/30"
                    }
                  `}
                >

                  <div className="flex items-center gap-4">

                    <span className="text-2xl">
                      {item.icon}
                    </span>

                    <div>

                      <div className="text-sm font-semibold">
                        {item.name}
                      </div>

                      <div className="text-xs text-slate-500">
                        {item.action}
                      </div>

                    </div>

                  </div>


                  {active && (
                    <span
                      className="
                        rounded-full
                        bg-cyan-400/10
                        px-3
                        py-1
                        text-[9px]
                        uppercase
                        tracking-wider
                        text-cyan-300
                      "
                    >
                      ACTIVE
                    </span>
                  )}

                </div>
              );
            }
          )}

        </div>

      </div>

    </div>
  );
}


function GestureStatus({
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

      <div className="mt-3 text-xl text-cyan-300">
        {value}
      </div>

    </div>
  );
}


export default GesturePage;