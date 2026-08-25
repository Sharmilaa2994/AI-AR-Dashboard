
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
  // WIDGET DATA
  // =========================================================

  const widgets = [

    {
      id: "users",
      title: "Active Users",
      value: "1,284",
      description:
        "+12.8% from previous period",
      icon: "👥",
    },

    {
      id: "load",
      title: "System Load",
      value: "42%",
      description:
        "Optimal operating range",
      icon: "⚡",
    },

    {
      id: "processing",
      title: "Processing Rate",
      value: "98.6%",
      description:
        "Vision pipeline efficiency",
      icon: "◈",
    },

    {
      id: "interactions",
      title: "Interactions",
      value: "8,492",
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

    }, [
      findCurrentTarget,
      selectWidget,
    ]);


  // =========================================================
  // PROCESS FIST
  // =========================================================

  const processFist =
    useCallback(() => {

      const selected =
        selectedWidgetRef.current;


      if (
        activeAction ||
        selected
      ) {

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

      } else {

        setInteractionMessage(
          "No selected widget to close."
        );

      }

    }, [
      activeAction,
      clearSelection,
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

    }, [
      clearSelection,
      updateHoveredWidget,
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

    }, []);


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
        bg-transparent
        px-6
        py-8
      "
    >

      {/* =====================================================
          VIRTUAL CURSOR
      ====================================================== */}


      {/* =====================================================
          GRID
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-10
        "
      >

        <div
          className="
            absolute
            inset-0
          "
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,211,238,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.08) 1px, transparent 1px)",

            backgroundSize:
              "50px 50px",
          }}
        />

      </div>


      {/* =====================================================
          GLOW
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/4
          h-96
          w-96
          -translate-x-1/2
          rounded-full
          bg-cyan-500/5
          blur-3xl
        "
      />


      {/* =====================================================
          MAIN
      ====================================================== */}

      <div
        className="
          relative
          mx-auto
          max-w-7xl
        "
      >

        {/* HEADER */}

        <div
          className="
            mb-8
            flex
            items-end
            justify-between
          "
        >

          <div>

            <div
              className="
                mb-2
                flex
                items-center
                gap-2
              "
            >

              <span
                className="
                  h-2
                  w-2
                  rounded-full
                  bg-cyan-400
                  shadow-[0_0_12px_rgba(34,211,238,0.8)]
                "
              />

              <span
                className="
                  text-xs
                  uppercase
                  tracking-[0.25em]
                  text-cyan-400
                "
              >
                AR Environment
              </span>

            </div>


            <h1
              className="
                text-3xl
                font-semibold
                text-white
                md:text-4xl
              "
            >
              Intelligent AR Dashboard
            </h1>


            <p
              className="
                mt-2
                max-w-2xl
                text-sm
                text-slate-500
              "
            >
              Computer vision powered spatial
              dashboard with gesture-based
              interaction.
            </p>

          </div>


          {/* SYSTEM */}

          <div
            className="
              hidden
              rounded-xl
              border
              border-slate-700
              bg-slate-900/70
              px-4
              py-3
              backdrop-blur-xl
              md:block
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
              System
            </div>


            <div
              className="
                mt-1
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
                "
              />

              Operational

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
            md:grid-cols-2
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