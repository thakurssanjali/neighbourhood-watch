import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";


 const checkPasswordStrength = (password) => {
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password)
  };
};


function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [passwordRules, setPasswordRules] = useState(
  checkPasswordStrength("")
);
const [password, setPassword] = useState("");
const [passwordStrength, setPasswordStrength] = useState(0);
const [showPasswordHints, setShowPasswordHints] = useState(false);
const [showTooltip, setShowTooltip] = useState(false);

const [rules, setRules] = useState({
  length: false,
  uppercase: false,
  number: false,
  special: false
});



  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    locality: "",
    society: "",
    houseNumber: "",
    password: ""
  });

  const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData({ ...formData, [name]: value });

  if (name === "password") {
    setPasswordRules(checkPasswordStrength(value));
  }
};

  const checkPassword = (value) => {
  const newRules = {
    length: value.length >= 8,
    uppercase: /[A-Z]/.test(value),
    number: /[0-9]/.test(value),
    special: /[!@#$%^&*]/.test(value)
  };

  setRules(newRules);

  const strength = Object.values(newRules).filter(Boolean).length;
  setPasswordStrength(strength);
};



 const handleSubmit = async (e) => {
  e.preventDefault();

  if (passwordStrength < 4) {
    alert("Please use a stronger password");
    return;
  }
  const cleanedPhone = formData.phone.replace(" ", "");

if (cleanedPhone.length !== 10) {
  setPhoneError("Please enter a valid 10-digit phone number");
  return;
}

  try {
    await axios.post(
      "http://localhost:5000/api/auth/register",
      formData
    );

    alert("Registration successful. Please login.");
    navigate("/login");
  } catch {
    alert("Registration failed");
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-yellow-50 to-orange-100">

      {/* ================= NAVBAR ================= */}
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

      {/* ================= HERO / REGISTER ================= */}
      <section
        className="min-h-screen flex items-center justify-center px-6 pt-32
        bg-cover bg-center relative"
        style={{ backgroundImage: "url('/images/hero.jpg')" }}
      >
        <div
          className="w-full max-w-lg
          bg-white/70 backdrop-blur-md
          rounded-3xl shadow-xl p-10
          transform transition-all duration-300
          hover:scale-105 hover:shadow-2xl"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">
            Create Your ReportIT Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-full
              border border-gray-300
              focus:outline-none focus:ring-2 focus:ring-black"
            />

            <div className="relative">
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              inputMode="numeric"
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, "");

                if (value.length > 10) return;

                if (value.length > 5) {
                  value = value.slice(0, 5) + " " + value.slice(5);
                }

                setFormData({ ...formData, phone: value });

                if (value.replace(" ", "").length < 10) {
                  setPhoneError("Phone number must be 10 digits");
                } else {
                  setPhoneError("");
                }
              }}
              className="w-full px-4 py-3 rounded-full
              border border-gray-300
              focus:outline-none focus:ring-2 focus:ring-black pr-12"
            />

            {/* ✅ GREEN CHECK ICON */}
            {formData.phone.replace(" ", "").length === 10 && !phoneError && (
              <CheckCircleIcon
                className="w-6 h-6 text-green-500
                absolute right-4 top-1/2 -translate-y-1/2"
              />
            )}
          </div>

        {phoneError && (
              <p className="text-sm text-red-600 mt-2 ml-2">
                {phoneError}
              </p>
            )}








            <input
              name="locality"
              placeholder="Locality"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-full
              border border-gray-300
              focus:outline-none focus:ring-2 focus:ring-black"
            />

            <input
              name="society"
              placeholder="Society"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-full
              border border-gray-300
              focus:outline-none focus:ring-2 focus:ring-black"
            />

            <input
              name="houseNumber"
              placeholder="House Number"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-full
              border border-gray-300
              focus:outline-none focus:ring-2 focus:ring-black"
            />

            
{/* PASSWORD FIELD */}
            <div className="relative">
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder="Password"
    value={password}
    onFocus={() => setShowPasswordHints(true)}
    onBlur={() => {
      if (!password) setShowPasswordHints(false);
    }}
    onChange={(e) => {
      setPassword(e.target.value);
      setFormData({ ...formData, password: e.target.value });
      checkPassword(e.target.value);
    }}
    required
    className="w-full px-4 py-3 rounded-full
    border border-gray-300
    focus:outline-none focus:ring-2 focus:ring-black pr-12"
  />

  {/* SHOW / HIDE ICON */}
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

  {/* 🔮 FLOATING PASSWORD TOOLTIP */}
  {showPasswordHints && (
    <PasswordTooltip
      passwordStrength={passwordStrength}
      rules={rules}
    />
  )}
</div>







             


            <button
              type="submit"
              className="w-full bg-black text-white
              py-3 rounded-full font-medium
              transition-all duration-300
              hover:bg-gray-900
              hover:shadow-[0_0_25px_rgba(0,0,0,0.4)]"
            >
              Register
            </button>
          </form>

          {/* LOGIN LINK */}
          <p className="text-sm text-center text-gray-700 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold underline hover:text-black"
            >
              Login
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}

function Rule({ label, valid }) {
  return (
    <div
      className={`flex items-center gap-2 transition-all duration-300
      ${valid ? "text-green-600" : "text-gray-500"}`}
    >
      <span className="text-lg">
        {valid ? "✔" : "✖"}
      </span>
      <span>{label}</span>
    </div>
  );
}


function PasswordTooltip({ passwordStrength, rules }) {
  return (
    <div
      className="absolute left-1/2 -translate-x-1/2
      top-full mt-3 w-[280px]
      bg-white/90 backdrop-blur-xl
      rounded-2xl shadow-2xl
      p-4 z-50 animate-tooltip"
    >
      {/* ARROW */}
      <div
        className="absolute -top-2 left-1/2 -translate-x-1/2
        w-4 h-4 bg-white/90 rotate-45"
      />

      {/* STRENGTH BAR */}
      <div>
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300
              ${
                passwordStrength <= 1
                  ? "bg-red-500 w-1/4"
                  : passwordStrength === 2
                  ? "bg-yellow-500 w-2/4"
                  : passwordStrength === 3
                  ? "bg-blue-500 w-3/4"
                  : "bg-green-500 w-full"
              }`}
          />
        </div>

        <p className="text-xs mt-1 text-gray-700">
          Strength:{" "}
          <span className="font-semibold">
            {passwordStrength <= 1
              ? "Weak"
              : passwordStrength === 2
              ? "Medium"
              : passwordStrength === 3
              ? "Good"
              : "Strong"}
          </span>
        </p>
      </div>

      {/* RULES */}
      <div className="mt-3 space-y-1 text-sm text-gray-700">
        <Rule label="At least 8 characters" valid={rules.length} />
        <Rule label="One uppercase letter" valid={rules.uppercase} />
        <Rule label="One number" valid={rules.number} />
        <Rule label="One special character" valid={rules.special} />
      </div>
    </div>
  );
}



export default Register;
