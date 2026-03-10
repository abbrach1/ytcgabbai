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

const inputClass = "w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400";

export default function MemberForm({ initialData, onSubmit, onCancel, submitLabel = "Save" }: MemberFormProps) {
  const [form, setForm] = useState<MemberFormData>(initialData || emptyForm);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const set = (field: keyof MemberFormData, value: string | boolean) => setForm((f) => ({ ...f, [field]: value }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
          <input type="text" required value={form.first_name} onChange={(e) => set("first_name", e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
          <input type="text" required value={form.last_name} onChange={(e) => set("last_name", e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hebrew Name</label>
          <input type="text" dir="rtl" value={form.hebrew_name} onChange={(e) => set("hebrew_name", e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Father&apos;s Name (ben/bat)</label>
          <input type="text" dir="rtl" value={form.father_name} onChange={(e) => set("father_name", e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Year / Beis Medrash</label>
          <input type="text" placeholder="e.g. 5785 BM Aleph, 2024 Main" value={form.year_beis_medrash} onChange={(e) => set("year_beis_medrash", e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Seat Number</label>
          <input type="text" value={form.seat_number} onChange={(e) => set("seat_number", e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inputClass} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} rows={3} className={inputClass} />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_alumni"
          checked={form.is_alumni}
          onChange={(e) => set("is_alumni", e.target.checked)}
          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
        />
        <label htmlFor="is_alumni" className="text-sm font-medium text-gray-700">Alumni</label>
      </div>
      <div className="flex gap-3 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
