"use client";

import { useState } from "react";

interface Character {
  id: string;
  name: string;
  description: string;
  // 基本信息
  gender?: string;
  age?: string;
  birthday?: string;
  height?: string;
  weight?: string;
  language?: string;
  // 身份背景
  occupation?: string;
  family?: string;
  socialClass?: string;
  education?: string;
  // 外在形象
  appearance?: string;
  hair?: string;
  clothing?: string;
  taste?: string;
  signatureItem?: string;
  // 性格内在
  personality?: string;
  values?: string;
  habits?: string;
  fears?: string;
  desires?: string;
  // 说话方式
  tone?: string;
  catchphrase?: string;
  wordChoice?: string;
  rhythm?: string;
  // 行为模式
  actionStyle?: string;
  socialStyle?: string;
  conflictReaction?: string;
  // 生活细节
  residence?: string;
  transport?: string;
  schedule?: string;
  hobbies?: string;
  // 经历
  experience?: string;
}

const INITIAL_CHARACTERS: Character[] = [
  {
    id: "1",
    name: "陈默",
    description: "外卖骑手，28岁，沉默寡言",
    gender: "男",
    age: "28",
    birthday: "1996年3月15日",
    height: "175cm",
    weight: "65kg",
    occupation: "外卖骑手",
    personality: "沉默寡言、冷静、谨慎",
    appearance: "身材瘦削，寸头，眼神警惕",
    experience: "来自农村，高中毕业后进城打工，送了五年外卖"
  },
  {
    id: "2",
    name: "林薇",
    description: "调查记者，32岁，聪明勇敢",
    gender: "女",
    age: "32",
    birthday: "1992年8月22日",
    height: "168cm",
    occupation: "调查记者",
    personality: "聪明、勇敢、有正义感",
    appearance: "短发利落，眼神明亮",
    experience: "新闻系毕业，做了五年调查记者"
  },
];

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>(INITIAL_CHARACTERS);
  const [showModal, setShowModal] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const [characterForm, setCharacterForm] = useState<Partial<Character>>({
    name: "", description: "", gender: "", age: "", birthday: "", height: "", weight: "",
    occupation: "", family: "", socialClass: "", education: "",
    appearance: "", hair: "", clothing: "", taste: "", signatureItem: "",
    personality: "", values: "", habits: "", fears: "", desires: "",
    tone: "", catchphrase: "", wordChoice: "", rhythm: "",
    actionStyle: "", socialStyle: "", conflictReaction: "",
    residence: "", transport: "", schedule: "", hobbies: "",
    experience: "",
  });

  const sections = [
    { id: "basic", title: "基本信息", icon: "📋" },
    { id: "background", title: "身份背景", icon: "👔" },
    { id: "appearance", title: "外在形象", icon: "🎨" },
    { id: "personality", title: "性格内在", icon: "💭" },
    { id: "speech", title: "说话方式", icon: "💬" },
    { id: "behavior", title: "行为模式", icon: "🎭" },
    { id: "life", title: "生活细节", icon: "🏠" },
    { id: "experience", title: "经历", icon: "📜" },
  ];

  const toggleCard = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const toggleSection = (sectionId: string) => {
    setActiveSection(activeSection === sectionId ? null : sectionId);
  };

  const openAdd = () => {
    setEditingCharacter(null);
    setCharacterForm({
      name: "", description: "", gender: "", age: "", birthday: "", height: "", weight: "",
      occupation: "", family: "", socialClass: "", education: "",
      appearance: "", hair: "", clothing: "", taste: "", signatureItem: "",
      personality: "", values: "", habits: "", fears: "", desires: "",
      tone: "", catchphrase: "", wordChoice: "", rhythm: "",
      actionStyle: "", socialStyle: "", conflictReaction: "",
      residence: "", transport: "", schedule: "", hobbies: "",
      experience: "",
    });
    setShowModal(true);
  };

  const openEdit = (char: Character) => {
    setEditingCharacter(char);
    setCharacterForm(char);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!characterForm.name?.trim()) return;

    if (editingCharacter) {
      setCharacters(characters.map(c => c.id === editingCharacter.id ? { ...c, ...characterForm } as Character : c));
    } else {
      const newChar: Character = {
        id: String(Date.now()),
        name: characterForm.name || "",
        description: characterForm.description || "",
        gender: characterForm.gender,
        age: characterForm.age,
        birthday: characterForm.birthday,
        height: characterForm.height,
        weight: characterForm.weight,
        occupation: characterForm.occupation,
        family: characterForm.family,
        socialClass: characterForm.socialClass,
        education: characterForm.education,
        appearance: characterForm.appearance,
        hair: characterForm.hair,
        clothing: characterForm.clothing,
        taste: characterForm.taste,
        signatureItem: characterForm.signatureItem,
        personality: characterForm.personality,
        values: characterForm.values,
        habits: characterForm.habits,
        fears: characterForm.fears,
        desires: characterForm.desires,
        tone: characterForm.tone,
        catchphrase: characterForm.catchphrase,
        wordChoice: characterForm.wordChoice,
        rhythm: characterForm.rhythm,
        actionStyle: characterForm.actionStyle,
        socialStyle: characterForm.socialStyle,
        conflictReaction: characterForm.conflictReaction,
        residence: characterForm.residence,
        transport: characterForm.transport,
        schedule: characterForm.schedule,
        hobbies: characterForm.hobbies,
        experience: characterForm.experience,
      };
      setCharacters([...characters, newChar]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("确定要删除这个角色吗？")) {
      setCharacters(characters.filter(c => c.id !== id));
    }
  };

  const renderBasicInfo = () => (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <div className="text-xs text-gray-400 mb-1.5">性别</div>
        <input type="text" value={characterForm.gender || ""} onChange={(e) => setCharacterForm({ ...characterForm, gender: e.target.value })}
          placeholder="男/女" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#111]" />
      </div>
      <div>
        <div className="text-xs text-gray-400 mb-1.5">年龄</div>
        <input type="text" value={characterForm.age || ""} onChange={(e) => setCharacterForm({ ...characterForm, age: e.target.value })}
          placeholder="28" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#111]" />
      </div>
      <div>
        <div className="text-xs text-gray-400 mb-1.5">生日</div>
        <input type="text" value={characterForm.birthday || ""} onChange={(e) => setCharacterForm({ ...characterForm, birthday: e.target.value })}
          placeholder="1996年3月15日" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#111]" />
      </div>
      <div>
        <div className="text-xs text-gray-400 mb-1.5">身高</div>
        <input type="text" value={characterForm.height || ""} onChange={(e) => setCharacterForm({ ...characterForm, height: e.target.value })}
          placeholder="175cm" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#111]" />
      </div>
      <div>
        <div className="text-xs text-gray-400 mb-1.5">体重</div>
        <input type="text" value={characterForm.weight || ""} onChange={(e) => setCharacterForm({ ...characterForm, weight: e.target.value })}
          placeholder="65kg" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#111]" />
      </div>
      <div>
        <div className="text-xs text-gray-400 mb-1.5">语言</div>
        <input type="text" value={characterForm.language || ""} onChange={(e) => setCharacterForm({ ...characterForm, language: e.target.value })}
          placeholder="普通话" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#111]" />
      </div>
    </div>
  );

  const renderBackground = () => (
    <div className="space-y-4">
      <div>
        <div className="text-xs text-gray-600 mb-1.5">职业</div>
        <input type="text" value={characterForm.occupation || ""} onChange={(e) => setCharacterForm({ ...characterForm, occupation: e.target.value })}
          placeholder="例如：外卖骑手" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#111]" />
      </div>
      <div>
        <div className="text-xs text-gray-600 mb-1.5">家世</div>
        <input type="text" value={characterForm.family || ""} onChange={(e) => setCharacterForm({ ...characterForm, family: e.target.value })}
          placeholder="例如：来自农村，父母是农民" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#111]" />
      </div>
      <div>
        <div className="text-xs text-gray-600 mb-1.5">社会阶层</div>
        <input type="text" value={characterForm.socialClass || ""} onChange={(e) => setCharacterForm({ ...characterForm, socialClass: e.target.value })}
          placeholder="例如：工薪阶层" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#111]" />
      </div>
      <div>
        <div className="text-xs text-gray-600 mb-1.5">教育经历</div>
        <input type="text" value={characterForm.education || ""} onChange={(e) => setCharacterForm({ ...characterForm, education: e.target.value })}
          placeholder="例如：高中毕业" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#111]" />
      </div>
    </div>
  );

  const renderAppearance = () => (
    <div className="space-y-4">
      <div>
        <div className="text-xs text-gray-600 mb-1.5">外貌特征</div>
        <textarea value={characterForm.appearance || ""} onChange={(e) => setCharacterForm({ ...characterForm, appearance: e.target.value })}
          placeholder="例如：身材瘦削，眼神警惕" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none resize-y min-h-[80px] focus:border-[#111]" />
      </div>
      <div>
        <div className="text-xs text-gray-600 mb-1.5">发型发色</div>
        <input type="text" value={characterForm.hair || ""} onChange={(e) => setCharacterForm({ ...characterForm, hair: e.target.value })}
          placeholder="例如：寸头，黑色" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#111]" />
      </div>
      <div>
        <div className="text-xs text-gray-600 mb-1.5">衣着风格</div>
        <input type="text" value={characterForm.clothing || ""} onChange={(e) => setCharacterForm({ ...characterForm, clothing: e.target.value })}
          placeholder="例如：朴素，穿外卖工装" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#111]" />
      </div>
      <div>
        <div className="text-xs text-gray-600 mb-1.5">审美偏好</div>
        <input type="text" value={characterForm.taste || ""} onChange={(e) => setCharacterForm({ ...characterForm, taste: e.target.value })}
          placeholder="例如：不喜欢花哨" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#111]" />
      </div>
      <div>
        <div className="text-xs text-gray-600 mb-1.5">标志性物件</div>
        <input type="text" value={characterForm.signatureItem || ""} onChange={(e) => setCharacterForm({ ...characterForm, signatureItem: e.target.value })}
          placeholder="例如：总是戴着破旧的蓝牙耳机" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#111]" />
      </div>
    </div>
  );

  const renderPersonality = () => (
    <div className="space-y-4">
      <div>
        <div className="text-xs text-gray-600 mb-1.5">性格特征</div>
        <input type="text" value={characterForm.personality || ""} onChange={(e) => setCharacterForm({ ...characterForm, personality: e.target.value })}
          placeholder="例如：冷静、谨慎、有正义感" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#111]" />
      </div>
      <div>
        <div className="text-xs text-gray-600 mb-1.5">价值观</div>
        <textarea value={characterForm.values || ""} onChange={(e) => setCharacterForm({ ...characterForm, values: e.target.value })}
          placeholder="例如：正义、公平、真相重要" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none resize-y min-h-[80px] focus:border-[#111]" />
      </div>
      <div>
        <div className="text-xs text-gray-600 mb-1.5">习惯/癖好</div>
        <input type="text" value={characterForm.habits || ""} onChange={(e) => setCharacterForm({ ...characterForm, habits: e.target.value })}
          placeholder="例如：压力大时会咬指甲" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#111]" />
      </div>
      <div>
        <div className="text-xs text-gray-600 mb-1.5">恐惧/弱点</div>
        <input type="text" value={characterForm.fears || ""} onChange={(e) => setCharacterForm({ ...characterForm, fears: e.target.value })}
          placeholder="例如：怕被认出来" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#111]" />
      </div>
      <div>
        <div className="text-xs text-gray-600 mb-1.5">欲望/目标</div>
        <input type="text" value={characterForm.desires || ""} onChange={(e) => setCharacterForm({ ...characterForm, desires: e.target.value })}
          placeholder="例如：查出真相" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#111]" />
      </div>
    </div>
  );

  const renderSpeech = () => (
    <div className="space-y-4">
      <div>
        <div className="text-xs text-gray-600 mb-1.5">语气</div>
        <input type="text" value={characterForm.tone || ""} onChange={(e) => setCharacterForm({ ...characterForm, tone: e.target.value })}
          placeholder="例如：冷淡，语速慢" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#111]" />
      </div>
      <div>
        <div className="text-xs text-gray-600 mb-1.5">口癖</div>
        <input type="text" value={characterForm.catchphrase || ""} onChange={(e) => setCharacterForm({ ...characterForm, catchphrase: e.target.value })}
          placeholder="例如：习惯说'应该没问题'" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#111]" />
      </div>
      <div>
        <div className="text-xs text-gray-600 mb-1.5">用词偏好</div>
        <input type="text" value={characterForm.wordChoice || ""} onChange={(e) => setCharacterForm({ ...characterForm, wordChoice: e.target.value })}
          placeholder="例如：简洁，少用形容词" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#111]" />
      </div>
      <div>
        <div className="text-xs text-gray-600 mb-1.5">说话节奏</div>
        <input type="text" value={characterForm.rhythm || ""} onChange={(e) => setCharacterForm({ ...characterForm, rhythm: e.target.value })}
          placeholder="例如：偶尔停顿，思考后再说" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#111]" />
      </div>
    </div>
  );

  const renderBehavior = () => (
    <div className="space-y-4">
      <div>
        <div className="text-xs text-gray-600 mb-1.5">行事风格</div>
        <input type="text" value={characterForm.actionStyle || ""} onChange={(e) => setCharacterForm({ ...characterForm, actionStyle: e.target.value })}
          placeholder="例如：谨慎，三思而后行" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#111]" />
      </div>
      <div>
        <div className="text-xs text-gray-600 mb-1.5">社交方式</div>
        <input type="text" value={characterForm.socialStyle || ""} onChange={(e) => setCharacterForm({ ...characterForm, socialStyle: e.target.value })}
          placeholder="例如：不善言辞，独来独往" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#111]" />
      </div>
      <div>
        <div className="text-xs text-gray-600 mb-1.5">面对冲突的反应</div>
        <textarea value={characterForm.conflictReaction || ""} onChange={(e) => setCharacterForm({ ...characterForm, conflictReaction: e.target.value })}
          placeholder="例如：会先观察局势，然后选择最优策略" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none resize-y min-h-[80px] focus:border-[#111]" />
      </div>
    </div>
  );

  const renderLife = () => (
    <div className="space-y-4">
      <div>
        <div className="text-xs text-gray-600 mb-1.5">住处</div>
        <input type="text" value={characterForm.residence || ""} onChange={(e) => setCharacterForm({ ...characterForm, residence: e.target.value })}
          placeholder="例如：城中村出租屋" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#111]" />
      </div>
      <div>
        <div className="text-xs text-gray-600 mb-1.5">交通工具</div>
        <input type="text" value={characterForm.transport || ""} onChange={(e) => setCharacterForm({ ...characterForm, transport: e.target.value })}
          placeholder="例如：二手电动车" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#111]" />
      </div>
      <div>
        <div className="text-xs text-gray-600 mb-1.5">日常作息</div>
        <input type="text" value={characterForm.schedule || ""} onChange={(e) => setCharacterForm({ ...characterForm, schedule: e.target.value })}
          placeholder="例如：早上7点起床，晚上10点睡觉" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#111]" />
      </div>
      <div>
        <div className="text-xs text-gray-600 mb-1.5">爱好</div>
        <input type="text" value={characterForm.hobbies || ""} onChange={(e) => setCharacterForm({ ...characterForm, hobbies: e.target.value })}
          placeholder="例如：看电影、跑步" className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#111]" />
      </div>
    </div>
  );

  const renderExperience = () => (
    <div>
      <div className="text-xs text-gray-600 mb-1.5">经历</div>
      <textarea value={characterForm.experience || ""} onChange={(e) => setCharacterForm({ ...characterForm, experience: e.target.value })}
        placeholder="例如：来自农村，高中毕业后进城打工，送了五年外卖..." className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none resize-y min-h-[120px] focus:border-[#111]" />
    </div>
  );

  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case "basic": return renderBasicInfo();
      case "background": return renderBackground();
      case "appearance": return renderAppearance();
      case "personality": return renderPersonality();
      case "speech": return renderSpeech();
      case "behavior": return renderBehavior();
      case "life": return renderLife();
      case "experience": return renderExperience();
      default: return null;
    }
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

        <nav className="px-3 py-4 flex flex-col gap-1">
          <a href="/work/id" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <span className="text-base">🏠</span> 总览
          </a>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-gray-50 text-gray-900 font-medium">
            <span className="text-base">👥</span> 角色库
          </div>
          <a href="/work/id/world" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <span className="text-base">🌍</span> 世界观
          </a>
          <a href="/work/id/styles" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <span className="text-base">✏</span> 风格预设
          </a>
        </nav>
      </aside>

      {/* 主内容 */}
      <main className="flex-1 ml-[280px] px-10 py-10 max-w-[1000px]">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-2xl font-bold">角色库</h1>
          <button onClick={openAdd} className="px-6 py-2.5 rounded-lg text-sm font-medium bg-[#111] text-white hover:bg-[#333]">
            + 新增角色
          </button>
        </div>

        {characters.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">👥</div>
            <div className="text-gray-500 mb-4">还没有角色</div>
            <button onClick={openAdd} className="px-6 py-2.5 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-50">
              创建第一个角色
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {characters.map((char) => (
              <div key={char.id} className="border border-gray-200 rounded-xl overflow-hidden">
                {/* 角色卡片头部 */}
                <div className="p-5 flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{char.name}</h3>
                    <p className="text-sm text-gray-600">{char.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(char)} className="text-gray-400 hover:text-gray-700 text-sm px-2 py-1">
                      编辑
                    </button>
                    <button onClick={() => handleDelete(char.id)} className="text-gray-400 hover:text-red-500 text-sm px-2 py-1">
                      删除
                    </button>
                  </div>
                </div>

                {/* 基本信息（始终显示） */}
                <div className="px-5 pb-4 flex gap-4">
                  {char.gender && (
                    <div>
                      <div className="text-xs text-gray-400">性别</div>
                      <div className="text-sm text-gray-700">{char.gender}</div>
                    </div>
                  )}
                  {char.age && (
                    <div>
                      <div className="text-xs text-gray-400">年龄</div>
                      <div className="text-sm text-gray-700">{char.age}</div>
                    </div>
                  )}
                  {char.occupation && (
                    <div>
                      <div className="text-xs text-gray-400">职业</div>
                      <div className="text-sm text-gray-700">{char.occupation}</div>
                    </div>
                  )}
                  {char.personality && (
                    <div>
                      <div className="text-xs text-gray-400">性格</div>
                      <div className="text-sm text-gray-700">{char.personality}</div>
                    </div>
                  )}
                </div>

                {/* 可折叠的进阶信息 */}
                <button
                  onClick={() => toggleCard(char.id)}
                  className="w-full px-5 py-2 text-xs text-gray-500 hover:text-gray-700 flex items-center gap-2 border-t border-gray-100"
                >
                  <span className={`transition-transform ${expandedCard === char.id ? "rotate-90" : ""}`}>▶</span>
                  更多信息
                </button>

                {expandedCard === char.id && (
                  <div className="p-5 pt-3 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {char.birthday && (
                        <div>
                          <div className="text-xs text-gray-400">生日</div>
                          <div className="text-sm text-gray-700">{char.birthday}</div>
                        </div>
                      )}
                      {char.height && (
                        <div>
                          <div className="text-xs text-gray-400">身高</div>
                          <div className="text-sm text-gray-700">{char.height}</div>
                        </div>
                      )}
                      {char.weight && (
                        <div>
                          <div className="text-xs text-gray-400">体重</div>
                          <div className="text-sm text-gray-700">{char.weight}</div>
                        </div>
                      )}
                      {char.hair && (
                        <div>
                          <div className="text-xs text-gray-400">发型</div>
                          <div className="text-sm text-gray-700">{char.hair}</div>
                        </div>
                      )}
                    </div>

                    {/* 分类详情 */}
                    {sections.map((section) => {
                      const hasContent = section.id === "basic" ? char.gender || char.age : (
                        section.id === "background" ? char.occupation || char.family :
                        section.id === "appearance" ? char.appearance || char.hair :
                        section.id === "personality" ? char.personality || char.values :
                        section.id === "speech" ? char.tone || char.catchphrase :
                        section.id === "behavior" ? char.actionStyle :
                        section.id === "life" ? char.residence :
                        section.id === "experience" ? char.experience : false
                      );

                      if (!hasContent) return null;

                      const isExpanded = activeSection === section.id;

                      return (
                        <div key={section.id} className="mb-3">
                          <button
                            onClick={() => toggleSection(section.id)}
                            className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-2 mb-2"
                          >
                            <span className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}>▼</span>
                            {section.title}
                          </button>
                          {isExpanded && (
                            <div className="pl-4 text-sm text-gray-600 leading-relaxed">
                              {section.id === "basic" && (
                                <div className="space-y-1">
                                  {char.birthday && <div>生日：{char.birthday}</div>}
                                  {char.height && <div>身高：{char.height}</div>}
                                  {char.weight && <div>体重：{char.weight}</div>}
                                  {char.language && <div>语言：{char.language}</div>}
                                </div>
                              )}
                              {section.id === "background" && (
                                <div className="space-y-1">
                                  {char.family && <div>家世：{char.family}</div>}
                                  {char.socialClass && <div>社会阶层：{char.socialClass}</div>}
                                  {char.education && <div>教育：{char.education}</div>}
                                </div>
                              )}
                              {section.id === "appearance" && (
                                <div className="space-y-1">
                                  {char.hair && <div>发型：{char.hair}</div>}
                                  {char.clothing && <div>衣着：{char.clothing}</div>}
                                  {char.taste && <div>审美：{char.taste}</div>}
                                  {char.signatureItem && <div>标志性物件：{char.signatureItem}</div>}
                                </div>
                              )}
                              {section.id === "personality" && (
                                <div className="space-y-1">
                                  {char.values && <div>价值观：{char.values}</div>}
                                  {char.habits && <div>习惯：{char.habits}</div>}
                                  {char.fears && <div>恐惧：{char.fears}</div>}
                                  {char.desires && <div>欲望：{char.desires}</div>}
                                </div>
                              )}
                              {section.id === "speech" && (
                                <div className="space-y-1">
                                  {char.tone && <div>语气：{char.tone}</div>}
                                  {char.catchphrase && <div>口癖：{char.catchphrase}</div>}
                                  {char.wordChoice && <div>用词偏好：{char.wordChoice}</div>}
                                  {char.rhythm && <div>说话节奏：{char.rhythm}</div>}
                                </div>
                              )}
                              {section.id === "behavior" && (
                                <div className="space-y-1">
                                  {char.actionStyle && <div>行事风格：{char.actionStyle}</div>}
                                  {char.socialStyle && <div>社交方式：{char.socialStyle}</div>}
                                  {char.conflictReaction && <div>冲突反应：{char.conflictReaction}</div>}
                                </div>
                              )}
                              {section.id === "life" && (
                                <div className="space-y-1">
                                  {char.residence && <div>住处：{char.residence}</div>}
                                  {char.transport && <div>交通：{char.transport}</div>}
                                  {char.schedule && <div>作息：{char.schedule}</div>}
                                  {char.hobbies && <div>爱好：{char.hobbies}</div>}
                                </div>
                              )}
                              {section.id === "experience" && char.experience && <div>{char.experience}</div>}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 编辑模态框 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
              <h3 className="text-base font-semibold">{editingCharacter ? "编辑角色" : "新增角色"}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-700 text-xl">×</button>
            </div>

            <div className="overflow-y-auto flex-1 pr-2">
              {/* 必填项 */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">角色名称 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={characterForm.name || ""}
                    onChange={(e) => setCharacterForm({ ...characterForm, name: e.target.value })}
                    placeholder="给角色起个名字"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#111] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">一句话描述 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={characterForm.description || ""}
                    onChange={(e) => setCharacterForm({ ...characterForm, description: e.target.value })}
                    placeholder="例如：沉默寡言的外卖骑手"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#111] transition-colors"
                  />
                </div>
              </div>

              {/* 可折叠的进阶分类 */}
              {sections.map((section) => (
                <div key={section.id} className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-sm font-medium flex items-center gap-2">
                      <span>{section.icon}</span> {section.title}
                    </span>
                    <span className={`text-gray-400 transition-transform ${activeSection === section.id ? "rotate-180" : ""}`}>▼</span>
                  </button>
                  {activeSection === section.id && (
                    <div className="p-4">
                      {renderSectionContent(section.id)}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                disabled={!characterForm.name?.trim() || !characterForm.description?.trim()}
                className="px-5 py-2 text-sm bg-[#111] text-white rounded-lg hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingCharacter ? "保存" : "创建"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}