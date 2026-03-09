import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "gabbai.db");

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.exec(`
      CREATE TABLE IF NOT EXISTS members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        hebrew_name TEXT DEFAULT '',
        father_name TEXT DEFAULT '',
        seat_number TEXT DEFAULT '',
        phone TEXT DEFAULT '',
        notes TEXT DEFAULT '',
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      )
    `);
  }
  return db;
}

export interface Member {
  id: number;
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

export function getAllMembers(): Member[] {
  return getDb().prepare("SELECT * FROM members ORDER BY last_name, first_name").all() as Member[];
}

export function getMemberById(id: number): Member | undefined {
  return getDb().prepare("SELECT * FROM members WHERE id = ?").get(id) as Member | undefined;
}

export function createMember(data: Omit<Member, "id" | "created_at" | "updated_at">): Member {
  const stmt = getDb().prepare(`
    INSERT INTO members (first_name, last_name, hebrew_name, father_name, seat_number, phone, notes)
    VALUES (@first_name, @last_name, @hebrew_name, @father_name, @seat_number, @phone, @notes)
  `);
  const result = stmt.run(data);
  return getMemberById(result.lastInsertRowid as number)!;
}

export function updateMember(id: number, data: Partial<Omit<Member, "id" | "created_at" | "updated_at">>): Member | undefined {
  const fields = Object.keys(data)
    .filter((k) => data[k as keyof typeof data] !== undefined)
    .map((k) => `${k} = @${k}`)
    .join(", ");
  if (!fields) return getMemberById(id);
  getDb().prepare(`UPDATE members SET ${fields}, updated_at = datetime('now') WHERE id = @id`).run({ ...data, id });
  return getMemberById(id);
}

export function deleteMember(id: number): boolean {
  const result = getDb().prepare("DELETE FROM members WHERE id = ?").run(id);
  return result.changes > 0;
}

export function searchMembers(query: string): Member[] {
  const pattern = `%${query}%`;
  return getDb()
    .prepare(
      `SELECT * FROM members
       WHERE first_name LIKE ? OR last_name LIKE ? OR hebrew_name LIKE ? OR seat_number LIKE ?
       ORDER BY last_name, first_name`
    )
    .all(pattern, pattern, pattern, pattern) as Member[];
}
