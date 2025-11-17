const menuItems = [
  {
    section: "DESIGN",
    items: [{ id: "design-layout", label: "Layouts", icon: "📄" }],
  },
  {
    section: "LIBRARY",
    items: [
      { id: "library-playlist", label: "Playlists", icon: "📂" },
      { id: "library-media", label: "Media", icon: "🎬" },
    ],
  },
];

export default function Sidebar({ currentPage, setCurrentPage }) {
  return (
    <aside className="w-[200px] bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
      <div className="p-5 border-b border-gray-200 flex items-center justify-center">
        <h1 className="text-xl font-bold text-blue-600">Xibo</h1>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map((section) => (
          <div key={section.section} className="px-3 pb-4">
            <h3 className="text-xs font-semibold uppercase text-gray-500 tracking-wider mb-2 px-2">
              {section.section}
            </h3>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.id}>
                  <button
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer text-sm transition-all w-full ${
                      currentPage === item.id
                        ? "bg-blue-600 text-white font-semibold"
                        : "text-gray-600 hover:bg-blue-50 hover:text-gray-800"
                    }`}
                    onClick={() => setCurrentPage(item.id)}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span className="flex-1 text-left">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
