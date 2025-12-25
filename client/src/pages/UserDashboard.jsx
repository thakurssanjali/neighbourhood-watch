import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function UserDashboard() {
  const [incidents, setIncidents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    locality: ""
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  /* ================= FETCH USER INCIDENTS ================= */
  const fetchMyIncidents = async () => {
    try {
      const res = await 
      axios.get("http://localhost:5000/api/incidents/my", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
});

      setIncidents(res.data);
    } catch {
      alert("Failed to fetch your complaints");
    }
  };

  useEffect(() => {
    fetchMyIncidents();
  }, []);

  /* ================= FORM HANDLERS ================= */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitComplaint = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/incidents",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setShowModal(false);
      setFormData({
        title: "",
        category: "",
        description: "",
        locality: ""
      });

      fetchMyIncidents();
    } catch {
      alert("Failed to register complaint");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/images/hero.jpg')" }}
    >
      <div className="min-h-screen bg-black/20">

        {/* ================= NAVBAR ================= */}
        <nav className="absolute top-0 left-0 w-full pt-6 z-30">
          <div className="relative flex items-center justify-center px-6">

            {/* HOME */}
            <Link
              to="/"
              className="absolute left-6
              bg-white/70 backdrop-blur-md
              px-4 py-2 rounded-full text-sm
              shadow hover:bg-white"
            >
              Home
            </Link>

            {/* LOGO */}
            <Link to="/">
              <img
                src="/images/logo.png"
                alt="ReportIt Logo"
                className="h-14 w-auto drop-shadow-md cursor-pointer"
              />
            </Link>

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              className="absolute right-6
              bg-red-600 text-white
              px-4 py-2 rounded-full text-sm
              shadow hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </nav>

        {/* ================= HERO ================= */}
        <section className="pt-32 px-6 text-center">
          <div
            className="max-w-4xl mx-auto
            bg-white/70 backdrop-blur-md
            rounded-3xl shadow-xl p-10"
          >
            <h1 className="text-4xl font-bold mb-4">
              Your Dashboard
            </h1>

            <p className="text-gray-700 mb-8">
              Register new complaints and track their resolution status
            </p>

            <button
              onClick={() => setShowModal(true)}
              className="bg-black text-white
              px-8 py-3 rounded-full
              transition hover:bg-gray-900
              hover:shadow-[0_0_25px_rgba(0,0,0,0.4)]"
            >
              Register a Complaint
            </button>
          </div>
        </section>

        {/* ================= MY COMPLAINTS ================= */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold text-white text-center mb-10">
            My Complaints
          </h2>

          {incidents.length === 0 ? (
            <p className="text-center text-white">
              You have not registered any complaints yet.
            </p>
          ) : (
            <div className="space-y-8">
              {incidents.map((incident) => (
                <div
                  key={incident._id}
                  className="bg-white/70 backdrop-blur-md
                  rounded-3xl shadow-xl p-8
                  transition hover:scale-[1.02]"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3 gap-4">
                    <h3 className="text-xl font-semibold">
                      {incident.title}
                    </h3>
                    <StatusBadge status={incident.status} />
                  </div>

                  <p className="text-gray-700 mb-3">
                    {incident.description}
                  </p>

                  {incident.adminReason && (
                    <div className="mt-3 bg-yellow-50 text-yellow-700 p-3 rounded-xl text-sm">
                      <strong>Admin Note:</strong>{" "}
                      {incident.adminReason}
                    </div>
                  )}

                  <p className="text-xs text-gray-500 mt-4">
                    Submitted on{" "}
                    {new Date(incident.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ================= MODAL ================= */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div
              className="w-full max-w-xl
              bg-white/80 backdrop-blur-xl
              rounded-3xl shadow-2xl p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  Register New Complaint
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-xl font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={submitComplaint} className="space-y-4">
                <input
                  name="title"
                  placeholder="Complaint Title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-full border
                  focus:outline-none focus:ring-2 focus:ring-black"
                />

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-full border
                  focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="">Select Category</option>
                  <option>Street Light</option>
                  <option>Garbage</option>
                  <option>Water Supply</option>
                  <option>Noise</option>
                  <option>Theft</option>
                  <option>Other</option>
                </select>

                <textarea
                  name="description"
                  placeholder="Describe the issue"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  required
                  className="w-full px-4 py-3 rounded-2xl border
                  focus:outline-none focus:ring-2 focus:ring-black"
                />

                <input
                  name="locality"
                  placeholder="Locality / Area"
                  value={formData.locality}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-full border
                  focus:outline-none focus:ring-2 focus:ring-black"
                />

                <button
                  type="submit"
                  className="w-full bg-black text-white
                  py-3 rounded-full font-medium
                  transition hover:bg-gray-900"
                >
                  Submit Complaint
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

/* ================= STATUS BADGE ================= */

function StatusBadge({ status }) {
  const styles = {
    Pending: "bg-yellow-100 text-yellow-700",
    Actioning: "bg-orange-100 text-orange-700",
    Resolved: "bg-green-100 text-green-700"
  };

  return (
    <span
      className={`px-4 py-1 rounded-full text-sm font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

export default UserDashboard;
