import { api } from "./client";
import type { ApiResponse, Lead, LeadFilters, LeadSource, LeadStatus, Pagination } from "../types";

export interface LeadInput {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
}

export const listLeadsRequest = async (filters: LeadFilters): Promise<{ items: Lead[]; pagination: Pagination }> => {
  const { data } = await api.get<ApiResponse<{ items: Lead[]; pagination: Pagination }>>("/leads", { params: filters });
  return data.data;
};

export const createLeadRequest = async (input: LeadInput): Promise<Lead> => {
  const { data } = await api.post<ApiResponse<{ lead: Lead }>>("/leads", input);
  return data.data.lead;
};

export const getLeadRequest = async (id: string): Promise<Lead> => {
  const { data } = await api.get<ApiResponse<{ lead: Lead }>>(`/leads/${id}`);
  return data.data.lead;
};

export const updateLeadRequest = async (id: string, input: LeadInput): Promise<Lead> => {
  const { data } = await api.put<ApiResponse<{ lead: Lead }>>(`/leads/${id}`, input);
  return data.data.lead;
};

export const deleteLeadRequest = async (id: string): Promise<void> => {
  await api.delete(`/leads/${id}`);
};

export const exportLeadsRequest = async (filters: LeadFilters): Promise<Blob> => {
  const { data } = await api.get("/leads/export", { params: filters, responseType: "blob" });
  return data as Blob;
};
