import type { ReactNode } from 'react';
import { Compass, HandCoins, Home, Plus, UserRound, Sparkles } from 'lucide-react';
import type { AppView } from '../types/idea';

interface AppShellProps {
  children: ReactNode;
  view: AppView;
  onNavigate: (view: Exclude<AppView, 'detail'>) => void;
}

const navigation = [
  { id: 'home' as const, label: '首页', icon: Home },
  { id: 'discover' as const, label: '发现', icon: Compass },
  { id: 'bounty' as const, label: '悬赏', icon: HandCoins },
  { id: 'publish' as const, label: '发布', icon: Plus },
  { id: 'profile' as const, label: '我的', icon: UserRound },
];

export function AppShell({ children, view, onNavigate }: AppShellProps) {
  return (
    <div className="app-shell">
      <header className="mobile-header">
        <button className="brand" onClick={() => onNavigate('home')} aria-label="返回灵感市集首页">
          <span className="brand-mark"><Sparkles size={19} /></span>
          <span>灵感市集</span>
        </button>
        <button className="avatar" onClick={() => onNavigate('profile')} aria-label="打开个人中心">予</button>
      </header>
      <aside className="desktop-sidebar">
        <button className="brand" onClick={() => onNavigate('home')}>
          <span className="brand-mark"><Sparkles size={20} /></span>
          <span>灵感市集<small>IDEA MARKET</small></span>
        </button>
        <nav className="side-nav" aria-label="主导航">
          {navigation.map(({ id, label, icon: Icon }) => (
            <button key={id} className={view === id ? 'active' : ''} onClick={() => onNavigate(id)}>
              <Icon size={20} /><span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-note">
          <span className="mini-spark"><Sparkles size={25} /></span>
          <p>不是贩卖脑洞，<br />而是减少一次试错。</p>
          <span>本周已有 128 个点子被解锁</span>
        </div>
        <button className="profile-chip" onClick={() => onNavigate('profile')}>
          <span className="avatar">予</span>
          <span><strong>陈予</strong><small>灵感收藏家</small></span>
        </button>
      </aside>
      <main className="app-main">{children}</main>
      <nav className="bottom-nav" aria-label="主导航">
        {navigation.map(({ id, label, icon: Icon }) => (
          <button key={id} className={`${view === id ? 'active' : ''} ${id === 'publish' ? 'publish-nav' : ''}`} onClick={() => onNavigate(id)} aria-current={view === id ? 'page' : undefined}>
            <span className="bottom-nav__icon"><Icon size={21} /></span>
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
