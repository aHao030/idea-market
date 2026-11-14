import type { Idea } from '../types/idea';

export const filterIdeas = (query: string, category: string, source: Idea[]) => {
  const keyword = query.trim().toLocaleLowerCase('zh-CN');
  return source.filter((idea) => {
    const categoryMatches = category === '全部' || idea.category === category;
    const haystack = `${idea.title}${idea.author.name}${idea.summary}${idea.tags.join('')}`.toLocaleLowerCase('zh-CN');
    return categoryMatches && (!keyword || haystack.includes(keyword));
  });
};

export const categories = ['全部', 'AI 与产品', '本地生意', '内容创意', '生活方式'];
