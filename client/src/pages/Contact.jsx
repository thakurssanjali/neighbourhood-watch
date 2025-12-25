import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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
        "http://localhost:5000/api/contact",
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
      className="min-h-screen bg-cover bg-center relative flex items-center justify-center px-6"
      style={{ backgroundImage: "url('/images/hero.webp')" }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      {/* MAIN CONTAINER */}
      <div className="relative z-10 max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* ================= LEFT: CONTACT INFO ================= */}
        <div
          className="bg-white/10 backdrop-blur-xl
          rounded-3xl shadow-2xl p-10 text-white"
        >
          <h1 className="text-5xl font-extrabold mb-6 drop-shadow-lg">
            Contact<br />Administration
          </h1>

          <p className="text-lg text-gray-200 mb-8 leading-relaxed">
            Reach out to your society administration for support,
            suggestions, emergency issues, or general queries.
          </p>

          <div className="space-y-6 text-gray-100">
            <div>
              <p className="text-sm uppercase tracking-widest text-gray-300">
                Office Address
              </p>
              <p className="text-lg font-medium">
                Green Valley Society, Block A<br />
                Sector 22, New City
              </p>
            </div>

            <div>
              <p className="text-sm uppercase tracking-widest text-gray-300">
                Phone
              </p>
              <p className="text-lg font-medium">
                +91 98765 43210
              </p>
            </div>

            <div>
              <p className="text-sm uppercase tracking-widest text-gray-300">
                Email
              </p>
              <p className="text-lg font-medium">
                admin@reportit.community
              </p>
            </div>

            <div className="pt-6">
              <Link
                to="/"
                className="inline-flex items-center gap-2
                text-sm text-gray-200 hover:text-white transition"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>

        {/* ================= RIGHT: MESSAGE FORM ================= */}
        <div
          className="bg-white/70 backdrop-blur-xl
          rounded-3xl shadow-2xl p-10"
        >
          <h2 className="text-3xl font-bold mb-4">
            Send a Message
          </h2>

          <p className="text-gray-700 mb-6">
            Write directly to the society administration.
            Messages are visible only to admins.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <textarea
              rows="6"
              placeholder="Write your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-4 rounded-2xl border
              bg-white/90
              focus:outline-none focus:ring-2 focus:ring-black"
            />

            <button
              type="submit"
              className="w-full bg-black text-white
              py-3 rounded-full font-medium
              transition-all duration-300
              hover:bg-gray-900 hover:shadow-lg"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* ================= POPUPS ================= */}
      {popup && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
            {popup === "login" ? (
              <>
                <h3 className="text-xl font-bold mb-3">
                  Login Required
                </h3>
                <p className="text-gray-600 mb-6">
                  Please login to send a message.
                </p>
                <Link
                  to="/login"
                  className="inline-block bg-black text-white
                  px-6 py-2 rounded-full"
                >
                  Go to Login
                </Link>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-3">
                  Message Sent
                </h3>
                <p className="text-gray-600 mb-6">
                  Your message has been sent successfully.
                </p>
                <button
                  onClick={() => setPopup(null)}
                  className="bg-black text-white
                  px-6 py-2 rounded-full"
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
