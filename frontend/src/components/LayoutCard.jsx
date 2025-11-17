export default function LayoutCard({ layout, onSelect }) {
  return (
    <div
      onClick={() => onSelect(layout)}
      className="border rounded-lg p-5 hover:shadow-lg cursor-pointer transition-all bg-white"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-lg">{layout.layout}</h3>
        <span className="text-2xl">📄</span>
      </div>

      {layout.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {layout.description}
        </p>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t">
        <span>
          {layout.width}×{layout.height}
        </span>
        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
          {layout.regions?.length || 0} regions
        </span>
      </div>
    </div>
  );
}
