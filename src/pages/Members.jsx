import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { userAPI } from "../services/api";
import { Users, Search, User, MapPin, Building, Home, Phone } from "lucide-react";

function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userAPI.getAll()
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
        <section className="relative px-3 md:px-6 pt-28 md:pt-32 pb-12 md:pb-20">
          <div className="mx-auto max-w-6xl">
            {/* HEADER CARD */}
            <div className="overflow-hidden rounded-2xl md:rounded-3xl bg-white/95 backdrop-blur-xl shadow-2xl">
              {/* Gradient header */}
              <div className="h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600"></div>

              <div className="p-4 md:p-8 lg:p-12">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4 mb-3 md:mb-4">
                  <div className="flex-1">
                    <h1 className="mb-1 md:mb-2 text-3xl md:text-4xl lg:text-5xl font-black text-gray-900">
                      Community Members
                    </h1>
                    <p className="text-xs md:text-sm lg:text-lg text-gray-600">
                      Meet the active residents building our safer neighbourhood
                    </p>
                  </div>
                  <Users className="w-8 md:w-10 lg:w-12 h-8 md:h-10 lg:h-12 text-blue-600 flex-shrink-0" />
                </div>
                <div className="pt-3 md:pt-4 border-t border-gray-200">
                  <p className="text-xs md:text-sm font-semibold text-blue-600">
                    {loading ? "Loading..." : `${members.length} Active Members`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= MEMBERS GRID ================= */}
        <section className="px-3 md:px-6 py-12 md:py-20 mx-auto max-w-6xl">
          {loading ? (
            <div className="text-center py-12 md:py-20">
              <p className="text-lg md:text-2xl text-gray-300 font-semibold">Loading members...</p>
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-12 md:py-20">
              <Search className="w-12 md:w-16 h-12 md:h-16 mx-auto mb-3 md:mb-4 text-gray-400" />
              <p className="text-lg md:text-2xl text-gray-300 font-semibold mb-2">
                No Members Yet
              </p>
              <p className="text-xs md:text-base text-gray-400">
                Community members will appear here once they register
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {members.map((user) => (
                <div
                  key={user._id}
                  className="bg-white/95 backdrop-blur-md rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all p-3 md:p-6 border border-gray-100 hover:border-blue-200"
                >
                  {/* MEMBER HEADER */}
                  <div className="flex items-start justify-between mb-3 md:mb-4">
                    <div className="flex-1">
                      <h3 className="text-sm md:text-xl font-bold text-gray-900 mb-1">
                        {user.name}
                      </h3>
                      <p className="text-xs md:text-sm text-blue-600 font-semibold flex items-center gap-1">
                        <Phone className="w-3 md:w-4 h-3 md:h-4" /> {user.phone}
                      </p>
                    </div>
                    <User className="w-5 md:w-7 h-5 md:h-7 text-gray-400 flex-shrink-0" />
                  </div>

                  {/* DIVIDER */}
                  <div className="border-t border-gray-200 my-2 md:my-4"></div>

                  {/* MEMBER INFO */}
                  <div className="space-y-2 md:space-y-3">
                    <div className="flex items-start gap-2 md:gap-3">
                      <MapPin className="w-4 md:w-5 h-4 md:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="text-xs md:text-sm font-medium text-gray-900 truncate">
                          {user.locality}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 md:gap-3">
                      <Building className="w-4 md:w-5 h-4 md:h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500">Society</p>
                        <p className="text-xs md:text-sm font-medium text-gray-900 truncate">
                          {user.society}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 md:gap-3">
                      <Home className="w-4 md:w-5 h-4 md:h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500">House Number</p>
                        <p className="text-xs md:text-sm font-medium text-gray-900 truncate">
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
      <Footer />
    </div>
  );
}

export default Members;
