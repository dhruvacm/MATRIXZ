import { Request, Response } from "express";
import mongoose from "mongoose";
import slugify from "slugify";
import { Event } from "../models/Event";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/ApiResponse";
import { deleteCloudinaryAsset } from "../utils/deleteCloudinaryAsset";

const PUBLIC_STATUSES = ["Upcoming", "Registration Open", "Registration Closed", "Completed"];

export const getEvents = asyncHandler(async (req: Request, res: Response) => {
  const type = req.query.type; // "upcoming" | "past"
  const filter: Record<string, unknown> = { status: { $in: PUBLIC_STATUSES } };
  if (type === "upcoming") filter.isPast = false;
  if (type === "past") filter.isPast = true;
  const events = await Event.find(filter).sort({ date: type === "past" ? -1 : 1 });
  sendSuccess(res, events);
});

export const getEventById = asyncHandler(async (req: Request, res: Response) => {
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
});

export const getAllEventsAdmin = asyncHandler(async (req: Request, res: Response) => {
  const filter: Record<string, unknown> = {};
  if (req.query.type === "upcoming") filter.isPast = false;
  if (req.query.type === "past") filter.isPast = true;
  const events = await Event.find(filter).sort({ date: -1 });
  sendSuccess(res, events);
});

export const createEvent = asyncHandler(async (req: Request, res: Response) => {
  const slug = slugify(req.body.title, { lower: true, strict: true }) + "-" + Date.now().toString(36);
  const body: Record<string, unknown> = { ...req.body, slug };

  if (body.date) body.isPast = new Date(body.date as string) < new Date();
  if (req.body.registrationUrl === "") body.registrationUrl = null;

  const file = req.file as Express.Multer.File | undefined;
  if (file) body.banner = { url: file.path, publicId: file.filename };

  const event = await Event.create(body);
  sendSuccess(res, event, "Event created successfully", 201);
});

export const updateEvent = asyncHandler(async (req: Request, res: Response) => {
  const existing = await Event.findById(req.params.id);
  if (!existing) throw ApiError.notFound("Event not found");

  const body: Record<string, unknown> = { ...req.body };
  if (req.body.title) body.slug = existing.slug; // keep slug stable on edit
  if (body.date) body.isPast = new Date(body.date as string) < new Date();
  if (req.body.registrationUrl === "") body.registrationUrl = null;

  const file = req.file as Express.Multer.File | undefined;
  if (file) {
    await deleteCloudinaryAsset(existing.banner?.publicId);
    body.banner = { url: file.path, publicId: file.filename };
  }

  const event = await Event.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true });
  sendSuccess(res, event, "Event updated successfully");
});

export const deleteEvent = asyncHandler(async (req: Request, res: Response) => {
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) throw ApiError.notFound("Event not found");
  await deleteCloudinaryAsset(event.banner?.publicId);
  sendSuccess(res, null, "Event deleted successfully");
});

export const duplicateEvent = asyncHandler(async (req: Request, res: Response) => {
  const original = await Event.findById(req.params.id).lean();
  if (!original) throw ApiError.notFound("Event not found");
  const { _id, createdAt, updatedAt, ...rest } = original as any;
  const slug = slugify(`${rest.title}-copy`, { lower: true, strict: true }) + "-" + Date.now().toString(36);
  const duplicate = await Event.create({ ...rest, title: `${rest.title} (Copy)`, slug, status: "Draft" });
  sendSuccess(res, duplicate, "Event duplicated successfully", 201);
});
