"use client";

import { useState, useEffect } from "react";
import { useWorkInfo } from "@/app/lib/use-work";
import { getActiveWork, getWorkWorldview, attachWorldview, detachWorldview, forkWorldviewToLocal, updateWork } from "@/app/lib/works";
import { getWorldviews, addWorldview, updateWorldview as updateGlobalWorldview } from "@/app/lib/worldviews";
import { Worldview, WorldSection } from "@/app/lib/types";

const WORLD_TYPES = [
  { id: "modern", name: "现代都市", icon: "🏙" },
  { id: "wuxia", name: "古风仙侠", icon: "🗡" },
  { id: "fantasy", name: "西方奇幻", icon: "✨" },
  { id: "scifi", name: "科幻未来", icon: "🚀" },
  { id: "campus", name: "校园青春", icon: "📚" },
  { id: "historical", name: "历史架空", icon: "🏛" },
  { id: "mystery", name: "悬疑推理", icon: "🔍" },
  { id: "free", name: "自由创作", icon: "✏" },
];

export default function WorldViewPage() {
  const workInfo = useWorkInfo();
  const [worldview, setWorldview] = useState<Worldview | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const [showAddSection, setShowAddSection] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const [showAssetPicker, setShowAssetPicker] = useState(false);

  const work = getActiveWork();
  const workId = work?.id || "";

  useEffect(() => {
    if (workId) {
      const wv = getWorkWorldview(workId);
      setWorldview(wv);
      if (wv?.sections.length) setOpenSections(new Set([wv.sections[0].id]));
    }
  }, [workId]);

  const isLocal = worldview?.id.startsWith("local-") || false;
  const isGlobal = worldview && !isLocal;

  const persist = (updated: Worldview) => {
    setWorldview(updated);
    if (isLocal && work) {
      updateWork(work.id, { localWorldview: updated });
    } else if (updated.id) {
      updateGlobalWorldview(updated.id, updated);
    }
  };

  const handleCreateNew = () => {
    const wv = addWorldview({ name: "新世界观", type: "modern", description: "", sections: [] });
    if (workId) attachWorldview(workId, wv.id);
    setWorldview(wv);
  };

  const handleTypeChange = (typeId: string, typeName: string) => {
    if (!worldview) return;
    persist({ ...worldview, type: typeId, name: typeName });
  };

  const handleDescChange = (desc: string) => {
    if (!worldview) return;
    persist({ ...worldview, description: desc });
  };

  const handleAddSection = () => {
    if (!newSectionTitle.trim() || !worldview) return;
    const section: WorldSection = { id: String(Date.now()), title: newSectionTitle, content: "" };
    persist({ ...worldview, sections: [...worldview.sections, section] });
    setNewSectionTitle("");
    setShowAddSection(false);
    setEditingSection(section.id);
    setOpenSections(new Set([...openSections, section.id]));
  };

  const saveEdit = () => {
    if (!editingSection || !worldview) return;
    persist({ ...worldview, sections: worldview.sections.map(s => s.id === editingSection ? { ...s, content: editedContent } : s) });
    setEditingSection(null);
  };

  const handleFork = () => {
    if (workId) {
      forkWorldviewToLocal(workId);
      setWorldview(getWorkWorldview(workId));
    }
  };

  const handleAttach = (id: string) => {
    if (workId) {
      attachWorldview(workId, id);
      setWorldview(getWorkWorldview(workId));
      setShowAssetPicker(false);
    }
  };

  const toggleSection = (id: string) => {
    const next = new Set(openSections);
    next.has(id) ? next.delete(id) : next.add(id);
    setOpenSections(next);
  };

  return (
    <div className="flex min-h-screen bg-white text-[#111]">
      <aside className="w-[280px] border-r border-gray-100 flex flex-col h-screen fixed left-0 top-0">
        <div className="px-5 py-5 border-b border-gray-100">
          <a href="/work/id" className="text-sm text-gray-500 hover:text-gray-900 mb-3 block">← 返回总览</a>
          <div className="text-lg font-bold mb-1">{workInfo.title}</div>
          <div className="text-xs text-gray-400">{workInfo.type}</div>
        </div>
        <nav className="px-3 py-4 flex flex-col gap-1">
          <a href="/work/id" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50"><span className="text-base">🏠</span> 总览</a>
          <a href="/work/id/characters" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50"><span className="text-base">👥</span> 角色库</a>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-gray-50 text-gray-900 font-medium"><span className="text-base">🌍</span> 世界观</div>
          <a href="/work/id/styles" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50"><span className="text-base">✏</span> 风格预设</a>
        </nav>
      </aside>

      <main className="flex-1 ml-[280px] px-10 py-10 max-w-[1000px]">
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold mb-2">世界观设定</h1>
            {isGlobal && (
              <button onClick={handleFork} className="text-xs px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50">分叉为独立副本</button>
            )}
          </div>
          <p className="text-sm text-gray-500">定义你故事世界的背景、规则和氛围</p>
          {worldview && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded mt-2 inline-block ${isLocal ? "bg-blue-50 text-blue-500" : "bg-gray-100 text-gray-400"}`}>
              {isLocal ? "独立副本" : "全局资产"}
            </span>
          )}
        </div>

        {!worldview ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🌍</div>
            <div className="text-gray-500 mb-4">还没有世界观设定</div>
            <div className="flex gap-3 justify-center">
              <button onClick={handleCreateNew} className="px-5 py-2.5 rounded-lg text-sm font-medium bg-[#111] text-white hover:bg-[#333]">创建新世界观</button>
              <button onClick={() => setShowAssetPicker(true)} className="px-5 py-2.5 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-50">从资产库选择</button>
            </div>
          </div>
        ) : (
          <>
            {/* 世界类型 */}
            <div className="mb-10">
              <div className="text-sm font-semibold text-gray-700 mb-3">世界类型</div>
              <div className="grid grid-cols-4 gap-2.5">
                {WORLD_TYPES.map((type) => (
                  <button key={type.id} onClick={() => handleTypeChange(type.id, type.name)}
                    className={`p-4 border rounded-xl text-center transition-all ${worldview.type === type.id ? "border-[#111] bg-gray-50" : "border-gray-200 hover:border-gray-300"}`}>
                    <div className="text-2xl mb-2">{type.icon}</div>
                    <div className="text-sm font-medium">{type.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 描述 */}
            <div className="mb-10">
              <div className="text-sm font-semibold text-gray-700 mb-3">一句话描述</div>
              <textarea value={worldview.description} onChange={(e) => handleDescChange(e.target.value)}
                placeholder="例如：2030年的赛博朋克城市"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none resize-y min-h-[80px] focus:border-[#111]" />
            </div>

            {/* 详细设定 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-semibold text-gray-700">详细设定</div>
                <button onClick={() => setShowAddSection(true)} className="text-xs text-gray-600 border border-gray-300 px-2.5 py-1 rounded-md hover:bg-gray-50">+ 新增分类</button>
              </div>

              {showAddSection && (
                <div className="mb-3 flex items-center gap-2">
                  <input type="text" value={newSectionTitle} onChange={(e) => setNewSectionTitle(e.target.value)}
                    placeholder="输入分类名称" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#111]"
                    autoFocus onKeyDown={(e) => { if (e.key === "Enter") handleAddSection(); }} />
                  <button onClick={handleAddSection} disabled={!newSectionTitle.trim()} className="px-3 py-2 text-sm bg-[#111] text-white rounded-lg hover:bg-[#333] disabled:opacity-50">添加</button>
                  <button onClick={() => { setShowAddSection(false); setNewSectionTitle(""); }} className="px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
                </div>
              )}

              <div className="space-y-2">
                {worldview.sections.map((section) => (
                  <div key={section.id} className="border border-gray-200 rounded-xl overflow-hidden">
                    <button onClick={() => toggleSection(section.id)} className="w-full flex items-center justify-between px-5 py-3 bg-gray-50 hover:bg-gray-100">
                      <span className="text-sm font-medium">{section.title}</span>
                      <span className={`transition-transform ${openSections.has(section.id) ? "rotate-180" : ""}`}>▼</span>
                    </button>
                    {openSections.has(section.id) && (
                      <div className="px-5 py-4">
                        {editingSection === section.id ? (
                          <div>
                            <textarea value={editedContent} onChange={(e) => setEditedContent(e.target.value)}
                              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none resize-y min-h-[120px] focus:border-[#111]" />
                            <div className="flex gap-2 justify-end mt-3">
                              <button onClick={() => setEditingSection(null)} className="px-4 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
                              <button onClick={saveEdit} className="px-4 py-1.5 text-sm bg-[#111] text-white rounded-lg hover:bg-[#333]">保存</button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm text-gray-700 leading-relaxed mb-3">{section.content || "暂无内容"}</p>
                            <button onClick={() => { setEditingSection(section.id); setEditedContent(section.content); }} className="text-xs text-gray-500 hover:text-gray-700">编辑</button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* 资产库选择器 */}
        {showAssetPicker && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAssetPicker(false)}>
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
              <h3 className="text-base font-semibold mb-4">从资产库选择世界观</h3>
              {(() => {
                const available = getWorldviews();
                if (available.length === 0) return <p className="text-sm text-gray-500 py-4">资产库中没有可用的世界观</p>;
                return (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {available.map(wv => (
                      <div key={wv.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <div className="text-sm font-medium">{wv.name}</div>
                          <div className="text-xs text-gray-500">{wv.description}</div>
                        </div>
                        <button onClick={() => handleAttach(wv.id)} className="text-xs px-3 py-1.5 bg-[#111] text-white rounded-md hover:bg-[#333]">使用</button>
                      </div>
                    ))}
                  </div>
                );
              })()}
              <div className="flex justify-end mt-4">
                <button onClick={() => setShowAssetPicker(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">关闭</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}