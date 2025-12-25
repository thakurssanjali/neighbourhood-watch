import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("name");
  const userRole = localStorage.getItem("role");
  const isLoggedIn = !!token;
  const navigate = useNavigate();
  const location = useLocation();

  const handleHomeClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleIncidentsClick = () => {
    if (location.pathname === "/") {
      // If already on home page, scroll to incidents section
      const incidentsSection = document.getElementById("incidents");
      if (incidentsSection) {
        incidentsSection.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // If on another page, navigate to home and then scroll
      navigate("/");
      setTimeout(() => {
        const incidentsSection = document.getElementById("incidents");
        if (incidentsSection) {
          incidentsSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  };

  const handleDashboardClick = () => {
    if (userRole === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/user/dashboard");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 z-50 w-full bg-transparent">
      <div className="flex items-center justify-between px-8 py-4">
        {/* LOGO — LEFT */}
        <Link to="/" className="z-30 flex items-center">
          <img
            src="/images/logo.png"
            alt="ReportIT Logo"
            className="w-auto h-20 drop-shadow-md"
          />
        </Link>

        {/* CENTER NAVIGATION PILL */}
        <div className="absolute transform -translate-x-1/2 left-1/2">
          <div className="relative flex items-center gap-8 px-12 py-5 rounded-full glass-nav">
            {/* LIQUID INDICATOR */}
            <span id="liquid-indicator" className="liquid-indicator" />

            <NavItem to="/" label="Home" isActive={location.pathname === "/"} onHomeClick={handleHomeClick} />
            <NavItem label="Incidents" onIncidentsClick={handleIncidentsClick} />
            <NavItem to="/members" label="Members" isActive={location.pathname === "/members"} />
            <NavItem to="/contact" label="Contact" isActive={location.pathname === "/contact"} />
            <NavItem to="/about" label="About Us" isActive={location.pathname === "/about"} />
          </div>
        </div>

        {/* RIGHT AUTH PILL */}
        <div className="flex items-center justify-end h-16">
          <div className="relative flex items-center h-full gap-5 px-8 py-3 rounded-full glass-nav auth-pill">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="px-6 py-2 font-medium text-white transition rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 font-medium text-blue-600 transition bg-white rounded-full hover:bg-gray-100"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <span className="px-6 py-2 font-medium text-white rounded-full">
                  Hi, {userName}!
                </span>
                <button
                  onClick={handleDashboardClick}
                  className="px-6 py-2 font-medium text-white transition bg-blue-600 rounded-full hover:bg-blue-700"
                >
                  My Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 font-medium text-white transition bg-red-600 rounded-full hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavItem({ to, href, label, isActive, onHomeClick, onIncidentsClick }) {
  if (label === "Incidents") {
    // For incidents navigation
    return (
      <button
        onClick={onIncidentsClick}
        className="relative text-base font-semibold text-gray-100 transition nav-link hover:text-white dark:text-gray-200 dark:hover:text-white"
      >
        {label}
      </button>
    );
  }

  if (href) {
    // For anchor links
    return (
      <a
        href={href}
        className="relative text-base font-semibold text-gray-100 transition nav-link hover:text-white dark:text-gray-200 dark:hover:text-white"
      >
        {label}
      </a>
    );
  }

  // For router links
  return (
    <Link
      to={to}
      onClick={to === "/" ? onHomeClick : undefined}
      className={`relative text-base font-semibold transition nav-link ${
        isActive
          ? "text-white font-bold"
          : "text-gray-100 hover:text-white dark:text-gray-200 dark:hover:text-white"
      }`}
    >
      {label}
    </Link>
  );
}
