import { describe, expect, it } from 'vitest';
import { calculateRevenueSplit, formatMoney } from './fees';

describe('calculateRevenueSplit', () => {
  it('calculates the 70/10/10 allocation and keeps the remaining 10 percent explicit', () => {
    expect(calculateRevenueSplit(10000, 20)).toEqual({
      total: 10000,
      primary: 7000,
      participants: 1000,
      service: 1000,
      unallocated: 1000,
      perParticipant: 50,
      allocated: 9000,
    });
  });

  it('rounds money to cents and handles an empty participant pool', () => {
    const result = calculateRevenueSplit(29.9, 0);
    expect(result.primary).toBe(20.93);
    expect(result.participants).toBe(2.99);
    expect(result.service).toBe(2.99);
    expect(result.unallocated).toBe(2.99);
    expect(result.perParticipant).toBe(0);
    expect(result.primary + result.participants + result.service + result.unallocated).toBeCloseTo(29.9, 2);
  });

  it('rejects negative amounts and participant counts', () => {
    expect(() => calculateRevenueSplit(-1, 2)).toThrow('金额和参与人数不能为负数');
    expect(() => calculateRevenueSplit(100, -2)).toThrow('金额和参与人数不能为负数');
  });
});

describe('formatMoney', () => {
  it('formats whole amounts without unnecessary decimals', () => {
    expect(formatMoney(7000)).toBe('7,000');
    expect(formatMoney(20.93)).toBe('20.93');
  });
});
