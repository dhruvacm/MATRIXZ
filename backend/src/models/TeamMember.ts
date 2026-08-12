import { Schema, model, Document, Types } from "mongoose";

export interface ITeamMember extends Document {
  name: string;
  role: string;
  team: Types.ObjectId;
  bio?: string;
  skills: string[];
  profileImage?: { url: string; publicId: string };
  socials: { linkedin?: string; github?: string; instagram?: string };
  displayOrder: number;
  isActive: boolean;
}

const teamMemberSchema = new Schema<ITeamMember>(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    team: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    bio: { type: String, trim: true },
    skills: [{ type: String, trim: true }],
    profileImage: {
      url: { type: String },
      publicId: { type: String },
    },
    socials: {
      linkedin: { type: String, trim: true },
      github: { type: String, trim: true },
      instagram: { type: String, trim: true },
    },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

teamMemberSchema.index({ team: 1, displayOrder: 1 });

export const TeamMember = model<ITeamMember>("TeamMember", teamMemberSchema);
