"use client";

import { useState } from "react";

interface StylePreset {
  id: string;
  name: string;
  description: string;
  selected: boolean;
}

const BUILTIN_PRESETS: StylePreset[] = [
  { id: "1", name: "金庸武侠", description: "古风、豪侠、江湖", selected: true },
  { id: "2", name: "余华冷叙事", description: "克制、冷峻、现实", selected: false },
  { id: "3", name: "日系轻小说", description: "轻松、对话多、二次元", selected: false },
  { id: "4", name: "古风言情", description: "细腻、唯美、情感", selected: false },
  { id: "5", name: "现代都市", description: "写实、生活化", selected: false },
  { id: "6", name: "村上春树风", description: "孤独、意识流", selected: false },
];

const STYLE_PARAMS = [
  {
    id: "narrative",
    label: "叙事视角",
    options: ["第一人称", "第三人称限制", "第三人称全知"],
    description: "选择故事的叙述角度和范围"
  },
  {
    id: "tone",
    label: "文风倾向",
    options: ["简洁", "细腻", "华丽", "幽默", "严肃", "讽刺"],
    description: "整体的语言风格和情感基调"
  },
  {
    id: "detail",
    label: "描写偏好",
    options: ["心理描写", "环境描写", "动作描写", "对话为主", "细节铺陈"],
    description: "偏重于哪种类型的描写"
  },
  {
    id: "pace",
    label: "节奏感",
    options: ["紧凑", "适中", "舒缓", "缓慢"],
    description: "叙事的快慢节奏"
  },
  {
    id: "emotion",
    label: "情感浓度",
    options: ["克制", "适中", "浓烈", "激情"],
    description: "情感表达的强烈程度"
  },
  {
    id: "sensitivity",
    label: "敏感内容尺度",
    options: ["保守", "适中", "开放"],
    description: "对暴力、性等内容的表现程度"
  },
];

export default function StylesPage() {
  const [presets, setPresets] = useState<StylePreset[]>(BUILTIN_PRESETS);
  const [expandedPreset, setExpandedPreset] = useState<string | null>(null);
  const [expandedParams, setExpandedParams] = useState(false);
  const [selectedParams, setSelectedParams] = useState<Record<string, string>>({
    narrative: "第三人称限制",
    tone: "适中",
    detail: "心理描写",
    pace: "适中",
    emotion: "克制",
    sensitivity: "适中",
  });

  const togglePresetSelection = (id: string) => {
    setPresets(presets.map(p => p.id === id ? { ...p, selected: !p.selected } : p));
  };

  const togglePresetExpand = (id: string) => {
    setExpandedPreset(expandedPreset === id ? null : id);
  };

  const handleParamChange = (paramId: string, value: string) => {
    setSelectedParams({ ...selectedParams, [paramId]: value });
  };

  const selectedPreset = presets.find(p => p.selected);

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
          <p className="text-sm text-gray-500">选择或自定义故事的写作风格</p>
        </div>

        {/* 当前选中的预设 */}
        <div className="mb-10 p-5 bg-gray-50 rounded-xl border border-gray-200">
          <div className="text-xs text-gray-400 mb-2">当前使用</div>
          <div className="text-base font-semibold">{selectedPreset?.name || "未选择"}</div>
          <div className="text-sm text-gray-600">{selectedPreset?.description}</div>
        </div>

        {/* 内置预设 */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold text-gray-700">内置预设</div>
            <button className="text-xs text-gray-600 border border-gray-300 px-2.5 py-1 rounded-md hover:bg-gray-50">
              + 新建预设
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => togglePresetSelection(preset.id)}
                className={`px-3.5 py-1.5 rounded-full text-sm transition-all ${preset.selected ? "bg-[#111] text-white" : "border border-gray-200 hover:border-gray-400"}`}
              >
                {preset.name}
              </button>
            ))}
          </div>

          {/* 预设详情（可展开） */}
          {selectedPreset && (
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedParams(!expandedParams)}
                className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium">预设详情</span>
                <span className={`text-gray-400 transition-transform ${expandedParams ? "rotate-180" : ""}`}>▼</span>
              </button>

              {expandedParams && (
                <div className="p-5 border-t border-gray-100">
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    此预设参考{selectedPreset.name}风格，注重情节的跌宕起伏，人物性格鲜明，描写生动。语言流畅但不过于晦涩，适合{selectedPreset.name.replace(/[^一-龥]/g, '')}类题材。
                  </p>

                  <div className="border-t border-gray-100 pt-4 space-y-4">
                    {STYLE_PARAMS.map((param) => (
                      <div key={param.id}>
                        <div className="text-xs text-gray-400 mb-2">{param.label}</div>
                        <div className="text-xs text-gray-500 mb-2">{param.description}</div>
                        <div className="flex flex-wrap gap-2">
                          {param.options.map((opt) => (
                            <button
                              key={opt}
                              onClick={() => handleParamChange(param.id, opt)}
                              className={`px-3 py-1.5 text-xs border rounded-lg transition-all ${selectedParams[param.id] === opt ? "border-[#111] bg-gray-50 font-medium" : "border-gray-200 hover:border-gray-300"}`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                    <button className="px-4 py-2 text-sm bg-[#111] text-white rounded-lg hover:bg-[#333]">
                      保存修改
                    </button>
                    <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                      另存为新预设
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 从零自定义 */}
        <div className="mb-10">
          <div className="text-sm font-semibold text-gray-700 mb-3">从零自定义</div>
          <div className="p-5 border border-dashed border-gray-300 rounded-xl text-center hover:border-gray-400 transition-colors">
            <div className="text-gray-400 mb-2">从头配置风格参数</div>
            <button className="text-sm text-gray-600 hover:text-gray-900 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">
              开始自定义
            </button>
          </div>
        </div>

        {/* 从收藏导入 */}
        <div>
          <div className="text-sm font-semibold text-gray-700 mb-3">从收藏导入</div>
          <div className="text-center py-12 border border-dashed border-gray-300 rounded-xl">
            <div className="text-gray-400 mb-2">暂无收藏的预设</div>
            <button className="text-sm text-gray-600 hover:text-gray-900">
              去资产市场浏览 →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}