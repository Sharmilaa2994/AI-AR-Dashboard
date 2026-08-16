import { useState } from "react";

import ARDashboard from "../dashboard/ARDashboard";
import CameraFeed from "../vision/CameraFeed";
import VirtualCursor from "../interaction/VirtualCursor";

function ARWorkspace() {
  const [cursor, setCursor] = useState({
    x: 0,
    y: 0,
    visible: false,
    gesture: "UNKNOWN",
  });

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">

      {/* Camera / Vision Layer */}

      <div className="absolute inset-0 z-0">
        <CameraFeed
          onCursorUpdate={setCursor}
        />
      </div>

      {/* AR Interface Layer */}

      <div className="relative z-10 min-h-screen">
        <ARDashboard />
      </div>

      {/* Virtual Cursor */}

      <VirtualCursor
        x={cursor.x}
        y={cursor.y}
        visible={cursor.visible}
        gesture={cursor.gesture}
      />

    </div>
  );
}

export default ARWorkspace;