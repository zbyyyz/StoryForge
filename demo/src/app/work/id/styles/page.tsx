"use client";

import { useState, useEffect } from "react";
import {
  StylePreset,
  StyleParams,
  STYLE_PARAM_OPTIONS,
  getPresets,
  getCustomPresets,
  saveCustomPresets,
  getActivePresetId,
  setActivePresetId,
} from "@/app/lib/style-presets";

export default function StylesPage() {
  const [presets, setPresets] = useState<StylePreset[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [editedPrompt, setEditedPrompt] = useState("");
  const [editedParams, setEditedParams] = useState<StyleParams>({});
  const [showParams, setShowParams] = useState(false);
  const [showNewPreset, setShowNewPreset] = useState(false);
  const [newPresetName, setNewPresetName] = useState("");
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const all = getPresets();
    setPresets(all);
    const id = getActivePresetId();
    setActiveId(id);
    const active = all.find(p => p.id === id) || all[0];
    if (active) {
      setEditedPrompt(active.prompt);
      setEditedParams(active.params);
    }
  }, []);

  const activePreset = presets.find(p => p.id === activeId) || presets[0];

  const handleSelectPreset = (id: string) => {
    setActiveId(id);
    setActivePresetId(id);
    const preset = presets.find(p => p.id === id);
    if (preset) {
      setEditedPrompt(preset.prompt);
      setEditedParams(preset.params);
    }
    setDirty(false);
  };

  const handlePromptChange = (value: string) => {
    setEditedPrompt(value);
    setDirty(true);
  };

  const handleParamChange = (key: keyof StyleParams, value: string) => {
    setEditedParams({ ...editedParams, [key]: value });
    setDirty(true);
  };

  const handleSave = () => {
    if (!activePreset) return;

    if (activePreset.builtin) {
      const forked: StylePreset = {
        id: String(Date.now()),
        name: `${activePreset.name}（自定义）`,
        description: activePreset.description,
        prompt: editedPrompt,
        params: editedParams,
        builtin: false,
      };
      const customs = [...getCustomPresets(), forked];
      saveCustomPresets(customs);
      setActivePresetId(forked.id);
      setActiveId(forked.id);
      setPresets(getPresets());
    } else {
      const updated: StylePreset = { ...activePreset, prompt: editedPrompt, params: editedParams };
      const customs = getCustomPresets().map(p => p.id === updated.id ? updated : p);
      saveCustomPresets(customs);
      setPresets(getPresets());
    }
    setDirty(false);
  };

  const handleSaveAsNew = () => {
    const name = newPresetName.trim() || `自定义风格 ${Date.now()}`;
    const newPreset: StylePreset = {
      id: String(Date.now()),
      name,
      description: "自定义预设",
      prompt: editedPrompt,
      params: editedParams,
      builtin: false,
    };
    const customs = [...getCustomPresets(), newPreset];
    saveCustomPresets(customs);
    setActivePresetId(newPreset.id);
    setActiveId(newPreset.id);
    setPresets(getPresets());
    setShowNewPreset(false);
    setNewPresetName("");
    setDirty(false);
  };

  const handleReset = () => {
    if (!activePreset) return;
    setEditedPrompt(activePreset.prompt);
    setEditedParams(activePreset.params);
    setDirty(false);
  };

  const handleDelete = () => {
    if (!activePreset || activePreset.builtin) return;
    const customs = getCustomPresets().filter(p => p.id !== activePreset.id);
    saveCustomPresets(customs);
    const all = getPresets();
    setPresets(all);
    const first = all[0];
    if (first) {
      setActivePresetId(first.id);
      setActiveId(first.id);
      setEditedPrompt(first.prompt);
      setEditedParams(first.params);
    }
    setDirty(false);
  };

  const handleCreateBlank = () => {
    const blank: StylePreset = {
      id: String(Date.now()),
      name: "自定义风格",
      description: "从零开始配置",
      prompt: "",
      params: {},
      builtin: false,
    };
    const customs = [...getCustomPresets(), blank];
    saveCustomPresets(customs);
    setActivePresetId(blank.id);
    setActiveId(blank.id);
    setEditedPrompt("");
    setEditedParams({});
    setPresets(getPresets());
    setDirty(false);
  };

  return (
    <div className="flex min-h-screen bg-white text-[#111]">
      {/* 左侧边栏 */}
      <aside className="w-[280px] border-r border-gray-100 flex flex-col h-screen fixed left-0 top-0">
        <div className="px-5 py-5 border-b border-gray-100">
          <a href="/work/id" className="text-sm text-gray-500 hover:text-gray-900 mb-3 block">← 返回总览</a>
          <div className="text-lg font-bold mb-1">城市边缘</div>
          <div className="text-xs text-gray-400">现代都市 · 悬疑推理</div>
        </div>

        <nav className="px-3 py-4 flex flex-col gap-1">
          <a href="/work/id" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <span className="text-base">🏠</span> 总览
          </a>
          <a href="/work/id/characters" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <span className="text-base">👥</span> 角色库
          </a>
          <a href="/work/id/world" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <span className="text-base">🌍</span> 世界观
          </a>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-gray-50 text-gray-900 font-medium">
            <span className="text-base">✏</span> 风格预设
          </div>
        </nav>
      </aside>

      {/* 主内容 */}
      <main className="flex-1 ml-[280px] px-10 py-10 max-w-[1000px]">
        <div className="mb-10">
          <h1 className="text-2xl font-bold mb-2">风格预设</h1>
          <p className="text-sm text-gray-500">定义 AI 的写作风格——风格指令是控制输出的核心</p>
        </div>

        {/* 预设选择器 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold text-gray-700">选择预设</div>
            <button
              onClick={handleCreateBlank}
              className="text-xs text-gray-600 border border-gray-300 px-2.5 py-1 rounded-md hover:bg-gray-50"
            >
              + 从零新建
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset.id)}
                className={`px-3.5 py-1.5 rounded-full text-sm transition-all ${
                  activeId === preset.id
                    ? "bg-[#111] text-white"
                    : "border border-gray-200 hover:border-gray-400"
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* 风格指令编辑器（核心） */}
        {activePreset && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-gray-700">风格指令</div>
              <div className="text-xs text-gray-400">此指令将直接发送给 AI 控制写作风格</div>
            </div>
            <textarea
              value={editedPrompt}
              onChange={(e) => handlePromptChange(e.target.value)}
              placeholder="描述你想要的写作风格。例如：以简洁有力的语言写作，多用短句，避免华丽辞藻，注重画面感和节奏感……"
              className="w-full px-4 py-4 border border-gray-200 rounded-xl text-sm leading-relaxed outline-none resize-y min-h-[160px] focus:border-[#111] transition-colors"
            />
            <div className="flex items-center justify-between mt-2">
              <div className="text-xs text-gray-400">{editedPrompt.length} 字</div>
              {activePreset.builtin && dirty && (
                <div className="text-xs text-amber-600">编辑内置预设将另存为自定义副本</div>
              )}
            </div>
          </div>
        )}

        {/* 参数微调（折叠） */}
        <div className="mb-8">
          <button
            onClick={() => setShowParams(!showParams)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-3"
          >
            <span className={`transition-transform ${showParams ? "rotate-90" : ""}`}>▶</span>
            <span className="font-medium">参数微调（可选补充）</span>
            <span className="text-xs text-gray-400">在风格指令基础上附加结构化要求</span>
          </button>

          {showParams && (
            <div className="p-5 border border-gray-200 rounded-xl space-y-4">
              {STYLE_PARAM_OPTIONS.map((param) => (
                <div key={param.id}>
                  <div className="text-xs text-gray-500 mb-2">{param.label}</div>
                  <div className="flex flex-wrap gap-2">
                    {param.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleParamChange(param.id, opt)}
                        className={`px-3 py-1.5 text-xs border rounded-lg transition-all ${
                          editedParams[param.id] === opt
                            ? "border-[#111] bg-gray-50 font-medium"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
          <button
            onClick={handleSave}
            disabled={!dirty}
            className="px-5 py-2 text-sm bg-[#111] text-white rounded-lg hover:bg-[#333] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            保存
          </button>
          <button
            onClick={() => setShowNewPreset(true)}
            className="px-5 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            另存为新预设
          </button>
          {dirty && (
            <button
              onClick={handleReset}
              className="px-5 py-2 text-sm text-gray-500 hover:text-gray-800"
            >
              撤销修改
            </button>
          )}
          {activePreset && !activePreset.builtin && (
            <button
              onClick={handleDelete}
              className="px-5 py-2 text-sm text-red-500 hover:text-red-700 ml-auto"
            >
              删除预设
            </button>
          )}
        </div>

        {/* 另存为弹窗 */}
        {showNewPreset && (
          <div className="mt-4 p-4 border border-gray-200 rounded-xl flex items-center gap-3">
            <input
              type="text"
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
              placeholder="新预设名称"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-[#111]"
              autoFocus
              onKeyDown={(e) => { if (e.key === "Enter") handleSaveAsNew(); }}
            />
            <button onClick={handleSaveAsNew} className="px-4 py-2 text-sm bg-[#111] text-white rounded-lg hover:bg-[#333]">
              确认
            </button>
            <button onClick={() => { setShowNewPreset(false); setNewPresetName(""); }} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
              取消
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
