import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ARDashboard from "../dashboard/ARDashboard";
import CameraFeed from "../vision/CameraFeed";
import VirtualCursor from "../interaction/VirtualCursor";
import LoginPage from "../auth/LoginPage";
import {
  ARInteractionProvider,
  useARInteraction,
} from "../../context/ARInteractionContext";


/* =========================================================
   AR WORKSPACE
========================================================= */

function ARWorkspace() {

  /* =======================================================
     AUTHENTICATION STATE

     Remembered users are stored in localStorage.
     The active browser session is stored in sessionStorage.
  ======================================================= */

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const rememberedUser = localStorage.getItem("aiarx_user");
      const activeSession = sessionStorage.getItem("aiarx_session");

      return Boolean(rememberedUser || activeSession);
    } catch {
      return false;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const rememberedUser = localStorage.getItem("aiarx_user");

      if (rememberedUser) {
        return JSON.parse(rememberedUser);
      }

      const activeSession = sessionStorage.getItem("aiarx_session");

      if (activeSession) {
        return JSON.parse(activeSession);
      }

      return null;
    } catch {
      return null;
    }
  });


  /* =======================================================
     LOGIN
  ======================================================= */

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    setIsAuthenticated(true);
  };


  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = () => {
    try {
      localStorage.removeItem("aiarx_user");
      sessionStorage.removeItem("aiarx_session");
    } catch {
      // Storage may be unavailable in restricted browser modes.
    }

    setUser(null);
    setIsAuthenticated(false);
  };


  /* =======================================================
     AUTHENTICATION GATE

     Camera and gesture processing do not start until the
     user successfully logs in.
  ======================================================= */

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }


  return (
    <ARInteractionProvider>
      <ARWorkspaceContent
        user={user}
        onLogout={handleLogout}
      />
    </ARInteractionProvider>
  );
}


/* =========================================================
   MAIN WORKSPACE CONTENT
========================================================= */

function ARWorkspaceContent({ user, onLogout }) {

  const {
    cursor,
    updateCursor,
    isTracking,

    activePage: contextPage,
    setActivePage,

    selectedWidget,
    hoveredWidget,
    draggingWidget,

    interactionMessage,
    interactionCount,

    gestureStats,
    scrollPosition,
  } = useARInteraction();


  /* =======================================================
     LOCAL PAGE STATE
  ======================================================= */

  const [activePage, setLocalActivePage] = useState(
    contextPage || "HOME"
  );


  /* =======================================================
     PERFORMANCE HISTORY
  ======================================================= */

  const [performanceHistory, setPerformanceHistory] = useState(
    () => [12, 18, 15, 23, 20, 27, 24, 31, 29, 35, 32, 38]
  );


  /* =======================================================
     KEEP LOCAL PAGE + CONTEXT PAGE SYNCHRONIZED
  ======================================================= */

  useEffect(() => {

    if (contextPage && contextPage !== activePage) {
      setLocalActivePage(contextPage);
    }

  }, [contextPage]);


  /* =======================================================
     LIVE PERFORMANCE SAMPLE
  ======================================================= */

  useEffect(() => {

    const interval = window.setInterval(() => {

      const totalGestures =
        Object.values(gestureStats || {}).reduce(
          (sum, value) => sum + Number(value || 0),
          0
        );

      const base =
        20 +
        Math.min(35, totalGestures * 0.4) +
        Math.min(20, interactionCount * 0.15);

      const variation =
        Math.round(Math.sin(Date.now() / 900) * 5);

      const nextValue = Math.max(
        5,
        Math.min(
          60,
          Math.round(base + variation)
        )
      );

      setPerformanceHistory((previous) => [
        ...previous.slice(-23),
        nextValue,
      ]);

    }, 1000);

    return () => window.clearInterval(interval);

  }, [gestureStats, interactionCount]);


  /* =======================================================
     PAGE CHANGE
  ======================================================= */

  const handlePageChange = (page) => {

    setLocalActivePage(page);

    if (setActivePage) {
      setActivePage(page);
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  /* =======================================================
     LOGOUT CONFIRMATION
  ======================================================= */

  const handleLogoutClick = () => {
    const confirmed = window.confirm(
      "Are you sure you want to logout from AI-ARX?"
    );

    if (!confirmed) {
      return;
    }

    if (typeof onLogout === "function") {
      onLogout();
    }
  };


  /* =======================================================
     LIVE METRICS
  ======================================================= */

  const confidencePercent = Math.round(
    Math.max(
      0,
      Math.min(
        100,
        Number(cursor?.confidence || 0) * 100
      )
    )
  );


  const gesture = String(
    cursor?.gesture || "UNKNOWN"
  ).toUpperCase();


  const gestureTotal = Object.values(
    gestureStats || {}
  ).reduce(
    (sum, value) => sum + Number(value || 0),
    0
  );


  /* =======================================================
     TRACKING STATE
  ======================================================= */

  const trackingActive =
    Boolean(isTracking) ||
    Boolean(cursor?.visible) ||
    gesture !== "UNKNOWN";


  /* =======================================================
     GESTURE NAVIGATION

     POINT = move/hover
     PINCH = click/select

     Navigation buttons are marked with data-ar-nav so the
     virtual cursor can activate them without a mouse click.
  ======================================================= */

  const previousNavigationGestureRef = useRef("UNKNOWN");

  useEffect(() => {
    const currentGesture = String(cursor?.gesture || "UNKNOWN").toUpperCase();

    if (currentGesture !== "PINCH") {
      previousNavigationGestureRef.current = currentGesture;
      return;
    }

    if (previousNavigationGestureRef.current === "PINCH") {
      return;
    }

    if (!cursor?.visible) {
      previousNavigationGestureRef.current = currentGesture;
      return;
    }

    const target = document.elementFromPoint(
      cursor.x,
      cursor.y
    );

    const navigationButton =
      target?.closest?.("[data-ar-nav]");

    if (navigationButton) {
      navigationButton.click();
    }

    previousNavigationGestureRef.current = currentGesture;
  }, [cursor?.gesture, cursor?.visible, cursor?.x, cursor?.y]);


  return (
    <main
      className="
        relative
        min-h-screen
        overflow-x-hidden
        bg-[#020617]
        text-white
      "
    >

      {/* ===================================================
          INVISIBLE CAMERA LAYER

          IMPORTANT:
          CameraFeed continues processing the webcam,
          but its visual layer remains hidden.
      =================================================== */}

      <div
        className="
          pointer-events-none
          fixed
          inset-0
          z-0
          overflow-hidden
        "
      >

        <CameraFeed
          onCursorUpdate={updateCursor}
          backgroundOnly
        />

      </div>


      {/* ===================================================
          GLOBAL BACKGROUND
      =================================================== */}

      <div
        className="
          pointer-events-none
          fixed
          inset-0
          z-10
          overflow-hidden
        "
      >

        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_50%_10%,rgba(34,211,238,0.08),transparent_30%),radial-gradient(circle_at_85%_65%,rgba(139,92,246,0.08),transparent_30%)]
          "
        />

        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,211,238,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.045) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div
          className="
            absolute
            left-1/2
            top-[40%]
            h-[700px]
            w-[700px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-cyan-500/[0.025]
            blur-[150px]
          "
        />

        <div
          className="
            absolute
            right-[-180px]
            top-[20%]
            h-[500px]
            w-[500px]
            rounded-full
            bg-purple-500/[0.025]
            blur-[150px]
          "
        />

      </div>


      {/* ===================================================
          TOP COMMAND BAR
      =================================================== */}

      <header
        className="
          fixed
          left-0
          right-0
          top-0
          z-[100]
          h-16
          border-b
          border-white/[0.06]
          bg-[#020617]/95
          backdrop-blur-xl
        "
      >

        <div
          className="
            flex
            h-full
            items-center
            justify-between
            px-5
          "
        >

          {/* BRAND */}

          <div className="flex items-center gap-3">

            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                border
                border-cyan-400/30
                bg-cyan-400/10
                text-cyan-300
              "
            >
              ◇
            </div>

            <div>

              <div
                className="
                  text-sm
                  font-semibold
                  tracking-[0.22em]
                  text-white
                "
              >
                AI-ARX
              </div>

              <div
                className="
                  text-[9px]
                  uppercase
                  tracking-[0.25em]
                  text-slate-500
                "
              >
                Vision Workspace
              </div>

            </div>

          </div>


          {/* CENTER STATUS */}

          <div
            className="
              hidden
              items-center
              gap-5
              md:flex
            "
          >

            <StatusIndicator
              label="SYSTEM"
              value="ONLINE"
              active
            />

            <StatusIndicator
              label="VISION"
              value={
                trackingActive
                  ? "ACTIVE"
                  : "STANDBY"
              }
              active={trackingActive}
            />

            <StatusIndicator
              label="GESTURE"
              value={gesture}
              active={gesture !== "UNKNOWN"}
            />

            <StatusIndicator
              label="EVENTS"
              value={String(interactionCount || 0)}
              active={interactionCount > 0}
            />

          </div>


          {/* RIGHT */}

          <div className="flex items-center gap-2 sm:gap-3">

            <div
              className="
                hidden
                rounded-full
                border
                border-slate-700/60
                bg-slate-900/70
                px-3
                py-1.5
                text-[10px]
                uppercase
                tracking-wider
                text-slate-400
                sm:block
              "
            >
              {activePage}
            </div>

            <div
              className="
                hidden
                items-center
                gap-2
                rounded-full
                border
                border-cyan-400/20
                bg-cyan-400/5
                px-3
                py-1.5
                sm:flex
              "
            >
              <div className="text-right">
                <div className="text-[9px] font-semibold uppercase tracking-wider text-slate-200">
                  {user?.name || "Administrator"}
                </div>
                <div className="text-[8px] uppercase tracking-wider text-slate-500">
                  {user?.role || "System Administrator"}
                </div>
              </div>
            </div>

            <div
              className="
                flex
                items-center
                gap-2
                rounded-full
                border
                border-emerald-400/20
                bg-emerald-400/5
                px-3
                py-1.5
                text-[10px]
                text-emerald-300
              "
            >

              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-emerald-400
                  shadow-[0_0_8px_rgba(52,211,153,0.7)]
                "
              />

              LIVE

            </div>

            <button
              type="button"
              onClick={handleLogoutClick}
              title="Logout"
              className="
                rounded-full
                border
                border-red-400/20
                bg-red-400/5
                px-3
                py-1.5
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.12em]
                text-red-300
                transition
                hover:border-red-400/40
                hover:bg-red-400/10
                hover:text-red-200
              "
            >
              Logout
            </button>

          </div>

        </div>

      </header>


      {/* ===================================================
          SIDEBAR
      =================================================== */}

      <aside
        className="
          fixed
          bottom-0
          left-0
          top-16
          z-[90]
          hidden
          w-[72px]
          border-r
          border-white/[0.06]
          bg-[#020617]/95
          backdrop-blur-xl
          lg:flex
          lg:flex-col
          lg:items-center
          lg:py-5
        "
      >

        <RailItem
          icon="◉"
          label="HOME"
          active={activePage === "HOME"}
          onClick={() => handlePageChange("HOME")}
          navPage="HOME"
        />

        <RailItem
          icon="⌁"
          label="VISION"
          active={activePage === "VISION"}
          onClick={() => handlePageChange("VISION")}
          navPage="VISION"
        />

        <RailItem
          icon="◇"
          label="OBJECT"
          active={activePage === "OBJECT"}
          onClick={() => handlePageChange("OBJECT")}
          navPage="OBJECT"
        />

        <RailItem
          icon="◎"
          label="GESTURE"
          active={activePage === "GESTURE"}
          onClick={() => handlePageChange("GESTURE")}
          navPage="GESTURE"
        />

        <div className="my-4 h-px w-8 bg-slate-800" />

        <RailItem
          icon="◌"
          label="ANALYTICS"
          active={activePage === "ANALYTICS"}
          onClick={() => handlePageChange("ANALYTICS")}
          navPage="ANALYTICS"
        />

        <RailItem
          icon="⚙"
          label="SYSTEM"
          active={activePage === "SYSTEM"}
          onClick={() => handlePageChange("SYSTEM")}
          navPage="SYSTEM"
        />

      </aside>


      {/* ===================================================
          MAIN AREA
      =================================================== */}

      <section
        className="
          relative
          z-20
          min-h-screen
          pt-16
          lg:pl-[72px]
        "
      >

        {/* AR FRAME */}

        <div
          className="
            pointer-events-none
            fixed
            inset-0
            z-20
          "
        >

          <div
            className="
              absolute
              inset-4
              rounded-2xl
              border
              border-cyan-400/[0.08]
            "
          />

          <Corner
            position="left-5 top-20"
            borders="border-l border-t"
          />

          <Corner
            position="right-5 top-20"
            borders="border-r border-t"
          />

          <Corner
            position="left-5 bottom-5"
            borders="border-l border-b"
          />

          <Corner
            position="right-5 bottom-5"
            borders="border-r border-b"
          />

        </div>


        {/* PAGE */}

        <div
          className="
            relative
            z-30
            min-h-[calc(100vh-4rem)]
            px-4
            py-5
            lg:px-8
          "
        >

          <PageRenderer
            page={activePage}
            cursor={cursor}
            trackingActive={trackingActive}
            confidencePercent={confidencePercent}
            gestureStats={gestureStats}
            gestureTotal={gestureTotal}
            interactionCount={interactionCount}
            interactionMessage={interactionMessage}
            hoveredWidget={hoveredWidget}
            selectedWidget={selectedWidget}
            draggingWidget={draggingWidget}
            scrollPosition={scrollPosition}
            performanceHistory={performanceHistory}
          />

        </div>


        {/* GLOBAL VIRTUAL CURSOR */}

        <VirtualCursor
          cursorPosition={cursor}
        />

      </section>

    </main>
  );
}


/* =========================================================
   PAGE RENDERER
========================================================= */

function PageRenderer({
  page,
  cursor,
  trackingActive,
  confidencePercent,
  gestureStats,
  gestureTotal,
  interactionCount,
  interactionMessage,
  hoveredWidget,
  selectedWidget,
  draggingWidget,
  scrollPosition,
  performanceHistory,
}) {

  switch (page) {

    case "VISION":
      return (
        <VisionPage
          cursor={cursor}
          trackingActive={trackingActive}
          confidencePercent={confidencePercent}
        />
      );

    case "OBJECT":
      return (
        <ObjectPage
          cursor={cursor}
          trackingActive={trackingActive}
        />
      );

    case "GESTURE":
      return (
        <GesturePage
          cursor={cursor}
          confidencePercent={confidencePercent}
          gestureStats={gestureStats}
          gestureTotal={gestureTotal}
          interactionCount={interactionCount}
          interactionMessage={interactionMessage}
          hoveredWidget={hoveredWidget}
          selectedWidget={selectedWidget}
          draggingWidget={draggingWidget}
        />
      );

    case "ANALYTICS":
      return (
        <AnalyticsPage
          cursor={cursor}
          gestureStats={gestureStats}
          gestureTotal={gestureTotal}
          interactionCount={interactionCount}
          performanceHistory={performanceHistory}
          scrollPosition={scrollPosition}
        />
      );

    case "SYSTEM":
      return (
        <SystemPage
          trackingActive={trackingActive}
          cursor={cursor}
          interactionCount={interactionCount}
        />
      );

    case "HOME":
    default:
      return (
        <HomePage
          cursor={cursor}
          trackingActive={trackingActive}
          confidencePercent={confidencePercent}
          interactionCount={interactionCount}
          gestureStats={gestureStats}
          gestureTotal={gestureTotal}
          interactionMessage={interactionMessage}
          hoveredWidget={hoveredWidget}
          selectedWidget={selectedWidget}
          draggingWidget={draggingWidget}
        />
      );
  }
}


/* =========================================================
   HOME PAGE
========================================================= */

function HomePage({
  cursor,
  trackingActive,
  confidencePercent,
  interactionCount,
  gestureStats,
  gestureTotal,
  interactionMessage,
  hoveredWidget,
  selectedWidget,
  draggingWidget,
}) {

  return (
    <PageShell
      eyebrow="INTELLIGENCE LAYER"
      title="AI Vision Dashboard"
      description="Universal spatial interaction workspace with real-time hand tracking, gesture control, selectable widgets, scrolling and movable dashboard content."
    >

      {/* =================================================
          LIVE STATUS CARDS
      ================================================= */}

      <div
        className="
          grid
          gap-5
          md:grid-cols-2
          xl:grid-cols-4
        "
      >

        <InteractiveCard
          id="home-system-status"
        >
          <MetricCard
            title="System Status"
            value="ONLINE"
            description="AR workspace is running."
            accent="green"
          />
        </InteractiveCard>


        <InteractiveCard
          id="home-vision-status"
        >
          <MetricCard
            title="Vision Pipeline"
            value={
              trackingActive
                ? "ACTIVE"
                : "STANDBY"
            }
            description="Computer vision engine status."
          />
        </InteractiveCard>


        <InteractiveCard
          id="home-current-gesture"
        >
          <MetricCard
            title="Gesture"
            value={cursor.gesture}
            description="Current detected gesture."
          />
        </InteractiveCard>


        <InteractiveCard
          id="home-confidence"
        >
          <MetricCard
            title="Confidence"
            value={`${confidencePercent}%`}
            description="Current tracking confidence."
          />
        </InteractiveCard>

      </div>


      {/* =================================================
          INTERACTION ENGINE
      ================================================= */}

      <div className="mt-5">

        <InteractiveCard
          id="home-interaction-engine"
        >

          <div
            className="
              rounded-2xl
              border
              border-cyan-400/10
              bg-slate-950/80
              p-6
            "
          >

            <SectionTitle
              eyebrow="INTERACTION ENGINE"
              title="Spatial Controls"
              rightText={`${interactionCount} EVENTS`}
            />


            <div
              className="
                mt-5
                grid
                gap-3
                md:grid-cols-2
                xl:grid-cols-5
              "
            >

              <GestureControl
                id="control-point"
                icon="☝"
                gesture="POINT"
                action="Target / Select"
              />

              <GestureControl
                id="control-pinch"
                icon="🤏"
                gesture="PINCH"
                action="Select / Drag"
              />

              <GestureControl
                id="control-two"
                icon="✌"
                gesture="TWO FINGER"
                action="Scroll"
              />

              <GestureControl
                id="control-fist"
                icon="✊"
                gesture="FIST"
                action="Cancel"
              />

              <GestureControl
                id="control-palm"
                icon="✋"
                gesture="OPEN PALM"
                action="Reset"
              />

            </div>

          </div>

        </InteractiveCard>

      </div>


      {/* =================================================
          LIVE INTERACTION STATUS
      ================================================= */}

      <div
        className="
          mt-5
          grid
          gap-5
          lg:grid-cols-3
        "
      >

        <InteractiveCard
          id="home-live-input"
        >

          <InfoPanel
            eyebrow="CURRENT INPUT"
            title={cursor.gesture}
            description={
              trackingActive
                ? "Hand tracking is providing live spatial input."
                : "Waiting for a valid hand gesture."
            }
          />

        </InteractiveCard>


        <InteractiveCard
          id="home-interaction-state"
        >

          <InfoPanel
            eyebrow="INTERACTION STATE"
            title={
              draggingWidget
                ? `MOVING ${draggingWidget}`
                : selectedWidget
                  ? `SELECTED ${selectedWidget}`
                  : hoveredWidget
                    ? `TARGET ${hoveredWidget}`
                    : "READY"
            }
            description={interactionMessage}
          />

        </InteractiveCard>


        <InteractiveCard
          id="home-gesture-events"
        >

          <InfoPanel
            eyebrow="GESTURE EVENTS"
            title={`${gestureTotal} EVENTS`}
            description={`POINT ${gestureStats?.POINT || 0} · PINCH ${gestureStats?.PINCH || 0} · TWO ${gestureStats?.TWO_FINGER || 0}`}
          />

        </InteractiveCard>

      </div>

    </PageShell>
  );
}


/* =========================================================
   VISION PAGE
========================================================= */

function VisionPage({
  cursor,
  trackingActive,
  confidencePercent,
}) {

  return (
    <PageShell
      eyebrow="COMPUTER VISION"
      title="Vision Pipeline"
      description="Live monitoring of the computer vision pipeline powering the spatial interaction engine."
    >

      <div
        className="
          grid
          gap-5
          md:grid-cols-2
          xl:grid-cols-4
        "
      >

        <InteractiveCard id="vision-opencv">

          <MetricCard
            title="OpenCV"
            value="AVAILABLE"
            description="Computer vision foundation."
            accent="green"
          />

        </InteractiveCard>


        <InteractiveCard id="vision-hand">

          <MetricCard
            title="Hand Tracking"
            value={
              trackingActive
                ? "ACTIVE"
                : "READY"
            }
            description={`Confidence ${confidencePercent}%`}
          />

        </InteractiveCard>


        <InteractiveCard id="vision-frame">

          <MetricCard
            title="Frame Engine"
            value="READY"
            description="Real-time frame processing."
          />

        </InteractiveCard>


        <InteractiveCard id="vision-object">

          <MetricCard
            title="Object Detection"
            value="READY"
            description="YOLO object detection service."
          />

        </InteractiveCard>

      </div>


      <div className="mt-5">

        <InteractiveCard id="vision-pipeline">

          <div
            className="
              rounded-2xl
              border
              border-slate-800
              bg-slate-950/80
              p-6
            "
          >

            <SectionTitle
              eyebrow="COMPUTER VISION"
              title="Pipeline Overview"
              rightText={
                trackingActive
                  ? "ONLINE"
                  : "STANDBY"
              }
            />


            <div
              className="
                mt-5
                grid
                gap-4
                md:grid-cols-4
              "
            >

              <PipelineStep
                number="01"
                title="Camera"
                description="Live frames captured."
                active
              />

              <PipelineStep
                number="02"
                title="Hand Landmarker"
                description={
                  trackingActive
                    ? "Landmarks detected."
                    : "Waiting for hand."
                }
                active={trackingActive}
              />

              <PipelineStep
                number="03"
                title="Gesture Engine"
                description={
                  cursor.gesture === "UNKNOWN"
                    ? "Waiting for gesture."
                    : `${cursor.gesture} detected.`
                }
                active={cursor.gesture !== "UNKNOWN"}
              />

              <PipelineStep
                number="04"
                title="Interaction"
                description="Spatial commands routed."
                active={trackingActive}
              />

            </div>

          </div>

        </InteractiveCard>

      </div>

    </PageShell>
  );
}


/* =========================================================
   OBJECT PAGE
========================================================= */

function ObjectPage({
  trackingActive,
}) {

  return (
    <PageShell
      eyebrow="COMPUTER VISION"
      title="Object Detection"
      description="Monitor spatial targets detected by the computer vision pipeline."
    >

      <div
        className="
          grid
          gap-5
          md:grid-cols-3
        "
      >

        <InteractiveCard id="object-engine">

          <MetricCard
            title="Detection Engine"
            value="READY"
            description="YOLO detection service."
          />

        </InteractiveCard>


        <InteractiveCard id="object-count">

          <MetricCard
            title="Objects Detected"
            value="0"
            description={
              trackingActive
                ? "Waiting for object targets."
                : "Vision pipeline is idle."
            }
          />

        </InteractiveCard>


        <InteractiveCard id="object-model">

          <MetricCard
            title="Model"
            value="YOLO"
            description="Object detection model."
          />

        </InteractiveCard>

      </div>


      <div className="mt-5">

        <InteractiveCard id="object-results">

          <div
            className="
              rounded-2xl
              border
              border-slate-800
              bg-slate-950/80
              p-6
            "
          >

            <SectionTitle
              eyebrow="VISION TARGETS"
              title="Detected Objects"
            />

            <div
              className="
                mt-5
                flex
                min-h-[260px]
                flex-col
                items-center
                justify-center
                rounded-xl
                border
                border-dashed
                border-slate-800
                bg-slate-900/30
              "
            >

              <div className="text-4xl text-cyan-400/60">
                ◇
              </div>

              <p className="mt-4 text-sm text-slate-400">
                Object detection results will appear here.
              </p>

              <p className="mt-2 text-xs text-slate-600">
                Detection service ready for incoming targets.
              </p>

            </div>

          </div>

        </InteractiveCard>

      </div>

    </PageShell>
  );
}


/* =========================================================
   GESTURE PAGE
========================================================= */

function GesturePage({
  cursor,
  confidencePercent,
  gestureStats,
  gestureTotal,
  interactionCount,
  interactionMessage,
  hoveredWidget,
  selectedWidget,
  draggingWidget,
}) {

  return (
    <PageShell
      eyebrow="INTERACTION ENGINE"
      title="Gesture Interface"
      description="Live gesture recognition, interaction state and spatial command distribution."
    >

      <div
        className="
          grid
          gap-5
          xl:grid-cols-[1.2fr_1fr]
        "
      >

        {/* CURRENT INPUT */}

        <InteractiveCard id="gesture-current-input">

          <div
            className="
              rounded-2xl
              border
              border-slate-800
              bg-slate-950/80
              p-6
            "
          >

            <SectionTitle
              eyebrow="CURRENT INPUT"
              title={cursor.gesture}
              rightText={`${interactionCount} EVENTS`}
            />

            <div
              className="
                mt-5
                rounded-2xl
                border
                border-slate-800
                bg-slate-900/40
                p-5
              "
            >

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <span
                    className="
                      h-3
                      w-3
                      rounded-full
                      bg-cyan-400
                      shadow-[0_0_12px_rgba(34,211,238,0.8)]
                    "
                  />

                  <span className="text-lg font-semibold">
                    {cursor.gesture}
                  </span>

                </div>

                <span className="text-sm text-slate-400">
                  {confidencePercent}%
                </span>

              </div>


              <div
                className="
                  mt-5
                  h-2
                  overflow-hidden
                  rounded-full
                  bg-slate-800
                "
              >

                <div
                  className="
                    h-full
                    rounded-full
                    bg-cyan-400
                    transition-all
                    duration-300
                  "
                  style={{
                    width: `${confidencePercent}%`,
                  }}
                />

              </div>


              <div className="mt-4 text-xs text-slate-500">
                {interactionMessage}
              </div>

            </div>


            <div
              className="
                mt-4
                grid
                gap-3
                sm:grid-cols-3
              "
            >

              <SmallStatus
                label="TARGET"
                value={
                  hoveredWidget || "NONE"
                }
              />

              <SmallStatus
                label="SELECTED"
                value={
                  selectedWidget || "NONE"
                }
              />

              <SmallStatus
                label="DRAGGING"
                value={
                  draggingWidget || "NONE"
                }
              />

            </div>

          </div>

        </InteractiveCard>


        {/* DISTRIBUTION */}

        <InteractiveCard id="gesture-distribution">

          <div
            className="
              rounded-2xl
              border
              border-slate-800
              bg-slate-950/80
              p-6
            "
          >

            <SectionTitle
              eyebrow="GESTURE DISTRIBUTION"
              title="Recognition Events"
              rightText={`${gestureTotal} TOTAL`}
            />

            <div className="mt-5 space-y-4">

              <GestureBar
                icon="☝"
                label="Point"
                value={gestureStats?.POINT || 0}
                total={gestureTotal}
              />

              <GestureBar
                icon="🤏"
                label="Pinch"
                value={gestureStats?.PINCH || 0}
                total={gestureTotal}
              />

              <GestureBar
                icon="✌"
                label="Two Finger"
                value={gestureStats?.TWO_FINGER || 0}
                total={gestureTotal}
              />

              <GestureBar
                icon="✊"
                label="Fist"
                value={gestureStats?.FIST || 0}
                total={gestureTotal}
              />

              <GestureBar
                icon="✋"
                label="Palm"
                value={gestureStats?.OPEN_PALM || 0}
                total={gestureTotal}
              />

            </div>

          </div>

        </InteractiveCard>

      </div>


      {/* COMMAND MAP */}

      <div className="mt-5">

        <InteractiveCard id="gesture-command-map">

          <div
            className="
              rounded-2xl
              border
              border-slate-800
              bg-slate-950/80
              p-6
            "
          >

            <SectionTitle
              eyebrow="SPATIAL CONTROLS"
              title="Gesture Command Map"
              rightText="HANDS-FREE CONTROL"
            />

            <div
              className="
                mt-5
                grid
                gap-3
                md:grid-cols-2
                xl:grid-cols-5
              "
            >

              <CommandCard
                icon="☝"
                gesture="POINT"
                action="Target"
              />

              <CommandCard
                icon="🤏"
                gesture="PINCH"
                action="Select / Drag"
              />

              <CommandCard
                icon="✌"
                gesture="TWO FINGER"
                action="Scroll"
              />

              <CommandCard
                icon="✊"
                gesture="FIST"
                action="Close / Cancel"
              />

              <CommandCard
                icon="✋"
                gesture="OPEN PALM"
                action="Reset"
              />

            </div>

          </div>

        </InteractiveCard>

      </div>

    </PageShell>
  );
}


/* =========================================================
   ANALYTICS PAGE
========================================================= */

function AnalyticsPage({
  cursor,
  gestureStats,
  gestureTotal,
  interactionCount,
  performanceHistory,
  scrollPosition,
}) {

  const currentFPS =
    Math.round(
      performanceHistory[
        performanceHistory.length - 1
      ] || 0
    );


  return (
    <PageShell
      eyebrow="PERFORMANCE"
      title="Analytics"
      description="Live interaction metrics, gesture distribution and vision performance."
    >

      <div
        className="
          grid
          gap-5
          md:grid-cols-2
          xl:grid-cols-4
        "
      >

        <InteractiveCard id="analytics-fps">

          <MetricCard
            title="Frames / Sec"
            value={`${currentFPS}`}
            description="Live processing activity."
          />

        </InteractiveCard>


        <InteractiveCard id="analytics-health">

          <MetricCard
            title="Pipeline Health"
            value="98.6%"
            description="Vision pipeline health."
            accent="green"
          />

        </InteractiveCard>


        <InteractiveCard id="analytics-interactions">

          <MetricCard
            title="Interactions"
            value={`${interactionCount}`}
            description="Live interaction events."
          />

        </InteractiveCard>


        <InteractiveCard id="analytics-confidence">

          <MetricCard
            title="Tracking"
            value={`${Math.round(
              (cursor.confidence || 0) * 100
            )}%`}
            description={`${cursor.gesture} confidence.`}
          />

        </InteractiveCard>

      </div>


      {/* =================================================
          REAL PERFORMANCE CHART
      ================================================= */}

      <div className="mt-5">

        <InteractiveCard id="analytics-chart">

          <div
            className="
              rounded-2xl
              border
              border-slate-800
              bg-slate-950/80
              p-6
            "
          >

            <SectionTitle
              eyebrow="LIVE PERFORMANCE"
              title="Processing Activity"
              rightText="REAL TIME"
            />

            <div
              className="
                mt-5
                h-[300px]
                overflow-hidden
                rounded-xl
                border
                border-slate-800
                bg-slate-900/30
              "
            >

              <PerformanceChart
                data={performanceHistory}
              />

            </div>

          </div>

        </InteractiveCard>

      </div>


      {/* =================================================
          LIVE STATISTICS
      ================================================= */}

      <div
        className="
          mt-5
          grid
          gap-5
          lg:grid-cols-2
        "
      >

        <InteractiveCard id="analytics-gesture-stats">

          <div
            className="
              rounded-2xl
              border
              border-slate-800
              bg-slate-950/80
              p-6
            "
          >

            <SectionTitle
              eyebrow="GESTURE ACTIVITY"
              title="Recognition Statistics"
            />

            <div className="mt-5 space-y-3">

              <AnalyticsRow
                label="POINT"
                value={gestureStats?.POINT || 0}
              />

              <AnalyticsRow
                label="PINCH"
                value={gestureStats?.PINCH || 0}
              />

              <AnalyticsRow
                label="TWO FINGER"
                value={gestureStats?.TWO_FINGER || 0}
              />

              <AnalyticsRow
                label="FIST"
                value={gestureStats?.FIST || 0}
              />

              <AnalyticsRow
                label="OPEN PALM"
                value={gestureStats?.OPEN_PALM || 0}
              />

            </div>

          </div>

        </InteractiveCard>


        <InteractiveCard id="analytics-runtime">

          <div
            className="
              rounded-2xl
              border
              border-slate-800
              bg-slate-950/80
              p-6
            "
          >

            <SectionTitle
              eyebrow="RUNTIME"
              title="Workspace Activity"
            />

            <div
              className="
                mt-5
                grid
                gap-3
                sm:grid-cols-2
              "
            >

              <SmallStatus
                label="TOTAL EVENTS"
                value={String(interactionCount || 0)}
              />

              <SmallStatus
                label="GESTURES"
                value={String(gestureTotal || 0)}
              />

              <SmallStatus
                label="SCROLL POSITION"
                value={`${Math.round(scrollPosition || 0)} px`}
              />

              <SmallStatus
                label="CURRENT INPUT"
                value={cursor.gesture}
              />

            </div>

          </div>

        </InteractiveCard>

      </div>

    </PageShell>
  );
}


/* =========================================================
   SYSTEM PAGE
========================================================= */

function SystemPage({
  trackingActive,
  cursor,
  interactionCount,
}) {

  return (
    <PageShell
      eyebrow="SYSTEM"
      title="System Configuration"
      description="Live status of the AR workspace services and interaction components."
    >

      <div
        className="
          grid
          gap-4
          md:grid-cols-2
        "
      >

        <InteractiveCard id="system-backend">

          <SystemRow
            name="Backend API"
            status="ONLINE"
          />

        </InteractiveCard>


        <InteractiveCard id="system-vision">

          <SystemRow
            name="Computer Vision"
            status={
              trackingActive
                ? "ACTIVE"
                : "READY"
            }
          />

        </InteractiveCard>


        <InteractiveCard id="system-hand">

          <SystemRow
            name="Hand Tracking"
            status={
              trackingActive
                ? "ACTIVE"
                : "STANDBY"
            }
          />

        </InteractiveCard>


        <InteractiveCard id="system-object">

          <SystemRow
            name="Object Detection"
            status="READY"
          />

        </InteractiveCard>


        <InteractiveCard id="system-gesture">

          <SystemRow
            name="Gesture Engine"
            status={
              cursor.gesture !== "UNKNOWN"
                ? "ACTIVE"
                : "READY"
            }
          />

        </InteractiveCard>


        <InteractiveCard id="system-interaction">

          <SystemRow
            name="Interaction Controller"
            status={`${interactionCount} EVENTS`}
          />

        </InteractiveCard>

      </div>

    </PageShell>
  );
}


/* =========================================================
   INTERACTIVE CARD
========================================================= */

function InteractiveCard({
  id,
  children,
}) {

  const {
    registerWidget,
    unregisterWidget,
    hoveredWidget,
    selectedWidget,
    draggingWidget,
    selectWidget,
  } = useARInteraction();


  const elementRef = useRef(null);


  /* =======================================================
     REGISTER ACTUAL DOM ELEMENT
  ======================================================= */

  useEffect(() => {

    const element = elementRef.current;

    if (!element) {
      return undefined;
    }

    registerWidget(id, element);

    return () => {
      unregisterWidget(id);
    };

  }, [
    id,
    registerWidget,
    unregisterWidget,
  ]);


  /* =======================================================
     CLICK SUPPORT
  ======================================================= */

  const handleClick = () => {

    if (selectWidget) {
      selectWidget(id);
    }

  };


  const isHovered =
    hoveredWidget === id;

  const isSelected =
    selectedWidget === id;

  const isDragging =
    draggingWidget === id;


  return (
    <div
      ref={elementRef}
      data-ar-widget={id}
      data-ar-interactive="true"
      onClick={handleClick}
      className={`
        relative
        transition-all
        duration-200
        ${
          isHovered
            ? "z-40"
            : ""
        }
        ${
          isSelected
            ? "ring-1 ring-cyan-400/60"
            : ""
        }
        ${
          isDragging
            ? "ring-2 ring-cyan-300/80 shadow-[0_0_35px_rgba(34,211,238,0.15)]"
            : ""
        }
      `}
    >

      {/* TARGET INDICATOR */}

      {isHovered && (
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            z-50
            rounded-2xl
            border
            border-cyan-400/50
            shadow-[inset_0_0_20px_rgba(34,211,238,0.04)]
          "
        />
      )}


      {/* SELECTED INDICATOR */}

      {isSelected && (
        <div
          className="
            pointer-events-none
            absolute
            right-3
            top-3
            z-50
            rounded-full
            border
            border-cyan-400/30
            bg-cyan-400/10
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


      {children}

    </div>
  );
}


/* =========================================================
   PAGE SHELL
========================================================= */

function PageShell({
  eyebrow,
  title,
  description,
  children,
}) {

  return (
    <div
      className="
        mx-auto
        w-full
        max-w-[1500px]
      "
    >

      <div
        className="
          rounded-2xl
          border
          border-cyan-400/10
          bg-slate-950/80
          p-6
          shadow-[0_0_50px_rgba(34,211,238,0.03)]
          backdrop-blur-xl
        "
      >

        <div
          className="
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.3em]
            text-cyan-400
          "
        >
          {eyebrow}
        </div>


        <h1
          className="
            mt-2
            text-2xl
            font-semibold
            text-white
          "
        >
          {title}
        </h1>


        <p
          className="
            mt-2
            max-w-3xl
            text-sm
            leading-6
            text-slate-400
          "
        >
          {description}
        </p>

      </div>


      <div className="mt-5">
        {children}
      </div>

    </div>
  );
}


/* =========================================================
   METRIC CARD
========================================================= */

function MetricCard({
  title,
  value,
  description,
  accent = "cyan",
}) {

  const valueClass =
    accent === "green"
      ? "text-emerald-300"
      : "text-cyan-300";


  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-800
        bg-slate-950/80
        p-5
        backdrop-blur-xl
      "
    >

      <div
        className="
          text-[10px]
          uppercase
          tracking-[0.2em]
          text-slate-500
        "
      >
        {title}
      </div>


      <div
        className={`
          mt-4
          text-2xl
          font-semibold
          ${valueClass}
        `}
      >
        {value}
      </div>


      <div
        className="
          mt-2
          text-xs
          text-slate-500
        "
      >
        {description}
      </div>

    </div>
  );
}


/* =========================================================
   INFO PANEL
========================================================= */

function InfoPanel({
  eyebrow,
  title,
  description,
}) {

  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-800
        bg-slate-950/80
        p-5
      "
    >

      <div
        className="
          text-[9px]
          uppercase
          tracking-[0.25em]
          text-cyan-400
        "
      >
        {eyebrow}
      </div>


      <div
        className="
          mt-3
          text-xl
          font-semibold
          text-white
        "
      >
        {title}
      </div>


      <p
        className="
          mt-3
          text-xs
          leading-5
          text-slate-500
        "
      >
        {description}
      </p>

    </div>
  );
}


/* =========================================================
   GESTURE CONTROL
========================================================= */

function GestureControl({
  id,
  icon,
  gesture,
  action,
}) {

  return (
    <InteractiveCard id={id}>

      <div
        className="
          rounded-xl
          border
          border-slate-800
          bg-slate-900/50
          p-4
        "
      >

        <div className="flex items-center gap-3">

          <span className="text-xl">
            {icon}
          </span>

          <div>

            <div
              className="
                text-xs
                font-semibold
                text-cyan-300
              "
            >
              {gesture}
            </div>

            <div
              className="
                mt-1
                text-xs
                text-slate-500
              "
            >
              {action}
            </div>

          </div>

        </div>

      </div>

    </InteractiveCard>
  );
}


/* =========================================================
   PIPELINE STEP
========================================================= */

function PipelineStep({
  number,
  title,
  description,
  active = false,
}) {

  return (
    <div
      className={`
        rounded-xl
        border
        p-5
        ${
          active
            ? "border-cyan-400/20 bg-cyan-400/[0.025]"
            : "border-slate-800 bg-slate-900/40"
        }
      `}
    >

      <div
        className="
          flex
          items-center
          justify-between
        "
      >

        <span
          className="
            text-xs
            font-semibold
            text-cyan-400
          "
        >
          {number}
        </span>

        <span
          className={`
            h-2
            w-2
            rounded-full
            ${
              active
                ? "bg-emerald-400"
                : "bg-slate-700"
            }
          `}
        />

      </div>


      <div
        className="
          mt-3
          font-medium
          text-white
        "
      >
        {title}
      </div>


      <div
        className="
          mt-2
          text-xs
          leading-5
          text-slate-500
        "
      >
        {description}
      </div>

    </div>
  );
}


/* =========================================================
   COMMAND CARD
========================================================= */

function CommandCard({
  icon,
  gesture,
  action,
}) {

  return (
    <div
      className="
        flex
        items-center
        gap-3
        rounded-xl
        border
        border-slate-800
        bg-slate-900/30
        p-4
      "
    >

      <span className="text-xl">
        {icon}
      </span>

      <div>

        <div
          className="
            text-xs
            font-semibold
            text-cyan-300
          "
        >
          {gesture}
        </div>

        <div
          className="
            mt-1
            text-[10px]
            text-slate-500
          "
        >
          {action}
        </div>

      </div>

    </div>
  );
}


/* =========================================================
   GESTURE BAR
========================================================= */

function GestureBar({
  icon,
  label,
  value,
  total,
}) {

  const percentage =
    total > 0
      ? Math.round((value / total) * 100)
      : 0;


  return (
    <div>

      <div
        className="
          flex
          items-center
          justify-between
          text-xs
        "
      >

        <div className="flex items-center gap-2">

          <span className="text-base">
            {icon}
          </span>

          <span className="text-slate-300">
            {label}
          </span>

        </div>

        <span className="text-slate-500">
          {value}
        </span>

      </div>


      <div
        className="
          mt-2
          h-1.5
          overflow-hidden
          rounded-full
          bg-slate-900
        "
      >

        <div
          className="
            h-full
            rounded-full
            bg-cyan-400
            transition-all
            duration-500
          "
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

    </div>
  );
}


/* =========================================================
   ANALYTICS ROW
========================================================= */

function AnalyticsRow({
  label,
  value,
}) {

  return (
    <div
      className="
        flex
        items-center
        justify-between
        rounded-xl
        border
        border-slate-800
        bg-slate-900/30
        px-4
        py-3
      "
    >

      <span
        className="
          text-xs
          text-slate-400
        "
      >
        {label}
      </span>

      <span
        className="
          text-sm
          font-semibold
          text-cyan-300
        "
      >
        {value}
      </span>

    </div>
  );
}


/* =========================================================
   SMALL STATUS
========================================================= */

function SmallStatus({
  label,
  value,
}) {

  return (
    <div
      className="
        rounded-xl
        border
        border-slate-800
        bg-slate-900/30
        p-4
      "
    >

      <div
        className="
          text-[9px]
          uppercase
          tracking-[0.2em]
          text-slate-600
        "
      >
        {label}
      </div>

      <div
        className="
          mt-2
          truncate
          text-xs
          font-medium
          text-cyan-300
        "
      >
        {value}
      </div>

    </div>
  );
}


/* =========================================================
   SYSTEM ROW
========================================================= */

function SystemRow({
  name,
  status,
}) {

  const online =
    status === "ONLINE" ||
    status === "ACTIVE" ||
    status === "READY";


  return (
    <div
      className="
        flex
        items-center
        justify-between
        rounded-xl
        border
        border-slate-800
        bg-slate-950/80
        px-5
        py-4
      "
    >

      <div className="flex items-center gap-3">

        <span
          className={`
            h-2
            w-2
            rounded-full
            ${
              online
                ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"
                : "bg-slate-600"
            }
          `}
        />

        <span
          className="
            text-sm
            text-slate-300
          "
        >
          {name}
        </span>

      </div>


      <span
        className="
          rounded-full
          border
          border-emerald-400/20
          bg-emerald-400/5
          px-3
          py-1
          text-[10px]
          uppercase
          tracking-wider
          text-emerald-400
        "
      >
        {status}
      </span>

    </div>
  );
}


/* =========================================================
   SECTION TITLE
========================================================= */

function SectionTitle({
  eyebrow,
  title,
  rightText,
}) {

  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-4
      "
    >

      <div>

        {eyebrow && (
          <div
            className="
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.25em]
              text-cyan-400
            "
          >
            {eyebrow}
          </div>
        )}

        <div
          className="
            mt-1
            text-sm
            font-semibold
            text-white
          "
        >
          {title}
        </div>

      </div>


      {rightText && (
        <div
          className="
            text-[9px]
            uppercase
            tracking-wider
            text-slate-600
          "
        >
          {rightText}
        </div>
      )}

    </div>
  );
}


/* =========================================================
   PERFORMANCE CHART
========================================================= */

function PerformanceChart({
  data,
}) {

  const width = 1000;
  const height = 300;
  const padding = 30;


  const safeData =
    Array.isArray(data) && data.length > 0
      ? data
      : [10, 15, 12, 20];


  const maxValue =
    Math.max(...safeData, 50);


  const minValue =
    Math.min(...safeData, 0);


  const range =
    Math.max(
      1,
      maxValue - minValue
    );


  const points = safeData.map(
    (value, index) => {

      const x =
        padding +
        (
          index /
          Math.max(1, safeData.length - 1)
        ) *
        (width - padding * 2);


      const y =
        height -
        padding -
        (
          (value - minValue) /
          range
        ) *
        (height - padding * 2);


      return {
        x,
        y,
        value,
      };

    }
  );


  const linePath =
    points
      .map(
        (point, index) =>
          `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
      )
      .join(" ");


  const areaPath =
    `${linePath}
     L ${points[points.length - 1].x} ${height - padding}
     L ${points[0].x} ${height - padding}
     Z`;


  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="h-full w-full"
    >

      {/* GRID */}

      {[0, 1, 2, 3, 4].map((line) => {

        const y =
          padding +
          (line / 4) *
          (height - padding * 2);

        return (
          <line
            key={line}
            x1={padding}
            x2={width - padding}
            y1={y}
            y2={y}
            stroke="rgba(148,163,184,0.10)"
            strokeWidth="1"
          />
        );

      })}


      {/* AREA */}

      <path
        d={areaPath}
        fill="rgba(34,211,238,0.06)"
      />


      {/* LINE */}

      <path
        d={linePath}
        fill="none"
        stroke="rgb(34,211,238)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />


      {/* CURRENT POINT */}

      {points.length > 0 && (
        <circle
          cx={points[points.length - 1].x}
          cy={points[points.length - 1].y}
          r="5"
          fill="rgb(34,211,238)"
        />
      )}

    </svg>
  );
}


/* =========================================================
   SIDEBAR ITEM
========================================================= */

function RailItem({
  icon,
  label,
  active = false,
  onClick,
  navPage,
}) {

  return (
    <button
      type="button"
      onClick={onClick}
      data-ar-nav={navPage || undefined}
      className={`
        group
        relative
        mb-3
        flex
        h-12
        w-12
        cursor-pointer
        flex-col
        items-center
        justify-center
        rounded-xl
        border
        transition-all
        duration-200
        ${
          active
            ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.08)]"
            : "border-transparent text-slate-600 hover:border-slate-700 hover:bg-slate-900 hover:text-slate-300"
        }
      `}
    >

      <span className="text-base">
        {icon}
      </span>

      <span
        className="
          mt-0.5
          text-[7px]
          tracking-wider
        "
      >
        {label}
      </span>


      {active && (
        <span
          className="
            absolute
            -right-[1px]
            top-1/2
            h-5
            w-[2px]
            -translate-y-1/2
            rounded-full
            bg-cyan-400
          "
        />
      )}

    </button>
  );
}


/* =========================================================
   STATUS INDICATOR
========================================================= */

function StatusIndicator({
  label,
  value,
  active = false,
}) {

  return (
    <div className="flex items-center gap-2">

      <span
        className={`
          h-1.5
          w-1.5
          rounded-full
          ${
            active
              ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]"
              : "bg-slate-600"
          }
        `}
      />

      <span
        className="
          text-[9px]
          uppercase
          tracking-wider
          text-slate-500
        "
      >
        {label}
      </span>

      <span
        className="
          text-[9px]
          font-medium
          text-slate-300
        "
      >
        {value}
      </span>

    </div>
  );
}


/* =========================================================
   CORNER
========================================================= */

function Corner({
  position,
  borders,
}) {

  return (
    <div
      className={`
        absolute
        ${position}
        h-8
        w-8
        ${borders}
        border-cyan-400/40
      `}
    />
  );
}


export default ARWorkspace;