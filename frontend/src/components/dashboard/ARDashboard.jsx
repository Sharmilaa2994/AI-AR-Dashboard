
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import PerformanceChart from "./PerformanceChart";
import SystemStatus from "./SystemStatus";
import ARWidget from "./ARWidget";
import WidgetActionPanel from "./WidgetActionPanel";
import ARWidgetDetail from "./ARWidgetDetail";
import GestureStatus from "../gesture/GestureStatus";


import {
  findTargetWidget,
} from "../../services/interaction/widgetTargeting";

import {
  executeWidgetAction,
} from "../../services/interaction/widgetActions";

import {
  useDashboardData,
} from "../../hooks/useDashboardData";
import {
  getVisionStatus,
  getVisionPipeline,
} from "../../services/api/visionApi";

import {
  recordGesture,
  recordCursorEvent,
  recordWidgetEvent,
} from "../../services/performance/performanceMonitor";



function ARDashboard({
  cursorPosition,
}) {

  // =========================================================
  // STATE
  // =========================================================

  const [
    selectedWidget,
    setSelectedWidget,
  ] = useState(null);


  const [
    hoveredWidget,
    setHoveredWidget,
  ] = useState(null);


  const [
    interactionMessage,
    setInteractionMessage,
  ] = useState(
    "Point at a widget"
  );


  const [
    activeAction,
    setActiveAction,
  ] = useState(null);

  const [
  interactionCount,
  setInteractionCount,
] = useState(0);
  
  const [
  gestureStats,
  setGestureStats,
] = useState({
  POINT: 0,
  PINCH: 0,
  TWO_FINGER: 0,
  FIST: 0,
  OPEN_PALM: 0,
});

  const [
  lastInteraction,
  setLastInteraction,
] = useState("Waiting for gesture...");

  const [
  backendStatus,
  setBackendStatus,
] = useState("CONNECTING");

const [
  visionStatus,
  setVisionStatus,
] = useState(null);

const [
  pipelineStatus,
  setPipelineStatus,
] = useState(null);

const [
  backendError,
  setBackendError,
] = useState(null);

  const {
  data: dashboardData,
  loading: dashboardLoading,
  error: dashboardError,
} = useDashboardData();


  // =========================================================
  // REFS
  // =========================================================

  const widgetRefs =
    useRef({});


  const hoveredWidgetRef =
    useRef(null);


  const selectedWidgetRef =
    useRef(null);


  const previousGestureRef =
    useRef("UNKNOWN");


  const gestureLockRef =
    useRef({
      PINCH: false,
      FIST: false,
      OPEN_PALM: false,
      TWO_FINGER: false,
    });


  const cooldownRef =
    useRef({
      PINCH: false,
      FIST: false,
      OPEN_PALM: false,
      TWO_FINGER: false,
    });


  const timerRef =
    useRef({
      PINCH: null,
      FIST: null,
      OPEN_PALM: null,
      TWO_FINGER: null,
    });

  
  // =========================================================
// INTERACTION TRACKING
// =========================================================

const recordInteraction =
  useCallback(
    (gesture, message) => {

      setInteractionCount(
        (count) => count + 1
      );

      setGestureStats(
        (stats) => ({
          ...stats,
          [gesture]:
            (stats[gesture] || 0) + 1,
        })
      );

      setLastInteraction(
        `${gesture}: ${message}`
      );

      // ================================================
      // PERFORMANCE MONITOR
      // ================================================

      recordGesture(
        gesture
      );

      console.log(
        "AR INTERACTION:",
        {
          gesture,
          message,
          timestamp:
            new Date().toISOString(),
        }
      );

    },
    []
  );

  // =========================================================
// BACKEND CONNECTION
// =========================================================

useEffect(() => {

  let mounted = true;

  const loadBackendStatus = async () => {

    try {

      const [
        vision,
        pipeline,
      ] = await Promise.all([
        getVisionStatus(),
        getVisionPipeline(),
      ]);

      if (!mounted) {
        return;
      }

      setVisionStatus(
        vision
      );

      setPipelineStatus(
        pipeline
      );

      setBackendStatus(
        "ONLINE"
      );

      setBackendError(
        null
      );

    } catch (error) {

      console.error(
        "BACKEND STATUS ERROR:",
        error
      );

      if (!mounted) {
        return;
      }

      setBackendStatus(
        "OFFLINE"
      );

      setBackendError(
        error?.message ||
        "Backend unavailable"
      );
    }
  };

  loadBackendStatus();

  const interval =
    setInterval(
      loadBackendStatus,
      5000
    );

  return () => {

    mounted = false;

    clearInterval(
      interval
    );

  };

}, []);


  // =========================================================
  // WIDGET DATA
  // =========================================================

  const widgets = [
  {
    id: "users",
    title: "Active Users",
    value:
      dashboardData?.active_users ??
      "—",
    description:
      "+12.8% from previous period",
    icon: "👥",
  },

  {
    id: "load",
    title: "System Load",
    value:
      dashboardData
        ? `${dashboardData.system_load}%`
        : "—",
    description:
      "Current system utilization",
    icon: "⚡",
  },

  {
    id: "processing",
    title: "Processing Rate",
    value:
      dashboardData
        ? `${dashboardData.processing_rate}%`
        : "—",
    description:
      "Vision pipeline efficiency",
    icon: "◈",
  },

  {
  id: "interactions",
  title: "Interactions",
  value:
    interactionCount.toLocaleString(),
  description:
    "Gesture events processed",
  icon: "✋",
},
  ];


  // =========================================================
  // SELECT WIDGET
  // =========================================================

  const selectWidget =
    useCallback(
      (widgetId) => {

        if (!widgetId) {
          return;
        }


        selectedWidgetRef.current =
          widgetId;


        setSelectedWidget(
          widgetId
        );

      },
      []
    );


  // =========================================================
  // CLEAR SELECTION
  // =========================================================

  const clearSelection =
    useCallback(
      () => {

        selectedWidgetRef.current =
          null;


        setSelectedWidget(
          null
        );

      },
      []
    );


  // =========================================================
  // HOVER UPDATE
  // =========================================================

  const updateHoveredWidget =
    useCallback(
      (widgetId) => {

        if (
          hoveredWidgetRef.current ===
          widgetId
        ) {
          return;
        }


        hoveredWidgetRef.current =
          widgetId;


        setHoveredWidget(
          widgetId
        );

      },
      []
    );


  // =========================================================
  // FIND CURRENT TARGET
  // =========================================================

  const findCurrentTarget =
    useCallback(
      () => {

        if (!cursorPosition) {
          return null;
        }


        if (
          typeof cursorPosition.x !==
          "number"
        ) {
          return null;
        }


        if (
          typeof cursorPosition.y !==
          "number"
        ) {
          return null;
        }


        return findTargetWidget(
          cursorPosition.x,
          cursorPosition.y,
          widgetRefs.current
        );

      },
      [cursorPosition]
    );


  // =========================================================
  // EFFECT 1
  // POINT TARGETING
  // =========================================================

  useEffect(() => {

    if (!cursorPosition) {

      updateHoveredWidget(
        null
      );

      return;
    }


    const visible =
      Boolean(
        cursorPosition.visible
      );


    // =======================================================
    // ONLY POINT SHOULD CONTROL HOVER
    // =======================================================

    if (
      !visible ||
      cursorPosition.gesture !==
        "POINT"
    ) {

      updateHoveredWidget(
        null
      );

      return;
    }


    const x =
      cursorPosition.x;

    const y =
      cursorPosition.y;


    if (
      typeof x !== "number" ||
      typeof y !== "number"
    ) {

      updateHoveredWidget(
        null
      );

      return;
    }


    const target =
      findTargetWidget(
        x,
        y,
        widgetRefs.current
      );


    updateHoveredWidget(
      target
    );


  }, [
    cursorPosition?.x,
    cursorPosition?.y,
    cursorPosition?.visible,
    cursorPosition?.gesture,
    updateHoveredWidget,
  ]);


  // =========================================================
  // PROCESS PINCH
  // =========================================================

  const processPinch =
    useCallback(() => {

      const target =
        hoveredWidgetRef.current ||
        findCurrentTarget();


      if (!target) {

        setInteractionMessage(
          "Point at a widget before pinching."
        );

        return;
      }


      // SELECT ONLY

      selectWidget(
        target
      );


      setInteractionMessage(
        `${target} selected`
      );


      console.log(
        "PINCH → SELECT:",
        target
      );
      recordInteraction(
        "PINCH",
  `     ${target} selected`
);
    }, [
  findCurrentTarget,
  selectWidget,
  recordInteraction,
]);


  // =========================================================
  // PROCESS FIST
  // =========================================================

  const processFist =
  useCallback(() => {

    const selected =
      selectedWidgetRef.current;


    if (selected) {

        setActiveAction(
          null
        );


        clearSelection();


        setInteractionMessage(
          "Widget closed"
        );


        console.log(
          "FIST → CLOSE"
        );
        recordInteraction(
  "FIST",
  "Widget closed"
);

      } else {

        setInteractionMessage(
          "No selected widget to close."
        );

      }

    }, [
  clearSelection,
  recordInteraction,
]);

  // =========================================================
  // PROCESS OPEN PALM
  // =========================================================

  const processOpenPalm =
    useCallback(() => {

      setActiveAction(
        null
      );


      clearSelection();


      updateHoveredWidget(
        null
      );


      setInteractionMessage(
        "Interaction reset"
      );


      console.log(
        "OPEN PALM → RESET"
      );
      recordInteraction(
  "OPEN_PALM",
  "Interaction reset"
);

    }, [
  clearSelection,
  updateHoveredWidget,
  recordInteraction,
]);


  // =========================================================
  // PROCESS TWO FINGER
  // =========================================================

  const processTwoFinger =
    useCallback(() => {

      const selected =
        selectedWidgetRef.current;


      if (!selected) {

        setInteractionMessage(
          "Select a widget with PINCH first."
        );


        console.log(
          "TWO_FINGER → No selected widget"
        );
        


        return;
      }


      const action =
        executeWidgetAction(
          selected
        );


      if (!action) {

        setInteractionMessage(
          `${selected} secondary action unavailable`
        );


        return;
      }
      recordWidgetEvent(
  selected,
  "secondary_action"
);

      setActiveAction(
        action
      );


      setInteractionMessage(
        action.message ||
        `${selected} secondary action`
      );


      console.log(
        "TWO_FINGER → ACTION:",
        action
      );
      recordInteraction(
  "TWO_FINGER",
  action.message ||
    `${selected} secondary action`
);

    }, [
  recordInteraction,
]);


  // =========================================================
  // GESTURE ENGINE
  // =========================================================

  useEffect(() => {

    if (!cursorPosition) {
      return;
    }


    const gesture =
      String(
        cursorPosition.gesture ||
        "UNKNOWN"
      ).toUpperCase();


    const visible =
      Boolean(
        cursorPosition.visible
      );

// =======================================================
// GESTURE ANALYTICS
// Count each newly detected gesture once
// =======================================================

if (
  visible &&
  gesture !== "UNKNOWN" &&
  previousGestureRef.current !== gesture
) {
  recordInteraction(
    gesture,
    `${gesture} gesture detected`
  );
}

    // =======================================================
    // UNKNOWN / HAND LOST
    // =======================================================

    if (
      !visible &&
      gesture === "UNKNOWN"
    ) {

      Object.keys(
        gestureLockRef.current
      ).forEach(
        (key) => {

          gestureLockRef.current[key] =
            false;
        }
      );


      previousGestureRef.current =
        "UNKNOWN";


      return;
    }


    // =======================================================
    // RELEASE LOCKS WHEN GESTURE CHANGES
    // =======================================================

    if (
      previousGestureRef.current !==
      gesture
    ) {

      Object.keys(
        gestureLockRef.current
      ).forEach(
        (key) => {

          if (key !== gesture) {

            gestureLockRef.current[key] =
              false;
          }

        }
      );


      previousGestureRef.current =
        gesture;
    }


    // =======================================================
    // POINT
    // =======================================================

    if (
      gesture === "POINT"
    ) {

      return;
    }


    // =======================================================
    // PINCH
    // =======================================================

    if (
      gesture === "PINCH"
    ) {

      if (
        gestureLockRef.current.PINCH
      ) {
        return;
      }


      if (
        cooldownRef.current.PINCH
      ) {
        return;
      }


      gestureLockRef.current.PINCH =
        true;


      cooldownRef.current.PINCH =
        true;


      processPinch();


      if (
        timerRef.current.PINCH
      ) {

        clearTimeout(
          timerRef.current.PINCH
        );
      }


      timerRef.current.PINCH =
        setTimeout(
          () => {

            cooldownRef.current.PINCH =
              false;

          },
          450
        );


      return;
    }


    // =======================================================
    // FIST
    // =======================================================

    if (
      gesture === "FIST"
    ) {

      if (
        gestureLockRef.current.FIST
      ) {
        return;
      }


      if (
        cooldownRef.current.FIST
      ) {
        return;
      }


      gestureLockRef.current.FIST =
        true;


      cooldownRef.current.FIST =
        true;


      processFist();


      if (
        timerRef.current.FIST
      ) {

        clearTimeout(
          timerRef.current.FIST
        );
      }


      timerRef.current.FIST =
        setTimeout(
          () => {

            cooldownRef.current.FIST =
              false;

          },
          700
        );


      return;
    }


    // =======================================================
    // OPEN PALM
    // =======================================================

    if (
      gesture === "OPEN_PALM"
    ) {

      if (
        gestureLockRef.current.OPEN_PALM
      ) {
        return;
      }


      if (
        cooldownRef.current.OPEN_PALM
      ) {
        return;
      }


      gestureLockRef.current.OPEN_PALM =
        true;


      cooldownRef.current.OPEN_PALM =
        true;


      processOpenPalm();


      if (
        timerRef.current.OPEN_PALM
      ) {

        clearTimeout(
          timerRef.current.OPEN_PALM
        );
      }


      timerRef.current.OPEN_PALM =
        setTimeout(
          () => {

            cooldownRef.current.OPEN_PALM =
              false;

          },
          700
        );


      return;
    }


    // =======================================================
    // TWO FINGER
    // =======================================================

    if (
      gesture === "TWO_FINGER"
    ) {

      if (
        gestureLockRef.current.TWO_FINGER
      ) {
        return;
      }


      if (
        cooldownRef.current.TWO_FINGER
      ) {
        return;
      }


      gestureLockRef.current.TWO_FINGER =
        true;


      cooldownRef.current.TWO_FINGER =
        true;


      processTwoFinger();


      if (
        timerRef.current.TWO_FINGER
      ) {

        clearTimeout(
          timerRef.current.TWO_FINGER
        );
      }


      timerRef.current.TWO_FINGER =
        setTimeout(
          () => {

            cooldownRef.current.TWO_FINGER =
              false;

          },
          700
        );


      return;
    }


  }, [
    cursorPosition?.gesture,
    cursorPosition?.visible,
    processPinch,
    processFist,
    processOpenPalm,
    processTwoFinger,
  ]);


  // =========================================================
  // WIDGET REF
  // =========================================================

  const setWidgetRef =
    useCallback(
      (
        widgetId,
        element
      ) => {

        if (element) {

          widgetRefs.current[
            widgetId
          ] = element;

        } else {

          delete widgetRefs.current[
            widgetId
          ];
        }

      },
      []
    );


  // =========================================================
  // MANUAL WIDGET SELECTION
  // =========================================================

  const handleWidgetSelect =
    useCallback(
      (widget) => {

        selectWidget(
          widget.id
        );


        setInteractionMessage(
          `${widget.title} selected`
        );

      },
      [selectWidget]
    );


  // =========================================================
  // CLEANUP
  // =========================================================

  useEffect(() => {

    return () => {

      Object.values(
        timerRef.current
      ).forEach(
        (timer) => {

          if (timer) {

            clearTimeout(
              timer
            );
          }

        }
      );


      widgetRefs.current =
        {};


      hoveredWidgetRef.current =
        null;


      selectedWidgetRef.current =
        null;

    };

  }, []);


  // =========================================================
  // RENDER
  // =========================================================

  return (

   <section
  className="
    relative
    min-h-screen
    overflow-hidden
    bg-slate-950
    bg-transparent
    px-4
    pb-12
    pt-8
    sm:px-6
    lg:px-8
  "
>
{/* =====================================================
    AI / AR AMBIENT BACKGROUND
====================================================== */}

<div className="pointer-events-none absolute inset-0 overflow-hidden">

  {/* Cyan ambient orb */}
  <div
    className="
      absolute
      -left-32
      top-20
      h-80
      w-80
      rounded-full
      bg-cyan-500/10
      blur-[100px]
      animate-[pulse_6s_ease-in-out_infinite]
    "
  />

  {/* Purple ambient orb */}
  <div
    className="
      absolute
      right-[-120px]
      top-1/3
      h-96
      w-96
      rounded-full
      bg-purple-500/10
      blur-[120px]
      animate-[pulse_8s_ease-in-out_infinite]
    "
  />

  {/* Blue ambient orb */}
  <div
    className="
      absolute
      bottom-[-150px]
      left-1/2
      h-96
      w-96
      -translate-x-1/2
      rounded-full
      bg-blue-500/5
      blur-[120px]
      animate-[pulse_10s_ease-in-out_infinite]
    "
  />

  {/* Moving scan line */}
  <div
    className="
      absolute
      left-0
      top-0
      h-px
      w-full
      bg-gradient-to-r
      from-transparent
      via-cyan-400/30
      to-transparent
      animate-[scan_7s_linear_infinite]
    "
  />

</div>
      {/* =====================================================
          VIRTUAL CURSOR
      ====================================================== */}


 {/* =====================================================
    FUTURISTIC AR BACKGROUND
===================================================== */}

<div className="pointer-events-none absolute inset-0 overflow-hidden">

  {/* Base atmospheric glow */}
  <div
    className="
      absolute
      -left-40
      top-20
      h-96
      w-96
      rounded-full
      bg-cyan-500/10
      blur-[120px]
      animate-pulse
    "
  />

  <div
    className="
      absolute
      -right-40
      top-[30%]
      h-[420px]
      w-[420px]
      rounded-full
      bg-purple-500/10
      blur-[130px]
      animate-pulse
    "
  />

  <div
    className="
      absolute
      bottom-[-180px]
      left-1/2
      h-[420px]
      w-[420px]
      -translate-x-1/2
      rounded-full
      bg-blue-500/5
      blur-[120px]
    "
  />

  {/* AR Grid */}
  <div
    className="absolute inset-0 opacity-[0.055]"
    style={{
      backgroundImage: `
        linear-gradient(
          rgba(34,211,238,0.5) 1px,
          transparent 1px
        ),
        linear-gradient(
          90deg,
          rgba(34,211,238,0.5) 1px,
          transparent 1px
        )
      `,
      backgroundSize: "50px 50px",
      maskImage:
        "linear-gradient(to bottom, black 0%, transparent 90%)",
      WebkitMaskImage:
        "linear-gradient(to bottom, black 0%, transparent 90%)",
    }}
  />

  {/* Moving scan beam */}
  <div
    className="
      absolute
      left-0
      top-0
      h-px
      w-full
      bg-gradient-to-r
      from-transparent
      via-cyan-300/60
      to-transparent
      animate-[arScan_6s_linear_infinite]
    "
  />

  {/* Center AI core */}
  <div
    className="
      absolute
      left-1/2
      top-1/2
      h-[520px]
      w-[520px]
      -translate-x-1/2
      -translate-y-1/2
      rounded-full
      bg-cyan-400/[0.025]
      blur-3xl
    "
  />

</div>
      {/* =====================================================
          MAIN
      ====================================================== */}

      <div
  className="
    relative
    mx-auto
    w-full
    max-w-[1500px]
    animate-[dashboardEnter_0.8s_ease-out]
  "
>
       {/* ===================================================
    PROFESSIONAL AR HEADER
==================================================== */}

<div
  className="
    relative
    mb-8
    overflow-hidden
    rounded-3xl
    border
    border-cyan-500/10
    bg-slate-950/40
    px-6
    py-6
    backdrop-blur-xl
  "
>

  {/* =================================================
      HEADER GLOW
  ================================================== */}

  <div
    className="
      pointer-events-none
      absolute
      -right-24
      -top-24
      h-64
      w-64
      rounded-full
      bg-cyan-500/10
      blur-3xl
    "
  />

  <div
    className="
      pointer-events-none
      absolute
      -bottom-32
      left-1/3
      h-56
      w-56
      rounded-full
      bg-purple-500/5
      blur-3xl
    "
  />


  {/* =================================================
      ANIMATED TOP LINE
  ================================================== */}

  <div
    className="
      pointer-events-none
      absolute
      left-0
      top-0
      h-px
      w-full
      bg-gradient-to-r
      from-transparent
      via-cyan-400/70
      to-transparent
      animate-pulse
    "
  />


  <div
    className="
      relative
      flex
      flex-col
      gap-6
      lg:flex-row
      lg:items-center
      lg:justify-between
    "
  >

    {/* =================================================
        TITLE AREA
    ================================================== */}

    <div>

      {/* SYSTEM LABEL */}

      <div
        className="
          mb-3
          flex
          items-center
          gap-3
        "
      >

        <div
          className="
            relative
            flex
            h-6
            w-6
            items-center
            justify-center
            rounded-md
            border
            border-cyan-400/30
            bg-cyan-400/10
          "
        >

          <span
            className="
              h-1.5
              w-1.5
              rounded-full
              bg-cyan-300
              shadow-[0_0_10px_rgba(34,211,238,1)]
              animate-pulse
            "
          />

        </div>


        <span
          className="
            text-[10px]
            font-medium
            uppercase
            tracking-[0.3em]
            text-cyan-400
          "
        >
          AI / AR CONTROL SYSTEM
        </span>


        <span
          className="
            hidden
            h-px
            w-16
            bg-gradient-to-r
            from-cyan-400/40
            to-transparent
            sm:block
          "
        />

      </div>


      {/* TITLE */}

      <h1
        className="
          text-3xl
          font-semibold
          tracking-tight
          text-white
          md:text-4xl
        "
      >

        Intelligent{" "}

        <span
          className="
            bg-gradient-to-r
            from-cyan-300
            via-cyan-400
            to-purple-400
            bg-clip-text
            text-transparent
          "
        >
          AR Dashboard
        </span>

      </h1>


      {/* DESCRIPTION */}

      <p
        className="
          mt-3
          max-w-2xl
          text-sm
          leading-relaxed
          text-slate-400
        "
      >
        Real-time computer vision, gesture intelligence,
        and spatial interaction in a unified interface.
      </p>


      {/* TECHNOLOGY TAGS */}

      <div
        className="
          mt-5
          flex
          flex-wrap
          gap-2
        "
      >

        <span
          className="
            rounded-lg
            border
            border-cyan-500/20
            bg-cyan-500/5
            px-2.5
            py-1.5
            text-[9px]
            uppercase
            tracking-wider
            text-cyan-300
          "
        >
          Computer Vision
        </span>


        <span
          className="
            rounded-lg
            border
            border-purple-500/20
            bg-purple-500/5
            px-2.5
            py-1.5
            text-[9px]
            uppercase
            tracking-wider
            text-purple-300
          "
        >
          Gesture AI
        </span>


        <span
          className="
            rounded-lg
            border
            border-blue-500/20
            bg-blue-500/5
            px-2.5
            py-1.5
            text-[9px]
            uppercase
            tracking-wider
            text-blue-300
          "
        >
          Spatial UI
        </span>

      </div>

    </div>


    {/* =================================================
        SYSTEM TELEMETRY
    ================================================== */}

    <div
      className="
        grid
        grid-cols-2
        gap-2
        sm:grid-cols-4
        lg:grid-cols-2
        xl:grid-cols-4
      "
    >

      {/* STATUS */}

      <div
        className="
          min-w-[105px]
          rounded-xl
          border
          border-slate-800
          bg-slate-950/70
          px-4
          py-3
          backdrop-blur-xl
        "
      >

        <div
          className="
            text-[9px]
            uppercase
            tracking-[0.16em]
            text-slate-600
          "
        >
          System
        </div>

        <div
          className="
            mt-2
            flex
            items-center
            gap-2
            text-xs
            font-medium
          "
        >

          <span
            className={`
              h-1.5
              w-1.5
              rounded-full
              ${
                backendStatus === "ONLINE"
                  ? `
                    bg-emerald-400
                    shadow-[0_0_8px_rgba(52,211,153,0.9)]
                  `
                  : backendStatus === "CONNECTING"
                  ? `
                    bg-yellow-400
                    shadow-[0_0_8px_rgba(250,204,21,0.8)]
                  `
                  : `
                    bg-red-400
                    shadow-[0_0_8px_rgba(248,113,113,0.8)]
                  `
              }
            `}
          />

          <span
            className={
              backendStatus === "ONLINE"
                ? "text-emerald-400"
                : backendStatus === "CONNECTING"
                ? "text-yellow-400"
                : "text-red-400"
            }
          >
            {backendStatus}
          </span>

        </div>

      </div>


      {/* VISION */}

      <div
        className="
          min-w-[105px]
          rounded-xl
          border
          border-slate-800
          bg-slate-950/70
          px-4
          py-3
          backdrop-blur-xl
        "
      >

        <div
          className="
            text-[9px]
            uppercase
            tracking-[0.16em]
            text-slate-600
          "
        >
          Vision
        </div>

        <div
          className="
            mt-2
            text-xs
            font-medium
            text-cyan-400
          "
        >
          {visionStatus?.opencv || "INITIALIZING"}
        </div>

      </div>


      {/* HAND */}

      <div
        className="
          min-w-[105px]
          rounded-xl
          border
          border-slate-800
          bg-slate-950/70
          px-4
          py-3
          backdrop-blur-xl
        "
      >

        <div
          className="
            text-[9px]
            uppercase
            tracking-[0.16em]
            text-slate-600
          "
        >
          Hand AI
        </div>

        <div
          className={`
            mt-2
            flex
            items-center
            gap-2
            text-xs
            font-medium
            text-purple-400
            ${
              pipelineStatus?.mediapipe === "ready" ||
              pipelineStatus?.mediapipe === "initialized"
                ? "text-emerald-400"
                : "text-purple-400"
            }
          `}
        >

          <span className="text-sm">
            ✋
          </span>

         {pipelineStatus?.mediapipe === "ready" ||
 pipelineStatus?.mediapipe === "initialized"
  ? "READY"
  : pipelineStatus?.mediapipe === "not_initialized"
  ? "INITIALIZING"
  : pipelineStatus?.mediapipe || "WAITING"}
        </div>

      </div>


      {/* EVENTS */}

      <div
        className="
          min-w-[105px]
          rounded-xl
          border
          border-slate-800
          bg-slate-950/70
          px-4
          py-3
          backdrop-blur-xl
        "
      >

        <div
          className="
            text-[9px]
            uppercase
            tracking-[0.16em]
            text-slate-600
          "
        >
          Events
        </div>

        <div
          className="
            mt-2
            text-xs
            font-medium
            text-yellow-400
          "
        >
          {interactionCount}
          <span className="ml-1 text-slate-600">
            processed
          </span>
        </div>

      </div>

    </div>

  </div>


  {/* =================================================
      BOTTOM TELEMETRY LINE
  ================================================== */}

  <div
    className="
      relative
      mt-6
      flex
      items-center
      justify-between
      border-t
      border-slate-800/70
      pt-4
    "
  >

    <div
      className="
        flex
        items-center
        gap-2
        text-[9px]
        uppercase
        tracking-[0.18em]
        text-slate-600
      "
    >

      <span>
        AR NETWORK
      </span>

      <span className="text-slate-800">
        /
      </span>

      <span>
        REALTIME
      </span>

      <span className="text-slate-800">
        /
      </span>

      <span className="text-cyan-500/60">
        ACTIVE
      </span>

    </div>


    <div
      className="
        hidden
        items-center
        gap-2
        text-[9px]
        uppercase
        tracking-[0.18em]
        text-slate-600
        sm:flex
      "
    >

      <span>
        Gesture Interface
      </span>

      <span
        className="
          h-1
          w-1
          rounded-full
          bg-cyan-400/70
          animate-pulse
        "
      />

      <span>
        Spatial Control
      </span>

    </div>

  </div>

</div>
        {/* ===================================================
            WIDGETS
        ==================================================== */}

        <div
  className="
    grid
    gap-4
    sm:grid-cols-2
    xl:grid-cols-4
  "
>

          {widgets.map(
            (widget) => (

              <ARWidget
                key={
                  widget.id
                }

                ref={
                  (element) =>
                    setWidgetRef(
                      widget.id,
                      element
                    )
                }

                title={
                  widget.title
                }

                value={
                  widget.value
                }

                description={
                  widget.description
                }

                icon={
                  widget.icon
                }

                selected={
                  selectedWidget ===
                  widget.id
                }

                hovered={
                  hoveredWidget ===
                  widget.id
                }

                onSelect={() =>
                  handleWidgetSelect(
                    widget
                  )
                }
              />

            )
          )}

        </div>


        {/* ===================================================
            ANALYTICS
        ==================================================== */}

        <div
          className="
            mt-4
            grid
            gap-4
            lg:grid-cols-3
          "
        >

          <div
            className="
              lg:col-span-2
            "
          >

            <PerformanceChart />

          </div>


          <SystemStatus />

        </div>


        {/* ===================================================
            GESTURE STATUS
        ==================================================== */}

        <div
          className="
            mt-6
            rounded-2xl
            border
            border-cyan-500/10
            bg-cyan-500/5
            p-5
            backdrop-blur-xl
          "
        >

          <div
            className="
              flex
              flex-col
              gap-5
            "
          >

            <div>

              <div
                className="
                  text-xs
                  uppercase
                  tracking-wider
                  text-cyan-400
                "
              >
                Gesture Interface
              </div>


              <p
                className="
                  mt-2
                  text-sm
                  text-slate-400
                "
              >
                POINT to move •
                PINCH to select •
                FIST to close •
                OPEN PALM to reset •
                TWO FINGER for secondary action.
              </p>


              <div
  className="
    mt-3
    text-xs
    text-purple-300
  "
>
  {interactionMessage}
</div>

<div
  className="
    mt-2
    text-xs
    text-slate-500
  "
>
  Last event: {lastInteraction}
</div>

            </div>


            {/* GESTURE STATUS */}

            <GestureStatus
              gesture={
                cursorPosition?.gesture
              }

              confidence={
                cursorPosition?.confidence
              }
            />


            {/* GESTURE INDICATORS */}

            <div
              className="
                flex
                flex-wrap
                gap-2
                text-xs
              "
            >

              <span
                className="
                  rounded-lg
                  border
                  border-cyan-500/30
                  bg-cyan-500/10
                  px-3
                  py-2
                  text-cyan-300
                "
              >
                ☝ POINT
              </span>


              <span
                className="
                  rounded-lg
                  border
                  border-purple-500/30
                  bg-purple-500/10
                  px-3
                  py-2
                  text-purple-300
                "
              >
                🤏 PINCH
              </span>


              <span
                className="
                  rounded-lg
                  border
                  border-red-500/30
                  bg-red-500/10
                  px-3
                  py-2
                  text-red-300
                "
              >
                ✊ FIST
              </span>


              <span
                className="
                  rounded-lg
                  border
                  border-emerald-500/30
                  bg-emerald-500/10
                  px-3
                  py-2
                  text-emerald-300
                "
              >
                ✋ PALM
              </span>


              <span
                className="
                  rounded-lg
                  border
                  border-yellow-500/30
                  bg-yellow-500/10
                  px-3
                  py-2
                  text-yellow-300
                "
              >
                ✌ TWO
              </span>

            </div>

          </div>

        </div>

{/* ===================================================
    GESTURE ANALYTICS
==================================================== */}

<div
  className="
    mt-6
    rounded-2xl
    border
    border-slate-700
    bg-slate-900/60
    p-5
    backdrop-blur-xl
  "
>

  <div
    className="
      mb-4
      flex
      items-center
      justify-between
    "
  >

    <div>

      <div
        className="
          text-xs
          uppercase
          tracking-wider
          text-purple-400
        "
      >
        Gesture Analytics
      </div>

      <div
        className="
          mt-1
          text-sm
          text-slate-400
        "
      >
        Real-time AR interaction statistics
      </div>

    </div>

    <div
      className="
        rounded-lg
        border
        border-purple-500/30
        bg-purple-500/10
        px-3
        py-2
        text-xs
        text-purple-400
      "
    >
      {interactionCount} EVENTS
    </div>

  </div>


  <div
    className="
      grid
      grid-cols-2
      gap-3
      md:grid-cols-5
    "
  >

    {[
      ["POINT", "Point"],
      ["PINCH", "Pinch"],
      ["TWO_FINGER", "Two Finger"],
      ["FIST", "Fist"],
      ["OPEN_PALM", "Open Palm"],
    ].map(
      ([key, label]) => (

        <div
          key={key}
          className="
            rounded-xl
            border
            border-slate-800
            bg-slate-950/70
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
            {label}
          </div>

          <div
            className="
              mt-2
              text-2xl
              font-semibold
              text-white
            "
          >
            {gestureStats[key] || 0}
          </div>

          <div
            className="
              mt-1
              text-[10px]
              text-slate-600
            "
          >
            interactions
          </div>

        </div>

      )
    )}

  </div>

</div>

{/* ===================================================
    BACKEND STATUS
==================================================== */}

<div
  className="
    mt-6
    rounded-2xl
    border
    border-slate-700
    bg-slate-900/60
    p-5
    backdrop-blur-xl
  "
>

  <div
    className="
      mb-4
      flex
      items-center
      justify-between
    "
  >

    <div>

      <div
        className="
          text-xs
          uppercase
          tracking-wider
          text-cyan-400
        "
      >
        Backend Integration
      </div>

      <div
        className="
          mt-1
          text-sm
          text-slate-400
        "
      >
        FastAPI computer vision services
      </div>

    </div>

    <div
      className={`
        rounded-lg
        border
        px-3
        py-2
        text-xs
        ${
          backendStatus === "ONLINE"
            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
            : backendStatus === "CONNECTING"
            ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
            : "border-red-500/30 bg-red-500/10 text-red-400"
        }
      `}
    >
      ● {backendStatus}
    </div>

  </div>


  <div
    className="
      grid
      gap-3
      md:grid-cols-4
    "
  >

    <div
      className="
        rounded-xl
        border
        border-slate-800
        bg-slate-950/70
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
        Computer Vision
      </div>

      <div
        className="
          mt-2
          text-sm
          text-emerald-400
        "
      >
        {visionStatus?.opencv || "—"}
      </div>

    </div>


    <div
      className="
        rounded-xl
        border
        border-slate-800
        bg-slate-950/70
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
        Hand Tracking
      </div>

      <div
        className="
          mt-2
          text-sm
          text-cyan-400
        "
      >
        {pipelineStatus?.mediapipe || "—"}
      </div>

    </div>


    <div
      className="
        rounded-xl
        border
        border-slate-800
        bg-slate-950/70
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
        Frame Processing
      </div>

      <div
        className="
          mt-2
          text-sm
          text-purple-400
        "
      >
        {pipelineStatus?.frame_processing || "—"}
      </div>

    </div>


    <div
      className="
        rounded-xl
        border
        border-slate-800
        bg-slate-950/70
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
        Object Detection
      </div>

      <div
  className={`
    mt-2
    flex
    items-center
    gap-2
    text-sm
    ${
      pipelineStatus?.object_detection === "ready" ||
      pipelineStatus?.object_detection === "initialized"
        ? "text-emerald-400"
        : "text-yellow-400"
    }
  `}
>
  <span>
    ◈
  </span>

  {pipelineStatus?.object_detection === "ready" ||
  pipelineStatus?.object_detection === "initialized"
    ? "READY"
    : pipelineStatus?.object_detection === "not_initialized"
    ? "STANDBY"
    : pipelineStatus?.object_detection || "—"}
</div>

    </div>

  </div>


  {backendError && (

    <div
      className="
        mt-4
        rounded-lg
        border
        border-red-500/20
        bg-red-500/5
        px-4
        py-3
        text-xs
        text-red-300
      "
    >
      Backend error: {backendError}
    </div>

  )}

</div>

        {/* ===================================================
            ACTION PANEL
        ==================================================== */}

        <WidgetActionPanel
          action={
            activeAction
          }

          onClose={() => {

            setActiveAction(
              null
            );

            clearSelection();

            setInteractionMessage(
              "Widget closed"
            );

          }}
        />


        {/* ===================================================
            DETAIL
        ==================================================== */}

        {activeAction && (

          <ARWidgetDetail
            action={
              activeAction
            }

            onClose={() => {

              setActiveAction(
                null
              );

              clearSelection();

              setInteractionMessage(
                "Widget closed"
              );

            }}
          />

        )}

      </div>

    </section>
  );
}


export default ARDashboard;