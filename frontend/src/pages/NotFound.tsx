import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-white px-5">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#DCE8DE] text-[#214E3D] shadow-sm">
          <Compass className="h-8 w-8" />
        </div>
        <h1 className="mt-6 font-display text-6xl font-extrabold text-slate-900">404</h1>
        <p className="mt-2 text-base text-slate-600">This page has wandered off the grid.</p>
        <Link to="/" className="btn-primary mt-8 inline-flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
