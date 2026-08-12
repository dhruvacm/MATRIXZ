import { Schema, model, Document, Types } from "mongoose";

export type GalleryCategory = "Events" | "Workshops" | "Hackathons" | "Competitions" | "Team" | "Other";

export interface IGalleryImage extends Document {
  title?: string;
  description?: string;
  category: GalleryCategory;
  image: { url: string; publicId: string };
  event?: Types.ObjectId;
  displayOrder: number;
}

const galleryImageSchema = new Schema<IGalleryImage>(
  {
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    category: {
      type: String,
      enum: ["Events", "Workshops", "Hackathons", "Competitions", "Team", "Other"],
      default: "Other",
    },
    image: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },
    event: { type: Schema.Types.ObjectId, ref: "Event" },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

galleryImageSchema.index({ category: 1, displayOrder: 1 });

export const GalleryImage = model<IGalleryImage>("GalleryImage", galleryImageSchema);
