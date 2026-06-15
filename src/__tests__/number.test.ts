import { describe, it, expect } from 'vitest';
import { formatNumber, decimalToNumber } from '../lib/number';

describe('formatNumber', () => {
  it('formats integers', () => {
    expect(formatNumber(42)).toBe('42');
  });

  it('formats decimals with max fraction digits', () => {
    const result = formatNumber(3.14159, { maximumFractionDigits: 2 });
    expect(result).toContain('14');
    expect(result).not.toContain('141');
  });

  it('handles null', () => {
    expect(formatNumber(null)).toBe('—');
  });

  it('handles undefined', () => {
    expect(formatNumber(undefined)).toBe('—');
  });
});

describe('decimalToNumber', () => {
  it('converts valid decimal', () => {
    expect(decimalToNumber(42.5)).toBe(42.5);
  });

  it('returns null for null', () => {
    expect(decimalToNumber(null)).toBeNull();
  });

  it('returns null for undefined', () => {
    expect(decimalToNumber(undefined)).toBeNull();
  });
});
