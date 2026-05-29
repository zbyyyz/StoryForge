"use client";

import { useState } from "react";

interface Character {
  name: string;
  description: string;
}

const STYLES = [
  { id: "modern", name: "现代都市" },
  { id: "wuxia", name: "金庸武侠" },
  { id: "literary", name: "纯文学" },
  { id: "lightnovel", name: "轻小说" },
  { id: "romance", name: "古风言情" },
];

const DETAILS = [
  { id: "concise", name: "简洁" },
  { id: "moderate", name: "适中" },
  { id: "detailed", name: "细腻" },
];

const WORLD_TYPES = [
  "现代都市", "古风仙侠", "西方奇幻", "科幻未来", "校园青春", "历史架空", "悬疑推理",
];

export default function Home() {
  const [skeleton, setSkeleton] = useState("");
  const [result, setResult] = useState("");
  const [style, setStyle] = useState("modern");
  const [detail, setDetail] = useState("moderate");
  const [worldType, setWorldType] = useState("");
  const [characters, setCharacters] = useState<Character[]>([]);
  const [newCharName, setNewCharName] = useState("");
  const [newCharDesc, setNewCharDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"skeleton" | "result">("skeleton");
  const [refining, setRefining] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  async function handleExpand() {
    if (!skeleton.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/expand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skeleton, detail, style, characters, worldType }),
      });
      const data = await res.json();
      setResult(data.content);
      setView("result");
    } catch {
      alert("扩写失败，请检查网络或API配置");
    } finally {
      setLoading(false);
    }
  }

  async function handleRefine(action: string) {
    const selection = window.getSelection();
    const text = selection?.toString();
    if (!text) return;

    setRefining(true);
    try {
      const res = await fetch("/api/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, action, context: result }),
      });
      const data = await res.json();
      setResult(result.replace(text, data.content));
    } catch {
      alert("修改失败，请重试");
    } finally {
      setRefining(false);
    }
  }

  function addCharacter() {
    if (!newCharName.trim()) return;
    setCharacters([...characters, { name: newCharName, description: newCharDesc }]);
    setNewCharName("");
    setNewCharDesc("");
  }

  function removeCharacter(index: number) {
    setCharacters(characters.filter((_, i) => i !== index));
  }

  // PLACEHOLDER_RENDER_RETURN
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="border-b bg-white px-6 py-3 flex items-center justify-between shrink-0">
        <h1 className="text-xl font-bold">StoryForge</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50"
          >
            {showSettings ? "隐藏设定" : "角色/世界观"}
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView("skeleton")}
              className={`px-3 py-1.5 text-sm rounded-lg ${view === "skeleton" ? "bg-blue-600 text-white" : "border hover:bg-gray-50"}`}
            >
              骨架
            </button>
            <button
              onClick={() => setView("result")}
              disabled={!result}
              className={`px-3 py-1.5 text-sm rounded-lg ${view === "result" ? "bg-blue-600 text-white" : "border hover:bg-gray-50"} disabled:opacity-40`}
            >
              成文
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Settings Panel */}
        {showSettings && (
          <aside className="w-72 border-r bg-white p-4 overflow-y-auto shrink-0">
            {/* World Type */}
            <div className="mb-6">
              <h3 className="font-medium mb-2 text-sm">世界观类型</h3>
              <div className="flex flex-wrap gap-1.5">
                {WORLD_TYPES.map((w) => (
                  <button
                    key={w}
                    onClick={() => setWorldType(worldType === w ? "" : w)}
                    className={`px-2 py-1 text-xs rounded-md ${worldType === w ? "bg-blue-100 text-blue-700 border-blue-300" : "bg-gray-100 hover:bg-gray-200"} border`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            {/* Characters */}
            <div>
              <h3 className="font-medium mb-2 text-sm">角色</h3>
              {characters.map((c, i) => (
                <div key={i} className="mb-2 p-2 bg-gray-50 rounded-lg text-sm flex justify-between items-start">
                  <div>
                    <span className="font-medium">{c.name}</span>
                    {c.description && <p className="text-gray-500 text-xs mt-0.5">{c.description}</p>}
                  </div>
                  <button onClick={() => removeCharacter(i)} className="text-gray-400 hover:text-red-500 text-xs">删除</button>
                </div>
              ))}
              <div className="mt-2 space-y-1.5">
                <input
                  value={newCharName}
                  onChange={(e) => setNewCharName(e.target.value)}
                  placeholder="角色名"
                  className="w-full px-2 py-1.5 text-sm border rounded-md"
                />
                <input
                  value={newCharDesc}
                  onChange={(e) => setNewCharDesc(e.target.value)}
                  placeholder="一句话描述（选填）"
                  className="w-full px-2 py-1.5 text-sm border rounded-md"
                />
                <button onClick={addCharacter} className="w-full py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md">
                  + 添加角色
                </button>
              </div>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {view === "skeleton" ? (
            /* Skeleton Editor */
            <div className="flex-1 flex flex-col p-6">
              <textarea
                value={skeleton}
                onChange={(e) => setSkeleton(e.target.value)}
                placeholder="在这里写下你的故事骨架...&#10;&#10;例如：李明走进咖啡馆，看到前女友坐在角落。他犹豫了一下，还是走过去打招呼。她抬头看到他，表情先是惊讶，然后恢复平静。两人尴尬地寒暄了几句，李明注意到她手上没有戒指了。"
                className="flex-1 w-full p-4 text-base leading-relaxed border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {/* Controls */}
              <div className="mt-4 flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">风格：</span>
                  {STYLES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setStyle(s.id)}
                      className={`px-2.5 py-1 text-xs rounded-md border ${style === s.id ? "bg-blue-100 text-blue-700 border-blue-300" : "hover:bg-gray-100"}`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">详细程度：</span>
                  {DETAILS.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setDetail(d.id)}
                      className={`px-2.5 py-1 text-xs rounded-md border ${detail === d.id ? "bg-green-100 text-green-700 border-green-300" : "hover:bg-gray-100"}`}
                    >
                      {d.name}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleExpand}
                  disabled={loading || !skeleton.trim()}
                  className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
                >
                  {loading ? "扩写中..." : "开始扩写"}
                </button>
              </div>
            </div>
          ) : (
            /* Result View */
            <div className="flex-1 flex flex-col p-6 overflow-hidden">
              <div className="flex items-center gap-2 mb-3 shrink-0">
                <span className="text-sm text-gray-500">选中文字后可进行局部微调：</span>
                <button onClick={() => handleRefine("expand")} disabled={refining} className="px-2.5 py-1 text-xs border rounded-md hover:bg-gray-100 disabled:opacity-50">展开更多</button>
                <button onClick={() => handleRefine("compress")} disabled={refining} className="px-2.5 py-1 text-xs border rounded-md hover:bg-gray-100 disabled:opacity-50">压缩</button>
                <button onClick={() => handleRefine("rewrite")} disabled={refining} className="px-2.5 py-1 text-xs border rounded-md hover:bg-gray-100 disabled:opacity-50">换一种写法</button>
                {refining && <span className="text-xs text-blue-600">处理中...</span>}
              </div>
              <div
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => setResult(e.currentTarget.innerText)}
                className="flex-1 w-full p-4 text-base leading-relaxed border rounded-xl overflow-y-auto focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: result.replace(/\n/g, "<br>") }}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
