import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

/** Verifies the Bearer JWT and attaches the admin payload to the request. */
export const requireAdmin = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    throw ApiError.unauthorized("Authentication token missing");
  }
  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;
    req.admin = decoded;
    next();
  } catch {
    throw ApiError.unauthorized("Invalid or expired token");
  }
});

/** Restricts a route to specific admin roles, e.g. requireRole("superadmin"). */
export const requireRole = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.admin || !roles.includes(req.admin.role)) {
      throw ApiError.forbidden("You do not have permission to perform this action");
    }
    next();
  };
};
