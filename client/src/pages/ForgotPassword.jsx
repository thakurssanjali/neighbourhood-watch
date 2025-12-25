import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import Navbar from "../components/Navbar";
import axios from "axios";

// API URL Configuration
const API_BASE_URL = import.meta.env.PROD
  ? "https://neighbourhood-watch-api.onrender.com/api"  // Production: Render backend
  : import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : "http://localhost:5000/api"; // Development: localhostfunction ForgotPassword() {
const navigate = useNavigate();
const [showPassword, setShowPassword] = useState(false);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [success, setSuccess] = useState(false);
const [formData, setFormData] = useState({
  phone: "",
  newPassword: "",
  reason: ""
});

const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
  setError("");
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  // Validate password
  if (formData.newPassword.length < 6) {
    setError("Password must be at least 6 characters");
    setLoading(false);
    return;
  }

  try {
    await axios.post(`${API_BASE_URL}/password/forgot-password`, {
      phone: formData.phone,
      newPassword: formData.newPassword,
      reason: formData.reason || "User requested password reset"
    });

    setSuccess(true);
    setFormData({ phone: "", newPassword: "", reason: "" });
    setTimeout(() => {
      navigate("/login");
    }, 3000);
  } catch (err) {
    setError(err.response?.data?.message || "Failed to submit request");
  } finally {
    setLoading(false);
  }
};

return (
  <>
    <Navbar />
    <section className="relative flex items-center justify-center w-full min-h-screen px-6 pt-24 bg-center bg-cover bg-fixed"
      style={{ backgroundImage: "url('/images/Login.webp')" }}>
      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-transparent"></div>

      {/* FORM CARD */}
      <div className="relative z-10 w-full max-w-md p-10 shadow-2xl bg-white/95 backdrop-blur-xl rounded-3xl border border-white/20">
        <h2 className="mb-2 text-3xl font-bold text-center text-gray-900">Reset Password</h2>
        <p className="mb-6 text-sm text-center text-gray-700">
          Provide a new password. Admin will review and approve your request.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 rounded-lg">
            <p className="text-sm text-red-800 text-center">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 rounded-lg">
            <p className="text-sm text-green-800 text-center">
              ✅ Request submitted! Redirecting to login in 3 seconds...
            </p>
          </div>
        )}

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-900">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-900">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  placeholder="Enter new password (min 6 characters)"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute text-gray-500 -translate-y-1/2 right-4 top-1/2 hover:text-gray-700"
                >
                  {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-900">
                Reason (Optional)
              </label>
              <textarea
                name="reason"
                placeholder="Why do you need to reset your password?"
                value={formData.reason}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 font-semibold text-white transition-all duration-300 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        ) : null}

        <p className="mt-6 text-sm text-center text-gray-700">
          Remember your password?{" "}
          <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
            Back to login
          </Link>
        </p>
      </div>
    </section>
  </>
);
}

export default ForgotPassword;
