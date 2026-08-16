import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import StatusCard from "../components/dashboard/StatusCard";
import Workspace from "../components/dashboard/Workspace";

function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Sidebar />

      <Navbar />

      <main className="ml-64 px-8 pb-10 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            AR Dashboard
          </h1>

          <p className="mt-2 text-slate-500">
            Monitor and control your spatial computing environment.
          </p>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatusCard
  title="Camera"
  value="Live"
  description="Browser camera stream"
/>

          <StatusCard
            title="Hand Tracking"
            value="Inactive"
            description="MediaPipe not initialized"
          />

          <StatusCard
            title="Objects Detected"
            value="0"
            description="YOLO detection engine"
          />
        </div>

        <Workspace />
      </main>
    </div>
  );
}

export default Dashboard;