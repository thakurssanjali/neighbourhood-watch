import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Target, Zap, Heart, Rocket, FileText, Settings, Check } from "lucide-react";

function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <section
        className="relative flex items-center justify-center w-full min-h-screen md:h-screen bg-fixed bg-center bg-cover px-3 md:px-6 py-32 md:py-0"
        style={{ backgroundImage: "url('/images/hero.webp')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/50 to-transparent"></div>

        <div className="relative z-10 max-w-4xl">
          <div className="inline-block px-3 md:px-4 py-1.5 md:py-2 mb-4 md:mb-6 border rounded-full bg-white/15 border-white/30 backdrop-blur-md">
            <span className="text-xs md:text-sm font-semibold text-white drop-shadow-lg">About ReportIT</span>
          </div>

          <h1 className="mb-4 md:mb-6 text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight text-white drop-shadow-2xl">
            Building Safer Communities Together
          </h1>

          <p className="max-w-2xl text-sm md:text-base lg:text-lg xl:text-2xl leading-relaxed text-gray-100 drop-shadow-xl">
            ReportIT empowers neighbourhoods through transparency, accountability, and community collaboration.
          </p>
        </div>
      </section>

      {/* ================= MISSION & VALUES ================ */}
      <section className="relative px-3 md:px-6 py-12 md:py-24 text-gray-100">
        {/* Dark background matching footer */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]"></div>
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative max-w-6xl mx-auto">
          <div className="grid grid-cols-1 gap-4 md:gap-8 md:grid-cols-2">
            {/* OUR MISSION */}
            <div className="p-4 md:p-8 lg:p-10 transition-all border shadow-sm bg-white/10 backdrop-blur-md rounded-2xl md:rounded-3xl border-white/20 hover:shadow-md">
              <Target className="w-8 md:w-10 h-8 md:h-10 mb-3 md:mb-4 text-yellow-400" />
              <h2 className="mb-2 md:mb-4 text-2xl md:text-3xl font-bold text-white">
                Our Mission
              </h2>
              <p className="text-xs md:text-base lg:text-lg leading-relaxed text-gray-200">
                ReportIT empowers residents to report incidents, track progress, and stay informed about what's happening in their neighbourhood. We bridge the gap between citizens and administrators by providing a transparent, real-time issue management platform.
              </p>
            </div>

            {/* WHY REPORTIT */}
            <div className="p-4 md:p-8 lg:p-10 transition-all border shadow-sm bg-white/10 backdrop-blur-md rounded-2xl md:rounded-3xl border-white/20 hover:shadow-md">
              <Zap className="w-8 md:w-10 h-8 md:h-10 mb-3 md:mb-4 text-orange-400" />
              <h2 className="mb-2 md:mb-4 text-2xl md:text-3xl font-bold text-white">
                Why ReportIT?
              </h2>
              <ul className="space-y-2 md:space-y-3 text-xs md:text-base lg:text-lg text-gray-200">
                <li className="flex items-center gap-2 md:gap-3">
                  <span className="font-bold text-blue-400 text-sm md:text-base">✓</span>
                  <span>Transparent incident tracking</span>
                </li>
                <li className="flex items-center gap-2 md:gap-3">
                  <span className="font-bold text-blue-400 text-sm md:text-base">✓</span>
                  <span>Verified admin actions & remarks</span>
                </li>
                <li className="flex items-center gap-2 md:gap-3">
                  <span className="font-bold text-blue-400 text-sm md:text-base">✓</span>
                  <span>Centralized community updates</span>
                </li>
                <li className="flex items-center gap-2 md:gap-3">
                  <span className="font-bold text-blue-400 text-sm md:text-base">✓</span>
                  <span>Event calendar for activities</span>
                </li>
                <li className="flex items-center gap-2 md:gap-3">
                  <span className="font-bold text-blue-400 text-sm md:text-base">✓</span>
                  <span>Secure role-based access</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="relative px-3 md:px-6 py-12 md:py-24 text-gray-100">
        {/* Dark background matching footer */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]"></div>
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-8 md:mb-16 text-center">
            <h2 className="mb-2 md:mb-4 text-3xl md:text-4xl lg:text-5xl font-black text-white">
              How It Works
            </h2>
            <p className="max-w-3xl mx-auto text-xs md:text-base lg:text-xl text-gray-300">
              A simple, structured workflow that keeps everyone informed and accountable.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:gap-8 md:grid-cols-3">
            {[
              {
                icon: FileText,
                title: "Report",
                desc: "Residents report incidents with full details from their dashboard.",
                step: "1"
              },
              {
                icon: Settings,
                title: "Action",
                desc: "Admins review, take action, and add official remarks.",
                step: "2"
              },
              {
                icon: Check,
                title: "Resolve",
                desc: "Resolved issues are published transparently for everyone.",
                step: "3"
              }
            ].map((item, i) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={i}
                  className="p-4 md:p-8 lg:p-12 pt-12 md:pt-20 transition-all border shadow-sm bg-white/10 backdrop-blur-md rounded-2xl md:rounded-3xl border-white/20 hover:shadow-md group relative"
                >
                  {/* STEP NUMBER - POSITIONED IN HEADER */}
                  <div className="absolute flex items-center justify-center w-8 md:w-10 h-8 md:h-10 text-xs md:text-sm font-bold text-white rounded-full shadow-md top-4 right-4 bg-gradient-to-r from-blue-500 to-blue-600">
                    {item.step}
                  </div>

                  {/* ICON */}
                  <div className="mb-4 md:mb-6 transition-transform group-hover:scale-110">
                    <IconComponent className="w-12 md:w-16 h-12 md:h-16 text-blue-400" />
                  </div>

                  {/* CONTENT */}
                  <h3 className="mb-2 md:mb-4 text-lg md:text-2xl font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs md:text-base leading-relaxed text-gray-300">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= COMMUNITY FIRST ================= */}
      <section className="relative px-3 md:px-6 py-12 md:py-24 text-gray-100">
        {/* Dark background matching footer */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]"></div>
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative max-w-5xl mx-auto">
          <div className="relative p-4 md:p-8 lg:p-12 xl:p-16 overflow-hidden text-center border shadow-sm bg-white/10 backdrop-blur-md rounded-2xl md:rounded-3xl border-white/20">
            {/* GRADIENT ACCENT */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"></div>

            <Heart className="w-8 md:w-12 h-8 md:h-12 mx-auto mb-4 md:mb-6 text-red-400" />
            <h2 className="mb-4 md:mb-6 text-2xl md:text-4xl lg:text-5xl font-black text-white">
              Community Comes First
            </h2>
            <p className="max-w-3xl mx-auto text-xs md:text-base lg:text-xl leading-relaxed text-gray-300">
              ReportIT isn't just a reporting tool — it's a platform designed to strengthen trust, accountability, and collaboration within residential communities. We believe in the power of transparent communication and collective action.
            </p>
          </div>
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="relative px-3 md:px-6 py-12 md:py-24 text-gray-100">
        {/* Dark background matching footer */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]"></div>
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative max-w-5xl mx-auto text-center">
          <Rocket className="w-8 md:w-12 h-8 md:h-12 mx-auto mb-4 md:mb-6 text-green-400" />
          <h2 className="mb-4 md:mb-6 text-2xl md:text-4xl lg:text-5xl font-black text-white">
            Join Your Neighbourhood Today
          </h2>
          <p className="max-w-3xl mx-auto mb-6 md:mb-8 text-xs md:text-base lg:text-xl text-gray-300">
            Be part of a safer, smarter, and more connected community.
          </p>

          <Link
            to="/register"
            className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-8 py-2 md:py-4 text-sm md:text-lg font-bold text-gray-900 transition-all duration-300 bg-white border border-white shadow-sm rounded-lg md:rounded-xl hover:bg-gray-100 hover:border-gray-200 hover:shadow-lg"
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