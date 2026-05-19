export type Role = "admin" | "sales";
export type LeadStatus = "New" | "Contacted" | "Qualified" | "Lost";
export type LeadSource = "Website" | "Instagram" | "Referral";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface LeadFilters {
  status?: LeadStatus | "";
  source?: LeadSource | "";
  search?: string;
  sort?: "latest" | "oldest";
  page?: number;
}
