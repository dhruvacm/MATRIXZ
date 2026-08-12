import { Request, Response } from "express";
import { Achievement } from "../models/Achievement";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/ApiResponse";
import { deleteCloudinaryAsset } from "../utils/deleteCloudinaryAsset";

export const getAchievements = asyncHandler(async (req: Request, res: Response) => {
  const filter: Record<string, unknown> = { isPublished: true };
  if (req.query.category && req.query.category !== "All") filter.category = req.query.category;
  const achievements = await Achievement.find(filter).sort({ date: -1, displayOrder: 1 });
  sendSuccess(res, achievements);
});

export const getAllAchievementsAdmin = asyncHandler(async (_req: Request, res: Response) => {
  const achievements = await Achievement.find().sort({ date: -1 });
  sendSuccess(res, achievements);
});

export const createAchievement = asyncHandler(async (req: Request, res: Response) => {
  const body = { ...req.body };
  const file = req.file as Express.Multer.File | undefined;
  if (file) body.image = { url: file.path, publicId: file.filename };
  const achievement = await Achievement.create(body);
  sendSuccess(res, achievement, "Achievement added successfully", 201);
});

export const updateAchievement = asyncHandler(async (req: Request, res: Response) => {
  const existing = await Achievement.findById(req.params.id);
  if (!existing) throw ApiError.notFound("Achievement not found");

  const body: Record<string, unknown> = { ...req.body };
  const file = req.file as Express.Multer.File | undefined;
  if (file) {
    await deleteCloudinaryAsset(existing.image?.publicId);
    body.image = { url: file.path, publicId: file.filename };
  }
  const achievement = await Achievement.findByIdAndUpdate(req.params.id, body, {
    new: true,
    runValidators: true,
  });
  sendSuccess(res, achievement, "Achievement updated successfully");
});

export const deleteAchievement = asyncHandler(async (req: Request, res: Response) => {
  const achievement = await Achievement.findByIdAndDelete(req.params.id);
  if (!achievement) throw ApiError.notFound("Achievement not found");
  await deleteCloudinaryAsset(achievement.image?.publicId);
  sendSuccess(res, null, "Achievement deleted successfully");
});
