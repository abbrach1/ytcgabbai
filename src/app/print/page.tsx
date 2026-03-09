"use client";

import { useState, useEffect } from "react";

interface Member {
  id: string;
  first_name: string;
  last_name: string;
  hebrew_name: string;
  father_name: string;
  seat_number: string;
  phone: string;
  notes: string;
}

export default function PrintAllCards() {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    fetch("/api/members")
      .then((res) => res.json())
      .then(setMembers);
  }, []);

  useEffect(() => {
    if (members.length > 0) {
      setTimeout(() => window.print(), 500);
    }
  }, [members]);

  return (
    <>
      <style jsx global>{`
        @media print {
          body { margin: 0; }
          .no-print { display: none !important; }
          .card { page-break-inside: avoid; }
        }
      `}</style>

      <div className="no-print p-4 text-center">
        <button onClick={() => window.print()} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Print Cards
        </button>
        <button onClick={() => window.close()} className="px-6 py-2 ml-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
          Close
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 p-8">
        {members.map((member) => (
          <div key={member.id} className="card border-2 border-gray-800 rounded-lg p-6">
            <div className="text-center border-b-2 border-gray-300 pb-3 mb-3">
              <h2 className="text-xl font-bold">
                {member.first_name} {member.last_name}
              </h2>
              {member.hebrew_name && (
                <p className="text-lg mt-1" dir="rtl">
                  {member.hebrew_name}
                  {member.father_name && <span> בן {member.father_name}</span>}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
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
            </div>
            {member.notes && <p className="text-sm mt-2 text-gray-600 italic">{member.notes}</p>}
          </div>
        ))}
      </div>
    </>
  );
}
