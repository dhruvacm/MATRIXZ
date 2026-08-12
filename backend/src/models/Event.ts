import { Schema, model, Document } from "mongoose";

export type EventType = "Hackathon" | "Workshop" | "Tech Talk" | "Competition" | "Seminar" | "Other";
export type EventStatus =
  | "Draft"
  | "Upcoming"
  | "Registration Open"
  | "Registration Closed"
  | "Completed"
  | "Cancelled";

export interface IEvent extends Document {
  title: string;
  slug: string;
  eventType: EventType;
  description: string;
  banner?: { url: string; publicId: string };
  date: Date;
  startTime?: string;
  endTime?: string;
  venue: string;
  eligibility?: string;
  registrationDeadline?: Date;
  maxParticipants?: number;
  registrationEnabled: boolean;
  registrationUrl?: string | null;
  status: EventStatus;
  rules?: string;
  organizers?: string;
  contactInfo?: string;
  results?: string;
  isPast: boolean;
}

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    eventType: {
      type: String,
      enum: ["Hackathon", "Workshop", "Tech Talk", "Competition", "Seminar", "Other"],
      default: "Other",
    },
    description: { type: String, required: true },
    banner: {
      url: { type: String },
      publicId: { type: String },
    },
    date: { type: Date, required: true, index: true },
    startTime: { type: String, trim: true },
    endTime: { type: String, trim: true },
    venue: { type: String, required: true, trim: true },
    eligibility: { type: String, trim: true },
    registrationDeadline: { type: Date },
    maxParticipants: { type: Number },
    // Registration is handled entirely by an external Google Form.
    // registrationEnabled controls whether the "Register Now" button is shown at all.
    registrationEnabled: { type: Boolean, default: false },
    registrationUrl: { type: String, trim: true, default: null },
    status: {
      type: String,
      enum: ["Draft", "Upcoming", "Registration Open", "Registration Closed", "Completed", "Cancelled"],
      default: "Draft",
      index: true,
    },
    rules: { type: String },
    organizers: { type: String, trim: true },
    contactInfo: { type: String, trim: true },
    results: { type: String },
    isPast: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

eventSchema.index({ status: 1, date: 1 });

export const Event = model<IEvent>("Event", eventSchema);
