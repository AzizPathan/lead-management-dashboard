import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";
import type { AuthUser } from "../types.js";

export interface JwtPayload extends AuthUser {
  iat?: number;
  exp?: number;
}

export const signToken = (user: AuthUser): string => {
  const options: SignOptions = { expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"] };
  return jwt.sign(user, env.jwtSecret, options);
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.jwtSecret) as JwtPayload;
};
