import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import axios from "axios";

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

      await axios.post("http://localhost:5000/api/auth/register", formData);
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-yellow-50 to-orange-100">
      <nav className="absolute top-0 left-0 w-full pt-6 z-20">
        <div className="flex justify-center">
          <Link to="/">
            <img src="/images/logo.png" alt="Logo" className="h-14 w-auto drop-shadow-md cursor-pointer" />
          </Link>
        </div>
      </nav>

      <section className="min-h-screen flex items-center justify-center px-6 pt-32 bg-cover bg-center relative"
        style={{ backgroundImage: "url('/images/Register.webp')" }}>
        <div className="w-full max-w-md bg-white/70 backdrop-blur-md rounded-3xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-6 text-center">Join Our Community</h2>

          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="name" placeholder="Full Name" onChange={handleChange} required
              className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black" />

            <input name="phone" placeholder="Phone Number" onChange={handleChange} required
              className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black" />

            <input name="locality" placeholder="Locality" onChange={handleChange} required
              className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black" />

            <input name="society" placeholder="Society Name" onChange={handleChange} required
              className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black" />

            <input name="houseNumber" placeholder="House Number" onChange={handleChange} required
              className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black" />

            <div className="relative">
              <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" onChange={handleChange} required
                className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black pr-12" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black">
                {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-black text-white py-3 rounded-full font-medium transition-all duration-300 hover:bg-gray-900 disabled:opacity-50">
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="text-sm text-center text-gray-700 mt-6">
            Already have an account? <Link to="/login" className="font-semibold underline hover:text-black">Login here</Link>
          </p>
        </div>
      </section>
    </div>
  );
}

export default Register;
