export interface IdeaDraft {
  title: string;
  summary: string;
  category: string;
  details: string;
  evidence: string;
  price: string;
}

export const emptyDraft: IdeaDraft = {
  title: '',
  summary: '',
  category: 'AI 与产品',
  details: '',
  evidence: '灵感',
  price: '29.9',
};

export function validateIdeaDraft(draft: IdeaDraft, step: number) {
  const errors: Partial<Record<'title' | 'summary' | 'details' | 'price', string>> = {};
  if (step === 0) {
    if (draft.title.trim().length < 6) errors.title = '标题至少需要 6 个字';
    if (draft.summary.trim().length < 20) errors.summary = '请用至少 20 个字说明点子的价值';
  }
  if (step === 1 && draft.details.trim().length < 60) errors.details = '完整说明至少需要 60 个字';
  if (step === 2) {
    const price = Number(draft.price);
    if (!Number.isFinite(price) || price < 1 || price > 999) errors.price = '价格需在 1–999 元之间';
  }
  return errors;
}
