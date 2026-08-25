/**
 * Check whether a screen coordinate is inside
 * a DOM element's bounding rectangle.
 */
export function isPointInsideElement(x, y, element) {
  if (!element) {
    return false;
  }

  const rect = element.getBoundingClientRect();

  return (
    x >= rect.left &&
    x <= rect.right &&
    y >= rect.top &&
    y <= rect.bottom
  );
}


/**
 * Find the widget currently under the virtual cursor.
 *
 * Returns:
 *   widget id -> "users", "load", etc.
 *   null      -> no widget
 */
export function findTargetWidget(x, y, widgetRefs) {
  if (
    typeof x !== "number" ||
    typeof y !== "number" ||
    !widgetRefs
  ) {
    return null;
  }

  const entries = Object.entries(widgetRefs);

  for (const [widgetId, element] of entries) {
    if (!element) {
      continue;
    }

    if (
      isPointInsideElement(
        x,
        y,
        element
      )
    ) {
      return widgetId;
    }
  }

  return null;
}