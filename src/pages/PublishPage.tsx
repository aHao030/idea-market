import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, FileText, Lightbulb, Save, ShieldCheck, Sparkles } from 'lucide-react';
import { categories } from '../lib/ideas';
import { emptyDraft, validateIdeaDraft, type IdeaDraft } from '../lib/draft';

interface PublishPageProps {
  draft: IdeaDraft;
  onChange: (draft: IdeaDraft) => void;
  onSaved: () => void;
  onPublished: () => void;
}

const steps = [{ label: '点子内容', hint: '说清楚价值' }, { label: '完整预览', hint: '补充行动方案' }, { label: '定价发布', hint: '明确授权范围' }];

export function PublishPage({ draft, onChange, onSaved, onPublished }: PublishPageProps) {
  const [step, setStep] = useState(0);
  const [published, setPublished] = useState(false);
  const [errors, setErrors] = useState<ReturnType<typeof validateIdeaDraft>>({});
  const update = (field: keyof IdeaDraft, value: string) => { onChange({ ...draft, [field]: value }); setErrors({ ...errors, [field]: undefined }); };

  const next = () => {
    const nextErrors = validateIdeaDraft(draft, step);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    if (step < 2) { setStep(step + 1); window.scrollTo({ top: 0, behavior: 'instant' }); }
    else { setPublished(true); onPublished(); window.scrollTo({ top: 0, behavior: 'instant' }); }
  };

  if (published) return (
    <div className="page publish-page"><div className="publish-success"><span className="success-icon"><Check size={36} /></span><span className="section-kicker">YOUR SPARK IS OUT THERE</span><h1>你的点子，<br />已经有自己的展位了。</h1><p>《{draft.title}》已完成模拟发布。真实产品中，它会先进入内容审核，再出现在灵感市集。</p><div className="published-ticket"><span>{draft.category} · {draft.evidence}</span><h3>{draft.title}</h3><p>{draft.summary}</p><strong>¥ {draft.price}</strong></div><button className="primary-button" onClick={() => { onChange({ ...emptyDraft }); setPublished(false); setStep(0); }}><Sparkles size={18} />再发布一个点子</button></div></div>
  );

  return (
    <div className="page publish-page">
      <header className="publish-header"><span className="section-kicker"><Lightbulb size={15} /> SHARE YOUR SPARK</span><h1>把你的灵感，<br /><em>变成别人的起点。</em></h1><p>不必证明它能改变世界，先讲清楚它为什么值得试一次。</p></header>
      <div className="publish-stepper">{steps.map((item, index) => <button key={item.label} className={`${step === index ? 'active' : ''} ${step > index ? 'done' : ''}`} onClick={() => { if (index < step) setStep(index); }} disabled={index > step}><span>{step > index ? <Check size={16} /> : index + 1}</span><div><strong>{item.label}</strong><small>{item.hint}</small></div></button>)}</div>
      <div className="publish-layout">
        <section className="publish-form-card">
          {step === 0 && <div className="form-step"><div className="form-step__heading"><span>01 / IDEA</span><h2>先用一句话，让人停下来。</h2><p>好的标题具体、有画面，不堆砌“颠覆”和“赋能”。</p></div><label className="form-field"><span>点子标题 <small>{draft.title.length}/40</small></span><input value={draft.title} maxLength={40} onChange={(event) => update('title', event.target.value)} placeholder="例如：把小票变成家庭账本的 AI 收纳员" aria-invalid={Boolean(errors.title)} />{errors.title && <em className="field-error">{errors.title}</em>}</label><label className="form-field"><span>一句话介绍 <small>{draft.summary.length}/100</small></span><textarea value={draft.summary} maxLength={100} onChange={(event) => update('summary', event.target.value)} placeholder="它帮助谁，解决什么问题？为什么值得花一次下午去尝试？" rows={4} aria-invalid={Boolean(errors.summary)} />{errors.summary && <em className="field-error">{errors.summary}</em>}</label><label className="form-field"><span>点子分类</span><select value={draft.category} onChange={(event) => update('category', event.target.value)}>{categories.slice(1).map((category) => <option key={category}>{category}</option>)}</select></label></div>}
          {step === 1 && <div className="form-step"><div className="form-step__heading"><span>02 / BLUEPRINT</span><h2>不只说想法，也给下一步。</h2><p>购买后才能看到这部分。写清楚行动路径、预算与验证方式。</p></div><label className="form-field"><span>完整点子说明 <small>{draft.details.length} 字</small></span><textarea className="details-textarea" value={draft.details} onChange={(event) => update('details', event.target.value)} placeholder={'建议包含：\n1. 目标用户与真实场景\n2. 最小可行版本如何开始\n3. 所需预算、人员和时间\n4. 你已经做过的验证与踩过的坑'} rows={12} aria-invalid={Boolean(errors.details)} />{errors.details && <em className="field-error">{errors.details}</em>}</label><fieldset className="evidence-options"><legend>目前验证到哪一步？</legend>{['灵感', '完整方案', '部分验证', '已跑通'].map((level) => <label key={level} className={draft.evidence === level ? 'selected' : ''}><input type="radio" name="evidence" value={level} checked={draft.evidence === level} onChange={(event) => update('evidence', event.target.value)} /><span>{level}</span></label>)}</fieldset><div className="form-tip"><FileText size={20} /><p>真实发布时还可上传执行表、原型和复盘材料。本原型先展示内容填写流程。</p></div></div>}
          {step === 2 && <div className="form-step"><div className="form-step__heading"><span>03 / PRICE & LICENSE</span><h2>给灵感定价，也把边界说清。</h2><p>价格不是想象力的标价，而是整理与验证工作的价值。</p></div><div className="publish-preview"><span>{draft.category} · {draft.evidence}</span><h3>{draft.title}</h3><p>{draft.summary}</p></div><label className="form-field price-field"><span>方案售价</span><div><b>¥</b><input type="number" min="1" max="999" step="0.1" value={draft.price} onChange={(event) => update('price', event.target.value)} aria-invalid={Boolean(errors.price)} /></div>{errors.price && <em className="field-error">{errors.price}</em>}<small>建议价格 9.9–99 元，本原型不处理真实交易或分成。</small></label><div className="license-box"><ShieldCheck size={24} /><div><strong>默认授权方式</strong><p>买家永久阅读，获得单人非独家实施权；不得转售、公开传播或用于多人团队商业授权。</p></div></div></div>}
          <div className="form-actions">{step > 0 ? <button className="secondary-button" onClick={() => setStep(step - 1)}><ArrowLeft size={17} />上一步</button> : <button className="secondary-button" onClick={onSaved}><Save size={17} />保存草稿</button>}<button className="primary-button" onClick={next}>{step === 2 ? '确认模拟发布' : '继续'}<ArrowRight size={18} /></button></div>
        </section>
        <aside className="publish-guide"><span className="guide-number">“</span><h3>人们愿意为<br />确定性付费。</h3><p>一个好卖点不是“这个想法很酷”，而是“看完以后，我知道明天该做什么”。</p><ul><li><CheckCircle2 size={17} />真实经历比宏大趋势更动人</li><li><CheckCircle2 size={17} />具体模板比抽象建议更有用</li><li><CheckCircle2 size={17} />诚实标注验证程度，才能积累信任</li></ul><span className="guide-footnote">草稿会自动保存在本机浏览器</span></aside>
      </div>
    </div>
  );
}
