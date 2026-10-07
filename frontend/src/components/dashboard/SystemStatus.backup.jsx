import { useEffect, useState } from "react";

import {
  getVisionStatus,
  getVisionPipeline,
} from "../../services/api/visionApi";


function SystemStatus() {

  const [visionStatus, setVisionStatus] =
    useState(null);

  const [pipelineStatus, setPipelineStatus] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);


  // =========================================================
  // LOAD VISION STATUS
  // =========================================================

  useEffect(() => {

    let mounted = true;

    const loadVisionStatus =
      async () => {

        try {

          setLoading(true);

          const [
            status,
            pipeline,
          ] = await Promise.all([
            getVisionStatus(),
            getVisionPipeline(),
          ]);


          if (!mounted) {
            return;
          }


          setVisionStatus(status);

          setPipelineStatus(pipeline);

          setError(null);

        } catch (err) {

          console.error(
            "VISION STATUS ERROR:",
            err
          );

          if (!mounted) {
            return;
          }

          setError(
            err?.message ||
            "Vision service unavailable"
          );

        } finally {

          if (mounted) {
            setLoading(false);
          }
        }
      };


    loadVisionStatus();


    /*
     * Refresh the backend state periodically.
     */

    const interval =
      setInterval(
        loadVisionStatus,
        5000
      );


    return () => {

      mounted = false;

      clearInterval(interval);

    };

  }, []);


  // =========================================================
  // STATUS HELPERS
  // =========================================================

  const isReady =
    (value) => {

      if (
        value === true
      ) {
        return true;
      }

      if (
        typeof value !== "string"
      ) {
        return false;
      }

      return [
        "ready",
        "online",
        "active",
        "initialized",
        "available",
        "success",
      ].includes(
        value.toLowerCase()
      );
    };


  const getServiceState =
    (value) => {

      if (loading) {
        return "SYNC";
      }

      if (isReady(value)) {
        return "READY";
      }

      if (
        value ===
        "not_initialized"
      ) {
        return "STANDBY";
      }

      return "CHECK";
    };


  const getStateClass =
    (state) => {

      if (
        state === "READY"
      ) {
        return {
          dot:
            "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]",
          text:
            "text-emerald-400",
        };
      }

      if (
        state === "STANDBY"
      ) {
        return {
          dot:
            "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.7)]",
          text:
            "text-amber-400",
        };
      }

      if (
        state === "SYNC"
      ) {
        return {
          dot:
            "animate-pulse bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.7)]",
          text:
            "text-cyan-400",
        };
      }

      return {
        dot:
          "bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.7)]",
        text:
          "text-red-400",
      };
    };


  // =========================================================
  // EXTRACT BACKEND VALUES
  // =========================================================

  const backendState =
    getServiceState(
      visionStatus?.status
    );


  const opencvState =
    getServiceState(
      visionStatus?.opencv
    );


  const mediapipeState =
    getServiceState(
      pipelineStatus?.mediapipe
    );


  const objectDetectionState =
    getServiceState(
      pipelineStatus?.object_detection
    );


  const frameProcessingState =
    getServiceState(
      pipelineStatus?.frame_processing
    );


  const pipelineState =
    getServiceState(
      pipelineStatus?.pipeline
    );


  const services = [
    {
      name: "Vision Backend",
      state: backendState,
    },
    {
      name: "OpenCV",
      state: opencvState,
    },
    {
      name: "MediaPipe",
      state: mediapipeState,
    },
    {
      name: "Object Detection",
      state: objectDetectionState,
    },
    {
      name: "Frame Processing",
      state: frameProcessingState,
    },
    {
      name: "Vision Pipeline",
      state: pipelineState,
    },
  ];


  // =========================================================
  // UI
  // =========================================================

  return (

    <div
      className="
        relative
        overflow-hidden
        rounded-2xl
        border
        border-cyan-500/15
        bg-slate-950/75
        p-5
        shadow-[0_0_40px_rgba(34,211,238,0.04)]
        backdrop-blur-xl
      "
    >

      {/* ===================================================
          TOP ACCENT
      =================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-0
          right-0
          top-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-cyan-400/60
          to-transparent
        "
      />


      {/* ===================================================
          HEADER
      =================================================== */}

      <div
        className="
          flex
          items-start
          justify-between
        "
      >

        <div>

          <div
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.25em]
              text-cyan-400
            "
          >
            Vision Intelligence
          </div>

          <h3
            className="
              mt-1
              text-sm
              font-semibold
              text-white
            "
          >
            AI Processing Stack
          </h3>

          <p
            className="
              mt-1
              text-[10px]
              text-slate-500
            "
          >
            Real-time computer vision services
          </p>

        </div>


        {/* LIVE INDICATOR */}

        <div
          className="
            flex
            items-center
            gap-2
            rounded-full
            border
            border-emerald-500/20
            bg-emerald-500/5
            px-2.5
            py-1
          "
        >

          <span
            className="
              h-1.5
              w-1.5
              animate-pulse
              rounded-full
              bg-emerald-400
            "
          />

          <span
            className="
              text-[9px]
              font-medium
              uppercase
              tracking-wider
              text-emerald-400
            "
          >
            Live
          </span>

        </div>

      </div>


      {/* ===================================================
          PIPELINE VISUAL
      =================================================== */}

      <div
        className="
          mt-5
          rounded-xl
          border
          border-slate-800
          bg-slate-900/60
          p-3
        "
      >

        <div
          className="
            flex
            items-center
            justify-between
            text-[9px]
            uppercase
            tracking-wider
          "
        >

          <span className="text-slate-500">
            Pipeline
          </span>

          <span
            className={
              getStateClass(
                pipelineState
              ).text
            }
          >
            {pipelineState}
          </span>

        </div>


        <div
          className="
            mt-3
            flex
            items-center
            gap-1
          "
        >

          {[
            "CAM",
            "CV",
            "AI",
            "ACT",
          ].map(
            (stage, index) => (

              <div
                key={stage}
                className="
                  flex
                  flex-1
                  items-center
                "
              >

                <div
                  className="
                    flex
                    h-7
                    w-full
                    items-center
                    justify-center
                    rounded-md
                    border
                    border-cyan-500/15
                    bg-cyan-500/5
                    text-[8px]
                    font-medium
                    text-cyan-300
                  "
                >
                  {stage}
                </div>

                {index < 3 && (
                  <div
                    className="
                      h-px
                      w-1
                      bg-cyan-500/30
                    "
                  />
                )}

              </div>

            )
          )}

        </div>

      </div>


      {/* ===================================================
          SERVICES
      =================================================== */}

      <div className="mt-4 space-y-2">

        {services.map(
          (service) => {

            const stateStyle =
              getStateClass(
                service.state
              );

            return (

              <div
                key={service.name}
                className="
                  flex
                  items-center
                  justify-between
                  rounded-lg
                  border
                  border-slate-800/80
                  bg-slate-900/40
                  px-3
                  py-2.5
                  transition
                  duration-200
                  hover:border-cyan-500/20
                  hover:bg-cyan-500/5
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >

                  <span
                    className={`
                      h-1.5
                      w-1.5
                      rounded-full
                      ${stateStyle.dot}
                    `}
                  />

                  <span
                    className="
                      text-[10px]
                      text-slate-300
                    "
                  >
                    {service.name}
                  </span>

                </div>


                <span
                  className={`
                    text-[9px]
                    font-semibold
                    tracking-wider
                    ${stateStyle.text}
                  `}
                >
                  {service.state}
                </span>

              </div>

            );
          }
        )}

      </div>


      {/* ===================================================
          FOOTER
      =================================================== */}

      <div
        className="
          mt-4
          flex
          items-center
          justify-between
          border-t
          border-slate-800
          pt-3
        "
      >

        <span
          className="
            text-[8px]
            uppercase
            tracking-[0.18em]
            text-slate-600
          "
        >
          AI-AR VISION CORE
        </span>

        <span
          className="
            font-mono
            text-[8px]
            text-slate-600
          "
        >
          v2.0
        </span>

      </div>


      {/* ===================================================
          ERROR
      =================================================== */}

      {error && (
        <div
          className="
            mt-3
            rounded-lg
            border
            border-red-500/20
            bg-red-500/5
            px-3
            py-2
            text-[9px]
            text-red-400
          "
        >
          Vision service connection check required
        </div>
      )}

    </div>

  );
}


export default SystemStatus;