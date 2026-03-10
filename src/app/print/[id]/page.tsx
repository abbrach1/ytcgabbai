"use client";

import { useState, useEffect, use } from "react";

interface Member {
  id: string;
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

export default function PrintSingleCard({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [member, setMember] = useState<Member | null>(null);

  useEffect(() => {
    fetch(`/api/members/${id}`)
      .then((res) => res.json())
      .then(setMember);
  }, [id]);

  useEffect(() => {
    if (member) {
      setTimeout(() => window.print(), 500);
    }
  }, [member]);

  if (!member) return <p className="text-center py-12">Loading...</p>;

  return (
    <>
      <style jsx global>{`
        @media print {
          body { margin: 0; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="no-print p-4 text-center">
        <button onClick={() => window.print()} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Print Card
        </button>
        <button onClick={() => window.close()} className="px-6 py-2 ml-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
          Close
        </button>
      </div>

      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="border-2 border-gray-800 rounded-lg p-8 w-96">
          <div className="text-center border-b-2 border-gray-300 pb-4 mb-4">
            <p className="text-xs font-medium text-gray-500 mb-1">Toras Chaim</p>
            <h2 className="text-2xl font-bold text-gray-900">
              {member.first_name} {member.last_name}
            </h2>
            {member.hebrew_name && (
              <p className="text-xl mt-2 text-gray-800" dir="rtl">
                {member.hebrew_name}
                {member.father_name && <span> בן {member.father_name}</span>}
              </p>
            )}
          </div>
          <div className="space-y-2 text-sm text-gray-900">
            {member.seat_number && (
              <div>
                <span className="font-semibold">Seat:</span> {member.seat_number}
              </div>
            )}
            {member.phone && (
              <div>
                <span className="font-semibold">Phone:</span> {member.phone}
              </div>
            )}
            {member.year_beis_medrash && (
              <div>
                <span className="font-semibold">Year / BM:</span> {member.year_beis_medrash}
              </div>
            )}
          </div>
          {member.is_alumni && <p className="text-sm mt-3 font-semibold text-purple-700">Alumni</p>}
          {member.notes && <p className="text-sm mt-3 text-gray-600 italic">{member.notes}</p>}
        </div>
      </div>
    </>
  );
}
