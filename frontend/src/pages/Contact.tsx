import { motion } from "framer-motion";
import { Mail, MapPin, Linkedin, Instagram } from "lucide-react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { ContactForm } from "@/components/ContactForm";

const details = [
  { icon: MapPin, label: "Our Location", value: "PES College of Engineering, Mandya - 571401" },
  { icon: Mail, label: "Email Us", value: "matrixzpesce@gmail.com" },
];

export default function Contact() {
  useDocumentTitle("Contact");

  return (
    <div className="bg-white px-5 pb-24 pt-14 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <span className="eyebrow">Contact / Get in Touch</span>
          <h1 className="mt-2.5 font-display text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Contact Us
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600">
            Have an event inquiry, collaboration proposal, or general question? Reach out to our core team below.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {details.map((d) => (
              <div
                key={d.label}
                className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#DCE8DE] text-[#214E3D]">
                  <d.icon className="h-5 w-5" />
                </span>
                <div>
                  <div className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {d.label}
                  </div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">
                    {d.value}
                  </div>
                </div>
              </div>
            ))}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-400">
                Follow Us
              </div>
              <div className="mt-3 flex gap-3">
                <a
                  href="https://www.instagram.com/matrixz_cse_pesce"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:border-[#8CB8A5] hover:bg-[#EDF3EE] hover:text-[#214E3D]"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="https://www.linkedin.com/in/matrixz-pesce-4891bb429/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:border-[#8CB8A5] hover:bg-[#EDF3EE] hover:text-[#214E3D]"
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
              className="group flex h-48 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition-all duration-300 hover:border-[#8CB8A5] hover:bg-white hover:shadow-md"
            >
              <div className="flex flex-col items-center gap-2 text-center text-slate-500 transition-colors group-hover:text-slate-800">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#DCE8DE] text-[#214E3D] transition-transform duration-300 group-hover:scale-110">
                  <MapPin className="h-6 w-6" />
                </div>
                <span className="text-sm font-semibold text-slate-900">
                  PES College of Engineering, Mandya
                </span>
                <span className="text-xs font-semibold text-[#214E3D]">
                  Open in Google Maps →
                </span>
              </div>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
