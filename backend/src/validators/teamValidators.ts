import { z } from "zod";

export const teamSchema = z.object({
  name: z.string().min(2, "Team name is required."),
  description: z.string().optional(),
  icon: z.string().optional(),
  displayOrder: z.coerce.number().optional(),
  isActive: z.coerce.boolean().optional(),
});

export const teamUpdateSchema = teamSchema.partial();

const skillsField = z
  .union([z.array(z.string()), z.string()])
  .optional()
  .transform((val) => {
    if (Array.isArray(val)) return val;
    if (typeof val === "string" && val.length > 0) {
      return val.split(",").map((s) => s.trim()).filter(Boolean);
    }
    return [];
  });

export const teamMemberSchema = z.object({
  name: z.string().min(2, "Name is required."),
  role: z.string().min(2, "Role is required."),
  team: z.string().min(1, "Team is required."),
  bio: z.string().optional(),
  skills: skillsField,
  linkedin: z.string().url().optional().or(z.literal("")),
  github: z.string().url().optional().or(z.literal("")),
  instagram: z.string().url().optional().or(z.literal("")),
  displayOrder: z.coerce.number().optional(),
  isActive: z.coerce.boolean().optional(),
});

export const teamMemberUpdateSchema = teamMemberSchema.partial();
