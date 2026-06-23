import { Worldview, WorldSection } from "./types";

const STORAGE_KEY = "storyforge_worldviews";

export function getWorldviews(): Worldview[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch { return []; }
}

export function saveWorldviews(wvs: Worldview[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wvs));
}

export function getWorldviewById(id: string): Worldview | null {
  return getWorldviews().find(w => w.id === id) || null;
}

export function addWorldview(wv: Omit<Worldview, "id" | "createdAt" | "updatedAt">): Worldview {
  const now = new Date().toISOString();
  const newWv: Worldview = { ...wv, id: String(Date.now()), createdAt: now, updatedAt: now };
  saveWorldviews([...getWorldviews(), newWv]);
  return newWv;
}

export function updateWorldview(id: string, updates: Partial<Worldview>): void {
  const wvs = getWorldviews().map(w =>
    w.id === id ? { ...w, ...updates, updatedAt: new Date().toISOString() } : w
  );
  saveWorldviews(wvs);
}

export function deleteWorldview(id: string): void {
  saveWorldviews(getWorldviews().filter(w => w.id !== id));
}

export function addSection(worldviewId: string, title: string): WorldSection {
  const section: WorldSection = { id: String(Date.now()), title, content: "" };
  const wv = getWorldviewById(worldviewId);
  if (wv) {
    updateWorldview(worldviewId, { sections: [...wv.sections, section] });
  }
  return section;
}

export function updateSection(worldviewId: string, sectionId: string, content: string): void {
  const wv = getWorldviewById(worldviewId);
  if (wv) {
    const sections = wv.sections.map(s => s.id === sectionId ? { ...s, content } : s);
    updateWorldview(worldviewId, { sections });
  }
}

export function deleteSection(worldviewId: string, sectionId: string): void {
  const wv = getWorldviewById(worldviewId);
  if (wv) {
    updateWorldview(worldviewId, { sections: wv.sections.filter(s => s.id !== sectionId) });
  }
}
