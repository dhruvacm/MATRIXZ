import { Request, Response } from "express";
import slugify from "slugify";
import { Team } from "../models/Team";
import { TeamMember } from "../models/TeamMember";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/ApiResponse";
import { deleteCloudinaryAsset } from "../utils/deleteCloudinaryAsset";

/* ----------------------------- Teams ----------------------------- */

export const getTeams = asyncHandler(async (_req: Request, res: Response) => {
  const teams = await Team.find({ isActive: true }).sort({ displayOrder: 1 });
  sendSuccess(res, teams);
});

export const getAllTeamsAdmin = asyncHandler(async (_req: Request, res: Response) => {
  const teams = await Team.find().sort({ displayOrder: 1 });
  sendSuccess(res, teams);
});

export const createTeam = asyncHandler(async (req: Request, res: Response) => {
  const slug = slugify(req.body.name, { lower: true, strict: true });
  const existing = await Team.findOne({ slug });
  if (existing) throw ApiError.conflict("A team with this name already exists");
  const team = await Team.create({ ...req.body, slug });
  sendSuccess(res, team, "Team created successfully", 201);
});

export const updateTeam = asyncHandler(async (req: Request, res: Response) => {
  const payload: Record<string, unknown> = { ...req.body };
  if (req.body.name) payload.slug = slugify(req.body.name, { lower: true, strict: true });
  const team = await Team.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
  if (!team) throw ApiError.notFound("Team not found");
  sendSuccess(res, team, "Team updated successfully");
});

export const deleteTeam = asyncHandler(async (req: Request, res: Response) => {
  const memberCount = await TeamMember.countDocuments({ team: req.params.id });
  if (memberCount > 0) {
    throw ApiError.badRequest("Cannot delete a team that still has members assigned to it");
  }
  const team = await Team.findByIdAndDelete(req.params.id);
  if (!team) throw ApiError.notFound("Team not found");
  sendSuccess(res, null, "Team deleted successfully");
});

/* --------------------------- Team Members -------------------------- */

function mapMemberBody(body: Record<string, unknown>) {
  const { linkedin, github, instagram, ...rest } = body;
  const mapped: Record<string, unknown> = { ...rest };
  if (linkedin !== undefined || github !== undefined || instagram !== undefined) {
    mapped.socials = { linkedin: linkedin || "", github: github || "", instagram: instagram || "" };
  }
  return mapped;
}

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
  const body = mapMemberBody(req.body);
  const file = req.file as Express.Multer.File | undefined;
  if (file) body.profileImage = { url: file.path, publicId: file.filename };
  const member = await TeamMember.create(body);
  sendSuccess(res, member, "Team member added successfully", 201);
});

export const updateTeamMember = asyncHandler(async (req: Request, res: Response) => {
  const existing = await TeamMember.findById(req.params.id);
  if (!existing) throw ApiError.notFound("Team member not found");

  const body = mapMemberBody(req.body);
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
