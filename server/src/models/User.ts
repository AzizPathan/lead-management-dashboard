import bcrypt from "bcryptjs";
import mongoose, { Schema, type HydratedDocument } from "mongoose";
import type { Role } from "../types.js";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserMethods {
  comparePassword(candidate: string): Promise<boolean>;
}

export type UserDocument = HydratedDocument<IUser, IUserMethods>;

const userSchema = new Schema<IUser, mongoose.Model<IUser, object, IUserMethods>, IUserMethods>(
  {
    name: { type: String, required: true, trim: true, minlength: 2 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: ["admin", "sales"], default: "sales" }
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model<IUser, mongoose.Model<IUser, object, IUserMethods>>("User", userSchema);
