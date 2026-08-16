const INTERACTION_ACTIONS = {
  OPEN_PALM: "SHOW_DASHBOARD",
  POINT: "POINT",
  PINCH: "SELECT",
  TWO_FINGER: "NAVIGATE",
  FIST: "CANCEL",
  UNKNOWN: "NONE",
};

export function getInteractionAction(gesture) {
  return (
    INTERACTION_ACTIONS[gesture] ||
    INTERACTION_ACTIONS.UNKNOWN
  );
}

export function createInteractionEvent(
  gesture,
  landmarks = null
) {
  const action =
    getInteractionAction(gesture);

  return {
    gesture,
    action,
    timestamp: Date.now(),
    landmarks,
  };
}

export function getActionDescription(
  action
) {
  const descriptions = {
    SHOW_DASHBOARD:
      "Show AR dashboard",

    POINT:
      "Move pointer",

    SELECT:
      "Select dashboard element",

    NAVIGATE:
      "Navigate dashboard",

    CANCEL:
      "Cancel current interaction",

    NONE:
      "No interaction",
  };

  return (
    descriptions[action] ||
    "No interaction"
  );
}