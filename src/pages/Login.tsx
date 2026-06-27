import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import type { AppDispatch } from "../store/store";
import { setCredentials } from "../store/authSlice";
import { loginUser } from "../api/authApi";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  async function handleSubmit() {
    setLoading(true);
    setError("");
    try {
      const response = await loginUser({ email, password });

      dispatch(
        setCredentials({
          token: response.token,
          name: response.name,
          role: response.role,
        }),
      );

      if (response.role === "PATIENT") {
        navigate("/patient/dashboard");
      } else if (response.role === "DOCTOR") {
        navigate("/doctor/dashboard");
      }
    } catch (error) {
      setError("Invalid Email and Password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="w-1/2 bg-blue-500 flex flex-col items-center justify-center p-12">
        <h1 className="text-5xl font-bold text-white mb-4">🏥 MediConnect</h1>
        <p className="text-blue-100 text-center text-lg">
          Connecting patient with the right doctors. Book appointments, manage
          prescriptions, and take control of your health journey.
        </p>
      </div>

      {/*Right Side - Branding */}
      <div className="w-1/2 flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Back!
          </h2>
          <p className="text-gray-500 mb-8">
            Login to your MediConnect Account
          </p>
          {/** Error Message */}
          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/** Email Field */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="off"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
            />
          </div>
          {/** Password Field */}
          <div className="md-6">
            <label className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="Enter your password"
                autoComplete="new-password"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 pr-10"
                style={
                  {
                    WebkitTextSecurity: showPassword ? "none" : undefined,
                  } as React.CSSProperties
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
          {/** Login Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mt-4"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/** Sign up link */}
          <p className="text-center text-gray-500 mt-6">
            New to MediConnect?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-semibold hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
