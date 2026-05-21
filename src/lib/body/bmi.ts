export function calculateBMI(weightKg: number | null, heightCm: number | null) {
  if (!weightKg || !heightCm) return null;
  const m = heightCm / 100;
  if (m <= 0) return null;
  const bmi = weightKg / (m * m);
  return Number.isFinite(bmi) ? bmi : null;
}
