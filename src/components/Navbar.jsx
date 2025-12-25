import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("name");
  const userRole = localStorage.getItem("role");
  const isLoggedIn = !!token;
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <nav className="fixed top-0 left-0 z-50 w-full bg-black/40 md:bg-transparent backdrop-blur-md md:backdrop-blur-none">
      <div className="flex items-center justify-between px-4 py-3 md:px-8 md:py-4">
        {/* LOGO — LEFT */}
        <Link to="/" className="z-30 flex items-center">
          <img
            src="/images/logo.png"
            alt="ReportIT Logo"
            className="w-auto h-12 md:h-16 drop-shadow-md"
          />
        </Link>

        {/* CENTER NAVIGATION PILL - HIDDEN ON MOBILE */}
        <div className="hidden absolute transform -translate-x-1/2 left-1/2 md:block">
          <div className="relative flex items-center gap-6 px-8 py-4 rounded-full glass-nav lg:gap-8 lg:px-12">
            {/* LIQUID INDICATOR */}
            <span id="liquid-indicator" className="liquid-indicator" />

            <NavItem to="/" label="Home" isActive={location.pathname === "/"} onHomeClick={handleHomeClick} />
            <NavItem label="Incidents" onIncidentsClick={handleIncidentsClick} />
            <NavItem to="/members" label="Members" isActive={location.pathname === "/members"} />
            <NavItem to="/contact" label="Contact" isActive={location.pathname === "/contact"} />
            <NavItem to="/about" label="About Us" isActive={location.pathname === "/about"} />
          </div>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="block md:hidden text-white z-40"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* RIGHT AUTH PILL - HIDDEN ON MOBILE */}
        <div className="hidden items-center justify-end md:flex">
          <div className="relative flex items-center gap-2 px-2 py-2.5 rounded-full glass-nav auth-pill md:gap-2 md:px-3 lg:gap-2 lg:px-4">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-white transition rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 lg:px-6"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-blue-600 transition bg-white rounded-full hover:bg-gray-100 lg:px-6"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <span className="hidden px-4 py-2 text-sm font-medium text-white rounded-full lg:block lg:px-6">
                  Hi, {userName}!
                </span>
                <button
                  onClick={handleDashboardClick}
                  className="px-4 py-2 text-sm font-medium text-white transition bg-blue-600 rounded-full hover:bg-blue-700 lg:px-6"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white transition bg-red-600 rounded-full hover:bg-red-700 lg:px-6"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/80 backdrop-blur-md border-t border-white/20">
          <div className="flex flex-col gap-2 px-4 py-4">
            <MobileNavItem
              to="/"
              label="Home"
              isActive={location.pathname === "/"}
              onHomeClick={() => {
                handleHomeClick();
                setMobileMenuOpen(false);
              }}
            />
            <MobileNavItem
              label="Incidents"
              onIncidentsClick={() => {
                handleIncidentsClick();
                setMobileMenuOpen(false);
              }}
            />
            <MobileNavItem
              to="/members"
              label="Members"
              isActive={location.pathname === "/members"}
              onClick={() => setMobileMenuOpen(false)}
            />
            <MobileNavItem
              to="/contact"
              label="Contact"
              isActive={location.pathname === "/contact"}
              onClick={() => setMobileMenuOpen(false)}
            />
            <MobileNavItem
              to="/about"
              label="About Us"
              isActive={location.pathname === "/about"}
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* DIVIDER */}
            <div className="my-2 border-t border-white/20"></div>

            {/* MOBILE AUTH BUTTONS */}
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full px-4 py-2 font-medium text-white transition text-center rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full px-4 py-2 font-medium text-blue-600 transition text-center bg-white rounded-lg hover:bg-gray-100"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <p className="px-4 py-2 text-sm font-medium text-white text-center">
                  Hi, {userName}!
                </p>
                <button
                  onClick={() => {
                    handleDashboardClick();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 font-medium text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  My Dashboard
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 font-medium text-white transition bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

function NavItem({ to, href, label, isActive, onHomeClick, onIncidentsClick }) {
  if (label === "Incidents") {
    // For incidents navigation
    return (
      <button
        onClick={onIncidentsClick}
        className="relative text-sm font-semibold text-gray-100 transition nav-link hover:text-white dark:text-gray-200 dark:hover:text-white lg:text-base"
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
        className="relative text-sm font-semibold text-gray-100 transition nav-link hover:text-white dark:text-gray-200 dark:hover:text-white lg:text-base"
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
      className={`relative text-sm font-semibold transition nav-link lg:text-base ${isActive
        ? "text-white font-bold"
        : "text-gray-100 hover:text-white dark:text-gray-200 dark:hover:text-white"
        }`}
    >
      {label}
    </Link>
  );
}

function MobileNavItem({ to, label, isActive, onHomeClick, onIncidentsClick, onClick }) {
  if (label === "Incidents") {
    return (
      <button
        onClick={onIncidentsClick}
        className="px-4 py-2 text-left font-semibold text-gray-100 transition hover:text-white hover:bg-white/10 rounded-lg"
      >
        {label}
      </button>
    );
  }

  return (
    <Link
      to={to}
      onClick={() => {
        if (to === "/" && onHomeClick) onHomeClick();
        if (onClick) onClick();
      }}
      className={`px-4 py-2 text-left font-semibold transition rounded-lg ${isActive
        ? "text-white bg-blue-600"
        : "text-gray-100 hover:text-white hover:bg-white/10"
        }`}
    >
      {label}
    </Link>
  );
}
