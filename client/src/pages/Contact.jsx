import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

// API URL Configuration
const API_BASE_URL = import.meta.env.PROD
  ? "/api"  // Production: relative path on Vercel
  : import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : "http://localhost:5000/api"; // Development: localhost

function Contact() {
  const [message, setMessage] = useState("");
  const [popup, setPopup] = useState(null); // "login" | "success" | null

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setPopup("login");
      return;
    }

    if (!message.trim()) return;

    try {
      await axios.post(
        `${API_BASE_URL}/contact`,
        { message },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setPopup("success");
      setMessage("");
    } catch {
      alert("Failed to send message");
    }
  };

  return (
    <div
      className="relative min-h-screen bg-center bg-cover"
      style={{ backgroundImage: "url('/images/hero.webp')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/40"></div>

      <Navbar />

      {/* MAIN CONTAINER */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6 py-32">
        <div className="grid w-full max-w-6xl grid-cols-1 gap-12 lg:grid-cols-2">

          {/* ================= LEFT: CONTACT INFO ================= */}
          <div className="space-y-8">
            {/* HEADER */}
            <div>
              <h1 className="mb-4 text-5xl font-black leading-tight text-white lg:text-6xl drop-shadow-lg">
                Get in Touch
              </h1>
              <p className="text-xl text-gray-100 drop-shadow">
                Reach out to the administration for any queries or support
              </p>
            </div>

            {/* INFO CARDS */}
            <div className="space-y-4">
              {/* ADDRESS CARD */}
              <div className="p-6 transition-all shadow-lg bg-white/95 backdrop-blur-md rounded-2xl hover:shadow-xl">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">📍</span>
                  <div>
                    <p className="mb-1 text-sm font-semibold text-blue-600">
                      OFFICE ADDRESS
                    </p>
                    <p className="text-lg font-medium text-gray-900">
                      Green Valley Society, Block A<br />
                      Sector 22, New City
                    </p>
                  </div>
                </div>
              </div>

              {/* PHONE CARD */}
              <div className="p-6 transition-all shadow-lg bg-white/95 backdrop-blur-md rounded-2xl hover:shadow-xl">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">📞</span>
                  <div>
                    <p className="mb-1 text-sm font-semibold text-blue-600">
                      PHONE
                    </p>
                    <p className="text-lg font-medium text-gray-900">
                      +91 98765 43210
                    </p>
                  </div>
                </div>
              </div>

              {/* EMAIL CARD */}
              <div className="p-6 transition-all shadow-lg bg-white/95 backdrop-blur-md rounded-2xl hover:shadow-xl">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">✉️</span>
                  <div>
                    <p className="mb-1 text-sm font-semibold text-blue-600">
                      EMAIL
                    </p>
                    <p className="text-lg font-medium text-gray-900">
                      admin@reportit.community
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT: MESSAGE FORM ================= */}
          <div className="p-10 shadow-2xl bg-white/95 backdrop-blur-xl rounded-3xl">
            {/* HEADER */}
            <div className="mb-8">
              <h2 className="mb-2 text-3xl font-bold text-gray-900">
                Send a Message
              </h2>
              <p className="text-gray-600">
                Write directly to the administration. Messages are visible only to admins.
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-900">
                  Your Message *
                </label>
                <textarea
                  rows="7"
                  placeholder="Write your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 font-bold text-white transition-all duration-300 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg"
              >
                Send Message
              </button>
            </form>

            <p className="mt-6 text-xs text-center text-gray-500">
              All messages are securely transmitted and viewable only by admins.
            </p>
          </div>
        </div>
      </div>

      {/* ================= POPUPS ================= */}
      {popup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-sm p-8 text-center bg-white shadow-2xl rounded-2xl animate-fadeInUp">
            {popup === "login" ? (
              <>
                <div className="mb-4 text-5xl">🔐</div>
                <h3 className="mb-2 text-2xl font-bold text-gray-900">
                  Login Required
                </h3>
                <p className="mb-6 text-gray-600">
                  Please login to send a message to the administration.
                </p>
                <Link
                  to="/login"
                  className="inline-block px-6 py-2 font-semibold text-white transition-all rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  Go to Login
                </Link>
              </>
            ) : (
              <>
                <div className="mb-4 text-5xl">✅</div>
                <h3 className="mb-2 text-2xl font-bold text-gray-900">
                  Message Sent
                </h3>
                <p className="mb-6 text-gray-600">
                  Your message has been sent successfully to the administration.
                </p>
                <button
                  onClick={() => setPopup(null)}
                  className="px-6 py-2 font-semibold text-white transition-all rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  Done
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Contact;
