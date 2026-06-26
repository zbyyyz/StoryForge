import { createClient } from "./supabase";
import { Work } from "./types";

export function getWorksLocal(): Work[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem("storyforge_works") || "[]"); } catch { return []; }
}

export function getActiveWorkId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("storyforge_active_work");
}

export function setActiveWorkId(id: string) {
  if (typeof window !== "undefined") localStorage.setItem("storyforge_active_work", id);
}

export async function getWorksCloud(): Promise<Work[]> {
  const supabase = createClient();
  const { data } = await supabase.from("works").select("*").order("created_at", { ascending: false });
  if (!data) return [];
  return data.map(r => ({
    id: r.id, title: r.title, type: r.type, desc: r.description, color: r.color,
    createdAt: r.created_at, characterIds: [], worldviewId: r.worldview_id,
    stylePresetId: r.style_preset_id, localCharacters: [], localWorldview: null,
  }));
}

export async function getActiveWorkCloud(): Promise<Work | null> {
  const works = await getWorksCloud();
  const activeId = getActiveWorkId();
  if (activeId) { const found = works.find(w => w.id === activeId); if (found) return found; }
  return works[0] || null;
}

export async function addWorkCloud(data: { title: string; type: string; desc?: string; color?: string }): Promise<Work> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { data: row, error } = await supabase.from("works").insert({
    user_id: user.id, title: data.title, type: data.type, description: data.desc || "", color: data.color || "#6366f1",
  }).select().single();
  if (error || !row) throw new Error(error?.message || "Failed to create work");
  setActiveWorkId(row.id);
  return { id: row.id, title: row.title, type: row.type, desc: row.description, color: row.color, createdAt: row.created_at, characterIds: [], worldviewId: null, stylePresetId: null, localCharacters: [], localWorldview: null };
}

export async function updateWorkCloud(id: string, updates: { title?: string; type?: string; desc?: string; worldview_id?: string | null; style_preset_id?: string | null }) {
  const supabase = createClient();
  const mapped: Record<string, unknown> = {};
  if (updates.title !== undefined) mapped.title = updates.title;
  if (updates.type !== undefined) mapped.type = updates.type;
  if (updates.desc !== undefined) mapped.description = updates.desc;
  if (updates.worldview_id !== undefined) mapped.worldview_id = updates.worldview_id;
  if (updates.style_preset_id !== undefined) mapped.style_preset_id = updates.style_preset_id;
  await supabase.from("works").update(mapped).eq("id", id);
}

export async function deleteWorkCloud(id: string) {
  const supabase = createClient();
  await supabase.from("works").delete().eq("id", id);
}

// Chapters
export async function getChaptersCloud(workId: string) {
  const supabase = createClient();
  const { data } = await supabase.from("chapters").select("*").eq("work_id", workId).order("order");
  if (!data) return [];
  return data.map(r => ({ id: r.id, workId: r.work_id, title: r.title, order: r.order, status: r.status, skeletonContent: r.skeleton_content, expandedContent: r.expanded_content }));
}

export async function addChaptersCloud(workId: string, chapters: { title: string; order: number; status?: string; skeletonContent?: string }[]) {
  const supabase = createClient();
  const rows = chapters.map(ch => ({ work_id: workId, title: ch.title, order: ch.order, status: ch.status || "empty", skeleton_content: ch.skeletonContent || "", expanded_content: "" }));
  const { data } = await supabase.from("chapters").insert(rows).select();
  return data || [];
}

export async function updateChapterCloud(id: string, updates: { title?: string; status?: string; skeleton_content?: string; expanded_content?: string }) {
  const supabase = createClient();
  await supabase.from("chapters").update(updates).eq("id", id);
}

export async function deleteChapterCloud(id: string) {
  const supabase = createClient();
  await supabase.from("chapters").delete().eq("id", id);
}

// Characters
export async function getCharactersCloud() {
  const supabase = createClient();
  const { data } = await supabase.from("characters").select("*").order("created_at");
  if (!data) return [];
  return data.map(r => ({ id: r.id, name: r.name, description: r.description, ...r.metadata, createdAt: r.created_at, updatedAt: r.updated_at }));
}

export async function addCharacterCloud(char: { name: string; description: string; [key: string]: unknown }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { name, description, ...metadata } = char;
  const { data } = await supabase.from("characters").insert({ user_id: user.id, name, description, metadata }).select().single();
  return data;
}

export async function updateCharacterCloud(id: string, updates: { name?: string; description?: string; metadata?: Record<string, unknown> }) {
  const supabase = createClient();
  const mapped: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (updates.name !== undefined) mapped.name = updates.name;
  if (updates.description !== undefined) mapped.description = updates.description;
  if (updates.metadata !== undefined) mapped.metadata = updates.metadata;
  await supabase.from("characters").update(mapped).eq("id", id);
}

export async function deleteCharacterCloud(id: string) {
  const supabase = createClient();
  await supabase.from("characters").delete().eq("id", id);
}

// Worldviews
export async function getWorldviewsCloud() {
  const supabase = createClient();
  const { data } = await supabase.from("worldviews").select("*").order("created_at");
  if (!data) return [];
  return data.map(r => ({ id: r.id, name: r.name, type: r.type, description: r.description, sections: r.sections || [], createdAt: r.created_at, updatedAt: r.updated_at }));
}

export async function addWorldviewCloud(wv: { name: string; type: string; description: string; sections: unknown[] }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { data } = await supabase.from("worldviews").insert({ user_id: user.id, name: wv.name, type: wv.type, description: wv.description, sections: wv.sections }).select().single();
  return data;
}

export async function updateWorldviewCloud(id: string, updates: { name?: string; type?: string; description?: string; sections?: unknown[] }) {
  const supabase = createClient();
  await supabase.from("worldviews").update({ ...updates, updated_at: new Date().toISOString() }).eq("id", id);
}

export async function deleteWorldviewCloud(id: string) {
  const supabase = createClient();
  await supabase.from("worldviews").delete().eq("id", id);
}

// Style Presets
export async function getCustomPresetsCloud() {
  const supabase = createClient();
  const { data } = await supabase.from("style_presets").select("*").order("created_at");
  if (!data) return [];
  return data.map(r => ({ id: r.id, name: r.name, description: r.description, prompt: r.prompt, params: r.params || {}, sampleText: r.sample_text || "", builtin: false }));
}

export async function savePresetCloud(preset: { name: string; description: string; prompt: string; params: Record<string, unknown>; sampleText?: string }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { data } = await supabase.from("style_presets").insert({ user_id: user.id, name: preset.name, description: preset.description, prompt: preset.prompt, params: preset.params, sample_text: preset.sampleText || "" }).select().single();
  return data;
}

export async function updatePresetCloud(id: string, updates: { name?: string; prompt?: string; params?: Record<string, unknown>; sample_text?: string }) {
  const supabase = createClient();
  await supabase.from("style_presets").update(updates).eq("id", id);
}

export async function deletePresetCloud(id: string) {
  const supabase = createClient();
  await supabase.from("style_presets").delete().eq("id", id);
}

// Auth helper
export async function getCurrentUser() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
}
