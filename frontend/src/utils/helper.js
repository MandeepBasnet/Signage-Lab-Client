// Format duration in seconds to readable format
export function formatDuration(seconds) {
  if (!seconds) return "0s";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

  return parts.join(" ");
}

// Format file size
export function formatFileSize(bytes) {
  if (!bytes) return "0 B";

  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}

// Format date
export function formatDate(dateString) {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString();
}

// Check if media type is image
export function isImageMedia(mediaType) {
  return ["image", "jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(
    mediaType?.toLowerCase()
  );
}

// Check if media type is video
export function isVideoMedia(mediaType) {
  return ["video", "mp4", "avi", "mov", "wmv", "flv"].includes(
    mediaType?.toLowerCase()
  );
}

// Handle API errors
export function handleApiError(error) {
  if (error.response) {
    return error.response.data?.message || "An error occurred";
  } else if (error.request) {
    return "No response from server. Please check your connection.";
  } else {
    return error.message || "An unexpected error occurred";
  }
}

// Get media thumbnail URL
export function getMediaThumbnailUrl(mediaId) {
  return `${import.meta.env.VITE_XIBO_API_URL}/library/thumbnail/${mediaId}`;
}
