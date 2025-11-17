import { getAuthHeaders } from "../utils/auth.js";

const API_URL = import.meta.env.VITE_XIBO_API_URL;

export async function fetchLayouts() {
  const response = await fetch(`${API_URL}/layout?embed=regions`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch layouts");
  }

  return response.json();
}

export async function fetchPlaylists() {
  const response = await fetch(`${API_URL}/playlist?embed=widgets`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch playlists");
  }

  return response.json();
}

export async function fetchMedia() {
  const response = await fetch(`${API_URL}/library`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch media");
  }

  return response.json();
}

export async function uploadMedia(file, folderId = 1) {
  const formData = new FormData();
  formData.append("files", file);
  formData.append("name", file.name);
  if (folderId) {
    formData.append("folderId", folderId);
  }

  const response = await fetch(`${API_URL}/library`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload media");
  }

  return response.json();
}

export async function publishLayout(layoutId) {
  const response = await fetch(`${API_URL}/layout/publish/${layoutId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      ...getAuthHeaders(),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to publish layout");
  }

  return response.json();
}

export async function assignMediaToPlaylist(playlistId, mediaIds) {
  const formData = new URLSearchParams();
  mediaIds.forEach((id) => formData.append("media[]", id));

  const response = await fetch(
    `${API_URL}/playlist/library/assign/${playlistId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        ...getAuthHeaders(),
      },
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to assign media to playlist");
  }

  return response.json();
}
