import ARWorkspace from "./components/workspace/ARWorkspace";
import { detectGesture } from "./utils/gestureEngine";
import { processHandLandmarks } from "./services/gestureService";

console.log(
  "Gesture Service Loaded:",
  processHandLandmarks
);

console.log("Gesture Engine Loaded:", detectGesture);

function App() {
  return <ARWorkspace />;
}

export default App;