/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { fetchLayouts, publishLayout } from "../api/xiboApi";
import LayoutCard from "./LayoutCard";

export default function LayoutContent() {
  const [layouts, setLayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLayout, setSelectedLayout] = useState(null);

  useEffect(() => {
    loadLayouts();
  }, []);

  const loadLayouts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchLayouts();
      setLayouts(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">Error: {error}</p>
        <button
          onClick={loadLayouts}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Layouts ({layouts.length})</h2>
        <button
          onClick={loadLayouts}
          className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {layouts.map((layout) => (
          <LayoutCard
            key={layout.layoutId}
            layout={layout}
            onSelect={setSelectedLayout}
          />
        ))}
      </div>
    </div>
  );
}
