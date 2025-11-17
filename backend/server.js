import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const XIBO_BASE_URL = process.env.VITE_XIBO_API_URL.replace("/api", ""); // Get base URL without /api
const XIBO_API_URL = process.env.VITE_XIBO_API_URL;
const XIBO_CLIENT_ID = process.env.VITE_XIBO_CLIENT_ID;
const XIBO_CLIENT_SECRET = process.env.VITE_XIBO_CLIENT_SECRET;

// Create axios instance with cookie jar for session management
const xiboClient = axios.create({
  withCredentials: true,
  jar: true,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Login endpoint - authenticates with Xibo CMS using session-based auth
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    // Step 1: GET /login to get the CSRF token and session
    let sessionCookie = null;
    let csrfToken = null;

    try {
      const loginPageResponse = await axios.get(`${XIBO_BASE_URL}/login`, {
        withCredentials: true,
      });

      // Extract CSRF token from HTML
      const csrfMatch = loginPageResponse.data.match(
        /name="_token"\s+value="([^"]+)"/
      );
      csrfToken = csrfMatch ? csrfMatch[1] : null;

      // Extract session cookie
      const setCookieHeaders = loginPageResponse.headers["set-cookie"];
      if (setCookieHeaders) {
        const phpSessionCookie = setCookieHeaders.find((c) =>
          c.includes("PHPSESSID")
        );
        if (phpSessionCookie) {
          sessionCookie = phpSessionCookie.split(";")[0];
        }
      }
    } catch (err) {
      console.error("Failed to get login page:", err.message);
      return res.status(500).json({
        message: "Failed to retrieve login form",
        error: err.message,
      });
    }

    if (!csrfToken || !sessionCookie) {
      console.error("CSRF token or session cookie not found");
      return res.status(500).json({
        message: "CSRF validation failed - unable to get session",
      });
    }

    // Step 2: POST login with CSRF token
    let loginResponse;
    try {
      loginResponse = await axios.post(
        `${XIBO_BASE_URL}/login`,
        new URLSearchParams({
          _token: csrfToken,
          username: username,
          password: password,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Cookie: sessionCookie,
          },
          withCredentials: true,
          maxRedirects: 0,
          validateStatus: (status) => status < 500, // Accept redirects as success
        }
      );
    } catch (err) {
      console.error("Login POST failed:", err.response?.data || err.message);
      return res.status(401).json({
        message: "Invalid credentials",
        error: err.message,
      });
    }

    // Extract new session cookie from login response
    const loginCookies = loginResponse.headers["set-cookie"];
    const newSessionCookie = loginCookies
      ? loginCookies.find((c) => c.includes("PHPSESSID"))
      : null;

    const finalSessionCookie = newSessionCookie || sessionCookie;

    // Step 3: Get user info using the session cookie
    let userInfo;
    try {
      const userResponse = await axios.get(`${XIBO_API_URL}/user/me`, {
        headers: {
          Cookie: finalSessionCookie,
        },
        withCredentials: true,
      });
      userInfo = userResponse.data;
    } catch (err) {
      console.warn("Could not fetch user info from API:", err.message);
      userInfo = { userId: null, userName: username };
    }

    res.json({
      access_token: null,
      sessionCookie: finalSessionCookie.split(";")[0],
      user: userInfo,
      expires_in: null,
    });
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);

    const status = error.response?.status || 500;
    const message =
      error.response?.data?.message || error.message || "Authentication failed";

    res.status(status).json({
      message,
      error: error.message,
    });
  }
});

// Get API token endpoint - client credentials flow
app.post("/api/auth/token", async (req, res) => {
  try {
    const params = new URLSearchParams();
    params.append("client_id", XIBO_CLIENT_ID);
    params.append("client_secret", XIBO_CLIENT_SECRET);
    params.append("grant_type", "client_credentials");

    const response = await axios.post(
      `${XIBO_API_URL}/authorize/access_token`,
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    res.json({
      access_token: response.data.access_token,
      expires_in: response.data.expires_in,
    });
  } catch (error) {
    console.error("Token error:", error.response?.data || error.message);

    const status = error.response?.status || 500;
    const message =
      error.response?.data?.error_description || "Failed to obtain token";

    res.status(status).json({
      message,
      error: error.message,
    });
  }
});

// Get user info endpoint
app.get("/api/auth/user", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        message: "No authorization token provided",
      });
    }

    const response = await axios.get(`${XIBO_API_URL}/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("User info error:", error.response?.data || error.message);

    const status = error.response?.status || 500;
    const message =
      error.response?.data?.message || "Failed to fetch user info";

    res.status(status).json({
      message,
      error: error.message,
    });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`✅ Backend server running on http://localhost:${PORT}`);
  console.log(`📡 Xibo API: ${XIBO_API_URL}`);
});
