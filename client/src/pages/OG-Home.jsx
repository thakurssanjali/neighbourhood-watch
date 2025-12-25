import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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
const userName = localStorage.getItem("name");
const isLoggedIn = !!token;
const [showMembers, setShowMembers] = useState(false);
const [members, setMembers] = useState([]);
const [guidelines, setGuidelines] = useState([]);
const [loadingGuidelines, setLoadingGuidelines] = useState(true);
const updatesRef = useRef(null);
const [pauseScroll, setPauseScroll] = useState(false);
const scrollRef = useRef(null);


const [calendarEvents, setCalendarEvents] = useState([]);
const [selectedDate, setSelectedDate] = useState(null);


const fetchMembers = async () => {
  try {
    const res = await axios.get(
      "http://localhost:5000/api/users/public"
    );
    setMembers(res.data);
    setShowMembers(true);
  } catch {
    alert("Failed to load members");
  }
};



  useEffect(() => {
    axios
      .get("http://localhost:5000/api/guidelines/public")
    .then((res) => setGuidelines(res.data))
    .catch(() => console.error("Failed to load guidelines"))
    .finally(() => setLoadingGuidelines(false));

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
let firstDay = new Date(year, month, 1).getDay();
// Convert Sunday (0) → 6, Monday (1) → 0, etc.
firstDay = (firstDay + 6) % 7;

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
    <div className="min-h-screen
bg-gradient-to-br from-purple-100 via-yellow-50 to-orange-100
dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-black
text-black dark:text-gray-100">

{/* ================= NAVBAR ================= */}
<nav className="absolute top-0 left-0 w-full pt-6 z-20">

  {/* LOGO — LEFT */}
  <Link to="/" className="absolute left-6 top-6 z-30 flex items-center">
    <img
      src="/images/logo.png"
      alt="ReportIt Logo"
      className="h-14 w-auto drop-shadow-md"
    />
  </Link>

  {/* CENTER NAVIGATION PILL */}
  <div className="flex justify-center ">
    <div
      className="relative flex items-center gap-8
      px-10 py-3
      rounded-full glass-nav"
    >
      {/* LIQUID INDICATOR */}
      <span id="liquid-indicator" className="liquid-indicator" />

      <NavItem to="/" label="Home" />
      <NavItem href="#incidents" label="Incidents" />
      <NavItem to="/members" label="Members" />
      <NavItem to="/contact" label="Contact" />
      <NavItem to="/about" label="About Us" />
    </div>
  </div>

  {/* RIGHT AUTH PILL */}
{/* RIGHT AUTH PILL */}
<div className="absolute right-6 top-6">
  <div
    className="relative flex items-center gap-5
    px-4 py-2
    rounded-full glass-nav auth-pill"
  >
    {!isLoggedIn ? (
      <>
        <Link
          to="/login"
          className="auth-link relative z-10 text-white/90"
        >
          Log in
        </Link>

        <Link
          to="/register"
          className="auth-cta relative z-10 text-white/90"
        >
          Sign Up
        </Link>

        {/* LIQUID INDICATOR — MUST BE LAST */}
        <span className="auth-liquid" />
      </>
    ) : (
      <>
        <span className="text-sm font-medium text-white/90">
          Hi, {userName}
        </span>

        <button
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
          className="auth-logout"
        >
          Logout
        </button>
      </>
    )}
  </div>
</div>


</nav>



{/* ================= HERO SECTION ================= */}
<section
  className="min-h-screen relative flex items-center px-6 pt-32
  bg-cover bg-center"
  style={{
    backgroundImage: "url('/images/hero.jpg')",
  }}
>
  {/* Subtle overlay */}
  <div className="absolute inset-0 bg-black/45" />

  <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

    {/* ================= LEFT CONTENT ================= */}
    <div>
      <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-8">
        ReportIT
      </h1>

      <p className="text-xl md:text-2xl text-white/90 max-w-xl mb-10 leading-relaxed">
        ReportIT is a community-driven platform that ensures local issues are
        reported, tracked, and resolved transparently. It empowers residents
        to raise concerns, follow real-time progress, and actively contribute
        to building safer neighbourhoods.
      </p>

      <Link
        to={isLoggedIn ? "/user/dashboard" : "/login"}
        className="
          inline-block
          bg-white text-black
          px-8 py-4
          rounded-lg text-lg font-semibold
          transition-all duration-300
          hover:bg-gray-100 hover:shadow-md
        "
      >
        {isLoggedIn ? "My Dashboard" : "Report an Incident"}
      </Link>
    </div>

    {/* ================= RIGHT IMAGE SCROLLER ================= */}
    <div className="relative h-[420px] overflow-hidden rounded-2xl
      bg-white/15 backdrop-blur-lg border border-white/25">

      <div className="absolute inset-0 flex animate-scrollX">
        {[
          "/images/awareness1.jpg",
          "/images/awareness2.jpg",
          "/images/awareness3.jpg",
          "/images/awareness4.jpg",
        ].map((img, index) => (
          <div key={index} className="min-w-full h-full p-4">
            <img
              src={img}
              alt="Community awareness"
              className="w-full h-full object-cover rounded-xl"
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
  className="min-h-screen flex items-center justify-center px-6
  bg-cover bg-center relative fade-in-section"
  style={{ backgroundImage: "url('/images/totalcards.jpg')" }}
>

<div className="absolute inset-0 bg-black/50"></div>


  <div className="max-w-7xl w-full">
    <div className="text-center mb-12">
  <h2 className="text-7xl font-extrabold text-white drop-shadow-lg mb-3">
    Incident Overview
  </h2>

  <p className="text-lg text-gray-200 max-w-2xl mx-auto drop-shadow">
    A real-time snapshot of all reported issues in your neighbourhood,
    including their current status and progress.
  </p>
</div>


    <div className="max-w-7xl w-full mx-auto space-y-10">

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
        <h3 className="text-5xl font-bold text-blue-600 mb-3">
          {totalCount}
        </h3>
        <p className="text-xl font-semibold mb-2">
          Total Incidents Reported
        </p>
        <p className="text-sm text-gray-600">
          All complaints raised by neighbourhood members
        </p>
      </div>
    </div>
  </div>

  {/* ===== OTHER 3 CARDS ===== */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

    {/* PENDING */}
    <div
      onClick={() => setActiveStatus("Pending")}
      className="cursor-pointer rounded-3xl bg-white/70 backdrop-blur-md
      p-8 text-center shadow-xl
      transition-all duration-300
      hover:scale-[1.03] hover:shadow-2xl"
    >
      <h3 className="text-4xl font-bold text-yellow-500 mb-2">
        {pending.length}
      </h3>
      <p className="text-lg font-semibold mb-2">Pending</p>
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
      <h3 className="text-4xl font-bold text-orange-500 mb-2">
        {actioning.length}
      </h3>
      <p className="text-lg font-semibold mb-2">In Action</p>
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
      <h3 className="text-4xl font-bold text-green-600 mb-2">
        {resolved.length}
      </h3>
      <p className="text-lg font-semibold mb-2">Resolved</p>
      <p className="text-sm text-gray-600">
        Successfully closed by admin
      </p>
      
    </div>

  </div>
</div>

  </div>
</section>
{activeStatus && (
 <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
  <div
    className="relative max-w-4xl w-full mx-4
    bg-white/70 backdrop-blur-xl
    rounded-3xl shadow-2xl p-8
    animate-fadeInUp"
  >

      <button
        onClick={() => setActiveStatus(null)}
        className="absolute top-3 right-4 text-xl"
      >
        ✕
      </button>

      <h2 className="text-2xl font-bold mb-4">
        {activeStatus} Incidents
      </h2>

      <div className="space-y-4 max-h-[60vh] overflow-y-auto">
        {(activeStatus === "Total" ? incidents :
          incidents.filter(i => i.status === activeStatus)
        ).map(incident => (
          <div
  key={incident._id}
  className="bg-white/80 backdrop-blur-md
  rounded-2xl p-5 shadow
  transition hover:shadow-lg"
>
  {/* Title */}
  <h3 className="font-semibold text-lg mb-1">
    {incident.title}
  </h3>

  {/* Reporter */}
  <p className="text-sm text-gray-500 mb-2">
    Reported by <span className="font-medium">
      {incident.reportedBy?.name || "Anonymous"}
    </span>
  </p>

  {/* Description */}
  <p className="text-sm text-gray-700 mb-2">
    {incident.description}
  </p>

  {/* Admin Reason (only if pending) */}
  {incident.adminReason && (
    <div className="mt-2 bg-yellow-50 text-yellow-700 text-sm p-2 rounded-lg">
      <strong>Admin note:</strong> {incident.adminReason}
    </div>
  )}

  {/* Timestamp */}
  <p className="text-xs text-gray-400 mt-2">
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
  className="min-h-screen flex items-center justify-center px-6
  bg-cover bg-center relative"
  style={{
    backgroundImage: "url('/images/community-bg.jpg')"
  }}
>
<div className="absolute inset-0 bg-black/60"></div>





  <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10
">

    {/* LEFT CONTENT */}
    <div
  className="bg-white/10 backdrop-blur-xl
  rounded-3xl p-10 max-w-lg
  text-white shadow-2xl"
>
  <h2 className="text-5xl font-extrabold leading-tight mb-6 drop-shadow-lg">
    COMMUNITY<br />UPDATES &<br />Guidelines
  </h2>

  <p className="text-xl text-gray-200 leading-relaxed drop-shadow">
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
  <p className="text-white text-center mt-24">
    Loading community updates...
  </p>
) : guidelines.length === 0 ? (
  <p className="text-white text-center mt-24">
    No community updates yet
  </p>
) : (
  guidelines.map((item) => (
    <div
      key={item._id}
      className="bg-white/80 backdrop-blur-md
      rounded-2xl p-5 shadow"
    >
      <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
        Community Update
      </span>

      <h3 className="font-semibold text-lg mt-3">
        {item.title}
      </h3>

      <p className="text-sm text-gray-700 mt-2">
        {item.description}
      </p>

      {item.venue && (
        <p className="text-xs text-gray-600 mt-2">
          📍 {item.venue}
        </p>
      )}

      <p className="text-xs text-gray-500 mt-3">
        📅 {new Date(item.createdAt).toLocaleDateString()} •{" "}
        ⏰ {new Date(item.createdAt).toLocaleTimeString()}
      </p>

      <p className="text-xs text-gray-400 mt-1">
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
  className="min-h-screen px-6 py-24 bg-cover bg-center relative"
  style={{ backgroundImage: "url('/images/calendar-bg.jpg')" }}
>
  <div className="absolute inset-0 bg-black/30"></div>

  <div className="relative z-10 max-w-7xl mx-auto">

    {/* HEADING */}
    <div className="text-center mb-14">
      <h2 className="text-6xl font-extrabold text-white drop-shadow mb-4">
        Community Event Calendar
      </h2>
      <p className="text-lg text-gray-200 max-w-3xl mx-auto">
        All neighbourhood events, meetings, celebrations and important
        activities happening this month.
      </p>
    </div>

    {/* WEEKDAYS */}
    <div className="grid grid-cols-7 text-center text-gray-300 mb-4 font-semibold">
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
            className="perspective cursor-pointer"
          >
            <div className="flip-card relative min-h-[140px] rounded-3xl">

              {/* FRONT */}
              <div className="flip-face absolute inset-0 bg-white/80 backdrop-blur-md rounded-3xl p-4 shadow-xl">
                <p className="font-bold text-lg mb-2">
                  {day.date.getDate()}
                </p>
{day.events.slice(0, 1).map((ev, i) => (
  <div key={i} className="relative mt-2">

    {/* CATEGORY GIF */}
    {EVENT_GIFS[ev.category] && (
      <img
        src={EVENT_GIFS[ev.category]}
        alt={ev.category}
        className="w-full h-16 object-cover rounded-xl mb-2"
      />
    )}

    {/* CATEGORY + TITLE */}
    <div className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 truncate">
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
                    <p className="font-semibold text-sm truncate mb-1">
                      {day.events[0].title}
                    </p>
                    <p className="text-xs text-gray-300">
                      📍 {day.events[0].venue}
                    </p>
                    <p className="text-xs text-gray-300 mb-2">
                      🕒{" "}
                      {new Date(
                        day.events[0].eventDateTime
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>
                    <p className="text-xs text-gray-400 italic">
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
      className="w-full max-w-2xl
      bg-white/80 backdrop-blur-xl
      rounded-3xl shadow-2xl p-8"
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
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
              className="bg-white/70 backdrop-blur-md
              rounded-2xl p-4 shadow"
            >
              <p className="font-semibold text-lg">
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
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
    <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl">
      <button
        onClick={() => setSelectedDate(null)}
        className="absolute top-4 right-6 text-xl"
      >
        ✕
      </button>

      <h3 className="text-2xl font-bold mb-4">
        Events on {selectedDate.date.toDateString()}
      </h3>

      <div className="space-y-4 max-h-[60vh] overflow-y-auto">
        {selectedDate.events.map((event) => (
          <div
            key={event._id}
            className="bg-gray-100 rounded-xl p-4"
          >
            <h4 className="font-semibold">{event.title}</h4>
            <p className="text-sm text-gray-600">{event.description}</p>
            <p className="text-xs text-gray-500 mt-2">
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

  <div className="relative max-w-7xl mx-auto px-6 py-20
    grid grid-cols-1 md:grid-cols-4 gap-14">

    {/* ===== BRAND ===== */}
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <img
          src="/images/logo.png"
          alt="ReportIT Logo"
          className="h-10 w-auto"
        />
        <span className="text-xl font-bold text-white">
          ReportIT
        </span>
      </div>

      <p className="text-sm text-gray-300 leading-relaxed max-w-sm">
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
    className="w-10 h-10 rounded-full bg-white/10
    flex items-center justify-center
    transition-all duration-300
    hover:bg-white/20 hover:scale-110"
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
    className="w-10 h-10 rounded-full bg-white/10
    flex items-center justify-center
    transition-all duration-300
    hover:bg-white/20 hover:scale-110"
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
    className="w-10 h-10 rounded-full bg-white/10
    flex items-center justify-center
    transition-all duration-300
    hover:bg-white/20 hover:scale-110"
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
      <h4 className="text-xs font-semibold tracking-widest text-gray-200 uppercase mb-6">
        Quick Links
      </h4>

      <ul className="space-y-4 text-sm">
        <li>
          <Link to="/" className="group hover:text-white transition">
            Home <span className="opacity-60 group-hover:opacity-100">→</span>
          </Link>
        </li>
        <li>
          <Link to="/login" className="group hover:text-white transition">
            Report an Incident <span className="opacity-60 group-hover:opacity-100">→</span>
          </Link>
        </li>
        <li>
          <Link to="/" className="group hover:text-white transition">
            Community Updates <span className="opacity-60 group-hover:opacity-100">→</span>
          </Link>
        </li>
        <li>
          <span className="group cursor-pointer hover:text-white transition">
            Members <span className="opacity-60 group-hover:opacity-100">→</span>
          </span>
        </li>
      </ul>
    </div>

    {/* ===== SUPPORT ===== */}
    <div>
      <h4 className="text-xs font-semibold tracking-widest text-gray-200 uppercase mb-6">
        Support & Info
      </h4>

      <ul className="space-y-4 text-sm">
        <li>
          <span className="group cursor-pointer hover:text-white transition">
            Emergency Contacts <span className="opacity-60 group-hover:opacity-100">→</span>
          </span>
        </li>
        <li>
          <span className="group cursor-pointer hover:text-white transition">
            Privacy Policy <span className="opacity-60 group-hover:opacity-100">→</span>
          </span>
        </li>
        <li>
          <span className="group cursor-pointer hover:text-white transition">
            Terms & Conditions <span className="opacity-60 group-hover:opacity-100">→</span>
          </span>
        </li>
        <li className="text-gray-400 text-xs">
          📍 Designed for neighbourhood communities
        </li>
      </ul>
    </div>

    {/* ===== NEWSLETTER ===== */}
    <div>
      <h4 className="text-xs font-semibold tracking-widest text-gray-200 uppercase mb-6">
        Stay Updated
      </h4>

      <p className="text-sm text-gray-300 mb-4">
        Get the latest community updates and safety alerts.
      </p>

      <div className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Your email address"
          className="px-4 py-3 rounded-full
          bg-white/10 text-white placeholder-gray-300
          focus:outline-none focus:ring-2 focus:ring-teal-400"
        />

        <button
          className="bg-teal-500 text-white
          px-5 py-3 rounded-full font-medium
          transition-all duration-300
          hover:bg-teal-400 hover:shadow-lg"
        >
          Subscribe
        </button>
      </div>
    </div>

  </div>

  {/* ===== BOTTOM BAR ===== */}
  <div className="relative border-t border-white/10">
    <div className="max-w-7xl mx-auto px-6 py-6
      flex flex-col sm:flex-row
      items-center justify-between gap-3
      text-xs text-gray-400">

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


function NavItem({ to, href, label }) {
  const Component = to ? Link : "a";

const handleHover = (e) => {
  const indicator = document.getElementById("liquid-indicator");
  const rect = e.currentTarget.getBoundingClientRect();
  const parentRect = e.currentTarget.parentElement.getBoundingClientRect();

  indicator.style.width = `${rect.width}px`;
  indicator.style.transform =
    `translate3d(${rect.left - parentRect.left}px, 0, 0)`;
};

  return (
    <Component
      to={to}
      href={href}
      onMouseEnter={handleHover}
      className="
  nav-item relative z-10
  px-4 py-2
  text-white/90
  transition-all duration-300
  hover:scale-110 hover:text-white
"

    >
      {label}
    </Component>
  );
}

export default Home;





