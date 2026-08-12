import { Schema, model, Document } from "mongoose";

export type AchievementCategory =
  | "Hackathons"
  | "Competitions"
  | "Awards"
  | "Certifications"
  | "Other";

export interface IAchievement extends Document {
  title: string;
  description?: string;
  date: Date;
  category: AchievementCategory;
  image?: { url: string; publicId: string };
  position?: string;
  teamOrMember?: string;
  externalLink?: string;
  displayOrder: number;
  isPublished: boolean;
}

const achievementSchema = new Schema<IAchievement>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    date: { type: Date, required: true },
    category: {
      type: String,
      enum: ["Hackathons", "Competitions", "Awards", "Certifications", "Other"],
      default: "Other",
    },
    image: {
      url: { type: String },
      publicId: { type: String },
    },
    position: { type: String, trim: true },
    teamOrMember: { type: String, trim: true },
    externalLink: { type: String, trim: true },
    displayOrder: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

achievementSchema.index({ category: 1, date: -1 });

export const Achievement = model<IAchievement>("Achievement", achievementSchema);
