import type { AstroCookies } from 'astro';

import { verifyCsrf } from '@/lib/security/csrf';

export function requireCsrf(cookies: AstroCookies, formValue: FormDataEntryValue | null) {
  const ok = verifyCsrf(cookies, formValue?.toString() ?? null);
  return ok;
}
