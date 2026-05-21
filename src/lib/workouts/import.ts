export type ParsedRoutine = {
  name: string;
  days: {
    name: string;
    items: {
      exerciseName: string;
      targetSets: number | null;
      targetReps: string | null;
      notes: string | null;
    }[];
  }[];
};

function normalizeLine(line: string) {
  return line.replace(/\s+/g, ' ').trim();
}

function parseSetsReps(raw: string) {
  // Examples: 4x10, 5 x 5, 3x8-12
  const m = /(^|\s)(\d{1,2})\s*x\s*(\d{1,3}(?:\s*-\s*\d{1,3})?)\s*$/i.exec(raw.trim());
  if (!m) return { sets: null as number | null, reps: null as string | null };
  const sets = Number(m[2]);
  const reps = m[3].replace(/\s+/g, '');
  return {
    sets: Number.isFinite(sets) ? sets : null,
    reps
  };
}

function isDayHeading(line: string) {
  // e.g. "Day 1: Push", "Monday", "Pull:".
  const l = line.toLowerCase();
  if (l.endsWith(':')) return true;
  if (/^day\s*\d+\b/.test(l)) return true;
  if (/^(mon|monday|tue|tuesday|wed|wednesday|thu|thursday|fri|friday|sat|saturday|sun|sunday)\b/.test(l)) return true;
  return false;
}

export function parseRoutineText(name: string, text: string): ParsedRoutine {
  const lines = text
    .split(/\r?\n/)
    .map((l) => normalizeLine(l))
    .filter((l) => l && !l.startsWith('//'));

  const days: ParsedRoutine['days'] = [];
  let currentDay: ParsedRoutine['days'][number] | null = null;

  for (const line of lines) {
    const cleaned = line.replace(/^[-*•]+\s*/, '').trim();
    if (!cleaned) continue;

    if (isDayHeading(cleaned) && !/[0-9]\s*x\s*[0-9]/i.test(cleaned)) {
      const dayName = cleaned.replace(/:$/, '').trim();
      currentDay = { name: dayName || `Day ${days.length + 1}`, items: [] };
      days.push(currentDay);
      continue;
    }

    if (!currentDay) {
      currentDay = { name: 'Day 1', items: [] };
      days.push(currentDay);
    }

    // Split out inline notes (# or parentheses)
    let base = cleaned;
    let notes: string | null = null;
    const hashIdx = base.indexOf('#');
    if (hashIdx >= 0) {
      notes = normalizeLine(base.slice(hashIdx + 1));
      base = base.slice(0, hashIdx).trim();
    }

    const paren = /(.*)\(([^)]+)\)\s*$/.exec(base);
    if (paren) {
      base = paren[1].trim();
      notes = notes ? `${notes} ${normalizeLine(paren[2])}` : normalizeLine(paren[2]);
    }

    // Try separator-based parse
    const parts = base.split(/\s*[-–—:]\s*/);
    const exerciseName = normalizeLine(parts[0] ?? '');
    const tail = normalizeLine(parts.slice(1).join(' '));

    const { sets, reps } = parseSetsReps(tail || base);

    if (!exerciseName) continue;
    currentDay.items.push({
      exerciseName,
      targetSets: sets,
      targetReps: reps,
      notes
    });
  }

  return {
    name: name.trim() || 'Routine',
    days: days.length ? days : [{ name: 'Day 1', items: [] }]
  };
}
