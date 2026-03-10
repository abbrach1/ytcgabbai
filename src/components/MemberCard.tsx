"use client";

interface Member {
  id: string;
  first_name: string;
  last_name: string;
  hebrew_name: string;
  father_name: string;
  notes: string;
  year_beis_medrash: string;
  is_alumni: boolean;
}

interface MemberCardProps {
  member: Member;
  onEdit: (member: Member) => void;
  onDelete: (id: string) => void;
  onPrint: (id: string) => void;
}

export default function MemberCard({ member, onEdit, onDelete, onPrint }: MemberCardProps) {
  return (
    <div
      className="bg-white flex flex-col"
      style={{
        border: "1px solid #d4cfc5",
        borderTop: member.is_alumni ? "3px solid #7c3aed" : "3px solid #1c3a5e",
      }}
    >
      {/* Card body */}
      <div className="px-4 pt-3 pb-2 flex-1">
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0">
            <h3 className="font-bold text-gray-900 leading-tight" style={{ fontSize: "1rem" }}>
              {member.first_name} {member.last_name}
            </h3>
            {member.hebrew_name && (
              <p className="text-sm text-gray-600 mt-0.5" dir="rtl">
                {member.hebrew_name}
                {member.father_name && <span className="text-gray-500"> בן {member.father_name}</span>}
              </p>
            )}
          </div>
        </div>

        <div className="mt-2 space-y-1">
          {member.year_beis_medrash && (
            <p className="text-xs text-gray-500">
              <span className="font-medium text-gray-700">Year / BM:</span> {member.year_beis_medrash}
            </p>
          )}
          {member.notes && (
            <p className="text-xs text-gray-400 italic truncate">{member.notes}</p>
          )}
        </div>

        {member.is_alumni && (
          <span className="inline-block mt-2 text-xs font-medium px-2 py-0.5" style={{ background: "#f3e8ff", color: "#6b21a8" }}>
            Alumni
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex border-t" style={{ borderColor: "#e8e4dc" }}>
        <button
          onClick={() => onEdit(member)}
          className="flex-1 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 border-r"
          style={{ borderColor: "#e8e4dc" }}
        >
          Edit
        </button>
        <button
          onClick={() => onPrint(member.id)}
          className="flex-1 py-1.5 text-xs font-medium hover:bg-blue-50"
          style={{ color: "#1c3a5e" }}
        >
          Print
        </button>
        <button
          onClick={() => onDelete(member.id)}
          className="flex-1 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 border-l"
          style={{ borderColor: "#e8e4dc" }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
