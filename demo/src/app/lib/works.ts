import { Work, Character, Worldview } from "./types";
import { getCharacters, getCharacterById } from "./characters";
import { getWorldviewById } from "./worldviews";
import { getActivePreset, getPresets } from "./style-presets";

const STORAGE_KEY = "storyforge_works";
const ACTIVE_KEY = "storyforge_active_work";

export function getWorks(): Work[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch { return []; }
}

function saveWorks(works: Work[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(works));
}

export function getActiveWork(): Work | null {
  if (typeof window === "undefined") return null;
  const works = getWorks();
  const activeId = localStorage.getItem(ACTIVE_KEY);
  if (activeId) {
    const found = works.find(w => w.id === activeId);
    if (found) return found;
  }
  return works[0] || null;
}

export function setActiveWork(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACTIVE_KEY, id);
}

export function addWork(data: Omit<Work, "id" | "createdAt" | "characterIds" | "worldviewId" | "stylePresetId" | "localCharacters" | "localWorldview">): Work {
  const work: Work = {
    ...data,
    id: String(Date.now()),
    createdAt: new Date().toISOString(),
    characterIds: [],
    worldviewId: null,
    stylePresetId: null,
    localCharacters: [],
    localWorldview: null,
  };
  saveWorks([work, ...getWorks()]);
  setActiveWork(work.id);
  return work;
}

export function updateWork(id: string, updates: Partial<Work>): void {
  saveWorks(getWorks().map(w => w.id === id ? { ...w, ...updates } : w));
}

export function deleteWork(id: string): void {
  saveWorks(getWorks().filter(w => w.id !== id));
}

// --- Asset reference operations ---

export function attachCharacter(workId: string, characterId: string): void {
  const work = getWorks().find(w => w.id === workId);
  if (!work) return;
  if (work.characterIds.includes(characterId)) return;
  updateWork(workId, { characterIds: [...work.characterIds, characterId] });
}

export function detachCharacter(workId: string, characterId: string): void {
  const work = getWorks().find(w => w.id === workId);
  if (!work) return;
  updateWork(workId, { characterIds: work.characterIds.filter(id => id !== characterId) });
}

export function attachWorldview(workId: string, worldviewId: string): void {
  updateWork(workId, { worldviewId, localWorldview: null });
}

export function detachWorldview(workId: string): void {
  updateWork(workId, { worldviewId: null });
}

export function attachStylePreset(workId: string, presetId: string): void {
  updateWork(workId, { stylePresetId: presetId });
}

// --- Fork operations ---

export function forkCharacterToLocal(workId: string, characterId: string): void {
  const work = getWorks().find(w => w.id === workId);
  if (!work) return;
  const char = getCharacterById(characterId);
  if (!char) return;
  const localCopy: Character = { ...char, id: `local-${Date.now()}` };
  updateWork(workId, {
    characterIds: work.characterIds.filter(id => id !== characterId),
    localCharacters: [...work.localCharacters, localCopy],
  });
}

export function forkWorldviewToLocal(workId: string): void {
  const work = getWorks().find(w => w.id === workId);
  if (!work || !work.worldviewId) return;
  const wv = getWorldviewById(work.worldviewId);
  if (!wv) return;
  const localCopy: Worldview = { ...wv, id: `local-${Date.now()}` };
  updateWork(workId, { worldviewId: null, localWorldview: localCopy });
}

// --- Resolution helpers ---

export function getWorkCharacters(workId: string): Character[] {
  const work = getWorks().find(w => w.id === workId);
  if (!work) return [];
  const globalChars = work.characterIds
    .map(id => getCharacterById(id))
    .filter((c): c is Character => c !== null);
  return [...globalChars, ...work.localCharacters];
}

export function getWorkWorldview(workId: string): Worldview | null {
  const work = getWorks().find(w => w.id === workId);
  if (!work) return null;
  if (work.localWorldview) return work.localWorldview;
  if (work.worldviewId) return getWorldviewById(work.worldviewId);
  return null;
}

export function getWorkStylePreset(workId: string) {
  const work = getWorks().find(w => w.id === workId);
  if (!work) return getActivePreset();
  if (work.stylePresetId) {
    const all = getPresets();
    return all.find(p => p.id === work.stylePresetId) || getActivePreset();
  }
  return getActivePreset();
}
