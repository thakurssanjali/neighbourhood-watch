import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { userAPI, guidelineAPI, eventAPI, incidentAPI } from "../services/api";
import { Clipboard, User, Bell, MapPin, AlertTriangle, Calendar, Clock, Sparkles } from "lucide-react";

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
  const [incidents, setIncidents] = useState([]);
  const [activeStatus, setActiveStatus] = useState(null);
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  const isLoggedIn = !!token;
  const [showMembers, setShowMembers] = useState(false);
  const [members, setMembers] = useState([]);
  const [guidelines, setGuidelines] = useState([]);
  const [loadingGuidelines, setLoadingGuidelines] = useState(true);
  const scrollRef = useRef(null);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  // Fetch public incidents
  useEffect(() => {
    incidentAPI.getPublic()
      .then((res) => setIncidents(res.data))
      .catch(() => console.error("Failed to load incidents"));
  }, []);

  useEffect(() => {
    guidelineAPI.getPublic()
      .then((res) => setGuidelines(res.data))
      .catch(() => console.error("Failed to load guidelines"))
      .finally(() => setLoadingGuidelines(false));
  }, []);

  useEffect(() => {
    userAPI.getAll()
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
    eventAPI.getPublic()
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
        className="relative flex items-center justify-center min-h-screen px-4 pt-24 md:pt-20 md:px-6 overflow-hidden bg-center bg-cover"
        style={{
          backgroundImage: "url('/images/hero.webp')",
        }}
      >
        {/* Enhanced gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

        <div className="relative z-10 w-full max-w-7xl">
          <div className="grid items-center grid-cols-1 gap-8 md:gap-12 lg:grid-cols-2">

            {/* ================= LEFT CONTENT ================= */}
            <div className="space-y-6 md:space-y-8">
              {/* BADGE */}


              {/* MAIN HEADING */}
              <div className="space-y-3 md:space-y-4">
                <h1 className="text-3xl font-black leading-tight text-white sm:text-4xl md:text-6xl lg:text-7xl drop-shadow-xl">
                  Report Issues,<br />
                  Build Safer<br />
                  <span className="text-transparent bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text">Communities</span>
                </h1>

                {/* DESCRIPTION */}
                <p className="max-w-2xl text-sm leading-relaxed text-gray-100 md:text-lg lg:text-xl drop-shadow-lg">
                  ReportIT empowers residents to report local issues transparently, track real-time progress, and actively contribute to building safer neighbourhoods.
                </p>
              </div>

              {/* CTA BUTTON WITH ANIMATION */}
              <div className="pt-2 md:pt-4">
                <Link
                  to={isLoggedIn ? (userRole === "admin" ? "/admin/dashboard" : "/user/dashboard") : "/login"}
                  className="inline-flex items-center gap-2 px-6 py-3 text-base md:text-lg font-bold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 hover:shadow-2xl md:hover:scale-105"
                >
                  <span>{isLoggedIn ? " My Dashboard" : " Report an Incident"}</span>
                  <span className="text-lg md:text-xl">→</span>
                </Link>
              </div>

              {/* STATS ROW */}
              <div className="flex flex-wrap gap-6 md:gap-8 pt-2 md:pt-4">
                <div className="flex flex-col">
                  <span className="text-2xl md:text-3xl font-bold text-blue-400">{totalCount || 0}</span>
                  <span className="text-xs md:text-sm text-gray-300">Incidents Reported</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl md:text-3xl font-bold text-green-400">{members.length || 0}</span>
                  <span className="text-xs md:text-sm text-gray-300">Active Members</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl md:text-3xl font-bold text-orange-400">{resolved.length || 0}</span>
                  <span className="text-xs md:text-sm text-gray-300">Issues Resolved</span>
                </div>
              </div>
            </div>

            {/* ================= RIGHT IMAGE CAROUSEL ================= */}
            <div className="relative h-64 md:h-96 lg:h-[500px] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl hidden md:block">
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
                <p className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Sparkles className="w-4 h-4" />
                  Community Awareness in Action
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= INCIDENT OVERVIEW SECTION ================= */}
      <section
        id="incidents"
        className="relative flex items-center justify-center min-h-screen px-4 md:px-6 py-16 md:py-24 bg-center bg-cover fade-in-section"
        style={{ backgroundImage: "url('/images/totalcards.webp')" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 w-full max-w-6xl">
          {/* HEADING */}
          <div className="mb-12 md:mb-16 text-center">
            <h2 className="mb-3 md:mb-4 text-4xl md:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-lg">
              Incident Overview
            </h2>
            <p className="max-w-3xl mx-auto text-sm md:text-base lg:text-lg text-gray-100 drop-shadow px-2">
              A real-time snapshot of all reported issues in your neighbourhood,
              including their current status and progress.
            </p>
          </div>

          {/* STATS CARDS */}
          <div className="space-y-6 md:space-y-8">
            {/* ===== TOTAL INCIDENTS (TOP) ===== */}
            <div className="flex justify-center">
              <div className="w-full sm:w-2/3 lg:w-1/2">
                <div
                  onClick={() => setActiveStatus("Total")}
                  className="relative p-6 md:p-10 overflow-hidden text-center transition-all duration-300 shadow-xl cursor-pointer rounded-2xl bg-white/95 backdrop-blur-md hover:shadow-2xl md:hover:scale-105 group"
                >
                  {/* GRADIENT ACCENT */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700"></div>

                  <h3 className="mb-2 md:mb-3 text-4xl md:text-5xl font-bold text-blue-600">
                    {totalCount}
                  </h3>
                  <p className="mb-2 text-base md:text-xl font-bold text-gray-900">
                    Total Incidents Reported
                  </p>
                  <p className="text-xs md:text-sm text-gray-600">
                    All complaints raised by neighbourhood members
                  </p>
                  <span className="inline-block mt-3 md:mt-4 text-xs md:text-sm font-semibold text-blue-600 transition-transform group-hover:translate-x-1">
                    View Details →
                  </span>
                </div>
              </div>
            </div>

            {/* ===== STATUS CARDS ===== */}
            <div className="grid grid-cols-1 gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* PENDING */}
              <div
                onClick={() => setActiveStatus("Pending")}
                className="relative p-6 md:p-8 overflow-hidden text-center transition-all duration-300 shadow-xl cursor-pointer rounded-2xl bg-white/95 backdrop-blur-md hover:shadow-2xl md:hover:scale-105 group"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>

                <h3 className="mb-2 text-3xl md:text-4xl font-bold text-yellow-600">
                  {pending.length}
                </h3>
                <p className="mb-2 text-base md:text-lg font-bold text-gray-900">Pending</p>
                <p className="mb-3 md:mb-4 text-xs md:text-sm text-gray-600">
                  Awaiting verification or admin input
                </p>
                <span className="inline-block text-xs md:text-sm font-semibold text-yellow-600 transition-transform group-hover:translate-x-1">
                  View →
                </span>
              </div>

              {/* ACTIONING */}
              <div
                onClick={() => setActiveStatus("Actioning")}
                className="relative p-6 md:p-8 overflow-hidden text-center transition-all duration-300 shadow-xl cursor-pointer rounded-2xl bg-white/95 backdrop-blur-md hover:shadow-2xl md:hover:scale-105 group"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-orange-600"></div>

                <h3 className="mb-2 text-3xl md:text-4xl font-bold text-orange-600">
                  {actioning.length}
                </h3>
                <p className="mb-2 text-base md:text-lg font-bold text-gray-900">In Action</p>
                <p className="mb-3 md:mb-4 text-xs md:text-sm text-gray-600">
                  Complaints currently being handled
                </p>
                <span className="inline-block text-xs md:text-sm font-semibold text-orange-600 transition-transform group-hover:translate-x-1">
                  View →
                </span>
              </div>

              {/* RESOLVED */}
              <div
                onClick={() => setActiveStatus("Resolved")}
                className="relative p-6 md:p-8 overflow-hidden text-center transition-all duration-300 shadow-xl cursor-pointer rounded-2xl bg-white/95 backdrop-blur-md hover:shadow-2xl md:hover:scale-105 group"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600"></div>

                <h3 className="mb-2 text-3xl md:text-4xl font-bold text-green-600">
                  {resolved.length}
                </h3>
                <p className="mb-2 text-base md:text-lg font-bold text-gray-900">Resolved</p>
                <p className="mb-3 md:mb-4 text-xs md:text-sm text-gray-600">
                  Successfully closed by admin
                </p>
                <span className="inline-block text-xs md:text-sm font-semibold text-green-600 transition-transform group-hover:translate-x-1">
                  View →
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INCIDENTS MODAL */}
      {activeStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 bg-black/60">
          <div className="w-full max-w-2xl md:max-w-3xl overflow-hidden bg-white shadow-2xl rounded-2xl animate-fadeInUp max-h-[90vh] flex flex-col">
            {/* HEADER WITH GRADIENT */}
            <div className={`p-4 md:p-6 text-white relative ${activeStatus === "Total"
              ? "bg-gradient-to-r from-blue-600 to-blue-800"
              : activeStatus === "Pending"
                ? "bg-gradient-to-r from-yellow-500 to-yellow-700"
                : activeStatus === "Actioning"
                  ? "bg-gradient-to-r from-orange-500 to-orange-700"
                  : "bg-gradient-to-r from-green-600 to-green-800"
              }`}>
              <button
                onClick={() => setActiveStatus(null)}
                className="absolute text-2xl font-bold transition-transform top-3 md:top-4 right-3 md:right-4 hover:scale-110"
              >
                ✕
              </button>

              <div className="flex items-center gap-2 mb-2">
                <Clipboard className="w-5 md:w-7 h-5 md:h-7 text-blue-300 flex-shrink-0" />
                <h2 className="text-xl md:text-3xl font-bold">
                  {activeStatus} Incidents
                </h2>
              </div>
              <p className="text-xs md:text-base text-white/90">
                {(activeStatus === "Total" ? incidents : incidents.filter(i => i.status === activeStatus)).length} incident{(activeStatus === "Total" ? incidents : incidents.filter(i => i.status === activeStatus)).length !== 1 ? "s" : ""} found
              </p>
            </div>

            {/* INCIDENTS LIST */}
            <div className="p-4 md:p-6 space-y-3 md:space-y-4 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-50">
              {(activeStatus === "Total" ? incidents : incidents.filter(i => i.status === activeStatus)).length === 0 ? (
                <div className="py-8 md:py-12 text-center">
                  <p className="text-base md:text-lg font-semibold text-gray-500">
                    No incidents in this category
                  </p>
                </div>
              ) : (
                (activeStatus === "Total" ? incidents : incidents.filter(i => i.status === activeStatus)).map((incident) => (
                  <div
                    key={incident._id}
                    className={`border-l-4 bg-gradient-to-r p-3 md:p-5 rounded-lg hover:shadow-md transition-all ${incident.status === "Pending"
                      ? "border-yellow-500 from-yellow-50 to-transparent"
                      : incident.status === "Actioning"
                        ? "border-orange-500 from-orange-50 to-transparent"
                        : "border-green-500 from-green-50 to-transparent"
                      }`}
                  >
                    {/* HEADER WITH STATUS BADGE */}
                    <div className="flex items-start justify-between mb-2 md:mb-3 gap-2">
                      <div>
                        <span className={`inline-block px-2 md:px-3 py-1 text-xs font-bold text-white rounded-full mb-2 ${incident.status === "Pending"
                          ? "bg-yellow-500"
                          : incident.status === "Actioning"
                            ? "bg-orange-500"
                            : "bg-green-500"
                          }`}>
                          {incident.status}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {new Date(incident.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* TITLE */}
                    <h3 className="mb-1 md:mb-2 text-base md:text-lg font-bold text-gray-900">
                      {incident.title}
                    </h3>

                    {/* DESCRIPTION */}
                    <p className="mb-2 md:mb-3 text-xs md:text-sm leading-relaxed text-gray-700">
                      {incident.description}
                    </p>

                    {/* REPORTER & TIMESTAMP */}
                    <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-3 text-xs text-gray-600 flex-wrap">
                      <div className="flex items-center gap-1">
                        <User className="w-3 md:w-4 h-3 md:h-4 flex-shrink-0" />
                        <span className="font-medium">{incident.reportedBy?.name || "Anonymous"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 md:w-4 h-3 md:h-4 flex-shrink-0" />
                        <span>{new Date(incident.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                    </div>

                    {/* ADMIN NOTE */}
                    {incident.adminReason && (
                      <div className="p-2 md:p-3 mt-2 md:mt-3 text-xs md:text-sm text-yellow-800 bg-yellow-100 border-l-2 border-yellow-500 rounded-lg">
                        <div className="flex items-start gap-2 mb-1">
                          <AlertTriangle className="w-3 md:w-4 h-3 md:h-4 mt-0.5 flex-shrink-0" />
                          <strong>Admin Note:</strong>
                        </div>
                        <span>{incident.adminReason}</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}


      {/* ================= COMMUNITY UPDATES SECTION ================= */}
      <section
        className="relative flex items-center justify-center min-h-screen px-4 md:px-6 py-16 md:py-24 bg-center bg-cover"
        style={{
          backgroundImage: "url('/images/community-bg.webp')"
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 grid w-full max-w-6xl grid-cols-1 gap-8 md:gap-12 lg:grid-cols-2">

          {/* LEFT CONTENT */}
          <div className="flex flex-col justify-center">
            <div className="space-y-4 md:space-y-6">
              <div>
                <span className="inline-block px-3 md:px-4 py-2 mb-3 md:mb-4 text-xs font-bold text-white bg-blue-500 rounded-full">
                  Stay Connected
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-white drop-shadow-lg">
                  Community Updates & Guidelines
                </h2>
              </div>

              <p className="text-base md:text-lg lg:text-xl leading-relaxed text-gray-100 drop-shadow">
                Stay informed about electricity and water updates, upcoming events, lost & found notices, help requests, and important community messages shared by society administrators.
              </p>
              <div className="flex flex-col md:flex-row gap-3 md:gap-4 pt-2 md:pt-4">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 md:w-5 h-4 md:h-5 text-yellow-300 flex-shrink-0" />
                  <span className="text-sm md:text-base text-gray-100">Real-time Updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bell className="w-4 md:w-5 h-4 md:h-5 text-yellow-300 flex-shrink-0" />
                  <span className="text-sm md:text-base text-gray-100">Important Alerts</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SCROLLABLE CARDS */}
          <div
            ref={scrollRef}
            className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 md:p-6 h-80 md:h-[500px] overflow-y-auto space-y-4 shadow-2xl scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-blue-50"
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
                        <MapPin className="w-4 h-4" />
                        <span className="font-medium">{item.venue}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
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

      {/* ================= EVENT CALENDAR SECTION ================= */}
      <section
        className="relative min-h-screen px-4 md:px-6 py-16 md:py-24 bg-center bg-cover"
        style={{ backgroundImage: "url('/images/calendar-bg.webp')" }}
      >
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 max-w-6xl mx-auto">

          {/* HEADING */}
          <div className="mb-12 md:mb-16 text-center">
            <h2 className="mb-3 md:mb-4 text-4xl md:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-lg">
              Community Event Calendar
            </h2>
            <p className="max-w-3xl mx-auto text-sm md:text-base lg:text-lg text-gray-100 px-2">
              All neighbourhood events, meetings, celebrations and important
              activities happening this month.
            </p>
          </div>

          {/* MONTH & YEAR HEADER */}
          <div className="flex items-center justify-between px-2 mb-6 md:mb-8">
            <h3 className="text-lg md:text-xl font-bold text-white drop-shadow">
              {new Date(year, month).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric"
              })}
            </h3>
            <p className="text-xs md:text-sm text-gray-100">
              {calendarEvents.length} event{calendarEvents.length !== 1 ? "s" : ""} this month
            </p>
          </div>

          {/* WEEKDAYS HEADER */}
          <div className="grid grid-cols-7 gap-1 md:gap-2 mb-3 md:mb-4">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
              <div key={d} className="text-center">
                <p className="text-xs md:text-sm font-semibold text-white drop-shadow">
                  {d}
                </p>
              </div>
            ))}
          </div>

          {/* CALENDAR GRID */}
          <div className="grid grid-cols-7 gap-1 md:gap-2">
            {monthDays.map((day, idx) =>
              day ? (
                <div
                  key={idx}
                  onClick={() => day.events.length > 0 && setSelectedDate(day)}
                  className={`min-h-20 md:min-h-[140px] rounded-lg p-2 md:p-3 transition-all duration-300 backdrop-blur-md border-2 text-xs md:text-base
              ${day.events.length > 0
                      ? "bg-white/95 border-blue-400 shadow-md hover:shadow-lg cursor-pointer hover:scale-102 hover:-translate-y-0.5"
                      : "bg-white/50 border-white/30 hover:bg-white/60"
                    }
            `}
                >
                  {/* DATE NUMBER */}
                  <div className="mb-1 md:mb-2">
                    <p className={`text-base md:text-lg font-bold ${day.events.length > 0 ? "text-blue-600" : "text-gray-500"
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
                    <div className="space-y-1">
                      {day.events.slice(0, 1).map((ev, i) => (
                        <div key={i} className="space-y-0.5 md:space-y-1">
                          {/* CATEGORY GIF */}
                          {EVENT_GIFS[ev.category] && (
                            <img
                              src={EVENT_GIFS[ev.category]}
                              alt={ev.category}
                              className="object-cover w-full h-6 md:h-10 rounded-md hidden md:block"
                            />
                          )}

                          {/* EVENT TITLE & CATEGORY */}
                          <div className="hidden md:block">
                            <p className="text-xs font-semibold text-blue-600 truncate">
                              {ev.category}
                            </p>
                            <p className="text-xs font-bold text-gray-800 truncate">
                              {ev.title}
                            </p>
                          </div>

                          {/* TIME */}
                          <p className="text-xs text-gray-600 flex items-center gap-1 hidden md:flex">
                            <Clock className="w-3 h-3" /> {new Date(ev.eventDateTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </p>
                        </div>
                      ))}

                      {day.events.length > 1 && (
                        <p className="pt-1 text-xs font-semibold text-blue-500 border-t border-blue-100 hidden md:block">
                          +{day.events.length - 1}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="mt-2 md:mt-4 text-xs text-center text-gray-400">
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
            <div className="mt-8 md:mt-12 text-center">
              <p className="text-base md:text-xl text-gray-200">
                No events scheduled for this month yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>


      {showMembers && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 md:p-4">
          <div
            className="w-full max-w-2xl p-6 md:p-8 shadow-2xl bg-white/80 backdrop-blur-xl rounded-3xl max-h-[90vh] flex flex-col"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-bold">
                Active Community Members
              </h2>
              <button
                onClick={() => setShowMembers(false)}
                className="text-xl md:text-2xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* MEMBERS LIST */}
            {members.length === 0 ? (
              <p className="text-gray-600 text-sm md:text-base">
                No members found
              </p>
            ) : (
              <div className="space-y-3 md:space-y-4 overflow-y-auto flex-1">
                {members.map((user) => (
                  <div
                    key={user._id}
                    className="p-3 md:p-4 shadow bg-white/70 backdrop-blur-md rounded-2xl"
                  >
                    <p className="text-base md:text-lg font-semibold">
                      {user.name}
                    </p>
                    <p className="text-xs md:text-sm text-gray-600">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 bg-black/60">
          <div className="w-full max-w-2xl overflow-hidden bg-white shadow-2xl rounded-2xl animate-fadeInUp max-h-[90vh] flex flex-col">
            {/* HEADER WITH GRADIENT */}
            <div className="relative p-4 md:p-6 text-white bg-gradient-to-r from-blue-600 to-blue-800">
              <button
                onClick={() => setSelectedDate(null)}
                className="absolute text-2xl font-bold transition-transform top-3 md:top-4 right-3 md:right-4 hover:scale-110"
              >
                ✕
              </button>

              <div className="flex items-center gap-2">
                <Calendar className="w-5 md:w-6 h-5 md:h-6 text-blue-300 flex-shrink-0" />
                <h3 className="text-lg md:text-2xl font-bold">
                  {selectedDate.date.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric"
                  })}
                </h3>
              </div>
              <p className="mt-1 text-xs md:text-base text-blue-100">
                {selectedDate.events.length} event{selectedDate.events.length !== 1 ? "s" : ""} today
              </p>
            </div>

            {/* EVENTS LIST */}
            <div className="p-4 md:p-6 space-y-4 md:space-y-5 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-50">
              {selectedDate.events.length === 0 ? (
                <p className="py-8 md:py-10 text-center text-gray-500 text-sm md:text-base">
                  No events scheduled for this date
                </p>
              ) : (
                selectedDate.events.map((event, idx) => (
                  <div
                    key={event._id || idx}
                    className="p-4 md:p-5 transition-all border-l-4 border-blue-500 rounded-lg bg-gradient-to-r from-blue-50 to-transparent hover:shadow-md"
                  >
                    {/* EVENT CATEGORY & TIME */}
                    <div className="flex items-start justify-between mb-2 md:mb-3 gap-2">
                      <div>
                        <span className="inline-block px-2 md:px-3 py-1 text-xs font-bold text-white bg-blue-500 rounded-full">
                          {event.category}
                        </span>
                        <p className="mt-2 text-xs md:text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 md:w-4 h-3 md:h-4 flex-shrink-0" /> {new Date(event.eventDateTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </p>
                      </div>
                      {EVENT_GIFS[event.category] && (
                        <img
                          src={EVENT_GIFS[event.category]}
                          alt={event.category}
                          className="object-cover w-10 md:w-12 h-10 md:h-12 rounded-lg flex-shrink-0"
                        />
                      )}
                    </div>

                    {/* EVENT TITLE */}
                    <h4 className="mb-1 md:mb-2 text-base md:text-lg font-bold text-gray-900">
                      {event.title}
                    </h4>

                    {/* EVENT DESCRIPTION */}
                    {event.description && (
                      <p className="mb-2 md:mb-3 text-xs md:text-sm leading-relaxed text-gray-700">
                        {event.description}
                      </p>
                    )}

                    {/* EVENT VENUE */}
                    {event.venue && (
                      <div className="flex items-center gap-2 px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm text-gray-600 rounded-lg bg-white/50">
                        <MapPin className="w-3 md:w-4 h-3 md:h-4 flex-shrink-0" />
                        <span className="font-medium">{event.venue}</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* FOOTER */}
            <div className="flex justify-end px-4 md:px-6 py-3 md:py-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setSelectedDate(null)}
                className="px-4 md:px-6 py-2 text-sm md:text-base font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
export default Home;