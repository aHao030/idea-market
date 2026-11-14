import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Building2, CalendarDays, Check, CheckCircle2, FileText, Send, X } from 'lucide-react';
import type { Bounty } from '../types/bounty';
import { formatMoney } from '../lib/fees';
import { RevenueBreakdown } from './RevenueBreakdown';

interface BidSheetProps {
  bounty: Bounty;
  onClose: () => void;
  onSubmit: () => void;
}

export function BidSheet({ bounty, onClose, onSubmit }: BidSheetProps) {
  const [stage, setStage] = useState<'detail' | 'form' | 'success'>('detail');
  const [proposal, setProposal] = useState('');
  const [days, setDays] = useState('14');
  const [error, setError] = useState('');
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', onKey); };
  }, [onClose]);

  const submit = () => {
    if (proposal.trim().length < 30) { setError('请用至少 30 个字说明你的解决思路'); return; }
    if (Number(days) < 1 || Number(days) > 180) { setError('交付周期需在 1–180 天之间'); return; }
    onSubmit();
    setStage('success');
  };

  return (
    <div className="sheet-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="purchase-sheet bid-sheet" role="dialog" aria-modal="true" aria-labelledby="bid-title">
        <button ref={closeRef} className="sheet-close" onClick={onClose} aria-label="关闭悬赏详情"><X size={21} /></button>
        {stage === 'success' ? <div className="payment-success"><span className="success-icon"><Check size={34} /></span><span className="section-kicker">PROPOSAL SUBMITTED</span><h2 id="bid-title">方案已投递。</h2><p>你的投标已保存在本机原型中。企业确认有效后，可参与 10% 投标激励池分配；中标后获得悬赏金额的 70%。</p><button className="primary-button" onClick={onClose}>返回悬赏大厅</button></div> : <>
          <div className="bid-company"><span className="company-logo">{bounty.companyInitials}</span><div><strong>{bounty.company}</strong><span>{bounty.industry} · 企业悬赏</span></div></div>
          <span className="section-kicker">ENTERPRISE BOUNTY</span>
          <h2 id="bid-title" className="bid-title">{bounty.title}</h2>
          <p className="bid-summary">{bounty.summary}</p>
          <div className="bid-meta"><span><CalendarDays size={16} />{bounty.daysLeft} 天后截止</span><span><FileText size={16} />{bounty.proposals} 份方案</span><span><Building2 size={16} />{bounty.category}</span></div>
          <section className="bid-deliverables"><h3>期待交付</h3><ol>{bounty.deliverables.map((item, index) => <li key={item}><span>0{index + 1}</span>{item}</li>)}</ol></section>
          <div className="bid-reward-heading"><div><span>悬赏总额</span><strong>¥ {formatMoney(bounty.budget)}</strong></div><span>分配规则公开透明</span></div>
          <RevenueBreakdown amount={bounty.budget} participantCount={bounty.participantCount} />
          {stage === 'detail' ? <button className="primary-button payment-button" onClick={() => setStage('form')}>提交我的方案 <ArrowRight size={18} /></button> : <section className="bid-form"><label className="form-field"><span>你的解决思路 <small>{proposal.length} 字</small></span><textarea value={proposal} onChange={(event) => { setProposal(event.target.value); setError(''); }} rows={5} placeholder="先说最关键的判断，再写第一步如何做。正式投标可继续补充完整方案与附件。" /></label><label className="form-field"><span>预计交付周期（天）</span><input type="number" min="1" max="180" value={days} onChange={(event) => { setDays(event.target.value); setError(''); }} /></label>{error && <p className="field-error">{error}</p>}<div className="bid-agreement"><CheckCircle2 size={17} />提交即表示同意：若被认定为有效投标，将与其他有效投标者平分 10% 激励池。</div><button className="primary-button payment-button" onClick={submit}><Send size={17} />确认模拟投标</button></section>}
        </>}
      </section>
    </div>
  );
}
