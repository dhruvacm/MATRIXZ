import { Request, Response } from "express";
import { ContactMessage } from "../models/ContactMessage";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/ApiResponse";

export const submitContactMessage = asyncHandler(async (req: Request, res: Response) => {
  const message = await ContactMessage.create(req.body);
  sendSuccess(res, message, "Your message has been sent successfully", 201);
});

export const getContactMessages = asyncHandler(async (_req: Request, res: Response) => {
  const messages = await ContactMessage.find().sort({ createdAt: -1 });
  sendSuccess(res, messages);
});

export const markMessageRead = asyncHandler(async (req: Request, res: Response) => {
  const message = await ContactMessage.findByIdAndUpdate(
    req.params.id,
    { isRead: req.body.isRead ?? true },
    { new: true }
  );
  if (!message) throw ApiError.notFound("Message not found");
  sendSuccess(res, message, "Message updated");
});

export const deleteContactMessage = asyncHandler(async (req: Request, res: Response) => {
  const message = await ContactMessage.findByIdAndDelete(req.params.id);
  if (!message) throw ApiError.notFound("Message not found");
  sendSuccess(res, null, "Message deleted successfully");
});
