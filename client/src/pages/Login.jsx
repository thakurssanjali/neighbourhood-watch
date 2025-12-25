import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

function Login() {
  const navigate = useNavigate();

  const [loginType, setLoginType] = useState("user"); // user | admin
  const [loginRole, setLoginRole] = useState("user"); // user | admin
  const [showPassword, setShowPassword] = useState(false);



  const [formData, setFormData] = useState({
    phone: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      "http://localhost:5000/api/auth/login",
      {
        phone: formData.phone,
        password: formData.password,
        role: loginRole   // ✅ SEND TO BACKEND
      }
    );

   localStorage.setItem("token", res.data.token);
localStorage.setItem("role", res.data.role);
localStorage.setItem("name", res.data.name); // ✅ IMPORTANT


    if (res.data.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/user/dashboard");
    }

  } catch (err) {
    alert(err.response?.data?.message || "Login failed");
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-yellow-50 to-orange-100">

      {/* NAVBAR */}
      <nav className="absolute top-0 left-0 w-full pt-6 z-20">
        <div className="flex justify-center">
          <Link to="/">
            <img
              src="/images/logo.png"
              alt="ReportIt Logo"
              className="h-14 w-auto drop-shadow-md cursor-pointer"
            />
          </Link>
        </div>
      </nav>

      {/* LOGIN CARD */}
      <section
        className="min-h-screen flex items-center justify-center px-6 pt-32
        bg-cover bg-center relative"
        style={{ backgroundImage: "url('/images/Login.jpg')" }}
      >
        <div
          className="w-full max-w-md
          bg-white/70 backdrop-blur-md
          rounded-3xl shadow-xl p-10"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">
            Login to ReportIT
          </h2>

          {/* ROLE TOGGLE */}
    <div className="flex justify-center gap-4 mb-4">
  <button
    type="button"
    onClick={() => setLoginRole("user")}
    className={`px-4 py-2 rounded-full ${
      loginRole === "user" ? "bg-black text-white" : "bg-gray-200"
    }`}
  >
    User
  </button>

  <button
    type="button"
    onClick={() => setLoginRole("admin")}
    className={`px-4 py-2 rounded-full ${
      loginRole === "admin" ? "bg-black text-white" : "bg-gray-200"
    }`}
  >
    Admin
  </button>
</div>


          <form onSubmit={handleSubmit} className="space-y-5">

            <input
              name="phone"
              placeholder="Phone number"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-full
              border border-gray-300
              focus:outline-none focus:ring-2 focus:ring-black"
            />

            {/* PASSWORD FIELD WITH EYE */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-full
                border border-gray-300
                focus:outline-none focus:ring-2 focus:ring-black pr-12"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2
                text-gray-500 hover:text-black"
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white
              py-3 rounded-full font-medium
              transition-all duration-300
              hover:bg-gray-900
              hover:shadow-[0_0_25px_rgba(0,0,0,0.4)]"
            >
              Login {loginType === "admin" ? "Admin" : "User"}
            </button>

            <p className="text-sm text-center mt-4">
  <Link
    to="/forgot-password"
    className="text-gray-700 hover:underline font-medium"
  >
    Forgot Password?
  </Link>
  
</p>

          </form>

          <p className="text-sm text-center text-gray-700 mt-6">
            New here?{" "}
            <Link
              to="/register"
              className="font-semibold underline hover:text-black"
            >
              Register now
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}

export default Login;
