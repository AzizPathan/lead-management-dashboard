import { api } from "./client";
import type { ApiResponse, Role, User } from "../types";

export interface AuthPayload {
  user: User;
  token: string;
}

export const loginRequest = async (email: string, password: string): Promise<AuthPayload> => {
  const { data } = await api.post<ApiResponse<AuthPayload>>("/auth/login", { email, password });
  return data.data;
};

export const registerRequest = async (input: { name: string; email: string; password: string; role: Role }): Promise<AuthPayload> => {
  const { data } = await api.post<ApiResponse<AuthPayload>>("/auth/register", input);
  return data.data;
};

export const meRequest = async (): Promise<User> => {
  const { data } = await api.get<ApiResponse<{ user: User }>>("/auth/me");
  return data.data.user;
};
