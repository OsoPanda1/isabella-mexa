import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const baseDir = process.env.ISABELLA_DATA_DIR || join(process.cwd(), ".isabella-data");

export function loadJsonArray<T>(name: string, fallback: T[] = []): T[] {
  const file = join(baseDir, `${name}.json`);
  if (!existsSync(file)) return [...fallback];
  try {
    const parsed = JSON.parse(readFileSync(file, "utf8"));
    return Array.isArray(parsed) ? parsed as T[] : [...fallback];
  } catch {
    return [...fallback];
  }
}

export function saveJsonArray<T>(name: string, rows: T[]): void {
  const file = join(baseDir, `${name}.json`);
  mkdirSync(dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.tmp`;
  writeFileSync(tmp, JSON.stringify(rows, null, 2));
  renameSync(tmp, file);
}
