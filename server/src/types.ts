import type { Request } from "express";

export type Role = "admin" | "sales";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthedRequest extends Request {
  user?: AuthUser;
}

export type LeadStatus = "New" | "Contacted" | "Qualified" | "Lost";
export type LeadSource = "Website" | "Instagram" | "Referral";
