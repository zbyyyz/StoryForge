export interface StyleParams {
  narrative?: string;
  tone?: string;
  detail?: string;
  pace?: string;
  emotion?: string;
  sensitivity?: string;
}

export interface StylePreset {
  id: string;
  name: string;
  description: string;
  prompt: string;
  params: StyleParams;
  builtin: boolean;
}

export const STYLE_PARAM_OPTIONS = [
  {
    id: "narrative" as const,
    label: "叙事视角",
    options: ["第一人称", "第三人称限制", "第三人称全知"],
  },
  {
    id: "tone" as const,
    label: "文风倾向",
    options: ["简洁", "细腻", "华丽", "幽默", "严肃", "讽刺"],
  },
  {
    id: "detail" as const,
    label: "描写偏好",
    options: ["心理描写", "环境描写", "动作描写", "对话为主", "细节铺陈"],
  },
  {
    id: "pace" as const,
    label: "节奏感",
    options: ["紧凑", "适中", "舒缓", "缓慢"],
  },
  {
    id: "emotion" as const,
    label: "情感浓度",
    options: ["克制", "适中", "浓烈", "激情"],
  },
  {
    id: "sensitivity" as const,
    label: "敏感内容尺度",
    options: ["保守", "适中", "开放"],
  },
];

const BUILTIN_PRESETS: StylePreset[] = [
  {
    id: "builtin-jinyong",
    name: "金庸武侠",
    description: "古风、豪侠、江湖",
    prompt: "以金庸武侠小说的风格写作。大气磅礴，情节跌宕起伏。动作场面利落干净，善用招式名称点缀画面感。对话简洁有力，人物性格在言行中自然流露。善用自然环境（风雪、月夜、荒野、酒肆）烘托江湖气氛。感情描写含蓄内敛，以行动代替告白。多用四字短语增强节奏感，叙事带有说书人的从容。",
    params: { narrative: "第三人称全知", tone: "华丽", detail: "动作描写", pace: "紧凑", emotion: "适中", sensitivity: "适中" },
    builtin: true,
  },
  {
    id: "builtin-yuhua",
    name: "余华冷叙事",
    description: "克制、冷峻、现实",
    prompt: "以余华式冷叙事的风格写作。语言极度克制，不动声色地呈现残酷现实。善用白描手法，用最少的形容词传递最强烈的情感冲击。句式简短有力，多用短句和动词。避免任何煽情和抒情，让读者自己去感受。细节精准、意象冷冽。段落之间留白，给读者喘息和回味的空间。用平静的语调讲述不平静的事。",
    params: { narrative: "第一人称", tone: "简洁", detail: "动作描写", pace: "适中", emotion: "克制", sensitivity: "开放" },
    builtin: true,
  },
  {
    id: "builtin-lightnovel",
    name: "日系轻小说",
    description: "轻松、对话多、二次元",
    prompt: "以日系轻小说的风格写作。语言轻快口语化，大量使用内心独白和吐槽。节奏明快，场景切换迅速。情感表达外放直接，善用夸张和比喻。对话比重高，占全文60%以上，对话中体现人物性格。适当加入轻松幽默的元素，即使在严肃场景也保留一丝自嘲。善用省略号和感叹号营造节奏。",
    params: { narrative: "第一人称", tone: "幽默", detail: "对话为主", pace: "紧凑", emotion: "浓烈", sensitivity: "保守" },
    builtin: true,
  },
  {
    id: "builtin-gufeng",
    name: "古风言情",
    description: "细腻、唯美、情感",
    prompt: "以古风言情的风格写作。语言华丽典雅，善用古典意象（落花、明月、长亭、烟雨）。情感描写细腻绵长，注重心理活动的层层递进。节奏舒缓，善用环境映衬人物心境。对话可适当使用半文言，但保持可读性。整体氛围唯美伤感，一景一物皆含情。善用通感和比喻，文字有画面感。",
    params: { narrative: "第三人称限制", tone: "华丽", detail: "心理描写", pace: "舒缓", emotion: "浓烈", sensitivity: "适中" },
    builtin: true,
  },
  {
    id: "builtin-modern",
    name: "现代都市",
    description: "写实、生活化",
    prompt: "以现代都市风格写作。语言自然流畅，贴近当下生活。对话真实，符合人物的年龄、职业和社会身份。善用城市细节（地铁、外卖、深夜便利店、手机屏幕的光）构建场景感。节奏适中，在推动情节和展开细节之间保持平衡。避免过度文学化，用生活化的语言讲故事。",
    params: { narrative: "第三人称限制", tone: "简洁", detail: "环境描写", pace: "适中", emotion: "适中", sensitivity: "适中" },
    builtin: true,
  },
  {
    id: "builtin-murakami",
    name: "村上春树风",
    description: "孤独、意识流",
    prompt: "以村上春树的风格写作。弥漫着淡淡的孤独感和疏离感。大量使用比喻，比喻新奇但自然，常从日常事物中提炼出超现实的意象。注重日常生活的仪式感（做饭、听音乐、跑步、喝啤酒）。叙述节奏缓慢但不沉闷，有一种催眠般的推进力。对话简短、留白多，角色之间保持礼貌的距离。善用音乐和文学作品的引用营造氛围。",
    params: { narrative: "第一人称", tone: "细腻", detail: "细节铺陈", pace: "缓慢", emotion: "克制", sensitivity: "适中" },
    builtin: true,
  },
];

const STORAGE_KEY = "storyforge_custom_presets";
const ACTIVE_KEY = "storyforge_active_style_id";

export function getBuiltinPresets(): StylePreset[] {
  return BUILTIN_PRESETS;
}

export function getCustomPresets(): StylePreset[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getPresets(): StylePreset[] {
  return [...BUILTIN_PRESETS, ...getCustomPresets()];
}

export function saveCustomPresets(presets: StylePreset[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
}

export function getActivePresetId(): string {
  if (typeof window === "undefined") return BUILTIN_PRESETS[0].id;
  return localStorage.getItem(ACTIVE_KEY) || BUILTIN_PRESETS[0].id;
}

export function getActivePreset(): StylePreset | null {
  const id = getActivePresetId();
  const all = getPresets();
  return all.find(p => p.id === id) || all[0] || null;
}

export function setActivePresetId(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACTIVE_KEY, id);
}

export function buildParamsInstruction(params: StyleParams): string {
  const lines: string[] = [];
  if (params.narrative) lines.push(`叙事视角：${params.narrative}`);
  if (params.tone) lines.push(`文风倾向：${params.tone}`);
  if (params.detail) lines.push(`描写偏好：${params.detail}`);
  if (params.pace) lines.push(`节奏感：${params.pace}`);
  if (params.emotion) lines.push(`情感浓度：${params.emotion}`);
  if (params.sensitivity) lines.push(`敏感内容尺度：${params.sensitivity}`);
  return lines.length > 0 ? `补充参数要求：${lines.join("；")}` : "";
}
