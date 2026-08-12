import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  eventType: z.string().min(2, "Event type is required."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  date: z.coerce.date(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  venue: z.string().min(2, "Venue is required."),
  eligibility: z.string().optional(),
  registrationDeadline: z.coerce.date().optional().nullable(),
  maxParticipants: z.coerce.number().int().positive().optional().nullable(),
  registrationEnabled: z.coerce.boolean().optional(),
  registrationUrl: z
    .string()
    .url("Enter a valid Google Form URL.")
    .optional()
    .nullable()
    .or(z.literal("")),
  status: z.enum(["Draft", "Upcoming", "Registration Open", "Registration Closed", "Completed", "Cancelled"]).optional(),
  rules: z.string().optional(),
  organizers: z.string().optional(),
  contactInfo: z.string().optional(),
  results: z.string().optional(),
});

export const eventUpdateSchema = eventSchema.partial();
