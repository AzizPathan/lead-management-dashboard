import { connectDb } from "./config/db.js";
import { Lead } from "./models/Lead.js";
import { User } from "./models/User.js";

await connectDb();

await Promise.all([User.deleteMany({}), Lead.deleteMany({})]);

const admin = await User.create({
  name: "Admin User",
  email: "admin@smartleads.dev",
  password: "Password123",
  role: "admin"
});

const sales = await User.create({
  name: "Sales User",
  email: "sales@smartleads.dev",
  password: "Password123",
  role: "sales"
});

const names = ["Rahul Sharma", "Aisha Khan", "Neha Patel", "Arjun Mehta", "Priya Singh", "Karan Verma", "Sara Thomas", "Vikram Rao", "Meera Iyer", "Rohan Das", "Ishita Jain", "Aditya Nair"];
const statuses = ["New", "Contacted", "Qualified", "Lost"] as const;
const sources = ["Website", "Instagram", "Referral"] as const;

await Lead.insertMany(
  names.map((name, index) => ({
    name,
    email: `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
    status: statuses[index % statuses.length],
    source: sources[index % sources.length],
    owner: index % 2 === 0 ? admin._id : sales._id
  }))
);

console.log("Seeded demo users and leads");
process.exit(0);
