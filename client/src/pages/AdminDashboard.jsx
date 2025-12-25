import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

// API URL Configuration
const API_BASE_URL = import.meta.env.PROD
  ? "https://neighbourhood-watch-api.onrender.com/api"  // Production: Render backend
  : import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : "http://localhost:5000/api"; // Development: localhost

function AdminDashboard() {
  const token = localStorage.getItem("token");

  const [incidents, setIncidents] = useState([]);
  const [remarksMap, setRemarksMap] = useState({});
  const [resetRequests, setResetRequests] = useState([]);
  const [guideline, setGuideline] = useState({
    title: "",
    venue: "",
    description: "",
    date: "",
    time: ""
  });
  const [guidelinesList, setGuidelinesList] = useState([]);
  const [messages, setMessages] = useState([]);
  const [events, setEvents] = useState([]);
  const [eventData, setEventData] = useState({
    title: "",
    category: "",
    venue: "",
    description: "",
    eventDateTime: ""
  });

  // Fetch functions wrapped in useCallback
  const fetchIncidents = useCallback(async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/incidents`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setIncidents(res.data);
    } catch {
      alert("Failed to fetch incidents");
    }
  }, [token]);

  const fetchEvents = useCallback(async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/events`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEvents(res.data);
    } catch {
      alert("Failed to fetch events");
    }
  }, [token]);

  const fetchGuidelines = useCallback(async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/guidelines/public`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGuidelinesList(res.data);
    } catch {
      alert("Failed to fetch guidelines");
    }
  }, [token]);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/contact`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setMessages(res.data);
    } catch {
      alert("Failed to load messages");
    }
  }, [token]);

  const fetchResetRequests = useCallback(async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/password/reset-requests`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setResetRequests(res.data);
    } catch (err) {
      console.error("Failed to fetch reset requests:", err.message);
    }
  }, [token]);

  // Action handlers
  const updateIncident = useCallback(async (id, status) => {
    try {
      await axios.put(
        `${API_BASE_URL}/incidents/${id}`,
        {
          status,
          remarks: remarksMap[id] || ""
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      await fetchIncidents();
    } catch {
      alert("Failed to update incident");
    }
  }, [token, remarksMap, fetchIncidents]);

  const deleteIncident = useCallback(async (id) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/incidents/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      await fetchIncidents();
    } catch {
      alert("Failed to delete incident");
    }
  }, [token, fetchIncidents]);

  const createEvent = useCallback(async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/events`,
        {
          title: eventData.title,
          category: eventData.category,
          venue: eventData.venue,
          description: eventData.description,
          eventDateTime: eventData.eventDateTime
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert("Event posted successfully");
      setEventData({
        title: "",
        category: "",
        venue: "",
        description: "",
        eventDateTime: ""
      });
      await fetchEvents();
    } catch (err) {
      if (err.response?.status === 409) {
        alert("An event already exists at this date and time");
      } else {
        alert("Failed to add event");
      }
    }
  }, [token, eventData, fetchEvents]);

  const handleEventChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const deleteEvent = useCallback(async (id) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/events/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchEvents();
    } catch {
      alert("Failed to delete event");
    }
  }, [token, fetchEvents]);

  const postGuideline = useCallback(async () => {
    try {
      const eventDateTime = new Date(
        `${guideline.date}T${guideline.time}`
      );

      await axios.post(
        `${API_BASE_URL}/guidelines`,
        {
          title: guideline.title,
          venue: guideline.venue,
          description: guideline.description,
          eventDateTime
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert("Guideline posted successfully");

      setGuideline({
        title: "",
        venue: "",
        description: "",
        date: "",
        time: ""
      });
      await fetchGuidelines();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to post guideline");
    }
  }, [token, guideline, fetchGuidelines]);

  const deleteGuideline = useCallback(async (id) => {
    if (!window.confirm("Delete this community update?")) return;

    try {
      await axios.delete(
        `${API_BASE_URL}/guidelines/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setGuidelinesList(
        guidelinesList.filter((g) => g._id !== id)
      );
    } catch {
      alert("Failed to delete guideline");
    }
  }, [token, guidelinesList]);

  const deleteMessage = useCallback(async (id) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/contact/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      await fetchMessages();
    } catch {
      alert("Failed to delete message");
    }
  }, [token, fetchMessages]);

  // useEffect to load data
  useEffect(() => {
    const loadData = async () => {
      await fetchIncidents();
      await fetchEvents();
      await fetchGuidelines();
      await fetchMessages();
      await fetchResetRequests();
    };
    loadData();
  }, [fetchIncidents, fetchEvents, fetchGuidelines, fetchMessages, fetchResetRequests]);

  const pending = incidents.filter(i => i.status === "Pending");
  const actioning = incidents.filter(i => i.status === "Actioning");
  const resolved = incidents.filter(i => i.status === "Resolved");

  return (
    <>
      <Navbar />
      <div
        className="min-h-screen bg-fixed bg-center bg-cover"
        style={{ backgroundImage: "url('/images/hero.webp')" }}
      >
        {/* DARK OVERLAY */}
        <div className="min-h-screen bg-gradient-to-b from-black/60 via-black/50 to-black/40">
          {/* ================= HEADER ================= */}
          <section className="relative px-6 pt-32 text-center">
            <div className="max-w-4xl p-10 mx-auto border shadow-2xl bg-white/95 backdrop-blur-xl rounded-3xl border-white/20">
              <h1 className="mb-3 text-4xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-700">
                Review, manage, and resolve neighbourhood incidents
              </p>
            </div>
          </section>

          {/* ================= STATS ================= */}
          <section className="px-6 mx-auto mt-16 max-w-7xl">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard title="Total" value={incidents.length} />
              <StatCard title="Pending" value={pending.length} color="text-yellow-600" />
              <StatCard title="In Action" value={actioning.length} color="text-orange-600" />
              <StatCard title="Resolved" value={resolved.length} color="text-green-600" />
            </div>
          </section>

          {/* ================= INCIDENT LIST ================= */}
          <section className="px-6 py-20 mx-auto max-w-7xl">
            {incidents.length === 0 ? (
              <p className="text-center text-white">
                No complaints available
              </p>
            ) : (
              <div className="space-y-8">
                {incidents.map((incident) => (
                  <div
                    key={incident._id}
                    className="bg-white/70 backdrop-blur-md
                  rounded-3xl shadow-xl p-8
                  transition-all duration-300
                  hover:scale-[1.02] hover:shadow-2xl"
                  >
                    {/* HEADER */}
                    <div className="flex flex-col gap-4 mb-4 md:flex-row md:justify-between md:items-center">
                      <h3 className="text-xl font-semibold">
                        {incident.title}
                      </h3>
                      <StatusBadge status={incident.status} />
                    </div>

                    <p className="mb-4 text-gray-700">
                      {incident.description}
                    </p>
                    <textarea
                      placeholder="Add admin remarks (visible to user)"
                      value={remarksMap[incident._id] || incident.remarks || ""}
                      onChange={(e) =>
                        setRemarksMap({
                          ...remarksMap,
                          [incident._id]: e.target.value
                        })
                      }
                      className="w-full p-3 mt-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                    />


                    {/* REPORTER INFO */}
                    <div className="grid grid-cols-1 gap-3 text-sm text-gray-700 md:grid-cols-2">
                      <p><strong>Reporter:</strong> {incident.reportedBy?.name || "Anonymous"}</p>
                      <p><strong>Phone:</strong> {incident.reportedBy?.phone || "N/A"}</p>
                      <p><strong>Society:</strong> {incident.reportedBy?.society}</p>
                      <p><strong>House:</strong> {incident.reportedBy?.houseNumber}</p>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-3 mt-6">
                      <div className="flex flex-wrap gap-3 mt-6">
                        {incident.status !== "Actioning" && (
                          <button
                            onClick={() => updateIncident(incident._id, "Actioning")}
                            className="px-5 py-2 text-white bg-orange-500 rounded-full"
                          >
                            Mark Actioning
                          </button>
                        )}

                        {incident.status !== "Resolved" && (
                          <button
                            onClick={() => updateIncident(incident._id, "Resolved")}
                            className="px-5 py-2 text-white bg-green-600 rounded-full"
                          >
                            Mark Resolved
                          </button>
                        )}

                        <button
                          onClick={() => deleteIncident(incident._id)}
                          className="px-5 py-2 text-white bg-red-600 rounded-full"
                        >
                          Delete
                        </button>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ================= COMMUNITY GUIDELINES (2-COLUMN LAYOUT) ================= */}
          <section className="px-6 py-16 mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* LEFT — COMMUNITY UPDATES (LIST) */}
              <div className="p-10 border shadow-2xl bg-white/95 backdrop-blur-xl rounded-3xl border-white/20">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">
                  📢 Community Updates
                </h2>

                {guidelinesList.length === 0 ? (
                  <p className="text-gray-600">No community updates posted yet</p>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {guidelinesList.map((item) => (
                      <div
                        key={item._id}
                        className="p-5 transition border border-gray-200 rounded-2xl bg-white/50 hover:bg-white/80"
                      >
                        <h3 className="font-semibold text-gray-900">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm text-gray-700">
                          {item.description.substring(0, 100)}...
                        </p>
                        {item.venue && (
                          <p className="mt-2 text-sm text-gray-600">
                            📍 {item.venue}
                          </p>
                        )}
                        <p className="mt-2 text-xs text-gray-500">
                          📅 {new Date(item.eventDateTime).toLocaleString()}
                        </p>
                        <button
                          onClick={() => deleteGuideline(item._id)}
                          className="px-4 py-2 mt-3 text-sm text-white transition bg-red-600 rounded-lg hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* RIGHT — POST COMMUNITY GUIDELINE (FORM) */}
              <div className="p-10 border shadow-2xl bg-white/95 backdrop-blur-xl rounded-3xl border-white/20">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">
                  ✏️ Post Community Guideline
                </h2>

                <div className="space-y-5">
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-900">
                      Title
                    </label>
                    <input
                      placeholder="Enter guideline title"
                      value={guideline.title}
                      onChange={(e) =>
                        setGuideline({ ...guideline, title: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/90"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-900">
                      Description
                    </label>
                    <textarea
                      placeholder="Enter guideline description"
                      value={guideline.description}
                      onChange={(e) =>
                        setGuideline({ ...guideline, description: e.target.value })
                      }
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/90"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-900">
                      Venue (Optional)
                    </label>
                    <input
                      placeholder="Enter venue"
                      value={guideline.venue}
                      onChange={(e) =>
                        setGuideline({ ...guideline, venue: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/90"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-900">
                        Date
                      </label>
                      <input
                        type="date"
                        value={guideline.date}
                        onChange={(e) =>
                          setGuideline({ ...guideline, date: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/90"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-900">
                        Time
                      </label>
                      <input
                        type="time"
                        value={guideline.time}
                        onChange={(e) =>
                          setGuideline({ ...guideline, time: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/90"
                      />
                    </div>
                  </div>

                  <button
                    onClick={postGuideline}
                    className="w-full px-6 py-3 font-semibold text-white transition rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  >
                    Post Guideline
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ================= COMMUNITY EVENTS (2-COLUMN LAYOUT) ================= */}
          <section className="px-6 py-16 mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* LEFT — MANAGE EVENTS (LIST) */}
              <div className="p-10 border shadow-2xl bg-white/95 backdrop-blur-xl rounded-3xl border-white/20">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">
                  📅 Manage Events
                </h2>

                {events.length === 0 ? (
                  <p className="text-gray-600">No events posted yet</p>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {events.map((event) => (
                      <div
                        key={event._id}
                        className="p-5 transition border border-gray-200 rounded-2xl bg-white/50 hover:bg-white/80"
                      >
                        <p className="font-semibold text-gray-900">
                          {event.title} ({event.category})
                        </p>
                        <p className="mt-1 text-sm text-gray-700">
                          {event.description?.substring(0, 80)}...
                        </p>
                        <p className="mt-2 text-sm text-gray-600">
                          📍 {event.venue}
                        </p>
                        <p className="text-xs text-gray-500">
                          📅 {new Date(event.eventDateTime).toLocaleString()}
                        </p>
                        <button
                          onClick={() => deleteEvent(event._id)}
                          className="px-4 py-2 mt-3 text-sm text-white transition bg-red-600 rounded-lg hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* RIGHT — ADD COMMUNITY EVENT (FORM) */}
              <div className="p-10 border shadow-2xl bg-white/95 backdrop-blur-xl rounded-3xl border-white/20">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">
                  ✨ Add Community Event
                </h2>

                <div className="space-y-5">
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-900">
                      Category
                    </label>
                    <select
                      name="category"
                      value={eventData.category}
                      onChange={handleEventChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/90"
                      required
                    >
                      <option value="">Select Event Category</option>
                      <option value="Dance">Dance</option>
                      <option value="Concert">Concert</option>
                      <option value="Lunch">Lunch</option>
                      <option value="Urgent Meeting">Urgent Meeting</option>
                      <option value="Festival">Festival</option>
                      <option value="Casual Gathering">Casual Gathering</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-900">
                      Title
                    </label>
                    <input
                      name="title"
                      placeholder="Event title"
                      value={eventData.title}
                      onChange={handleEventChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/90"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-900">
                      Venue
                    </label>
                    <input
                      name="venue"
                      placeholder="Venue"
                      value={eventData.venue}
                      onChange={handleEventChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/90"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-900">
                      Description
                    </label>
                    <textarea
                      name="description"
                      placeholder="Event description"
                      value={eventData.description}
                      onChange={handleEventChange}
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/90"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-900">
                      Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      name="eventDateTime"
                      value={eventData.eventDateTime}
                      onChange={handleEventChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/90"
                    />
                  </div>

                  <button
                    onClick={createEvent}
                    className="w-full px-6 py-3 font-semibold text-white transition rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  >
                    Post Event
                  </button>
                </div>
              </div>
            </div>
          </section>
          {/* ================= QUERIES & PASSWORD RESET (2-COLUMN LAYOUT) ================= */}
          <section className="px-6 py-16 mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* LEFT — MESSAGES & QUERIES */}
              <div className="p-10 border shadow-2xl bg-white/95 backdrop-blur-xl rounded-3xl border-white/20">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">
                  💬 Messages & Queries
                </h2>

                {messages.length === 0 ? (
                  <p className="text-gray-600">No messages received</p>
                ) : (
                  <div className="space-y-4 max-h-[700px] overflow-y-auto">
                    {messages.map((msg) => (
                      <div
                        key={msg._id}
                        className="p-5 transition border border-gray-200 rounded-2xl bg-white/50 hover:bg-white/80"
                      >
                        <p className="font-semibold text-gray-900">
                          {msg.sentBy?.name}
                        </p>
                        <p className="mt-1 text-xs text-gray-600">
                          📞 {msg.sentBy?.phone} • 🏠 {msg.sentBy?.society}
                        </p>
                        <p className="mt-3 text-sm text-gray-700">
                          {msg.message}
                        </p>
                        <p className="mt-2 text-xs text-gray-500">
                          {new Date(msg.createdAt).toLocaleString()}
                        </p>
                        <button
                          onClick={() => deleteMessage(msg._id)}
                          className="px-4 py-2 mt-3 text-sm text-white transition bg-red-600 rounded-lg hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* RIGHT — PASSWORD RESET REQUESTS */}
              <div className="p-10 border shadow-2xl bg-white/95 backdrop-blur-xl rounded-3xl border-white/20">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">
                  🔐 Password Reset Requests
                </h2>

                {resetRequests.length === 0 ? (
                  <p className="text-gray-600">No pending reset requests</p>
                ) : (
                  <div className="space-y-4 max-h-[700px] overflow-y-auto">
                    {/* PENDING REQUESTS */}
                    {resetRequests.filter(req => req.status === "pending").length > 0 && (
                      <>
                        <div className="mb-4">
                          <h3 className="mb-3 font-semibold text-yellow-700">⏳ Pending Requests</h3>
                          <div className="space-y-3">
                            {resetRequests.filter(req => req.status === "pending").map((req) => (
                              <div
                                key={req._id}
                                className="p-4 border border-yellow-200 rounded-2xl bg-yellow-50/50"
                              >
                                <p className="font-semibold text-gray-900">{req.name}</p>
                                <p className="mt-1 text-sm text-gray-600">📞 {req.phone}</p>
                                <p className="mt-2 text-xs text-gray-700">Reason: {req.reason}</p>
                                <p className="mt-1 text-xs text-gray-500">
                                  Requested: {new Date(req.createdAt).toLocaleDateString()}
                                </p>
                                <div className="flex gap-2 mt-3">
                                  <button
                                    onClick={async () => {
                                      try {
                                        await axios.put(
                                          `${API_BASE_URL}/password/reset-requests/${req._id}/approve`,
                                          { remarks: remarks },
                                          { headers: { Authorization: `Bearer ${token}` } }
                                        );
                                        alert("Request approved");
                                        fetchResetRequests();
                                      } catch (err) {
                                        alert(err.response?.data?.message || "Failed to approve");
                                      }
                                    }}
                                    className="flex-1 px-3 py-2 text-sm text-white transition bg-green-600 rounded-lg hover:bg-green-700"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={async () => {
                                      const remarks = prompt("Rejection reason (optional):");
                                      try {
                                        await axios.put(
                                          `${API_BASE_URL}/password/reset-requests/${req._id}/reject`,
                                          { remarks: remarks },
                                          { headers: { Authorization: `Bearer ${token}` } }
                                        );
                                        alert("Request rejected");
                                        fetchResetRequests();
                                      } catch (err) {
                                        alert(err.response?.data?.message || "Failed to reject");
                                      }
                                    }}
                                    className="flex-1 px-3 py-2 text-sm text-white transition bg-red-600 rounded-lg hover:bg-red-700"
                                  >
                                    Reject
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {/* APPROVED REQUESTS */}
                    {resetRequests.filter(req => req.status === "approved").length > 0 && (
                      <div className="mt-6">
                        <h3 className="mb-3 font-semibold text-green-700">✅ Approved</h3>
                        <div className="space-y-2">
                          {resetRequests.filter(req => req.status === "approved").map((req) => (
                            <div key={req._id} className="p-3 border border-green-200 rounded-lg bg-green-50/50">
                              <p className="text-sm font-semibold text-gray-900">{req.name}</p>
                              <p className="text-xs text-gray-600">Password updated • By: {req.approvedBy}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

/* ================= COMPONENTS ================= */

function StatCard({ title, value, color = "text-blue-600" }) {
  return (
    <div
      className="p-8 text-center transition shadow-xl bg-white/70 backdrop-blur-md rounded-3xl hover:scale-105"
    >
      <p className="mb-1 text-sm text-gray-600">{title}</p>
      <p className={`text-4xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

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

export default AdminDashboard;
