import React from "react";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
}

export function StatsCard({ icon: Icon, value, label }: StatsCardProps) {
  return (
    <div className="group relative flex flex-col justify-between rounded-lg border border-[#E1E4DC] bg-white p-5 shadow-subtle transition-all duration-200 hover:-translate-y-0.5 hover:border-[#8CB8A5] hover:shadow-card">
      <div className="flex h-10 w-10 items-center justify-center rounded-md border border-[#DCE8DE] bg-[#EDF3EE] text-[#214E3D] transition-transform duration-200 group-hover:scale-105">
        <Icon size={20} strokeWidth={1.8} />
      </div>

      <div className="mt-4">
        <div className="font-display text-3xl font-bold tracking-tight text-[#202923]">
          {value}
        </div>
        <div className="mt-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#6E7A71]">
          {label}
        </div>
      </div>
    </div>
  );
}