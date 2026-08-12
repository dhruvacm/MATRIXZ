export interface ImageAsset {
  url: string;
  publicId: string;
}

export type EventStatus =
  | "Draft"
  | "Upcoming"
  | "Registration Open"
  | "Registration Closed"
  | "Completed"
  | "Cancelled";

export type EventType = "Hackathon" | "Workshop" | "Tech Talk" | "Competition" | "Seminar" | "Other";

export interface MatrixzEvent {
  _id: string;
  title: string;
  slug: string;
  eventType: EventType;
  description: string;
  banner?: ImageAsset;
  date: string;
  startTime?: string;
  endTime?: string;
  venue: string;
  eligibility?: string;
  registrationDeadline?: string;
  maxParticipants?: number;
  registrationEnabled: boolean;
  registrationUrl?: string | null;
  status: EventStatus;
  rules?: string;
  organizers?: string;
  contactInfo?: string;
  results?: string;
  isPast: boolean;
  createdAt: string;
}

export interface Team {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface TeamMember {
  _id: string;
  name: string;
  role: string;
  team: Team | string;
  bio?: string;
  skills: string[];
  profileImage?: ImageAsset;
  socials: { linkedin?: string; github?: string; instagram?: string };
  displayOrder: number;
  isActive: boolean;
}

export type AchievementCategory = "Hackathons" | "Competitions" | "Awards" | "Certifications" | "Other";

export interface Achievement {
  _id: string;
  title: string;
  description?: string;
  date: string;
  category: AchievementCategory;
  image?: ImageAsset;
  position?: string;
  teamOrMember?: string;
  externalLink?: string;
  displayOrder: number;
  isPublished: boolean;
}

export type GalleryCategory = "Events" | "Workshops" | "Hackathons" | "Competitions" | "Team" | "Other";

export interface GalleryImage {
  _id: string;
  title?: string;
  description?: string;
  category: GalleryCategory;
  image: ImageAsset;
  event?: { _id: string; title: string } | string;
  displayOrder: number;
  createdAt: string;
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: "superadmin" | "admin";
}

export interface DashboardStats {
  stats: {
    totalEvents: number;
    upcomingEvents: number;
    pastEvents: number;
    totalMembers: number;
    totalTeams: number;
    totalAchievements: number;
    galleryCount: number;
    unreadMessages: number;
  };
  recent: {
    events: MatrixzEvent[];
    achievements: Achievement[];
    gallery: GalleryImage[];
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
