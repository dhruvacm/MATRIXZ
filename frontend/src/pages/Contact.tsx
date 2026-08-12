import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Github, Linkedin, Instagram } from "lucide-react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { SectionHeading } from "@/components/SectionHeading";
import { ContactForm } from "@/components/ContactForm";

const details = [
  { icon: MapPin, label: "Our Location", value: "PES College of Engineering, Mandya - 571401" },
  { icon: Mail, label: "Email Us", value: "matrixzpesce@gmail.com" },
  
];

export default function Contact() {
  useDocumentTitle("Contact");

  return (
    <div className="px-5 pb-24 pt-14 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
  <span className="eyebrow">Contact / Get in Touch</span>

  <h1
    className="mt-2 text-5xl font-semibold tracking-wide text-white sm:text-6xl"
    style={{ fontFamily: "var(--font-premium)" }}
  >
    Contact Us
  </h1>
</div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="space-y-4">
            {details.map((d) => (
              <div key={d.label} className="glass-panel flex items-start gap-4 p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-glow/10 text-violet-glow">
                  <d.icon className="h-4.5 w-4.5" />
                </span>
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">{d.label}</div>
                  <div className="mt-1 text-sm text-slate-200">{d.value}</div>
                </div>
              </div>
            ))}

            <div className="glass-panel p-5">
  <div className="text-xs uppercase tracking-wide text-slate-500">
    Follow Us
  </div>

  <div className="mt-3 flex gap-3">
    {/* Instagram */}
    <a
      href="https://www.instagram.com/matrixz_cse_pesce"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Instagram"
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-slate-400 transition-all hover:border-violet-glow/50 hover:text-violet-glow"
    >
      <Instagram className="h-4 w-4" />
    </a>

    {/* LinkedIn */}
    <a
      href="https://www.linkedin.com/in/matrixz-cse-pesce-280312361/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="LinkedIn"
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-slate-400 transition-all hover:border-violet-glow/50 hover:text-violet-glow"
    >
      <Linkedin className="h-4 w-4" />
    </a>
  </div>
</div>

            <a
  href="https://www.google.com/maps/search/?api=1&query=PES+College+of+Engineering+Mandya"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Open PES College of Engineering, Mandya in Google Maps"
  className="glass-panel group flex h-52 items-center justify-center overflow-hidden p-0 transition-all duration-300 hover:border-violet-glow/50"
>
  <div className="flex flex-col items-center gap-2 text-slate-500 transition-colors group-hover:text-slate-300">
    <MapPin className="h-7 w-7 text-violet-glow transition-transform duration-300 group-hover:scale-110" />

    <span className="text-sm">
      PES College of Engineering, Mandya
    </span>

    <span className="text-xs text-violet-glow opacity-0 transition-opacity duration-300 group-hover:opacity-100">
      Open in Google Maps →
    </span>
  </div>
</a>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} className="glass-panel p-6">
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
