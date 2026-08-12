import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

export function generateToken(payload: { id: string; email: string; role: string }): string {
  const options: SignOptions = { expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"] };
  return jwt.sign(payload, env.jwtSecret, options);
}
