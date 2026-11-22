const BN_DIGITS = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
export function toBn(value) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)]);
}
export function toBnDigits(value) { return toBn(value); }

export function convertTemp(celsius, unit) {
  if (unit === 'F') return Math.round((celsius * 9) / 5 + 32);
  return Math.round(celsius);
}
export function formatTemp(celsius, unit = 'C') {
  if (celsius === null || celsius === undefined || Number.isNaN(celsius)) return '—';
  return `${toBn(convertTemp(celsius, unit))}°${unit === 'F' ? 'F' : 'C'}`;
}
export function formatTempNum(celsius, unit = 'C') {
  if (celsius === null || celsius === undefined) return '—';
  return toBn(convertTemp(celsius, unit));
}

export const WEEKDAYS_BN = ['রবিবার','সোমবার','মঙ্গলবার','বুধবার','বৃহস্পতিবার','শুক্রবার','শনিবার'];
export const WEEKDAYS_SHORT_BN = ['রবি','সোম','মঙ্গল','বুধ','বৃহ','শুক্র','শনি'];
export const MONTHS_BN = ['জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর'];

function dhakaParts(dateInput) {
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Dhaka', weekday: 'long', day: 'numeric', month: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false,
  });
  const parts = {};
  for (const p of fmt.formatToParts(d)) parts[p.type] = p.value;
  return { d, parts };
}
export function formatDateBn(dateInput) {
  const { parts } = dhakaParts(dateInput);
  const wd = WEEKDAYS_BN[['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'].indexOf(parts.weekday)];
  return `${wd}, ${toBn(parts.day)} ${MONTHS_BN[Number(parts.month) - 1]} ${toBn(parts.year)}`;
}
export function formatDateShortBn(dateInput) {
  const { parts } = dhakaParts(dateInput);
  return `${toBn(parts.day)} ${MONTHS_BN[Number(parts.month) - 1]}`;
}
export function weekdayBn(dateInput, short = false) {
  const { parts } = dhakaParts(dateInput);
  const idx = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'].indexOf(parts.weekday);
  return short ? WEEKDAYS_SHORT_BN[idx] : WEEKDAYS_BN[idx];
}
export function formatTimeBn(dateInput) {
  const { parts } = dhakaParts(dateInput);
  let h = Number(parts.hour);
  const m = parts.minute;
  const ampm = h < 12 ? 'সকাল' : h < 17 ? 'দুপুর' : h < 20 ? 'বিকেল' : 'রাত';
  let h12 = h % 12; if (h12 === 0) h12 = 12;
  return `${ampm} ${toBn(h12)}:${toBn(m.padStart(2, '0'))}`;
}
export function formatTime24Bn(isoTime) {
  // isoTime like "2026-11-22T14:00" (Asia/Dhaka local) or "06:00"
  const t = String(isoTime).includes('T') ? String(isoTime).split('T')[1] : String(isoTime);
  const [h, m] = t.split(':');
  return formatTimeBn(new Date(2026, 0, 1, Number(h), Number(m)));
}
export function hourLabelBn(isoTime) {
  const t = String(isoTime).includes('T') ? String(isoTime).split('T')[1] : String(isoTime);
  const h = Number(t.split(':')[0]);
  const ampm = h < 12 ? 'সকাল' : h < 17 ? 'দুপুর' : h < 20 ? 'বিকেল' : 'রাত';
  let h12 = h % 12; if (h12 === 0) h12 = 12;
  return `${ampm} ${toBn(h12)}টা`;
}
const WIND_DIRS = ['উত্তর','উত্তর-পূর্ব','পূর্ব','দক্ষিণ-পূর্ব','দক্ষিণ','দক্ষিণ-পশ্চিম','পশ্চিম','উত্তর-পশ্চিম'];
export function windDirectionBn(deg) {
  if (deg === null || deg === undefined) return '—';
  return WIND_DIRS[Math.round(((Number(deg) % 360) + 360) % 360 / 45) % 8];
}
export function timeAgoBn(dateInput) {
  const d = new Date(dateInput).getTime();
  if (Number.isNaN(d)) return '';
  const diffMin = Math.max(0, Math.round((Date.now() - d) / 60000));
  if (diffMin < 1) return 'এইমাত্র';
  if (diffMin < 60) return `${toBn(diffMin)} মিনিট আগে`;
  const h = Math.floor(diffMin / 60);
  if (h < 24) return `${toBn(h)} ঘণ্টা আগে`;
  return `${toBn(Math.floor(h / 24))} দিন আগে`;
}
export function todayIsoDhaka() {
  const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dhaka', year: 'numeric', month: '2-digit', day: '2-digit' });
  return fmt.format(new Date());
}
