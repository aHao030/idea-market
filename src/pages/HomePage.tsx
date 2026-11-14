import { useState } from 'react';
import { ArrowRight, BadgeCheck, BookOpen, Search, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import { IdeaCard } from '../components/IdeaCard';
import { SparkArtwork } from '../components/SparkArtwork';
import { categories } from '../lib/ideas';
import type { Idea } from '../types/idea';

interface HomePageProps {
  ideas: Idea[];
  favorites: string[];
  purchasedIds: string[];
  onOpen: (idea: Idea) => void;
  onToggleFavorite: (id: string) => void;
  onDiscover: (query?: string, category?: string) => void;
  onBounty: () => void;
}

export function HomePage({ ideas, favorites, purchasedIds, onOpen, onToggleFavorite, onDiscover, onBounty }: HomePageProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('全部');
  const featured = ideas.find((idea) => idea.featured) ?? ideas[0];

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    onDiscover(query, category);
  };

  return (
    <div className="page home-page">
      <section className="hero-section">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={15} /> 让想象力，成为下一步</div>
          <h1>好点子，<br />不该只停在<br /><em>脑海里。</em></h1>
          <p>发现一个值得尝试的点子，买下它的完整说明书。<br className="desktop-only" />少一点空想，多一个今天就能开始的行动。</p>
          <form className="hero-search" onSubmit={submitSearch} role="search">
            <Search size={20} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索点子、作者或灵感关键词" aria-label="搜索点子" />
            <button type="submit" aria-label="开始搜索"><ArrowRight size={20} /></button>
          </form>
          <div className="hero-proof">
            <span><BadgeCheck size={16} />证据分级</span>
            <span><BookOpen size={16} />完整方案</span>
            <span><ShieldCheck size={16} />授权清晰</span>
          </div>
        </div>
        <button className="hero-art" onClick={() => onOpen(featured)} aria-label={`查看本周精选：${featured.title}`}>
          <div className="hero-art__back" />
          <SparkArtwork variant={featured.artVariant} large />
          <div className="hero-art__caption">
            <span>本周精选 / EDITOR'S PICK</span>
            <strong>{featured.title}</strong>
            <span className="hero-art__link">查看完整预览 <ArrowRight size={17} /></span>
          </div>
          <span className="hero-sticker">NO.<br /><b>001</b></span>
        </button>
      </section>

      <button className="home-bounty-banner" onClick={onBounty}>
        <span className="home-bounty-banner__label">企业悬赏 · 新模块</span>
        <span className="home-bounty-banner__copy"><strong>好点子，也能解决真实难题。</strong><small>投标有激励，中标获得悬赏金额的 70%</small></span>
        <span className="home-bounty-banner__link">去悬赏大厅 <ArrowRight size={18} /></span>
      </button>

      <section className="content-section idea-feed-section">
        <div className="section-heading">
          <div><span className="section-kicker">FRESH SPARKS</span><h2>刚刚长出的灵感</h2></div>
          <button className="text-link" onClick={() => onDiscover('', category)}>逛全部点子 <ArrowRight size={17} /></button>
        </div>
        <div className="category-scroller" aria-label="点子分类">
          {categories.map((item) => (
            <button key={item} className={category === item ? 'category-pill active' : 'category-pill'} onClick={() => { setCategory(item); if (item !== '全部') onDiscover('', item); }}>{item}</button>
          ))}
        </div>
        <div className="home-content-grid">
          <div className="idea-grid">
            {ideas.filter((idea) => category === '全部' || idea.category === category).slice(0, 4).map((idea) => (
              <IdeaCard key={idea.id} idea={idea} favorite={favorites.includes(idea.id)} purchased={purchasedIds.includes(idea.id)} onOpen={() => onOpen(idea)} onToggleFavorite={() => onToggleFavorite(idea.id)} />
            ))}
          </div>
          <aside className="inspiration-panel">
            <div className="inspiration-panel__top"><TrendingUp size={20} /><span>灵感不是玄学</span></div>
            <h3>你买到的不只是<br />一句“我有个想法”。</h3>
            <p>每份点子都拆开讲清楚：为谁而做、如何开始、需要多少成本，以及已经验证到哪一步。</p>
            <ol>
              <li><span>01</span><div><strong>先看证据等级</strong><p>灵感、完整方案、部分验证、已跑通，所见即所得。</p></div></li>
              <li><span>02</span><div><strong>再算执行成本</strong><p>预算、团队和周期透明，找到适合自己的起点。</p></div></li>
              <li><span>03</span><div><strong>最后放心行动</strong><p>永久阅读，单人非独家实施，授权边界写明白。</p></div></li>
            </ol>
            <button onClick={() => onOpen(featured)}>看看一份点子说明书 <ArrowRight size={17} /></button>
          </aside>
        </div>
      </section>
      <footer className="page-footer"><span>灵感市集 · 让每个好点子有去处</span><span>IDEAS ARE FOR DOING.</span></footer>
    </div>
  );
}
