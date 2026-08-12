import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-5">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-violet-glow/10 text-violet-glow">
          <Compass className="h-7 w-7" />
        </div>
        <h1 className="mt-6 font-display text-5xl font-bold text-white">404</h1>
        <p className="mt-3 text-slate-400">This page has wandered off the grid.</p>
        <Link to="/" className="btn-primary mt-8 inline-flex">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
