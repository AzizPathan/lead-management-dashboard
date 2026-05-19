import type { Request, Response } from "express";
import { User, type UserDocument } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { signToken } from "../utils/token.js";
import type { Role } from "../types.js";

const toAuthUser = (user: UserDocument) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role
});

export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role = "sales" } = req.body as { name: string; email: string; password: string; role?: Role };
  const exists = await User.exists({ email });
  if (exists) throw new ApiError(409, "Email is already registered");

  const user = await User.create({ name, email, password, role });
  const authUser = toAuthUser(user);
  res.status(201).json({ success: true, data: { user: authUser, token: signToken(authUser) } });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as { email: string; password: string };
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }
  const authUser = toAuthUser(user);
  res.json({ success: true, data: { user: authUser, token: signToken(authUser) } });
};

export const me = async (req: Request, res: Response): Promise<void> => {
  res.json({ success: true, data: { user: (req as Request & { user?: unknown }).user } });
};
