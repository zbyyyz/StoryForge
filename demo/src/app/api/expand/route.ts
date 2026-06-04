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

// 故事级参数的prompt映射
const DIALOGUE_STYLE_PROMPTS: Record<string, string> = {
  文雅: "对话风格文雅优雅，用词考究，避免口语化表达。",
  日常: "对话风格自然日常，贴近真实生活场景。",
  古典: "对话风格偏古典，可适当使用文言或半文言表达。",
  粗犷: "对话风格粗犷豪爽，用词直接有力。",
  卖萌: "对话风格活泼可爱，可适当使用语气词和可爱表达。",
  冷峻: "对话风格冷静克制，简短有力。",
};

const ENDING_TYPE_PROMPTS: Record<string, string> = {
  HE: "整体剧情走向为HE（大团圆结局），铺垫积极向上的情感基调。",
  BE: "整体剧情走向为BE（悲剧结局），铺垫克制克制的情感基调。",
  OE: "整体剧情走向为OE（开放式结局），保持情感基调的中性和可能性。",
};

const STORY_FOCUS_PROMPTS: Record<string, string> = {
  阴谋: "故事侧重点是阴谋算计，在情节中埋下伏笔和反转。",
  感情拉扯: "故事侧重点是感情拉扯，注重人物之间的情感互动和矛盾。",
  事业: "故事侧重点是事业发展，注重主角的成长和成就。",
  成长: "故事侧重点是个人成长，注重主角内心的变化和进步。",
  探案: "故事侧重点是探案推理，注重线索和逻辑的展现。",
  群像: "故事侧重点是群像描写，平衡多个人物的戏份和性格。",
};

const PACE_PREFERENCE_PROMPTS: Record<string, string> = {
  快速推剧情: "节奏偏好快速推剧情，减少冗余描写，加快叙事节奏。",
  注重细节: "节奏偏好注重细节描写，放缓叙事节奏，充分展开场景。",
  均衡: "节奏偏好均衡，在推剧情和细节描写之间保持平衡。",
};

const SEXUALITY_PROMPTS: Record<string, string> = {
  BG: "故事性向为BG（男女情感），侧重男女之间的情感互动。",
  BL: "故事性向为BL（男男情感），侧重男性角色之间的情感互动。",
  GL: "故事性向为GL（女女情感），侧重女性角色之间的情感互动。",
  无CP: "故事性向为无CP，不侧重任何情感线，以剧情为主。",
};

const WORLD_TONE_PROMPTS: Record<string, string> = {
  主角万能: "世界基调为主角万能，主角能力出众，解决问题能力强。",
  爽文: "世界基调为爽文，主角经历顺畅，多有高光时刻。",
  现实向: "世界基调为现实向，遵循现实逻辑，人物行为合理可信。",
  虐文: "世界基调为虐文，主角经历坎坷，情感起伏较大。",
  轻松: "世界基调为轻松愉快，氛围轻松少沉重。",
};

export async function POST(req: NextRequest) {
  try {
    const client = getClient();
    const { skeleton, detail, style, stylePrompt, styleParams, characters, worldType, dialogueStyle, endingType, storyFocus, pacePreference, sexuality, worldTone } = await req.json();

  const detailPrompt = DETAIL_PROMPTS[detail] || DETAIL_PROMPTS.moderate;

  // Priority: stylePrompt (from preset system) > style key (legacy)
  let resolvedStylePrompt: string;
  if (stylePrompt && stylePrompt.trim()) {
    resolvedStylePrompt = `风格要求：${stylePrompt.trim()}`;
    if (styleParams) {
      const paramLines: string[] = [];
      if (styleParams.narrative) paramLines.push(`叙事视角：${styleParams.narrative}`);
      if (styleParams.tone) paramLines.push(`文风倾向：${styleParams.tone}`);
      if (styleParams.detail) paramLines.push(`描写偏好：${styleParams.detail}`);
      if (styleParams.pace) paramLines.push(`节奏感：${styleParams.pace}`);
      if (styleParams.emotion) paramLines.push(`情感浓度：${styleParams.emotion}`);
      if (styleParams.sensitivity) paramLines.push(`敏感内容尺度：${styleParams.sensitivity}`);
      if (paramLines.length > 0) {
        resolvedStylePrompt += `\n补充参数：${paramLines.join("；")}`;
      }
    }
  } else {
    resolvedStylePrompt = STYLE_PROMPTS[style] || STYLE_PROMPTS.modern;
  }

  // 故事级参数prompt
  const dialogueStylePrompt = dialogueStyle ? DIALOGUE_STYLE_PROMPTS[dialogueStyle] : "";
  const endingTypePrompt = endingType ? ENDING_TYPE_PROMPTS[endingType] : "";
  const storyFocusPrompt = storyFocus ? STORY_FOCUS_PROMPTS[storyFocus] : "";
  const pacePreferencePrompt = pacePreference ? PACE_PREFERENCE_PROMPTS[pacePreference] : "";
  const sexualityPrompt = sexuality ? SEXUALITY_PROMPTS[sexuality] : "";
  const worldTonePrompt = worldTone ? WORLD_TONE_PROMPTS[worldTone] : "";

  let contextInfo = "";
  if (characters && characters.length > 0) {
    contextInfo += "\n\n角色设定：\n" + characters.map((c: { name: string; description: string }) => `- ${c.name}：${c.description}`).join("\n");
  }
  if (worldType) {
    contextInfo += `\n\n世界观类型：${worldType}`;
  }

  // 构建故事级参数指令
  const storyParams = [dialogueStylePrompt, endingTypePrompt, storyFocusPrompt, pacePreferencePrompt, sexualityPrompt, worldTonePrompt]
    .filter(Boolean)
    .join(" ");
  const storyParamsText = storyParams ? `\n7. 故事设定：${storyParams}` : "";

  const systemPrompt = `你是一个专业的小说扩写助手。用户会给你一段故事骨架（粗略的梗概），你需要将其扩写为完整的、有文学质感的小说段落。

规则：
1. ${detailPrompt}
2. ${resolvedStylePrompt}
3. 如果骨架中有完整的对话句（带引号、有语气感），尽量保留原句，在周围补充描写。
4. 如果骨架中是概括性描述，则完全展开重写为具体场景。
5. 保持情节走向与骨架一致，不要添加骨架中没有的重大情节。
6. 直接输出扩写后的正文，不要加任何解释或标注。${storyParamsText}${contextInfo}`;

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
  } catch (error) {
    const message = error instanceof Error ? error.message : "扩写失败，请重试。";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
