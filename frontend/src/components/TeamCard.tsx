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
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      className="glass-card group flex w-full max-w-[340px] flex-col items-center p-7 text-center"
    >
      {/* Profile Image */}
      <div className="relative h-36 w-36 overflow-hidden rounded-full border-2 border-white/10 bg-void-raised transition-all duration-300 group-hover:border-violet-glow/50 group-hover:shadow-glow-sm">
        {member.profileImage?.url ? (
          <img
            src={member.profileImage.url}
            alt={member.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-3xl text-violet-glow/60">
            {member.name.charAt(0)}
          </div>
        )}
      </div>

      {/* Name */}
      <h3
  className="mt-5 text-xl font-semibold tracking-wide text-white"
  style={{ fontFamily: "var(--font-premium)" }}
>
  {member.name}
</h3>

      {/* Role */}
      <p className="text-sm text-violet-glow/90">
        {member.role}
      </p>

      {/* Bio */}
      {member.bio && (
        <p className="mt-3 line-clamp-2 text-xs text-slate-500">
          {member.bio}
        </p>
      )}

      {/* Social Links */}
      <div className="mt-5 flex gap-4">
        {member.socials?.linkedin && (
          <a
            href={member.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name} on LinkedIn`}
            className="text-slate-500 transition-colors hover:text-violet-glow"
          >
            <Linkedin className="h-5 w-5" />
          </a>
        )}

        {member.socials?.github && (
          <a
            href={member.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name} on GitHub`}
            className="text-slate-500 transition-colors hover:text-violet-glow"
          >
            <Github className="h-5 w-5" />
          </a>
        )}

        {member.socials?.instagram && (
          <a
            href={member.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name} on Instagram`}
            className="text-slate-500 transition-colors hover:text-violet-glow"
          >
            <Instagram className="h-5 w-5" />
          </a>
        )}
      </div>
    </motion.div>
  );
}