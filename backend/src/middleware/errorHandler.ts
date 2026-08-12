import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { env } from "../config/env";

export function notFoundHandler(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  let statusCode = 500;
  let message = "Internal server error";
  let details: unknown;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (env.nodeEnv !== "production" && err instanceof Error) {
    // Show useful error details only during development.
    message = err.message;
  }

  // eslint-disable-next-line no-console
  console.error(err);

  res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {}),
  });
}