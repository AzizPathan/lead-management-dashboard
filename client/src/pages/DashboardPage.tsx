import { ChevronRight, Download, Edit, Filter, FolderOpen, Mail, Plus, Search, SlidersHorizontal, Trash2, Trophy, UsersRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createLeadRequest, deleteLeadRequest, exportLeadsRequest, getLeadRequest, listLeadsRequest, updateLeadRequest, type LeadInput } from "../api/leads";
import { getApiError } from "../api/client";
import { Button } from "../components/Button";
import { Input, Select } from "../components/Input";
import { LeadModal } from "../components/LeadModal";
import { useAuth } from "../context/AuthContext";
import { useDebounce } from "../hooks/useDebounce";
import type { Lead, LeadFilters, LeadSource, LeadStatus, Pagination } from "../types";

const statuses: Array<LeadStatus | ""> = ["", "New", "Contacted", "Qualified", "Lost"];
const sources: Array<LeadSource | ""> = ["", "Website", "Instagram", "Referral"];

const badgeStyles: Record<LeadStatus, string> = {
  New: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200",
  Contacted: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
  Qualified: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  Lost: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200"
};

export const DashboardPage = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [filters, setFilters] = useState<LeadFilters>({ sort: "latest", page: 1 });
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [modalLead, setModalLead] = useState<Lead | null | undefined>(undefined);

  const activeFilters = useMemo(() => ({ ...filters, search: debouncedSearch, page: filters.page ?? 1 }), [debouncedSearch, filters]);
  const visibleQualified = useMemo(() => leads.filter((lead) => lead.status === "Qualified").length, [leads]);

  const fetchLeads = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await listLeadsRequest(activeFilters);
      setLeads(result.items);
      setPagination(result.pagination);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchLeads();
  }, [activeFilters]);

  const setFilter = <K extends keyof LeadFilters>(key: K, value: LeadFilters[K]) => {
    setFilters((current) => ({ ...current, [key]: value, page: 1 }));
  };

  const saveLead = async (input: LeadInput) => {
    setSaving(true);
    setError("");
    try {
      if (modalLead) await updateLeadRequest(modalLead._id, input);
      else await createLeadRequest(input);
      setModalLead(undefined);
      await fetchLeads();
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const editLead = async (lead: Lead) => {
    setError("");
    try {
      setModalLead(await getLeadRequest(lead._id));
    } catch (err) {
      setError(getApiError(err));
    }
  };

  const removeLead = async (lead: Lead) => {
    const confirmed = window.confirm(`Delete ${lead.name}?`);
    if (!confirmed) return;
    try {
      await deleteLeadRequest(lead._id);
      await fetchLeads();
    } catch (err) {
      setError(getApiError(err));
    }
  };

  const resetFilters = () => {
    setSearch("");
    setFilters({ sort: "latest", page: 1 });
  };

  const exportCsv = async () => {
    try {
      const blob = await exportLeadsRequest(activeFilters);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "leads.csv";
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(getApiError(err));
    }
  };

  return (
    <div className="px-6 pb-10 pt-8 lg:px-10">
      <section className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Leads</h2>
          <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">Browse Leads</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" icon={<Download size={18} />} onClick={exportCsv} className="rounded-xl">
            Export CSV
          </Button>
          <Button icon={<Plus size={18} />} onClick={() => setModalLead(null)} className="rounded-xl bg-[#EF823B] shadow-lg shadow-orange-600/10 hover:bg-[#df722c]">
            Add Lead
          </Button>
        </div>
      </section>

      <section className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          { icon: UsersRound, label: "Total records", value: pagination?.total ?? 0, tone: "text-brand bg-teal-50 dark:bg-teal-950" },
          { icon: Trophy, label: "Qualified on page", value: visibleQualified, tone: "text-emerald-700 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-300" },
          { icon: Mail, label: "Page size", value: pagination?.limit ?? 10, tone: "text-amber-700 bg-amber-50 dark:bg-amber-950 dark:text-amber-300" }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">{item.label}</p>
                  <p className="mt-1 text-3xl font-black text-[#091024] dark:text-white">{item.value}</p>
                </div>
                <div className={`grid h-12 w-12 place-items-center rounded-2xl ${item.tone}`}>
                  <Icon size={21} />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <section className="mb-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between gap-3">
          <span className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-400">
            <SlidersHorizontal size={14} />
            Search filters
          </span>
          {(filters.status || filters.source || search || filters.sort !== "latest") ? (
            <button onClick={resetFilters} className="text-xs font-bold text-blue-600 transition hover:text-blue-800">
              Reset Filters
            </button>
          ) : null}
        </div>
        <div className="grid gap-4 md:grid-cols-[1.4fr_0.8fr_0.8fr_0.7fr]">
          <label className="grid gap-1.5">
            <span className="text-xs font-bold text-slate-400">Search leads</span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-3 text-slate-400" size={18} />
              <Input className="rounded-xl border-transparent bg-[#EFF3F6] pl-9 shadow-none focus:border-slate-300" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name or email" />
            </div>
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-bold text-slate-400">Status</span>
            <Select className="rounded-xl border-transparent bg-[#EFF3F6] shadow-none focus:border-slate-300" value={filters.status ?? ""} onChange={(event) => setFilter("status", event.target.value as LeadStatus | "")}>
              {statuses.map((status) => <option key={status || "all"} value={status}>{status || "All statuses"}</option>)}
            </Select>
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-bold text-slate-400">Source</span>
            <Select className="rounded-xl border-transparent bg-[#EFF3F6] shadow-none focus:border-slate-300" value={filters.source ?? ""} onChange={(event) => setFilter("source", event.target.value as LeadSource | "")}>
              {sources.map((source) => <option key={source || "all"} value={source}>{source || "All sources"}</option>)}
            </Select>
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-bold text-slate-400">Sort</span>
            <div className="relative">
              <Filter className="pointer-events-none absolute left-3 top-3 text-slate-400" size={18} />
              <Select className="rounded-xl border-transparent bg-[#EFF3F6] pl-9 shadow-none focus:border-slate-300" value={filters.sort ?? "latest"} onChange={(event) => setFilter("sort", event.target.value as "latest" | "oldest")}>
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
              </Select>
            </div>
          </label>
        </div>
      </section>

      {error ? <div className="rounded-md bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 dark:bg-rose-950 dark:text-rose-200">{error}</div> : null}

      <section className="overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="pb-4 pl-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Lead</th>
                <th className="pb-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Status</th>
                <th className="pb-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Source</th>
                <th className="pb-4 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Created</th>
                <th className="pb-4 pr-4 text-right text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    <td className="px-4 py-4" colSpan={5}>
                      <div className="h-10 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
                    </td>
                  </tr>
                ))
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center text-slate-400">
                    <FolderOpen size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-bold">No leads match the current filters.</p>
                    <button onClick={resetFilters} className="mt-3 text-xs font-bold text-blue-600 hover:text-blue-800">Clear all filters</button>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead._id} className="group transition hover:bg-slate-50/70 dark:hover:bg-slate-800/60">
                    <td className="py-3 pl-4 pr-4">
                      <div className="font-bold text-slate-800 transition group-hover:text-blue-600 dark:text-slate-100">{lead.name}</div>
                      <div className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{lead.email}</div>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`inline-flex rounded-lg px-3 py-1 text-xs font-extrabold ${badgeStyles[lead.status]}`}>{lead.status}</span>
                    </td>
                    <td className="py-3 pr-4 text-sm font-bold text-slate-600 dark:text-slate-300">{lead.source}</td>
                    <td className="py-3 pr-4 text-sm font-bold text-slate-500">{new Date(lead.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 pr-4">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={() => void editLead(lead)} aria-label="Edit lead" className="h-9 w-9 rounded-full px-0">
                          <Edit size={17} />
                        </Button>
                        {user?.role === "admin" ? (
                          <Button variant="ghost" onClick={() => void removeLead(lead)} aria-label="Delete lead" className="h-9 w-9 rounded-full px-0 hover:bg-red-50 hover:text-red-600">
                            <Trash2 size={17} />
                          </Button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 dark:border-slate-800 sm:flex-row">
          <p className="text-xs font-medium text-slate-400">
            Page {pagination?.page ?? 1} of {pagination?.totalPages ?? 1} · {pagination?.total ?? 0} leads
          </p>
          <div className="flex items-center gap-2">
            <Button variant="secondary" disabled={!pagination?.hasPreviousPage} onClick={() => setFilters((current) => ({ ...current, page: (current.page ?? 1) - 1 }))} className="rounded-full">
              Previous
            </Button>
            <Button
              disabled={!pagination?.hasNextPage}
              onClick={() => setFilters((current) => ({ ...current, page: (current.page ?? 1) + 1 }))}
              className="rounded-full bg-[#091024] hover:bg-slate-800"
              icon={<ChevronRight size={17} />}
            >
              Next
            </Button>
          </div>
        </div>
      </section>

      {modalLead !== undefined ? <LeadModal lead={modalLead} onClose={() => setModalLead(undefined)} onSubmit={saveLead} isSaving={saving} /> : null}
    </div>
  );
};
