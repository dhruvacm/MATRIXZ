import { motion } from "framer-motion";
import { Linkedin, Github, Instagram } from "lucide-react";
import { TeamMember } from "@/types";

export function TeamCard({
  member,
  index = 0,
}: {
  member: TeamMember;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      className="group flex w-full flex-col items-center rounded-lg border border-[#E1E4DC] bg-white p-5 text-center shadow-subtle transition-all duration-200 hover:-translate-y-0.5 hover:border-[#8CB8A5] hover:shadow-card"
    >
      {/* Profile Image */}
      <div className="relative h-24 w-24 overflow-hidden rounded-full border border-[#E1E4DC] bg-[#FAF9F5] shadow-subtle transition-all duration-200 group-hover:border-[#8CB8A5]">
        {member.profileImage?.url ? (
          <img
            src={member.profileImage.url}
            alt={member.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-2xl font-bold text-[#214E3D]">
            {member.name.charAt(0)}
          </div>
        )}
      </div>

      {/* Name */}
      <h3 className="mt-3.5 font-display text-sm font-bold tracking-tight text-[#202923] transition-colors group-hover:text-[#214E3D]">
        {member.name}
      </h3>

      {/* Role */}
      <p className="mt-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#214E3D]">
        {member.role}
      </p>

      {/* Bio */}
      {member.bio && (
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#6E7A71]">
          {member.bio}
        </p>
      )}

      {/* Social Links */}
      <div className="mt-4 flex gap-2">
        {member.socials?.linkedin && (
          <a
            href={member.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name} on LinkedIn`}
            className="rounded p-1 text-[#6E7A71] transition-colors hover:bg-[#EDF3EE] hover:text-[#214E3D]"
          >
            <Linkedin className="h-4 w-4" />
          </a>
        )}

        {member.socials?.github && (
          <a
            href={member.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name} on GitHub`}
            className="rounded p-1 text-[#6E7A71] transition-colors hover:bg-[#EDF3EE] hover:text-[#214E3D]"
          >
            <Github className="h-4 w-4" />
          </a>
        )}

        {member.socials?.instagram && (
          <a
            href={member.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name} on Instagram`}
            className="rounded p-1 text-[#6E7A71] transition-colors hover:bg-[#EDF3EE] hover:text-[#214E3D]"
          >
            <Instagram className="h-4 w-4" />
          </a>
        )}
      </div>
    </motion.div>
  );
}