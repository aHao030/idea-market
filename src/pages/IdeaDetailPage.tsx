import { ArrowLeft, Bookmark, Check, CheckCircle2, Clock3, Download, FileText, LockKeyhole, ShieldCheck, Star, Users, WalletCards } from 'lucide-react';
import { SparkArtwork } from '../components/SparkArtwork';
import { RevenueBreakdown } from '../components/RevenueBreakdown';
import type { Idea } from '../types/idea';

interface IdeaDetailPageProps {
  idea: Idea;
  favorite: boolean;
  purchased: boolean;
  onBack: () => void;
  onToggleFavorite: () => void;
  onBuy: () => void;
}

export function IdeaDetailPage({ idea, favorite, purchased, onBack, onToggleFavorite, onBuy }: IdeaDetailPageProps) {
  const downloadAttachment = (name: string) => {
    const content = `《${idea.title}》\n\n附件：${name}\n\n这是 UI 原型生成的示例附件，用于演示已解锁后的下载流程。\n\n执行步骤：\n${idea.steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}`;
    const url = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${name}.示例.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page detail-page">
      <div className="detail-topbar">
        <button className="back-button" onClick={onBack}><ArrowLeft size={19} />返回点子列表</button>
        <button className={`detail-favorite ${favorite ? 'is-favorite' : ''}`} onClick={onToggleFavorite}><Bookmark size={18} fill={favorite ? 'currentColor' : 'none'} />{favorite ? '已收藏' : '收藏'}</button>
      </div>
      <div className="detail-layout">
        <article className="detail-article">
          <header className="detail-header">
            <div className="detail-labels"><span>{idea.category}</span><span className={`evidence evidence--${idea.evidence}`}>{idea.evidence}</span></div>
            <h1>{idea.title}</h1>
            <p className="detail-summary">{idea.summary}</p>
            <div className="detail-author"><span className="avatar">{idea.author.initials}</span><div><strong>{idea.author.name}<CheckCircle2 size={14} /></strong><span>{idea.author.role} · 已售 {idea.author.sales} 份方案</span></div><span className="rating"><Star size={15} fill="currentColor" />{idea.rating}</span></div>
          </header>
          <SparkArtwork variant={idea.artVariant} large />
          <section className="execution-strip" aria-label="执行信息">
            <div><WalletCards size={20} /><span>启动预算</span><strong>{idea.budget}</strong></div>
            <div><Users size={20} /><span>适合团队</span><strong>{idea.team}</strong></div>
            <div><Clock3 size={20} /><span>启动周期</span><strong>{idea.duration}</strong></div>
          </section>
          <section className="evidence-note"><CheckCircle2 size={23} /><div><strong>这份点子已经走到：{idea.evidence}</strong><p>{idea.evidenceNote}</p></div></section>
          <section className="detail-section">
            <span className="section-kicker">FREE PREVIEW</span><h2>先读一点，再决定</h2>
            {idea.preview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </section>
          <section className="detail-section content-outline">
            <span className="section-kicker">WHAT'S INSIDE</span><h2>一份能开始行动的说明书</h2>
            <div className="include-grid">{idea.includes.map((item, index) => <div key={item}><span>0{index + 1}</span><strong>{item}</strong><Check size={17} /></div>)}</div>
          </section>
          {purchased ? (
            <section className="detail-section unlocked-content">
              <div className="unlocked-heading"><div><span className="section-kicker">FULL BLUEPRINT</span><h2>完整点子说明书</h2></div><span className="owned-label"><CheckCircle2 size={15} />已解锁</span></div>
              {idea.fullContent.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <h3>从这里开始</h3>
              <ol className="action-steps">{idea.steps.map((step, index) => <li key={step}><span>{index + 1}</span><p>{step}</p></li>)}</ol>
              <div className="attachment-list"><h3>方案附件</h3>{idea.attachments.map((name) => <button key={name} onClick={() => downloadAttachment(name)}><FileText size={19} /><span>{name}<small>示例附件 · 文本格式</small></span><Download size={18} /></button>)}</div>
            </section>
          ) : (
            <section className="locked-preview" aria-label="完整内容尚未解锁">
              <div className="locked-preview__fade">{idea.fullContent[0].slice(0, 88)}……</div>
              <div className="locked-preview__message"><LockKeyhole size={24} /><h3>剩下的，是让点子落地的部分</h3><p>解锁完整正文、执行步骤与 {idea.attachments.length} 份示例附件。</p><button className="primary-button" onClick={onBuy}>¥ {idea.price} 解锁完整方案</button></div>
            </section>
          )}
          <section className="license-note"><ShieldCheck size={24} /><div><h3>买得明白，用得放心</h3><p>{idea.license}。购买后可永久阅读，不可转售、公开传播或用于多人团队商业授权。</p></div></section>
        </article>
        <aside className="purchase-card">
          <span className="section-kicker">IDEA BLUEPRINT</span>
          {purchased ? <><h2>这份灵感<br />已经属于你。</h2><div className="purchase-success"><CheckCircle2 size={22} />完整内容已解锁</div><p>向下阅读完整方案与执行步骤，也可以下载随附的示例附件。</p><button className="secondary-button" onClick={() => document.querySelector('.unlocked-content')?.scrollIntoView({ behavior: 'smooth' })}>开始阅读</button></> : <><div className="purchase-price"><small>¥</small>{idea.price}</div><h2>把“如果”变成<br />“下一步”。</h2><p>一次解锁，永久阅读。获得完整正文、执行步骤与全部附件。</p><ul>{idea.includes.map((item) => <li key={item}><Check size={16} />{item}</li>)}</ul><button className="primary-button" onClick={onBuy}>解锁完整方案</button><span className="purchase-card__hint">UI 原型 · 不会发生真实扣款</span></>}
          <details className="fee-details"><summary>查看购买分账明细</summary><RevenueBreakdown amount={idea.price} primaryLabel="点子创作者" participantLabel="共创激励池" compact /></details>
          <div className="purchase-card__license"><ShieldCheck size={17} />{idea.license}</div>
        </aside>
      </div>
      {!purchased && <div className="mobile-purchase-bar"><div><small>完整方案</small><strong>¥ {idea.price}</strong></div><button className="primary-button" onClick={onBuy}>立即解锁</button></div>}
    </div>
  );
}
