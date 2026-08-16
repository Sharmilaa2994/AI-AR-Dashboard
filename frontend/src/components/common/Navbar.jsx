function Navbar() {
  return (
    <header className="fixed left-64 right-0 top-0 z-10 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950/90 px-8 backdrop-blur">
      <div>
        <h2 className="text-lg font-semibold text-white">
          Spatial Control Center
        </h2>

        <p className="text-xs text-slate-500">
          AI-powered computer vision workspace
        </p>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-sm text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          System Online
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-sm">
          S
        </div>
      </div>
    </header>
  );
}

export default Navbar;