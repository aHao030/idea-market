import { describe, expect, it } from 'vitest';
import { validateIdeaDraft } from './draft';

const validDraft = {
  title: '一个足够清晰的点子标题',
  summary: '用一句具体的话说明它帮助谁、解决什么问题，以及为什么值得尝试。',
  details: '完整的执行说明，包含目标用户、第一步行动、预算范围和验证方式。'.repeat(3),
  category: 'AI 与产品',
  evidence: '完整方案',
  price: '29.9',
};

describe('validateIdeaDraft', () => {
  it('rejects short titles and summaries at the content step', () => {
    expect(validateIdeaDraft({ ...validDraft, title: '短', summary: '也短' }, 0)).toEqual({
      title: '标题至少需要 6 个字',
      summary: '请用至少 20 个字说明点子的价值',
    });
  });

  it('requires enough detail before continuing', () => {
    expect(validateIdeaDraft({ ...validDraft, details: '还没有写清楚' }, 1).details).toBe('完整说明至少需要 60 个字');
  });

  it('accepts a complete draft and a price within the allowed range', () => {
    expect(validateIdeaDraft(validDraft, 0)).toEqual({});
    expect(validateIdeaDraft(validDraft, 2)).toEqual({});
    expect(validateIdeaDraft({ ...validDraft, price: '0' }, 2).price).toBe('价格需在 1–999 元之间');
  });
});
