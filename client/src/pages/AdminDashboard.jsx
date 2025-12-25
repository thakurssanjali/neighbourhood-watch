import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";

function AdminDashboard() {
  const [incidents, setIncidents] = useState([]);
  const [remarksMap, setRemarksMap] = useState({});
  const [resetPhone, setResetPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetRequests, setResetRequests] = useState([]);
  const [passwordMap, setPasswordMap] = useState({});
const [showNewPassword, setShowNewPassword] = useState(false);


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

const createEvent = async () => {
  try {
    await axios.post(
      "http://localhost:5000/api/events",
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
    

  }  catch (err) {
  if (err.response?.status === 409) {
    alert("An event already exists at this date and time");
  } else {
    alert("Failed to add event");
  }
}

};
const fetchGuidelines = async () => {
  try {
    const res = await axios.get(
      "http://localhost:5000/api/guidelines/public",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setGuidelinesList(res.data);
  } catch {
    alert("Failed to fetch guidelines");
  }
};


const resetUserPassword = async (requestId, phone) => {
  const newPassword = passwordMap[requestId];

  if (!newPassword) {
    alert("Please enter a new password");
    return;
  }

  await axios.post(
    "http://localhost:5000/api/admin/reset-password",
    {
      requestId,
      phone,
      newPassword
    },
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  alert("Password reset successfully");
  fetchResetRequests();
};


const fetchResetRequests = async () => {
  const res = await axios.get(
    "http://localhost:5000/api/admin/password-reset-requests",
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  setResetRequests(res.data);
};


const deleteEvent = async (id) => {
  await axios.delete(
    `http://localhost:5000/api/events/${id}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  fetchEvents();
};

const handleEventChange = (e) => {
  setEventData({ ...eventData, [e.target.name]: e.target.value });
};

const postGuideline = async () => {
  try {
    const eventDateTime = new Date(
      `${guideline.date}T${guideline.time}`
    );

    await axios.post(
      "http://localhost:5000/api/guidelines",
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

  } catch (err) {
    console.error(err.response?.data || err.message);
    alert("Failed to post guideline");
  }
};

const deleteGuideline = async (id) => {
  if (!window.confirm("Delete this community update?")) return;

  try {
    await axios.delete(
      `http://localhost:5000/api/guidelines/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setGuidelinesList(
      guidelinesList.filter((g) => g._id !== id)
    );
  } catch {
    alert("Failed to delete guideline");
  }
};



  const token = localStorage.getItem("token");
  const navigate = useNavigate();

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  navigate("/login");
};

const [eventData, setEventData] = useState({
  title: "",
  category: "",
  venue: "",
  description: "",
  eventDateTime: ""
});


  const fetchIncidents = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/incidents",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setIncidents(res.data);
    } catch {
      alert("Failed to fetch incidents");
    }
  };

 const updateIncident = async (id, status) => {
  await axios.put(
    `http://localhost:5000/api/incidents/${id}`,
    {
      status,
      remarks: remarksMap[id] || ""
    },
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  fetchIncidents();
};

  

  const deleteIncident = async (id) => {
    await axios.delete(
      `http://localhost:5000/api/incidents/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    fetchIncidents();
  };

const fetchEvents = async () => {
  const res = await axios.get(
    "http://localhost:5000/api/events",
    { headers: { Authorization: `Bearer ${token}` } }
  );
  setEvents(res.data);
};

const fetchMessages = async () => {
  try {
    const res = await axios.get(
      "http://localhost:5000/api/contact",
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    setMessages(res.data);
  } catch {
    alert("Failed to load messages");
  }
};

const deleteMessage = async (id) => {
  await axios.delete(
    `http://localhost:5000/api/contact/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  fetchMessages();
};

useEffect(() => {
  fetchIncidents();
  fetchEvents();
  fetchGuidelines();
  fetchMessages();
  fetchResetRequests();

}, []);

  const pending = incidents.filter(i => i.status === "Pending");
  const actioning = incidents.filter(i => i.status === "Actioning");
  const resolved = incidents.filter(i => i.status === "Resolved");

  return (
    <div
      className="min-h-screen bg-fixed bg-center bg-cover"
      style={{ backgroundImage: "url('/images/hero.webp')" }}
    >
      {/* Optional dark overlay for readability */}
      <div className="min-h-screen bg-black/20">
      {/* ================= NAVBAR ================= */}
<nav className="absolute top-0 left-0 z-30 w-full pt-6">
  <div className="relative flex items-center justify-center px-6">

    {/* HOME BUTTON — LEFT */}
    <Link
      to="/"
      className="absolute px-4 py-2 text-sm font-medium rounded-full shadow left-6 bg-white/70 backdrop-blur-md hover:bg-white"
    >
      Home
    </Link>

    {/* LOGO — CENTER */}
    <Link to="/">
      <img
        src="/images/logo.png"
        alt="ReportIt Logo"
        className="w-auto cursor-pointer h-14 drop-shadow-md"
      />
    </Link>

    {/* LOGOUT — RIGHT */}
    <button
      onClick={handleLogout}
      className="absolute px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-full shadow right-6 hover:bg-red-700"
    >
      Logout
    </button>
  </div>
</nav>


        {/* ================= HEADER ================= */}
        <section className="px-6 pt-32 text-center">
          <div
            className="max-w-4xl p-10 mx-auto shadow-xl bg-white/70 backdrop-blur-md rounded-3xl"
          >
            <h1 className="mb-3 text-4xl font-bold">
              Admin Dashboard
            </h1>
            <p className="text-gray-700">
              Review, manage, and resolve neighbourhood incidents
            </p>
          </div>
        </section>

        {/* ================= STATS ================= */}
        <section className="px-6 mx-auto mt-16 max-w-7xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
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
<section className="max-w-4xl px-6 pb-20 mx-auto">
  <div className="p-8 shadow-xl bg-white/70 backdrop-blur-md rounded-3xl">
    <h2 className="mb-4 text-2xl font-bold">
      Post Community Guideline
    </h2>

    <input
      placeholder="Title"
      value={guideline.title}
      onChange={(e) =>
        setGuideline({ ...guideline, title: e.target.value })
      }
      className="w-full p-3 mb-3 border rounded-xl"
    />

    <textarea
      placeholder="Description"
      value={guideline.description}
      onChange={(e) =>
        setGuideline({ ...guideline, description: e.target.value })
      }
      className="w-full p-3 mb-3 border rounded-xl"
    />

    <input
      placeholder="Venue (optional)"
      value={guideline.venue}
      onChange={(e) =>
        setGuideline({ ...guideline, venue: e.target.value })
      }
      className="w-full p-3 mb-4 border rounded-xl"
    />
    <input
  type="date"
  value={guideline.date}
  onChange={(e) =>
    setGuideline({ ...guideline, date: e.target.value })
  }
  className="w-full p-3 mb-3 border rounded-xl"
/>

<input
  type="time"
  value={guideline.time}
  onChange={(e) =>
    setGuideline({ ...guideline, time: e.target.value })
  }
  className="w-full p-3 mb-3 border rounded-xl"
/>


  <button
  onClick={postGuideline}
  className="px-6 py-2 text-white bg-black rounded-full"
>
  Post Guideline
</button>

  </div>
</section>

<section className="max-w-5xl px-6 pb-32 mx-auto">
  <div className="p-10 shadow-xl bg-white/70 backdrop-blur-md rounded-3xl">
    <h2 className="mb-6 text-2xl font-bold">
      Manage Community Updates
    </h2>

    {guidelinesList.length === 0 ? (
      <p className="text-gray-600">No community updates posted</p>
    ) : (
      <div className="space-y-5">
        {guidelinesList.map((item) => (
          <div
            key={item._id}
            className="flex items-start justify-between gap-6 p-5 bg-white shadow rounded-2xl"
          >
            <div>
              <h3 className="text-lg font-semibold">
                {item.title}
              </h3>

              <p className="mt-1 text-sm text-gray-700">
                {item.description}
              </p>

              {item.venue && (
                <p className="mt-1 text-sm text-gray-600">
                  📍 {item.venue}
                </p>
              )}

              <p className="mt-2 text-xs text-gray-500">
                📅 {new Date(item.eventDateTime).toLocaleString()}
              </p>
            </div>

            <button
              onClick={() => deleteGuideline(item._id)}
              className="px-4 py-2 text-white transition bg-red-600 rounded-full hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
</section>

{/* ================= ADD COMMUNITY EVENT ================= */}
<section className="max-w-4xl px-6 pb-24 mx-auto">
  <div
    className="p-10 shadow-xl bg-white/70 backdrop-blur-md rounded-3xl"
  >
    <h2 className="mb-6 text-2xl font-bold">
      Add Community Event
    </h2>

    <div className="space-y-4">
    <select
  name="category"
  value={eventData.category}
  onChange={handleEventChange}
  className="w-full px-4 py-3 bg-white border rounded-xl focus:outline-none"
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

      <input
        name="title"
        placeholder="Event title"
        value={eventData.title}
        onChange={handleEventChange}
        className="w-full px-4 py-3 border rounded-xl"
      />

      <input
        name="venue"
        placeholder="Venue"
        value={eventData.venue}
        onChange={handleEventChange}
        className="w-full px-4 py-3 border rounded-xl"
      />

      <textarea
        name="description"
        placeholder="Event description"
        value={eventData.description}
        onChange={handleEventChange}
        className="w-full px-4 py-3 border rounded-xl"
      />

     <input
  type="datetime-local"
  name="eventDateTime"
  value={eventData.eventDateTime}
  onChange={handleEventChange}
  className="w-full px-4 py-3 border rounded-xl"
/>


      <button
        onClick={createEvent}
        className="px-6 py-3 text-white transition bg-black rounded-full hover:bg-gray-900"
      >
        Post Event
      </button>
    </div>
  </div>
</section>
<section className="max-w-5xl px-6 pb-32 mx-auto">
  <div className="p-10 shadow-xl bg-white/70 backdrop-blur-md rounded-3xl">
    <h2 className="mb-6 text-2xl font-bold">
      Manage Events
    </h2>

    {events.length === 0 ? (
      <p className="text-gray-600">No events posted</p>
    ) : (
      <div className="space-y-5">
        {events.map((event) => (
          <div
            key={event._id}
            className="flex items-center justify-between p-5 bg-white shadow rounded-2xl"
          >
            <div>
              <p className="font-semibold">
                {event.title} ({event.category})
              </p>
              <p className="text-sm text-gray-600">
                📅 {new Date(event.eventDateTime).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                📍 {event.venue}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => deleteEvent(event._id)}
                className="px-4 py-2 text-white bg-red-600 rounded-full"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</section>
<section className="max-w-6xl px-6 pb-32 mx-auto">
  <div className="p-10 shadow-xl bg-white/70 backdrop-blur-md rounded-3xl">
    <h2 className="mb-6 text-2xl font-bold">
      Messages & Queries Received
    </h2>

    {messages.length === 0 ? (
      <p className="text-gray-600">No messages received</p>
    ) : (
      <div className="space-y-6">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className="flex flex-col gap-4 p-6 bg-white shadow rounded-2xl md:flex-row md:justify-between"
          >
            {/* MESSAGE CONTENT */}
            <div>
              <p className="mb-1 text-lg font-semibold">
                {msg.sentBy?.name}
              </p>

              <p className="mb-2 text-sm text-gray-600">
                📞 {msg.sentBy?.phone} • 🏠 {msg.sentBy?.society}
              </p>

              <p className="text-gray-800">
                {msg.message}
              </p>

              <p className="mt-2 text-xs text-gray-500">
                {new Date(msg.createdAt).toLocaleString()}
              </p>
            </div>

            {/* ACTION */}
            <div className="flex items-start">
              <button
                onClick={() => deleteMessage(msg._id)}
                className="px-4 py-2 text-white bg-red-600 rounded-full hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</section>


{/* ================= PASSWORD RESET REQUESTS ================= */}
<section className="max-w-5xl px-6 pb-32 mx-auto">
  <div className="p-10 shadow-xl bg-white/70 backdrop-blur-md rounded-3xl">
    <h2 className="mb-6 text-2xl font-bold">
      Pending Password Reset Requests
    </h2>

    {resetRequests.length === 0 ? (
      <p className="text-gray-600">
        No pending password reset requests
      </p>
    ) : (
      <div className="space-y-6">
        {resetRequests.map((req) => (
          <div
            key={req._id}
            className="flex flex-col justify-between gap-4 p-6 bg-white shadow rounded-2xl md:flex-row md:items-center"
          >
            {/* USER INFO */}
            <div>
              <p className="text-lg font-semibold">
                {req.user.name}
              </p>
              <p className="text-sm text-gray-600">
                Role: {req.role}
              </p>
              <p className="text-sm text-gray-600">
                📞 {req.phone}
              </p>
            </div>


            {/* PASSWORD INPUT */}
           <div className="relative">
  <input
    type={showNewPassword ? "text" : "password"}
    placeholder="New Password"
    value={newPassword}
    onChange={(e) => setNewPassword(e.target.value)}
    className="w-full px-4 py-3 pr-12 border rounded-xl"
  />

  <button
    type="button"
    onClick={() => setShowNewPassword(!showNewPassword)}
    className="absolute text-sm text-gray-600 -translate-y-1/2 right-4 top-1/2 hover:text-black"
  >
    {showNewPassword ? "🙈" : "👁️"}
  </button>
</div>

            {/* ACTION */}
            <button
              onClick={() =>
                resetUserPassword(req._id, req.phone)
              }
              className="px-6 py-3 text-white bg-black rounded-full"
            >
              Reset Password
            </button>
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
