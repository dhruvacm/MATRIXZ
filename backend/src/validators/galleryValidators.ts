import { z } from "zod";

export const galleryImageSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  category: z.enum(["Events", "Workshops", "Hackathons", "Competitions", "Team", "Other"]).optional(),
  event: z.string().optional(),
  displayOrder: z.coerce.number().optional(),
});

export const galleryImageUpdateSchema = galleryImageSchema.partial();
