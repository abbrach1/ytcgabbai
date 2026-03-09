"use client";

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
}

interface MemberCardProps {
  member: Member;
  onEdit: (member: Member) => void;
  onDelete: (id: string) => void;
  onPrint: (id: string) => void;
}

export default function MemberCard({ member, onEdit, onDelete, onPrint }: MemberCardProps) {
  return (
    <div className={`bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow ${member.is_alumni ? "border-purple-200" : "border-gray-200"}`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {member.first_name} {member.last_name}
          </h3>
          {member.hebrew_name && (
            <p className="text-base text-gray-600" dir="rtl">
              {member.hebrew_name}
              {member.father_name && <span> בן {member.father_name}</span>}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          {member.is_alumni && (
            <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              Alumni
            </span>
          )}
          {member.seat_number && (
            <span className="bg-amber-100 text-amber-800 text-sm font-medium px-3 py-1 rounded-full">
              Seat {member.seat_number}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-2">
        {member.year && (
          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
            {member.year}
          </span>
        )}
        {member.beis_medrash && (
          <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded">
            {member.beis_medrash}
          </span>
        )}
      </div>

      {member.phone && (
        <p className="text-sm text-gray-500 mb-1">
          <span className="font-medium">Phone:</span> {member.phone}
        </p>
      )}
      {member.notes && <p className="text-sm text-gray-500 mb-3 italic">{member.notes}</p>}

      <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
        <button onClick={() => onEdit(member)} className="text-sm px-3 py-1.5 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">
          Edit
        </button>
        <button onClick={() => onPrint(member.id)} className="text-sm px-3 py-1.5 text-green-600 bg-green-50 rounded-lg hover:bg-green-100">
          Print Card
        </button>
        <button onClick={() => onDelete(member.id)} className="text-sm px-3 py-1.5 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 ml-auto">
          Delete
        </button>
      </div>
    </div>
  );
}
