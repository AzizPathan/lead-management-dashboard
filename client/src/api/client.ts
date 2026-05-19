import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5000/api"
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("smart_leads_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return (error.response?.data as { message?: string } | undefined)?.message ?? "Request failed";
  }
  return "Something went wrong";
};
