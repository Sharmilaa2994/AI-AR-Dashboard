import {
  useEffect,
  useRef,
} from "react";

import {
  useARInteraction,
} from "../../context/ARInteractionContext";

function ARInteractiveWidget({
  id,
  title,
  children,
  className = "",
}) {
  const elementRef =
    useRef(null);

  const {
    selectedWidget,
    hoveredWidget,
    draggingWidget,
    registerWidget,
  } = useARInteraction();

  useEffect(() => {
    const update = () => {
      if (
        elementRef.current
      ) {
        registerWidget(
          id,
          elementRef.current
        );
      }
    };

    update();

    window.addEventListener(
      "resize",
      update
    );

    window.addEventListener(
      "scroll",
      update,
      {
        passive: true,
      }
    );

    return () => {
      window.removeEventListener(
        "resize",
        update
      );

      window.removeEventListener(
        "scroll",
        update
      );
    };
  }, [
    id,
    registerWidget,
  ]);

  const selected =
    selectedWidget === id;

  const hovered =
    hoveredWidget === id;

  const dragging =
    draggingWidget === id;

  return (
    <div
      ref={elementRef}
      data-ar-widget={id}
      className={`
        relative
        rounded-2xl
        border
        bg-slate-950/70
        backdrop-blur-xl
        transition-all
        duration-200

        ${
          selected
            ? "border-cyan-300 shadow-[0_0_35px_rgba(34,211,238,0.25)]"
            : hovered
            ? "border-purple-400/70 shadow-[0_0_25px_rgba(168,85,247,0.18)]"
            : "border-white/10"
        }

        ${
          dragging
            ? "cursor-grabbing scale-[1.01]"
            : "cursor-pointer"
        }

        ${className}
      `}
    >

      {/* TARGET INDICATOR */}

      {hovered && (
        <div
          className="
            pointer-events-none
            absolute
            -inset-px
            rounded-2xl
            border
            border-purple-400/50
          "
        />
      )}

      {/* SELECTED INDICATOR */}

      {selected && (
        <div
          className="
            pointer-events-none
            absolute
            left-3
            top-3
            rounded-full
            border
            border-cyan-300/40
            bg-cyan-300/10
            px-2
            py-1
            text-[8px]
            uppercase
            tracking-wider
            text-cyan-300
          "
        >
          SELECTED
        </div>
      )}

      {/* CONTENT */}

      <div className="relative z-10">
        {children}
      </div>

    </div>
  );
}

export default ARInteractiveWidget;