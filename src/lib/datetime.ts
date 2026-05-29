export function formatDateTime(d: Date) {
  // Keep it stable across locales/timezones for now.
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  }).format(d);
}
