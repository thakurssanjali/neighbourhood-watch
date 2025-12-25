import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-slate-900 via-slate-950 to-black border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* BRAND & DESCRIPTION */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <h3 className="text-xl font-bold text-white">ReportIT</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Making neighborhoods safer through community collaboration and real-time incident reporting.
            </p>
            
            
          </div>

          {/* LINKS */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition duration-200 text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/members" className="text-slate-400 hover:text-white transition duration-200 text-sm">
                  Members
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-white transition duration-200 text-sm">
                  Contact
                </Link>
              </li>
              
            </ul>
          </div>

          {/* CONTACT INFO */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Get in Touch</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-slate-400">
                <Phone className="w-4 h-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <Mail className="w-4 h-4" />
                <span>support@neighbour-watch.com</span>
              </div>
              <div className="flex items-start gap-3 text-slate-400">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>LPU GT Road, Phagwara 144401</span>
              </div>
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-slate-800/50 my-8"></div>

        {/* BOTTOM */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span>© {currentYear} ReportIT. All rights reserved.</span>
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
          </div>
        </div>
      </div>
    </footer>
  );
}
