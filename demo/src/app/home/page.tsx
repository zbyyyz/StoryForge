"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Work {
  id: string;
  title: string;
  type: string;
  color: string;
  createdAt: string;
}

const COLORS = ["#6366f1", "#ec4899", "#06b6d4", "#f59e0b", "#10b981", "#8b5cf6"];

function getWorks(): Work[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("storyforge_works") || "[]");
  } catch { return []; }
}

function deleteFromStorage(key: string, workId: string) {
  try {
    const data = JSON.parse(localStorage.getItem(key) || "[]");
    const filtered = data.filter((item: { workId?: string }) => item.workId !== workId);
    localStorage.setItem(key, JSON.stringify(filtered));
  } catch { /* ignore */ }
}

const DEMO_WORKS = [
  { id: "demo-1", title: "城市边缘", type: "现代都市", time: "1天前", color: "#ec4899", progress: "3/6", words: "1k字" },
];

const ASSETS = [
  { type: "世界观", name: "赛博朋克2099", desc: "完整赛博朋克设定", downloads: "1.2k" },
  { type: "风格预设", name: "村上春树风", desc: "孤独感、意识流", downloads: "2.1k" },
  { type: "完整包", name: "修仙世界全套", desc: "世界观+角色+预设", downloads: "3.5k" },
];

const THEMES = [
  { id: "minimal", name: "晨雾白", color: "#111" },
  { id: "clay", name: "暖陶灰", color: "#a89279" },
  { id: "retro", name: "荧光终端", color: "#00ff88" },
  { id: "glass", name: "静夜蓝", color: "#16213e" },
];

export default function HomePage() {
  const [theme, setTheme] = useState("minimal");
  const [showThemePanel, setShowThemePanel] = useState(false);
  const [works, setWorks] = useState<Work[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<Work | null>(null);
  const [deleteOptions, setDeleteOptions] = useState({ chapters: true, characters: false, worldview: false, styles: false });

  useEffect(() => { setWorks(getWorks()); }, []);

  const handleDelete = () => {
    if (!deleteTarget) return;
    const remaining = works.filter(w => w.id !== deleteTarget.id);
    localStorage.setItem("storyforge_works", JSON.stringify(remaining));
    if (deleteOptions.chapters) deleteFromStorage("storyforge_chapters", deleteTarget.id);
    if (deleteOptions.characters) {
      // Detach global characters (don't delete them from global store)
      // Characters referenced by this work remain in global store for reuse
    }
    if (deleteOptions.worldview) {
      try {
        // If work has worldviewId, delete from global worldviews
        const raw = localStorage.getItem("storyforge_works");
        const allWorks = raw ? JSON.parse(raw) : [];
        const target = allWorks.find((w: { id: string }) => w.id === deleteTarget.id);
        if (target?.worldviewId) {
          const wvs = JSON.parse(localStorage.getItem("storyforge_worldviews") || "[]");
          localStorage.setItem("storyforge_worldviews", JSON.stringify(wvs.filter((w: { id: string }) => w.id !== target.worldviewId)));
        }
      } catch { /* ignore */ }
    }
    setWorks(remaining);
    setDeleteTarget(null);
    setDeleteOptions({ chapters: true, characters: false, worldview: false, styles: false });
  };

  const timeAgo = (dateStr: string) => {
    if (!dateStr) return "";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "刚刚";
    if (mins < 60) return `${mins}分钟前`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}小时前`;
    const days = Math.floor(hours / 24);
    return `${days}天前`;
  };

  const themeClasses = {
    minimal: "bg-white text-[#111]",
    clay: "bg-[#e8e4df] text-[#3d3832]",
    retro: "bg-[#0a0a0f] text-[#00ff88] font-mono",
    glass: "bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white",
  };

  return (
    <div className={`min-h-screen transition-colors ${themeClasses[theme as keyof typeof themeClasses]}`}>
      {/* 主题切换按钮 */}
      <button
        onClick={() => setShowThemePanel(!showThemePanel)}
        className="fixed bottom-5 right-5 z-50 h-10 px-4 rounded-full border border-gray-300 bg-white hover:bg-gray-50 shadow-lg flex items-center gap-2 text-sm"
      >
        <span className="text-base">◐</span> 主题
      </button>

      {/* 主题面板 */}
      {showThemePanel && (
        <div className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-[600px] max-w-[90vw] bg-white rounded-t-2xl shadow-2xl p-5 z-40 border border-gray-200 border-b-0 ${theme === "retro" ? "text-[#00ff88]" : ""}`}>
          <h3 className={`text-sm font-semibold mb-3 ${theme === "retro" ? "text-[#00ff88]" : "text-gray-600"}`}>选择主题</h3>
          <div className="flex flex-wrap gap-2.5">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`px-4 py-2 border rounded-full text-sm transition-all flex items-center gap-1.5 ${
                  theme === t.id
                    ? "border-[#111] bg-gray-100 font-semibold"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                {t.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 头部 */}
      <header className="px-10 py-5 flex items-center justify-between">
        <button onClick={() => window.location.reload()} className={`text-xl font-extrabold tracking-tight ${theme === "retro" ? "text-[#00ff88] drop-shadow-[0_0_10px_rgba(0,255,136,0.33)]" : ""}`}>
          StoryForge
        </button>
        <div className="flex items-center gap-6">
          <button onClick={() => alert("资产市场功能开发中")} className="text-sm cursor-pointer opacity-60 hover:opacity-100">资产市场</button>
          <button onClick={() => alert("我的收藏功能开发中")} className="text-sm cursor-pointer opacity-60 hover:opacity-100">我的收藏</button>
          <div className="w-7 h-7 rounded-full bg-[#111] text-white text-xs flex items-center justify-center cursor-pointer hover:opacity-80">
            N
          </div>
        </div>
      </header>

      {/* 主内容 */}
      <main className="max-w-[1000px] mx-auto px-10 py-5 pb-20">
        {/* Hero */}
        <div className={`py-12 mb-12 ${theme === "retro" ? "border-b border-[#1a3a2a]" : "border-b border-gray-100"}`}>
          <h2 className="text-3xl font-bold mb-3 tracking-tight">继续你的故事</h2>
          <p className={`text-base mb-6 ${theme === "minimal" ? "opacity-50" : theme === "retro" ? "opacity-70" : theme === "glass" ? "opacity-80" : "opacity-60"}`}>
            把脑中的画面变成文字，AI为你补齐笔力。
          </p>
          <div className="flex gap-3">
            <Link href="/work/new" className="px-6 py-2.5 rounded-lg text-sm font-medium bg-[#111] text-white hover:bg-[#333]">
              新建作品
            </Link>
            <Link href="/templates" className={`px-6 py-2.5 rounded-lg text-sm font-medium bg-transparent border ${theme === "retro" ? "border-[#00ff88] text-[#00ff88]" : theme === "glass" ? "border-white/30 text-white/70" : "border-gray-300 text-gray-700"}`}>
              从模板开始
            </Link>
          </div>
        </div>

        {/* 最近作品 */}
        <div className="mb-12">
          <div className={`text-xs font-semibold uppercase tracking-wider mb-4 flex justify-between items-center ${theme === "glass" ? "text-white/50" : theme === "retro" ? "text-[#00ff88]" : "opacity-40"}`}>
            最近作品
            <button onClick={() => alert("全部作品功能开发中")} className="text-xs font-normal capitalize tracking-normal cursor-pointer">全部作品</button>
          </div>
          <div className={theme === "clay" ? "bg-[#ece8e3] rounded-xl px-5 py-2 shadow-inner" : ""}>
            {works.length === 0 && DEMO_WORKS.map((work) => (
              <Link
                key={work.id}
                href="/work/id"
                className="w-full flex items-center py-4 border-b hover:opacity-80 transition-opacity"
                style={{ borderColor: theme === "minimal" ? "#f5f5f5" : theme === "clay" ? "#d9d4ce" : theme === "retro" ? "#1a3a2a" : "rgba(255,255,255,0.06)" }}
              >
                <div className="w-1 h-10 rounded-sm mr-4" style={{ backgroundColor: work.color }} />
                <div className="flex-1 text-left">
                  <div className="text-base font-semibold mb-1">{work.title}</div>
                  <div className={`text-xs ${theme === "glass" ? "opacity-60" : "opacity-40"}`}>{work.type} · {work.time}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{work.progress}</div>
                  <div className={`text-xs ${theme === "glass" ? "opacity-60" : "opacity-40"}`}>{work.words}</div>
                </div>
              </Link>
            ))}
            {works.map((work) => (
              <div
                key={work.id}
                className="w-full flex items-center py-4 border-b hover:opacity-80 transition-opacity group"
                style={{ borderColor: theme === "minimal" ? "#f5f5f5" : theme === "clay" ? "#d9d4ce" : theme === "retro" ? "#1a3a2a" : "rgba(255,255,255,0.06)" }}
              >
                <Link href={`/work/id`} onClick={() => localStorage.setItem("storyforge_active_work", work.id)} className="flex items-center flex-1">
                  <div className="w-1 h-10 rounded-sm mr-4" style={{ backgroundColor: work.color || COLORS[works.indexOf(work) % COLORS.length] }} />
                  <div className="flex-1 text-left">
                    <div className="text-base font-semibold mb-1">{work.title || "未命名作品"}</div>
                    <div className={`text-xs ${theme === "glass" ? "opacity-60" : "opacity-40"}`}>{work.type || "未分类"} · {timeAgo(work.createdAt)}</div>
                  </div>
                </Link>
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDeleteTarget(work); }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-red-400 hover:text-red-600 px-3 py-1"
                >
                  删除
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 推荐资产 */}
        <div>
          <div className={`text-xs font-semibold uppercase tracking-wider mb-4 flex justify-between items-center ${theme === "glass" ? "text-white/50" : theme === "retro" ? "text-[#00ff88]" : "opacity-40"}`}>
            推荐资产
            <button onClick={() => alert("浏览全部资产功能开发中")} className="text-xs font-normal capitalize tracking-normal cursor-pointer">浏览全部</button>
          </div>
          <div className="grid grid-cols-3 gap-px rounded-xl overflow-hidden" style={{ backgroundColor: theme === "minimal" ? "#f0f0f0" : theme === "clay" ? "#ddd8d2" : theme === "retro" ? "#0f1a14" : "rgba(255,255,255,0.02)" }}>
            {ASSETS.map((asset, i) => (
              <button
                key={i}
                onClick={() => alert(`获取资产: ${asset.name}`)}
                className={`p-5 text-left hover:opacity-80 transition-opacity ${theme === "minimal" ? "bg-white" : theme === "clay" ? "bg-[#e8e4df]" : theme === "retro" ? "bg-[#0a0a0f] border border-[#1a3a2a]" : "bg-white/3"}`}
              >
                <div className={`text-[10px] font-semibold uppercase tracking-wide mb-2 ${theme === "glass" ? "opacity-50" : "opacity-50"}`}>
                  {asset.type}
                </div>
                <div className="text-sm font-semibold mb-1">{asset.name}</div>
                <div className={`text-xs leading-relaxed mb-2.5 ${theme === "glass" ? "opacity-60" : "opacity-50"}`}>
                  {asset.desc}
                </div>
                <div className={`text-xs ${theme === "glass" ? "opacity-30" : "opacity-30"}`}>{asset.downloads} 获取</div>
              </button>
            ))}
          </div>
        </div>

        {/* 删除确认弹窗 */}
        {deleteTarget && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setDeleteTarget(null)}>
            <div className="bg-white rounded-2xl p-6 w-[400px] shadow-xl" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-gray-900 mb-2">删除「{deleteTarget.title || "未命名作品"}」</h3>
              <p className="text-sm text-gray-500 mb-4">请选择要一并删除的关联数据：</p>
              <div className="space-y-2 mb-6">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={deleteOptions.chapters} onChange={e => setDeleteOptions({...deleteOptions, chapters: e.target.checked})} className="rounded" />
                  章节内容
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={deleteOptions.characters} onChange={e => setDeleteOptions({...deleteOptions, characters: e.target.checked})} className="rounded" />
                  角色库
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={deleteOptions.worldview} onChange={e => setDeleteOptions({...deleteOptions, worldview: e.target.checked})} className="rounded" />
                  世界观
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={deleteOptions.styles} onChange={e => setDeleteOptions({...deleteOptions, styles: e.target.checked})} className="rounded" />
                  风格预设
                </label>
              </div>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
                <button onClick={handleDelete} className="px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600">确认删除</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}