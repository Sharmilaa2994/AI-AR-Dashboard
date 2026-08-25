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

      <div className="absolute inset-0 z-0">
        <CameraFeed
          onCursorUpdate={setCursor}
        />
      </div>

      <div className="relative z-10 min-h-screen">
        <ARDashboard
          cursorPosition={cursor}
        />
      </div>

      <VirtualCursor
  cursorPosition={cursor}
/>

    </div>
  );
}

export default ARWorkspace;