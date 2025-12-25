import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <section
        className="relative flex items-center justify-center w-full h-screen bg-fixed bg-center bg-cover"
        style={{ backgroundImage: "url('/images/hero.webp')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/50 to-transparent"></div>

        <div className="relative z-10 max-w-4xl px-6">
          <div className="inline-block px-4 py-2 mb-6 border rounded-full bg-white/15 border-white/30 backdrop-blur-md">
            <span className="text-sm font-semibold text-white drop-shadow-lg">About ReportIT</span>
          </div>

          <h1 className="mb-6 text-6xl font-black leading-tight text-white md:text-7xl lg:text-8xl drop-shadow-2xl">
            Building Safer Communities Together
          </h1>

          <p className="max-w-2xl text-lg leading-relaxed text-gray-100 md:text-2xl drop-shadow-xl">
            ReportIT empowers neighbourhoods through transparency, accountability, and community collaboration.
          </p>
        </div>
      </section>

      {/* ================= MISSION & VALUES ================ */}
      <section className="relative px-6 py-24 text-gray-100">
        {/* Dark background matching footer */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]"></div>
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative max-w-6xl mx-auto">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* OUR MISSION */}
            <div className="p-10 transition-all border shadow-sm bg-white/10 backdrop-blur-md rounded-3xl border-white/20 hover:shadow-md">
              <div className="mb-4 text-4xl">🎯</div>
              <h2 className="mb-4 text-3xl font-bold text-white">
                Our Mission
              </h2>
              <p className="text-lg leading-relaxed text-gray-200">
                ReportIT empowers residents to report incidents, track progress, and stay informed about what's happening in their neighbourhood. We bridge the gap between citizens and administrators by providing a transparent, real-time issue management platform.
              </p>
            </div>

            {/* WHY REPORTIT */}
            <div className="p-10 transition-all border shadow-sm bg-white/10 backdrop-blur-md rounded-3xl border-white/20 hover:shadow-md">
              <div className="mb-4 text-4xl">✨</div>
              <h2 className="mb-4 text-3xl font-bold text-white">
                Why ReportIT?
              </h2>
              <ul className="space-y-3 text-lg text-gray-200">
                <li className="flex items-center gap-3">
                  <span className="font-bold text-blue-400">✓</span>
                  <span>Transparent incident tracking</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="font-bold text-blue-400">✓</span>
                  <span>Verified admin actions & remarks</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="font-bold text-blue-400">✓</span>
                  <span>Centralized community updates</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="font-bold text-blue-400">✓</span>
                  <span>Event calendar for activities</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="font-bold text-blue-400">✓</span>
                  <span>Secure role-based access</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="relative px-6 py-24 text-gray-100">
        {/* Dark background matching footer */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]"></div>
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-black text-white md:text-5xl">
              How It Works
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-300">
              A simple, structured workflow that keeps everyone informed and accountable.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: "📝",
                title: "Report",
                desc: "Residents report incidents with full details from their dashboard.",
                step: "1"
              },
              {
                icon: "⚙️",
                title: "Action",
                desc: "Admins review, take action, and add official remarks.",
                step: "2"
              },
              {
                icon: "✅",
                title: "Resolve",
                desc: "Resolved issues are published transparently for everyone.",
                step: "3"
              }
            ].map((item, i) => (
              <div
                key={i}
                className="p-12 pt-20 transition-all border shadow-sm bg-white/10 backdrop-blur-md rounded-3xl border-white/20 hover:shadow-md group"
              >
                {/* STEP NUMBER - POSITIONED IN HEADER */}
                <div className="absolute flex items-center justify-center w-10 h-10 text-sm font-bold text-white rounded-full shadow-md top-6 right-6 bg-gradient-to-r from-blue-500 to-blue-600">
                  {item.step}
                </div>

                {/* ICON */}
                <div className="mb-6 text-6xl transition-transform group-hover:scale-110">
                  {item.icon}
                </div>

                {/* CONTENT */}
                <h3 className="mb-4 text-2xl font-bold text-white">
                  {item.title}
                </h3>
                <p className="text-base leading-relaxed text-gray-300">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= COMMUNITY FIRST ================= */}
      <section className="relative px-6 py-24 text-gray-100">
        {/* Dark background matching footer */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]"></div>
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative max-w-5xl mx-auto">
          <div className="relative p-12 overflow-hidden text-center border shadow-sm bg-white/10 backdrop-blur-md rounded-3xl border-white/20 md:p-16">
            {/* GRADIENT ACCENT */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"></div>

            <div className="mb-6 text-5xl">❤️</div>
            <h2 className="mb-6 text-4xl font-black text-white md:text-5xl">
              Community Comes First
            </h2>
            <p className="max-w-3xl mx-auto text-xl leading-relaxed text-gray-300">
              ReportIT isn't just a reporting tool — it's a platform designed to strengthen trust, accountability, and collaboration within residential communities. We believe in the power of transparent communication and collective action.
            </p>
          </div>
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="relative px-6 py-24 text-gray-100">
        {/* Dark background matching footer */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]"></div>
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="mb-6 text-5xl">🚀</div>
          <h2 className="mb-6 text-4xl font-black text-white md:text-5xl">
            Join Your Neighbourhood Today
          </h2>
          <p className="max-w-3xl mx-auto mb-8 text-xl text-gray-300">
            Be part of a safer, smarter, and more connected community.
          </p>

          <Link
            to="/register"
            className="inline-flex items-center gap-3 px-8 py-4 text-lg font-bold text-gray-900 transition-all duration-300 bg-white border border-white shadow-sm rounded-xl hover:bg-gray-100 hover:border-gray-200 hover:shadow-lg"
          >
            <span>Get Started</span>
            <span>→</span>
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default About;