import { Request, Response } from "express";
import { TeamMember } from "../models/TeamMember";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/ApiResponse";
import { deleteCloudinaryAsset } from "../utils/deleteCloudinaryAsset";

export const getTeamMembers = asyncHandler(async (req: Request, res: Response) => {
  const filter: Record<string, unknown> = { isActive: true };
  if (req.query.team) filter.team = req.query.team;
  const members = await TeamMember.find(filter).populate("team", "name slug").sort({ displayOrder: 1 });
  sendSuccess(res, members);
});

export const getAllTeamMembersAdmin = asyncHandler(async (_req: Request, res: Response) => {
  const members = await TeamMember.find().populate("team", "name slug").sort({ displayOrder: 1 });
  sendSuccess(res, members);
});

export const createTeamMember = asyncHandler(async (req: Request, res: Response) => {
  const body = { ...req.body };
  if (req.body.skills && typeof req.body.skills === "string") {
    body.skills = req.body.skills.split(",").map((s: string) => s.trim()).filter(Boolean);
  }
  if (req.body.socials && typeof req.body.socials === "string") {
    body.socials = JSON.parse(req.body.socials);
  }
  const file = req.file as Express.Multer.File | undefined;
  if (file) {
    body.profileImage = { url: file.path, publicId: file.filename };
  }
  const member = await TeamMember.create(body);
  sendSuccess(res, member, "Team member added successfully", 201);
});

export const updateTeamMember = asyncHandler(async (req: Request, res: Response) => {
  const existing = await TeamMember.findById(req.params.id);
  if (!existing) throw ApiError.notFound("Team member not found");

  const body: Record<string, unknown> = { ...req.body };
  if (req.body.skills && typeof req.body.skills === "string") {
    body.skills = req.body.skills.split(",").map((s: string) => s.trim()).filter(Boolean);
  }
  if (req.body.socials && typeof req.body.socials === "string") {
    body.socials = JSON.parse(req.body.socials);
  }
  const file = req.file as Express.Multer.File | undefined;
  if (file) {
    await deleteCloudinaryAsset(existing.profileImage?.publicId);
    body.profileImage = { url: file.path, publicId: file.filename };
  }

  const member = await TeamMember.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true });
  sendSuccess(res, member, "Team member updated successfully");
});

export const deleteTeamMember = asyncHandler(async (req: Request, res: Response) => {
  const member = await TeamMember.findByIdAndDelete(req.params.id);
  if (!member) throw ApiError.notFound("Team member not found");
  await deleteCloudinaryAsset(member.profileImage?.publicId);
  sendSuccess(res, null, "Team member deleted successfully");
});

export const reorderTeamMembers = asyncHandler(async (req: Request, res: Response) => {
  const { order } = req.body as { order: { id: string; displayOrder: number }[] };
  await Promise.all(
    order.map((item) => TeamMember.findByIdAndUpdate(item.id, { displayOrder: item.displayOrder }))
  );
  sendSuccess(res, null, "Order updated");
});
