import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { authAPI } from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [loginRole, setLoginRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await authAPI.login({
        ...formData,
        role: loginRole
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name);

      navigate(res.data.role === "admin" ? "/admin/dashboard" : "/user/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Navbar />

      {/* ================= LOGIN SECTION ================= */}
      <section className="relative flex items-center justify-center w-full min-h-screen px-6 pt-24 bg-fixed bg-center bg-cover"
        style={{ backgroundImage: "url('/images/Login.webp')" }}>
        {/* OVERLAY FOR CONTRAST */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/50 to-transparent"></div>

        <div className="relative z-10 w-full max-w-md p-10 border shadow-2xl rounded-3xl bg-white/95 backdrop-blur-xl border-white/20">
          {/* HEADER */}
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-4xl font-black text-gray-900">Welcome Back</h2>
            <p className="text-gray-600">Login to your ReportIT account</p>
          </div>

          {/* ROLE SELECTOR */}
          <div className="flex justify-center gap-4 mb-8">
            {["user", "admin"].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setLoginRole(role)}
                className={`px-6 py-2 rounded-full font-bold capitalize transition-all ${loginRole === role
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                {role}
              </button>
            ))}
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="p-4 mb-6 border border-red-200 rounded-lg bg-red-50">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* PHONE INPUT */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-900">
                Phone Number
              </label>
              <input
                name="phone"
                value={formData.phone}
                placeholder="Enter your phone number"
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90"
              />
            </div>

            {/* PASSWORD INPUT */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-900">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
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
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-sm text-gray-500">or</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* LINKS */}
          <div className="space-y-3">
            <p className="text-sm text-center text-gray-700">
              New here?{" "}
              <Link to="/register" className="font-bold text-blue-600 hover:text-blue-700">
                Register now
              </Link>
            </p>

            <p className="text-sm text-center text-gray-700">
              Forgot password?{" "}
              <Link to="/forgot-password" className="font-bold text-blue-600 hover:text-blue-700">
                Request reset
              </Link>
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default Login;
