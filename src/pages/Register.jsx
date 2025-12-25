import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { authAPI } from "../services/api";

function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    locality: "",
    society: "",
    houseNumber: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        setLoading(false);
        return;
      }

      await authAPI.register(formData);
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Navbar />

      {/* ================= REGISTER SECTION ================= */}
      <section className="relative flex items-center justify-center w-full min-h-screen px-6 pt-24 bg-fixed bg-center bg-cover"
        style={{ backgroundImage: "url('/images/Login.webp')" }}>
        {/* OVERLAY FOR CONTRAST */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/50 to-transparent"></div>

        <div className="relative z-10 w-full max-w-2xl p-10 rounded-3xl shadow-2xl bg-white/95 backdrop-blur-xl border border-white/20">
          {/* HEADER */}
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-4xl font-black text-gray-900">Join Our Community</h2>
            <p className="text-gray-600">Create your ReportIT account today</p>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* NAME INPUT */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-900">
                Full Name
              </label>
              <input
                name="name"
                placeholder="Enter your full name"
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90"
              />
            </div>

            {/* PHONE & LOCALITY - SIDE BY SIDE */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-900">
                  Phone Number
                </label>
                <input
                  name="phone"
                  placeholder="Enter your phone number"
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-900">
                  Locality
                </label>
                <input
                  name="locality"
                  placeholder="Enter your locality"
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90"
                />
              </div>
            </div>

            {/* SOCIETY & HOUSE NUMBER - SIDE BY SIDE */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-900">
                  Society Name
                </label>
                <input
                  name="society"
                  placeholder="Enter your society name"
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-900">
                  House Number
                </label>
                <input
                  name="houseNumber"
                  placeholder="Enter your house number"
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90"
                />
              </div>
            </div>

            {/* PASSWORD INPUT */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-900">
                Password (Min. 6 characters)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
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

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 font-bold text-white transition-all duration-300 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
            >
              {loading ? "Registering..." : "Create Account"}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-sm text-gray-500">or</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* LOGIN LINK */}
          <p className="text-sm text-center text-gray-700">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700">
              Login here
            </Link>
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default Register;
