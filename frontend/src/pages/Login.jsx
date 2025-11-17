"use client";

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearAuth, saveAuth } from "../utils/auth.js";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000/api";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const loginBody = useMemo(
    () => ({
      username: username.trim(),
      password,
    }),
    [username, password]
  );

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!loginBody.username) {
      setError("Please enter your username or email.");
      return;
    }

    if (!loginBody.password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      clearAuth();

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginBody),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message =
          data?.message ||
          (response.status === 401
            ? "Invalid username or password."
            : "Unable to login. Please try again.");
        throw new Error(message);
      }

      if (!data?.token) {
        throw new Error("Login succeeded but no token was returned.");
      }

      saveAuth(data.token, data.user ?? null);

      if (!rememberMe) {
        window.addEventListener(
          "beforeunload",
          () => {
            clearAuth();
          },
          { once: true }
        );
      }

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center py-10 px-6 font-[Inter,system-ui,-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif]">
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]">
          <div className="flex flex-col items-center gap-4 bg-white p-10 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-900 rounded-full animate-spin"></div>
            <p className="text-base text-[#1a1a1a] font-medium">
              Just a moment, logging you in...
            </p>
          </div>
        </div>
      )}

      <div className="max-w-6xl w-full flex flex-col md:flex-row items-start gap-10 md:gap-16">
        {/* Left column */}
        <div className="flex flex-col gap-12 flex-1 md:flex-[0_0_48%]">
          <img src="/logo.png" alt="SigmaDS Logo" className="h-10 w-auto" />

          <form
            onSubmit={handleLogin}
            className="bg-white border border-gray-100 rounded-2xl shadow-[0_20px_60px_rgba(15,23,42,0.07)] px-8 py-10 flex flex-col gap-6"
          >
            <div>
              <h1 className="text-3xl font-semibold text-[#171717]">
                Login to your Account
              </h1>
              <p className="text-base text-gray-500 mt-2">
                Please enter your details to login
              </p>
            </div>

            {/* Username */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="username"
                className="text-sm font-medium text-[#1a1a1a]"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) setError("");
                }}
                className={`p-3 border rounded-lg text-sm transition-all duration-200 bg-white focus:outline-none focus:border-blue-700 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.12)] ${
                  error ? "border-red-600 bg-red-50" : "border-gray-200"
                }`}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-[#1a1a1a]"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 pr-12 border border-gray-200 rounded-lg text-sm transition-all duration-200 bg-white focus:outline-none focus:border-blue-700 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.12)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-lg text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? "👁️" : "👁️"}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded-lg">
                <span>⚠️</span>
                {error}
              </div>
            )}

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-sm text-[#1a1a1a]">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-blue-800"
                />
                Remember Me
              </label>
              <a
                href="#"
                className="text-blue-900 font-medium hover:text-blue-700 transition-colors"
              >
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#0055D4] to-[#112B8C] text-white font-semibold text-base py-3 shadow-[0_12px_32px_rgba(0,79,204,0.35)] transition-all hover:shadow-[0_16px_40px_rgba(0,79,204,0.4)] active:translate-y-px disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>

        {/* Right column */}
        <div className="flex-1 w-full flex flex-col items-center gap-10">
          <img src="/logo.png" alt="SigmaDS Logo" className="h-12 w-auto" />

          <img
            src="/coverImage.png"
            alt="Screens showcase"
            className="w-full max-w-2xl rounded-2xl object-contain"
          />

          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">
              Trusted by 1000+ customers globally
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-8 grayscale opacity-80">
              {[
                "amazon",
                "deca",
                "bosch",
                "uni",
                "para",
                "etisalat",
                "uber",
                "benz",
                "tt",
                "ap",
              ].map((brand) => (
                <img
                  key={brand}
                  src={`https://d2qf6k8jfqd09k.cloudfront.net/login/${brand}.svg`}
                  alt={brand}
                  className="h-8 w-auto"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
