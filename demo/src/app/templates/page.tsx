"use client";

import { useState } from "react";
import Link from "next/link";

interface Template {
  id: string;
  name: string;
  genre: string;
  icon: string;
  description: string;
  outline: string;
  chapters: string[];
}

const TEMPLATES: Template[] = [
  {
    id: "delivery-thriller",
    name: "深夜骑手",
    genre: "都市悬疑",
    icon: "🏙",
    description: "外卖骑手深夜送单时意外卷入一场阴谋，从普通人变成真相的追寻者。",
    outline: "小人物→意外目击→被追杀→寻找线索→联合盟友→揭露真相",
    chapters: ["深夜订单", "目击", "追杀", "线索", "同盟", "真相"],
  },
  {
    id: "campus-mystery",
    name: "消失的室友",
    genre: "校园悬疑",
    icon: "📚",
    description: "大学室友突然失踪，留下的日记本里藏着不为人知的秘密。",
    outline: "失踪事件→日记线索→逐层揭秘→校园暗网→最终真相",
    chapters: ["空床", "日记", "追踪", "暗网", "对质", "真相"],
  },
  {
    id: "wuxia-revenge",
    name: "断刀客",
    genre: "武侠",
    icon: "🗡",
    description: "被逐出师门的弟子带着一把断刀行走江湖，寻找当年灭门真相。",
    outline: "被逐→流浪→结识伙伴→线索浮现→师门阴谋→最终对决",
    chapters: ["逐出师门", "断刀", "酒肆", "旧人", "真相", "长亭"],
  },
  {
    id: "ai-romance",
    name: "404 Not Found",
    genre: "科幻言情",
    icon: "🚀",
    description: "程序员发现公司的AI客服产生了自我意识，而她似乎只对他一个人展现真实情感。",
    outline: "异常对话→试探→产生感情→公司发现→面临删除→抉择",
    chapters: ["异常", "图灵", "心动", "暴露", "倒计时", "选择"],
  },
  {
    id: "food-healing",
    name: "深巷食堂",
    genre: "美食治愈",
    icon: "🍜",
    description: "隐藏在老巷子里的小食堂，老板娘用一道道菜治愈每个迷路的灵魂。",
    outline: "发现食堂→第一位客人→各色来客→老板娘的过去→食堂的危机→守护",
    chapters: ["巷子深处", "红烧肉", "常客", "旧照片", "拆迁", "烟火"],
  },
  {
    id: "time-loop",
    name: "重复的周三",
    genre: "奇幻悬疑",
    icon: "✨",
    description: "你被困在同一个周三里反复循环，而每次循环都有细微不同——有人在暗中改变规则。",
    outline: "第一次循环→发现规律→尝试打破→发现他人→对抗规则→跳出循环",
    chapters: ["周三", "又是周三", "规律", "同路人", "规则", "周四"],
  },
];

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  return (
    <div className="min-h-screen bg-white text-[#111]">
      <header className="px-10 py-5 flex items-center border-b border-gray-100">
        <Link href="/home" className="text-sm text-gray-500 mr-4 hover:text-gray-900">
          ← 返回
        </Link>
        <span className="text-sm font-semibold">从模板开始</span>
      </header>

      <div className="max-w-[900px] mx-auto px-10 py-10">
        <div className="mb-10">
          <h1 className="text-2xl font-bold mb-2">故事模板</h1>
          <p className="text-sm text-gray-500">选择一个模板快速开始，所有内容都可以在创建后修改</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-10">
          {TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => setSelectedTemplate(tpl)}
              className={`p-5 border rounded-xl text-left transition-all ${
                selectedTemplate?.id === tpl.id
                  ? "border-[#111] bg-gray-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{tpl.icon}</span>
                <span className="text-base font-semibold">{tpl.name}</span>
                <span className="text-xs text-gray-400 ml-auto">{tpl.genre}</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{tpl.description}</p>
            </button>
          ))}
        </div>

        {selectedTemplate && (
          <div className="border border-gray-200 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">{selectedTemplate.icon}</span>
              <div>
                <div className="text-lg font-bold">{selectedTemplate.name}</div>
                <div className="text-xs text-gray-400">{selectedTemplate.genre}</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-xs text-gray-400 mb-1">故事线</div>
              <div className="text-sm text-gray-700">{selectedTemplate.outline}</div>
            </div>

            <div className="mb-6">
              <div className="text-xs text-gray-400 mb-2">预设章节</div>
              <div className="flex flex-wrap gap-2">
                {selectedTemplate.chapters.map((ch, i) => (
                  <span key={i} className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs text-gray-700">
                    第{i + 1}章：{ch}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                href="/work/id"
                className="px-6 py-2.5 rounded-lg text-sm font-medium bg-[#111] text-white hover:bg-[#333]"
              >
                使用此模板开始创作
              </Link>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="px-6 py-2.5 rounded-lg text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                取消
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
