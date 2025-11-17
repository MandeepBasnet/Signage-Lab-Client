import { useState, useEffect } from "react";
import { fetchMedia, uploadMedia } from "../api/xiboApi";

export default function MediaContent() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMedia();
      setMedia(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      await uploadMedia(file);
      await loadMedia();
    } catch (err) {
      alert("Upload failed: " + err.message);
    } finally {
      setUploading(false);
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
          onClick={loadMedia}
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
        <h2 className="text-2xl font-bold">Media Library ({media.length})</h2>
        <div className="flex gap-2">
          <label className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
            {uploading ? "Uploading..." : "Upload Media"}
            <input
              type="file"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
              accept="image/*,video/*"
            />
          </label>
          <button
            onClick={loadMedia}
            className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {media.map((item) => (
          <div
            key={item.mediaId}
            className="border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow"
          >
            <div className="aspect-video bg-gray-100 flex items-center justify-center">
              <span className="text-4xl">🎬</span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold truncate">{item.name}</h3>
              <p className="text-xs text-gray-500">
                {formatFileSize(item.fileSize)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatFileSize(bytes) {
  if (!bytes) return "Unknown";
  const mb = bytes / 1024 / 1024;
  return mb >= 1 ? `${mb.toFixed(2)} MB` : `${(bytes / 1024).toFixed(2)} KB`;
}
