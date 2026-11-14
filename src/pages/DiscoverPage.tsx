import { useMemo, useState } from 'react';
import { Compass, Search, SearchX, SlidersHorizontal } from 'lucide-react';
import { IdeaCard } from '../components/IdeaCard';
import { categories, filterIdeas } from '../lib/ideas';
import type { Idea } from '../types/idea';

interface DiscoverPageProps {
  ideas: Idea[];
  initialQuery: string;
  initialCategory: string;
  favorites: string[];
  purchasedIds: string[];
  onOpen: (idea: Idea) => void;
  onToggleFavorite: (id: string) => void;
}

export function DiscoverPage({ ideas, initialQuery, initialCategory, favorites, purchasedIds, onOpen, onToggleFavorite }: DiscoverPageProps) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const results = useMemo(() => filterIdeas(query, category, ideas), [query, category, ideas]);

  return (
    <div className="page discover-page">
      <header className="page-title-block">
        <span className="section-kicker"><Compass size={15} /> EXPLORE POSSIBILITIES</span>
        <h1>发现下一个<br /><em>值得做的点子。</em></h1>
        <p>按兴趣找到灵感，也按成本找到适合自己的行动。</p>
      </header>
      <div className="discover-toolbar">
        <label className="discover-search"><Search size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索点子、作者或关键词" aria-label="筛选点子" />{query && <button onClick={() => setQuery('')} aria-label="清空搜索">清除</button>}</label>
        <span className="result-count"><SlidersHorizontal size={16} />{results.length} 个点子</span>
      </div>
      <div className="category-scroller discover-categories" aria-label="筛选分类">
        {categories.map((item) => <button key={item} className={category === item ? 'category-pill active' : 'category-pill'} onClick={() => setCategory(item)}>{item}</button>)}
      </div>
      {results.length > 0 ? (
        <div className="idea-grid discover-grid">
          {results.map((idea) => <IdeaCard key={idea.id} idea={idea} favorite={favorites.includes(idea.id)} purchased={purchasedIds.includes(idea.id)} onOpen={() => onOpen(idea)} onToggleFavorite={() => onToggleFavorite(idea.id)} />)}
        </div>
      ) : (
        <div className="empty-state"><SearchX size={40} /><h2>这颗火花还没被找到</h2><p>试试更短的关键词，或者看看其他分类。</p><button className="primary-button" onClick={() => { setQuery(''); setCategory('全部'); }}>查看全部点子</button></div>
      )}
    </div>
  );
}
