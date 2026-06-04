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
    const { skeleton, characters, worldType, dialogueStyle, endingType, storyFocus, pacePreference, sexuality, worldTone } = await req.json();

  let contextInfo = "";
  if (skeleton) {
    contextInfo += `\n当前故事骨架：\n${skeleton}`;
  }
  if (characters && characters.length > 0) {
    contextInfo += "\n\n角色设定：\n" + characters.map((c: { name: string; description: string }) => `- ${c.name}：${c.description}`).join("\n");
  }
  if (worldType) {
    contextInfo += `\n\n世界观类型：${worldType}`;
  }

  // 构建故事级参数指令
  const storyParams = [dialogueStyle, endingType, storyFocus, pacePreference, sexuality, worldTone].filter(Boolean).join("、");
  if (storyParams) {
    contextInfo += `\n\n故事设定：${storyParams}`;
  }

  const systemPrompt = `你是一个专业的小说创意助手。用户正在创作一个故事，需要你提供后续情节走向的建议。

规则：
1. 生成3-4个不同的后续走向建议
2. 每个建议用梗概式语气写，1-2句话
3. 建议要符合当前的故事设定和风格
4. 如果骨架为空，提供一些通用的开篇建议
5. 直接输出建议列表，每条建议占一行，不要加任何解释或序号`;

  const userMessage = skeleton
    ? `请为以下故事提供后续走向建议：${contextInfo}`
    : `请为${worldType || "现代都市"}类型的故事提供开篇建议：${contextInfo}`;

  const response = await client.chat.completions.create({
    model: "deepseek-chat",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    temperature: 0.9,
    max_tokens: 500,
  });

  const result = response.choices[0]?.message?.content || "获取灵感失败，请重试。";
    const suggestions = result.split("\n").filter((s) => s.trim());
    return NextResponse.json({ suggestions });
  } catch (error) {
    const message = error instanceof Error ? error.message : "获取灵感失败，请重试。";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}