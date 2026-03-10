"use client";

import { useState } from "react";

interface MemberFormData {
  first_name: string;
  last_name: string;
  hebrew_name: string;
  father_name: string;
  seat_number: string;
  phone: string;
  notes: string;
  year_beis_medrash: string;
  is_alumni: boolean;
}

interface MemberFormProps {
  initialData?: MemberFormData;
  onSubmit: (data: MemberFormData) => void;
  onCancel: () => void;
  submitLabel?: string;
}

const emptyForm: MemberFormData = {
  first_name: "",
  last_name: "",
  hebrew_name: "",
  father_name: "",
  seat_number: "",
  phone: "",
  notes: "",
  year_beis_medrash: "",
  is_alumni: false,
};

const field = "w-full px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-800";

export default function MemberForm({ initialData, onSubmit, onCancel, submitLabel = "Save" }: MemberFormProps) {
  const [form, setForm] = useState<MemberFormData>(initialData || emptyForm);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const set = (key: keyof MemberFormData, value: string | boolean) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">First Name *</label>
          <input type="text" required value={form.first_name} onChange={(e) => set("first_name", e.target.value)} className={field} style={{ colorScheme: "light" }} />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Last Name *</label>
          <input type="text" required value={form.last_name} onChange={(e) => set("last_name", e.target.value)} className={field} style={{ colorScheme: "light" }} />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Hebrew Name</label>
          <input type="text" dir="rtl" value={form.hebrew_name} onChange={(e) => set("hebrew_name", e.target.value)} className={field} style={{ colorScheme: "light" }} />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Father&apos;s Name</label>
          <input type="text" dir="rtl" value={form.father_name} onChange={(e) => set("father_name", e.target.value)} className={field} style={{ colorScheme: "light" }} />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Year / Beis Medrash</label>
          <input type="text" placeholder="e.g. 5785 BM Aleph" value={form.year_beis_medrash} onChange={(e) => set("year_beis_medrash", e.target.value)} className={field} style={{ colorScheme: "light" }} />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Seat #</label>
          <input type="text" value={form.seat_number} onChange={(e) => set("seat_number", e.target.value)} className={field} style={{ colorScheme: "light" }} />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Phone</label>
          <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} className={field} style={{ colorScheme: "light" }} />
        </div>
      </div>
      <div className="mb-3">
        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Notes</label>
        <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} rows={2} className={field} style={{ colorScheme: "light", resize: "vertical" }} />
      </div>
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.is_alumni}
            onChange={(e) => set("is_alumni", e.target.checked)}
            className="w-4 h-4 accent-purple-700"
          />
          <span className="text-sm text-gray-600">Mark as Alumni</span>
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-1.5 text-sm text-gray-600 border border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-1.5 text-sm font-semibold text-white"
            style={{ background: "#1c3a5e" }}
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
