import { useEffect, useRef, useState } from 'react';
import { Check, CheckCircle2, LoaderCircle, LockKeyhole, ShieldCheck, X } from 'lucide-react';
import type { Idea } from '../types/idea';
import { RevenueBreakdown } from './RevenueBreakdown';

interface PurchaseSheetProps {
  idea: Idea;
  onClose: () => void;
  onUnlock: () => void;
}

export function PurchaseSheet({ idea, onClose, onUnlock }: PurchaseSheetProps) {
  const [status, setStatus] = useState<'confirm' | 'processing' | 'success'>('confirm');
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const handleKey = (event: KeyboardEvent) => { if (event.key === 'Escape' && status !== 'processing') onClose(); };
    document.addEventListener('keydown', handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handleKey); document.body.style.overflow = previousOverflow; };
  }, [onClose, status]);

  const pay = () => {
    setStatus('processing');
    window.setTimeout(() => { onUnlock(); setStatus('success'); }, 850);
  };

  return (
    <div className="sheet-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget && status !== 'processing') onClose(); }}>
      <section className="purchase-sheet" role="dialog" aria-modal="true" aria-labelledby="purchase-title">
        <button ref={closeRef} className="sheet-close" onClick={onClose} disabled={status === 'processing'} aria-label="关闭购买弹窗"><X size={21} /></button>
        {status === 'success' ? (
          <div className="payment-success"><span className="success-icon"><Check size={34} /></span><span className="section-kicker">UNLOCKED</span><h2 id="purchase-title">灵感已解锁。</h2><p>《{idea.title}》的完整正文、执行步骤和示例附件，现在都可以查看了。</p><button className="primary-button" onClick={onClose}>开始阅读完整方案</button><span>已保存到「我的 · 已购点子」</span></div>
        ) : (
          <>
            <div className="sheet-heading"><span className="sheet-icon"><LockKeyhole size={23} /></span><span className="section-kicker">UNLOCK AN IDEA</span><h2 id="purchase-title">让这颗火花，<br />在你手里发生。</h2></div>
            <div className="order-idea"><div><span>{idea.category} · {idea.evidence}</span><strong>{idea.title}</strong><small>{idea.author.name} 的点子说明书</small></div><strong>¥ {idea.price}</strong></div>
            <ul className="order-benefits"><li><CheckCircle2 size={17} />完整正文与分步执行清单</li><li><CheckCircle2 size={17} />{idea.attachments.length} 份可下载示例附件</li><li><CheckCircle2 size={17} />永久阅读 · 单人非独家实施权</li></ul>
            <details className="fee-details purchase-fee-details" open><summary>这笔费用如何分配？<span>70% 创作者 · 10% 服务费</span></summary><RevenueBreakdown amount={idea.price} primaryLabel="点子创作者" participantLabel="共创激励池" /></details>
            <div className="demo-payment"><ShieldCheck size={19} /><div><strong>模拟支付</strong><p>这是 UI 交互演示，不会调用支付服务，也不会产生任何扣款。</p></div></div>
            <button className="primary-button payment-button" onClick={pay} disabled={status === 'processing'}>{status === 'processing' ? <><LoaderCircle className="spin" size={19} />正在模拟解锁…</> : `确认支付 ¥ ${idea.price}`}</button>
            <p className="sheet-terms">点击即表示你了解本页的授权范围，不可转售或公开传播。</p>
          </>
        )}
      </section>
    </div>
  );
}
