import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: process.env.DEEPSEEK_BASE_URL,
});

const DETAIL_PROMPTS: Record<string, string> = {
  concise: "扩写时保持简练，重点突出动作和对话，少用修饰，节奏紧凑。扩写长度约为原文的2-3倍。",
  moderate: "扩写时适度添加环境描写、心理活动和细节，节奏均衡。扩写长度约为原文的3-5倍。",
  detailed: "扩写时充分展开环境描写、心理活动、感官细节和氛围渲染，节奏舒缓细腻。扩写长度约为原文的5-8倍。",
};

const STYLE_PROMPTS: Record<string, string> = {
  wuxia: "文风偏金庸武侠：大气磅礴，动作描写利落，对话简洁有力，善用环境烘托气氛。",
  literary: "文风偏余华/莫言式纯文学：语言克制冷峻，善用白描，细节精准，情感内敛。",
  lightnovel: "文风偏日系轻小说：语言轻快口语化，内心独白多，节奏明快，情感外放。",
  romance: "文风偏古风言情：语言华丽典雅，善用意象和比喻，情感细腻，氛围唯美。",
  modern: "文风偏现代都市：语言自然流畅，贴近生活，对话真实，节奏适中。",
};

export async function POST(req: NextRequest) {
  const { skeleton, detail, style, characters, worldType } = await req.json();

  const detailPrompt = DETAIL_PROMPTS[detail] || DETAIL_PROMPTS.moderate;
  const stylePrompt = STYLE_PROMPTS[style] || STYLE_PROMPTS.modern;

  let contextInfo = "";
  if (characters && characters.length > 0) {
    contextInfo += "\n\n角色设定：\n" + characters.map((c: { name: string; description: string }) => `- ${c.name}：${c.description}`).join("\n");
  }
  if (worldType) {
    contextInfo += `\n\n世界观类型：${worldType}`;
  }

  const systemPrompt = `你是一个专业的小说扩写助手。用户会给你一段故事骨架（粗略的梗概），你需要将其扩写为完整的、有文学质感的小说段落。

规则：
1. ${detailPrompt}
2. ${stylePrompt}
3. 如果骨架中有完整的对话句（带引号、有语气感），尽量保留原句，在周围补充描写。
4. 如果骨架中是概括性描述，则完全展开重写为具体场景。
5. 保持情节走向与骨架一致，不要添加骨架中没有的重大情节。
6. 直接输出扩写后的正文，不要加任何解释或标注。${contextInfo}`;

  const response = await client.chat.completions.create({
    model: "deepseek-chat",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `请扩写以下故事骨架：\n\n${skeleton}` },
    ],
    temperature: 0.8,
    max_tokens: 4000,
  });

  const result = response.choices[0]?.message?.content || "扩写失败，请重试。";
  return NextResponse.json({ content: result });
}
