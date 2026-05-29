export type ParsedNutrition = {
  entries: {
    mealName: string;
    calories: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
    notes: string | null;
  }[];
};

function normalizeLine(line: string) {
  return line.replace(/\s+/g, ' ').trim();
}

function parseMacroToken(token: string) {
  // tokens like: "650", "P45", "C70", "F18", "45p", "70c", "18f", "p:45"
  const t = token.trim();
  const m1 = /^([PCFpcf])\s*[:=]?\s*(\d+)$/i.exec(t);
  if (m1) return { key: m1[1].toUpperCase(), value: Number(m1[2]) };
  const m2 = /^(\d+)\s*([PCFpcf])$/i.exec(t);
  if (m2) return { key: m2[2].toUpperCase(), value: Number(m2[1]) };
  return null;
}

export function parseNutritionText(text: string): ParsedNutrition {
  const lines = text
    .split(/\r?\n/)
    .map((l) => normalizeLine(l))
    .filter((l) => l && !l.startsWith('//'));

  const entries: ParsedNutrition['entries'] = [];

  for (const line of lines) {
    // Example supported:
    // "Chicken + Rice | 650 P45 C70 F18"
    // "Oatmeal - 450 P20 C65 F12 # post workout"
    let cleaned = line.replace(/^[-*•]+\s*/, '').trim();
    if (!cleaned) continue;

    let notes: string | null = null;
    const hash = cleaned.indexOf('#');
    if (hash >= 0) {
      notes = normalizeLine(cleaned.slice(hash + 1));
      cleaned = cleaned.slice(0, hash).trim();
    }

    const parts = cleaned.split(/\s*[|\-–—:]\s*/);
    const name = normalizeLine(parts[0] ?? '');
    const tail = normalizeLine(parts.slice(1).join(' '));
    if (!name) continue;

    const tokens = tail.split(' ').filter(Boolean);
    // Require at least calories + one macro token to avoid false positives.
    const calories = Number(tokens[0]);
    if (!Number.isFinite(calories)) continue;

    let proteinG = 0;
    let carbsG = 0;
    let fatG = 0;

    for (const tok of tokens.slice(1)) {
      const parsed = parseMacroToken(tok);
      if (!parsed) continue;
      if (parsed.key === 'P') proteinG = parsed.value;
      if (parsed.key === 'C') carbsG = parsed.value;
      if (parsed.key === 'F') fatG = parsed.value;
    }

    // If no macro tokens, skip.
    if (proteinG === 0 && carbsG === 0 && fatG === 0) continue;

    entries.push({
      mealName: name,
      calories: Math.max(0, Math.floor(calories)),
      proteinG: Math.max(0, Math.floor(proteinG)),
      carbsG: Math.max(0, Math.floor(carbsG)),
      fatG: Math.max(0, Math.floor(fatG)),
      notes
    });
  }

  return { entries };
}
