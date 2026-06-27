import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/authApi";
import axios from "axios";

function Register() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit() {
    
    if(!userData.name.trim()){
        setError('Name is Required!')
        return
    }

    if(!userData.email.trim()){
        setError('Email is Required!')
        return
    }

    if(!userData.email.includes('@')){
        setError('Please enter a valid email!')
        return
    }

    if(!userData.phone.trim()){
        setError('Phone number is Required')
        return
    }

    if(userData.phone.length != 10){
        setError('Please enter a valid phone number!')
        return
    }

    if(userData.password.length < 6){
        setError('Password must be at least 6 characters!')
        return
    }

    if(!userData.role) {
        setError('Please select Patient or Doctor!')
        return
    }


    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await registerUser({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        phone: Number(userData.phone),
        role: userData.role as "PATIENT" | "DOCTOR",
      });

      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error: unknown) {
        if(axios.isAxiosError(error)){
            const backendMessage = error.response?.data
            setError(backendMessage || 'Registration failed! Please try again.')
        }else{
            setError('Registration failed! Please try again.')
        }
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
          Join MediConnect today! Whether you're a patient looking for the right
          doctor or a healthcare professional managing appointments — we've got
          you covered.
        </p>
      </div>

      {/*Right Side - Branding */}
      <div className="w-1/2 flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Create Account
          </h2>
          <p className="text-gray-500 mb-8">Join MediConnect for free!</p>

          {/** Error Message */}
          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/** Success Message */}
          {success && (
            <div className="bg-green-100 text-green-600 p-3 rounded-lg mb-4">
              {success}
            </div>
          )}

          {/** Name field */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              {" "}
              Full Name
            </label>
            <input
              type="text"
              value={userData.name}
              onChange={(e) =>
                setUserData({ ...userData, name: e.target.value })
              }
              placeholder="Enter your Full name"
              autoComplete="off"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/** Email Field */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={userData.email}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
              placeholder="Enter your email"
              autoComplete="off"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/** Phone Field */}
          <div className="mb-6">
            <label className="bold text-gray-700 font-medium mb-2">
              Phone Number
            </label>
            <input
              type="number"
              value={userData.phone}
              onChange={(e) =>
                setUserData({ ...userData, phone: e.target.value })
              }
              autoComplete="off"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
            />
          </div>
          {/** Password Field */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={userData.password}
                onChange={(e) =>
                  setUserData({ ...userData, password: e.target.value })
                }
                placeholder="Enter your password"
                autoComplete="new-password"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 pr-10"
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

          {/** Role Selection */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              I am a...
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setUserData({ ...userData, role: "PATIENT" })}
                className={`flex-1 py-3 rounded-lg border-2 font-semibold transition-colors
                ${
                  userData.role === "PATIENT"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                }`}
              >
                🤒 Patient
              </button>
              <button
                type="button"
                onClick={() => setUserData({ ...userData, role: "PATIENT" })}
                className={`flex-1 py-3 rounded-lg border-2 font-semibold transition-colors
                ${
                  userData.role === "DOCTOR"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                }`}
              >
                👨‍⚕️ Doctor
              </button>
            </div>
          </div>
          {/** Register Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mt-4"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          {/** Login link */}
          <p className="text-center text-gray-500 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
