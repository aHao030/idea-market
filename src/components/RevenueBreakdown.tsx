import { CircleHelp, HandCoins, Landmark, Trophy, UsersRound } from 'lucide-react';
import { calculateRevenueSplit, formatMoney } from '../lib/fees';

interface RevenueBreakdownProps {
  amount: number;
  participantCount?: number;
  primaryLabel?: string;
  participantLabel?: string;
  compact?: boolean;
}

export function RevenueBreakdown({ amount, participantCount = 1, primaryLabel = '中标者', participantLabel = '有效投标者', compact = false }: RevenueBreakdownProps) {
  const split = calculateRevenueSplit(amount, participantCount);
  const rows = [
    { label: primaryLabel, note: '70%', value: split.primary, icon: Trophy, className: 'primary' },
    { label: participantLabel, note: participantCount > 0 ? `10% · 约 ¥${formatMoney(split.perParticipant)}/人` : '10% · 暂无参与者', value: split.participants, icon: UsersRound, className: 'participants' },
    { label: '平台服务费', note: '10%', value: split.service, icon: Landmark, className: 'service' },
    { label: '待分配', note: '10% · 用途待确认', value: split.unallocated, icon: CircleHelp, className: 'unallocated' },
  ];
  return (
    <div className={`revenue-breakdown ${compact ? 'revenue-breakdown--compact' : ''}`}>
      <div className="revenue-bar" aria-label="分账比例：主收益方70%，参与者10%，服务费10%，待分配10%"><span className="primary" /><span className="participants" /><span className="service" /><span className="unallocated" /></div>
      <div className="revenue-rows">{rows.map(({ label, note, value, icon: Icon, className }) => <div className={`revenue-row ${className}`} key={label}><Icon size={16} /><div><strong>{label}<small>{note}</small></strong><span>¥ {formatMoney(value)}</span></div></div>)}</div>
      {!compact && <p className="revenue-note"><HandCoins size={15} />最后 10% 尚未指定归属，本原型不将其计入平台收入。</p>}
    </div>
  );
}
