import { z } from "zod";

export const contactMessageSchema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.string().email("Enter a valid email address."),
  subject: z.string().min(2, "Subject is required."),
  message: z.string().min(5, "Message is too short."),
});
