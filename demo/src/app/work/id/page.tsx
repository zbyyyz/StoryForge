"use client";

import { useState } from "react";
import Link from "next/link";

interface Chapter {
  id: string;
  title: string;
  status: "empty" | "skeleton" | "expanded" | "done";
  words: string;
}

const INITIAL_CHAPTERS: Chapter[] = [
  { id: "1", title: "第一章：深夜订单", status: "done", words: "3,200字" },
  { id: "2", title: "第二章：目击", status: "done", words: "4,100字" },
  { id: "3", title: "第三章：追杀", status: "expanded", words: "2,800字" },
  { id: "4", title: "第四章：线索", status: "skeleton", words: "骨架已写" },
  { id: "5", title: "第五章：同盟", status: "empty", words: "未开始" },
  { id: "6", title: "第六章：真相", status: "empty", words: "未开始" },
];

export default function WorkManagePage() {
  const [showAddChapter, setShowAddChapter] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [chapters, setChapters] = useState<Chapter[]>(INITIAL_CHAPTERS);

  const navItems = [
    { id: "overview", label: "总览", icon: "🏠", href: "/work/id" },
    { id: "characters", label: "角色库", icon: "👥", href: "/work/id/characters" },
    { id: "world", label: "世界观", icon: "🌍", href: "/work/id/world" },
    { id: "styles", label: "风格预设", icon: "✏", href: "/work/id/styles" },
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
  };

  const handleDeleteChapter = (id: string) => {
    if (confirm("确定要删除这个章节吗？")) {
      setChapters(chapters.filter(c => c.id !== id));
    }
  };

  return (
    <div className="flex min-h-screen bg-white text-[#111]">
      {/* 左侧边栏 */}
      <aside className="w-[280px] border-r border-gray-100 flex flex-col h-screen fixed left-0 top-0">
        <div className="px-5 py-5 border-b border-gray-100">
          <Link href="/home" className="text-sm text-gray-500 hover:text-gray-900 mb-3 block">← 返回工作台</Link>
          <div className="text-lg font-bold mb-1">城市边缘</div>
          <div className="text-xs text-gray-400">现代都市 · 悬疑推理</div>
        </div>

        <nav className="px-3 py-4 flex flex-col gap-1">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${item.id === "overview" ? "bg-gray-50 text-gray-900 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-gray-300">章节</div>
        <div className="flex-1 overflow-y-auto px-3 pb-3">
          {chapters.map((chapter) => (
            <div key={chapter.id} className="group">
              <div className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors cursor-pointer hover:bg-gray-50">
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
                    onClick={() => handleDeleteChapter(chapter.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 text-xs px-1"
                  >
                    ✕
                  </button>
                )}
              </div>
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

      {/* 主内容 - 总览 */}
      <main className="flex-1 ml-[280px] px-10 py-10 max-w-[800px]">
        <div className="mb-10">
          <h1 className="text-2xl font-bold mb-2">城市边缘</h1>
          <p className="text-sm text-gray-500">一个外卖骑手在送餐途中意外卷入一场城市阴谋</p>
        </div>

        {/* 统计 */}
        <div className="flex gap-6 mb-10 pb-6 border-b border-gray-100">
          <div>
            <div className="text-xl font-bold">{chapters.length}</div>
            <div className="text-xs text-gray-400 mt-0.5">总章节</div>
          </div>
          <div>
            <div className="text-xl font-bold">
              {chapters.reduce((sum, ch) => {
                const match = ch.words.match(/\d+/);
                return sum + (match ? parseInt(match[0]) : 0);
              }, 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">总字数</div>
          </div>
          <div>
            <div className="text-xl font-bold">3</div>
            <div className="text-xs text-gray-400 mt-0.5">角色</div>
          </div>
          <div>
            <div className="text-xl font-bold">2天前</div>
            <div className="text-xs text-gray-400 mt-0.5">最后编辑</div>
          </div>
        </div>

        {/* 创作进度 */}
        <div className="mb-10">
          <div className="text-sm font-semibold mb-3">创作进度</div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2 flex">
            <div className="h-full bg-[#111]" style={{ width: `${(chapters.filter(c => c.status === "done").length / chapters.length * 100)}%` }} />
            <div className="h-full bg-green-400" style={{ width: `${(chapters.filter(c => c.status === "expanded").length / chapters.length * 100)}%` }} />
            <div className="h-full bg-yellow-400" style={{ width: `${(chapters.filter(c => c.status === "skeleton").length / chapters.length * 100)}%` }} />
            <div className="h-full bg-gray-200" style={{ width: `${(chapters.filter(c => c.status === "empty").length / chapters.length * 100)}%` }} />
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
            <a href="/work/id/editor" className="flex items-center gap-1.5 px-4.5 py-2.5 border border-gray-200 rounded-lg text-sm hover:border-gray-300 hover:bg-gray-50">
              <span>✏</span> 继续创作第四章
            </a>
            <a href="/work/id/characters" className="flex items-center gap-1.5 px-4.5 py-2.5 border border-gray-200 rounded-lg text-sm hover:border-gray-300 hover:bg-gray-50">
              <span>👥</span> 管理角色
            </a>
            <a href="/work/id/world" className="flex items-center gap-1.5 px-4.5 py-2.5 border border-gray-200 rounded-lg text-sm hover:border-gray-300 hover:bg-gray-50">
              <span>🌍</span> 编辑世界观
            </a>
            <button className="flex items-center gap-1.5 px-4.5 py-2.5 border border-gray-200 rounded-lg text-sm hover:border-gray-300 hover:bg-gray-50">
              <span>↑</span> 导出全文
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}