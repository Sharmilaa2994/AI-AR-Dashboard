const menuItems = [
  { label: "Overview", icon: "◉" },
  { label: "Vision", icon: "◇" },
  { label: "Gestures", icon: "◎" },
  { label: "Analytics", icon: "▣" },
  { label: "AI Assistant", icon: "✦" },
];

function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-950 p-5">
      <div className="mb-10">
        <h1 className="text-xl font-bold text-cyan-400">
          ✦ AR VISION
        </h1>

        <p className="mt-1 text-xs text-slate-500">
          Intelligent Spatial Dashboard
        </p>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-slate-400 transition hover:bg-slate-900 hover:text-cyan-400"
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="border-t border-slate-800 pt-4">
        <button className="w-full rounded-xl px-4 py-3 text-left text-sm text-slate-400 hover:bg-slate-900 hover:text-white">
          ⚙ Settings
        </button>

        <button className="mt-2 w-full rounded-xl px-4 py-3 text-left text-sm text-red-400 hover:bg-slate-900">
          ↪ Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;