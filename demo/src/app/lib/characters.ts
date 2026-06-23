import { Character } from "./types";

const STORAGE_KEY = "storyforge_characters";

export type { Character };

export function getCharacters(): Character[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch { return []; }
}

export function saveCharacters(chars: Character[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(chars));
}

export function getCharacterById(id: string): Character | null {
  return getCharacters().find(c => c.id === id) || null;
}

export function addCharacter(char: Omit<Character, "id" | "createdAt" | "updatedAt">): Character {
  const now = new Date().toISOString();
  const newChar: Character = { ...char, id: String(Date.now()), createdAt: now, updatedAt: now };
  saveCharacters([...getCharacters(), newChar]);
  return newChar;
}

export function updateCharacter(id: string, updates: Partial<Character>): void {
  const chars = getCharacters().map(c =>
    c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
  );
  saveCharacters(chars);
}

export function deleteCharacter(id: string): void {
  saveCharacters(getCharacters().filter(c => c.id !== id));
}
