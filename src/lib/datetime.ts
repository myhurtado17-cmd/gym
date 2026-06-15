export function formatDateTime(d: Date) {
  return new Intl.DateTimeFormat('es', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  }).format(d);
}
