
import { Request, Response } from "express";
import mongoose from "mongoose";
import slugify from "slugify";
import { Event } from "../models/Event";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/ApiResponse";
import { deleteCloudinaryAsset } from "../utils/deleteCloudinaryAsset";

const PUBLIC_STATUSES = [
  "Upcoming",
  "Registration Open",
  "Registration Closed",
  "Completed",
];

type EventUploadFiles = {
  banner?: Express.Multer.File[];
  report?: Express.Multer.File[];
};

function getUploadedFiles(req: Request): EventUploadFiles {
  return (req.files ?? {}) as EventUploadFiles;
}

export const getEvents = asyncHandler(
  async (req: Request, res: Response) => {
    const type = req.query.type;

    const filter: Record<string, unknown> = {
      status: { $in: PUBLIC_STATUSES },
    };

    if (type === "upcoming") filter.isPast = false;
    if (type === "past") filter.isPast = true;

    const events = await Event.find(filter).sort({
      date: type === "past" ? -1 : 1,
    });

    sendSuccess(res, events);
  }
);

export const getEventById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    let event;

    if (mongoose.Types.ObjectId.isValid(id)) {
      event = await Event.findById(id);
    } else {
      event = await Event.findOne({ slug: id });
    }

    if (!event) {
      throw ApiError.notFound("Event not found");
    }

    sendSuccess(res, event);
  }
);

export const getAllEventsAdmin = asyncHandler(
  async (req: Request, res: Response) => {
    const filter: Record<string, unknown> = {};

    if (req.query.type === "upcoming") filter.isPast = false;
    if (req.query.type === "past") filter.isPast = true;

    const events = await Event.find(filter).sort({ date: -1 });

    sendSuccess(res, events);
  }
);

export const createEvent = asyncHandler(
  async (req: Request, res: Response) => {
    const slug =
      slugify(req.body.title, { lower: true, strict: true }) +
      "-" +
      Date.now().toString(36);

    const body: Record<string, unknown> = { ...req.body };

    delete body.removeReport;

    body.slug = slug;

    if (body.date) {
      body.isPast = new Date(body.date as string) < new Date();
    }

    if (req.body.registrationUrl === "") {
      body.registrationUrl = null;
    }

    const files = getUploadedFiles(req);
    const bannerFile = files.banner?.[0];
    const reportFile = files.report?.[0];

    if (bannerFile) {
      body.banner = {
        url: bannerFile.path,
        publicId: bannerFile.filename,
      };
    }

    if (reportFile) {
      body.report = {
        url: reportFile.path,
        publicId: reportFile.filename,
      };
    }

    const event = await Event.create(body);

    sendSuccess(res, event, "Event created successfully", 201);
  }
);

export const updateEvent = asyncHandler(
  async (req: Request, res: Response) => {
    const existing = await Event.findById(req.params.id);

    if (!existing) {
      throw ApiError.notFound("Event not found");
    }

    const body: Record<string, unknown> = { ...req.body };

    const shouldRemoveReport = req.body.removeReport === "true";

    delete body.removeReport;

    // Keep the existing event slug when its title is edited.
    if (req.body.title) {
      body.slug = existing.slug;
    }

    if (body.date) {
      body.isPast = new Date(body.date as string) < new Date();
    }

    if (req.body.registrationUrl === "") {
      body.registrationUrl = null;
    }

    const files = getUploadedFiles(req);
    const bannerFile = files.banner?.[0];
    const reportFile = files.report?.[0];

    const oldBannerPublicId = bannerFile
      ? existing.banner?.publicId
      : undefined;

    const oldReportPublicId =
      reportFile || shouldRemoveReport
        ? existing.report?.publicId
        : undefined;

    if (bannerFile) {
      body.banner = {
        url: bannerFile.path,
        publicId: bannerFile.filename,
      };
    }

    if (reportFile) {
      body.report = {
        url: reportFile.path,
        publicId: reportFile.filename,
      };
    } else if (shouldRemoveReport) {
      existing.report = undefined;
    }

    Object.assign(existing, body);

    const event = await existing.save();

    // Delete old assets only after the database save succeeds.
    if (oldBannerPublicId) {
      await deleteCloudinaryAsset(oldBannerPublicId, "image");
    }

    if (oldReportPublicId) {
      await deleteCloudinaryAsset(oldReportPublicId, "raw");
    }

    sendSuccess(res, event, "Event updated successfully");
  }
);

export const deleteEvent = asyncHandler(
  async (req: Request, res: Response) => {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      throw ApiError.notFound("Event not found");
    }

    await deleteCloudinaryAsset(event.banner?.publicId, "image");
    await deleteCloudinaryAsset(event.report?.publicId, "raw");

    sendSuccess(res, null, "Event deleted successfully");
  }
);

export const duplicateEvent = asyncHandler(
  async (req: Request, res: Response) => {
    const original = await Event.findById(req.params.id).lean();

    if (!original) {
      throw ApiError.notFound("Event not found");
    }

    const {
      _id,
      createdAt,
      updatedAt,
      report,
      ...rest
    } = original as any;

    const slug =
      slugify(`${rest.title}-copy`, {
        lower: true,
        strict: true,
      }) +
      "-" +
      Date.now().toString(36);

    const duplicate = await Event.create({
      ...rest,
      title: `${rest.title} (Copy)`,
      slug,
      status: "Draft",
    });

    sendSuccess(
      res,
      duplicate,
      "Event duplicated successfully",
      201
    );
  }
);
