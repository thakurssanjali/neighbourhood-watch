import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

// API URL Configuration
const API_BASE_URL = import.meta.env.PROD
  ? "https://neighbourhood-watch-api.onrender.com/api"  // Production: Render backend
  : import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : "http://localhost:5000/api"; // Development: localhost

function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/users/public`)
      .then((res) => setMembers(res.data))
      .catch(() => setMembers([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/community-bg.webp')" }}
    >
      <div className="min-h-screen bg-gradient-to-br from-black/40 via-black/30 to-black/40">

        <Navbar />

        {/* ================= HEADER SECTION ================= */}
        <section className="relative px-6 pt-32 pb-20">
          <div className="mx-auto max-w-6xl">
            {/* HEADER CARD */}
            <div className="overflow-hidden rounded-3xl bg-white/95 backdrop-blur-xl shadow-2xl">
              {/* Gradient header */}
              <div className="h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600"></div>

              <div className="p-12">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="mb-2 text-5xl font-black text-gray-900">
                      Community Members
                    </h1>
                    <p className="text-lg text-gray-600">
                      Meet the active residents building our safer neighbourhood
                    </p>
                  </div>
                  <div className="text-5xl">👥</div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm font-semibold text-blue-600">
                    {loading ? "Loading..." : `${members.length} Active Members`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= MEMBERS GRID ================= */}
        <section className="px-6 py-20 mx-auto max-w-6xl">
          {loading ? (
            <div className="text-center py-20">
              <p className="text-2xl text-gray-300 font-semibold">Loading members...</p>
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-2xl text-gray-300 font-semibold mb-2">
                No Members Yet
              </p>
              <p className="text-gray-400">
                Community members will appear here once they register
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map((user) => (
                <div
                  key={user._id}
                  className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-100 hover:border-blue-200"
                >
                  {/* MEMBER HEADER */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {user.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Community Member
                      </p>
                    </div>
                    <span className="text-3xl">👤</span>
                  </div>

                  {/* DIVIDER */}
                  <div className="border-t border-gray-200 my-4"></div>

                  {/* MEMBER INFO */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="text-lg mt-0.5">📞</span>
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="text-sm font-medium text-gray-900">
                          {user.phone}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="text-lg mt-0.5">📍</span>
                      <div>
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="text-sm font-medium text-gray-900">
                          {user.locality}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="text-lg mt-0.5">🏘</span>
                      <div>
                        <p className="text-xs text-gray-500">Society</p>
                        <p className="text-sm font-medium text-gray-900">
                          {user.society}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="text-lg mt-0.5">🏠</span>
                      <div>
                        <p className="text-xs text-gray-500">House Number</p>
                        <p className="text-sm font-medium text-gray-900">
                          {user.houseNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}

export default Members;
