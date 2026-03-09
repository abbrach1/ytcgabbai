"use client";

interface Member {
  id: number;
  first_name: string;
  last_name: string;
  hebrew_name: string;
  father_name: string;
  seat_number: string;
  phone: string;
  notes: string;
}

interface MemberCardProps {
  member: Member;
  onEdit: (member: Member) => void;
  onDelete: (id: number) => void;
  onPrint: (id: number) => void;
}

export default function MemberCard({ member, onEdit, onDelete, onPrint }: MemberCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
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
        {member.seat_number && (
          <span className="bg-amber-100 text-amber-800 text-sm font-medium px-3 py-1 rounded-full">
            Seat {member.seat_number}
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
