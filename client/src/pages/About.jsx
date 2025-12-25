import { Link } from "react-router-dom";

function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-yellow-50 to-orange-100">

      {/* ================= NAVBAR ================= */}
      <nav className="absolute top-0 left-0 w-full pt-6 z-20">
        <Link to="/" className="absolute left-6 top-6 z-30 flex items-center">
          <img
            src="/images/logo.png"
            alt="ReportIT Logo"
            className="h-14 w-auto drop-shadow-md"
          />
        </Link>

        <div className="flex justify-center">
          <div
            className="px-16 py-4 rounded-full
            bg-[#1e3d4b]/80 backdrop-blur-md shadow-lg
            flex items-center gap-8 text-md text-white"
          >
            <Link to="/" className="hover:text-gray-200">Home</Link>
            <Link to="/about" className="hover:text-gray-200">About</Link>
            <Link to="/login" className="hover:text-gray-200">Report</Link>
          </div>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section
        className="min-h-screen flex items-center justify-center px-6 pt-32
        bg-cover bg-center relative"
        style={{ backgroundImage: "url('/images/hero.jpg')" }}
      >
        <div className="max-w-4xl text-center bg-white/70 backdrop-blur-md
          rounded-3xl shadow-xl p-10"
        >
          <h1 className="text-5xl font-bold mb-6">
            About ReportIT
          </h1>

          <p className="text-lg text-gray-700">
            Building safer, smarter, and more connected neighbourhoods
            through transparency, accountability, and community participation.
          </p>
        </div>
      </section>

      {/* ================= MISSION ================= */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">

          <div className="bg-white/70 backdrop-blur-md rounded-3xl p-10 shadow-xl">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              ReportIT empowers residents to report incidents, track progress,
              and stay informed about what’s happening in their neighbourhood.
              We bridge the gap between citizens and administrators by
              providing a transparent, real-time issue management platform.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-md rounded-3xl p-10 shadow-xl">
            <h2 className="text-3xl font-bold mb-4">Why ReportIT?</h2>
            <ul className="space-y-3 text-gray-700">
              <li>• Transparent incident tracking</li>
              <li>• Verified admin actions & remarks</li>
              <li>• Centralized community updates</li>
              <li>• Event calendar for neighbourhood activities</li>
              <li>• Secure role-based access</li>
            </ul>
          </div>

        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-24 px-6 bg-black/5">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            A simple, structured workflow that keeps everyone informed.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

          {[
            {
              title: "Report",
              desc: "Residents report incidents with full details from their dashboard."
            },
            {
              title: "Action",
              desc: "Admins review, take action, and add official remarks."
            },
            {
              title: "Resolve",
              desc: "Resolved issues are published transparently for everyone."
            }
          ].map((step, i) => (
            <div
              key={i}
              className="bg-white/70 backdrop-blur-md
              rounded-3xl shadow-xl p-8"
            >
              <h3 className="text-2xl font-semibold mb-3">
                {step.title}
              </h3>
              <p className="text-gray-700">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= COMMUNITY FIRST ================= */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-white/70 backdrop-blur-md
          rounded-3xl shadow-xl p-12 text-center"
        >
          <h2 className="text-4xl font-bold mb-6">
            Community Comes First
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            ReportIT isn’t just a reporting tool — it’s a platform designed
            to strengthen trust, accountability, and collaboration within
            residential communities.
          </p>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-24 px-6 bg-gradient-to-r from-[#1e3d4b] to-[#2c5364]">
        <div className="max-w-5xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            Join Your Neighbourhood Today
          </h2>
          <p className="text-lg mb-8 text-gray-200">
            Be part of a safer, smarter, and more connected community.
          </p>

          <Link
            to="/register"
            className="bg-white text-black px-8 py-4 rounded-full
            font-semibold transition hover:bg-gray-200"
          >
            Get Started
          </Link>
        </div>
      </section>

    </div>
  );
}

export default About;
