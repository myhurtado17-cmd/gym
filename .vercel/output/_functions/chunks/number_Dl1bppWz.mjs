function decimalToNumber(v) {
  if (v == null) return null;
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n2 = Number(v);
    return Number.isFinite(n2) ? n2 : null;
  }
  if (typeof v.toNumber === "function") return v.toNumber();
  const n = Number(String(v));
  return Number.isFinite(n) ? n : null;
}
function formatNumber(n, opts) {
  if (n == null || !Number.isFinite(n)) return "—";
  return new Intl.NumberFormat(void 0, opts).format(n);
}

export { decimalToNumber as d, formatNumber as f };
