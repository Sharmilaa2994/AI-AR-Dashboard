// ============================================================
// GESTURE WORKSPACE CONTROLLER
// ============================================================
// Handles:
// POINT      -> cursor / hover
// PINCH      -> select
// PINCH MOVE -> drag
// TWO_FINGER -> scroll
// FIST       -> cancel
// OPEN_PALM  -> reset
// ============================================================

const DRAG_THRESHOLD = 8;
const SCROLL_MULTIPLIER = 2.2;

let state = {
  mode: "IDLE",

  pointer: {
    x: 0,
    y: 0,
  },

  drag: {
    active: false,
    element: null,
    startX: 0,
    startY: 0,
    originalLeft: 0,
    originalTop: 0,
  },

  scroll: {
    active: false,
    lastX: 0,
    lastY: 0,
  },
};

function getPointerElement(x, y) {
  if (typeof document === "undefined") {
    return null;
  }

  const element = document.elementFromPoint(x, y);

  if (!element) {
    return null;
  }

  return (
    element.closest("[data-ar-draggable='true']") ||
    element.closest("[data-ar-scroll='true']")
  );
}

function getPosition(element) {
  const rect = element.getBoundingClientRect();

  return {
    left: rect.left,
    top: rect.top,
  };
}

function prepareDraggable(element) {
  if (!element) {
    return;
  }

  const computed = window.getComputedStyle(element);

  if (computed.position === "static") {
    element.style.position = "relative";
  }
}

function startDrag(element, x, y) {
  if (!element) {
    return false;
  }

  prepareDraggable(element);

  const position = getPosition(element);

  state.drag = {
    active: true,
    element,
    startX: x,
    startY: y,
    originalLeft: position.left,
    originalTop: position.top,
  };

  state.mode = "DRAG";

  element.dataset.arDragging = "true";

  return true;
}

function updateDrag(x, y) {
  const drag = state.drag;

  if (!drag.active || !drag.element) {
    return;
  }

  const deltaX = x - drag.startX;
  const deltaY = y - drag.startY;

  drag.element.style.transform =
    `translate(${deltaX}px, ${deltaY}px)`;

  drag.element.style.zIndex = "100";

  drag.element.style.cursor = "grabbing";
}

function endDrag() {
  const drag = state.drag;

  if (!drag.active || !drag.element) {
    return;
  }

  drag.element.dataset.arDragging = "false";

  drag.element.style.zIndex = "";
  drag.element.style.cursor = "";

  state.drag = {
    active: false,
    element: null,
    startX: 0,
    startY: 0,
    originalLeft: 0,
    originalTop: 0,
  };

  state.mode = "IDLE";
}

function startScroll(x, y) {
  state.scroll = {
    active: true,
    lastX: x,
    lastY: y,
  };

  state.mode = "SCROLL";
}

function updateScroll(x, y) {
  if (!state.scroll.active) {
    return;
  }

  const deltaX = x - state.scroll.lastX;
  const deltaY = y - state.scroll.lastY;

  window.scrollBy({
    left: -deltaX * SCROLL_MULTIPLIER,
    top: -deltaY * SCROLL_MULTIPLIER,
    behavior: "auto",
  });

  state.scroll.lastX = x;
  state.scroll.lastY = y;
}

function endScroll() {
  state.scroll = {
    active: false,
    lastX: 0,
    lastY: 0,
  };

  state.mode = "IDLE";
}

function resetWorkspace() {
  endDrag();
  endScroll();

  state.mode = "IDLE";

  if (typeof document !== "undefined") {
    const elements = document.querySelectorAll(
      "[data-ar-dragging='true']"
    );

    elements.forEach((element) => {
      element.dataset.arDragging = "false";
      element.style.zIndex = "";
      element.style.cursor = "";
    });
  }
}

export function processGesture({
  gesture,
  x,
  y,
}) {
  state.pointer.x = x;
  state.pointer.y = y;

  // ==========================================================
  // POINT
  // ==========================================================

  if (gesture === "POINT") {
    if (state.scroll.active) {
      endScroll();
    }

    if (state.drag.active) {
      updateDrag(x, y);

      return {
        mode: "DRAG",
        action: "DRAGGING",
        element: state.drag.element,
      };
    }

    state.mode = "POINT";

    return {
      mode: "POINT",
      action: "HOVER",
      element: getPointerElement(x, y),
    };
  }

  // ==========================================================
  // PINCH
  // ==========================================================

  if (gesture === "PINCH") {
    const element = getPointerElement(x, y);

    if (
      element &&
      element.dataset.arDraggable === "true"
    ) {
      if (!state.drag.active) {
        startDrag(element, x, y);

        return {
          mode: "DRAG",
          action: "DRAG_START",
          element,
        };
      }

      updateDrag(x, y);

      return {
        mode: "DRAG",
        action: "DRAGGING",
        element: state.drag.element,
      };
    }

    return {
      mode: "SELECT",
      action: "SELECT",
      element,
    };
  }

  // ==========================================================
  // TWO FINGER
  // ==========================================================

  if (gesture === "TWO_FINGER") {
    if (!state.scroll.active) {
      startScroll(x, y);
    }

    updateScroll(x, y);

    return {
      mode: "SCROLL",
      action: "SCROLLING",
    };
  }

  // ==========================================================
  // FIST
  // ==========================================================

  if (gesture === "FIST") {
    resetWorkspace();

    return {
      mode: "CANCEL",
      action: "CANCEL",
    };
  }

  // ==========================================================
  // OPEN PALM
  // ==========================================================

  if (gesture === "OPEN_PALM") {
    resetWorkspace();

    return {
      mode: "RESET",
      action: "RESET",
    };
  }

  return {
    mode: "IDLE",
    action: "NONE",
  };
}

export function getWorkspaceInteractionState() {
  return {
    mode: state.mode,
    pointer: {
      ...state.pointer,
    },
    dragging: state.drag.active,
    scrolling: state.scroll.active,
  };
}

export function resetGestureWorkspace() {
  resetWorkspace();
}