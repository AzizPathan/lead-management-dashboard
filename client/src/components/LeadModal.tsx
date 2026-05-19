import { X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./Button";
import { Field, Input, Select } from "./Input";
import type { Lead, LeadSource, LeadStatus } from "../types";
import type { LeadInput } from "../api/leads";

const statuses: LeadStatus[] = ["New", "Contacted", "Qualified", "Lost"];
const sources: LeadSource[] = ["Website", "Instagram", "Referral"];

export const LeadModal = ({
  lead,
  onClose,
  onSubmit,
  isSaving
}: {
  lead: Lead | null;
  onClose: () => void;
  onSubmit: (input: LeadInput) => Promise<void>;
  isSaving: boolean;
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<LeadInput>({
    defaultValues: { name: "", email: "", status: "New", source: "Website" }
  });

  useEffect(() => {
    reset(lead ? { name: lead.name, email: lead.email, status: lead.status, source: lead.source } : { name: "", email: "", status: "New", source: "Website" });
  }, [lead, reset]);

  return (
    <div className="fixed inset-0 z-30 grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand dark:text-teal-300">Lead details</p>
            <h2 className="mt-1 text-xl font-black">{lead ? "Edit lead" : "Create lead"}</h2>
          </div>
          <Button type="button" variant="ghost" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </Button>
        </div>
        <div className="grid gap-4">
          <Field label="Name" error={errors.name?.message}>
            <Input {...register("name", { required: "Name is required", minLength: { value: 2, message: "Use at least 2 characters" } })} />
          </Field>
          <Field label="Email" error={errors.email?.message}>
            <Input type="email" {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" } })} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Status">
              <Select {...register("status")}>{statuses.map((status) => <option key={status}>{status}</option>)}</Select>
            </Field>
            <Field label="Source">
              <Select {...register("source")}>{sources.map((source) => <option key={source}>{source}</option>)}</Select>
            </Field>
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save lead"}
          </Button>
        </div>
      </form>
    </div>
  );
};
