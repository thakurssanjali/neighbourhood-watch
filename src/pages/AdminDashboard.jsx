import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import api, { incidentAPI, eventAPI, guidelineAPI, contactAPI } from "../services/api";
import Navbar from "../components/Navbar";
import { CheckCircle, Phone, Home, MessageCircle, Sparkles, Lock, Volume2, MapPin, Calendar, X, AlertCircle, Clock, CheckCircle2 } from "lucide-react";

function AdminDashboard() {
  const token = localStorage.getItem("token");

  const [incidents, setIncidents] = useState([]);
  const [remarksMap, setRemarksMap] = useState({});
  const [resetRequests, setResetRequests] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
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
      const res = await incidentAPI.getAll();
      setIncidents(res.data);
    } catch {
      alert("Failed to fetch incidents");
    }
  }, []);

  const fetchEvents = useCallback(async () => {
    try {
      const res = await eventAPI.getAll();
      setEvents(res.data);
    } catch {
      alert("Failed to fetch events");
    }
  }, []);

  const fetchGuidelines = useCallback(async () => {
    try {
      const res = await guidelineAPI.getPublic();
      setGuidelinesList(res.data);
    } catch {
      alert("Failed to fetch guidelines");
    }
  }, []);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await contactAPI.getAll();
      setMessages(res.data);
    } catch {
      alert("Failed to load messages");
    }
  }, []);

  const fetchResetRequests = useCallback(async () => {
    try {
      const res = await api.get("/password/reset-requests");
      setResetRequests(res.data);
    } catch (err) {
      console.error("Failed to fetch reset requests:", err.message);
    }
  }, []);

  // Action handlers
  const updateIncident = useCallback(async (id, status) => {
    try {
      await incidentAPI.update(id, {
        status,
        remarks: remarksMap[id] || ""
      });
      await fetchIncidents();
    } catch {
      alert("Failed to update incident");
    }
  }, [remarksMap, fetchIncidents]);

  const deleteIncident = useCallback(async (id) => {
    try {
      await incidentAPI.delete(id);
      await fetchIncidents();
    } catch {
      alert("Failed to delete incident");
    }
  }, [fetchIncidents]);

  const createEvent = useCallback(async () => {
    try {
      await eventAPI.create({
        title: eventData.title,
        category: eventData.category,
        venue: eventData.venue,
        description: eventData.description,
        eventDateTime: eventData.eventDateTime
      });

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
  }, [eventData, fetchEvents]);

  const handleEventChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const deleteEvent = useCallback(async (id) => {
    try {
      await eventAPI.delete(id);
      await fetchEvents();
    } catch {
      alert("Failed to delete event");
    }
  }, [fetchEvents]);

  const postGuideline = useCallback(async () => {
    try {
      const eventDateTime = new Date(
        `${guideline.date}T${guideline.time}`
      );

      await guidelineAPI.create({
        title: guideline.title,
        venue: guideline.venue,
        description: guideline.description,
        eventDateTime
      });

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
  }, [guideline, fetchGuidelines]);

  const deleteGuideline = useCallback(async (id) => {
    if (!window.confirm("Delete this community update?")) return;

    try {
      await guidelineAPI.delete(id);

      setGuidelinesList(
        guidelinesList.filter((g) => g._id !== id)
      );
    } catch {
      alert("Failed to delete guideline");
    }
  }, [guidelinesList]);

  const deleteMessage = useCallback(async (id) => {
    try {
      await contactAPI.delete(id);
      await fetchMessages();
    } catch {
      alert("Failed to delete message");
    }
  }, [fetchMessages]);

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
          <section className="relative px-6 pt-40 text-center pb-16">
            <div className="max-w-4xl mx-auto">
              <h1 className="mb-2 text-5xl font-bold text-white drop-shadow-lg">
                Admin Dashboard
              </h1>
              <p className="text-lg text-gray-100 drop-shadow">
                Review, manage, and resolve neighbourhood incidents
              </p>
            </div>
          </section>

          {/* ================= STATS ================= */}
          <section className="px-6 mx-auto mt-16 max-w-7xl">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* LEFT: STATS COLUMN */}
              <div className="lg:col-span-1 space-y-6">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
                  <StatCard title="Total" value={incidents.length} color="text-blue-600" icon={Home} />
                  <StatCard title="Pending" value={pending.length} color="text-yellow-600" icon={Clock} />
                  <StatCard title="In Action" value={actioning.length} color="text-orange-600" icon={AlertCircle} />
                  <StatCard title="Resolved" value={resolved.length} color="text-green-600" icon={CheckCircle2} />
                </div>
              </div>

              {/* RIGHT: RECENT INCIDENTS COLUMN */}
              <div className="lg:col-span-2">
                <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 h-full">
                  <h2 className="mb-6 text-2xl font-bold text-gray-900">Recent Incidents</h2>

                  {incidents.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No incidents available</p>
                  ) : (
                    <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2">
                      {incidents.slice(0, 8).map((incident) => (
                        <div
                          key={incident._id}
                          onClick={() => setSelectedIncident(incident)}
                          className="border-l-4 p-4 rounded-lg bg-gray-50 cursor-pointer"
                          style={{
                            borderColor: incident.status === "Pending"
                              ? "#eab308"
                              : incident.status === "Actioning"
                                ? "#f97316"
                                : "#22c55e"
                          }}
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">
                                {incident.title}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {incident.description.substring(0, 80)}...
                              </p>
                            </div>
                            <StatusBadge status={incident.status} />
                          </div>

                          <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
                            <span>📍 {incident.location || "Location N/A"}</span>
                            <span>{new Date(incident.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ================= COMMUNITY GUIDELINES (2-COLUMN LAYOUT) ================= */}
          <section className="px-6 py-16 mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* LEFT — COMMUNITY UPDATES (LIST) */}
              <div className="p-10 border shadow-2xl bg-white/95 backdrop-blur-xl rounded-3xl border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <Volume2 className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Community Updates
                  </h2>
                </div>

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
                          <p className="mt-2 text-sm text-gray-600 flex items-center gap-1">
                            <MapPin className="w-4 h-4" /> {item.venue}
                          </p>
                        )}
                        <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {new Date(item.eventDateTime).toLocaleString()}
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
                <div className="flex items-center gap-3 mb-6">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Manage Events
                  </h2>
                </div>

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
                        <p className="mt-2 text-sm text-gray-600 flex items-center gap-1">
                          <MapPin className="w-4 h-4" /> {event.venue}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {new Date(event.eventDateTime).toLocaleString()}
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
                <div className="flex items-center gap-3 mb-6">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Add Community Event
                  </h2>
                </div>

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
                <div className="flex items-center gap-3 mb-6">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Messages & Queries
                  </h2>
                </div>

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
                        <p className="mt-1 text-xs text-gray-600 flex items-center gap-2">
                          <Phone className="w-3 h-3" /> {msg.sentBy?.phone} • <Home className="w-3 h-3" /> {msg.sentBy?.society}
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
                <div className="flex items-center gap-3 mb-6">
                  <Lock className="w-6 h-6 text-gray-700" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Password Reset Requests
                  </h2>
                </div>

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
                                <p className="mt-1 text-sm text-gray-600 flex items-center gap-1"><Phone className="w-4 h-4" /> {req.phone}</p>
                                <p className="mt-2 text-xs text-gray-700">Reason: {req.reason}</p>
                                <p className="mt-1 text-xs text-gray-500">
                                  Requested: {new Date(req.createdAt).toLocaleDateString()}
                                </p>
                                <div className="flex gap-2 mt-3">
                                  <button
                                    onClick={async () => {
                                      try {
                                        await api.put(
                                          `/password/reset-requests/${req._id}/approve`,
                                          { remarks: remarks }
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
                                        await api.put(
                                          `/password/reset-requests/${req._id}/reject`,
                                          { remarks: remarks }
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
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle className="w-5 h-5 text-green-700" />
                          <h3 className="font-semibold text-green-700">Approved</h3>
                        </div>
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

      {/* ================= INCIDENT MODAL ================= */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            {/* MODAL HEADER - NOT SCROLLABLE */}
            <div className="flex items-center justify-between p-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-3xl flex-shrink-0">
              <h2 className="text-2xl font-bold text-white">{selectedIncident.title}</h2>
              <button
                onClick={() => setSelectedIncident(null)}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition flex-shrink-0"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* MODAL CONTENT - SCROLLABLE */}
            <div className="overflow-y-auto flex-1 scrollbar-hide" style={{ scrollbarGutter: "stable" }}>
              <div className="p-8 space-y-6">
                {/* STATUS */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 mb-2">Status</h3>
                  <StatusBadge status={selectedIncident.status} />
                </div>

                {/* DESCRIPTION */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedIncident.description}</p>
                </div>

                {/* LOCATION & DATE */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-2">Location</h3>
                    <p className="text-gray-900 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      {selectedIncident.location || "N/A"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-2">Reported On</h3>
                    <p className="text-gray-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      {new Date(selectedIncident.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* REPORTER INFO */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Reporter Information</h3>
                  <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                    <p className="text-sm"><span className="font-semibold text-gray-900">Name:</span> <span className="text-gray-700">{selectedIncident.reportedBy?.name || "Anonymous"}</span></p>
                    <p className="text-sm flex items-center gap-2"><Phone className="w-4 h-4 text-gray-600" /> <span className="font-semibold text-gray-900">Phone:</span> <span className="text-gray-700">{selectedIncident.reportedBy?.phone || "N/A"}</span></p>
                    <p className="text-sm"><span className="font-semibold text-gray-900">Society:</span> <span className="text-gray-700">{selectedIncident.reportedBy?.society || "N/A"}</span></p>
                    <p className="text-sm"><span className="font-semibold text-gray-900">House No:</span> <span className="text-gray-700">{selectedIncident.reportedBy?.houseNumber || "N/A"}</span></p>
                  </div>
                </div>

                {/* REMARKS */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Admin Remarks</h3>
                  <textarea
                    placeholder="Add admin remarks (visible to user)..."
                    value={remarksMap[selectedIncident._id] || selectedIncident.remarks || ""}
                    onChange={(e) =>
                      setRemarksMap({
                        ...remarksMap,
                        [selectedIncident._id]: e.target.value
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows="4"
                  />
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex flex-wrap gap-3 pt-4 border-t">
                  {selectedIncident.status !== "Actioning" && (
                    <button
                      onClick={() => {
                        updateIncident(selectedIncident._id, "Actioning");
                        setSelectedIncident(null);
                      }}
                      className="px-6 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition font-medium"
                    >
                      Mark Actioning
                    </button>
                  )}

                  {selectedIncident.status !== "Resolved" && (
                    <button
                      onClick={() => {
                        updateIncident(selectedIncident._id, "Resolved");
                        setSelectedIncident(null);
                      }}
                      className="px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition font-medium"
                    >
                      Mark Resolved
                    </button>
                  )}

                  <button
                    onClick={() => {
                      deleteIncident(selectedIncident._id);
                      setSelectedIncident(null);
                    }}
                    className="px-6 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition font-medium"
                  >
                    Delete
                  </button>

                  <button
                    onClick={() => setSelectedIncident(null)}
                    className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition font-medium ml-auto"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ================= COMPONENTS ================= */

function StatCard({ title, value, color = "text-blue-600", icon: Icon = AlertCircle }) {
  return (
    <div
      className="p-8 rounded-3xl transition shadow-2xl bg-gradient-to-br backdrop-blur-lg border border-white/20"
      style={{
        background: `linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)`
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <p className={`text-5xl font-bold ${color}`}>{value}</p>
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
