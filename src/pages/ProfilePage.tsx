import { useState } from 'react';
import { ArrowRight, Bookmark, CheckCircle2, Lightbulb, PackageOpen, Plus, Settings2, Sparkles } from 'lucide-react';
import { IdeaCard } from '../components/IdeaCard';
import type { IdeaDraft } from '../lib/draft';
import type { Idea } from '../types/idea';

interface ProfilePageProps {
  ideas: Idea[];
  purchasedIds: string[];
  favorites: string[];
  draft: IdeaDraft;
  hasPublished: boolean;
  onOpen: (idea: Idea) => void;
  onToggleFavorite: (id: string) => void;
  onNavigate: (view: 'discover' | 'publish') => void;
}

type Tab = 'purchased' | 'favorites' | 'published';

export function ProfilePage({ ideas, purchasedIds, favorites, draft, hasPublished, onOpen, onToggleFavorite, onNavigate }: ProfilePageProps) {
  const [tab, setTab] = useState<Tab>('purchased');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const shownIdeas = tab === 'purchased' ? ideas.filter((idea) => purchasedIds.includes(idea.id)) : tab === 'favorites' ? ideas.filter((idea) => favorites.includes(idea.id)) : [];

  return (
    <div className="page profile-page">
      <section className="profile-hero"><div className="profile-identity"><span className="profile-avatar">予<Sparkles size={21} /></span><div><span className="section-kicker">IDEA COLLECTOR</span><h1>陈予</h1><p>收藏灵感，也认真挑选下一次行动。</p></div></div><button className="profile-settings" onClick={() => setSettingsOpen(!settingsOpen)} aria-expanded={settingsOpen}><Settings2 size={19} />偏好设置</button><div className="profile-stats"><div><strong>{purchasedIds.length}</strong><span>已购点子</span></div><div><strong>{favorites.length}</strong><span>收藏灵感</span></div><div><strong>{hasPublished ? 1 : 0}</strong><span>发布方案</span></div></div></section>
      {settingsOpen && <section className="settings-panel"><div><strong>原型显示偏好</strong><p>设置仅在当前页面生效。</p></div><label><span>减少界面动态效果</span><input type="checkbox" checked={reduceMotion} onChange={(event) => { setReduceMotion(event.target.checked); document.documentElement.classList.toggle('reduce-motion', event.target.checked); }} /></label></section>}
      <div className="profile-tabs" role="tablist" aria-label="我的内容"><button role="tab" aria-selected={tab === 'purchased'} className={tab === 'purchased' ? 'active' : ''} onClick={() => setTab('purchased')}><PackageOpen size={18} />已购点子<span>{purchasedIds.length}</span></button><button role="tab" aria-selected={tab === 'favorites'} className={tab === 'favorites' ? 'active' : ''} onClick={() => setTab('favorites')}><Bookmark size={18} />我的收藏<span>{favorites.length}</span></button><button role="tab" aria-selected={tab === 'published'} className={tab === 'published' ? 'active' : ''} onClick={() => setTab('published')}><Lightbulb size={18} />我的发布<span>{hasPublished ? 1 : 0}</span></button></div>
      {tab === 'published' ? (hasPublished ? <div className="my-published-card"><div><span className="owned-label"><CheckCircle2 size={15} />模拟发布成功</span><span>{draft.category} · {draft.evidence}</span></div><h2>{draft.title}</h2><p>{draft.summary}</p><footer><strong>¥ {draft.price}</strong><button className="text-link" onClick={() => onNavigate('publish')}>继续编辑 <ArrowRight size={17} /></button></footer></div> : <div className="empty-state"><Lightbulb size={40} /><h2>你的第一个展位，虚位以待</h2><p>把经历整理成别人可以行动的点子说明书。</p><button className="primary-button" onClick={() => onNavigate('publish')}><Plus size={18} />发布一个点子</button></div>) : shownIdeas.length > 0 ? <div className="idea-grid profile-grid">{shownIdeas.map((idea) => <IdeaCard key={idea.id} idea={idea} favorite={favorites.includes(idea.id)} purchased={purchasedIds.includes(idea.id)} onOpen={() => onOpen(idea)} onToggleFavorite={() => onToggleFavorite(idea.id)} />)}</div> : <div className="empty-state"><Bookmark size={40} /><h2>{tab === 'purchased' ? '还没有解锁点子' : '还没有收藏灵感'}</h2><p>去发现页逛逛，让下一颗火花有地方落下。</p><button className="primary-button" onClick={() => onNavigate('discover')}>去发现点子 <ArrowRight size={18} /></button></div>}
    </div>
  );
}
