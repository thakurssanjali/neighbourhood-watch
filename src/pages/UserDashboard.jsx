import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, AlertCircle, CheckCircle, Clipboard, Calendar, AlertTriangle, MapPin } from "lucide-react";
import { incidentAPI } from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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
      <div className="min-h-screen bg-gradient-to-br from-black/40 via-black/30 to-black/40">

        <Navbar />

        {/* ================= HERO SECTION ================= */}
        <section className="relative px-6 pt-32 pb-20">
          <div className="max-w-6xl mx-auto">
            {/* HEADER CARD */}
            <div className="overflow-hidden shadow-2xl rounded-3xl bg-white/95 backdrop-blur-xl">
              {/* Gradient header */}
              <div className="h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600"></div>

              <div className="p-12">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="mb-2 text-5xl font-black text-gray-900">
                      Your Dashboard
                    </h1>
                    <p className="text-lg text-gray-600">
                      Track and manage your complaints in real-time
                    </p>
                  </div>

                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center gap-2 px-8 py-4 text-lg font-bold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 hover:shadow-2xl hover:scale-105"
                  >

                    <span>Register a New Complaint</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>

            {/* STATS GRID */}
            <div className="grid grid-cols-1 gap-6 mt-10 md:grid-cols-3">
              <div className="p-6 border-l-4 border-yellow-500 shadow-lg bg-white/90 backdrop-blur-md rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
                <p className="text-4xl font-bold text-yellow-600">
                  {incidents.filter(i => i.status === "Pending").length}
                </p>
              </div>
              <div className="p-6 border-l-4 border-orange-500 shadow-lg bg-white/90 backdrop-blur-md rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  <p className="text-sm text-gray-600">In Action</p>
                </div>
                <p className="text-4xl font-bold text-orange-600">
                  {incidents.filter(i => i.status === "Actioning").length}
                </p>
              </div>
              <div className="p-6 border-l-4 border-green-500 shadow-lg bg-white/90 backdrop-blur-md rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-sm text-gray-600">Resolved</p>
                </div>
                <p className="text-4xl font-bold text-green-600">
                  {incidents.filter(i => i.status === "Resolved").length}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= MY COMPLAINTS SECTION ================= */}
        <section className="max-w-6xl px-6 py-20 mx-auto">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-2">
              <Clipboard className="w-8 h-8 text-blue-400" />
              <h2 className="text-4xl font-black text-white">
                My Complaints
              </h2>
            </div>
            <p className="text-gray-200">
              {incidents.length === 0
                ? "No complaints registered yet"
                : `${incidents.length} complaint${incidents.length !== 1 ? 's' : ''} registered`}
            </p>
          </div>

          {incidents.length === 0 ? (
            <div className="py-20 text-center">
              <Clipboard className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="mb-2 text-2xl font-semibold text-gray-300">
                No Complaints Yet
              </p>
              <p className="mb-8 text-gray-400">
                Register a new complaint to get started with tracking issues in your community
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3 font-semibold text-white transition-colors bg-blue-600 rounded-xl hover:bg-blue-700"
              >
                Register Your First Complaint
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {incidents.map((incident) => (
                <div
                  key={incident._id}
                  className={`border-l-4 bg-gradient-to-r p-6 rounded-2xl backdrop-blur-md shadow-lg hover:shadow-xl transition-all ${incident.status === "Pending"
                    ? "border-yellow-500 from-yellow-50 to-transparent bg-white/90"
                    : incident.status === "Actioning"
                      ? "border-orange-500 from-orange-50 to-transparent bg-white/90"
                      : "border-green-500 from-green-50 to-transparent bg-white/90"
                    }`}
                >
                  {/* HEADER */}
                  <div className="flex flex-col items-start justify-between gap-4 mb-4 md:flex-row md:items-center">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-gray-900">
                          {incident.title}
                        </h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <StatusBadge status={incident.status} />
                        {incident.category && (
                          <span className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                            {incident.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* DESCRIPTION */}
                  <p className="mb-4 leading-relaxed text-gray-700">
                    {incident.description}
                  </p>

                  {/* METADATA */}
                  <div className="flex flex-wrap gap-6 pt-4 text-sm text-gray-600 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>{incident.location || "Location not provided"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>{new Date(incident.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>{new Date(incident.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                  </div>

                  {/* ADMIN NOTE */}
                  {incident.adminReason && (
                    <div className="p-3 mt-4 bg-yellow-100 border-l-2 border-yellow-500 rounded-lg">
                      <p className="text-sm text-yellow-800 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span><strong>Admin Note:</strong> {incident.adminReason}</span>
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ================= REGISTER COMPLAINT MODAL ================= */}
        {
          showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
              <div className="w-full max-w-2xl overflow-hidden bg-white shadow-2xl rounded-2xl animate-fadeInUp">
                {/* HEADER WITH GRADIENT */}
                <div className="relative p-6 text-white bg-gradient-to-r from-blue-600 to-blue-800">
                  <button
                    onClick={() => setShowModal(false)}
                    className="absolute text-2xl font-bold transition-transform top-4 right-4 hover:scale-110"
                  >
                    ✕
                  </button>

                  <h2 className="mb-2 text-3xl font-bold">
                    Register a New Complaint
                  </h2>
                  <p className="text-blue-100">
                    Describe the issue and help us improve your community
                  </p>
                </div>

                {/* FORM */}
                <form onSubmit={submitComplaint} className="p-8 space-y-5">
                  {/* TITLE */}
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-900">
                      Complaint Title *
                    </label>
                    <input
                      name="title"
                      placeholder="e.g., Broken streetlight near park"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* CATEGORY */}
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-900">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select a category</option>
                      <option>Street Light</option>
                      <option>Garbage</option>
                      <option>Water Supply</option>
                      <option>Noise</option>
                      <option>Theft</option>
                      <option>Road Damage</option>
                      <option>Other</option>
                    </select>
                  </div>

                  {/* LOCATION */}
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-900">
                      Location / Area *
                    </label>
                    <input
                      name="location"
                      placeholder="e.g., Main Street, Sector 5"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* DESCRIPTION */}
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-900">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      placeholder="Provide detailed information about the issue..."
                      value={formData.description}
                      onChange={handleChange}
                      rows="5"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* BUTTONS */}
                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 py-3 font-semibold text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 font-bold text-white transition-all rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg"
                    >
                      Submit Complaint
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

      </div>
      <Footer />
    </div>
  );
}

/* ================= STATUS BADGE COMPONENT ================= */
function StatusBadge({ status }) {
  const styles = {
    Pending: "bg-yellow-500 text-white",
    Actioning: "bg-orange-500 text-white",
    Resolved: "bg-green-500 text-white"
  };

  const iconMap = {
    Pending: <Clock className="w-4 h-4" />,
    Actioning: <AlertCircle className="w-4 h-4" />,
    Resolved: <CheckCircle className="w-4 h-4" />
  };

  return (
    <span
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${styles[status]}`}
    >
      {iconMap[status]}
      {status}
    </span>
  );
}
export default UserDashboard;