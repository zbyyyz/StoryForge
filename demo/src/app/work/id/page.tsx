"use client";

import { useState } from "react";

interface Chapter {
  id: string;
  title: string;
  status: "empty" | "skeleton" | "expanded" | "done";
  words: string;
}

interface Character {
  id: string;
  name: string;
  description: string;
  gender?: string;
  age?: string;
  occupation?: string;
  personality?: string;
}

const INITIAL_CHAPTERS: Chapter[] = [
  { id: "1", title: "第一章：深夜订单", status: "done", words: "3,200字" },
  { id: "2", title: "第二章：目击", status: "done", words: "4,100字" },
  { id: "3", title: "第三章：追杀", status: "expanded", words: "2,800字" },
  { id: "4", title: "第四章：线索", status: "skeleton", words: "骨架已写" },
  { id: "5", title: "第五章：同盟", status: "empty", words: "未开始" },
  { id: "6", title: "第六章：真相", status: "empty", words: "未开始" },
];

const INITIAL_CHARACTERS: Character[] = [
  { id: "1", name: "陈默", description: "外卖骑手，28岁，沉默寡言", gender: "男", age: "28", occupation: "外卖骑手", personality: "沉默寡言、冷静" },
  { id: "2", name: "林薇", description: "调查记者，32岁，聪明勇敢", gender: "女", age: "32", occupation: "调查记者", personality: "聪明、勇敢、有正义感" },
  { id: "3", name: "周远", description: "物流公司老板，神秘", gender: "男", age: "45", occupation: "物流公司老板", personality: "神秘、城府深" },
];

export default function WorkManagePage() {
  const [activeNav, setActiveNav] = useState("overview");
  const [activeChapter, setActiveChapter] = useState("1");
  const [chapters, setChapters] = useState<Chapter[]>(INITIAL_CHAPTERS);

  // 角色
  const [characters, setCharacters] = useState<Character[]>(INITIAL_CHARACTERS);
  const [showCharacterModal, setShowCharacterModal] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [characterForm, setCharacterForm] = useState<Partial<Character>>({
    name: "", description: "", gender: "", age: "", occupation: "", personality: ""
  });

  // 新增章节
  const [showAddChapter, setShowAddChapter] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState("");

  const navItems = [
    { id: "overview", label: "总览", icon: "🏠" },
    { id: "characters", label: "角色库", icon: "👥" },
    { id: "world", label: "世界观", icon: "🌍" },
    { id: "styles", label: "风格预设", icon: "✏" },
  ];

  const handleAddChapter = () => {
    if (!newChapterTitle.trim()) return;

    const newId = String(chapters.length + 1);
    const newChapter: Chapter = {
      id: newId,
      title: newChapterTitle,
      status: "empty",
      words: "未开始",
    };

    setChapters([...chapters, newChapter]);
    setNewChapterTitle("");
    setShowAddChapter(false);
    setActiveChapter(newId);
  };

  const handleDeleteChapter = (id: string) => {
    if (confirm("确定要删除这个章节吗？")) {
      setChapters(chapters.filter(c => c.id !== id));
      if (activeChapter === id) {
        setActiveChapter(chapters[0]?.id || "");
      }
    }
  };

  // 角色操作
  const openAddCharacter = () => {
    setEditingCharacter(null);
    setCharacterForm({ name: "", description: "", gender: "", age: "", occupation: "", personality: "" });
    setShowCharacterModal(true);
  };

  const openEditCharacter = (char: Character) => {
    setEditingCharacter(char);
    setCharacterForm(char);
    setShowCharacterModal(true);
  };

  const handleSaveCharacter = () => {
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
      };
      setCharacters([...characters, newChar]);
    }
    setShowCharacterModal(false);
  };

  const handleDeleteCharacter = (id: string) => {
    if (confirm("确定要删除这个角色吗？")) {
      setCharacters(characters.filter(c => c.id !== id));
    }
  };
  };

  return (
    <div className="flex min-h-screen bg-white text-[#111]">
      {/* 左侧边栏 */}
      <aside className="w-[280px] border-r border-gray-100 flex flex-col h-screen fixed left-0 top-0">
        <div className="px-5 py-5 border-b border-gray-100">
          <button onClick={() => window.location.href = "/home"} className="text-sm text-gray-500 hover:text-gray-900 mb-3">← 返回工作台</button>
          <div className="text-lg font-bold mb-1">城市边缘</div>
          <div className="text-xs text-gray-400">现代都市 · 悬疑推理</div>
        </div>

        <nav className="px-3 py-4 flex flex-col gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${activeNav === item.id ? "bg-gray-50 text-gray-900 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-gray-300">章节</div>
        <div className="flex-1 overflow-y-auto px-3 pb-3">
          {chapters.map((chapter) => (
            <div key={chapter.id} className="group">
              <button
                onClick={() => setActiveChapter(chapter.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors ${activeChapter === chapter.id ? "bg-gray-50" : "hover:bg-gray-50"}`}
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
                {chapters.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteChapter(chapter.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 text-xs px-1"
                  >
                    ✕
                  </button>
                )}
              </button>
            </div>
          ))}
          <button onClick={() => setShowAddChapter(true)} className="w-full flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-gray-50 hover:text-gray-600">
            <span>+</span> 新增章节
          </button>
        </div>
      </aside>

      {/* 新增章节模态框 */}
      {showAddChapter && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAddChapter(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-base font-semibold mb-4">新增章节</h3>
            <input
              type="text"
              value={newChapterTitle}
              onChange={(e) => setNewChapterTitle(e.target.value)}
              placeholder="章节标题，例如：第七章：后续"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#111] transition-colors mb-4"
              autoFocus
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowAddChapter(false);
                  setNewChapterTitle("");
                }}
                className="px-5 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleAddChapter}
                disabled={!newChapterTitle.trim()}
                className="px-5 py-2 text-sm bg-[#111] text-white rounded-lg hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                添加
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 主内容 */}
      <main className="flex-1 ml-[280px] px-10 py-10 max-w-[800px]">
        {/* 角色库 */}
        {activeNav === "characters" && (
          <>
            <div className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">角色库</h1>
                <button
                  onClick={openAddCharacter}
                  className="px-6 py-2.5 rounded-lg text-sm font-medium bg-[#111] text-white hover:bg-[#333]"
                >
                  + 新增角色
                </button>
              </div>
            </div>

            {characters.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">👥</div>
                <div className="text-gray-500 mb-4">还没有角色</div>
                <button
                  onClick={openAddCharacter}
                  className="px-6 py-2.5 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-50"
                >
                  创建第一个角色
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {characters.map((char) => (
                  <div key={char.id} className="border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-base font-semibold mb-1">{char.name}</h3>
                        <p className="text-sm text-gray-600">{char.description}</p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => openEditCharacter(char)}
                          className="text-gray-400 hover:text-gray-700 text-xs"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => handleDeleteCharacter(char.id)}
                          className="text-gray-400 hover:text-red-500 text-xs"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2 text-xs">
                      {char.gender && (
                        <div className="flex">
                          <span className="text-gray-400 w-12">性别</span>
                          <span className="text-gray-600">{char.gender}</span>
                        </div>
                      )}
                      {char.age && (
                        <div className="flex">
                          <span className="text-gray-400 w-12">年龄</span>
                          <span className="text-gray-600">{char.age}</span>
                        </div>
                      )}
                      {char.occupation && (
                        <div className="flex">
                          <span className="text-gray-400 w-12">职业</span>
                          <span className="text-gray-600">{char.occupation}</span>
                        </div>
                      )}
                      {char.personality && (
                        <div className="flex">
                          <span className="text-gray-400 w-12">性格</span>
                          <span className="text-gray-600">{char.personality}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* 总览 */}
        {activeNav === "overview" && (
          <>
            <div className="mb-10">
              <h1 className="text-2xl font-bold mb-2">城市边缘</h1>
              <p className="text-sm text-gray-500">一个外卖骑手在送餐途中意外卷入一场城市阴谋</p>
            </div>

            {/* 统计 - 动态计算 */}
            <div className="flex gap-6 mb-10 pb-6 border-b border-gray-100">
              <div>
                <div className="text-xl font-bold">{chapters.length}</div>
                <div className="text-xs text-gray-400 mt-0.5">总章节</div>
              </div>
              <div>
                <div className="text-xl font-bold">
                  {chapters.reduce((sum, ch) => {
                    const match = ch.words.match(/\d+/);
                    return sum + (match ? parseInt(match[0]) * (ch.status === "k" ? 1000 : 1) : 0);
                  }, 0).toLocaleString()}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">总字数</div>
              </div>
              <div>
                <div className="text-xl font-bold">{characters.length}</div>
                <div className="text-xs text-gray-400 mt-0.5">角色</div>
              </div>
              <div>
                <div className="text-xl font-bold">2天前</div>
                <div className="text-xs text-gray-400 mt-0.5">最后编辑</div>
              </div>
            </div>

            {/* 创作进度 - 动态计算 */}
            <div className="mb-10">
              <div className="text-sm font-semibold mb-3">创作进度</div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2 flex">
                <div
                  className="h-full bg-[#111]"
                  style={{ width: `${(chapters.filter(c => c.status === "done").length / chapters.length * 100)}%` }}
                />
                <div
                  className="h-full bg-green-400"
                  style={{ width: `${(chapters.filter(c => c.status === "expanded").length / chapters.length * 100)}%` }}
                />
                <div
                  className="h-full bg-yellow-400"
                  style={{ width: `${(chapters.filter(c => c.status === "skeleton").length / chapters.length * 100)}%` }}
                />
                <div
                  className="h-full bg-gray-200"
                  style={{ width: `${(chapters.filter(c => c.status === "empty").length / chapters.length * 100)}%` }}
                />
              </div>
              <div className="flex gap-4 text-xs text-gray-400">
                <span><span className="inline-block w-2 h-2 rounded-full bg-[#111] mr-1"></span>已完成 {chapters.filter(c => c.status === "done").length}章</span>
                <span><span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-1"></span>已扩写 {chapters.filter(c => c.status === "expanded").length}章</span>
                <span><span className="inline-block w-2 h-2 rounded-full bg-yellow-400 mr-1"></span>骨架已写 {chapters.filter(c => c.status === "skeleton").length}章</span>
                <span><span className="inline-block w-2 h-2 rounded-full border border-gray-300 mr-1"></span>未开始 {chapters.filter(c => c.status === "empty").length}章</span>
              </div>
            </div>

            {/* 快捷操作 */}
            <div>
              <div className="text-sm font-semibold mb-3">快捷操作</div>
              <div className="flex flex-wrap gap-2.5">
                <button onClick={() => window.location.href = "/"} className="flex items-center gap-1.5 px-4.5 py-2.5 border border-gray-200 rounded-lg text-sm hover:border-gray-300 hover:bg-gray-50">
                  <span>✏</span> 继续创作第四章
                </button>
                <button onClick={() => setActiveNav("characters")} className="flex items-center gap-1.5 px-4.5 py-2.5 border border-gray-200 rounded-lg text-sm hover:border-gray-300 hover:bg-gray-50">
                  <span>👥</span> 管理角色
                </button>
                <button onClick={() => setActiveNav("world")} className="flex items-center gap-1.5 px-4.5 py-2.5 border border-gray-200 rounded-lg text-sm hover:border-gray-300 hover:bg-gray-50">
                  <span>🌍</span> 编辑世界观
                </button>
                <button onClick={() => alert("导出全文功能开发中")} className="flex items-center gap-1.5 px-4.5 py-2.5 border border-gray-200 rounded-lg text-sm hover:border-gray-300 hover:bg-gray-50">
                  <span>↑</span> 导出全文
                </button>
              </div>
            </div>
          </>
        )}

        {/* 世界观和风格预设（暂未实现） */}
        {(activeNav === "world" || activeNav === "styles") && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">{activeNav === "world" ? "🌍" : "✏"}</div>
            <div className="text-gray-500 mb-4">{activeNav === "world" ? "世界观" : "风格预设"}功能开发中</div>
          </div>
        )}
      </main>

      {/* 角色编辑模态框 */}
      {showCharacterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowCharacterModal(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
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
            </div>
            <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={() => {
                  setShowCharacterModal(false);
                  setCharacterForm({ name: "", description: "", gender: "", age: "", occupation: "", personality: "" });
                }}
                className="px-5 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleSaveCharacter}
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