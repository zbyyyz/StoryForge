export interface Character {
  id: string;
  name: string;
  description: string;
  gender?: string;
  age?: string;
  birthday?: string;
  height?: string;
  weight?: string;
  language?: string;
  occupation?: string;
  family?: string;
  socialClass?: string;
  education?: string;
  appearance?: string;
  hair?: string;
  clothing?: string;
  taste?: string;
  signatureItem?: string;
  personality?: string;
  values?: string;
  habits?: string;
  fears?: string;
  desires?: string;
  tone?: string;
  catchphrase?: string;
  wordChoice?: string;
  rhythm?: string;
  actionStyle?: string;
  socialStyle?: string;
  conflictReaction?: string;
  residence?: string;
  transport?: string;
  schedule?: string;
  hobbies?: string;
  experience?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface WorldSection {
  id: string;
  title: string;
  content: string;
}

export interface Worldview {
  id: string;
  name: string;
  type: string;
  description: string;
  sections: WorldSection[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Work {
  id: string;
  title: string;
  type: string;
  desc?: string;
  color?: string;
  createdAt: string;
  characterIds: string[];
  worldviewId: string | null;
  stylePresetId: string | null;
  localCharacters: Character[];
  localWorldview: Worldview | null;
}

export interface Chapter {
  id: string;
  workId: string;
  title: string;
  status: "empty" | "skeleton" | "expanded" | "done";
  words?: string;
}
