import { Link } from "react-router-dom";
import { Linkedin, Instagram, Mail, ArrowUp } from "lucide-react";
import matrixzLogo from "@/assets/matrixz-logo.png";
export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-[#060716]/75">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center">
  <img
    src={matrixzLogo}
    alt="MATRIXZ Logo"
    className="h-12 w-auto object-contain"
  />
</div>
            <p className="mt-4 text-sm leading-relaxed text-slate-500">
              The official technical club of our department, fostering innovation, creativity, and technical excellence.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-200">Explore</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-500">
              <li><Link to="/about" className="hover:text-violet-glow transition-colors">About</Link></li>
              <li><Link to="/teams" className="hover:text-violet-glow transition-colors">Teams</Link></li>
              <li><Link to="/achievements" className="hover:text-violet-glow transition-colors">Achievements</Link></li>
              <li><Link to="/events" className="hover:text-violet-glow transition-colors">Events</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-200">Connect</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-500">
              <li><Link to="/gallery" className="hover:text-violet-glow transition-colors">Gallery</Link></li>
              <li><Link to="/contact" className="hover:text-violet-glow transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
  <h4 className="text-sm font-semibold text-slate-200">Let's Connect</h4>

  <div className="mt-4 flex gap-3">
    {/* LinkedIn */}
    <a
      href="https://www.linkedin.com/in/matrixz-pesce-4891bb429/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="LinkedIn"
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-400 transition-all hover:border-violet-glow/50 hover:text-violet-glow"
    >
      <Linkedin className="h-4 w-4" />
    </a>

    {/* Instagram */}
    <a
      href="https://www.instagram.com/matrixz_cse_pesce"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Instagram"
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-400 transition-all hover:border-violet-glow/50 hover:text-violet-glow"
    >
      <Instagram className="h-4 w-4" />
    </a>

    {/* Email */}
    <a
      href="mailto:matrixzpesce@gmail.com"
      aria-label="Email"
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-400 transition-all hover:border-violet-glow/50 hover:text-violet-glow"
    >
      <Mail className="h-4 w-4" />
    </a>
  </div>
</div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-6 sm:flex-row">
          <p className="text-xs text-slate-600">© {new Date().getFullYear()} MATRIXZ. All rights reserved.</p>
          <p className="text-xs text-slate-600">Innovate. Build. Inspire.</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-violet-glow transition-colors"
          >
            Back to top <ArrowUp className="h-3 w-3" />
          </button>
        </div>
      </div>
    </footer>
  );
}
