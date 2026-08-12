import React from "react";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
}

export  function StatsCard({
  icon: Icon,
  value,
  label,
}: StatsCardProps) {
  return (
    <div className="matrix-stat-card group">
      {/* futuristic corner brackets */}
      <span className="corner corner-tl" />
      <span className="corner corner-tr" />
      <span className="corner corner-bl" />
      <span className="corner corner-br" />

      {/* top scanning line */}
      <div className="scan-line" />

      {/* icon */}
      <div className="matrix-stat-icon">
        <Icon size={23} strokeWidth={1.6} />
      </div>

      {/* content */}
      <div className="matrix-stat-content">
        <div className="matrix-stat-value">
          {value}
        </div>

        <div className="matrix-stat-label">
          {label}
        </div>
      </div>

      {/* decorative node */}
      <div className="stat-node">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}