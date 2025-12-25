import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import axios from "axios";

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
      const res = await axios.post("http://localhost:5000/api/auth/login", {
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
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-yellow-50 to-orange-100">
      <nav className="absolute top-0 left-0 z-20 w-full pt-6">
        <div className="flex justify-center">
          <Link to="/">
            <img src="/images/logo.png" alt="Logo" className="w-auto cursor-pointer h-14 drop-shadow-md" />
          </Link>
        </div>
      </nav>

      <section className="relative flex items-center justify-center min-h-screen px-6 pt-32 bg-center bg-cover"
        style={{ backgroundImage: "url('/images/Login.webp')" }}>
        <div className="w-full max-w-md p-10 shadow-xl bg-white/70 backdrop-blur-md rounded-3xl">
          <h2 className="mb-6 text-3xl font-bold text-center">Login</h2>

          <div className="flex justify-center gap-4 mb-6">
            {["user", "admin"].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setLoginRole(role)}
                className={`px-4 py-2 rounded-full capitalize ${
                  loginRole === role ? "bg-black text-white" : "bg-gray-200"
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          {error && <p className="mb-4 text-sm text-center text-red-500">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              name="phone"
              placeholder="Phone number"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                onChange={handleChange}
                required
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute text-gray-500 -translate-y-1/2 right-4 top-1/2 hover:text-black"
              >
                {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 font-medium text-white transition-all duration-300 bg-black rounded-full hover:bg-gray-900 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-gray-700">
            New here?{" "}
            <Link to="/register" className="font-semibold underline hover:text-black">
              Register now
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}

export default Login;
