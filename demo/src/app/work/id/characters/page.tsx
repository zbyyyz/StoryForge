"use client";

import { useState } from "react";

interface Character {
  id: string;
  name: string;
  description: string;
  gender?: string;
  age?: string;
  occupation?: string;
  personality?: string;
  appearance?: string;
  background?: string;
}

const INITIAL_CHARACTERS: Character[] = [
  { id: "1", name: "陈默", description: "外卖骑手，28岁，沉默寡言", gender: "男", age: "28", occupation: "外卖骑手", personality: "沉默寡言、冷静" },
  { id: "2", name: "林薇", description: "调查记者，32岁，聪明勇敢", gender: "女", age: "32", occupation: "调查记者", personality: "聪明、勇敢、有正义感" },
  { id: "3", name: "周远", description: "物流公司老板，神秘", gender: "男", age: "45", occupation: "物流公司老板", personality: "神秘、城府深" },
];

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>(INITIAL_CHARACTERS);
  const [showModal, setShowModal] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const characterForm = useState<Partial<Character>>({
    name: "", description: "", gender: "", age: "", occupation: "", personality: "", appearance: "", background: ""
  })[0];
  const setCharacterForm = useState<Partial<Character>>({
    name: "", description: "", gender: "", age: "", occupation: "", personality: "", appearance: "", background: ""
  })[1];

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const openAdd = () => {
    setEditingCharacter(null);
    setCharacterForm({ name: "", description: "", gender: "", age: "", occupation: "", personality: "", appearance: "", background: "" });
    setShowModal(true);
  };

  const openEdit = (char: Character) => {
    setEditingCharacter(char);
    setCharacterForm(char);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!characterForm.name?.trim()) return;

    if (editingCharacter) {
      setCharacters(characters.map(c => c.id === editingCharacter.id ? { ...c, ...characterForm } as Character : c));
    } else {
      const newChar: Character = {
        id: String(Date.now()),
        name: characterForm.name || "",
        description: characterForm.description || "",
        gender: characterForm.gender,
        age: characterForm.age,
        occupation: characterForm.occupation,
        personality: characterForm.personality,
        appearance: characterForm.appearance,
        background: characterForm.background,
      };
      setCharacters([...characters, newChar]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("确定要删除这个角色吗？")) {
      setCharacters(characters.filter(c => c.id !== id));
    }
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
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-gray-50 text-gray-900 font-medium">
            <span className="text-base">👥</span> 角色库
          </div>
          <a href="/work/id/world" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <span className="text-base">🌍</span> 世界观
          </a>
          <a href="/work/id/styles" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <span className="text-base">✏</span> 风格预设
          </a>
        </nav>
      </aside>

      {/* 主内容 */}
      <main className="flex-1 ml-[280px] px-10 py-10 max-w-[1000px]">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-2xl font-bold">角色库</h1>
          <button onClick={openAdd} className="px-6 py-2.5 rounded-lg text-sm font-medium bg-[#111] text-white hover:bg-[#333]">
            + 新增角色
          </button>
        </div>

        {characters.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">👥</div>
            <div className="text-gray-500 mb-4">还没有角色</div>
            <button onClick={openAdd} className="px-6 py-2.5 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-50">
              创建第一个角色
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {characters.map((char) => (
              <div key={char.id} className="border border-gray-200 rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{char.name}</h3>
                    <p className="text-sm text-gray-600">{char.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(char)} className="text-gray-400 hover:text-gray-700 text-sm px-2 py-1">
                      编辑
                    </button>
                    <button onClick={() => handleDelete(char.id)} className="text-gray-400 hover:text-red-500 text-sm px-2 py-1">
                      删除
                    </button>
                  </div>
                </div>

                {/* 基础信息 */}
                <div className="grid grid-cols-4 gap-4 mb-4">
                  {char.gender && (
                    <div>
                      <div className="text-xs text-gray-400 mb-1">性别</div>
                      <div className="text-sm text-gray-700">{char.gender}</div>
                    </div>
                  )}
                  {char.age && (
                    <div>
                      <div className="text-xs text-gray-400 mb-1">年龄</div>
                      <div className="text-sm text-gray-700">{char.age}</div>
                    </div>
                  )}
                  {char.occupation && (
                    <div>
                      <div className="text-xs text-gray-400 mb-1">职业</div>
                      <div className="text-sm text-gray-700">{char.occupation}</div>
                    </div>
                  )}
                  {char.personality && (
                    <div>
                      <div className="text-xs text-gray-400 mb-1">性格</div>
                      <div className="text-sm text-gray-700">{char.personality}</div>
                    </div>
                  )}
                </div>

                {/* 可折叠的进阶信息 */}
                <div className="border-t border-gray-100 pt-4">
                  <button onClick={() => toggleSection(char.id)} className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1">
                    <span className={`transition-transform ${expandedSection === char.id ? "rotate-90" : ""}`}>▶</span>
                    更多信息
                  </button>
                  {expandedSection === char.id && (
                    <div className="mt-4 space-y-4">
                      {char.appearance && (
                        <div>
                          <div className="text-xs text-gray-400 mb-1">外貌特征</div>
                          <div className="text-sm text-gray-700">{char.appearance}</div>
                        </div>
                      )}
                      {char.background && (
                        <div>
                          <div className="text-xs text-gray-400 mb-1">背景故事</div>
                          <div className="text-sm text-gray-700">{char.background}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 编辑模态框 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-base font-semibold mb-5">{editingCharacter ? "编辑角色" : "新增角色"}</h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">角色名称 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={characterForm.name || ""}
                  onChange={(e) => setCharacterForm({ ...characterForm, name: e.target.value })}
                  placeholder="给角色起个名字"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#111] transition-colors"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">一句话描述 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={characterForm.description || ""}
                  onChange={(e) => setCharacterForm({ ...characterForm, description: e.target.value })}
                  placeholder="例如：沉默寡言的外卖骑手"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#111] transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-600 mb-1.5 block">性别</label>
                  <input
                    type="text"
                    value={characterForm.gender || ""}
                    onChange={(e) => setCharacterForm({ ...characterForm, gender: e.target.value })}
                    placeholder="男/女"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#111] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1.5 block">年龄</label>
                  <input
                    type="text"
                    value={characterForm.age || ""}
                    onChange={(e) => setCharacterForm({ ...characterForm, age: e.target.value })}
                    placeholder="28"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#111] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-600 mb-1.5 block">职业</label>
                <input
                  type="text"
                  value={characterForm.occupation || ""}
                  onChange={(e) => setCharacterForm({ ...characterForm, occupation: e.target.value })}
                  placeholder="例如：外卖骑手"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#111] transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600 mb-1.5 block">性格特征</label>
                <input
                  type="text"
                  value={characterForm.personality || ""}
                  onChange={(e) => setCharacterForm({ ...characterForm, personality: e.target.value })}
                  placeholder="例如：冷静、谨慎、有正义感"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#111] transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600 mb-1.5 block">外貌特征</label>
                <textarea
                  value={characterForm.appearance || ""}
                  onChange={(e) => setCharacterForm({ ...characterForm, appearance: e.target.value })}
                  placeholder="例如：身材瘦削，留寸头，穿着朴素，眼神警惕"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#111] transition-colors resize-y min-h-[80px]"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600 mb-1.5 block">背景故事</label>
                <textarea
                  value={characterForm.background || ""}
                  onChange={(e) => setCharacterForm({ ...characterForm, background: e.target.value })}
                  placeholder="例如：来自农村，高中毕业后进城打工，送了五年外卖..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#111] transition-colors resize-y min-h-[80px]"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={() => {
                  setShowModal(false);
                  setCharacterForm({ name: "", description: "", gender: "", age: "", occupation: "", personality: "", appearance: "", background: "" });
                }}
                className="px-5 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                disabled={!characterForm.name?.trim() || !characterForm.description?.trim()}
                className="px-5 py-2 text-sm bg-[#111] text-white rounded-lg hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingCharacter ? "保存" : "创建"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}