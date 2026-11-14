export interface Bounty {
  id: string;
  title: string;
  company: string;
  companyInitials: string;
  industry: string;
  summary: string;
  category: string;
  budget: number;
  deadline: string;
  daysLeft: number;
  proposals: number;
  participantCount: number;
  deliverables: string[];
  skills: string[];
  featured?: boolean;
  custom?: boolean;
}

export interface BountyDraft {
  title: string;
  company: string;
  summary: string;
  category: string;
  budget: string;
  participantCount: string;
  deadline: string;
}
