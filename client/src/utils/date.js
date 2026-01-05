export const DISPLAY_TZ = 'Asia/Kolkata';
export const DISPLAY_LOCALE = 'en-IN';

export function formatInTZ(val, tz = DISPLAY_TZ, locale = DISPLAY_LOCALE) {
  if (!val) return '—';
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString(locale, { timeZone: tz });
}
