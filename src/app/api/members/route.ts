import { NextRequest, NextResponse } from "next/server";
import { getAllMembers, createMember, searchMembers } from "@/lib/db";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");
  const members = query ? await searchMembers(query) : await getAllMembers();
  return NextResponse.json(members);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  if (!body.first_name || !body.last_name) {
    return NextResponse.json({ error: "First name and last name are required" }, { status: 400 });
  }
  const member = await createMember({
    first_name: body.first_name,
    last_name: body.last_name,
    hebrew_name: body.hebrew_name || "",
    father_name: body.father_name || "",
    seat_number: body.seat_number || "",
    phone: body.phone || "",
    notes: body.notes || "",
  });
  return NextResponse.json(member, { status: 201 });
}
