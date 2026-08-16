import { useState } from "react";

import DashboardCard from "./DashboardCard";
import PerformanceChart from "./PerformanceChart";
import SystemStatus from "./SystemStatus";
import ARWidget from "./ARWidget";

function ARDashboard() {
  const [selectedWidget, setSelectedWidget] =
    useState(null);

  // Step 37.5
  const widgets = [
    {
      id: "users",
      title: "Active Users",
      value: "1,284",
      description: "+12.8% from previous period",
      icon: "👥",
    },
    {
      id: "load",
      title: "System Load",
      value: "42%",
      description: "Optimal operating range",
      icon: "⚡",
    },
    {
      id: "processing",
      title: "Processing Rate",
      value: "98.6%",
      description: "Vision pipeline efficiency",
      icon: "◈",
    },
    {
      id: "interactions",
      title: "Interactions",
      value: "8,492",
      description: "Gesture events processed",
      icon: "✋",
    },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-transparent px-6 py-8">

      {/* AR background grid */}

      <div className="pointer-events-none absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,211,238,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.08) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Ambient glow */}

      <div className="pointer-events-none absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-500/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">

        {/* Header */}

        <div className="mb-8 flex items-end justify-between">

          <div>

            <div className="mb-2 flex items-center gap-2">

              <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />

              <span className="text-xs uppercase tracking-[0.25em] text-cyan-400">
                AR Environment
              </span>

            </div>

            <h1 className="text-3xl font-semibold text-white md:text-4xl">
              Intelligent AR Dashboard
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Computer vision powered spatial dashboard
              with gesture-based interaction.
            </p>

          </div>

          <div className="hidden rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 backdrop-blur-xl md:block">

            <div className="text-[10px] uppercase tracking-wider text-slate-500">
              System
            </div>

            <div className="mt-1 flex items-center gap-2 text-sm text-emerald-400">

              <span className="h-2 w-2 rounded-full bg-emerald-400" />

              Operational

            </div>

          </div>

        </div>


        {/* ================================================== */}
        {/* STEP 37.6 — INTERACTIVE AR WIDGETS */}
        {/* ================================================== */}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

          {widgets.map((widget) => (
            <ARWidget
              key={widget.id}
              title={widget.title}
              value={widget.value}
              description={widget.description}
              icon={widget.icon}
              selected={
                selectedWidget === widget.id
              }
              onSelect={() =>
                setSelectedWidget(widget.id)
              }
            />
          ))}

        </div>


        {/* Main analytics */}

        <div className="mt-4 grid gap-4 lg:grid-cols-3">

          <div className="lg:col-span-2">

            <PerformanceChart />

          </div>

          <SystemStatus />

        </div>


        {/* AR interaction hint */}

        <div className="mt-6 rounded-2xl border border-cyan-500/10 bg-cyan-500/5 p-5 backdrop-blur-xl">

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>

              <div className="text-xs uppercase tracking-wider text-cyan-400">
                Gesture Interface
              </div>

              <p className="mt-1 text-sm text-slate-400">
                Use POINT to target a widget and PINCH
                to select it.
              </p>

            </div>

            <div className="flex gap-2 text-xs">

              <span className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-400">
                ☝ POINT
              </span>

              <span className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-cyan-300">
                🤏 PINCH
              </span>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default ARDashboard;