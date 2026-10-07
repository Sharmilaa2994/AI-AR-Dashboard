import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";


/* =========================================================
   CONTEXT
========================================================= */

const ARInteractionContext =
  createContext(null);


/* =========================================================
   INITIAL CURSOR
========================================================= */

const INITIAL_CURSOR = {
  x: 0,
  y: 0,
  visible: false,
  gesture: "UNKNOWN",
  confidence: 0,
};


/* =========================================================
   INITIAL GESTURE STATISTICS
========================================================= */

const INITIAL_GESTURES = {
  POINT: 0,
  PINCH: 0,
  TWO_FINGER: 0,
  FIST: 0,
  OPEN_PALM: 0,
};


/* =========================================================
   PROVIDER
========================================================= */

export function ARInteractionProvider({
  children,
}) {

  /* =======================================================
     CURSOR
  ======================================================= */

  const [cursor, setCursor] =
    useState(INITIAL_CURSOR);


  /* =======================================================
     CURRENT PAGE
  ======================================================= */

  const [activePage, setActivePage] =
    useState("HOME");


  /* =======================================================
     WIDGET STATE
  ======================================================= */

  const [selectedWidget, setSelectedWidget] =
    useState(null);

  const [hoveredWidget, setHoveredWidget] =
    useState(null);

  const [draggingWidget, setDraggingWidget] =
    useState(null);


  /* =======================================================
     INTERACTION TARGET
  ======================================================= */

  const [interactionTarget, setInteractionTargetState] =
    useState(null);


  /* =======================================================
     SCROLL
  ======================================================= */

  const [scrollPosition, setScrollPosition] =
    useState(
      typeof window !== "undefined"
        ? window.scrollY
        : 0
    );


  /* =======================================================
     INTERACTION STATUS
  ======================================================= */

  const [interactionMessage, setInteractionMessage] =
    useState(
      "Point at a widget"
    );


  const [interactionCount, setInteractionCount] =
    useState(0);


  /* =======================================================
     GESTURE STATISTICS
  ======================================================= */

  const [gestureStats, setGestureStats] =
    useState(
      INITIAL_GESTURES
    );


  /* =======================================================
     REGISTERED WIDGETS
  ======================================================= */

  const [widgetPositions, setWidgetPositions] =
    useState({});


  /* =======================================================
     REFS
  ======================================================= */

  const previousGestureRef =
    useRef("UNKNOWN");


  const lastCursorRef =
    useRef(INITIAL_CURSOR);


  const pinchStartRef =
    useRef(null);


  const pinchMovedRef =
    useRef(false);


  const lastScrollYRef =
    useRef(0);


  const gestureLockRef =
    useRef({
      PINCH: false,
      TWO_FINGER: false,
      FIST: false,
      OPEN_PALM: false,
    });


  const widgetElementsRef =
    useRef(new Map());


  /* =======================================================
     UPDATE CURSOR
  ======================================================= */

  const updateCursor = useCallback(
    (nextCursor) => {

      if (!nextCursor) {
        return;
      }


      setCursor((previous) => {

        const next = {
          ...previous,
          ...nextCursor,
        };


        if (
          previous.x === next.x &&
          previous.y === next.y &&
          previous.visible ===
            next.visible &&
          previous.gesture ===
            next.gesture &&
          previous.confidence ===
            next.confidence
        ) {
          return previous;
        }


        return next;

      });

    },
    []
  );


  /* =======================================================
     REGISTER WIDGET
     
     Stores the REAL DOM ELEMENT.
     This is important for:
     - Point
     - Select
     - Drag
     - Hover
========================================================= */

  const registerWidget = useCallback(
    (widgetId, element) => {

      if (
        !widgetId ||
        !element
      ) {
        return;
      }


      widgetElementsRef.current.set(
        widgetId,
        element
      );


      const rect =
        element.getBoundingClientRect();


      setWidgetPositions(
        (previous) => ({
          ...previous,

          [widgetId]: {
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
            width: rect.width,
            height: rect.height,
          },

        })
      );

    },
    []
  );


  /* =======================================================
     UNREGISTER WIDGET
  ======================================================= */

  const unregisterWidget =
    useCallback(
      (widgetId) => {

        if (!widgetId) {
          return;
        }


        widgetElementsRef.current.delete(
          widgetId
        );


        setWidgetPositions(
          (previous) => {

            if (
              !previous[widgetId]
            ) {
              return previous;
            }


            const next = {
              ...previous,
            };


            delete next[widgetId];


            return next;

          }
        );


        setHoveredWidget(
          (previous) =>
            previous === widgetId
              ? null
              : previous
        );


        setSelectedWidget(
          (previous) =>
            previous === widgetId
              ? null
              : previous
        );


        setDraggingWidget(
          (previous) =>
            previous === widgetId
              ? null
              : previous
        );

      },
      []
    );


  /* =======================================================
     REFRESH WIDGET RECTANGLES
     
     Called after:
     - Page change
     - Resize
     - Scroll
     - Layout change
========================================================= */

  const refreshWidgetPositions =
    useCallback(() => {

      const nextPositions = {};


      widgetElementsRef.current.forEach(
        (element, widgetId) => {

          if (
            !element ||
            !element.isConnected
          ) {
            return;
          }


          const rect =
            element.getBoundingClientRect();


          nextPositions[widgetId] = {
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
            width: rect.width,
            height: rect.height,
          };

        }
      );


      setWidgetPositions(
        nextPositions
      );

    }, []);


  /* =======================================================
     REFRESH ON RESIZE / SCROLL
========================================================= */

  useEffect(() => {

    const handleResize = () => {
      refreshWidgetPositions();
    };


    const handleScroll = () => {

      setScrollPosition(
        window.scrollY
      );

      refreshWidgetPositions();

    };


    window.addEventListener(
      "resize",
      handleResize
    );


    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );


    return () => {

      window.removeEventListener(
        "resize",
        handleResize
      );


      window.removeEventListener(
        "scroll",
        handleScroll
      );

    };

  }, [
    refreshWidgetPositions,
  ]);


  /* =======================================================
     FIND WIDGET AT CURSOR
========================================================= */

  const findWidgetAtCursor =
    useCallback(
      (
        x = cursor.x,
        y = cursor.y
      ) => {

        if (
          typeof x !== "number" ||
          typeof y !== "number"
        ) {
          return null;
        }


        /*
         * First use the actual DOM.
         */

        const element =
          document.elementFromPoint(
            x,
            y
          );


        if (element) {

          const widget =
            element.closest(
              "[data-ar-widget]"
            );


          if (
            widget &&
            widget.dataset.arWidget
          ) {

            return (
              widget.dataset.arWidget
            );

          }

        }


        /*
         * Fallback to registered
         * widget rectangles.
         */

        const entries =
          Object.entries(
            widgetPositions
          );


        for (
          const [widgetId, rect]
          of entries
        ) {

          if (
            x >= rect.left &&
            x <= rect.right &&
            y >= rect.top &&
            y <= rect.bottom
          ) {

            return widgetId;

          }

        }


        return null;

      },
      [
        cursor.x,
        cursor.y,
        widgetPositions,
      ]
    );


  /* =======================================================
     SET INTERACTION TARGET
========================================================= */

  const setInteractionTarget =
    useCallback(
      (targetId) => {

        setInteractionTargetState(
          targetId || null
        );

      },
      []
    );


  /* =======================================================
     POINT / HOVER
========================================================= */

  useEffect(() => {

    if (
      !cursor.visible ||
      !cursor.x ||
      !cursor.y
    ) {
      return;
    }


    const target =
      findWidgetAtCursor(
        cursor.x,
        cursor.y
      );


    setHoveredWidget(
      target
    );


    setInteractionTargetState(
      target
    );


  }, [
    cursor.x,
    cursor.y,
    cursor.visible,
    findWidgetAtCursor,
  ]);


  /* =======================================================
     RECORD GESTURE
========================================================= */

  const recordGesture =
    useCallback(
      (gesture) => {

        if (
          !gesture ||
          gesture === "UNKNOWN"
        ) {
          return;
        }


        setGestureStats(
          (previous) => ({
            ...previous,

            [gesture]:
              (previous[gesture] || 0) +
              1,
          })
        );

      },
      []
    );


  /* =======================================================
     SELECT WIDGET
========================================================= */

  const selectWidget =
    useCallback(
      (widgetId) => {

        if (!widgetId) {
          return;
        }


        setSelectedWidget(
          widgetId
        );


        setInteractionMessage(
          `${widgetId} selected`
        );


        setInteractionCount(
          (value) =>
            value + 1
        );

      },
      []
    );


  /* =======================================================
     CLEAR SELECTION
========================================================= */

  const clearSelection =
    useCallback(() => {

      setSelectedWidget(
        null
      );


      setDraggingWidget(
        null
      );


      pinchStartRef.current =
        null;


      pinchMovedRef.current =
        false;


      setInteractionMessage(
        "Selection cleared"
      );

    }, []);


  /* =======================================================
     START DRAG
========================================================= */

  const startDrag =
    useCallback(
      (widgetId = selectedWidget) => {

        if (!widgetId) {
          return;
        }


        setDraggingWidget(
          widgetId
        );


        setInteractionMessage(
          `${widgetId} moving`
        );

      },
      [
        selectedWidget,
      ]);


  /* =======================================================
     END DRAG
========================================================= */

  const endDrag =
    useCallback(() => {

      setDraggingWidget(
        null
      );


      setInteractionMessage(
        selectedWidget
          ? `${selectedWidget} positioned`
          : "Drag completed"
      );


    }, [
      selectedWidget,
    ]);


  /* =======================================================
     MOVE WIDGET
     
     IMPORTANT:
     We move the ACTUAL DOM ELEMENT using transform.
     
     This means every page can use the same
     interaction engine.
========================================================= */

  const moveWidget =
    useCallback(
      (
        widgetId,
        deltaX,
        deltaY
      ) => {

        if (!widgetId) {
          return;
        }


        const element =
          widgetElementsRef.current.get(
            widgetId
          );


        if (!element) {
          return;
        }


        /*
         * Store the current translation
         * on the element.
         */

        const currentX =
          Number(
            element.dataset.arTranslateX ||
              0
          );


        const currentY =
          Number(
            element.dataset.arTranslateY ||
              0
          );


        const nextX =
          currentX + deltaX;


        const nextY =
          currentY + deltaY;


        element.dataset.arTranslateX =
          String(nextX);


        element.dataset.arTranslateY =
          String(nextY);


        element.style.transform =
          `translate3d(${nextX}px, ${nextY}px, 0)`;


        /*
         * Update stored rectangle.
         */

        const current =
          widgetPositions[widgetId];


        if (current) {

          setWidgetPositions(
            (previous) => {

              const existing =
                previous[widgetId];

              if (!existing) {
                return previous;
              }


              return {
                ...previous,

                [widgetId]: {
                  ...existing,

                  left:
                    existing.left +
                    deltaX,

                  right:
                    existing.right +
                    deltaX,

                  top:
                    existing.top +
                    deltaY,

                  bottom:
                    existing.bottom +
                    deltaY,
                },

              };

            }
          );

        }

      },
      [
        widgetPositions,
      ]);


  /* =======================================================
     SCROLL
========================================================= */

  const scrollPage =
    useCallback(
      (amount) => {

        if (
          !amount ||
          typeof window ===
            "undefined"
        ) {
          return;
        }


        window.scrollBy({
          top: amount,
          behavior: "auto",
        });


        setInteractionMessage(
          amount > 0
            ? "Scrolling down"
            : "Scrolling up"
        );

      },
      []
    );


  /* =======================================================
     CANCEL
========================================================= */

  const closeInteraction =
    useCallback(() => {

      if (
        draggingWidget
      ) {

        endDrag();

        return;

      }


      if (
        selectedWidget
      ) {

        clearSelection();

        return;

      }


      setInteractionMessage(
        "Interaction cancelled"
      );

    }, [
      draggingWidget,
      selectedWidget,
      endDrag,
      clearSelection,
    ]);


  /* =======================================================
     RESET
========================================================= */

  const resetInteraction =
    useCallback(() => {

      setSelectedWidget(
        null
      );


      setHoveredWidget(
        null
      );


      setDraggingWidget(
        null
      );


      setInteractionTargetState(
        null
      );


      setInteractionMessage(
        "Interaction reset"
      );


      pinchStartRef.current =
        null;


      pinchMovedRef.current =
        false;


      /*
       * Reset all widget translations.
       */

      widgetElementsRef.current.forEach(
        (element) => {

          if (!element) {
            return;
          }


          delete element.dataset
            .arTranslateX;


          delete element.dataset
            .arTranslateY;


          element.style.transform =
            "";

        }
      );


      refreshWidgetPositions();

    }, [
      refreshWidgetPositions,
    ]);


  /* =======================================================
     GESTURE PROCESSING
========================================================= */

  useEffect(() => {

    const gesture =
      String(
        cursor.gesture ||
          "UNKNOWN"
      ).toUpperCase();


    const previous =
      previousGestureRef.current;


    /* =====================================================
       RECORD ONLY WHEN GESTURE CHANGES
    ===================================================== */

    if (
      gesture !== previous &&
      gesture !== "UNKNOWN"
    ) {

      recordGesture(
        gesture
      );

    }


    /* =====================================================
       TRANSITION
    ===================================================== */

    if (
      gesture !== previous
    ) {

      Object.keys(
        gestureLockRef.current
      ).forEach(
        (key) => {

          if (
            key !== gesture
          ) {

            gestureLockRef.current[
              key
            ] = false;

          }

        }
      );


      previousGestureRef.current =
        gesture;

    }


    /* =====================================================
       PINCH START
    ===================================================== */

    if (
      gesture === "PINCH" &&
      !gestureLockRef.current.PINCH
    ) {

      gestureLockRef.current.PINCH =
        true;


      const target =
        hoveredWidget ||
        findWidgetAtCursor(
          cursor.x,
          cursor.y
        );


      if (target) {

        selectWidget(
          target
        );


        pinchStartRef.current = {
          x: cursor.x,
          y: cursor.y,
          widget: target,
        };


        pinchMovedRef.current =
          false;

      }

    }


    /* =====================================================
       PINCH HOLD / DRAG
    ===================================================== */

    if (
      gesture === "PINCH" &&
      gestureLockRef.current.PINCH &&
      pinchStartRef.current
    ) {

      const start =
        pinchStartRef.current;


      const deltaX =
        cursor.x - start.x;


      const deltaY =
        cursor.y - start.y;


      const movement =
        Math.sqrt(
          deltaX * deltaX +
          deltaY * deltaY
        );


      /*
       * Small movement =
       * selection only.
       *
       * Larger movement =
       * drag.
       */

      if (
        movement > 8
      ) {

        pinchMovedRef.current =
          true;


        startDrag(
          start.widget
        );


        moveWidget(
          start.widget,
          deltaX,
          deltaY
        );


        pinchStartRef.current = {
          ...start,
          x: cursor.x,
          y: cursor.y,
        };

      }

    }


    /* =====================================================
       PINCH RELEASE
    ===================================================== */

    if (
      gesture !== "PINCH" &&
      gestureLockRef.current.PINCH
    ) {

      gestureLockRef.current.PINCH =
        false;


      if (
        pinchMovedRef.current
      ) {

        endDrag();

      }
      else if (
        selectedWidget
      ) {

        setInteractionMessage(
          `${selectedWidget} selected`
        );

      }


      pinchStartRef.current =
        null;


      pinchMovedRef.current =
        false;

    }


    /* =====================================================
       TWO FINGER SCROLL
    ===================================================== */

    if (
      gesture === "TWO_FINGER"
    ) {

      const currentY =
        cursor.y;


      const previousY =
        lastScrollYRef.current;


      const movement =
        currentY -
        previousY;


      /*
       * Ignore the first frame.
       */

      if (
        previousY !== 0 &&
        Math.abs(movement) > 8
      ) {

        scrollPage(
          movement > 0
            ? 90
            : -90
        );

      }


      lastScrollYRef.current =
        currentY;

    }
    else {

      lastScrollYRef.current =
        cursor.y;

    }


    /* =====================================================
       FIST = CANCEL
    ===================================================== */

    if (
      gesture === "FIST" &&
      !gestureLockRef.current.FIST
    ) {

      gestureLockRef.current.FIST =
        true;


      closeInteraction();

    }


    /* =====================================================
       OPEN PALM = RESET
    ===================================================== */

    if (
      gesture === "OPEN_PALM" &&
      !gestureLockRef.current.OPEN_PALM
    ) {

      gestureLockRef.current.OPEN_PALM =
        true;


      resetInteraction();

    }


    /* =====================================================
       SAVE LAST CURSOR
    ===================================================== */

    lastCursorRef.current =
      cursor;

  }, [
    cursor,
    hoveredWidget,
    selectedWidget,
    findWidgetAtCursor,
    selectWidget,
    recordGesture,
    startDrag,
    moveWidget,
    endDrag,
    closeInteraction,
    resetInteraction,
    scrollPage,
  ]);


  /* =======================================================
     CONTEXT VALUE
  ======================================================= */

  const value =
    useMemo(
      () => ({

        /* -----------------------------------------------
           CURSOR
        ----------------------------------------------- */

        cursor,

        updateCursor,


        /* -----------------------------------------------
           PAGE
        ----------------------------------------------- */

        activePage,

        setActivePage,


        /* -----------------------------------------------
           WIDGET
        ----------------------------------------------- */

        selectedWidget,

        hoveredWidget,

        draggingWidget,

        interactionTarget,

        widgetPositions,


        /* -----------------------------------------------
           WIDGET METHODS
        ----------------------------------------------- */

        registerWidget,

        unregisterWidget,

        refreshWidgetPositions,

        findWidgetAtCursor,

        setInteractionTarget,


        selectWidget,

        clearSelection,


        startDrag,

        endDrag,

        moveWidget,


        /* -----------------------------------------------
           GESTURES
        ----------------------------------------------- */

        gestureStats,

        recordGesture,


        /* -----------------------------------------------
           INTERACTION
        ----------------------------------------------- */

        interactionCount,

        interactionMessage,


        /* -----------------------------------------------
           SCROLL
        ----------------------------------------------- */

        scrollPosition,

        scrollPage,


        /* -----------------------------------------------
           RESET / CANCEL
        ----------------------------------------------- */

        resetInteraction,

        closeInteraction,


        /* -----------------------------------------------
           TRACKING
        ----------------------------------------------- */

        isTracking:
          cursor.visible ||
          cursor.gesture !==
            "UNKNOWN",

      }),
      [
        cursor,
        updateCursor,

        activePage,

        selectedWidget,
        hoveredWidget,
        draggingWidget,

        interactionTarget,

        widgetPositions,

        registerWidget,
        unregisterWidget,
        refreshWidgetPositions,
        findWidgetAtCursor,
        setInteractionTarget,

        selectWidget,
        clearSelection,

        startDrag,
        endDrag,
        moveWidget,

        gestureStats,
        recordGesture,

        interactionCount,
        interactionMessage,

        scrollPosition,
        scrollPage,

        resetInteraction,
        closeInteraction,
      ]
    );


  /* =======================================================
     PROVIDER
  ======================================================= */

  return (

    <ARInteractionContext.Provider
      value={value}
    >

      {children}

    </ARInteractionContext.Provider>

  );
}


/* =========================================================
   HOOK
========================================================= */

export function useARInteraction() {

  const context =
    useContext(
      ARInteractionContext
    );


  if (!context) {

    throw new Error(
      "useARInteraction must be used inside ARInteractionProvider"
    );

  }


  return context;

}