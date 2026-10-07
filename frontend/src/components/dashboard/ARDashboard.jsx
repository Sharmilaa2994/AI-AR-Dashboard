import {
  Activity,
  BarChart3,
  BrainCircuit,
  Database,
  Grip,
  Hand,
  Layers,
  MousePointer2,
  Move,
  Radio,
  RefreshCw,
  ScanLine,
  Server,
  ShieldCheck,
  Target,
  Table2,
  Users,
  X,
  Zap,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";


/* =========================================================
   CONSTANTS
========================================================= */

const DEFAULT_WIDGETS = [
  {
    id: "system",
    title: "System Status",
    subtitle: "Real-time platform monitoring",
    x: 20,
    y: 20,
    w: 340,
    h: 190,
  },

  {
    id: "users",
    title: "Active Users",
    subtitle: "Connected sessions",
    x: 380,
    y: 20,
    w: 300,
    h: 190,
  },

  {
    id: "processing",
    title: "Processing Engine",
    subtitle: "Vision pipeline",
    x: 700,
    y: 20,
    w: 340,
    h: 190,
  },

  {
    id: "analytics",
    title: "Analytics",
    subtitle: "Performance overview",
    x: 1060,
    y: 20,
    w: 340,
    h: 190,
  },

  {
    id: "table",
    title: "Live Data Table",
    subtitle: "Movable dashboard content",
    x: 20,
    y: 240,
    w: 660,
    h: 300,
  },

  {
    id: "activity",
    title: "Activity Monitor",
    subtitle: "Recent system events",
    x: 700,
    y: 240,
    w: 340,
    h: 300,
  },

  {
    id: "gesture",
    title: "Gesture Interface",
    subtitle: "Spatial interaction engine",
    x: 1060,
    y: 240,
    w: 340,
    h: 300,
  },

  {
    id: "pipeline",
    title: "Pipeline Overview",
    subtitle: "Computer vision services",
    x: 20,
    y: 570,
    w: 660,
    h: 250,
  },

  {
    id: "insight",
    title: "AI Insight",
    subtitle: "Intelligence layer",
    x: 700,
    y: 570,
    w: 700,
    h: 250,
  },
];


const GESTURES = [
  {
    id: "POINT",
    label: "Point",
    icon: "☝️",
    color: "text-cyan-300",
    bar: "bg-cyan-400",
  },

  {
    id: "PINCH",
    label: "Pinch",
    icon: "🤏",
    color: "text-purple-300",
    bar: "bg-purple-400",
  },

  {
    id: "TWO_FINGER",
    label: "Two Finger",
    icon: "✌️",
    color: "text-amber-300",
    bar: "bg-amber-400",
  },

  {
    id: "FIST",
    label: "Fist",
    icon: "✊",
    color: "text-rose-300",
    bar: "bg-rose-400",
  },

  {
    id: "OPEN_PALM",
    label: "Open Palm",
    icon: "✋",
    color: "text-emerald-300",
    bar: "bg-emerald-400",
  },
];


/* =========================================================
   MAIN COMPONENT
========================================================= */

function ARDashboard({
  cursorPosition = {
    x: 0,
    y: 0,
    visible: false,
    gesture: "UNKNOWN",
    confidence: 0,
  },

  gestureStats = {
    POINT: 0,
    PINCH: 0,
    TWO_FINGER: 0,
    FIST: 0,
    OPEN_PALM: 0,
  },

  onResetGestureStats,
}) {

  // =======================================================
  // WIDGET STATE
  // =======================================================

  const [widgets, setWidgets] =
    useState(DEFAULT_WIDGETS);


  // =======================================================
  // SELECTED WIDGET
  // =======================================================

  const [selectedWidget, setSelectedWidget] =
    useState(null);


  // =======================================================
  // DRAG STATE
  // =======================================================

  const dragRef =
    useRef({
      active: false,
      widgetId: null,
      offsetX: 0,
      offsetY: 0,
    });


  // =======================================================
  // PINCH STATE
  // =======================================================

  const pinchRef =
    useRef({
      active: false,
      widgetId: null,
    });


  // =======================================================
  // SCROLL STATE
  // =======================================================

  const scrollRef =
    useRef({
      lastY: null,
    });


  // =======================================================
  // DASHBOARD REF
  // =======================================================

  const dashboardRef =
    useRef(null);


  // =======================================================
  // TOTAL GESTURES
  // =======================================================

  const totalGestures =
    useMemo(
      () =>
        Object.values(
          gestureStats || {}
        ).reduce(
          (sum, value) =>
            sum + Number(value || 0),
          0
        ),
      [gestureStats]
    );


  // =======================================================
  // GESTURE PERCENTAGE
  // =======================================================

  const getGesturePercentage =
    useCallback(
      (gesture) => {

        if (!totalGestures) {
          return 0;
        }

        return Math.round(
          (
            Number(
              gestureStats?.[gesture] || 0
            ) /
            totalGestures
          ) * 100
        );

      },
      [
        gestureStats,
        totalGestures,
      ]
    );


  // =======================================================
  // RESET LAYOUT
  // =======================================================

  const resetLayout =
    useCallback(() => {

      setWidgets(
        DEFAULT_WIDGETS.map(
          (widget) => ({
            ...widget,
          })
        )
      );

      setSelectedWidget(null);

    }, []);


  // =======================================================
  // FIND WIDGET UNDER SCREEN CURSOR
  // =======================================================

  const findWidgetAtCursor =
    useCallback(
      (
        screenX,
        screenY
      ) => {

        if (
          !screenX &&
          !screenY
        ) {
          return null;
        }


        const element =
          document.elementFromPoint(
            screenX,
            screenY
          );


        if (!element) {
          return null;
        }


        const widget =
          element.closest(
            "[data-ar-widget-id]"
          );


        if (!widget) {
          return null;
        }


        return widget.dataset.arWidgetId ||
          null;

      },
      []
    );


  // =======================================================
  // SELECT WIDGET
  // =======================================================

  const selectWidget =
    useCallback(
      (widgetId) => {

        if (!widgetId) {
          return;
        }

        setSelectedWidget(
          widgetId
        );

      },
      []
    );


  // =======================================================
  // START MOUSE DRAG
  // =======================================================

  const handlePointerDown =
    useCallback(
      (
        event,
        widgetId
      ) => {

        if (
          event.button !== 0
        ) {
          return;
        }


        const widget =
          widgets.find(
            (item) =>
              item.id === widgetId
          );


        if (!widget) {
          return;
        }


        const target =
          event.currentTarget;


        const rect =
          target.getBoundingClientRect();


        dragRef.current = {
          active: true,
          widgetId,
          offsetX:
            event.clientX -
            rect.left,
          offsetY:
            event.clientY -
            rect.top,
        };


        setSelectedWidget(
          widgetId
        );


        target.setPointerCapture?.(
          event.pointerId
        );


        event.preventDefault();
        event.stopPropagation();

      },
      [widgets]
    );


  // =======================================================
  // MOUSE DRAG MOVE
  // =======================================================

  const handlePointerMove =
    useCallback(
      (event) => {

        if (
          !dragRef.current.active
        ) {
          return;
        }


        const widgetId =
          dragRef.current.widgetId;


        const dashboard =
          dashboardRef.current;


        if (
          !dashboard ||
          !widgetId
        ) {
          return;
        }


        const rect =
          dashboard.getBoundingClientRect();


        let x =
          event.clientX -
          rect.left -
          dragRef.current.offsetX;


        let y =
          event.clientY -
          rect.top -
          dragRef.current.offsetY;


        x =
          Math.max(
            0,
            Math.min(
              dashboard.scrollWidth -
                80,
              x
            )
          );


        y =
          Math.max(
            0,
            Math.min(
              dashboard.scrollHeight -
                80,
              y
            )
          );


        setWidgets(
          (previous) =>
            previous.map(
              (widget) =>
                widget.id === widgetId
                  ? {
                      ...widget,
                      x,
                      y,
                    }
                  : widget
            )
        );

      },
      []
    );


  // =======================================================
  // END MOUSE DRAG
  // =======================================================

  const handlePointerUp =
    useCallback(() => {

      dragRef.current.active =
        false;

      dragRef.current.widgetId =
        null;

    }, []);


  // =======================================================
  // PINCH DRAG START
  // =======================================================

  const startPinchDrag =
    useCallback(
      (
        widgetId
      ) => {

        if (!widgetId) {
          return;
        }


        pinchRef.current = {
          active: true,
          widgetId,
        };


        setSelectedWidget(
          widgetId
        );

      },
      []
    );


  // =======================================================
  // PINCH DRAG MOVE
  // =======================================================

  const movePinchDrag =
    useCallback(
      (
        screenX,
        screenY
      ) => {

        if (
          !pinchRef.current.active
        ) {
          return;
        }


        const widgetId =
          pinchRef.current.widgetId;


        const dashboard =
          dashboardRef.current;


        if (
          !dashboard ||
          !widgetId
        ) {
          return;
        }


        const rect =
          dashboard.getBoundingClientRect();


        const widget =
          widgets.find(
            (item) =>
              item.id === widgetId
          );


        if (!widget) {
          return;
        }


        let x =
          screenX -
          rect.left -
          widget.w / 2;


        let y =
          screenY -
          rect.top -
          35;


        x =
          Math.max(
            0,
            Math.min(
              1350,
              x
            )
          );


        y =
          Math.max(
            0,
            Math.min(
              1100,
              y
            )
          );


        setWidgets(
          (previous) =>
            previous.map(
              (item) =>
                item.id === widgetId
                  ? {
                      ...item,
                      x,
                      y,
                    }
                  : item
            )
        );

      },
      [widgets]
    );


  // =======================================================
  // END PINCH
  // =======================================================

  const endPinchDrag =
    useCallback(() => {

      pinchRef.current.active =
        false;

      pinchRef.current.widgetId =
        null;

    }, []);


  // =======================================================
  // GESTURE INTERACTION BRIDGE
  // =======================================================

  useEffect(() => {

    const gesture =
      String(
        cursorPosition?.gesture ||
          "UNKNOWN"
      ).toUpperCase();


    const x =
      Number(
        cursorPosition?.x || 0
      );


    const y =
      Number(
        cursorPosition?.y || 0
      );


    // -----------------------------------------------------
    // POINT
    // -----------------------------------------------------

    if (
      gesture === "POINT" &&
      cursorPosition.visible
    ) {

      const widgetId =
        findWidgetAtCursor(
          x,
          y
        );


      if (
        widgetId
      ) {

        setSelectedWidget(
          widgetId
        );

      }

      endPinchDrag();

      return;
    }


    // -----------------------------------------------------
    // PINCH
    // -----------------------------------------------------

    if (
      gesture === "PINCH" &&
      cursorPosition.visible
    ) {

      if (
        !pinchRef.current.active
      ) {

        const widgetId =
          findWidgetAtCursor(
            x,
            y
          );


        if (widgetId) {

          startPinchDrag(
            widgetId
          );

        }

      } else {

        movePinchDrag(
          x,
          y
        );

      }

      return;
    }


    // -----------------------------------------------------
    // TWO FINGER
    // -----------------------------------------------------

    if (
      gesture === "TWO_FINGER"
    ) {

      if (
        scrollRef.current.lastY ===
        null
      ) {

        scrollRef.current.lastY =
          y;

      } else {

        const difference =
          y -
          scrollRef.current.lastY;


        const scrollAmount =
          difference * 2.5;


        window.scrollBy({
          top:
            scrollAmount,
          behavior:
            "auto",
        });


        scrollRef.current.lastY =
          y;

      }

      return;
    }


    // -----------------------------------------------------
    // FIST
    // -----------------------------------------------------

    if (
      gesture === "FIST"
    ) {

      endPinchDrag();

      return;
    }


    // -----------------------------------------------------
    // OPEN PALM
    // -----------------------------------------------------

    if (
      gesture === "OPEN_PALM"
    ) {

      endPinchDrag();

      scrollRef.current.lastY =
        null;

      return;
    }


    // -----------------------------------------------------
    // UNKNOWN
    // -----------------------------------------------------

    scrollRef.current.lastY =
      null;

  }, [
    cursorPosition,
    findWidgetAtCursor,
    movePinchDrag,
    startPinchDrag,
    endPinchDrag,
  ]);


  // =======================================================
  // GLOBAL POINTER LISTENERS
  // =======================================================

  useEffect(() => {

    window.addEventListener(
      "pointermove",
      handlePointerMove
    );


    window.addEventListener(
      "pointerup",
      handlePointerUp
    );


    window.addEventListener(
      "pointercancel",
      handlePointerUp
    );


    return () => {

      window.removeEventListener(
        "pointermove",
        handlePointerMove
      );


      window.removeEventListener(
        "pointerup",
        handlePointerUp
      );


      window.removeEventListener(
        "pointercancel",
        handlePointerUp
      );

    };

  }, [
    handlePointerMove,
    handlePointerUp,
  ]);


  // =======================================================
  // RENDER
  // =======================================================

  return (

    <section
      className="
        relative
        min-h-screen
        w-full
        overflow-x-hidden
        bg-[#020617]
        px-3
        pb-20
        pt-5
        sm:px-5
        lg:px-7
      "
    >

      {/* ===================================================
          AMBIENT BACKGROUND
      ================================================== */}

      <div
        className="
          pointer-events-none
          fixed
          inset-0
          z-0
          overflow-hidden
        "
      >

        <div
          className="
            absolute
            -left-32
            top-20
            h-[500px]
            w-[500px]
            rounded-full
            bg-cyan-500/[0.025]
            blur-[140px]
          "
        />

        <div
          className="
            absolute
            -right-40
            top-[25%]
            h-[550px]
            w-[550px]
            rounded-full
            bg-purple-500/[0.025]
            blur-[150px]
          "
        />

        <div
          className="
            absolute
            bottom-[-200px]
            left-1/2
            h-[500px]
            w-[500px]
            -translate-x-1/2
            rounded-full
            bg-blue-500/[0.02]
            blur-[140px]
          "
        />

      </div>


      {/* ===================================================
          CONTENT
      ================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-[1600px]
        "
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <header
          className="
            mb-5
            rounded-2xl
            border
            border-white/[0.07]
            bg-slate-950/80
            p-5
            backdrop-blur-xl
          "
        >

          <div
            className="
              flex
              flex-col
              gap-5
              xl:flex-row
              xl:items-center
              xl:justify-between
            "
          >

            <div className="min-w-0">

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-cyan-400/20
                    bg-cyan-400/5
                  "
                >

                  <BrainCircuit
                    size={19}
                    className="text-cyan-300"
                  />

                </div>


                <div>

                  <div
                    className="
                      text-[9px]
                      uppercase
                      tracking-[0.3em]
                      text-cyan-400
                    "
                  >
                    Intelligence Layer
                  </div>

                  <h1
                    className="
                      mt-1
                      text-xl
                      font-semibold
                      text-white
                    "
                  >
                    AI Vision Dashboard
                  </h1>

                </div>

              </div>


              <p
                className="
                  mt-3
                  max-w-3xl
                  text-xs
                  leading-6
                  text-slate-500
                "
              >
                Universal spatial interaction workspace
                with hand tracking, gesture control,
                selectable widgets, scrolling and
                movable dashboard content.
              </p>

            </div>


            {/* HEADER CONTROLS */}

            <div
              className="
                grid
                grid-cols-2
                gap-2
                sm:grid-cols-4
              "
            >

              <ControlButton
                icon={<MousePointer2 size={12} />}
                label="POINT"
                value="TARGET"
              />

              <ControlButton
                icon={<Hand size={12} />}
                label="PINCH"
                value="MOVE"
              />

              <ControlButton
                icon={<Move size={12} />}
                label="TWO FINGER"
                value="SCROLL"
              />

              <button
                type="button"
                onClick={() => {
                  resetLayout();

                  onResetGestureStats?.();
                }}
                className="
                  flex
                  min-h-[34px]
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  border
                  border-slate-800
                  bg-slate-900/70
                  px-3
                  text-[9px]
                  uppercase
                  tracking-wider
                  text-slate-400
                  transition
                  hover:border-cyan-400/30
                  hover:text-cyan-300
                "
              >

                <RefreshCw size={12} />

                RESET

              </button>

            </div>

          </div>


          {/* SYSTEM TELEMETRY */}

          <div
            className="
              mt-5
              grid
              gap-3
              border-t
              border-white/[0.05]
              pt-4
              sm:grid-cols-2
              lg:grid-cols-4
            "
          >

            <Telemetry
              icon={<Radio size={13} />}
              label="SYSTEM"
              value="ONLINE"
              active
            />

            <Telemetry
              icon={<Hand size={13} />}
              label="HAND"
              value={
                cursorPosition.gesture ===
                "UNKNOWN"
                  ? "SEARCHING"
                  : "TRACKED"
              }
            />

            <Telemetry
              icon={<Target size={13} />}
              label="GESTURE"
              value={
                cursorPosition.gesture
              }
            />

            <Telemetry
              icon={<ShieldCheck size={13} />}
              label="CONFIDENCE"
              value={`${Math.round(
                Number(
                  cursorPosition.confidence ||
                    0
                ) * 100
              )}%`}
            />

          </div>

        </header>


        {/* =================================================
            INTERACTION INSTRUCTIONS
        ================================================= */}

        <section
          className="
            mb-5
            rounded-2xl
            border
            border-cyan-400/10
            bg-slate-950/70
            p-4
            backdrop-blur-xl
          "
        >

          <div
            className="
              flex
              flex-wrap
              items-center
              gap-3
            "
          >

            <div
              className="
                flex
                items-center
                gap-2
                text-[9px]
                uppercase
                tracking-[0.2em]
                text-cyan-300
              "
            >

              <Zap size={13} />

              Spatial Controls

            </div>


            <Instruction
              gesture="POINT"
              action="Target / Select"
            />

            <Instruction
              gesture="PINCH"
              action="Select + Drag"
            />

            <Instruction
              gesture="TWO FINGER"
              action="Scroll"
            />

            <Instruction
              gesture="FIST"
              action="Cancel"
            />

            <Instruction
              gesture="OPEN PALM"
              action="Reset"
            />

          </div>

        </section>


        {/* =================================================
            FREEFORM DASHBOARD
        ================================================= */}

        <section
          ref={dashboardRef}
          data-ar-scroll-container
          className="
            relative
            min-h-[1150px]
            w-full
            overflow-visible
            rounded-2xl
            border
            border-white/[0.05]
            bg-slate-950/40
          "
          style={{
            minWidth:
              "min(100%, 1450px)",
          }}
        >

          {/* GRID */}

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              rounded-2xl
              opacity-30
            "
            style={{
              backgroundImage:
                "linear-gradient(rgba(34,211,238,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.04) 1px, transparent 1px)",
              backgroundSize:
                "40px 40px",
            }}
          />


          {/* WORKSPACE LABEL */}

          <div
            className="
              pointer-events-none
              absolute
              left-4
              top-4
              z-[1]
              rounded-full
              border
              border-slate-800
              bg-slate-950/80
              px-3
              py-1.5
              text-[8px]
              uppercase
              tracking-[0.2em]
              text-slate-600
            "
          >
            FREEFORM DASHBOARD
          </div>


          {/* WIDGETS */}

          {widgets.map(
            (widget) => (

              <DashboardWidget
                key={widget.id}
                widget={widget}
                selected={
                  selectedWidget ===
                  widget.id
                }
                onSelect={
                  selectWidget
                }
                onPointerDown={
                  handlePointerDown
                }
              >

                {renderWidgetContent(
                  widget.id,
                  gestureStats,
                  getGesturePercentage,
                  totalGestures
                )}

              </DashboardWidget>

            )
          )}

        </section>


        {/* =================================================
            GESTURE DISTRIBUTION
        ================================================= */}

        <section
          className="
            mt-5
            rounded-2xl
            border
            border-white/[0.07]
            bg-slate-950/80
            p-5
            backdrop-blur-xl
          "
        >

          <SectionHeader
            icon={
              <Activity
                size={15}
              />
            }
            eyebrow="INTERACTION ENGINE"
            title="Gesture Distribution"
            right={`${totalGestures} EVENTS`}
          />


          <div
            className="
              mt-5
              grid
              gap-4
              lg:grid-cols-2
          "
          >

            {GESTURES.map(
              (item) => {

                const count =
                  Number(
                    gestureStats?.[
                      item.id
                    ] || 0
                  );


                const percentage =
                  getGesturePercentage(
                    item.id
                  );


                return (

                  <div
                    key={item.id}
                    className="
                      rounded-xl
                      border
                      border-white/[0.05]
                      bg-slate-900/50
                      p-4
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                      "
                    >

                      <div
                        className="
                          flex
                          items-center
                          gap-3
                        "
                      >

                        <span className="text-lg">
                          {item.icon}
                        </span>

                        <span
                          className={`
                            text-xs
                            font-medium
                            ${item.color}
                          `}
                        >
                          {item.label}
                        </span>

                      </div>


                      <div
                        className="
                          text-right
                        "
                      >

                        <div
                          className="
                            text-xs
                            font-semibold
                            text-white
                          "
                        >
                          {count}
                        </div>

                        <div
                          className="
                            text-[8px]
                            text-slate-600
                          "
                        >
                          {percentage}%
                        </div>

                      </div>

                    </div>


                    <div
                      className="
                        mt-3
                        h-1.5
                        overflow-hidden
                        rounded-full
                        bg-slate-800
                      "
                    >

                      <div
                        className={`
                          h-full
                          rounded-full
                          transition-all
                          duration-500
                          ${item.bar}
                        `}
                        style={{
                          width:
                            `${percentage}%`,
                        }}
                      />

                    </div>

                  </div>

                );

              }
            )}

          </div>

        </section>

      </div>

    </section>
  );
}


/* =========================================================
   DASHBOARD WIDGET
========================================================= */

function DashboardWidget({
  widget,
  selected,
  onSelect,
  onPointerDown,
  children,
}) {

  return (

    <article
      data-ar-widget-id={
        widget.id
      }
      className={`
        absolute
        select-none
        rounded-2xl
        border
        bg-slate-950/90
        backdrop-blur-xl
        transition-shadow
        duration-150
        ${
          selected
            ? "z-50 border-cyan-400/60 shadow-[0_0_35px_rgba(34,211,238,0.18)]"
            : "z-10 border-white/[0.07] shadow-[0_15px_50px_rgba(0,0,0,0.25)]"
        }
      `}
      style={{
        left:
          widget.x,
        top:
          widget.y,
        width:
          widget.w,
        minHeight:
          widget.h,
      }}
      onClick={() =>
        onSelect(
          widget.id
        )
      }
    >

      {/* WIDGET HEADER */}

      <div
        className="
          flex
          cursor-grab
          items-center
          justify-between
          border-b
          border-white/[0.05]
          px-4
          py-3
          active:cursor-grabbing
        "
        onPointerDown={(event) =>
          onPointerDown(
            event,
            widget.id
          )
        }
      >

        <div
          className="
            flex
            min-w-0
            items-center
            gap-2
          "
        >

          <Grip
            size={14}
            className="
              shrink-0
              text-slate-600
            "
          />

          <div className="min-w-0">

            <div
              className="
                truncate
                text-[9px]
                uppercase
                tracking-[0.18em]
                text-cyan-400
              "
            >
              {widget.subtitle}
            </div>

            <div
              className="
                mt-1
                truncate
                text-xs
                font-semibold
                text-white
              "
            >
              {widget.title}
            </div>

          </div>

        </div>


        {selected && (

          <div
            className="
              flex
              items-center
              gap-1
              rounded-full
              border
              border-cyan-400/20
              bg-cyan-400/5
              px-2
              py-1
              text-[7px]
              uppercase
              tracking-wider
              text-cyan-300
            "
          >

            <Move size={9} />

            MOVE

          </div>

        )}

      </div>


      {/* CONTENT */}

      <div className="p-4">
        {children}
      </div>

    </article>
  );
}


/* =========================================================
   WIDGET CONTENT
========================================================= */

function renderWidgetContent(
  id,
  gestureStats,
  getGesturePercentage,
  totalGestures
) {

  switch (id) {

    case "system":

      return (
        <div className="space-y-3">

          <StatusRow
            icon={
              <Server
                size={14}
              />
            }
            label="Backend"
            value="ONLINE"
            active
          />

          <StatusRow
            icon={
              <ScanLine
                size={14}
              />
            }
            label="Computer Vision"
            value="READY"
            active
          />

          <StatusRow
            icon={
              <Database
                size={14}
              />
            }
            label="Object Detection"
            value="STANDBY"
          />

          <StatusRow
            icon={
              <Radio
                size={14}
              />
            }
            label="Interaction Layer"
            value="ACTIVE"
            active
          />

        </div>
      );


    case "users":

      return (
        <MetricContent
          icon={
            <Users
              size={18}
            />
          }
          value="128"
          label="ACTIVE SESSIONS"
          detail="+12.4%"
        />
      );


    case "processing":

      return (
        <MetricContent
          icon={
            <Zap
              size={18}
            />
          }
          value="42"
          label="FRAMES / SEC"
          detail="LOW LATENCY"
        />
      );


    case "analytics":

      return (
        <MetricContent
          icon={
            <BarChart3
              size={18}
            />
          }
          value="98.6%"
          label="PIPELINE HEALTH"
          detail="STABLE"
        />
      );


    case "table":

      return (
        <DataTable />
      );


    case "activity":

      return (
        <ActivityContent />
      );


    case "gesture":

      return (
        <GestureMiniPanel
          gestureStats={
            gestureStats
          }
          getGesturePercentage={
            getGesturePercentage
          }
          totalGestures={
            totalGestures
          }
        />
      );


    case "pipeline":

      return (
        <PipelineContent />
      );


    case "insight":

      return (
        <InsightContent />
      );


    default:

      return null;
  }
}


/* =========================================================
   STATUS ROW
========================================================= */

function StatusRow({
  icon,
  label,
  value,
  active = false,
}) {

  return (

    <div
      className="
        flex
        items-center
        justify-between
        rounded-lg
        border
        border-white/[0.04]
        bg-white/[0.015]
        px-3
        py-2.5
      "
    >

      <div
        className="
          flex
          items-center
          gap-2
        "
      >

        <span className="text-cyan-300">
          {icon}
        </span>

        <span
          className="
            text-[9px]
            text-slate-400
          "
        >
          {label}
        </span>

      </div>


      <span
        className={`
          text-[9px]
          font-semibold
          ${
            active
              ? "text-emerald-400"
              : "text-amber-300"
          }
        `}
      >
        {value}
      </span>

    </div>
  );
}


/* =========================================================
   METRIC
========================================================= */

function MetricContent({
  icon,
  value,
  label,
  detail,
}) {

  return (

    <div
      className="
        flex
        h-full
        flex-col
        justify-between
      "
    >

      <div
        className="
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-xl
          border
          border-cyan-400/20
          bg-cyan-400/5
          text-cyan-300
        "
      >
        {icon}
      </div>


      <div>

        <div
          className="
            text-3xl
            font-semibold
            tracking-tight
            text-white
          "
        >
          {value}
        </div>

        <div
          className="
            mt-1
            text-[8px]
            uppercase
            tracking-[0.2em]
            text-slate-500
          "
        >
          {label}
        </div>

        <div
          className="
            mt-3
            text-[8px]
            text-emerald-400
          "
        >
          {detail}
        </div>

      </div>

    </div>
  );
}


/* =========================================================
   DATA TABLE
========================================================= */

function DataTable() {

  const rows = [
    [
      "CAM-001",
      "Hand",
      "POINT",
      "98%",
    ],
    [
      "CAM-001",
      "Hand",
      "PINCH",
      "96%",
    ],
    [
      "CAM-002",
      "Object",
      "TARGET",
      "94%",
    ],
    [
      "CAM-001",
      "Hand",
      "TWO_FINGER",
      "91%",
    ],
    [
      "CAM-003",
      "Object",
      "DETECTED",
      "89%",
    ],
  ];


  return (

    <div
      className="
        overflow-auto
        rounded-xl
        border
        border-white/[0.05]
      "
    >

      <table className="w-full text-left">

        <thead>

          <tr
            className="
              border-b
              border-white/[0.05]
              bg-white/[0.02]
            "
          >

            <th className="px-3 py-2 text-[8px] text-slate-600">
              SOURCE
            </th>

            <th className="px-3 py-2 text-[8px] text-slate-600">
              TYPE
            </th>

            <th className="px-3 py-2 text-[8px] text-slate-600">
              EVENT
            </th>

            <th className="px-3 py-2 text-[8px] text-slate-600">
              CONF
            </th>

          </tr>

        </thead>


        <tbody>

          {rows.map(
            (row, index) => (

              <tr
                key={index}
                className="
                  border-b
                  border-white/[0.035]
                  last:border-0
                "
              >

                {row.map(
                  (value, column) => (

                    <td
                      key={column}
                      className={`
                        px-3
                        py-3
                        text-[9px]
                        ${
                          column === 2
                            ? "text-cyan-300"
                            : "text-slate-400"
                        }
                      `}
                    >
                      {value}
                    </td>

                  )
                )}

              </tr>

            )
          )}

        </tbody>

      </table>

    </div>
  );
}


/* =========================================================
   ACTIVITY
========================================================= */

function ActivityContent() {

  const events = [
    "POINT target acquired",
    "PINCH selection detected",
    "Widget interaction complete",
    "Object detection active",
    "Vision pipeline stable",
  ];


  return (

    <div className="space-y-3">

      {events.map(
        (event, index) => (

          <div
            key={index}
            className="
              flex
              items-center
              gap-3
              rounded-lg
              border
              border-white/[0.04]
              px-3
              py-2.5
            "
          >

            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-cyan-400
              "
            />

            <span
              className="
                text-[9px]
                text-slate-400
              "
            >
              {event}
            </span>

          </div>

        )
      )}

    </div>
  );
}


/* =========================================================
   GESTURE MINI PANEL
========================================================= */

function GestureMiniPanel({
  gestureStats,
  getGesturePercentage,
  totalGestures,
}) {

  return (

    <div className="space-y-3">

      {GESTURES.map(
        (item) => {

          const count =
            Number(
              gestureStats?.[
                item.id
              ] || 0
            );


          const percentage =
            getGesturePercentage(
              item.id
            );


          return (

            <div key={item.id}>

              <div
                className="
                  mb-1.5
                  flex
                  items-center
                  justify-between
                "
              >

                <span
                  className={`
                    text-[9px]
                    ${item.color}
                  `}
                >
                  {item.icon}{" "}
                  {item.label}
                </span>

                <span
                  className="
                    text-[8px]
                    text-slate-600
                  "
                >
                  {count}
                </span>

              </div>


              <div
                className="
                  h-1
                  overflow-hidden
                  rounded-full
                  bg-slate-800
                "
              >

                <div
                  className={`
                    h-full
                    rounded-full
                    ${item.bar}
                    transition-all
                    duration-500
                  `}
                  style={{
                    width:
                      totalGestures
                        ? `${percentage}%`
                        : "0%",
                  }}
                />

              </div>

            </div>

          );
        }
      )}

    </div>
  );
}


/* =========================================================
   PIPELINE
========================================================= */

function PipelineContent() {

  const items = [
    [
      "OpenCV",
      "AVAILABLE",
      true,
    ],
    [
      "Hand Landmarker",
      "READY",
      true,
    ],
    [
      "Frame Engine",
      "READY",
      true,
    ],
    [
      "Object Detection",
      "STANDBY",
      false,
    ],
  ];


  return (

    <div
      className="
        grid
        gap-3
        sm:grid-cols-2
        lg:grid-cols-4
      "
    >

      {items.map(
        (item, index) => (

          <div
            key={index}
            className="
              rounded-xl
              border
              border-white/[0.05]
              bg-slate-900/40
              p-4
            "
          >

            <div
              className="
                text-[8px]
                uppercase
                tracking-wider
                text-slate-600
              "
            >
              {item[0]}
            </div>

            <div
              className={`
                mt-3
                text-xs
                font-semibold
                ${
                  item[2]
                    ? "text-emerald-400"
                    : "text-amber-300"
                }
              `}
            >
              {item[1]}
            </div>

          </div>

        )
      )}

    </div>
  );
}


/* =========================================================
   AI INSIGHT
========================================================= */

function InsightContent() {

  return (

    <div
      className="
        grid
        gap-4
        lg:grid-cols-2
      "
    >

      <div
        className="
          rounded-xl
          border
          border-white/[0.05]
          bg-slate-900/40
          p-4
        "
      >

        <div
          className="
            flex
            items-center
            gap-2
            text-cyan-300
          "
        >

          <BrainCircuit
            size={15}
          />

          <span
            className="
              text-[9px]
              uppercase
              tracking-wider
            "
          >
            Detected Intent
          </span>

        </div>


        <div
          className="
            mt-4
            text-xl
            font-semibold
            text-white
          "
        >
          Spatial Interaction
        </div>


        <p
          className="
            mt-2
            text-[9px]
            leading-5
            text-slate-500
          "
        >
          The interaction layer converts
          camera-based hand movement into
          universal dashboard commands.
        </p>

      </div>


      <div
        className="
          grid
          grid-cols-2
          gap-3
        "
      >

        <div
          className="
            rounded-xl
            border
            border-white/[0.05]
            bg-slate-900/40
            p-4
          "
        >

          <div
            className="
              text-[8px]
              uppercase
              tracking-wider
              text-slate-600
            "
          >
            Confidence
          </div>

          <div
            className="
              mt-3
              text-2xl
              font-semibold
              text-cyan-300
            "
          >
            96%
          </div>

        </div>


        <div
          className="
            rounded-xl
            border
            border-white/[0.05]
            bg-slate-900/40
            p-4
          "
        >

          <div
            className="
              text-[8px]
              uppercase
              tracking-wider
              text-slate-600
            "
          >
            Target
          </div>

          <div
            className="
              mt-3
              text-2xl
              font-semibold
              text-emerald-300
            "
          >
            LOCKED
          </div>

        </div>

      </div>

    </div>
  );
}


/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
  icon,
  eyebrow,
  title,
  right,
}) {

  return (

    <div
      className="
        flex
        items-center
        justify-between
      "
    >

      <div
        className="
          flex
          items-center
          gap-3
        "
      >

        <div
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-xl
            border
            border-cyan-400/20
            bg-cyan-400/5
            text-cyan-300
          "
        >
          {icon}
        </div>


        <div>

          <div
            className="
              text-[8px]
              uppercase
              tracking-[0.25em]
              text-cyan-400
            "
          >
            {eyebrow}
          </div>

          <div
            className="
              mt-1
              text-sm
              font-semibold
              text-white
            "
          >
            {title}
          </div>

        </div>

      </div>


      <div
        className="
          text-[8px]
          uppercase
          tracking-wider
          text-slate-600
        "
      >
        {right}
      </div>

    </div>
  );
}


/* =========================================================
   TELEMETRY
========================================================= */

function Telemetry({
  icon,
  label,
  value,
  active = false,
}) {

  return (

    <div
      className="
        flex
        min-w-0
        items-center
        gap-2
      "
    >

      <span className="shrink-0 text-cyan-300">
        {icon}
      </span>

      <div className="min-w-0">

        <div
          className="
            text-[7px]
            uppercase
            tracking-wider
            text-slate-600
          "
        >
          {label}
        </div>

        <div
          className={`
            mt-0.5
            truncate
            text-[9px]
            ${
              active
                ? "text-emerald-400"
                : "text-cyan-300"
            }
          `}
        >
          {value}
        </div>

      </div>

    </div>
  );
}


/* =========================================================
   CONTROL BUTTON
========================================================= */

function ControlButton({
  icon,
  label,
  value,
}) {

  return (

    <div
      className="
        flex
        min-h-[34px]
        items-center
        justify-center
        gap-2
        rounded-lg
        border
        border-slate-800
        bg-slate-900/70
        px-3
      "
    >

      <span className="text-cyan-300">
        {icon}
      </span>

      <div>

        <div
          className="
            text-[7px]
            text-slate-600
          "
        >
          {label}
        </div>

        <div
          className="
            text-[8px]
            text-slate-300
          "
        >
          {value}
        </div>

      </div>

    </div>
  );
}


/* =========================================================
   INSTRUCTION
========================================================= */

function Instruction({
  gesture,
  action,
}) {

  return (

    <div
      className="
        rounded-full
        border
        border-slate-800
        bg-slate-900/60
        px-3
        py-1.5
        text-[8px]
      "
    >

      <span className="text-cyan-300">
        {gesture}
      </span>

      <span className="mx-1 text-slate-700">
        →
      </span>

      <span className="text-slate-500">
        {action}
      </span>

    </div>
  );
}


export default ARDashboard;