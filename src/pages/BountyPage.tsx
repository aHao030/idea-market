import { useMemo, useState } from 'react';
import { ArrowRight, CalendarDays, CheckCircle2, ChevronDown, CircleDollarSign, FileText, HandCoins, Plus, Send, Sparkles, Trophy, UsersRound } from 'lucide-react';
import { bounties as defaultBounties } from '../data/bounties';
import { usePersistentState } from '../hooks/usePersistentState';
import { formatMoney } from '../lib/fees';
import type { Bounty, BountyDraft } from '../types/bounty';
import { BidSheet } from '../components/BidSheet';
import { RevenueBreakdown } from '../components/RevenueBreakdown';

const emptyBountyDraft: BountyDraft = { title: '', company: '', summary: '', category: '产品与服务', budget: '50000', participantCount: '20', deadline: '2026-12-15' };
const categories = ['全部', '空间与体验', '产品与服务', 'AI 与数据', '内容与社群'];

interface BountyPageProps { onToast: (message: string) => void; }

export function BountyPage({ onToast }: BountyPageProps) {
  const [tab, setTab] = useState<'hall' | 'publish'>('hall');
  const [category, setCategory] = useState('全部');
  const [sort, setSort] = useState('recommended');
  const [selected, setSelected] = useState<Bounty | null>(null);
  const [customBounties, setCustomBounties] = usePersistentState<Bounty[]>('idea-market-custom-bounties', []);
  const [submittedBids, setSubmittedBids] = usePersistentState<string[]>('idea-market-bids', []);
  const [draft, setDraft] = usePersistentState<BountyDraft>('idea-market-bounty-draft', emptyBountyDraft);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const allBounties = useMemo(() => [...customBounties, ...defaultBounties], [customBounties]);
  const filtered = useMemo(() => {
    const result = allBounties.filter((bounty) => category === '全部' || bounty.category === category);
    return [...result].sort((a, b) => sort === 'budget' ? b.budget - a.budget : sort === 'deadline' ? a.daysLeft - b.daysLeft : Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
  }, [allBounties, category, sort]);
  const update = (field: keyof BountyDraft, value: string) => { setDraft((current) => ({ ...current, [field]: value })); setErrors((current) => ({ ...current, [field]: '' })); };

  const publish = () => {
    const nextErrors: Record<string, string> = {};
    if (draft.title.trim().length < 8) nextErrors.title = '悬赏标题至少需要 8 个字';
    if (draft.company.trim().length < 2) nextErrors.company = '请填写企业或团队名称';
    if (draft.summary.trim().length < 30) nextErrors.summary = '请用至少 30 个字描述真实问题与期待结果';
    if (Number(draft.budget) < 1000) nextErrors.budget = '悬赏金额至少为 1,000 元';
    if (Number(draft.participantCount) < 1) nextErrors.participantCount = '预计有效投标人数至少为 1 人';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    const bounty: Bounty = {
      id: `custom-bounty-${Date.now()}`, title: draft.title.trim(), company: draft.company.trim(), companyInitials: draft.company.trim().slice(0, 1), industry: '新入驻企业', category: draft.category,
      summary: draft.summary.trim(), budget: Number(draft.budget), deadline: draft.deadline, daysLeft: Math.max(1, Math.ceil((new Date(draft.deadline).getTime() - Date.now()) / 86400000)), proposals: 0, participantCount: Number(draft.participantCount), custom: true,
      deliverables: ['针对问题的完整解决方案', '可验证的执行步骤与预算', '项目复盘与效果说明'], skills: ['开放共创', '解决方案', '落地执行'],
    };
    setCustomBounties((current) => [bounty, ...current]);
    setDraft(emptyBountyDraft);
    setTab('hall');
    setCategory('全部');
    onToast('企业悬赏已完成模拟发布');
  };

  return (
    <div className="page bounty-page">
      <header className="bounty-hero">
        <div><span className="section-kicker"><HandCoins size={16} /> ENTERPRISE BOUNTIES</span><h1>把真实难题，<br />交给<span>千万种想象。</span></h1><p>企业发布悬赏，创作者用方案竞标。每一份认真思考有回报，真正解决问题的方案获得更多。</p><button className="hero-cta" onClick={() => setTab('publish')}><Plus size={18} />发布企业悬赏</button></div>
        <div className="bounty-hero__ticket"><span>一个悬赏，如何分配？</span><div><strong>70<small>%</small></strong><p>中标方案</p></div><div><strong>10<small>%</small></strong><p>有效投标激励池</p></div><div><strong>10<small>%</small></strong><p>平台服务费</p></div><div><strong>10<small>%</small></strong><p>待分配</p></div><small>每一分钱的去向，都摆在台面上。</small></div>
      </header>
      <div className="bounty-tabs" role="tablist" aria-label="企业悬赏功能"><button role="tab" aria-selected={tab === 'hall'} className={tab === 'hall' ? 'active' : ''} onClick={() => setTab('hall')}><Trophy size={18} />悬赏大厅</button><button role="tab" aria-selected={tab === 'publish'} className={tab === 'publish' ? 'active' : ''} onClick={() => setTab('publish')}><Plus size={18} />发布悬赏</button></div>
      {tab === 'hall' ? <section className="bounty-hall">
        <div className="bounty-hall__heading"><div><span className="section-kicker">OPEN CALLS</span><h2>正在寻找答案的企业</h2></div><label className="sort-select"><span>排序</span><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="悬赏排序"><option value="recommended">推荐优先</option><option value="budget">金额最高</option><option value="deadline">最近截止</option></select><ChevronDown size={15} /></label></div>
        <div className="category-scroller">{categories.map((item) => <button key={item} className={category === item ? 'category-pill active' : 'category-pill'} onClick={() => setCategory(item)}>{item}</button>)}</div>
        <div className="bounty-grid">{filtered.map((bounty) => <article className="bounty-card" key={bounty.id}>
          <div className="bounty-card__top"><div className="bid-company"><span className="company-logo">{bounty.companyInitials}</span><div><strong>{bounty.company}</strong><span>{bounty.industry}</span></div></div>{bounty.featured && <span className="featured-label"><Sparkles size={12} />重点悬赏</span>}{bounty.custom && <span className="featured-label">新发布</span>}</div>
          <span className="bounty-category">{bounty.category}</span><h3>{bounty.title}</h3><p>{bounty.summary}</p>
          <div className="skill-list">{bounty.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
          <div className="bounty-reward"><div><span>悬赏总额</span><strong>¥ {formatMoney(bounty.budget)}</strong></div><div><span>中标可得 70%</span><strong>¥ {formatMoney(bounty.budget * 0.7)}</strong></div></div>
          <div className="bounty-card__meta"><span><CalendarDays size={15} />{bounty.daysLeft} 天后截止</span><span><FileText size={15} />{bounty.proposals + (submittedBids.includes(bounty.id) ? 1 : 0)} 份方案</span>{submittedBids.includes(bounty.id) && <span className="bid-submitted"><CheckCircle2 size={14} />已投标</span>}</div>
          <button className="bounty-open" onClick={() => setSelected(bounty)}>{submittedBids.includes(bounty.id) ? '查看悬赏与投标状态' : '查看悬赏并投标'}<ArrowRight size={18} /></button>
        </article>)}</div>
      </section> : <section className="bounty-publish-layout">
        <div className="bounty-publish-form"><div className="form-step__heading"><span>CREATE AN OPEN CALL</span><h2>把问题说清楚，答案才会靠近。</h2><p>好的悬赏描述真实场景、约束条件与期待交付，而不是只写一个宏大主题。</p></div>
          <label className="form-field"><span>悬赏标题</span><input value={draft.title} onChange={(event) => update('title', event.target.value)} placeholder="例如：让社区食堂吸引更多年轻人" />{errors.title && <em className="field-error">{errors.title}</em>}</label>
          <div className="form-two-columns"><label className="form-field"><span>企业 / 团队名称</span><input value={draft.company} onChange={(event) => update('company', event.target.value)} placeholder="你的企业名称" />{errors.company && <em className="field-error">{errors.company}</em>}</label><label className="form-field"><span>悬赏分类</span><select value={draft.category} onChange={(event) => update('category', event.target.value)}>{categories.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label></div>
          <label className="form-field"><span>问题背景与期待结果 <small>{draft.summary.length} 字</small></span><textarea rows={6} value={draft.summary} onChange={(event) => update('summary', event.target.value)} placeholder="目前遇到了什么问题？谁受到影响？已经尝试过什么？希望投标者交付哪些具体结果？" />{errors.summary && <em className="field-error">{errors.summary}</em>}</label>
          <div className="form-two-columns"><label className="form-field"><span>悬赏总额（元）</span><input type="number" min="1000" step="100" value={draft.budget} onChange={(event) => update('budget', event.target.value)} />{errors.budget && <em className="field-error">{errors.budget}</em>}</label><label className="form-field"><span>预计有效投标人数</span><input type="number" min="1" max="1000" value={draft.participantCount} onChange={(event) => update('participantCount', event.target.value)} />{errors.participantCount && <em className="field-error">{errors.participantCount}</em>}</label></div>
          <label className="form-field"><span>投标截止日期</span><input type="date" value={draft.deadline} onChange={(event) => update('deadline', event.target.value)} /></label>
          <div className="bounty-publish-actions"><span><CircleDollarSign size={17} />仅模拟发布，不会托管真实资金</span><button className="primary-button" onClick={publish}><Send size={17} />确认模拟发布</button></div>
        </div>
        <aside className="bounty-calculator"><span className="section-kicker"><UsersRound size={15} /> LIVE CALCULATOR</span><h3>这笔钱，会如何分？</h3><div className="calculator-total"><span>当前悬赏总额</span><strong>¥ {formatMoney(Number(draft.budget) || 0)}</strong></div><RevenueBreakdown amount={Number(draft.budget) || 0} participantCount={Number(draft.participantCount) || 0} /><p>投标激励按预计 {Number(draft.participantCount) || 0} 位有效参与者估算，实际按通过审核的人数平分。</p></aside>
      </section>}
      {selected && <BidSheet bounty={selected} onClose={() => setSelected(null)} onSubmit={() => { if (!submittedBids.includes(selected.id)) setSubmittedBids((current) => [...current, selected.id]); onToast('投标方案已保存到本机'); }} />}
    </div>
  );
}
