import { Request, Response } from "express";
import { Event } from "../models/Event";
import { TeamMember } from "../models/TeamMember";
import { Achievement } from "../models/Achievement";
import { GalleryImage } from "../models/GalleryImage";
import { ContactMessage } from "../models/ContactMessage";
import { Team } from "../models/Team";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/ApiResponse";

export const getDashboardStats = asyncHandler(async (_req: Request, res: Response) => {
  const [
    totalEvents,
    upcomingEvents,
    pastEvents,
    totalMembers,
    totalTeams,
    totalAchievements,
    galleryCount,
    unreadMessages,
    recentEvents,
    recentAchievements,
    recentGallery,
  ] = await Promise.all([
    Event.countDocuments(),
    Event.countDocuments({ isPast: false }),
    Event.countDocuments({ isPast: true }),
    TeamMember.countDocuments({ isActive: true }),
    Team.countDocuments({ isActive: true }),
    Achievement.countDocuments(),
    GalleryImage.countDocuments(),
    ContactMessage.countDocuments({ isRead: false }),
    Event.find().sort({ createdAt: -1 }).limit(5),
    Achievement.find().sort({ createdAt: -1 }).limit(5),
    GalleryImage.find().sort({ createdAt: -1 }).limit(5),
  ]);

  sendSuccess(res, {
    stats: {
      totalEvents,
      upcomingEvents,
      pastEvents,
      totalMembers,
      totalTeams,
      totalAchievements,
      galleryCount,
      unreadMessages,
    },
    recent: {
      events: recentEvents,
      achievements: recentAchievements,
      gallery: recentGallery,
    },
  });
});
