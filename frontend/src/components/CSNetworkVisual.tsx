import React from "react";
import { motion } from "framer-motion";
import { Cpu, Network, Database, Terminal, Shield, Workflow } from "lucide-react";

const hubs = [
  { x: 250, y: 176, r: 21, name: "CORE", icon: Cpu },
  { x: 112, y: 88, r: 13, name: "NETWORK", icon: Network },
  { x: 390, y: 80, r: 13, name: "ALGORITHMS", icon: Workflow },
  { x: 98, y: 265, r: 14, name: "SECURITY", icon: Shield },
  { x: 407, y: 267, r: 14, name: "DATA", icon: Database },
  { x: 250, y: 303, r: 11, name: "RUNTIME", icon: Terminal },
  { x: 250, y: 48, r: 9, name: "AI LAB", icon: Cpu },
  { x: 165, y: 142, r: 8, name: "", icon: Network },
  { x: 334, y: 132, r: 8, name: "", icon: Network },
  { x: 150, y: 224, r: 8, name: "", icon: Network },
  { x: 350, y: 224, r: 8, name: "", icon: Network },
];

const links = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6],
  [1, 2], [1, 3], [2, 4], [3, 5], [4, 5], [1, 7], [7, 8], [8, 2],
  [7, 9], [9, 3], [8, 10], [10, 4], [6, 1], [6, 2],
];

export function CSNetworkVisual({ className = "" }: { className?: string }) {
  return (
    <div className={`relative mx-auto w-full max-w-[610px] ${className}`} role="img" aria-label="Three-dimensional orbital computer science network with connected computing nodes">
      <div className="absolute inset-[12%] rounded-full bg-[#8CB8A5]/20 blur-3xl" />
      <motion.div
        className="relative"
        style={{ perspective: "1100px" }}
        animate={{ y: [0, -8, 0], rotateZ: [-1, 1, -1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          className="relative"
          style={{ transformStyle: "preserve-3d", transform: "rotateX(57deg) rotateZ(-18deg)" }}
          whileHover={{ rotateX: 49, rotateZ: -12, scale: 1.025 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <svg viewBox="0 0 500 360" className="block h-auto w-full overflow-visible" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="matrixzOrb" cx="32%" cy="25%" r="75%">
                <stop offset="0%" stopColor="#DCE8DE" />
                <stop offset="42%" stopColor="#5D9278" />
                <stop offset="100%" stopColor="#173D2E" />
              </radialGradient>
              <linearGradient id="matrixzLink" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#8CB8A5" stopOpacity=".3" />
                <stop offset="50%" stopColor="#214E3D" stopOpacity=".85" />
                <stop offset="100%" stopColor="#8CB8A5" stopOpacity=".25" />
              </linearGradient>
              <filter id="matrixzShadow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="3" />
              </filter>
            </defs>
            {/* Technical orbit rings create the original blueprint's radial structure */}
            {[42, 66, 91, 123, 158].map((r, i) => (
              <ellipse key={r} cx="250" cy="176" rx={r * 1.28} ry={r * .78} fill="none" stroke={i === 2 ? "#214E3D" : "#8CB8A5"} strokeWidth={i === 2 ? 1.5 : 0.8} strokeOpacity={i === 2 ? .65 : .45} strokeDasharray={i % 2 ? "2 5" : "none"} />
            ))}
            <ellipse cx="250" cy="176" rx="228" ry="103" fill="none" stroke="#8CB8A5" strokeWidth=".8" strokeOpacity=".45" />
            <ellipse cx="250" cy="176" rx="206" ry="137" fill="none" stroke="#8CB8A5" strokeWidth=".7" strokeOpacity=".35" transform="rotate(34 250 176)" />
            <ellipse cx="250" cy="176" rx="206" ry="137" fill="none" stroke="#8CB8A5" strokeWidth=".7" strokeOpacity=".35" transform="rotate(-34 250 176)" />
            {/* Subtle radial construction lines */}
            {Array.from({ length: 16 }, (_, i) => {
              const a = (Math.PI * 2 * i) / 16;
              return <line key={i} x1="250" y1="176" x2={250 + Math.cos(a) * 218} y2={176 + Math.sin(a) * 143} stroke="#8CB8A5" strokeWidth=".65" strokeOpacity=".42" />;
            })}
            {/* Connections sit behind the raised nodes */}
            {links.map(([a, b], i) => (
              <g key={`${a}-${b}`}>
                <line x1={hubs[a].x} y1={hubs[a].y + 8} x2={hubs[b].x} y2={hubs[b].y + 8} stroke="#214E3D" strokeWidth="5" strokeOpacity=".12" />
                <line x1={hubs[a].x} y1={hubs[a].y} x2={hubs[b].x} y2={hubs[b].y} stroke="url(#matrixzLink)" strokeWidth={i < 6 ? 1.5 : .9} strokeDasharray={i % 3 === 0 ? "3 4" : "none"} />
              </g>
            ))}
            {/* Spherical nodes with offset shadows and extruded stems */}
            {hubs.map((hub, i) => (
              <g key={`${hub.x}-${hub.y}`}>
                <circle cx={hub.x + 2} cy={hub.y + 12} r={hub.r * 1.25} fill="#163B2D" opacity=".2" filter="url(#matrixzShadow)" />
                <line x1={hub.x} y1={hub.y + hub.r * .4} x2={hub.x} y2={hub.y + hub.r + 8} stroke="#214E3D" strokeWidth="2" strokeOpacity=".5" />
                <circle cx={hub.x} cy={hub.y + 4} r={hub.r + 3} fill="none" stroke="#8CB8A5" strokeWidth=".8" strokeOpacity=".65" />
                <circle cx={hub.x} cy={hub.y} r={hub.r} fill="url(#matrixzOrb)" stroke="#214E3D" strokeWidth="1" />
                <ellipse cx={hub.x - hub.r * .28} cy={hub.y - hub.r * .34} rx={hub.r * .23} ry={hub.r * .16} fill="#FFFFFF" opacity=".55" />
                {hub.name && <text x={hub.x} y={hub.y + hub.r + 22} textAnchor="middle" fontFamily="monospace" fontSize={i === 0 ? 10 : 7.5} letterSpacing="1.5" fill="#214E3D" fontWeight="600">{hub.name}</text>}
              </g>
            ))}
            {/* Tiny circuit endpoints */}
            {Array.from({ length: 44 }, (_, i) => {
              const x = 30 + ((i * 67) % 440);
              const y = 22 + ((i * 43) % 310);
              return <circle key={i} cx={x} cy={y} r={i % 5 === 0 ? 2 : 1.15} fill="#214E3D" opacity={i % 5 === 0 ? .62 : .3} />;
            })}
          </svg>
        </motion.div>
      </motion.div>
      <div className="pointer-events-none absolute bottom-[5%] left-[14%] right-[14%] h-8 rounded-[50%] bg-[#214E3D]/15 blur-xl" />
      <div className="absolute right-[3%] top-[7%] rounded-full border border-[#8CB8A5]/70 bg-[#FAF9F5]/85 px-3 py-1.5 font-mono text-[9px] tracking-[.18em] text-[#214E3D] shadow-sm backdrop-blur-sm">
        MATRIXZ / NODE FIELD
      </div>
    </div>
  );
}
