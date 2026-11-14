import { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import './App.css';
import { AppShell } from './components/AppShell';
import { PurchaseSheet } from './components/PurchaseSheet';
import { ideas } from './data/ideas';
import { usePersistentState } from './hooks/usePersistentState';
import { emptyDraft } from './lib/draft';
import { BountyPage } from './pages/BountyPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { HomePage } from './pages/HomePage';
import { IdeaDetailPage } from './pages/IdeaDetailPage';
import { ProfilePage } from './pages/ProfilePage';
import { PublishPage } from './pages/PublishPage';
import type { AppView, Idea } from './types/idea';

export default function App() {
  const [view, setView] = useState<AppView>('home');
  const [previousView, setPreviousView] = useState<Exclude<AppView, 'detail'>>('home');
  const [selectedIdea, setSelectedIdea] = useState<Idea>(ideas[0]);
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [discoverRequest, setDiscoverRequest] = useState({ query: '', category: '全部', key: 0 });
  const [favorites, setFavorites] = usePersistentState<string[]>('idea-market-favorites', ['ai-receipt-butler']);
  const [purchasedIds, setPurchasedIds] = usePersistentState<string[]>('idea-market-purchased', ['coffee-morning-map']);
  const [draft, setDraft] = usePersistentState('idea-market-draft', emptyDraft);
  const [hasPublished, setHasPublished] = usePersistentState('idea-market-published', false);
  const [toast, setToast] = useState('');

  useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(''), 2600); return () => window.clearTimeout(timer); }, [toast]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [view]);

  const navigate = (next: Exclude<AppView, 'detail'>) => { setView(next); if (next === 'discover') setDiscoverRequest((current) => ({ ...current, key: current.key + 1 })); };
  const openIdea = (idea: Idea) => { if (view !== 'detail') setPreviousView(view); setSelectedIdea(idea); setView('detail'); };
  const discover = (query = '', category = '全部') => { setDiscoverRequest((current) => ({ query, category, key: current.key + 1 })); setView('discover'); };
  const toggleFavorite = (id: string) => {
    const removing = favorites.includes(id);
    setFavorites(removing ? favorites.filter((item) => item !== id) : [...favorites, id]);
    setToast(removing ? '已取消收藏' : '已收藏这颗灵感');
  };
  const closePurchase = useCallback(() => setPurchaseOpen(false), []);

  return (
    <AppShell view={view} onNavigate={navigate}>
      {view === 'home' && <HomePage ideas={ideas} favorites={favorites} purchasedIds={purchasedIds} onOpen={openIdea} onToggleFavorite={toggleFavorite} onDiscover={discover} onBounty={() => navigate('bounty')} />}
      {view === 'discover' && <DiscoverPage key={discoverRequest.key} ideas={ideas} initialQuery={discoverRequest.query} initialCategory={discoverRequest.category} favorites={favorites} purchasedIds={purchasedIds} onOpen={openIdea} onToggleFavorite={toggleFavorite} />}
      {view === 'bounty' && <BountyPage onToast={setToast} />}
      {view === 'detail' && <IdeaDetailPage idea={selectedIdea} favorite={favorites.includes(selectedIdea.id)} purchased={purchasedIds.includes(selectedIdea.id)} onBack={() => setView(previousView)} onToggleFavorite={() => toggleFavorite(selectedIdea.id)} onBuy={() => setPurchaseOpen(true)} />}
      {view === 'publish' && <PublishPage draft={draft} onChange={setDraft} onSaved={() => setToast('草稿已保存到本机浏览器')} onPublished={() => { setHasPublished(true); setToast('点子已完成模拟发布'); }} />}
      {view === 'profile' && <ProfilePage ideas={ideas} purchasedIds={purchasedIds} favorites={favorites} draft={draft} hasPublished={hasPublished} onOpen={openIdea} onToggleFavorite={toggleFavorite} onNavigate={navigate} />}
      {purchaseOpen && <PurchaseSheet idea={selectedIdea} onClose={closePurchase} onUnlock={() => setPurchasedIds((current) => current.includes(selectedIdea.id) ? current : [...current, selectedIdea.id])} />}
      {toast && <div className="toast" role="status"><CheckCircle2 size={18} />{toast}<button onClick={() => setToast('')} aria-label="关闭提示"><X size={16} /></button></div>}
    </AppShell>
  );
}
