import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import ARWorkspace from "./components/workspace/ARWorkspace";

import HomePage from "./components/pages/HomePage";
import VisionPage from "./components/pages/VisionPage";
import ObjectPage from "./components/pages/ObjectPage";
import GesturePage from "./components/pages/GesturePage";
import AnalyticsPage from "./components/pages/AnalyticsPage";
import SystemPage from "./components/pages/SystemPage";


function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<ARWorkspace />}
        >

          {/* HOME */}

          <Route
            index
            element={<HomePage />}
          />


          {/* VISION */}

          <Route
            path="vision"
            element={<VisionPage />}
          />


          {/* OBJECT */}

          <Route
            path="object"
            element={<ObjectPage />}
          />


          {/* GESTURE */}

          <Route
            path="gesture"
            element={<GesturePage />}
          />


          {/* ANALYTICS */}

          <Route
            path="analytics"
            element={<AnalyticsPage />}
          />


          {/* SYSTEM */}

          <Route
            path="system"
            element={<SystemPage />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}


export default App;