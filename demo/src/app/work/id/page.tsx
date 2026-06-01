"use client";

import { useState } from "react";

interface Chapter {
  id: string;
  title: string;
  status: "empty" | "skeleton" | "expanded" | "done";
  words: string;
}

const CHAPTERS: Chapter[] = [
  { id: "1", title: "第一章：深夜订单", status: "done", words: "3,200字" },
  { id: "2", title: "第二章：目击", status: "done", words: "4,100字" },
  { id: "3", title: "第三章：追杀", status: "expanded", words: "2,800字" },
  { id: "4", title: "第四章：线索", status: "skeleton", words: "骨架已写" },
  { id: "5", title: "第五章：同盟", status: "empty", words: "未开始" },
  { id: "6", title: "第六章：真相", status: "empty", words: "未开始" },
];

export default function WorkManagePage() {
  const [activeNav, setActiveNav] = useState("overview");
  const [activeChapter, setActiveChapter] = useState("1");

  const navItems = [
    { id: "overview", label: "总览", icon: "🏠" },
    { id: "characters", label: "角色库", icon: "👥" },
    { id: "world", label: "世界观", icon: "🌍" },
    { id: "styles", label: "风格预设", icon: "✏" },
  ];

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
              onClick={() => alert(`${item.label}功能开发中`)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${activeNav === item.id ? "bg-gray-50 text-gray-900 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-gray-300">章节</div>
        <div className="flex-1 overflow-y-auto px-3 pb-3">
          {CHAPTERS.map((chapter) => (
            <button
              key={chapter.id}
              onClick={() => window.location.href = "/"}
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
            </button>
          ))}
          <button onClick={() => alert("新增章节功能开发中")} className="w-full flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-gray-50 hover:text-gray-600">
            <span>+</span> 新增章节
          </button>
        </div>
      </aside>

      {/* 主内容 */}
      <main className="flex-1 ml-[280px] px-10 py-10 max-w-[800px]">
        <div className="mb-10">
          <h1 className="text-2xl font-bold mb-2">城市边缘</h1>
          <p className="text-sm text-gray-500">一个外卖骑手在送餐途中意外卷入一场城市阴谋</p>
        </div>

        {/* 统计 */}
        <div className="flex gap-6 mb-10 pb-6 border-b border-gray-100">
          <div>
            <div className="text-xl font-bold">6</div>
            <div className="text-xs text-gray-400 mt-0.5">总章节</div>
          </div>
          <div>
            <div className="text-xl font-bold">10,100</div>
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
            <div className="h-full bg-[#111]" style={{ width: "33.3%" }} />
            <div className="h-full bg-green-400" style={{ width: "16.7%" }} />
            <div className="h-full bg-yellow-400" style={{ width: "16.7%" }} />
            <div className="h-full bg-gray-200" style={{ width: "33.3%" }} />
          </div>
          <div className="flex gap-4 text-xs text-gray-400">
            <span><span className="inline-block w-2 h-2 rounded-full bg-[#111] mr-1"></span>已完成 2章</span>
            <span><span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-1"></span>已扩写 1章</span>
            <span><span className="inline-block w-2 h-2 rounded-full bg-yellow-400 mr-1"></span>骨架已写 1章</span>
            <span><span className="inline-block w-2 h-2 rounded-full border border-gray-300 mr-1"></span>未开始 2章</span>
          </div>
        </div>

        {/* 快捷操作 */}
        <div>
          <div className="text-sm font-semibold mb-3">快捷操作</div>
          <div className="flex flex-wrap gap-2.5">
            <button onClick={() => window.location.href = "/"} className="flex items-center gap-1.5 px-4.5 py-2.5 border border-gray-200 rounded-lg text-sm hover:border-gray-300 hover:bg-gray-50">
              <span>✏</span> 继续创作第四章
            </button>
            <button onClick={() => alert("管理角色功能开发中")} className="flex items-center gap-1.5 px-4.5 py-2.5 border border-gray-200 rounded-lg text-sm hover:border-gray-300 hover:bg-gray-50">
              <span>👥</span> 管理角色
            </button>
            <button onClick={() => alert("编辑世界观功能开发中")} className="flex items-center gap-1.5 px-4.5 py-2.5 border border-gray-200 rounded-lg text-sm hover:border-gray-300 hover:bg-gray-50">
              <span>🌍</span> 编辑世界观
            </button>
            <button onClick={() => alert("导出全文功能开发中")} className="flex items-center gap-1.5 px-4.5 py-2.5 border border-gray-200 rounded-lg text-sm hover:border-gray-300 hover:bg-gray-50">
              <span>↑</span> 导出全文
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}