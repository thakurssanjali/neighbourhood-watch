import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { incidentAPI } from "../services/api";
import Navbar from "../components/Navbar";

function UserDashboard() {
  const [incidents, setIncidents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    location: ""
  });

  /* ================= FETCH USER INCIDENTS ================= */
  const fetchMyIncidents = async () => {
    try {
      const res = await incidentAPI.getMy();
      setIncidents(res.data);
    } catch {
      alert("Failed to fetch your complaints");
    }
  };

  useEffect(() => {
    const loadIncidents = async () => {
      try {
        const res = await incidentAPI.getMy();
        setIncidents(res.data);
      } catch {
        alert("Failed to fetch your complaints");
      }
    };
    loadIncidents();
  }, []);

  /* ================= FORM HANDLERS ================= */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitComplaint = async (e) => {
    e.preventDefault();

    try {
      await incidentAPI.create(formData);

      setShowModal(false);
      setFormData({
        title: "",
        category: "",
        description: "",
        location: ""
      });

      fetchMyIncidents();
    } catch {
      alert("Failed to register complaint");
    }
  };

  return (
    <div
      className="min-h-screen bg-fixed bg-center bg-cover"
      style={{ backgroundImage: "url('/images/hero.webp')" }}
    >
      <div className="min-h-screen bg-black/20">

        <Navbar />

        {/* ================= HERO ================= */}
        <section className="px-6 pt-32 text-center">
          <div
            className="max-w-4xl p-10 mx-auto shadow-xl bg-white/70 backdrop-blur-md rounded-3xl"
          >
            <h1 className="mb-4 text-4xl font-bold">
              Your Dashboard
            </h1>

            <p className="mb-8 text-gray-700">
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
        <section className="px-6 py-20 mx-auto max-w-7xl">
          <h2 className="mb-10 text-3xl font-bold text-center text-white">
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
                  <div className="flex flex-col gap-4 mb-3 md:flex-row md:justify-between md:items-center">
                    <h3 className="text-xl font-semibold">
                      {incident.title}
                    </h3>
                    <StatusBadge status={incident.status} />
                  </div>

                  <p className="mb-3 text-gray-700">
                    {incident.description}
                  </p>

                  <p className="mt-4 text-xs text-gray-500">
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
              className="w-full max-w-xl p-8 shadow-2xl bg-white/80 backdrop-blur-xl rounded-3xl"
            >
              <div className="flex items-center justify-between mb-6">
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
                  className="w-full px-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-black"
                />

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-black"
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
                  className="w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-black"
                />

                <input
                  name="location"
                  placeholder="Location / Area"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-black"
                />

                <button
                  type="submit"
                  className="w-full py-3 font-medium text-white transition bg-black rounded-full hover:bg-gray-900"
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
