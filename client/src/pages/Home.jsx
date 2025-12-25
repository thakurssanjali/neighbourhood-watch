import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

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
      .get("http://localhost:5000/api/guidelines/public")
    .then((res) => setGuidelines(res.data))
    .catch(() => console.error("Failed to load guidelines"))
    .finally(() => setLoadingGuidelines(false));

  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users/public")
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
    .get("http://localhost:5000/api/events/public")
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
{/* ================= HERO SECTION ================= */}
<section
  className="relative flex items-center min-h-screen px-6 pt-32 overflow-hidden bg-center bg-cover"
  style={{
    backgroundImage: "url('/images/hero.webp')",
  }}
>
  {/* Subtle overlay */}
  <div className="absolute inset-0 bg-black/45" />

  <div className="relative z-10 grid items-center grid-cols-1 gap-16 mx-auto max-w-7xl md:grid-cols-2">

    {/* ================= LEFT CONTENT ================= */}
    <div>
      <h1 className="mb-8 text-6xl font-extrabold text-white md:text-7xl">
        ReportIT
      </h1>

      <p className="max-w-xl mb-10 text-xl leading-relaxed md:text-2xl text-white/90">
        ReportIT is a community-driven platform that ensures local issues are
        reported, tracked, and resolved transparently. It empowers residents
        to raise concerns, follow real-time progress, and actively contribute
        to building safer neighbourhoods.
      </p>

      <Link
        to={isLoggedIn ? "/user/dashboard" : "/login"}
        className="inline-block px-8 py-4 text-lg font-semibold text-black transition-all duration-300 bg-white rounded-lg hover:bg-gray-100 hover:shadow-md"
      >
        {isLoggedIn ? "My Dashboard" : "Report an Incident"}
      </Link>
    </div>

    {/* ================= RIGHT IMAGE SCROLLER ================= */}
    <div className="relative h-[420px] overflow-hidden rounded-2xl 
      bg-white/15 backdrop-blur-lg border border-white/25">

      <div className="absolute inset-0 flex animate-scrollX">
        {[
          "/images/awareness1.webp",
          "/images/awareness2.webp",
          "/images/awareness3.webp",
          "/images/awareness4.webp",
        ].map((img, index) => (
          <div key={index} className="h-full min-w-full p-4">
            <img
              src={img}
              alt="Community awareness"
              className="object-cover w-full h-full rounded-xl"
            />
          </div>
        ))}
      </div>
    </div>

  </div>
</section>

     {/* ================= INCIDENT OVERVIEW SECTION ================= */}
<section
  id="incidents"
  className="relative flex items-center justify-center min-h-screen px-6 bg-center bg-cover fade-in-section"
  style={{ backgroundImage: "url('/images/totalcards.webp')" }}
>

<div className="absolute inset-0 bg-black/50"></div>


  <div className="w-full max-w-7xl">
    <div className="mb-12 text-center">
  <h2 className="mb-3 font-extrabold text-white text-7xl drop-shadow-lg">
    Incident Overview
  </h2>

  <p className="max-w-2xl mx-auto text-lg text-gray-200 drop-shadow">
    A real-time snapshot of all reported issues in your neighbourhood,
    including their current status and progress.
  </p>
</div>


    <div className="w-full mx-auto space-y-10 max-w-7xl">

  {/* ===== TOTAL INCIDENTS (TOP) ===== */}
  <div className="flex justify-center">
    <div className="w-full sm:w-2/3 lg:w-1/2">
      {/* TOTAL INCIDENT CARD */}
      <div
        onClick={() => setActiveStatus("Total")}
        className="cursor-pointer rounded-3xl bg-white/70 backdrop-blur-md
        p-10 text-center shadow-xl
        transition-all duration-300
        hover:scale-[1.03] hover:shadow-2xl"
      >
        <h3 className="mb-3 text-5xl font-bold text-blue-600">
          {totalCount}
        </h3>
        <p className="mb-2 text-xl font-semibold">
          Total Incidents Reported
        </p>
        <p className="text-sm text-gray-600">
          All complaints raised by neighbourhood members
        </p>
      </div>
    </div>
  </div>

  {/* ===== OTHER 3 CARDS ===== */}
  <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">

    {/* PENDING */}
    <div
      onClick={() => setActiveStatus("Pending")}
      className="cursor-pointer rounded-3xl bg-white/70 backdrop-blur-md
      p-8 text-center shadow-xl
      transition-all duration-300
      hover:scale-[1.03] hover:shadow-2xl"
    >
      <h3 className="mb-2 text-4xl font-bold text-yellow-500">
        {pending.length}
      </h3>
      <p className="mb-2 text-lg font-semibold">Pending</p>
      <p className="text-sm text-gray-600">
        Awaiting verification or admin input
      </p>
    </div>

    {/* ACTIONING */}
    <div
      onClick={() => setActiveStatus("Actioning")}
      className="cursor-pointer rounded-3xl bg-white/70 backdrop-blur-md
      p-8 text-center shadow-xl
      transition-all duration-300
      hover:scale-[1.03] hover:shadow-2xl"
    >
      <h3 className="mb-2 text-4xl font-bold text-orange-500">
        {actioning.length}
      </h3>
      <p className="mb-2 text-lg font-semibold">In Action</p>
      <p className="text-sm text-gray-600">
        Complaints currently being handled
      </p>
    </div>

    {/* RESOLVED */}
    <div
      onClick={() => setActiveStatus("Resolved")}
      className="cursor-pointer rounded-3xl bg-white/70 backdrop-blur-md
      p-8 text-center shadow-xl
      transition-all duration-300
      hover:scale-[1.03] hover:shadow-2xl"
    >
      <h3 className="mb-2 text-4xl font-bold text-green-600">
        {resolved.length}
      </h3>
      <p className="mb-2 text-lg font-semibold">Resolved</p>
      <p className="text-sm text-gray-600">
        Successfully closed by admin
      </p>
      
    </div>

  </div>
</div>

  </div>
</section>
{activeStatus && (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
  <div
    className="relative w-full max-w-4xl p-8 mx-4 shadow-2xl bg-white/70 backdrop-blur-xl rounded-3xl animate-fadeInUp"
  >

      <button
        onClick={() => setActiveStatus(null)}
        className="absolute text-xl top-3 right-4"
      >
        ✕
      </button>

      <h2 className="mb-4 text-2xl font-bold">
        {activeStatus} Incidents
      </h2>

      <div className="space-y-4 max-h-[60vh] overflow-y-auto">
        {(activeStatus === "Total" ? incidents :
          incidents.filter(i => i.status === activeStatus)
        ).map(incident => (
          <div
  key={incident._id}
  className="p-5 transition shadow bg-white/80 backdrop-blur-md rounded-2xl hover:shadow-lg"
>
  {/* Title */}
  <h3 className="mb-1 text-lg font-semibold">
    {incident.title}
  </h3>

  {/* Reporter */}
  <p className="mb-2 text-sm text-gray-500">
    Reported by <span className="font-medium">
      {incident.reportedBy?.name || "Anonymous"}
    </span>
  </p>

  {/* Description */}
  <p className="mb-2 text-sm text-gray-700">
    {incident.description}
  </p>

  {/* Admin Reason (only if pending) */}
  {incident.adminReason && (
    <div className="p-2 mt-2 text-sm text-yellow-700 rounded-lg bg-yellow-50">
      <strong>Admin note:</strong> {incident.adminReason}
    </div>
  )}

  {/* Timestamp */}
  <p className="mt-2 text-xs text-gray-400">
    {new Date(incident.createdAt).toLocaleString()}
  </p>
</div>

        ))}
      </div>
    </div>
  </div>
)}


{/* ================= COMMUNITY UPDATES SECTION ================= */}
<section
  className="relative flex items-center justify-center min-h-screen px-6 bg-center bg-cover"
  style={{
    backgroundImage: "url('/images/community-bg.webp')"
  }}
>
<div className="absolute inset-0 bg-black/60"></div>





  <div className="relative z-10 grid w-full grid-cols-1 gap-12 max-w-7xl lg:grid-cols-2 ">

    {/* LEFT CONTENT */}
    <div
  className="max-w-lg p-10 text-white shadow-2xl bg-white/10 backdrop-blur-xl rounded-3xl"
>
  <h2 className="mb-6 text-5xl font-extrabold leading-tight drop-shadow-lg">
    COMMUNITY<br />UPDATES &<br />Guidelines
  </h2>

  <p className="text-xl leading-relaxed text-gray-200 drop-shadow">
    Stay informed about electricity and water updates, upcoming events,
    lost & found notices, help requests, and important community messages
    shared by society administrators.
  </p>
</div>


    {/* RIGHT SCROLLABLE CARDS */}
 <div
  ref={scrollRef}
  className="bg-white/10 backdrop-blur-lg rounded-3xl
  p-6 h-[420px] overflow-y-auto space-y-5
  scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
>


{loadingGuidelines ? (
  <p className="mt-24 text-center text-white">
    Loading community updates...
  </p>
) : guidelines.length === 0 ? (
  <p className="mt-24 text-center text-white">
    No community updates yet
  </p>
) : (
  guidelines.map((item) => (
    <div
      key={item._id}
      className="p-5 shadow bg-white/80 backdrop-blur-md rounded-2xl"
    >
      <span className="px-3 py-1 text-xs text-indigo-700 bg-indigo-100 rounded-full">
        Community Update
      </span>

      <h3 className="mt-3 text-lg font-semibold">
        {item.title}
      </h3>

      <p className="mt-2 text-sm text-gray-700">
        {item.description}
      </p>

      {item.venue && (
        <p className="mt-2 text-xs text-gray-600">
          📍 {item.venue}
        </p>
      )}

      <p className="mt-3 text-xs text-gray-500">
        📅 {new Date(item.createdAt).toLocaleDateString()} •{" "}
        ⏰ {new Date(item.createdAt).toLocaleTimeString()}
      </p>

      <p className="mt-1 text-xs text-gray-400">
        Posted by {item.postedBy?.name || "Admin"}
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
  <div className="absolute inset-0 bg-black/30"></div>

  <div className="relative z-10 mx-auto max-w-7xl">

    {/* HEADING */}
    <div className="text-center mb-14">
      <h2 className="mb-4 text-6xl font-extrabold text-white drop-shadow">
        Community Event Calendar
      </h2>
      <p className="max-w-3xl mx-auto text-lg text-gray-200">
        All neighbourhood events, meetings, celebrations and important
        activities happening this month.
      </p>
    </div>

    {/* WEEKDAYS */}
    <div className="grid grid-cols-7 mb-4 font-semibold text-center text-gray-300">
{["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => (
        <div key={d}>{d}</div>
      ))}
    </div>

    {/* CALENDAR GRID */}
    <div className="grid grid-cols-7 gap-5">

      {monthDays.map((day, idx) =>
        day ? (
          <div
            key={idx}
            onClick={() => day.events.length && setSelectedDate(day)}
            className="cursor-pointer perspective"
          >
            <div className="flip-card relative min-h-[140px] rounded-3xl">

              {/* FRONT */}
              <div className="absolute inset-0 p-4 shadow-xl flip-face bg-white/80 backdrop-blur-md rounded-3xl">
                <p className="mb-2 text-lg font-bold">
                  {day.date.getDate()}
                </p>
{day.events.slice(0, 1).map((ev, i) => (
  <div key={i} className="relative mt-2">

    {/* CATEGORY GIF */}
    {EVENT_GIFS[ev.category] && (
      <img
        src={EVENT_GIFS[ev.category]}
        alt={ev.category}
        className="object-cover w-full h-16 mb-2 rounded-xl"
      />
    )}

    {/* CATEGORY + TITLE */}
    <div className="px-2 py-1 text-xs text-blue-700 truncate bg-blue-100 rounded-full">
      {ev.category} • {ev.title}
    </div>
  </div>
))}


                {day.events.length > 2 && (
                  <p className="text-xs text-gray-500">
                    +{day.events.length - 2} more
                  </p>
                )}
              </div>

              {/* BACK */}
              <div className="flip-face flip-back absolute inset-0 bg-[#1e3d4b] text-white rounded-3xl p-4 flex flex-col justify-center">
                {day.events.length ? (
                  <>
                    <p className="mb-1 text-sm font-semibold truncate">
                      {day.events[0].title}
                    </p>
                    <p className="text-xs text-gray-300">
                      📍 {day.events[0].venue}
                    </p>
                    <p className="mb-2 text-xs text-gray-300">
                      🕒{" "}
                      {new Date(
                        day.events[0].eventDateTime
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>
                    <p className="text-xs italic text-gray-400">
                      Click for details →
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-gray-300">
                    No events
                  </p>
                )}
              </div>

            </div>
          </div>
        ) : (
          <div key={idx}></div>
        )
      )}

    </div>
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
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="w-full max-w-lg p-8 bg-white shadow-2xl rounded-3xl">
      <button
        onClick={() => setSelectedDate(null)}
        className="absolute text-xl top-4 right-6"
      >
        ✕
      </button>

      <h3 className="mb-4 text-2xl font-bold">
        Events on {selectedDate.date.toDateString()}
      </h3>

      <div className="space-y-4 max-h-[60vh] overflow-y-auto">
        {selectedDate.events.map((event) => (
          <div
            key={event._id}
            className="p-4 bg-gray-100 rounded-xl"
          >
            <h4 className="font-semibold">{event.title}</h4>
            <p className="text-sm text-gray-600">{event.description}</p>
            <p className="mt-2 text-xs text-gray-500">
              📍 {event.venue}
            </p>
          </div>
        ))}
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





