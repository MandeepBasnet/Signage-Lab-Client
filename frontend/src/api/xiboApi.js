import axios from "axios";
import { getApiToken } from "./auth";

const API_URL = import.meta.env.VITE_XIBO_API_URL;

// Helper function to make authenticated requests
async function makeRequest(method, endpoint, data = null, config = {}) {
  try {
    const token = await getApiToken();
    const url = `${API_URL}${endpoint}`;

    const requestConfig = {
      method,
      url,
      headers: {
        Authorization: `Bearer ${token}`,
        ...config.headers,
      },
      ...config,
    };

    if (data) {
      if (method === "GET") {
        requestConfig.params = data;
      } else {
        requestConfig.data = data;
      }
    }

    const response = await axios(requestConfig);
    return response.data;
  } catch (error) {
    console.error(`Error in ${method} ${endpoint}:`, error);
    throw error;
  }
}

// Fetch user layouts
export async function fetchUserLayouts(params = {}) {
  return makeRequest("GET", "/layout", {
    embed: "regions,playlists,widgets",
    ...params,
  });
}

// Fetch specific layout details
export async function getLayoutDetails(layoutId) {
  const layouts = await makeRequest("GET", "/layout", {
    layoutId,
    embed: "regions,playlists,widgets",
  });
  return layouts[0];
}

// Fetch user playlists
export async function fetchUserPlaylists(params = {}) {
  return makeRequest("GET", "/playlist", {
    embed: "widgets,tags",
    ...params,
  });
}

// Fetch library media
export async function fetchLibraryMedia(params = {}) {
  return makeRequest("GET", "/library", params);
}

// Upload media to library
export async function uploadMedia(file, params = {}) {
  const formData = new FormData();
  formData.append("files", file);

  Object.keys(params).forEach((key) => {
    formData.append(key, params[key]);
  });

  return makeRequest("POST", "/library", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

// Assign media to playlist
export async function assignMediaToPlaylist(
  playlistId,
  mediaIds,
  options = {}
) {
  const formData = new FormData();
  mediaIds.forEach((id) => formData.append("media[]", id));

  if (options.duration) formData.append("duration", options.duration);
  if (options.displayOrder)
    formData.append("displayOrder", options.displayOrder);

  return makeRequest(
    "POST",
    `/playlist/library/assign/${playlistId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
}

// Checkout layout (create draft)
export async function checkoutLayout(layoutId) {
  return makeRequest("PUT", `/layout/checkout/${layoutId}`);
}

// Publish layout
export async function publishLayout(layoutId) {
  return makeRequest("PUT", `/layout/publish/${layoutId}`);
}

// Discard layout draft
export async function discardLayout(layoutId) {
  return makeRequest("PUT", `/layout/discard/${layoutId}`);
}

// Delete widget from playlist
export async function deleteWidget(widgetId) {
  return makeRequest("DELETE", `/playlist/widget/${widgetId}`);
}

// Edit widget
export async function editWidget(widgetId, params) {
  const formData = new FormData();
  Object.keys(params).forEach((key) => {
    formData.append(key, params[key]);
  });

  return makeRequest("PUT", `/playlist/widget/${widgetId}`, formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
}
