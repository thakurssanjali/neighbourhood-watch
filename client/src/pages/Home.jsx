import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

// API URL Configuration
const API_BASE_URL = import.meta.env.PROD
  ? "https://neighbourhood-watch-api.onrender.com/api"  // Production: Render backend
  : import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : "http://localhost:5000/api"; // Development: localhost

const EVENT_GIFS = {
  Dance: "/images/event-gifs/dance.gif",
  Concert: "/images/event-gifs/concert.gif",
  Lunch: "/images/event-gifs/lunch.gif",
  "Urgent Meeting": "/images/event-gifs/urgent-meeting.gif",
  Festival: "/images/event-gifs/festival.gif",
  "Casual Gathering": "/images/event-gifs/casual.gif"
};


function Home() {
  // ✅ Hooks MUST be here
  const incidents = []; // Empty incidents (not being populated from any API)
  const [activeStatus, setActiveStatus] = useState(null);
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;
  const [showMembers, setShowMembers] = useState(false);
  const [members, setMembers] = useState([]);
  const [guidelines, setGuidelines] = useState([]);
  const [loadingGuidelines, setLoadingGuidelines] = useState(true);
  const scrollRef = useRef(null);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/guidelines/public`)
      .then((res) => setGuidelines(res.data))
      .catch(() => console.error("Failed to load guidelines"))
      .finally(() => setLoadingGuidelines(false));

  }, []);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/users/public`)
      .then((res) => setMembers(res.data))
      .catch(() => console.error("Failed to load members"));
  }, []);

  useEffect(() => {
    const indicator = document.getElementById("liquid-indicator");
    const firstItem = document.querySelector(".nav-item");

    if (indicator && firstItem) {
      const itemRect = firstItem.getBoundingClientRect();
      const parentRect = firstItem.parentElement.getBoundingClientRect();

      indicator.style.width = `${itemRect.width}px`;
      indicator.style.transform = `translateX(${itemRect.left - parentRect.left}px)`;
    }
  }, []);


  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/events/public`)
      .then((res) => setCalendarEvents(res.data))
      .catch(() => setCalendarEvents([]));
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || guidelines.length === 0) return;

    let scrollSpeed = 0.4;
    let animationFrame;

    const autoScroll = () => {
      if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
        container.scrollTop = 0; // loop back
      } else {
        container.scrollTop += scrollSpeed;
      }
      animationFrame = requestAnimationFrame(autoScroll);
    };

    animationFrame = requestAnimationFrame(autoScroll);

    // Pause on hover
    const stopScroll = () => cancelAnimationFrame(animationFrame);
    const startScroll = () => requestAnimationFrame(autoScroll);

    container.addEventListener("mouseenter", stopScroll);
    container.addEventListener("mouseleave", startScroll);

    return () => {
      cancelAnimationFrame(animationFrame);
      container.removeEventListener("mouseenter", stopScroll);
      container.removeEventListener("mouseleave", startScroll);
    };
  }, [guidelines]);



  // ✅ Derived state (STEP 4) — THIS IS FINE
  const totalCount = incidents.length;
  const pending = incidents.filter((i) => i.status === "Pending");
  const actioning = incidents.filter((i) => i.status === "Actioning");
  const resolved = incidents.filter((i) => i.status === "Resolved");
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Note: firstDay calculation was removed as it's not used in current calendar layout

  const monthDays = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(year, month, i + 1);

    return {
      date,
      events: calendarEvents.filter((e) => {
        const eventDate = new Date(e.eventDateTime);
        return eventDate.toDateString() === date.toDateString();
      })
    };
  });



  return (
    <div className="min-h-screen text-black bg-gradient-to-br from-purple-100 via-yellow-50 to-orange-100 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-black dark:text-gray-100">

      <Navbar />



      {/* ================= HERO SECTION ================= */}
      <section
        className="relative flex items-center justify-center min-h-screen px-6 pt-20 overflow-hidden bg-center bg-cover"
        style={{
          backgroundImage: "url('/images/hero.webp')",
        }}
      >
        {/* Enhanced gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

        <div className="relative z-10 w-full max-w-7xl">
          <div className="grid items-center grid-cols-1 gap-12 md:grid-cols-2">

            {/* ================= LEFT CONTENT ================= */}
            <div className="space-y-8">
              {/* BADGE */}


              {/* MAIN HEADING */}
              <div className="space-y-4">
                <h1 className="text-5xl font-black leading-tight text-white md:text-7xl drop-shadow-xl">
                  Report Issues,<br />
                  Build Safer<br />
                  <span className="text-transparent bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text">Communities</span>
                </h1>

                {/* DESCRIPTION */}
                <p className="max-w-2xl text-lg leading-relaxed text-gray-100 md:text-xl drop-shadow-lg">
                  ReportIT empowers residents to report local issues transparently, track real-time progress, and actively contribute to building safer neighbourhoods.
                </p>
              </div>

              {/* CTA BUTTON WITH ANIMATION */}
              <div className="pt-4">
                <Link
                  to={isLoggedIn ? "/user/dashboard" : "/login"}
                  className="inline-flex items-center gap-3 px-8 py-4 text-lg font-bold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 hover:shadow-2xl hover:scale-105"
                >
                  <span>{isLoggedIn ? " My Dashboard" : " Report an Incident"}</span>
                  <span className="text-xl">→</span>
                </Link>
              </div>

              {/* STATS ROW */}
              <div className="flex gap-8 pt-4">
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-blue-400">{totalCount || 0}</span>
                  <span className="text-sm text-gray-300">Incidents Reported</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-green-400">{members.length || 0}</span>
                  <span className="text-sm text-gray-300">Active Members</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-orange-400">{resolved.length || 0}</span>
                  <span className="text-sm text-gray-300">Issues Resolved</span>
                </div>
              </div>
            </div>

            {/* ================= RIGHT IMAGE CAROUSEL ================= */}
            <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              {/* Glass effect background */}
              <div className="absolute inset-0 z-0 bg-white/10 backdrop-blur-xl" />

              {/* Images container */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                <div className="relative flex w-full h-full animate-infiniteScroll">
                  {/* Original set - 4 images */}
                  {[
                    "/images/awareness1.webp",
                    "/images/awareness2.webp",
                    "/images/awareness3.webp",
                    "/images/awareness4.webp",
                  ].map((img, index) => (
                    <div key={`original-${index}`} className="flex-shrink-0 w-full h-full p-3">
                      <img
                        src={img}
                        alt="Community awareness"
                        className="object-cover w-full h-full rounded-2xl"
                      />
                    </div>
                  ))}

                  {/* Duplicate set - 4 images (for seamless infinite loop) */}
                  {[
                    "/images/awareness1.webp",
                    "/images/awareness2.webp",
                    "/images/awareness3.webp",
                    "/images/awareness4.webp",
                  ].map((img, index) => (
                    <div key={`duplicate-${index}`} className="flex-shrink-0 w-full h-full p-3">
                      <img
                        src={img}
                        alt="Community awareness"
                        className="object-cover w-full h-full rounded-2xl"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Gradient overlay for depth */}
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-3xl" />

              {/* Info badge */}
              <div className="absolute z-20 px-4 py-3 border bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md rounded-xl border-white/20">
                <p className="text-sm font-semibold text-white">
                  ✨ Community Awareness in Action
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= INCIDENT OVERVIEW SECTION ================= */}
      <section
        id="incidents"
        className="relative flex items-center justify-center min-h-screen px-6 py-24 bg-center bg-cover fade-in-section"
        style={{ backgroundImage: "url('/images/totalcards.webp')" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 w-full max-w-6xl">
          {/* HEADING */}
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-6xl font-extrabold text-white drop-shadow-lg">
              Incident Overview
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-100 drop-shadow">
              A real-time snapshot of all reported issues in your neighbourhood,
              including their current status and progress.
            </p>
          </div>

          {/* STATS CARDS */}
          <div className="space-y-8">
            {/* ===== TOTAL INCIDENTS (TOP) ===== */}
            <div className="flex justify-center">
              <div className="w-full sm:w-2/3 lg:w-1/2">
                <div
                  onClick={() => setActiveStatus("Total")}
                  className="relative p-10 overflow-hidden text-center transition-all duration-300 shadow-xl cursor-pointer rounded-2xl bg-white/95 backdrop-blur-md hover:shadow-2xl hover:scale-105 group"
                >
                  {/* GRADIENT ACCENT */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700"></div>

                  <h3 className="mb-3 text-5xl font-bold text-blue-600">
                    {totalCount}
                  </h3>
                  <p className="mb-2 text-xl font-bold text-gray-900">
                    Total Incidents Reported
                  </p>
                  <p className="text-sm text-gray-600">
                    All complaints raised by neighbourhood members
                  </p>
                  <span className="inline-block mt-4 text-sm font-semibold text-blue-600 transition-transform group-hover:translate-x-1">
                    View Details →
                  </span>
                </div>
              </div>
            </div>

            {/* ===== STATUS CARDS ===== */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* PENDING */}
              <div
                onClick={() => setActiveStatus("Pending")}
                className="relative p-8 overflow-hidden text-center transition-all duration-300 shadow-xl cursor-pointer rounded-2xl bg-white/95 backdrop-blur-md hover:shadow-2xl hover:scale-105 group"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>

                <h3 className="mb-2 text-4xl font-bold text-yellow-600">
                  {pending.length}
                </h3>
                <p className="mb-2 text-lg font-bold text-gray-900">Pending</p>
                <p className="mb-4 text-sm text-gray-600">
                  Awaiting verification or admin input
                </p>
                <span className="inline-block text-sm font-semibold text-yellow-600 transition-transform group-hover:translate-x-1">
                  View →
                </span>
              </div>

              {/* ACTIONING */}
              <div
                onClick={() => setActiveStatus("Actioning")}
                className="relative p-8 overflow-hidden text-center transition-all duration-300 shadow-xl cursor-pointer rounded-2xl bg-white/95 backdrop-blur-md hover:shadow-2xl hover:scale-105 group"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-orange-600"></div>

                <h3 className="mb-2 text-4xl font-bold text-orange-600">
                  {actioning.length}
                </h3>
                <p className="mb-2 text-lg font-bold text-gray-900">In Action</p>
                <p className="mb-4 text-sm text-gray-600">
                  Complaints currently being handled
                </p>
                <span className="inline-block text-sm font-semibold text-orange-600 transition-transform group-hover:translate-x-1">
                  View →
                </span>
              </div>

              {/* RESOLVED */}
              <div
                onClick={() => setActiveStatus("Resolved")}
                className="relative p-8 overflow-hidden text-center transition-all duration-300 shadow-xl cursor-pointer rounded-2xl bg-white/95 backdrop-blur-md hover:shadow-2xl hover:scale-105 group"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600"></div>

                <h3 className="mb-2 text-4xl font-bold text-green-600">
                  {resolved.length}
                </h3>
                <p className="mb-2 text-lg font-bold text-gray-900">Resolved</p>
                <p className="mb-4 text-sm text-gray-600">
                  Successfully closed by admin
                </p>
                <span className="inline-block text-sm font-semibold text-green-600 transition-transform group-hover:translate-x-1">
                  View →
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INCIDENTS MODAL */}
      {activeStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-3xl overflow-hidden bg-white shadow-2xl rounded-2xl animate-fadeInUp">
            {/* HEADER WITH GRADIENT */}
            <div className={`p-6 text-white relative ${activeStatus === "Total"
              ? "bg-gradient-to-r from-blue-600 to-blue-800"
              : activeStatus === "Pending"
                ? "bg-gradient-to-r from-yellow-500 to-yellow-700"
                : activeStatus === "Actioning"
                  ? "bg-gradient-to-r from-orange-500 to-orange-700"
                  : "bg-gradient-to-r from-green-600 to-green-800"
              }`}>
              <button
                onClick={() => setActiveStatus(null)}
                className="absolute text-2xl font-bold transition-transform top-4 right-4 hover:scale-110"
              >
                ✕
              </button>

              <h2 className="mb-2 text-3xl font-bold">
                📋 {activeStatus} Incidents
              </h2>
              <p className="text-white/90">
                {(activeStatus === "Total" ? incidents : incidents.filter(i => i.status === activeStatus)).length} incident{(activeStatus === "Total" ? incidents : incidents.filter(i => i.status === activeStatus)).length !== 1 ? "s" : ""} found
              </p>
            </div>

            {/* INCIDENTS LIST */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-50">
              {(activeStatus === "Total" ? incidents : incidents.filter(i => i.status === activeStatus)).length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-lg font-semibold text-gray-500">
                    No incidents in this category
                  </p>
                </div>
              ) : (
                (activeStatus === "Total" ? incidents : incidents.filter(i => i.status === activeStatus)).map((incident) => (
                  <div
                    key={incident._id}
                    className={`border-l-4 bg-gradient-to-r p-5 rounded-lg hover:shadow-md transition-all ${incident.status === "Pending"
                      ? "border-yellow-500 from-yellow-50 to-transparent"
                      : incident.status === "Actioning"
                        ? "border-orange-500 from-orange-50 to-transparent"
                        : "border-green-500 from-green-50 to-transparent"
                      }`}
                  >
                    {/* HEADER WITH STATUS BADGE */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className={`inline-block px-3 py-1 text-xs font-bold text-white rounded-full mb-2 ${incident.status === "Pending"
                          ? "bg-yellow-500"
                          : incident.status === "Actioning"
                            ? "bg-orange-500"
                            : "bg-green-500"
                          }`}>
                          {incident.status}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(incident.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* TITLE */}
                    <h3 className="mb-2 text-lg font-bold text-gray-900">
                      {incident.title}
                    </h3>

                    {/* DESCRIPTION */}
                    <p className="mb-3 text-sm leading-relaxed text-gray-700">
                      {incident.description}
                    </p>

                    {/* REPORTER & TIMESTAMP */}
                    <div className="flex items-center gap-4 mb-3 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <span>👤</span>
                        <span className="font-medium">{incident.reportedBy?.name || "Anonymous"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>🕒</span>
                        <span>{new Date(incident.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                    </div>

                    {/* ADMIN NOTE */}
                    {incident.adminReason && (
                      <div className="p-3 mt-3 text-sm text-yellow-800 bg-yellow-100 border-l-2 border-yellow-500 rounded-lg">
                        <strong className="block mb-1">⚠️ Admin Note:</strong>
                        <span>{incident.adminReason}</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* FOOTER */}
            <div className="flex justify-end px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setActiveStatus(null)}
                className="px-6 py-2 font-semibold text-white transition-colors bg-gray-600 rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


      {/* ================= COMMUNITY UPDATES SECTION ================= */}
      <section
        className="relative flex items-center justify-center min-h-screen px-6 py-24 bg-center bg-cover"
        style={{
          backgroundImage: "url('/images/community-bg.webp')"
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 grid w-full max-w-6xl grid-cols-1 gap-12 lg:grid-cols-2">

          {/* LEFT CONTENT */}
          <div className="flex flex-col justify-center">
            <div className="space-y-6">
              <div>
                <span className="inline-block px-4 py-2 mb-4 text-xs font-bold text-white bg-blue-500 rounded-full">
                  Stay Connected
                </span>
                <h2 className="text-5xl font-extrabold leading-tight text-white lg:text-6xl drop-shadow-lg">
                  Community Updates & Guidelines
                </h2>
              </div>

              <p className="text-xl leading-relaxed text-gray-100 drop-shadow">
                Stay informed about electricity and water updates, upcoming events, lost & found notices, help requests, and important community messages shared by society administrators.
              </p>

              <div className="flex gap-4 pt-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📢</span>
                  <span className="text-gray-100">Real-time Updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🔔</span>
                  <span className="text-gray-100">Important Alerts</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SCROLLABLE CARDS */}
          <div
            ref={scrollRef}
            className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 h-[500px] overflow-y-auto space-y-4 shadow-2xl scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-blue-50"
          >
            {loadingGuidelines ? (
              <div className="flex items-center justify-center h-full">
                <p className="font-semibold text-center text-gray-500">
                  Loading community updates...
                </p>
              </div>
            ) : guidelines.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="font-semibold text-center text-gray-500">
                  No community updates yet
                </p>
              </div>
            ) : (
              guidelines.map((item) => (
                <div
                  key={item._id}
                  className="p-5 transition-all border-l-4 border-blue-500 rounded-lg bg-gradient-to-r from-blue-50 to-transparent hover:shadow-md hover:border-blue-600"
                >
                  {/* BADGE & TIME */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 text-xs font-bold text-white bg-blue-500 rounded-full">
                      {item.category || "Community Update"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* TITLE */}
                  <h3 className="mb-2 text-lg font-bold leading-tight text-gray-900">
                    {item.title}
                  </h3>

                  {/* DESCRIPTION */}
                  <p className="mb-3 text-sm leading-relaxed text-gray-700 line-clamp-3">
                    {item.description}
                  </p>

                  {/* LOCATION & TIME */}
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    {item.venue && (
                      <div className="flex items-center gap-1">
                        <span>�</span>
                        <span className="font-medium">{item.venue}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <span>⏰</span>
                      <span>{new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                  </div>

                  {/* POSTED BY */}
                  <p className="pt-2 mt-3 text-xs text-gray-500 border-t border-gray-200">
                    Posted by <span className="font-semibold text-gray-700">{item.postedBy?.name || "Admin"}</span>
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ================= EVENT CALENDAR ================= */}
      {/* ================= EVENT CALENDAR SECTION ================= */}
      <section
        className="relative min-h-screen px-6 py-24 bg-center bg-cover"
        style={{ backgroundImage: "url('/images/calendar-bg.webp')" }}
      >
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 max-w-6xl mx-auto">

          {/* HEADING */}
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-6xl font-extrabold text-white drop-shadow-lg">
              Community Event Calendar
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-100">
              All neighbourhood events, meetings, celebrations and important
              activities happening this month.
            </p>
          </div>

          {/* MONTH & YEAR HEADER */}
          <div className="flex items-center justify-between px-2 mb-8">
            <h3 className="text-xl font-bold text-white drop-shadow">
              {new Date(year, month).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric"
              })}
            </h3>
            <p className="text-sm text-gray-100">
              {calendarEvents.length} event{calendarEvents.length !== 1 ? "s" : ""} this month
            </p>
          </div>

          {/* WEEKDAYS HEADER */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
              <div key={d} className="text-center">
                <p className="text-sm font-semibold text-white drop-shadow">
                  {d}
                </p>
              </div>
            ))}
          </div>

          {/* CALENDAR GRID */}
          <div className="grid grid-cols-7 gap-2">
            {monthDays.map((day, idx) =>
              day ? (
                <div
                  key={idx}
                  onClick={() => day.events.length > 0 && setSelectedDate(day)}
                  className={`min-h-[140px] rounded-lg p-3 transition-all duration-300 backdrop-blur-md border-2
              ${day.events.length > 0
                      ? "bg-white/95 border-blue-400 shadow-md hover:shadow-lg cursor-pointer hover:scale-102 hover:-translate-y-0.5"
                      : "bg-white/50 border-white/30 hover:bg-white/60"
                    }
            `}
                >
                  {/* DATE NUMBER */}
                  <div className="mb-2">
                    <p className={`text-lg font-bold ${day.events.length > 0 ? "text-blue-600" : "text-gray-500"
                      }`}>
                      {day.date.getDate()}
                    </p>
                    {day.events.length > 0 && (
                      <div className="mt-0.5 flex gap-0.5">
                        {day.events.slice(0, 2).map((ev, i) => (
                          <div
                            key={i}
                            className="h-1.5 w-1.5 rounded-full bg-blue-500"
                          />
                        ))}
                        {day.events.length > 2 && (
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-300" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* EVENTS DISPLAY */}
                  {day.events.length > 0 ? (
                    <div className="space-y-1.5">
                      {day.events.slice(0, 1).map((ev, i) => (
                        <div key={i} className="space-y-1">
                          {/* CATEGORY GIF */}
                          {EVENT_GIFS[ev.category] && (
                            <img
                              src={EVENT_GIFS[ev.category]}
                              alt={ev.category}
                              className="object-cover w-full h-10 rounded-md"
                            />
                          )}

                          {/* EVENT TITLE & CATEGORY */}
                          <div>
                            <p className="text-xs font-semibold text-blue-600 truncate">
                              {ev.category}
                            </p>
                            <p className="text-xs font-bold text-gray-800 truncate">
                              {ev.title}
                            </p>
                          </div>

                          {/* TIME */}
                          <p className="text-xs text-gray-600">
                            🕒 {new Date(ev.eventDateTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </p>
                        </div>
                      ))}

                      {day.events.length > 1 && (
                        <p className="pt-1 text-xs font-semibold text-blue-500 border-t border-blue-100">
                          +{day.events.length - 1}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="mt-4 text-xs text-center text-gray-400">
                      -
                    </p>
                  )}
                </div>
              ) : (
                <div key={idx}></div>
              )
            )}
          </div>

          {/* NO EVENTS MESSAGE */}
          {calendarEvents.length === 0 && (
            <div className="mt-12 text-center">
              <p className="text-xl text-gray-200">
                No events scheduled for this month yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>


      {showMembers && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div
            className="w-full max-w-2xl p-8 shadow-2xl bg-white/80 backdrop-blur-xl rounded-3xl"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                Active Community Members
              </h2>
              <button
                onClick={() => setShowMembers(false)}
                className="text-xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* MEMBERS LIST */}
            {members.length === 0 ? (
              <p className="text-gray-600">
                No members found
              </p>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {members.map((user) => (
                  <div
                    key={user._id}
                    className="p-4 shadow bg-white/70 backdrop-blur-md rounded-2xl"
                  >
                    <p className="text-lg font-semibold">
                      {user.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {user.locality} · {user.society}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {selectedDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-2xl overflow-hidden bg-white shadow-2xl rounded-2xl animate-fadeInUp">
            {/* HEADER WITH GRADIENT */}
            <div className="relative p-6 text-white bg-gradient-to-r from-blue-600 to-blue-800">
              <button
                onClick={() => setSelectedDate(null)}
                className="absolute text-2xl font-bold transition-transform top-4 right-4 hover:scale-110"
              >
                ✕
              </button>

              <h3 className="text-2xl font-bold">
                📅 {selectedDate.date.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric"
                })}
              </h3>
              <p className="mt-1 text-blue-100">
                {selectedDate.events.length} event{selectedDate.events.length !== 1 ? "s" : ""} today
              </p>
            </div>

            {/* EVENTS LIST */}
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-50">
              {selectedDate.events.length === 0 ? (
                <p className="py-10 text-center text-gray-500">
                  No events scheduled for this date
                </p>
              ) : (
                selectedDate.events.map((event, idx) => (
                  <div
                    key={event._id || idx}
                    className="p-5 transition-all border-l-4 border-blue-500 rounded-lg bg-gradient-to-r from-blue-50 to-transparent hover:shadow-md"
                  >
                    {/* EVENT CATEGORY & TIME */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="inline-block px-3 py-1 text-xs font-bold text-white bg-blue-500 rounded-full">
                          {event.category}
                        </span>
                        <p className="mt-2 text-sm text-gray-500">
                          🕒 {new Date(event.eventDateTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </p>
                      </div>
                      {EVENT_GIFS[event.category] && (
                        <img
                          src={EVENT_GIFS[event.category]}
                          alt={event.category}
                          className="object-cover w-12 h-12 rounded-lg"
                        />
                      )}
                    </div>

                    {/* EVENT TITLE */}
                    <h4 className="mb-2 text-lg font-bold text-gray-900">
                      {event.title}
                    </h4>

                    {/* EVENT DESCRIPTION */}
                    {event.description && (
                      <p className="mb-3 text-sm leading-relaxed text-gray-700">
                        {event.description}
                      </p>
                    )}

                    {/* EVENT VENUE */}
                    {event.venue && (
                      <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 rounded-lg bg-white/50">
                        📍 <span className="font-medium">{event.venue}</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* FOOTER */}
            <div className="flex justify-end px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setSelectedDate(null)}
                className="px-6 py-2 font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


      {/* ================= FOOTER ================= */}
      <footer className="relative text-gray-300">

        {/* Background gradient + depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]"></div>
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative grid grid-cols-1 px-6 py-20 mx-auto max-w-7xl md:grid-cols-4 gap-14">

          {/* ===== BRAND ===== */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt="ReportIT Logo"
                className="w-auto h-10"
              />
              <span className="text-xl font-bold text-white">
                ReportIT
              </span>
            </div>

            <p className="max-w-sm text-sm leading-relaxed text-gray-300">
              ReportIT empowers neighbourhoods to stay safer by enabling residents
              and administrators to report, track, and resolve community issues
              transparently.
            </p>

            {/* SOCIAL ICONS */}
            {/* SOCIAL ICONS */}
            <div className="flex gap-4 pt-2">
              {/* Twitter / X */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center w-10 h-10 transition-all duration-300 rounded-full bg-white/10 hover:bg-white/20 hover:scale-110"
                aria-label="Twitter"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-5 h-5 text-white"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675
      0-.178 0-.355-.012-.53A8.348 8.348 0 0 0 22 5.92
      a8.19 8.19 0 0 1-2.357.646
      4.118 4.118 0 0 0 1.804-2.27
      8.224 8.224 0 0 1-2.605.996
      4.107 4.107 0 0 0-6.993 3.743
      11.65 11.65 0 0 1-8.457-4.287
      4.106 4.106 0 0 0 1.27 5.477
      A4.073 4.073 0 0 1 2.8 9.713v.052
      a4.105 4.105 0 0 0 3.292 4.022
      4.095 4.095 0 0 1-1.853.07
      4.108 4.108 0 0 0 3.834 2.85
      A8.233 8.233 0 0 1 2 18.407
      a11.616 11.616 0 0 0 6.29 1.84"/>
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center w-10 h-10 transition-all duration-300 rounded-full bg-white/10 hover:bg-white/20 hover:scale-110"
                aria-label="Facebook"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-5 h-5 text-white"
                >
                  <path d="M22 12a10 10 0 1 0-11.5 9.95v-7.04H8.9V12h1.6
      V9.8c0-1.58.94-2.45 2.38-2.45.69 0 1.41.12 1.41.12v1.56h-.8
      c-.79 0-1.04.49-1.04 1v1.2h1.77l-.28 2.91h-1.49v7.04A10
      10 0 0 0 22 12z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center w-10 h-10 transition-all duration-300 rounded-full bg-white/10 hover:bg-white/20 hover:scale-110"
                aria-label="Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-5 h-5 text-white"
                >
                  <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757
      2.243 5 5 5h10c2.757 0 5-2.243
      5-5V7c0-2.757-2.243-5-5-5H7zm10
      2a3 3 0 0 1 3 3v10a3 3 0 0 1-3
      3H7a3 3 0 0 1-3-3V7a3 3 0 0 1
      3-3h10zm-5 3a5 5 0 1 0 0 10
      5 5 0 0 0 0-10zm0 2a3 3 0 1 1
      0 6 3 3 0 0 1 0-6zm4.5-.9a1.1
      1.1 0 1 0 0 2.2 1.1 1.1 0 0
      0 0-2.2z"/>
                </svg>
              </a>
            </div>

          </div>

          {/* ===== QUICK LINKS ===== */}
          <div>
            <h4 className="mb-6 text-xs font-semibold tracking-widest text-gray-200 uppercase">
              Quick Links
            </h4>

            <ul className="space-y-4 text-sm">
              <li>
                <Link to="/" className="transition group hover:text-white">
                  Home <span className="opacity-60 group-hover:opacity-100">→</span>
                </Link>
              </li>
              <li>
                <Link to="/login" className="transition group hover:text-white">
                  Report an Incident <span className="opacity-60 group-hover:opacity-100">→</span>
                </Link>
              </li>
              <li>
                <Link to="/" className="transition group hover:text-white">
                  Community Updates <span className="opacity-60 group-hover:opacity-100">→</span>
                </Link>
              </li>
              <li>
                <span className="transition cursor-pointer group hover:text-white">
                  Members <span className="opacity-60 group-hover:opacity-100">→</span>
                </span>
              </li>
            </ul>
          </div>

          {/* ===== SUPPORT ===== */}
          <div>
            <h4 className="mb-6 text-xs font-semibold tracking-widest text-gray-200 uppercase">
              Support & Info
            </h4>

            <ul className="space-y-4 text-sm">
              <li>
                <span className="transition cursor-pointer group hover:text-white">
                  Emergency Contacts <span className="opacity-60 group-hover:opacity-100">→</span>
                </span>
              </li>
              <li>
                <span className="transition cursor-pointer group hover:text-white">
                  Privacy Policy <span className="opacity-60 group-hover:opacity-100">→</span>
                </span>
              </li>
              <li>
                <span className="transition cursor-pointer group hover:text-white">
                  Terms & Conditions <span className="opacity-60 group-hover:opacity-100">→</span>
                </span>
              </li>
              <li className="text-xs text-gray-400">
                📍 Designed for neighbourhood communities
              </li>
            </ul>
          </div>

          {/* ===== NEWSLETTER ===== */}
          <div>
            <h4 className="mb-6 text-xs font-semibold tracking-widest text-gray-200 uppercase">
              Stay Updated
            </h4>

            <p className="mb-4 text-sm text-gray-300">
              Get the latest community updates and safety alerts.
            </p>

            <div className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-3 text-white placeholder-gray-300 rounded-full bg-white/10 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />

              <button
                className="px-5 py-3 font-medium text-white transition-all duration-300 bg-teal-500 rounded-full hover:bg-teal-400 hover:shadow-lg"
              >
                Subscribe
              </button>
            </div>
          </div>

        </div>

        {/* ===== BOTTOM BAR ===== */}
        <div className="relative border-t border-white/10">
          <div className="flex flex-col items-center justify-between gap-3 px-6 py-6 mx-auto text-xs text-gray-400 max-w-7xl sm:flex-row">

            <span>
              © {new Date().getFullYear()} ReportIT. All rights reserved.
            </span>

            <span className="tracking-wide">
              Built with ❤️ for safer neighbourhoods
            </span>
          </div>
        </div>
      </footer>


    </div>


  );
}

export default Home;





