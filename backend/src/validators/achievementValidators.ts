import { z } from "zod";

export const achievementSchema = z.object({
  title: z.string().min(3, "Title is required."),
  description: z.string().optional(),
  date: z.coerce.date(),
  category: z.enum(["Hackathons", "Competitions", "Awards", "Certifications", "Other"]).optional(),
  position: z.string().optional(),
  teamOrMember: z.string().optional(),
  externalLink: z.string().url().optional().or(z.literal("")),
  displayOrder: z.coerce.number().optional(),
  published: z.coerce.boolean().optional(),
});

export const achievementUpdateSchema = achievementSchema.partial();
