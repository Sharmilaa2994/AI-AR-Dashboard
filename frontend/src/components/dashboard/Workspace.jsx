import CameraFeed from "../vision/CameraFeed";

function Workspace() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      <CameraFeed />
    </div>
  );
}

export default Workspace;