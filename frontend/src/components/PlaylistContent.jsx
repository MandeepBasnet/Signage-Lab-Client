import { useState, useEffect } from "react";
import { fetchPlaylists } from "../api/xiboApi";

export default function PlaylistContent() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPlaylists();
      setPlaylists(data || []);
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
          onClick={loadPlaylists}
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
        <h2 className="text-2xl font-bold">Playlists ({playlists.length})</h2>
        <button
          onClick={loadPlaylists}
          className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {playlists.map((playlist) => (
          <div
            key={playlist.playlistId}
            className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-lg">{playlist.name}</h3>
              <span className="text-2xl">📂</span>
            </div>
            {playlist.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {playlist.description}
              </p>
            )}
            <div className="text-xs text-gray-500 pt-3 border-t">
              {playlist.widgets?.length || 0} widgets
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
