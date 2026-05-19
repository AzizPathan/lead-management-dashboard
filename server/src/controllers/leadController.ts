import type { Response } from "express";
import { Parser } from "json2csv";
import { Lead, type ILead } from "../models/Lead.js";
import { ApiError } from "../utils/ApiError.js";
import type { AuthedRequest, LeadSource, LeadStatus } from "../types.js";

interface LeadQuery {
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sort?: "latest" | "oldest";
  page?: string;
}

const buildFilter = (query: LeadQuery, user: NonNullable<AuthedRequest["user"]>) => {
  const filter: Record<string, unknown> = {};
  if (query.status) filter.status = query.status;
  if (query.source) filter.source = query.source;
  if (query.search) {
    const regex = new RegExp(query.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [{ name: regex }, { email: regex }];
  }
  if (user.role === "sales") filter.owner = user.id;
  return filter;
};

export const listLeads = async (req: AuthedRequest, res: Response): Promise<void> => {
  if (!req.user) throw new ApiError(401, "Authentication required");
  const query = req.query as LeadQuery;
  const page = Math.max(Number(query.page ?? 1), 1);
  const limit = 10;
  const filter = buildFilter(query, req.user);
  const sort = { createdAt: query.sort === "oldest" ? 1 : -1 } as const;

  const [items, total] = await Promise.all([
    Lead.find(filter).sort(sort).skip((page - 1) * limit).limit(limit).lean(),
    Lead.countDocuments(filter)
  ]);

  res.json({
    success: true,
    data: {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1
      }
    }
  });
};

export const getLead = async (req: AuthedRequest, res: Response): Promise<void> => {
  if (!req.user) throw new ApiError(401, "Authentication required");
  const filter = buildFilter({}, req.user);
  const lead = await Lead.findOne({ _id: req.params.id, ...filter }).lean();
  if (!lead) throw new ApiError(404, "Lead not found");
  res.json({ success: true, data: { lead } });
};

export const createLead = async (req: AuthedRequest, res: Response): Promise<void> => {
  if (!req.user) throw new ApiError(401, "Authentication required");
  const lead = await Lead.create({ ...(req.body as ILead), owner: req.user.id });
  res.status(201).json({ success: true, data: { lead } });
};

export const updateLead = async (req: AuthedRequest, res: Response): Promise<void> => {
  if (!req.user) throw new ApiError(401, "Authentication required");
  const filter = buildFilter({}, req.user);
  const lead = await Lead.findOneAndUpdate({ _id: req.params.id, ...filter }, req.body, { new: true, runValidators: true });
  if (!lead) throw new ApiError(404, "Lead not found");
  res.json({ success: true, data: { lead } });
};

export const deleteLead = async (req: AuthedRequest, res: Response): Promise<void> => {
  if (!req.user) throw new ApiError(401, "Authentication required");
  if (req.user.role !== "admin") throw new ApiError(403, "Only admins can delete leads");
  const lead = await Lead.findByIdAndDelete(req.params.id);
  if (!lead) throw new ApiError(404, "Lead not found");
  res.status(204).send();
};

export const exportLeads = async (req: AuthedRequest, res: Response): Promise<void> => {
  if (!req.user) throw new ApiError(401, "Authentication required");
  const leads = await Lead.find(buildFilter(req.query as LeadQuery, req.user)).sort({ createdAt: -1 }).lean();
  const parser = new Parser({ fields: ["name", "email", "status", "source", "createdAt"] });
  const csv = parser.parse(leads);
  res.header("Content-Type", "text/csv");
  res.attachment("leads.csv");
  res.send(csv);
};
