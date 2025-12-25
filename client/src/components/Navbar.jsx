import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("name");
  const isLoggedIn = !!token;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 z-50 w-full pt-6 bg-transparent">
      {/* LOGO — LEFT */}
      <Link to="/" className="absolute z-30 flex items-center left-6 top-6">
        <img
          src="/images/logo.png"
          alt="ReportIT Logo"
          className="w-auto h-14 drop-shadow-md"
        />
      </Link>

      {/* CENTER NAVIGATION PILL */}
      <div className="flex justify-center">
        <div className="relative flex items-center gap-8 px-10 py-3 rounded-full glass-nav">
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
      <div className="absolute right-6 top-6">
        <div className="relative flex items-center gap-5 px-4 py-2 rounded-full glass-nav auth-pill">
          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="px-5 py-2 font-medium text-white transition rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 font-medium text-blue-600 transition rounded-full bg-white hover:bg-gray-100"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <span className="px-5 py-2 font-medium text-white rounded-full">
                Hi, {userName}!
              </span>
              <button
                onClick={handleLogout}
                className="px-5 py-2 font-medium text-white transition rounded-full bg-red-600 hover:bg-red-700"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavItem({ to, href, label }) {
  if (href) {
    // For anchor links
    return (
      <a
        href={href}
        className="relative text-sm font-medium transition text-gray-700 nav-link hover:text-black dark:text-gray-300 dark:hover:text-white"
      >
        {label}
      </a>
    );
  }

  // For router links
  return (
    <Link
      to={to}
      className="relative text-sm font-medium transition text-gray-700 nav-link hover:text-black dark:text-gray-300 dark:hover:text-white"
    >
      {label}
    </Link>
  );
}
