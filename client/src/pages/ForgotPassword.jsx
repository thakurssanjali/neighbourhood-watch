import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [role, setRole] = useState("user");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ THIS WAS MISSING — NOW FIXED
  const checkAccount = async () => {
    setError("");
    setSuccess("");

    if (!phone) {
      setError("Please enter phone number");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { phone, role }
      );

      setSuccess(res.data.message);
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black/20">
      <div className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl w-full max-w-md shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-6">
          Forgot Password
        </h2>

        {/* ROLE SELECT */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-full border"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        {/* PHONE INPUT */}
        <input
          type="text"
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-full border"
        />

        {/* BUTTON */}
        <button
          onClick={checkAccount}
          className="w-full bg-black text-white py-3 rounded-full"
        >
          Check Account
        </button>

        {/* ERROR */}
        {error && (
          <p className="text-red-600 text-sm text-center mt-4">
            {error}
          </p>
        )}

        {/* SUCCESS */}
        {success && (
          <p className="text-green-600 text-sm text-center mt-4">
            {success}
          </p>
        )}

        <div className="text-center mt-6">
          <Link to="/login" className="text-sm underline">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
