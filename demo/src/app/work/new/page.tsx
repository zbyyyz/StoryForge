"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { STYLE_PARAM_OPTIONS, StyleParams, StylePreset, saveCustomPresets, getCustomPresets, getPresets } from "@/app/lib/style-presets";
import { addWorldview, getWorldviews } from "@/app/lib/worldviews";

const TYPE_OPTIONS = [
  { id: "urban", name: "现代都市", icon: "🏙" },
  { id: "wuxia", name: "古风仙侠", icon: "🗡" },
  { id: "fantasy", name: "西方奇幻", icon: "✨" },
  { id: "scifi", name: "科幻未来", icon: "🚀" },
  { id: "campus", name: "校园青春", icon: "📚" },
  { id: "historical", name: "历史架空", icon: "🏛" },
  { id: "mystery", name: "悬疑推理", icon: "🔍" },
  { id: "free", name: "自由创作", icon: "✏" },
];

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

export default function NewWorkPage() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [mode, setMode] = useState<"guided" | "advanced">("guided");
  const [selectedType, setSelectedType] = useState("urban");
  const [workTitle, setWorkTitle] = useState("");
  const [workDesc, setWorkDesc] = useState("");
  const [storyOutline, setStoryOutline] = useState("");
  const [showAISuggestion, setShowAISuggestion] = useState(false);
  const [suggestedChapters, setSuggestedChapters] = useState([
    { title: "深夜订单", desc: "小陈接到一个异常的深夜订单，送往城市边缘的废弃仓库" },
    { title: "目击", desc: "在仓库中意外目睹一场地下交易，被发现后仓皇逃离" },
    { title: "追杀", desc: "小陈发现自己被跟踪，日常生活被打破，开始逃亡" },
    { title: "线索", desc: "逃亡中偶然发现阴谋的更多线索，牵涉到一位知名政客" },
    { title: "同盟", desc: "遇到调查记者林薇，两人决定联手揭露真相" },
    { title: "真相", desc: "最终对决，真相大白，但小陈也为此付出了代价" },
  ]);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);

  // 风格预设面板
  const [showStyleModal, setShowStyleModal] = useState(false);
  const [newStyleName, setNewStyleName] = useState("");
  const [newStylePrompt, setNewStylePrompt] = useState("");
  const [newStyleParams, setNewStyleParams] = useState<StyleParams>({});
  const [showStyleParams, setShowStyleParams] = useState(false);

  // 世界观面板
  const [showWorldModal, setShowWorldModal] = useState(false);
  const [newWorldType, setNewWorldType] = useState("modern");
  const [newWorldDesc, setNewWorldDesc] = useState("");
  const [selectedWorldviewId, setSelectedWorldviewId] = useState<string | null>(null);
  const [showWorldPicker, setShowWorldPicker] = useState(false);

  const handleSaveStyle = () => {
    const name = newStyleName.trim() || `自定义风格 ${new Date().toLocaleTimeString()}`;
    const preset = {
      id: String(Date.now()),
      name,
      description: "自定义预设",
      prompt: newStylePrompt,
      params: newStyleParams,
      builtin: false,
    };
    const customs = [...getCustomPresets(), preset];
    saveCustomPresets(customs);
    setSelectedStyle(preset.id);
    setShowStyleModal(false);
    setNewStyleName("");
    setNewStylePrompt("");
    setNewStyleParams({});
    setShowStyleParams(false);
  };

  const handleSaveWorld = () => {
    const typeName = WORLD_TYPES.find(t => t.id === newWorldType)?.name || "自由创作";
    const wv = addWorldview({ name: typeName, type: newWorldType, description: newWorldDesc, sections: [] });
    setSelectedWorldviewId(wv.id);
    setShowWorldModal(false);
    setNewWorldType("modern");
    setNewWorldDesc("");
  };

  const createWork = () => {
    const id = String(Date.now());
    const typeName = TYPE_OPTIONS.find(t => t.id === selectedType)?.name || "自由创作";
    const work = {
      id, title: workTitle || "未命名作品", type: typeName, desc: workDesc,
      color: "#6366f1", createdAt: new Date().toISOString(),
      characterIds: [], worldviewId: null as string | null,
      stylePresetId: selectedStyle,
      localCharacters: [], localWorldview: null,
    };

    // Create worldview in global store and link to work
    if (selectedWorldviewId) {
      work.worldviewId = selectedWorldviewId;
    } else {
      const now = new Date().toISOString();
      const wvId = `${id}-wv`;
      const wv = { id: wvId, name: typeName, type: selectedType, description: workDesc || "", sections: [], createdAt: now, updatedAt: now };
      const existingWv = JSON.parse(localStorage.getItem("storyforge_worldviews") || "[]");
      localStorage.setItem("storyforge_worldviews", JSON.stringify([...existingWv, wv]));
      work.worldviewId = wvId;
    }

    const existingWorks = JSON.parse(localStorage.getItem("storyforge_works") || "[]");
    localStorage.setItem("storyforge_works", JSON.stringify([work, ...existingWorks]));
    localStorage.setItem("storyforge_active_work", id);

    // Save chapters
    const chaps = (showAISuggestion && suggestedChapters.length > 0 ? suggestedChapters : [{ title: "第一章", desc: "" }])
      .map((ch, i) => ({ id: `${id}-ch-${i}`, workId: id, title: ch.title || `第${i+1}章`, status: "empty", words: "" }));
    const existingChapters = JSON.parse(localStorage.getItem("storyforge_chapters") || "[]");
    localStorage.setItem("storyforge_chapters", JSON.stringify([...existingChapters, ...chaps]));

    router.push("/work/id");
  };
  // PLACEHOLDER_RENDER

  const renderPage = () => {
    if (page === 0) {
      return (
        <>
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-2">开始新作品</h2>
            <p className="text-sm text-gray-500 mb-6">选择适合你的创作方式</p>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setMode("guided")} className={`p-7 border rounded-xl text-left transition-all ${mode === "guided" ? "border-[#111] bg-gray-50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"}`}>
                <div className="text-base font-semibold mb-1.5">引导模式</div>
                <div className="text-sm text-gray-600 mb-3">适合新手或快速开始，跟着步骤走</div>
                <ul className="space-y-1">
                  <li className="text-xs text-gray-600">· 选择故事类型</li>
                  <li className="text-xs text-gray-600">· 自动加载对应预设</li>
                  <li className="text-xs text-gray-600">· AI帮你规划章节</li>
                </ul>
              </button>
              <button onClick={() => setMode("advanced")} className={`p-7 border rounded-xl text-left transition-all ${mode === "advanced" ? "border-[#111] bg-gray-50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"}`}>
                <div className="text-base font-semibold mb-1.5">自定义模式</div>
                <div className="text-sm text-gray-600 mb-3">适合有明确想法的创作者，自由配置一切</div>
                <ul className="space-y-1">
                  <li className="text-xs text-gray-600">· 手动选择/创建风格预设</li>
                  <li className="text-xs text-gray-600">· 自定义世界观设定</li>
                  <li className="text-xs text-gray-600">· 预先创建角色卡</li>
                </ul>
              </button>
            </div>
          </div>
          <div className="flex justify-end mt-12 pt-6 border-t border-gray-100">
            <button onClick={() => setPage(mode === "guided" ? 1 : 4)} className="px-6 py-2.5 rounded-lg text-sm font-medium bg-[#111] text-white hover:bg-[#333]">继续</button>
          </div>
        </>
      );
    }
    // PLACEHOLDER_PAGE1

    if (page === 1) {
      return (
        <>
          <div className="flex items-center gap-3 mb-12">
            <div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-[#111] text-white text-xs flex items-center justify-center font-semibold">1</div><span className="text-sm font-medium">选择类型</span></div>
            <div className="w-10 h-px bg-gray-200"></div>
            <div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full border-2 border-gray-300 text-gray-400 text-xs flex items-center justify-center font-semibold">2</div><span className="text-sm text-gray-400">基本信息</span></div>
            <div className="w-10 h-px bg-gray-200"></div>
            <div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full border-2 border-gray-300 text-gray-400 text-xs flex items-center justify-center font-semibold">3</div><span className="text-sm text-gray-400">故事构思</span></div>
          </div>
          <div className="mb-8">
            <label className="text-sm font-semibold text-gray-700 mb-2.5 block">你想写什么类型的故事？</label>
            <p className="text-xs text-gray-500 mb-6">选择一个类型，我们会为你加载对应的世界观和风格预设</p>
            <div className="grid grid-cols-4 gap-2.5">
              {TYPE_OPTIONS.map((t) => (
                <button key={t.id} onClick={() => setSelectedType(t.id)} className={`p-4 border rounded-xl text-center transition-all ${selectedType === t.id ? "border-[#111] bg-gray-50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"}`}>
                  <div className="text-2xl mb-2">{t.icon}</div>
                  <div className="text-sm font-medium">{t.name}</div>
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end mt-12 pt-6 border-t border-gray-100">
            <button onClick={() => setPage(2)} className="px-6 py-2.5 rounded-lg text-sm font-medium bg-[#111] text-white hover:bg-[#333]">下一步</button>
          </div>
        </>
      );
    }

    if (page === 2) {
      return (
        <>
          <div className="flex items-center gap-3 mb-12">
            <div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-[#111] text-white text-xs flex items-center justify-center font-semibold">✓</div><span className="text-sm text-gray-600">选择类型</span></div>
            <div className="w-10 h-px bg-[#111]"></div>
            <div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-[#111] text-white text-xs flex items-center justify-center font-semibold">2</div><span className="text-sm font-medium">基本信息</span></div>
            <div className="w-10 h-px bg-gray-200"></div>
            <div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full border-2 border-gray-300 text-gray-400 text-xs flex items-center justify-center font-semibold">3</div><span className="text-sm text-gray-400">故事构思</span></div>
          </div>
          <div className="mb-6">
            <label className="text-sm font-semibold text-gray-700 mb-2.5 block">作品名称</label>
            <input type="text" value={workTitle} onChange={(e) => setWorkTitle(e.target.value)} placeholder="给你的故事起个名字" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#111] transition-colors" />
          </div>
          <div className="mb-6">
            <label className="text-sm font-semibold text-gray-700 mb-2.5 block">一句话简介</label>
            <p className="text-xs text-gray-500 mb-2.5">用一句话描述你的故事核心，帮助AI理解你的创作方向</p>
            <input type="text" value={workDesc} onChange={(e) => setWorkDesc(e.target.value)} placeholder="例如：一个程序员在深夜加班时发现公司的秘密" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#111] transition-colors" />
          </div>
          <div className="flex justify-between mt-12 pt-6 border-t border-gray-100">
            <button onClick={() => setPage(1)} className="px-6 py-2.5 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50">上一步</button>
            <div className="flex gap-2.5">
              <button onClick={() => setPage(4)} className="px-6 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900">跳过，直接开始创作</button>
              <button onClick={() => setPage(3)} className="px-6 py-2.5 rounded-lg text-sm font-medium bg-[#111] text-white hover:bg-[#333]">下一步</button>
            </div>
          </div>
        </>
      );
    }
    // PLACEHOLDER_PAGE3

    if (page === 3) {
      return (
        <>
          <div className="flex items-center gap-3 mb-12">
            <div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-[#111] text-white text-xs flex items-center justify-center font-semibold">✓</div><span className="text-sm text-gray-600">选择类型</span></div>
            <div className="w-10 h-px bg-[#111]"></div>
            <div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-[#111] text-white text-xs flex items-center justify-center font-semibold">✓</div><span className="text-sm text-gray-600">基本信息</span></div>
            <div className="w-10 h-px bg-[#111]"></div>
            <div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-[#111] text-white text-xs flex items-center justify-center font-semibold">3</div><span className="text-sm font-medium">故事构思</span></div>
          </div>
          <div className="mb-6">
            <label className="text-sm font-semibold text-gray-700 mb-2.5 block">整体故事梗概（可选）</label>
            <p className="text-xs text-gray-500 mb-2.5">大致描述你的故事从开始到结束的走向，AI会帮你建议章节划分。不写也可以直接开始。</p>
            <textarea value={storyOutline} onChange={(e) => setStoryOutline(e.target.value)} placeholder="例如：外卖骑手小陈在一次深夜送餐中，被送到一个废弃仓库。他目睹了一场交易，被人发现后开始被追杀……" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none resize-y min-h-[120px] leading-relaxed focus:border-[#111] transition-colors" />
          </div>
          <button onClick={() => setShowAISuggestion(true)} className="px-6 py-2.5 rounded-lg text-sm font-medium bg-[#111] text-white hover:bg-[#333] mb-4">让AI帮我规划章节</button>
          {showAISuggestion && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="text-xs text-gray-600 mb-3 flex items-center gap-1.5"><span>✦</span> AI建议的章节划分（点击编辑，可删除或新增）</div>
              <div className="space-y-0">
                {suggestedChapters.map((ch, i) => (
                  <div key={i} className="group flex items-start gap-2 py-2.5 border-b border-gray-100 last:border-0">
                    <span className="text-xs text-gray-400 min-w-12 pt-0.5 shrink-0">第{i + 1}章</span>
                    {editingIdx === i ? (
                      <div className="flex-1 space-y-2">
                        <input type="text" value={ch.title} onChange={(e) => setSuggestedChapters(suggestedChapters.map((c, j) => j === i ? { ...c, title: e.target.value } : c))} className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm outline-none focus:border-[#111]" placeholder="章节标题" autoFocus />
                        <input type="text" value={ch.desc} onChange={(e) => setSuggestedChapters(suggestedChapters.map((c, j) => j === i ? { ...c, desc: e.target.value } : c))} className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-xs outline-none focus:border-[#111]" placeholder="章节简介" />
                        <button onClick={() => setEditingIdx(null)} className="text-xs text-gray-500 hover:text-gray-800">完成</button>
                      </div>
                    ) : (
                      <div className="flex-1 cursor-pointer" onClick={() => setEditingIdx(i)}>
                        <div className="text-sm text-gray-800">{ch.title}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{ch.desc}</div>
                      </div>
                    )}
                    {suggestedChapters.length > 1 && (
                      <button onClick={() => setSuggestedChapters(suggestedChapters.filter((_, j) => j !== i))} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 text-xs px-1.5 py-0.5 shrink-0 transition-opacity">删除</button>
                    )}
                  </div>
                ))}
              </div>
              <button onClick={() => { setSuggestedChapters([...suggestedChapters, { title: "", desc: "" }]); setEditingIdx(suggestedChapters.length); }} className="mt-3 text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1"><span>+</span> 新增章节</button>
            </div>
          )}
          <div className="flex justify-between mt-12 pt-6 border-t border-gray-100">
            <button onClick={() => setPage(2)} className="px-6 py-2.5 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50">上一步</button>
            <button onClick={createWork} className="px-6 py-2.5 rounded-lg text-sm font-medium bg-[#111] text-white hover:bg-[#333]">确认，开始创作</button>
          </div>
        </>
      );
    }
    // PLACEHOLDER_PAGE4

    if (page === 4) {
      return (
        <>
          <div className="mb-6">
            <label className="text-sm font-semibold text-gray-700 mb-2.5 block">作品名称</label>
            <input type="text" value={workTitle} onChange={(e) => setWorkTitle(e.target.value)} placeholder="给你的故事起个名字" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#111] transition-colors" />
          </div>
          <div className="mb-6">
            <label className="text-sm font-semibold text-gray-700 mb-2.5 block">一句话简介</label>
            <input type="text" value={workDesc} onChange={(e) => setWorkDesc(e.target.value)} placeholder="用一句话描述你的故事核心" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#111] transition-colors" />
          </div>

          {/* 风格预设 */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-gray-700">风格预设</label>
              <button onClick={() => setShowStyleModal(true)} className="text-xs text-gray-600 border border-gray-300 px-2.5 py-1 rounded-md hover:bg-gray-50">+ 新建预设</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {getPresets().map((p) => (
                <button key={p.id} onClick={() => setSelectedStyle(p.id)} className={`px-3.5 py-1.5 border rounded-full text-sm transition-colors ${selectedStyle === p.id ? "border-[#111] bg-gray-100 font-medium" : "border-gray-200 hover:border-gray-400"}`}>{p.name}</button>
              ))}
            </div>
          </div>

          {/* 世界观设定 */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-gray-700">世界观设定</label>
              <div className="flex gap-2">
                <button onClick={() => setShowWorldPicker(!showWorldPicker)} className="text-xs text-gray-600 border border-gray-300 px-2.5 py-1 rounded-md hover:bg-gray-50">选择已有</button>
                <button onClick={() => setShowWorldModal(true)} className="text-xs text-gray-600 border border-gray-300 px-2.5 py-1 rounded-md hover:bg-gray-50">+ 新建</button>
              </div>
            </div>
            {showWorldPicker && (
              <div className="mb-3 space-y-2">
                {getWorldviews().map((wv) => (
                  <button key={wv.id} onClick={() => { setSelectedWorldviewId(wv.id); setShowWorldPicker(false); }} className={`w-full text-left px-4 py-3 border rounded-xl text-sm transition-colors ${selectedWorldviewId === wv.id ? "border-[#111] bg-gray-50" : "border-gray-200 hover:border-gray-300"}`}>
                    <div className="font-medium">{wv.name}</div>
                    {wv.description && <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{wv.description}</div>}
                  </button>
                ))}
                {getWorldviews().length === 0 && <p className="text-xs text-gray-400 py-2">暂无已有世界观，点击「+ 新建」创建一个</p>}
              </div>
            )}
            {selectedWorldviewId ? (
              <div className="px-4 py-3.5 border border-[#111] rounded-xl text-sm leading-relaxed bg-gray-50">
                <div className="text-xs text-gray-500 mb-1">✓ 已选择</div>
                {(() => { const wv = getWorldviews().find(w => w.id === selectedWorldviewId); return wv ? <><div className="font-medium">{wv.name}</div>{wv.description && <div className="text-gray-600 mt-1">{wv.description}</div>}</> : null; })()}
              </div>
            ) : (
              <div className="px-4 py-3.5 border border-gray-200 rounded-xl text-sm text-gray-600 leading-relaxed">
                <div className="text-xs text-gray-400 mb-1">当前选择</div>
                将根据故事类型自动生成默认世界观
              </div>
            )}
          </div>

          <div className="flex justify-between mt-12 pt-6 border-t border-gray-100">
            <button onClick={() => setPage(0)} className="px-6 py-2.5 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50">返回</button>
            <button onClick={createWork} className="px-6 py-2.5 rounded-lg text-sm font-medium bg-[#111] text-white hover:bg-[#333]">创建作品，开始创作</button>
          </div>
        </>
      );
    }
  };
  // PLACEHOLDER_RETURN

  return (
    <div className="min-h-screen bg-white text-[#111]">
      <header className="px-10 py-5 flex items-center">
        <button onClick={() => page === 0 ? router.push("/home") : setPage(0)} className="text-sm text-gray-500 mr-4 hover:text-gray-900">← 返回</button>
        <span className="text-sm font-semibold">新建作品</span>
      </header>
      <div className="max-w-[720px] mx-auto px-10 py-10">
        {renderPage()}
      </div>

      {/* 风格预设 Modal */}
      {showStyleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowStyleModal(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 shadow-2xl max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">新建风格预设</h3>
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">预设名称</label>
              <input type="text" value={newStyleName} onChange={(e) => setNewStyleName(e.target.value)} placeholder="例如：我的悬疑风" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#111]" />
            </div>
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">风格指令 <span className="text-gray-400 font-normal">（核心）</span></label>
              <p className="text-xs text-gray-400 mb-2">描述你想要的写作风格，AI 会按此指令控制输出</p>
              <textarea value={newStylePrompt} onChange={(e) => setNewStylePrompt(e.target.value)} placeholder="例如：以简洁有力的语言写作，多用短句，避免华丽辞藻，注重画面感和节奏感。对话占比高，心理描写少，靠行为和环境暗示情绪……" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none resize-y min-h-[120px] focus:border-[#111]" />
            </div>
            <div className="mb-4">
              <button onClick={() => setShowStyleParams(!showStyleParams)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                <span className={`transition-transform ${showStyleParams ? "rotate-90" : ""}`}>▶</span>
                <span className="font-medium">参数微调（可选）</span>
              </button>
              {showStyleParams && (
                <div className="mt-3 p-4 border border-gray-200 rounded-xl space-y-3">
                  {STYLE_PARAM_OPTIONS.map((param) => (
                    <div key={param.id}>
                      <div className="text-xs text-gray-500 mb-1.5">{param.label}</div>
                      <div className="flex flex-wrap gap-1.5">
                        {param.options.map((opt) => (
                          <button key={opt} onClick={() => setNewStyleParams({ ...newStyleParams, [param.id]: newStyleParams[param.id] === opt ? undefined : opt })} className={`px-2.5 py-1 text-xs border rounded-lg transition-all ${newStyleParams[param.id] === opt ? "border-[#111] bg-gray-50 font-medium" : "border-gray-200 hover:border-gray-300"}`}>{opt}</button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button onClick={() => { setShowStyleModal(false); setNewStyleName(""); setNewStylePrompt(""); setNewStyleParams({}); }} className="px-5 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
              <button onClick={handleSaveStyle} disabled={!newStylePrompt.trim()} className="px-5 py-2 text-sm bg-[#111] text-white rounded-lg hover:bg-[#333] disabled:opacity-30 disabled:cursor-not-allowed">保存预设</button>
            </div>
          </div>
        </div>
      )}

      {/* 世界观 Modal */}
      {showWorldModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowWorldModal(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 shadow-2xl max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">自定义世界观</h3>
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">世界类型</label>
              <div className="grid grid-cols-4 gap-2">
                {WORLD_TYPES.map((t) => (
                  <button key={t.id} onClick={() => setNewWorldType(t.id)} className={`p-3 border rounded-xl text-center transition-all ${newWorldType === t.id ? "border-[#111] bg-gray-50" : "border-gray-200 hover:border-gray-300"}`}>
                    <div className="text-xl mb-1">{t.icon}</div>
                    <div className="text-xs font-medium">{t.name}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">世界观描述</label>
              <p className="text-xs text-gray-400 mb-2">描述这个世界的核心设定：时代背景、社会结构、特殊规则等</p>
              <textarea value={newWorldDesc} onChange={(e) => setNewWorldDesc(e.target.value)} placeholder="例如：2030年的赛博朋克城市，企业取代政府统治社会，底层居民生活在永远照不到阳光的低层建筑中。科技高度发达但贫富分化极端，义体改造普及但黑市交易猖獗……" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none resize-y min-h-[120px] focus:border-[#111]" />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button onClick={() => { setShowWorldModal(false); setNewWorldType("modern"); setNewWorldDesc(""); }} className="px-5 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
              <button onClick={handleSaveWorld} disabled={!newWorldDesc.trim()} className="px-5 py-2 text-sm bg-[#111] text-white rounded-lg hover:bg-[#333] disabled:opacity-30 disabled:cursor-not-allowed">保存世界观</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
