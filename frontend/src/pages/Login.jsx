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
    <div className="min-h-screen w-full flex items-stretch justify-center bg-white">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-4 bg-white p-10 rounded-lg shadow-2xl">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-900 rounded-full animate-spin"></div>
            <p className="text-base text-gray-900 font-medium">
              Just a moment, logging you in...
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-1 min-h-screen w-full bg-white flex-col md:flex-row">
        {/* Left Section - Form */}
        <div className="flex-1 md:w-5/12 flex items-center justify-center bg-white px-6 py-12 md:px-12 md:py-20 order-2 md:order-1">
          <div className="w-full max-w-sm">
            <img
              src="/logo.png"
              alt="SigmaDS Logo"
              className="h-10 md:h-12 mb-8 md:mb-12 object-contain"
            />

            <div className="mt-4">
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
                Login to your Account
              </h1>
              <p className="text-sm md:text-base text-gray-600 mb-8">
                Please enter your details to login
              </p>

              <form
                onSubmit={handleLogin}
                className="flex flex-col gap-4 md:gap-5"
              >
                {/* Username Field */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="username"
                    className="text-sm font-medium text-gray-900"
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
                    className={`px-3 py-2 border rounded-md text-sm transition-all duration-200 bg-white focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 ${
                      error
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  />
                  {error && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <span>⚠️</span>
                      {error}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-900"
                  >
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="flex-1 px-3 py-2 pr-10 border border-gray-300 rounded-md text-sm transition-all duration-200 bg-white hover:border-gray-400 focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 bg-transparent border-0 cursor-pointer text-lg text-gray-400 hover:text-gray-600 transition-colors duration-200 p-0"
                    >
                      {showPassword ? "👁️" : "👁️"}
                    </button>
                  </div>
                </div>

                {/* Checkbox and Link */}
                <div className="flex justify-between items-center mt-2 flex-wrap gap-2">
                  <label className="flex items-center gap-2 text-sm cursor-pointer text-gray-900">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 cursor-pointer accent-blue-700"
                    />
                    <span>Remember Me</span>
                  </label>
                  <a
                    href="#"
                    className="text-sm text-blue-700 hover:text-blue-600 transition-colors duration-200"
                  >
                    Forgot Password?
                  </a>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-gradient-to-r from-blue-700 to-blue-900 text-white border-0 rounded-md text-sm font-semibold cursor-pointer transition-all duration-200 mt-6 shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-800 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600 disabled:shadow-none"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right Section - Promotional */}
        <div className="flex-1 md:w-7/12 bg-white flex flex-col items-center justify-center p-6 md:p-12 min-h-80 md:min-h-screen order-1 md:order-2">
          {/* Content */}
          <div className="flex flex-col items-center justify-center gap-6 w-full">
            {/* Logo */}
            <img
              src="/logo.png"
              alt="SigmaDS Logo"
              className="w-32 md:w-40 h-auto"
            />

            {/* Screens/Cover Image */}
            <img
              src="/coverImage.png"
              alt="Screens"
              className="w-full max-w-md md:max-w-2xl h-auto"
            />

            {/* Trust Text */}
            <p className="text-sm md:text-base text-gray-600 font-medium text-center">
              Trusted by 1000+ customers globally
            </p>

            {/* Partner Container */}
            <div className="w-full max-w-3xl mt-4">
              {/* First Partner Row */}
              <div className="flex items-center justify-center gap-3 md:gap-6 flex-wrap mb-4">
                <img
                  src="https://d2qf6k8jfqd09k.cloudfront.net/login/amazon.svg"
                  alt="Amazon"
                  className="h-6 md:h-8 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
                <img
                  src="https://d2qf6k8jfqd09k.cloudfront.net/login/deca.svg"
                  alt="Deca"
                  className="h-6 md:h-8 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
                <img
                  src="https://d2qf6k8jfqd09k.cloudfront.net/login/bosch.svg"
                  alt="Bosch"
                  className="h-6 md:h-8 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
                <img
                  src="https://d2qf6k8jfqd09k.cloudfront.net/login/uni.svg"
                  alt="Uni"
                  className="h-6 md:h-8 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
                <img
                  src="https://d2qf6k8jfqd09k.cloudfront.net/login/para.svg"
                  alt="Para"
                  className="h-6 md:h-8 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
              </div>

              {/* Second Partner Row */}
              <div className="flex items-center justify-center gap-3 md:gap-6 flex-wrap">
                <img
                  src="https://d2qf6k8jfqd09k.cloudfront.net/login/etisalat.svg"
                  alt="Etisalat"
                  className="h-6 md:h-8 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
                <img
                  src="https://d2qf6k8jfqd09k.cloudfront.net/login/uber.svg"
                  alt="Uber"
                  className="h-6 md:h-8 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
                <img
                  src="https://d2qf6k8jfqd09k.cloudfront.net/login/benz.svg"
                  alt="Benz"
                  className="h-6 md:h-8 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
                <img
                  src="https://d2qf6k8jfqd09k.cloudfront.net/login/tt.svg"
                  alt="TT"
                  className="h-6 md:h-8 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
                <img
                  src="https://d2qf6k8jfqd09k.cloudfront.net/login/ap.svg"
                  alt="AP"
                  className="h-6 md:h-8 w-auto opacity-60 hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
