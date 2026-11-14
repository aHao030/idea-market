const toCents = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

export interface RevenueSplit {
  total: number;
  primary: number;
  participants: number;
  service: number;
  unallocated: number;
  perParticipant: number;
  allocated: number;
}

export function calculateRevenueSplit(amount: number, participantCount = 1): RevenueSplit {
  if (amount < 0 || participantCount < 0) throw new Error('金额和参与人数不能为负数');
  const primary = toCents(amount * 0.7);
  const participants = toCents(amount * 0.1);
  const service = toCents(amount * 0.1);
  const unallocated = toCents(amount - primary - participants - service);
  return {
    total: toCents(amount),
    primary,
    participants,
    service,
    unallocated,
    perParticipant: participantCount > 0 ? toCents(participants / participantCount) : 0,
    allocated: toCents(primary + participants + service),
  };
}

export function formatMoney(value: number) {
  return value.toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}
