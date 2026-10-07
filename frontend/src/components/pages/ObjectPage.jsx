import React from "react";

function ObjectPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="border-b border-white/[0.06] bg-slate-950/80 px-8 py-7">

        <div className="flex items-center gap-4">

          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-xl
              border
              border-purple-400/30
              bg-purple-400/10
              text-xl
              text-purple-300
            "
          >
            ◇
          </div>

          <div>

            <div
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.3em]
                text-purple-400
              "
            >
              Computer Vision
            </div>

            <h1 className="mt-1 text-2xl font-semibold">
              Object Detection
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Detect and monitor objects using the AI vision pipeline.
            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="p-8">

        <div
          className="
            grid
            gap-5
            md:grid-cols-2
            xl:grid-cols-4
          "
        >

          {/* STATUS */}

          <InfoCard
            title="Detection Status"
            value="STANDBY"
            description="Object detection service"
            status="yellow"
          />

          {/* MODEL */}

          <InfoCard
            title="Detection Model"
            value="YOLO"
            description="Real-time object detection"
            status="cyan"
          />

          {/* OBJECTS */}

          <InfoCard
            title="Objects Detected"
            value="0"
            description="Currently detected objects"
            status="purple"
          />

          {/* CONFIDENCE */}

          <InfoCard
            title="Confidence"
            value="0%"
            description="Current detection confidence"
            status="green"
          />

        </div>


        {/* =================================================
            DETECTION WORKSPACE
        ================================================== */}

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">

          {/* CAMERA / DETECTION AREA */}

          <section
            className="
              min-h-[430px]
              rounded-2xl
              border
              border-white/[0.06]
              bg-slate-900/40
              p-6
            "
          >

            <div className="flex items-center justify-between">

              <div>

                <p
                  className="
                    text-[10px]
                    uppercase
                    tracking-[0.25em]
                    text-cyan-400
                  "
                >
                  Vision Workspace
                </p>

                <h2 className="mt-1 text-lg font-semibold">
                  Detection View
                </h2>

              </div>

              <div
                className="
                  rounded-full
                  border
                  border-yellow-400/20
                  bg-yellow-400/5
                  px-3
                  py-1.5
                  text-[10px]
                  uppercase
                  tracking-wider
                  text-yellow-300
                "
              >
                STANDBY
              </div>

            </div>


            <div
              className="
                mt-6
                flex
                min-h-[320px]
                items-center
                justify-center
                rounded-xl
                border
                border-dashed
                border-slate-700
                bg-slate-950/70
              "
            >

              <div className="text-center">

                <div className="text-4xl text-slate-700">
                  ◇
                </div>

                <p className="mt-4 text-sm text-slate-400">
                  Object detection preview
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  Start the vision pipeline to detect objects.
                </p>

              </div>

            </div>

          </section>


          {/* DETECTION INFORMATION */}

          <section
            className="
              rounded-2xl
              border
              border-white/[0.06]
              bg-slate-900/40
              p-6
            "
          >

            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.25em]
                text-purple-400
              "
            >
              Detection Monitor
            </p>

            <h2 className="mt-1 text-lg font-semibold">
              Detected Objects
            </h2>


            <div className="mt-6 space-y-3">

              <DetectionRow
                label="No objects detected"
                value="--"
              />

              <DetectionRow
                label="Bounding boxes"
                value="0"
              />

              <DetectionRow
                label="Processing"
                value="READY"
              />

              <DetectionRow
                label="Pipeline"
                value="ONLINE"
              />

            </div>


            {/* MODEL INFORMATION */}

            <div
              className="
                mt-8
                rounded-xl
                border
                border-purple-400/10
                bg-purple-400/[0.03]
                p-4
              "
            >

              <p
                className="
                  text-[9px]
                  uppercase
                  tracking-[0.2em]
                  text-purple-400
                "
              >
                Model Information
              </p>

              <div className="mt-3 space-y-2 text-xs">

                <div className="flex justify-between">

                  <span className="text-slate-500">
                    Model
                  </span>

                  <span className="text-slate-300">
                    YOLO
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-slate-500">
                    Input
                  </span>

                  <span className="text-slate-300">
                    Camera
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-slate-500">
                    Mode
                  </span>

                  <span className="text-slate-300">
                    Real-time
                  </span>

                </div>

              </div>

            </div>

          </section>

        </div>


        {/* =================================================
            DETECTION PIPELINE
        ================================================== */}

        <section
          className="
            mt-6
            rounded-2xl
            border
            border-white/[0.06]
            bg-slate-900/40
            p-6
          "
        >

          <p
            className="
              text-[10px]
              uppercase
              tracking-[0.25em]
              text-cyan-400
            "
          >
            Processing Pipeline
          </p>

          <h2 className="mt-1 text-lg font-semibold">
            Object Detection Flow
          </h2>


          <div
            className="
              mt-6
              grid
              gap-3
              md:grid-cols-4
            "
          >

            <PipelineStep
              number="01"
              title="Camera"
              description="Video input"
            />

            <PipelineStep
              number="02"
              title="Frame"
              description="Frame processing"
            />

            <PipelineStep
              number="03"
              title="YOLO"
              description="Object detection"
            />

            <PipelineStep
              number="04"
              title="Overlay"
              description="Bounding boxes"
            />

          </div>

        </section>

      </div>

    </div>
  );
}


/* =========================================================
   INFO CARD
========================================================= */

function InfoCard({
  title,
  value,
  description,
  status,
}) {

  const statusClasses = {

    cyan:
      "border-cyan-400/20 text-cyan-300 bg-cyan-400/5",

    purple:
      "border-purple-400/20 text-purple-300 bg-purple-400/5",

    green:
      "border-emerald-400/20 text-emerald-300 bg-emerald-400/5",

    yellow:
      "border-yellow-400/20 text-yellow-300 bg-yellow-400/5",

  };

  return (

    <div
      className={`
        rounded-2xl
        border
        bg-slate-900/40
        p-5
        ${statusClasses[status] || statusClasses.cyan}
      `}
    >

      <p className="text-[10px] uppercase tracking-wider text-slate-500">
        {title}
      </p>

      <p className="mt-3 text-2xl font-semibold">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>

    </div>

  );
}


/* =========================================================
   DETECTION ROW
========================================================= */

function DetectionRow({
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
        border-white/[0.05]
        bg-slate-950/50
        px-4
        py-3
      "
    >

      <span className="text-xs text-slate-400">
        {label}
      </span>

      <span className="text-xs font-medium text-cyan-300">
        {value}
      </span>

    </div>

  );
}


/* =========================================================
   PIPELINE STEP
========================================================= */

function PipelineStep({
  number,
  title,
  description,
}) {

  return (

    <div
      className="
        rounded-xl
        border
        border-white/[0.06]
        bg-slate-950/50
        p-4
      "
    >

      <div
        className="
          flex
          h-8
          w-8
          items-center
          justify-center
          rounded-lg
          border
          border-cyan-400/20
          bg-cyan-400/5
          text-[10px]
          text-cyan-300
        "
      >
        {number}
      </div>

      <p className="mt-4 text-sm font-medium text-white">
        {title}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>

    </div>

  );
}


/* =========================================================
   IMPORTANT: DEFAULT EXPORT
========================================================= */

export default ObjectPage;