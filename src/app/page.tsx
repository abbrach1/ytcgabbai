"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import MemberCard from "@/components/MemberCard";
import MemberForm from "@/components/MemberForm";

interface Member {
  id: string;
  first_name: string;
  last_name: string;
  hebrew_name: string;
  father_name: string;
  seat_number: string;
  phone: string;
  notes: string;
  year: string;
  beis_medrash: string;
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
  const [filterYear, setFilterYear] = useState("");
  const [filterBM, setFilterBM] = useState("");
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

  const years = useMemo(() => {
    const set = new Set(members.map((m) => m.year).filter(Boolean));
    return Array.from(set).sort();
  }, [members]);

  const beisOptions = useMemo(() => {
    const set = new Set(members.map((m) => m.beis_medrash).filter(Boolean));
    return Array.from(set).sort();
  }, [members]);

  const filtered = useMemo(() => {
    return members.filter((m) => {
      if (filterYear && m.year !== filterYear) return false;
      if (filterBM && m.beis_medrash !== filterBM) return false;
      if (showAlumni === "current" && m.is_alumni) return false;
      if (showAlumni === "alumni" && !m.is_alumni) return false;
      return true;
    });
  }, [members, filterYear, filterBM, showAlumni]);

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
    if (filterYear) params.set("year", filterYear);
    if (filterBM) params.set("bm", filterBM);
    if (showAlumni !== "all") params.set("alumni", showAlumni);
    const qs = params.toString();
    window.open(`/print${qs ? `?${qs}` : ""}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gabbai Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">
                {filtered.length} member{filtered.length !== 1 ? "s" : ""}
                {filtered.length !== members.length && ` (of ${members.length} total)`}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handlePrintAll}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium"
              >
                Print All Cards
              </button>
              <button
                onClick={() => {
                  setEditing(null);
                  setShowForm(true);
                }}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-medium"
              >
                + Add Member
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6">
        {/* Search & Filters */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name, Hebrew name, seat, year, or beis medrash..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
              />
            </div>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="bg-gray-50 border-2 border-gray-200 rounded-lg px-3 py-2.5 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Years</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <select
              value={filterBM}
              onChange={(e) => setFilterBM(e.target.value)}
              className="bg-gray-50 border-2 border-gray-200 rounded-lg px-3 py-2.5 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Beis Medrash</option>
              {beisOptions.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            <select
              value={showAlumni}
              onChange={(e) => setShowAlumni(e.target.value as "all" | "current" | "alumni")}
              className="bg-gray-50 border-2 border-gray-200 rounded-lg px-3 py-2.5 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Members</option>
              <option value="current">Current Only</option>
              <option value="alumni">Alumni Only</option>
            </select>
          </div>
        </div>

        {/* Add / Edit Form */}
        {(showForm || editing) && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">{editing ? "Edit Member" : "Add New Member"}</h2>
            <MemberForm
              initialData={
                editing
                  ? {
                      first_name: editing.first_name,
                      last_name: editing.last_name,
                      hebrew_name: editing.hebrew_name,
                      father_name: editing.father_name,
                      seat_number: editing.seat_number,
                      phone: editing.phone,
                      notes: editing.notes,
                      year: editing.year,
                      beis_medrash: editing.beis_medrash,
                      is_alumni: editing.is_alumni,
                    }
                  : undefined
              }
              onSubmit={editing ? handleUpdate : handleCreate}
              onCancel={() => {
                setShowForm(false);
                setEditing(null);
              }}
              submitLabel={editing ? "Update" : "Add Member"}
            />
          </div>
        )}

        {/* Member Grid */}
        {loading ? (
          <p className="text-gray-500 text-center py-12">Loading...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg mb-2">
              {members.length === 0 ? "No members yet" : "No members match your filters"}
            </p>
            <p className="text-gray-400 text-sm">
              {members.length === 0 ? "Click \"+ Add Member\" to get started" : "Try adjusting your search or filters"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((m) => (
              <MemberCard key={m.id} member={m} onEdit={(member) => setEditing(members.find((x) => x.id === member.id) || null)} onDelete={handleDelete} onPrint={handlePrint} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
