"use client";

import { useState } from "react";

interface WorldView {
  id: string;
  name: string;
  type: string;
  description: string;
}

interface WorldSection {
  id: string;
  title: string;
  content: string;
  isOpen: boolean;
}

const INITIAL_WORLDVIEW: WorldView = {
  id: "1",
  name: "现代都市",
  type: "modern",
  description: "2020年代的现代都市背景，智能手机普及，外卖行业发达"
};

const INITIAL_SECTIONS: WorldSection[] = [
  { id: "时空背景", title: "时空背景", content: "2020年代的现代都市，某二线城市。科技水平与现实相当，智能手机、网约车、外卖服务等互联网服务普及。", isOpen: true },
  { id: "社会结构", title: "社会结构", content: "普通城市社会，有明显的贫富差距。富人区与贫民窟并存，物流公司、媒体机构、地下势力等各势力交织。", isOpen: false },
  { id: "规则体系", title: "规则体系", content: "现实世界的法律体系，但地下势力有自己的一套规则。追杀、收买等手段常见。", isOpen: false },
  { id: "文化风俗", title: "文化风俗", content: "典型的现代都市文化，快节奏生活，注重效率。年轻人偏好外卖、网约车等便捷服务。", isOpen: false },
  { id: "历史事件", title: "历史事件", content: "半年前发生过一起引起关注的物流公司事故，涉及多名员工，公司低调处理。", isOpen: true },
  { id: "日常生活", title: "日常生活", content: "货币使用人民币。交通以地铁、网约车、电动车为主。通讯主要通过微信等即时通讯软件。", isOpen: false },
  { id: "冲突与张力", title: "冲突与张力", content: "城市表面平静，但暗流涌动。地下势力与合法企业的勾结，正义与利益的冲突。", isOpen: false },
];

export default function WorldViewPage() {
  const [worldview, setWorldview] = useState<WorldView>(INITIAL_WORLDVIEW);
  const [sections, setSections] = useState<WorldSection[]>(INITIAL_SECTIONS);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState("");

  const toggleSection = (id: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, isOpen: !s.isOpen } : s));
  };

  const startEdit = (section: WorldSection) => {
    setEditingSection(section.id);
    setEditedContent(section.content);
  };

  const saveEdit = () => {
    if (editingSection) {
      setSections(sections.map(s => s.id === editingSection ? { ...s, content: editedContent } : s));
      setEditingSection(null);
    }
  };

  const cancelEdit = () => {
    setEditingSection(null);
    setEditedContent("");
  };

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
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-gray-50 text-gray-900 font-medium">
            <span className="text-base">🌍</span> 世界观
          </div>
          <a href="/work/id/styles" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <span className="text-base">✏</span> 风格预设
          </a>
        </nav>
      </aside>

      {/* 主内容 */}
      <main className="flex-1 ml-[280px] px-10 py-10 max-w-[1000px]">
        <div className="mb-10">
          <h1 className="text-2xl font-bold mb-2">世界观设定</h1>
          <p className="text-sm text-gray-500">定义你故事世界的背景、规则和氛围</p>
        </div>

        {/* 世界类型选择 */}
        <div className="mb-10">
          <div className="text-sm font-semibold text-gray-700 mb-3">世界类型</div>
          <div className="grid grid-cols-4 gap-2.5">
            {WORLD_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => setWorldview({ ...worldview, type: type.id, name: type.name })}
                className={`p-4 border rounded-xl text-center transition-all ${worldview.type === type.id ? "border-[#111] bg-gray-50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"}`}
              >
                <div className="text-2xl mb-2">{type.icon}</div>
                <div className="text-sm font-medium">{type.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 世界描述 */}
        <div className="mb-10">
          <div className="text-sm font-semibold text-gray-700 mb-3">一句话描述</div>
          <textarea
            value={worldview.description}
            onChange={(e) => setWorldview({ ...worldview, description: e.target.value })}
            placeholder="例如：2030年的赛博朋克城市，人工智能统治，人类在废墟中求生"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none resize-y min-h-[80px] focus:border-[#111] transition-colors"
          />
        </div>

        {/* 详细设定（可折叠分类） */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold text-gray-700">详细设定</div>
            <button className="text-xs text-gray-600 border border-gray-300 px-2.5 py-1 rounded-md hover:bg-gray-50">
              + 新增分类
            </button>
          </div>

          <div className="space-y-2">
            {sections.map((section) => (
              <div key={section.id} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between px-5 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <span className="text-sm font-medium">{section.title}</span>
                  <span className={`transition-transform ${section.isOpen ? "rotate-180" : ""}`}>▼</span>
                </button>

                {section.isOpen && (
                  <div className="px-5 py-4">
                    {editingSection === section.id ? (
                      <div>
                        <textarea
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none resize-y min-h-[120px] focus:border-[#111] transition-colors"
                        />
                        <div className="flex gap-2 justify-end mt-3">
                          <button onClick={cancelEdit} className="px-4 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                            取消
                          </button>
                          <button onClick={saveEdit} className="px-4 py-1.5 text-sm bg-[#111] text-white rounded-lg hover:bg-[#333]">
                            保存
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-gray-700 leading-relaxed mb-3">{section.content}</p>
                        <button onClick={() => startEdit(section)} className="text-xs text-gray-500 hover:text-gray-700">
                          编辑
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 从收藏导入 */}
        <div className="mt-10">
          <div className="text-sm font-semibold text-gray-700 mb-3">从收藏导入</div>
          <div className="text-center py-12 border border-dashed border-gray-300 rounded-xl">
            <div className="text-gray-400 mb-2">暂无收藏的世界观</div>
            <button className="text-sm text-gray-600 hover:text-gray-900">
              去资产市场浏览 →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}