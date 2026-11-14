export type EvidenceLevel = '灵感' | '完整方案' | '部分验证' | '已跑通';

export interface IdeaAuthor {
  name: string;
  initials: string;
  role: string;
  sales: number;
  rating: number;
}

export interface Idea {
  id: string;
  title: string;
  summary: string;
  category: string;
  price: number;
  author: IdeaAuthor;
  evidence: EvidenceLevel;
  evidenceNote: string;
  budget: string;
  team: string;
  duration: string;
  license: string;
  sales: number;
  favorites: number;
  rating: number;
  tags: string[];
  includes: string[];
  preview: string[];
  fullContent: string[];
  steps: string[];
  attachments: string[];
  artVariant: number;
  featured?: boolean;
}

export type AppView = 'home' | 'discover' | 'bounty' | 'publish' | 'profile' | 'detail';
