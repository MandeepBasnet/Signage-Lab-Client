const API_URL = import.meta.env.VITE_XIBO_API_URL;
const CLIENT_ID = import.meta.env.VITE_XIBO_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_XIBO_CLIENT_SECRET;

export async function getApiToken() {
  const params = new URLSearchParams();
  params.append("client_id", CLIENT_ID);
  params.append("client_secret", CLIENT_SECRET);
  params.append("grant_type", "client_credentials");

  const response = await fetch(`${API_URL}/authorize/access_token`, {
    method: "POST",
    body: params,
  });

  if (!response.ok) {
    throw new Error("Failed to obtain API token");
  }

  const data = await response.json();
  return data.access_token;
}
