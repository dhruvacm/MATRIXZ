import { Request, Response } from "express";
import { Admin } from "../models/Admin";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/ApiResponse";
import { generateToken } from "../utils/generateToken";

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email }).select("+password");
  if (!admin) throw ApiError.unauthorized("Invalid email or password");

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) throw ApiError.unauthorized("Invalid email or password");

  const token = generateToken({ id: admin.id, email: admin.email, role: admin.role });

  sendSuccess(res, {
    token,
    admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
  }, "Login successful");
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const admin = await Admin.findById(req.admin?.id);
  if (!admin) throw ApiError.notFound("Admin not found");
  sendSuccess(res, { id: admin.id, name: admin.name, email: admin.email, role: admin.role });
});
