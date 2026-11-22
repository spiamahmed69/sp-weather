import { Link } from 'react-router-dom';
import { toBn } from '../utils/format';
import { weatherInfo } from '../utils/weatherCodes';
import WeatherIcon from './WeatherIcon';
import { hourLabelBn, formatTemp } from '../utils/format';

export default function HourlyStrip({ hourly, unit, count = 12 }) {
  if (!hourly?.time) return null;
  const now = Date.now();
  const items = hourly.time
    .map((t, i) => ({ t, i }))
    .filter(({ t }) => new Date(t).getTime() >= now - 3600 * 1000)
    .slice(0, count);
  if (items.length === 0) return null;
  return (
    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
      {items.map(({ t, i }) => (
        <div key={t} className="flex min-w-[76px] shrink-0 flex-col items-center rounded-3xl bg-white dark:bg-slate-800 px-3 py-4 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700">
          <span className="text-xs font-medium text-muted dark:text-slate-400">{hourLabelBn(t)}</span>
          <WeatherIcon code={hourly.weather_code[i]} size={30} className="my-2 text-primary" />
          <span className="text-base font-bold text-ink dark:text-white">{formatTemp(hourly.temperature_2m[i], unit)}</span>
          <span className="mt-1 rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-semibold text-sky-700 dark:bg-sky-900 dark:text-sky-200">
            {hourly.precipitation_probability ? `${toBn(hourly.precipitation_probability[i] ?? 0)}%` : '—'}
          </span>
          <span className="mt-1 text-[11px] text-muted dark:text-slate-400">{weatherInfo(hourly.weather_code[i]).label}</span>
        </div>
      ))}
      <Link to="/ghontabhittik" className="flex min-w-[76px] shrink-0 items-center justify-center rounded-3xl bg-primary px-3 py-4 text-sm font-bold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
        সব দেখুন
      </Link>
    </div>
  );
}
