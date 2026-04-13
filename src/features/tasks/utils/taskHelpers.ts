export function formatDate(dateStr: string, withTime = false): string {
  if (!dateStr) return withTime ? '—' : '';
  const date = withTime
    ? new Date(dateStr)
    : (() => {
        const [y, m, d] = dateStr.split('-').map(Number);
        return new Date(y, m - 1, d);
      })();
  const opts: Intl.DateTimeFormatOptions = withTime
    ? { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' }
    : { month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', opts);
}

export function isOverdue(dateStr: string, status: string): boolean {
  if (!dateStr || status === 'completed') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d) < today;
}
