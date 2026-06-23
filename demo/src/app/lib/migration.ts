import { Work } from "./types";

const VERSION_KEY = "storyforge_schema_version";
const CURRENT_VERSION = 1;

export function migrateIfNeeded(): void {
  if (typeof window === "undefined") return;
  const version = Number(localStorage.getItem(VERSION_KEY) || "0");
  if (version >= CURRENT_VERSION) return;

  // Migrate works: ensure new fields exist
  try {
    const works: Work[] = JSON.parse(localStorage.getItem("storyforge_works") || "[]");
    const migrated = works.map(w => ({
      ...w,
      characterIds: w.characterIds || [],
      worldviewId: w.worldviewId ?? null,
      stylePresetId: w.stylePresetId ?? null,
      localCharacters: w.localCharacters || [],
      localWorldview: w.localWorldview ?? null,
    }));
    localStorage.setItem("storyforge_works", JSON.stringify(migrated));
  } catch { /* ignore */ }

  // Migrate old storyforge_worldviews (array with workId) into proper Worldview format
  try {
    const oldWvs = JSON.parse(localStorage.getItem("storyforge_worldviews") || "[]");
    if (oldWvs.length > 0 && !oldWvs[0].sections) {
      const now = new Date().toISOString();
      const newWvs = oldWvs.map((wv: { workId?: string; type?: string; description?: string }, i: number) => ({
        id: `migrated-${Date.now()}-${i}`,
        name: wv.type || "未命名世界观",
        type: wv.type || "",
        description: wv.description || "",
        sections: [],
        createdAt: now,
        updatedAt: now,
      }));
      localStorage.setItem("storyforge_worldviews", JSON.stringify(newWvs));

      // Link to corresponding works
      const works: Work[] = JSON.parse(localStorage.getItem("storyforge_works") || "[]");
      oldWvs.forEach((oldWv: { workId?: string }, i: number) => {
        if (oldWv.workId) {
          const idx = works.findIndex(w => w.id === oldWv.workId);
          if (idx >= 0) works[idx].worldviewId = newWvs[i].id;
        }
      });
      localStorage.setItem("storyforge_works", JSON.stringify(works));
    }
  } catch { /* ignore */ }

  // Clean up old singular worldview key
  localStorage.removeItem("storyforge_worldview");

  localStorage.setItem(VERSION_KEY, String(CURRENT_VERSION));
}
