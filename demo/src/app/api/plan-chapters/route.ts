import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

function getClient() {
  if (!process.env.DEEPSEEK_API_KEY) {
    throw new Error("DEEPSEEK_API_KEY 环境变量未配置");
  }
  return new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: process.env.DEEPSEEK_BASE_URL,
  });
}

export async function POST(req: NextRequest) {
  try {
    const client = getClient();
    const { outline, type, title, desc } = await req.json();

    const context = [
      title && `书名：${title}`,
      type && `类型：${type}`,
      desc && `简介：${desc}`,
      outline && `故事梗概：${outline}`,
    ].filter(Boolean).join("\n");

    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `你是专业的小说章节规划助手。根据用户提供的故事信息，规划合理的章节结构。
规则：
1. 生成4-8个章节
2. 每个章节包含标题和一句话梗概
3. 严格按JSON数组格式输出：[{"title":"章节标题","desc":"一句话梗概"},...]
4. 不要输出任何其他内容，只输出JSON数组`,
        },
        { role: "user", content: context || "请为一个现代都市故事规划章节" },
      ],
      temperature: 0.8,
      max_tokens: 1000,
    });

    const text = response.choices[0]?.message?.content || "[]";
    const match = text.match(/\[[\s\S]*\]/);
    const chapters = match ? JSON.parse(match[0]) : [];
    return NextResponse.json({ chapters });
  } catch (error) {
    const message = error instanceof Error ? error.message : "规划失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
