"use client";

import { useState, useRef, useEffect } from "react";
import { getActivePreset } from "@/app/lib/style-presets";
import { getActiveWork, getWorkCharacters, getWorkWorldview, getWorkStylePreset } from "@/app/lib/works";
import { Work } from "@/app/lib/types";

interface Chapter {
  id: string;
  title: string;
  status: "empty" | "skeleton" | "expanded" | "done";
  words: string;
}

// --- localStorage helpers ---
function getStorageKey(workId: string, type: "chapters" | "skeleton" | "expanded", chapterId?: string) {
  if (type === "chapters") return `storyforge_chapters_${workId}`;
  return `storyforge_${type}_${workId}_${chapterId}`;
}

function loadChapters(workId: string): Chapter[] {
  try {
    const raw = localStorage.getItem(getStorageKey(workId, "chapters"));
    if (raw) return JSON.parse(raw);
    // 旧格式兼容
    const all = JSON.parse(localStorage.getItem("storyforge_chapters") || "[]");
    const workChapters = all.filter((c: { workId?: string }) => c.workId === workId);
    if (workChapters.length > 0) return workChapters;
  } catch {}
  return [{ id: "1", title: "第一章", status: "empty", words: "未开始" }];
}

function saveChapters(workId: string, chapters: Chapter[]) {
  localStorage.setItem(getStorageKey(workId, "chapters"), JSON.stringify(chapters));
}

function loadContent(workId: string, chapterId: string, type: "skeleton" | "expanded"): string {
  try {
    return localStorage.getItem(getStorageKey(workId, type, chapterId)) || "";
  } catch { return ""; }
}

function saveContent(workId: string, chapterId: string, type: "skeleton" | "expanded", content: string) {
  localStorage.setItem(getStorageKey(workId, type, chapterId), content);
}

const INSPIRATION_SUGGESTIONS = [
  { id: "1", text: "试试从另一个角色的视角来推进剧情。", tag: "视角切换" },
  { id: "2", text: "加入一个意想不到的转折。", tag: "剧情反转" },
  { id: "3", text: "深入展现主角内心的挣扎。", tag: "内心戏" },
  { id: "4", text: "引入一个新的次要角色。", tag: "新角色" },
];

export default function EditorPage() {
  const [work, setWork] = useState<Work | null>(null);
  const [activeChapter, setActiveChapter] = useState("1");
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [viewMode, setViewMode] = useState<"skeleton" | "expanded" | "compare">("skeleton");
  const [skeletonContent, setSkeletonContent] = useState("");
  const [expandedContent, setExpandedContent] = useState("");
  const [detailLevel, setDetailLevel] = useState<"简洁" | "适中" | "细腻">("适中");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [showInspirePanel, setShowInspirePanel] = useState(false);
  const [inspireSuggestions, setInspireSuggestions] = useState(INSPIRATION_SUGGESTIONS);
  const [isInspireLoading, setIsInspireLoading] = useState(false);
  const [showRefineToolbar, setShowRefineToolbar] = useState(false);
  const [refineToolbarPosition, setRefineToolbarPosition] = useState({ x: 0, y: 0 });
  const [isRefining, setIsRefining] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);
  const [selectedText, setSelectedText] = useState("");

  const expandRef = useRef<HTMLDivElement>(null);

  // 初始化：加载作品和章节数据
  useEffect(() => {
    const w = getActiveWork();
    setWork(w);
    if (w) {
      const loadedChapters = loadChapters(w.id);
      setChapters(loadedChapters);
      const firstChapter = loadedChapters[0];
      if (firstChapter) {
        setActiveChapter(firstChapter.id);
        setSkeletonContent(loadContent(w.id, firstChapter.id, "skeleton"));
        setExpandedContent(loadContent(w.id, firstChapter.id, "expanded"));
      }
      const preset = getWorkStylePreset(w.id);
      if (preset) setSelectedStyle(preset.name);
    } else {
      const preset = getActivePreset();
      if (preset) setSelectedStyle(preset.name);
    }
  }, []);

  // 切换章节时加载对应内容
  const switchChapter = (chapterId: string) => {
    if (!work) return;
    // 先保存当前章节
    saveContent(work.id, activeChapter, "skeleton", skeletonContent);
    saveContent(work.id, activeChapter, "expanded", expandedContent);
    // 加载新章节
    setActiveChapter(chapterId);
    setSkeletonContent(loadContent(work.id, chapterId, "skeleton"));
    setExpandedContent(loadContent(work.id, chapterId, "expanded"));
    const chapter = chapters.find(c => c.id === chapterId);
    if (chapter?.status === "expanded" || chapter?.status === "done") {
      setViewMode("expanded");
    } else {
      setViewMode("skeleton");
    }
  };

  // 自动保存骨架内容
  useEffect(() => {
    if (!work) return;
    const timer = setTimeout(() => {
      saveContent(work.id, activeChapter, "skeleton", skeletonContent);
      if (skeletonContent.trim() && chapters.find(c => c.id === activeChapter)?.status === "empty") {
        const updated = chapters.map(c => c.id === activeChapter ? { ...c, status: "skeleton" as const, words: "骨架已写" } : c);
        setChapters(updated);
        saveChapters(work.id, updated);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [skeletonContent]);

  // 自动保存成文内容
  useEffect(() => {
    if (!work || !expandedContent) return;
    const timer = setTimeout(() => {
      saveContent(work.id, activeChapter, "expanded", expandedContent);
    }, 500);
    return () => clearTimeout(timer);
  }, [expandedContent]);

  // 保存章节列表变更
  useEffect(() => {
    if (!work || chapters.length === 0) return;
    saveChapters(work.id, chapters);
  }, [chapters]);

  const DETAIL_MAP: Record<string, string> = { "简洁": "concise", "适中": "moderate", "细腻": "detailed" };

  const getCharactersData = () => {
    if (!work) return [];
    return getWorkCharacters(work.id).map(c => ({ name: c.name, description: c.description }));
  };

  const getWorldType = () => {
    if (!work) return "";
    const wv = getWorkWorldview(work.id);
    return wv?.description || wv?.type || "";
  };

  const handleExpand = async () => {
    setIsExpanding(true);
    try {
      const activePreset = work ? getWorkStylePreset(work.id) : getActivePreset();
      const characters = getCharactersData();
      const worldType = getWorldType();
      const res = await fetch("/api/expand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skeleton: skeletonContent,
          detail: DETAIL_MAP[detailLevel] || "moderate",
          stylePrompt: activePreset?.prompt || "",
          styleParams: activePreset?.params || {},
          characters,
          worldType,
        }),
      });
      const data = await res.json();
      if (data.error) {
        alert(`扩写失败：${data.error}`);
      } else {
        setExpandedContent(data.content);
        setViewMode("expanded");
        setChapters(chapters.map(c => c.id === activeChapter ? { ...c, status: "expanded", words: `${data.content.length}字` } : c));
      }
    } catch {
      alert("网络错误，扩写失败");
    } finally {
      setIsExpanding(false);
    }
  };

  const handleViewModeChange = (mode: "skeleton" | "expanded") => {
    setViewMode(mode);
  };

  const toggleCompareMode = () => {
    setViewMode(viewMode === "compare" ? "expanded" : "compare");
  };

  const handleAddSuggestion = (suggestion: { text: string }) => {
    setSkeletonContent(prev => prev + "\n\n" + suggestion.text);
    setShowInspirePanel(false);
  };

  const handleInspire = async () => {
    setShowInspirePanel(true);
    setIsInspireLoading(true);
    try {
      const res = await fetch("/api/inspire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skeleton: skeletonContent, worldType: getWorldType() || "现代都市", characters: getCharactersData() }),
      });
      const data = await res.json();
      if (data.error) {
        setInspireSuggestions(INSPIRATION_SUGGESTIONS);
      } else {
        const suggestions = (data.suggestions as string[]).map((text, i) => ({
          id: String(i + 1),
          text,
          tag: ["走向A", "走向B", "走向C", "走向D"][i] || "建议",
        }));
        setInspireSuggestions(suggestions.length > 0 ? suggestions : INSPIRATION_SUGGESTIONS);
      }
    } catch {
      setInspireSuggestions(INSPIRATION_SUGGESTIONS);
    } finally {
      setIsInspireLoading(false);
    }
  };

  // 处理文字选中的浮动工具栏
  useEffect(() => {
    const handleSelectionChange = () => {
      if (viewMode !== "expanded") {
        setShowRefineToolbar(false);
        return;
      }

      const selection = window.getSelection();
      if (selection && selection.toString().trim() && expandRef.current?.contains(selection.anchorNode)) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setRefineToolbarPosition({
          x: rect.left + rect.width / 2 - 100,
          y: rect.top - 50 + window.scrollY
        });
        setSelectedText(selection.toString().trim());
        setShowRefineToolbar(true);
      } else {
        setShowRefineToolbar(false);
      }
    };

    document.addEventListener('mouseup', handleSelectionChange);
    return () => document.removeEventListener('mouseup', handleSelectionChange);
  }, [viewMode]);

  const handleRefine = async (action: string) => {
    setShowRefineToolbar(false);
    if (!selectedText) return;
    setIsRefining(true);
    try {
      const activePreset = getActivePreset();
      const res = await fetch("/api/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: selectedText, action, context: expandedContent, stylePrompt: activePreset?.prompt || "" }),
      });
      const data = await res.json();
      if (!data.error && data.content) {
        setExpandedContent(prev => prev.replace(selectedText, data.content));
      }
    } catch {
      // silently fail
    } finally {
      setIsRefining(false);
      setSelectedText("");
    }
  };

  const selectedChapter = chapters.find(c => c.id === activeChapter);
  const skeletonParagraphs = skeletonContent.split('\n\n').filter(p => p.trim());
  const expandedParagraphs = expandedContent.split('\n\n').filter(p => p.trim());
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [hoveredSide, setHoveredSide] = useState<"skeleton" | "expanded" | null>(null);

  const getHighlightedRange = (side: "skeleton" | "expanded", idx: number) => {
    if (hoveredIdx === null || hoveredSide === null) return false;
    if (side === hoveredSide) return idx === hoveredIdx;
    const srcLen = hoveredSide === "skeleton" ? skeletonParagraphs.length : expandedParagraphs.length;
    const dstLen = side === "skeleton" ? skeletonParagraphs.length : expandedParagraphs.length;
    if (srcLen === 0 || dstLen === 0) return false;
    const ratio = dstLen / srcLen;
    const start = Math.floor(hoveredIdx * ratio);
    const end = Math.floor((hoveredIdx + 1) * ratio) - 1;
    return idx >= start && idx <= Math.max(start, end);
  };

  return (
    <div className="flex min-h-screen bg-white text-[#111]">
      {/* 左侧边栏 */}
      <aside className="w-[280px] border-r border-gray-100 flex flex-col h-screen fixed left-0 top-0">
        <div className="px-5 py-5 border-b border-gray-100">
          <a href="/work/id" className="text-sm text-gray-500 hover:text-gray-900 mb-3 block">← 返回总览</a>
          <div className="text-lg font-bold mb-1">{work?.title || "未命名作品"}</div>
          <div className="text-xs text-gray-400">{work?.type || ""}</div>
        </div>

        <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-gray-300">章节</div>
        <div className="flex-1 overflow-y-auto px-3 pb-3">
          {chapters.map((chapter) => (
            <div
              key={chapter.id}
              onClick={() => switchChapter(chapter.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${activeChapter === chapter.id ? "bg-gray-50" : "hover:bg-gray-50"}`}
            >
              <div className={`w-2 h-2 rounded-full shrink-0 ${
                chapter.status === "empty" ? "border border-gray-300"
                : chapter.status === "skeleton" ? "bg-yellow-400"
                : chapter.status === "expanded" ? "bg-green-400"
                : "bg-[#111]"
              }`} />
              <div className="flex-1 min-w-0 text-left">
                <div className="text-sm font-medium truncate">{chapter.title}</div>
                <div className="text-xs text-gray-400">{chapter.words}</div>
              </div>
            </div>
          ))}
          <button
            onClick={() => {
              if (!work) return;
              const newId = String(Date.now());
              const newChapter: Chapter = { id: newId, title: `第${chapters.length + 1}章`, status: "empty", words: "未开始" };
              const updated = [...chapters, newChapter];
              setChapters(updated);
              saveChapters(work.id, updated);
              switchChapter(newId);
            }}
            className="w-full mt-2 px-3 py-2 text-xs text-gray-400 hover:text-gray-600 border border-dashed border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
          >
            + 新增章节
          </button>
        </div>
      </aside>

      {/* 主工作区 */}
      <div className="flex-1 ml-[280px] flex flex-col h-screen">
        {/* 顶部栏 */}
        <div className="flex items-center justify-between px-8 py-3 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={selectedChapter?.title || ""}
              onChange={(e) => setChapters(chapters.map(c => c.id === activeChapter ? { ...c, title: e.target.value } : c))}
              className="text-base font-semibold border-none outline-none bg-transparent"
            />
            {viewMode !== "compare" && (
              <div className="flex bg-gray-100 rounded-lg p-0.5">
                <button
                  onClick={() => handleViewModeChange("skeleton")}
                  className={`px-3 py-1 text-xs rounded-md transition-all ${viewMode === "skeleton" ? "bg-white text-[#111] font-medium shadow-sm" : "text-gray-500"}`}
                >
                  骨架
                </button>
                <button
                  onClick={() => handleViewModeChange("expanded")}
                  className={`px-3 py-1 text-xs rounded-md transition-all ${viewMode === "expanded" ? "bg-white text-[#111] font-medium shadow-sm" : "text-gray-500"}`}
                >
                  成文
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleCompareMode}
              className={`px-3 py-1.5 text-xs border rounded-lg transition-all ${viewMode === "compare" ? "border-[#111] bg-[#111] text-white" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
            >
              {viewMode === "compare" ? "退出对照" : "对照模式"}
            </button>
            <span className="text-xs text-gray-400">
              {viewMode === "skeleton" && `骨架 ${skeletonContent.length}字`}
              {viewMode === "expanded" && `成文 ${expandedContent.length}字`}
              {viewMode === "compare" && `骨架 ${skeletonContent.length}字 → 成文 ${expandedContent.length}字`}
            </span>
          </div>
        </div>

        {/* 对照模式 */}
        {viewMode === "compare" ? (
          <div className="flex-1 flex overflow-hidden">
            {/* 骨架 */}
            <div className="flex-1 flex flex-col overflow-hidden border-r border-gray-100">
              <div className="px-6 py-2.5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-600">骨架</span>
                <span className="text-xs text-gray-400">{skeletonContent.length}字</span>
              </div>
              <div className="flex-1 px-7 py-8 overflow-y-auto bg-amber-50/30">
                {skeletonParagraphs.map((para, idx) => (
                  <p
                    key={idx}
                    data-idx={idx}
                    className="mb-4 leading-8 text-sm cursor-pointer transition-colors rounded px-1"
                    onMouseEnter={() => { setHoveredIdx(idx); setHoveredSide("skeleton"); }}
                    onMouseLeave={() => { setHoveredIdx(null); setHoveredSide(null); }}
                    style={{ background: getHighlightedRange("skeleton", idx) ? '#e8f0fe' : 'transparent' }}
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {/* 成文 */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="px-6 py-2.5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-600">成文</span>
                <span className="text-xs text-gray-400">{expandedContent.length}字</span>
              </div>
              <div className="flex-1 px-7 py-8 overflow-y-auto">
                {expandedParagraphs.map((para, idx) => (
                  <p
                    key={idx}
                    data-idx={idx}
                    className="mb-4 leading-8 text-sm cursor-pointer transition-colors rounded px-1"
                    onMouseEnter={() => { setHoveredIdx(idx); setHoveredSide("expanded"); }}
                    onMouseLeave={() => { setHoveredIdx(null); setHoveredSide(null); }}
                    style={{ background: getHighlightedRange("expanded", idx) ? '#e8f0fe' : 'transparent' }}
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* 编辑器+侧边栏 */
          <>
            <div className="flex-1 flex overflow-hidden">
              {/* 编辑器 */}
              <div className="flex-1 flex flex-col">
                <div className="flex-1 px-16 py-10 overflow-y-auto">
                  <div className="max-w-[720px] mx-auto">
                    {viewMode === "skeleton" ? (
                      <textarea
                        value={skeletonContent}
                        onChange={(e) => setSkeletonContent(e.target.value)}
                        className="w-full min-h-[400px] text-base leading-loose text-gray-800 outline-none resize-none bg-transparent"
                        placeholder="在此处写下你的故事骨架..."
                      />
                    ) : (
                      <div
                        ref={expandRef}
                        className="text-base leading-loose text-gray-800"
                        contentEditable={true}
                        suppressContentEditableWarning={true}
                      >
                        {expandedContent.split("\n\n").map((para, i) => (
                          <p key={i} className="mb-4">{para}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* 底部栏 */}
                <div className="flex items-center justify-between px-8 py-4 border-t border-gray-100">
                  {viewMode === "skeleton" ? (
                    <div className="flex items-center gap-6">
                      {/* 详细程度 */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">详细程度</span>
                        <div className="flex gap-1">
                          {["简洁", "适中", "细腻"].map((level) => (
                            <button
                              key={level}
                              onClick={() => setDetailLevel(level as "简洁" | "适中" | "细腻")}
                              className={`px-2.5 py-1 text-xs border rounded-md transition-all ${detailLevel === level ? "bg-[#111] text-white border-[#111]" : "border-gray-200 text-gray-600"}`}
                            >
                              {level}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 风格显示 */}
                      <a
                        href="/work/id/styles"
                        className="px-2.5 py-1 text-xs border border-gray-200 rounded-md text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors"
                        title="点击前往风格设置"
                      >
                        {selectedStyle || "未设置风格"}
                      </a>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400">选中文字后可进行局部微调</span>
                      <button
                        onClick={() => handleViewModeChange("skeleton")}
                        className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:border-gray-300"
                      >
                        ← 返回骨架
                      </button>
                    </div>
                  )}

                  {viewMode === "skeleton" && (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleInspire}
                        className="px-5 py-2.5 rounded-lg text-sm font-medium border-2 border-[#111] text-[#111] hover:bg-gray-50 flex items-center gap-1.5"
                      >
                        💡 灵感
                      </button>
                      <button
                        onClick={handleExpand}
                        disabled={isExpanding || !skeletonContent.trim()}
                        className="px-6 py-2.5 rounded-lg text-sm font-medium bg-[#111] text-white hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isExpanding ? "扩写中..." : "扩写本章"}
                      </button>
                    </div>
                  )}

                  {viewMode === "expanded" && (
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400">{expandedContent.length} 字</span>
                      {chapters.find(c => c.id === activeChapter)?.status === "done" ? (
                        <span className="px-5 py-2.5 rounded-lg text-sm font-medium bg-gray-100 text-green-700">✓ 本章已确认</span>
                      ) : (
                        <button
                          onClick={() => {
                            setChapters(chapters.map(c => c.id === activeChapter ? { ...c, status: "done", words: `${expandedContent.length}字` } : c));
                          }}
                          className="px-5 py-2.5 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700"
                        >
                          ✓ 确认本章
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* 侧边面板 */}
              <div className="w-[240px] border-l border-gray-100 p-5 overflow-y-auto">
                <div className="mb-6">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-300 mb-3">本章角色</div>
                  {work && getWorkCharacters(work.id).length > 0 ? (
                    getWorkCharacters(work.id).map(c => (
                      <div key={c.id} className="bg-gray-50 rounded-lg p-3 mb-2">
                        <div className="text-sm font-medium mb-1">{c.name}</div>
                        <div className="text-xs text-gray-500">{c.description}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-gray-400">暂无角色，前往角色库添加</div>
                  )}
                </div>

                <div className="mb-6">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-300 mb-3">世界观</div>
                  {work && getWorkWorldview(work.id) ? (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-gray-600 leading-relaxed">
                        {getWorkWorldview(work.id)?.description || getWorkWorldview(work.id)?.type || ""}
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400">暂未设置世界观</div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 灵感建议面板 */}
      {showInspirePanel && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 ml-[140px] w-[520px] bg-white border border-gray-200 rounded-xl shadow-2xl p-5 z-50 animate-slide-up">
          <div className="flex items-center justify-between mb-3.5">
            <span className="text-sm font-semibold">💡 接下来可以怎么写？</span>
            <button onClick={() => setShowInspirePanel(false)} className="w-6 h-6 rounded bg-gray-100 text-gray-500 hover:bg-gray-200">
              ×
            </button>
          </div>
          <div className="text-xs text-gray-500 mb-3">点击任意建议，将追加到骨架末尾（你可以修改）</div>
          {isInspireLoading ? (
            <div className="text-center py-6 text-sm text-gray-400">正在生成建议...</div>
          ) : (
            <div className="space-y-2">
              {inspireSuggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleAddSuggestion(suggestion)}
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-[#111] hover:bg-gray-50 transition-all"
                >
                  <p className="text-sm leading-relaxed text-gray-800">{suggestion.text}</p>
                  <span className="inline-block mt-1.5 text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{suggestion.tag}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 局部微调工具栏 */}
      {showRefineToolbar && (
        <div
          className="fixed bg-[#111] rounded-lg p-1 shadow-lg z-50 flex items-center gap-0.5"
          style={{ left: refineToolbarPosition.x, top: refineToolbarPosition.y }}
        >
          <button
            onClick={() => handleRefine('expand')}
            className="px-3 py-1.5 text-xs text-white hover:bg-[#333] rounded whitespace-nowrap"
          >
            展开更多
          </button>
          <div className="w-px h-4 bg-gray-700 mx-0.5" />
          <button
            onClick={() => handleRefine('compress')}
            className="px-3 py-1.5 text-xs text-white hover:bg-[#333] rounded whitespace-nowrap"
          >
            压缩精简
          </button>
          <div className="w-px h-4 bg-gray-700 mx-0.5" />
          <button
            onClick={() => handleRefine('rewrite')}
            className="px-3 py-1.5 text-xs text-white hover:bg-[#333] rounded whitespace-nowrap"
          >
            换种写法
          </button>
        </div>
      )}

      {/* AI处理中提示 */}
      {isRefining && (
        <div className="fixed top-5 right-5 bg-[#111] text-white px-4 py-2.5 rounded-lg text-sm z-50">
          ✨ AI 正在重写选中段落...
        </div>
      )}
    </div>
  );
}