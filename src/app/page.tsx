"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import MemberCard from "@/components/MemberCard";
import MemberForm from "@/components/MemberForm";

interface Member {
  id: string;
  first_name: string;
  last_name: string;
  hebrew_name: string;
  father_name: string;
  notes: string;
  year_beis_medrash: string;
  is_alumni: boolean;
  created_at: string;
  updated_at: string;
}

export default function Dashboard() {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterYBM, setFilterYBM] = useState("");
  const [showAlumni, setShowAlumni] = useState<"all" | "current" | "alumni">("all");

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    const url = search ? `/api/members?q=${encodeURIComponent(search)}` : "/api/members";
    const res = await fetch(url);
    const data = await res.json();
    setMembers(data);
    setLoading(false);
  }, [search]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const ybmOptions = useMemo(() => {
    const set = new Set(members.map((m) => m.year_beis_medrash).filter(Boolean));
    return Array.from(set).sort();
  }, [members]);

  const filtered = useMemo(() => {
    return members.filter((m) => {
      if (filterYBM && m.year_beis_medrash !== filterYBM) return false;
      if (showAlumni === "current" && m.is_alumni) return false;
      if (showAlumni === "alumni" && !m.is_alumni) return false;
      return true;
    });
  }, [members, filterYBM, showAlumni]);

  const handleCreate = async (data: Omit<Member, "id" | "created_at" | "updated_at">) => {
    await fetch("/api/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setShowForm(false);
    fetchMembers();
  };

  const handleUpdate = async (data: Omit<Member, "id" | "created_at" | "updated_at">) => {
    if (!editing) return;
    await fetch(`/api/members/${editing.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setEditing(null);
    fetchMembers();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this member?")) return;
    await fetch(`/api/members/${id}`, { method: "DELETE" });
    fetchMembers();
  };

  const handlePrint = (id: string) => {
    window.open(`/print/${id}`, "_blank");
  };

  const handlePrintAll = () => {
    const params = new URLSearchParams();
    if (filterYBM) params.set("ybm", filterYBM);
    if (showAlumni !== "all") params.set("alumni", showAlumni);
    const qs = params.toString();
    window.open(`/print${qs ? `?${qs}` : ""}`, "_blank");
  };

  return (
    <div className="min-h-screen" style={{ background: "#f5f4f0" }}>
      {/* Header */}
      <header style={{ background: "#1c3a5e", borderBottom: "3px solid #c8a84b" }}>
        <div className="max-w-6xl mx-auto px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="Toras Chaim Logo" width={56} height={56} style={{ filter: "brightness(0) invert(1)" }} />
              <div>
                <h1 className="text-xl font-bold tracking-wide" style={{ color: "#c8a84b", letterSpacing: "0.05em" }}>
                  תורת חיים
                </h1>
                <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "#8fb3d4", letterSpacing: "0.15em" }}>
                  Gabbai System
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm mr-2" style={{ color: "#8fb3d4" }}>
                {filtered.length} {filtered.length !== members.length ? `/ ${members.length}` : ""} members
              </span>
              <button
                onClick={handlePrintAll}
                className="px-3 py-1.5 text-sm font-medium border"
                style={{ color: "#c8a84b", borderColor: "#c8a84b", background: "transparent" }}
                onMouseEnter={e => { (e.target as HTMLElement).style.background = "rgba(200,168,75,0.1)"; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.background = "transparent"; }}
              >
                Print All
              </button>
              <button
                onClick={() => { setEditing(null); setShowForm(true); }}
                className="px-3 py-1.5 text-sm font-bold"
                style={{ background: "#c8a84b", color: "#1c3a5e" }}
                onMouseEnter={e => { (e.target as HTMLElement).style.background = "#d4b45e"; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.background = "#c8a84b"; }}
              >
                + Add Member
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 py-5">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2 mb-5">
          <input
            type="text"
            placeholder="Search name, seat, year..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-3 py-2 text-sm border border-gray-300"
            style={{ background: "#fff", color: "#1a1a1a", outline: "none" }}
            onFocus={e => { (e.target as HTMLElement).style.borderColor = "#1c3a5e"; }}
            onBlur={e => { (e.target as HTMLElement).style.borderColor = "#d1d5db"; }}
          />
          <select
            value={filterYBM}
            onChange={(e) => setFilterYBM(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300"
            style={{ background: "#fff", color: "#1a1a1a" }}
          >
            <option value="">All Year / BM</option>
            {ybmOptions.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <select
            value={showAlumni}
            onChange={(e) => setShowAlumni(e.target.value as "all" | "current" | "alumni")}
            className="px-3 py-2 text-sm border border-gray-300"
            style={{ background: "#fff", color: "#1a1a1a" }}
          >
            <option value="all">All Members</option>
            <option value="current">Current Only</option>
            <option value="alumni">Alumni Only</option>
          </select>
        </div>

        {/* Add / Edit Form */}
        {(showForm || editing) && (
          <div className="mb-5 border border-gray-300 bg-white" style={{ borderTop: "3px solid #1c3a5e" }}>
            <div className="px-5 py-3 border-b border-gray-200" style={{ background: "#f8f7f4" }}>
              <h2 className="font-semibold text-sm uppercase tracking-wider" style={{ color: "#1c3a5e" }}>
                {editing ? "Edit Member" : "Add New Member"}
              </h2>
            </div>
            <div className="p-5">
              <MemberForm
                initialData={
                  editing
                    ? {
                        first_name: editing.first_name,
                        last_name: editing.last_name,
                        hebrew_name: editing.hebrew_name,
                        father_name: editing.father_name,
                        notes: editing.notes,
                        year_beis_medrash: editing.year_beis_medrash,
                        is_alumni: editing.is_alumni,
                      }
                    : undefined
                }
                onSubmit={editing ? handleUpdate : handleCreate}
                onCancel={() => { setShowForm(false); setEditing(null); }}
                submitLabel={editing ? "Save Changes" : "Add Member"}
              />
            </div>
          </div>
        )}

        {/* Member Grid */}
        {loading ? (
          <p className="text-center py-16 text-sm" style={{ color: "#666" }}>Loading...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 mb-1">{members.length === 0 ? "No members yet." : "No results."}</p>
            <p className="text-sm text-gray-400">{members.length === 0 ? 'Click "+ Add Member" to get started.' : "Try a different search or filter."}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((m) => (
              <MemberCard
                key={m.id}
                member={m}
                onEdit={(member) => setEditing(members.find((x) => x.id === member.id) || null)}
                onDelete={handleDelete}
                onPrint={handlePrint}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
