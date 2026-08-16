import ARDashboard from "../dashboard/ARDashboard";
import CameraFeed from "../vision/CameraFeed";

function ARWorkspace() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">

      {/* Camera / Vision Layer */}

      <div className="absolute inset-0 z-0">
        <CameraFeed />
      </div>

      {/* AR Interface Layer */}

      <div className="relative z-10 min-h-screen">
        <ARDashboard />
      </div>

    </div>
  );
}

export default ARWorkspace;