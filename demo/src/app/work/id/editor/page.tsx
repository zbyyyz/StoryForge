"use client";

import { useState, useRef, useEffect } from "react";
import { getActivePreset } from "@/app/lib/style-presets";

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

const INITIAL_SKELETON = `陈默回到出租屋，反复回想追杀过程中那个人喊出的名字——"周远"。他打开手机搜索，发现周远是本市一家物流公司的老板，三个月前因为一起交通事故上过本地新闻。

他犹豫要不要报警。但追杀他的人明显训练有素，如果对方有背景，报警可能反而暴露自己。他决定先自己查一查。

第二天送餐时，他特意绕路经过那家物流公司。公司外表普通，但他注意到停车场有几辆挂着外地牌照的黑色商务车。

晚上回家，门口放着一个没有署名的快递盒。打开后里面是一部新手机和一张纸条："别查了，这是你的补偿。"手机里预存了五万块的转账记录。`;

const INITIAL_EXPANDED = `陈默把电动车停在楼下，摘下头盔时手还在微微发抖。他没有走正门，而是绕到侧面的消防通道，确认身后没有人跟着，才快步上了楼。

出租屋里一片漆黑。他没有开灯，靠着门坐在地上，大口喘着气。窗外霓虹灯的光透过薄窗帘打进来，在对面墙上投下忽明忽暗的色块。

那个名字在他脑子里反复回响——"周远"。追杀他的人在混乱中喊出的那两个字，像一把钥匙，指向某个他还看不清全貌的房间。

他掏出手机，手指在搜索框里打下"周远"两个字。屏幕的蓝光照亮他紧绷的脸。搜索结果很快出来了：周远，四十三岁，鼎盛物流有限公司法人代表。三个月前，一辆挂着公司名的货车在城南高架发生追尾事故，司机当场死亡。新闻配图里，他穿着深色西装，表情平静得近乎冷漠。

陈默盯着那张脸看了很久。这就是那些人要保护的人？一个物流公司老板，值得派出训练有素的打手灭口？

他想过报警。但那些人的身手、那些人的装备、那些人追杀时的从容——这不是普通的黑社会。如果周远背后有更大的东西，报警可能只是把自己送到明面上。

他决定先自己查。

第二天中午，他接了一单送往城东工业区的外卖。他特意选了这一单——鼎盛物流的总部就在那片区域。骑车经过时，他放慢了速度。

公司大楼外表普通，灰色的六层建筑，门口挂着褪色的招牌。但停车场里停着四辆黑色别克商务车，清一色的外地牌照，车窗贴着深色膜，看不见里面。

一个物流公司，需要这么多外地来的商务车？

晚上九点多，陈默拖着疲惫的身体回到出租屋。走到门口时，他停住了。门前的地垫上放着一个快递盒，没有寄件人信息，收件人写着"陈先生"。

他蹲下来看了很久，没有马上碰它。最终他还是把盒子拿进了屋里，用水果刀小心地划开封条。

里面是一部全新的手机，还有一张折叠的纸条。纸条上只有一行字，打印体，没有签名："别查了，这是你的补偿。"

他打开手机。屏幕亮起来，没有锁屏密码。只有一条银行转账通知：收到转账50,000元。

陈默握着手机坐在床边，很长时间没有动。五万块。这是他骑半年外卖才能挣到的数字。`;

const INSPIRATION_SUGGESTIONS = [
  { id: "1", text: "陈默没有收下手机，而是通过快递盒上的物流单号反向追踪寄件地址，发现指向城郊一个废弃仓库。", tag: "推进调查" },
  { id: "2", text: "他把手机交给做IT的老同学分析，发现手机里除了转账记录，还有一段被删除但可恢复的通话录音。", tag: "引入盟友" },
  { id: "3", text: "第二天送餐时，他发现有人在跟踪自己。对方并不隐藏，似乎在观察他是否收了\"补偿\"后安分下来。", tag: "升级威胁" },
  { id: "4", text: "陈默在新闻里看到周远的物流公司刚中标了一个政府项目，他意识到这件事牵涉的层级可能比想象中高得多。", tag: "扩大格局" },
];

export default function EditorPage() {
  const [activeChapter, setActiveChapter] = useState("4");
  const [chapters, setChapters] = useState<Chapter[]>(INITIAL_CHAPTERS);
  const [viewMode, setViewMode] = useState<"skeleton" | "expanded" | "compare">("skeleton");
  const [skeletonContent, setSkeletonContent] = useState(INITIAL_SKELETON);
  const [expandedContent, setExpandedContent] = useState(INITIAL_EXPANDED);
  const [detailLevel, setDetailLevel] = useState<"简洁" | "适中" | "细腻">("适中");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [showInspirePanel, setShowInspirePanel] = useState(false);
  const [inspireSuggestions, setInspireSuggestions] = useState(INSPIRATION_SUGGESTIONS);
  const [isInspireLoading, setIsInspireLoading] = useState(false);
  const [showRefineToolbar, setShowRefineToolbar] = useState(false);
  const [refineToolbarPosition, setRefineToolbarPosition] = useState({ x: 0, y: 0 });
  const [isRefining, setIsRefining] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);
  const [selectedText, setSelectedText] = useState("");

  const expandRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const preset = getActivePreset();
    if (preset) setSelectedStyle(preset.name);
  }, []);

  const DETAIL_MAP: Record<string, string> = { "简洁": "concise", "适中": "moderate", "细腻": "detailed" };

  const handleExpand = async () => {
    setIsExpanding(true);
    try {
      const activePreset = getActivePreset();
      const res = await fetch("/api/expand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skeleton: skeletonContent,
          detail: DETAIL_MAP[detailLevel] || "moderate",
          stylePrompt: activePreset?.prompt || "",
          styleParams: activePreset?.params || {},
        }),
      });
      const data = await res.json();
      if (data.error) {
        alert(`扩写失败：${data.error}`);
      } else {
        setExpandedContent(data.content);
        setViewMode("expanded");
        setChapters(chapters.map(c => c.id === activeChapter ? { ...c, status: "expanded", words: `${data.content.length}字` } : c));
      }
    } catch {
      alert("网络错误，扩写失败");
    } finally {
      setIsExpanding(false);
    }
  };

  const handleViewModeChange = (mode: "skeleton" | "expanded") => {
    setViewMode(mode);
  };

  const toggleCompareMode = () => {
    setViewMode(viewMode === "compare" ? "expanded" : "compare");
  };

  const handleAddSuggestion = (suggestion: { text: string }) => {
    setSkeletonContent(prev => prev + "\n\n" + suggestion.text);
    setShowInspirePanel(false);
  };

  const handleInspire = async () => {
    setShowInspirePanel(true);
    setIsInspireLoading(true);
    try {
      const res = await fetch("/api/inspire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skeleton: skeletonContent, worldType: "现代都市" }),
      });
      const data = await res.json();
      if (data.error) {
        setInspireSuggestions(INSPIRATION_SUGGESTIONS);
      } else {
        const suggestions = (data.suggestions as string[]).map((text, i) => ({
          id: String(i + 1),
          text,
          tag: ["走向A", "走向B", "走向C", "走向D"][i] || "建议",
        }));
        setInspireSuggestions(suggestions.length > 0 ? suggestions : INSPIRATION_SUGGESTIONS);
      }
    } catch {
      setInspireSuggestions(INSPIRATION_SUGGESTIONS);
    } finally {
      setIsInspireLoading(false);
    }
  };

  // 处理文字选中的浮动工具栏
  useEffect(() => {
    const handleSelectionChange = () => {
      if (viewMode !== "expanded") {
        setShowRefineToolbar(false);
        return;
      }

      const selection = window.getSelection();
      if (selection && selection.toString().trim() && expandRef.current?.contains(selection.anchorNode)) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setRefineToolbarPosition({
          x: rect.left + rect.width / 2 - 100,
          y: rect.top - 50 + window.scrollY
        });
        setSelectedText(selection.toString().trim());
        setShowRefineToolbar(true);
      } else {
        setShowRefineToolbar(false);
      }
    };

    document.addEventListener('mouseup', handleSelectionChange);
    return () => document.removeEventListener('mouseup', handleSelectionChange);
  }, [viewMode]);

  const handleRefine = async (action: string) => {
    setShowRefineToolbar(false);
    if (!selectedText) return;
    setIsRefining(true);
    try {
      const activePreset = getActivePreset();
      const res = await fetch("/api/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: selectedText, action, context: expandedContent, stylePrompt: activePreset?.prompt || "" }),
      });
      const data = await res.json();
      if (!data.error && data.content) {
        setExpandedContent(prev => prev.replace(selectedText, data.content));
      }
    } catch {
      // silently fail
    } finally {
      setIsRefining(false);
      setSelectedText("");
    }
  };

  const selectedChapter = chapters.find(c => c.id === activeChapter);
  const skeletonParagraphs = skeletonContent.split('\n\n').filter(p => p.trim());
  const expandedParagraphs = expandedContent.split('\n\n').filter(p => p.trim());
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [hoveredSide, setHoveredSide] = useState<"skeleton" | "expanded" | null>(null);

  const getHighlightedRange = (side: "skeleton" | "expanded", idx: number) => {
    if (hoveredIdx === null || hoveredSide === null) return false;
    if (side === hoveredSide) return idx === hoveredIdx;
    const srcLen = hoveredSide === "skeleton" ? skeletonParagraphs.length : expandedParagraphs.length;
    const dstLen = side === "skeleton" ? skeletonParagraphs.length : expandedParagraphs.length;
    if (srcLen === 0 || dstLen === 0) return false;
    const ratio = dstLen / srcLen;
    const start = Math.floor(hoveredIdx * ratio);
    const end = Math.floor((hoveredIdx + 1) * ratio) - 1;
    return idx >= start && idx <= Math.max(start, end);
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

        <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-gray-300">章节</div>
        <div className="flex-1 overflow-y-auto px-3 pb-3">
          {chapters.map((chapter) => (
            <div
              key={chapter.id}
              onClick={() => {
                setActiveChapter(chapter.id);
                if (chapter.status === "expanded" || chapter.status === "done") {
                  setViewMode("expanded");
                } else {
                  setViewMode("skeleton");
                }
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${activeChapter === chapter.id ? "bg-gray-50" : "hover:bg-gray-50"}`}
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
            </div>
          ))}
        </div>
      </aside>

      {/* 主工作区 */}
      <div className="flex-1 ml-[280px] flex flex-col h-screen">
        {/* 顶部栏 */}
        <div className="flex items-center justify-between px-8 py-3 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={selectedChapter?.title || ""}
              onChange={(e) => setChapters(chapters.map(c => c.id === activeChapter ? { ...c, title: e.target.value } : c))}
              className="text-base font-semibold border-none outline-none bg-transparent"
            />
            {viewMode !== "compare" && (
              <div className="flex bg-gray-100 rounded-lg p-0.5">
                <button
                  onClick={() => handleViewModeChange("skeleton")}
                  className={`px-3 py-1 text-xs rounded-md transition-all ${viewMode === "skeleton" ? "bg-white text-[#111] font-medium shadow-sm" : "text-gray-500"}`}
                >
                  骨架
                </button>
                <button
                  onClick={() => handleViewModeChange("expanded")}
                  className={`px-3 py-1 text-xs rounded-md transition-all ${viewMode === "expanded" ? "bg-white text-[#111] font-medium shadow-sm" : "text-gray-500"}`}
                >
                  成文
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleCompareMode}
              className={`px-3 py-1.5 text-xs border rounded-lg transition-all ${viewMode === "compare" ? "border-[#111] bg-[#111] text-white" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
            >
              {viewMode === "compare" ? "退出对照" : "对照模式"}
            </button>
            <span className="text-xs text-gray-400">
              {viewMode === "skeleton" && `骨架 ${skeletonContent.length}字`}
              {viewMode === "expanded" && `成文 ${expandedContent.length}字`}
              {viewMode === "compare" && `骨架 ${skeletonContent.length}字 → 成文 ${expandedContent.length}字`}
            </span>
          </div>
        </div>

        {/* 对照模式 */}
        {viewMode === "compare" ? (
          <div className="flex-1 flex overflow-hidden">
            {/* 骨架 */}
            <div className="flex-1 flex flex-col overflow-hidden border-r border-gray-100">
              <div className="px-6 py-2.5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-600">骨架</span>
                <span className="text-xs text-gray-400">{skeletonContent.length}字</span>
              </div>
              <div className="flex-1 px-7 py-8 overflow-y-auto bg-amber-50/30">
                {skeletonParagraphs.map((para, idx) => (
                  <p
                    key={idx}
                    data-idx={idx}
                    className="mb-4 leading-8 text-sm cursor-pointer transition-colors rounded px-1"
                    onMouseEnter={() => { setHoveredIdx(idx); setHoveredSide("skeleton"); }}
                    onMouseLeave={() => { setHoveredIdx(null); setHoveredSide(null); }}
                    style={{ background: getHighlightedRange("skeleton", idx) ? '#e8f0fe' : 'transparent' }}
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {/* 成文 */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="px-6 py-2.5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-600">成文</span>
                <span className="text-xs text-gray-400">{expandedContent.length}字</span>
              </div>
              <div className="flex-1 px-7 py-8 overflow-y-auto">
                {expandedParagraphs.map((para, idx) => (
                  <p
                    key={idx}
                    data-idx={idx}
                    className="mb-4 leading-8 text-sm cursor-pointer transition-colors rounded px-1"
                    onMouseEnter={() => { setHoveredIdx(idx); setHoveredSide("expanded"); }}
                    onMouseLeave={() => { setHoveredIdx(null); setHoveredSide(null); }}
                    style={{ background: getHighlightedRange("expanded", idx) ? '#e8f0fe' : 'transparent' }}
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* 编辑器+侧边栏 */
          <>
            <div className="flex-1 flex overflow-hidden">
              {/* 编辑器 */}
              <div className="flex-1 flex flex-col">
                <div className="flex-1 px-16 py-10 overflow-y-auto">
                  <div className="max-w-[720px] mx-auto">
                    {viewMode === "skeleton" ? (
                      <textarea
                        value={skeletonContent}
                        onChange={(e) => setSkeletonContent(e.target.value)}
                        className="w-full min-h-[400px] text-base leading-loose text-gray-800 outline-none resize-none bg-transparent"
                        placeholder="在此处写下你的故事骨架..."
                      />
                    ) : (
                      <div
                        ref={expandRef}
                        className="text-base leading-loose text-gray-800"
                        contentEditable={true}
                        suppressContentEditableWarning={true}
                      >
                        {expandedContent.split("\n\n").map((para, i) => (
                          <p key={i} className="mb-4">{para}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* 底部栏 */}
                <div className="flex items-center justify-between px-8 py-4 border-t border-gray-100">
                  {viewMode === "skeleton" ? (
                    <div className="flex items-center gap-6">
                      {/* 详细程度 */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">详细程度</span>
                        <div className="flex gap-1">
                          {["简洁", "适中", "细腻"].map((level) => (
                            <button
                              key={level}
                              onClick={() => setDetailLevel(level as "简洁" | "适中" | "细腻")}
                              className={`px-2.5 py-1 text-xs border rounded-md transition-all ${detailLevel === level ? "bg-[#111] text-white border-[#111]" : "border-gray-200 text-gray-600"}`}
                            >
                              {level}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 风格显示 */}
                      <a
                        href="/work/id/styles"
                        className="px-2.5 py-1 text-xs border border-gray-200 rounded-md text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors"
                        title="点击前往风格设置"
                      >
                        {selectedStyle || "未设置风格"}
                      </a>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400">选中文字后可进行局部微调</span>
                      <button
                        onClick={() => handleViewModeChange("skeleton")}
                        className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:border-gray-300"
                      >
                        ← 返回骨架
                      </button>
                    </div>
                  )}

                  {viewMode === "skeleton" && (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleInspire}
                        className="px-5 py-2.5 rounded-lg text-sm font-medium border-2 border-[#111] text-[#111] hover:bg-gray-50 flex items-center gap-1.5"
                      >
                        💡 灵感
                      </button>
                      <button
                        onClick={handleExpand}
                        disabled={isExpanding || !skeletonContent.trim()}
                        className="px-6 py-2.5 rounded-lg text-sm font-medium bg-[#111] text-white hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isExpanding ? "扩写中..." : "扩写本章"}
                      </button>
                    </div>
                  )}

                  {viewMode === "expanded" && (
                    <span className="text-xs text-gray-400">{expandedContent.length} 字</span>
                  )}
                </div>
              </div>

              {/* 侧边面板 */}
              <div className="w-[240px] border-l border-gray-100 p-5 overflow-y-auto">
                <div className="mb-6">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-300 mb-3">本章角色</div>
                  <div className="bg-gray-50 rounded-lg p-3 mb-2">
                    <div className="text-sm font-medium mb-1">陈默</div>
                    <div className="text-xs text-gray-500">外卖骑手，28岁，沉默寡言</div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-300 mb-3">场景</div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 bg-gray-100 rounded-md text-xs text-gray-600">出租屋</span>
                    <span className="px-2.5 py-1 bg-gray-100 rounded-md text-xs text-gray-600">物流公司</span>
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-300 mb-3">前情提要</div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 leading-relaxed">
                      陈默在送餐途中目击一起绑架事件，随后被不明人员追杀，勉强逃脱。
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 灵感建议面板 */}
      {showInspirePanel && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 ml-[140px] w-[520px] bg-white border border-gray-200 rounded-xl shadow-2xl p-5 z-50 animate-slide-up">
          <div className="flex items-center justify-between mb-3.5">
            <span className="text-sm font-semibold">💡 接下来可以怎么写？</span>
            <button onClick={() => setShowInspirePanel(false)} className="w-6 h-6 rounded bg-gray-100 text-gray-500 hover:bg-gray-200">
              ×
            </button>
          </div>
          <div className="text-xs text-gray-500 mb-3">点击任意建议，将追加到骨架末尾（你可以修改）</div>
          {isInspireLoading ? (
            <div className="text-center py-6 text-sm text-gray-400">正在生成建议...</div>
          ) : (
            <div className="space-y-2">
              {inspireSuggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleAddSuggestion(suggestion)}
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-[#111] hover:bg-gray-50 transition-all"
                >
                  <p className="text-sm leading-relaxed text-gray-800">{suggestion.text}</p>
                  <span className="inline-block mt-1.5 text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{suggestion.tag}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 局部微调工具栏 */}
      {showRefineToolbar && (
        <div
          className="fixed bg-[#111] rounded-lg p-1 shadow-lg z-50 flex items-center gap-0.5"
          style={{ left: refineToolbarPosition.x, top: refineToolbarPosition.y }}
        >
          <button
            onClick={() => handleRefine('expand')}
            className="px-3 py-1.5 text-xs text-white hover:bg-[#333] rounded whitespace-nowrap"
          >
            展开更多
          </button>
          <div className="w-px h-4 bg-gray-700 mx-0.5" />
          <button
            onClick={() => handleRefine('compress')}
            className="px-3 py-1.5 text-xs text-white hover:bg-[#333] rounded whitespace-nowrap"
          >
            压缩精简
          </button>
          <div className="w-px h-4 bg-gray-700 mx-0.5" />
          <button
            onClick={() => handleRefine('rewrite')}
            className="px-3 py-1.5 text-xs text-white hover:bg-[#333] rounded whitespace-nowrap"
          >
            换种写法
          </button>
        </div>
      )}

      {/* AI处理中提示 */}
      {isRefining && (
        <div className="fixed top-5 right-5 bg-[#111] text-white px-4 py-2.5 rounded-lg text-sm z-50">
          ✨ AI 正在重写选中段落...
        </div>
      )}
    </div>
  );
}