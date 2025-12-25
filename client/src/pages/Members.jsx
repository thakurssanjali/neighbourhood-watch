import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users/public")
      .then((res) => setMembers(res.data))
      .catch(() => setMembers([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/community-bg.webp')" }}
    >
      <div className="min-h-screen bg-black/60">

        {/* NAVBAR */}
        <nav className="absolute top-0 left-0 w-full pt-6 z-30">
          <div className="flex justify-between items-center px-6">
            <Link to="/">
              <img src="/images/logo.png" className="h-14" />
            </Link>

            <Link
              to="/"
              className="bg-white/70 backdrop-blur-md px-4 py-2 rounded-full"
            >
              Back to Home
            </Link>
          </div>
        </nav>

        {/* CONTENT */}
        <section className="pt-32 px-6">
          <div className="max-w-6xl mx-auto">

            <div className="text-center mb-12">
              <h1 className="text-5xl font-extrabold text-white">
                Community Members
              </h1>
              <p className="text-gray-300 mt-4">
                Registered residents in this neighbourhood
              </p>
            </div>

            {loading ? (
              <p className="text-center text-white">Loading members...</p>
            ) : members.length === 0 ? (
              <p className="text-center text-white">No members found</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {members.map((user) => (
                  <div
                    key={user._id}
                    className="bg-white/80 backdrop-blur-md
                    rounded-3xl shadow-xl p-6"
                  >
                    <h3 className="text-xl font-semibold mb-2">
                      {user.name}
                    </h3>

                    <p className="text-sm text-gray-700">
                      📞 {user.phone}
                    </p>
                    <p className="text-sm text-gray-700">
                      🏘 {user.locality}
                    </p>
                    <p className="text-sm text-gray-700">
                      Society: {user.society}
                    </p>
                    <p className="text-sm text-gray-700">
                      House: {user.houseNumber}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}

export default Members;
