export function executeWidgetAction(widgetId) {
  switch (widgetId) {
    case "users":
      return {
        actionId: "active-users",
        type: "OPEN_ANALYTICS",
        title: "Active Users",
        message: "Opening active user analytics",
      };

    case "load":
      return {
        actionId: "system-load",
        type: "OPEN_SYSTEM_LOAD",
        title: "System Load",
        message: "Opening system load details",
      };

    case "processing":
      return {
        actionId: "processing-rate",
        type: "OPEN_PROCESSING",
        title: "Processing Rate",
        message: "Opening vision processing details",
      };

    case "interactions":
      return {
        actionId: "interactions",
        type: "OPEN_INTERACTIONS",
        title: "Interactions",
        message: "Opening gesture interaction analytics",
      };

    default:
      return {
        actionId: "unknown",
        type: "UNKNOWN",
        title: "Unknown Widget",
        message: "No action is configured for this widget",
      };
  }
}