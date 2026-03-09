"use client";

import { useState, useEffect, useCallback } from "react";
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
  created_at: string;
  updated_at: string;
}

export default function Dashboard() {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

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
    window.open("/print", "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gabbai Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">{members.length} member{members.length !== 1 ? "s" : ""} total</p>
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
        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name, Hebrew name, or seat number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
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
        ) : members.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg mb-2">No members yet</p>
            <p className="text-gray-400 text-sm">Click &quot;Add Member&quot; to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((m) => (
              <MemberCard key={m.id} member={m} onEdit={(member) => setEditing(members.find((x) => x.id === member.id) || null)} onDelete={handleDelete} onPrint={handlePrint} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
