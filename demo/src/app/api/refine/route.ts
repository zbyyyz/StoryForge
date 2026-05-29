import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: process.env.DEEPSEEK_BASE_URL,
});

const ACTION_PROMPTS: Record<string, string> = {
  expand: "请将这段文字进一步展开，添加更多细节、描写和感官体验，使其更加丰满。",
  compress: "请将这段文字压缩精简，保留核心信息和关键动作，去除冗余描写。",
  rewrite: "请用不同的写法重写这段文字，保持相同的信息和情节，但换一种表达方式。",
};

export async function POST(req: NextRequest) {
  const { text, action, context } = await req.json();

  const actionPrompt = ACTION_PROMPTS[action] || ACTION_PROMPTS.rewrite;

  const systemPrompt = `你是一个专业的小说编辑助手。用户会给你一段已有的小说文本，你需要按照指令对其进行修改。

规则：
1. 只修改用户提供的这段文字，不要改变情节走向。
2. 直接输出修改后的文字，不要加任何解释或标注。
3. 保持与上下文风格一致。`;

  const userMessage = context
    ? `上下文：\n${context}\n\n需要修改的段落：\n${text}\n\n${actionPrompt}`
    : `需要修改的段落：\n${text}\n\n${actionPrompt}`;

  const response = await client.chat.completions.create({
    model: "deepseek-chat",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    temperature: 0.8,
    max_tokens: 2000,
  });

  const result = response.choices[0]?.message?.content || "修改失败，请重试。";
  return NextResponse.json({ content: result });
}
