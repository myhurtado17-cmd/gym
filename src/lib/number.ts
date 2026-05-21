import type { Prisma } from '@prisma/client';

export function decimalToNumber(v: Prisma.Decimal | number | string | null | undefined) {
  if (v == null) return null;
  if (typeof v === 'number') return v;
  if (typeof v === 'string') {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  // Prisma Decimal
  if (typeof v.toNumber === 'function') return v.toNumber();
  const n = Number(String(v));
  return Number.isFinite(n) ? n : null;
}

export function formatNumber(n: number | null | undefined, opts?: Intl.NumberFormatOptions) {
  if (n == null || !Number.isFinite(n)) return '—';
  return new Intl.NumberFormat(undefined, opts).format(n);
}
