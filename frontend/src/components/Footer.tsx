import { Link } from "react-router-dom";
import { Linkedin, Instagram, Mail, ArrowUp } from "lucide-react";
import matrixzLogo from "@/assets/matrixz-logo.png";

export function Footer() {
  return (
    <footer className="relative border-t border-[#E1E4DC] bg-[#F7F6F0]">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center">
              <img
                src={matrixzLogo}
                alt="MATRIXZ Logo"
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[#48544B]">
              The official technical club of our department, fostering innovation,
              creativity, and technical excellence.
            </p>
          </div>

          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#202923]">
              Explore
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-[#48544B]">
              <li>
                <Link to="/about" className="transition-colors hover:text-[#214E3D]">
                  About
                </Link>
              </li>
              <li>
                <Link to="/teams" className="transition-colors hover:text-[#214E3D]">
                  Teams
                </Link>
              </li>
              <li>
                <Link to="/achievements" className="transition-colors hover:text-[#214E3D]">
                  Achievements
                </Link>
              </li>
              <li>
                <Link to="/events" className="transition-colors hover:text-[#214E3D]">
                  Events
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#202923]">
              Connect
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-[#48544B]">
              <li>
                <Link to="/gallery" className="transition-colors hover:text-[#214E3D]">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/contact" className="transition-colors hover:text-[#214E3D]">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#202923]">
              Let's Connect
            </h4>
            <div className="mt-4 flex gap-3">
              <a
                href="https://www.linkedin.com/in/matrixz-pesce-4891bb429/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-[#E1E4DC] bg-white text-[#48544B] shadow-subtle transition-all hover:border-[#8CB8A5] hover:bg-[#DCE8DE]/50 hover:text-[#214E3D]"
              >
                <Linkedin className="h-4 w-4" />
              </a>

              <a
                href="https://www.instagram.com/matrixz_cse_pesce"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-[#E1E4DC] bg-white text-[#48544B] shadow-subtle transition-all hover:border-[#8CB8A5] hover:bg-[#DCE8DE]/50 hover:text-[#214E3D]"
              >
                <Instagram className="h-4 w-4" />
              </a>

              <a
                href="mailto:matrixzpesce@gmail.com"
                aria-label="Email"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-[#E1E4DC] bg-white text-[#48544B] shadow-subtle transition-all hover:border-[#8CB8A5] hover:bg-[#DCE8DE]/50 hover:text-[#214E3D]"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#E1E4DC] pt-6 sm:flex-row">
          <p className="text-xs text-[#6E7A71]">
            © {new Date().getFullYear()} MATRIXZ. All rights reserved.
          </p>
          <p className="font-mono text-xs font-medium text-[#6E7A71]">
            Innovate. Build. Inspire.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-1.5 text-xs text-[#6E7A71] transition-colors hover:text-[#214E3D]"
          >
            Back to top <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
