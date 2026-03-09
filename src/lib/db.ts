import { db } from "./firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";

const COLLECTION = "members";

export interface Member {
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

function docToMember(id: string, data: Record<string, unknown>): Member {
  return {
    id,
    first_name: (data.first_name as string) || "",
    last_name: (data.last_name as string) || "",
    hebrew_name: (data.hebrew_name as string) || "",
    father_name: (data.father_name as string) || "",
    seat_number: (data.seat_number as string) || "",
    phone: (data.phone as string) || "",
    notes: (data.notes as string) || "",
    created_at: data.created_at instanceof Timestamp ? data.created_at.toDate().toISOString() : (data.created_at as string) || "",
    updated_at: data.updated_at instanceof Timestamp ? data.updated_at.toDate().toISOString() : (data.updated_at as string) || "",
  };
}

export async function getAllMembers(): Promise<Member[]> {
  const q = query(collection(db, COLLECTION), orderBy("last_name"), orderBy("first_name"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => docToMember(d.id, d.data()));
}

export async function getMemberById(id: string): Promise<Member | undefined> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return undefined;
  return docToMember(snap.id, snap.data());
}

export async function createMember(data: Omit<Member, "id" | "created_at" | "updated_at">): Promise<Member> {
  const now = Timestamp.now();
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    created_at: now,
    updated_at: now,
  });
  return (await getMemberById(docRef.id))!;
}

export async function updateMember(id: string, data: Partial<Omit<Member, "id" | "created_at" | "updated_at">>): Promise<Member | undefined> {
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return undefined;
  await updateDoc(ref, { ...data, updated_at: Timestamp.now() });
  return getMemberById(id);
}

export async function deleteMember(id: string): Promise<boolean> {
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return false;
  await deleteDoc(ref);
  return true;
}

export async function searchMembers(queryStr: string): Promise<Member[]> {
  // Firestore doesn't support LIKE queries, so fetch all and filter client-side
  const all = await getAllMembers();
  const lower = queryStr.toLowerCase();
  return all.filter(
    (m) =>
      m.first_name.toLowerCase().includes(lower) ||
      m.last_name.toLowerCase().includes(lower) ||
      m.hebrew_name.includes(queryStr) ||
      m.seat_number.toLowerCase().includes(lower)
  );
}
