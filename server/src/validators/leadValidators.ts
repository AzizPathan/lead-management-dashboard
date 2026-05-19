import { body, param, query } from "express-validator";

const leadRules = () => [
  body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("status").isIn(["New", "Contacted", "Qualified", "Lost"]).withMessage("Invalid status"),
  body("source").isIn(["Website", "Instagram", "Referral"]).withMessage("Invalid source")
];

export const leadValidator = leadRules();

export const updateLeadValidator = leadRules().map((rule) => rule.optional());

export const leadIdValidator = [param("id").isMongoId().withMessage("Valid lead id is required")];

export const listLeadsValidator = [
  query("status").optional().isIn(["New", "Contacted", "Qualified", "Lost"]),
  query("source").optional().isIn(["Website", "Instagram", "Referral"]),
  query("search").optional().trim().isLength({ max: 80 }),
  query("sort").optional().isIn(["latest", "oldest"]),
  query("page").optional().isInt({ min: 1 }).toInt()
];
