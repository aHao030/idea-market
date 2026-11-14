import { describe, expect, it } from 'vitest';
import { filterIdeas } from './ideas';
import { ideas } from '../data/ideas';

describe('filterIdeas', () => {
  it('matches title and author case-insensitively', () => {
    expect(filterIdeas('旧物', '全部', ideas).map((idea) => idea.id)).toEqual(['community-swap']);
    expect(filterIdeas('林小满', '全部', ideas)).toHaveLength(1);
  });

  it('combines category and query', () => {
    expect(filterIdeas('社区', '产品', ideas)).toHaveLength(0);
  });

  it('returns the original collection for a blank query and all categories', () => {
    expect(filterIdeas('  ', '全部', ideas)).toHaveLength(ideas.length);
  });
});
