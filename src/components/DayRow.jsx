import { Link } from 'react-router-dom';
import { formatTemp, toBn, weekdayBn, formatDateShortBn } from '../utils/format';
import { weatherInfo } from '../utils/weatherCodes';
import WeatherIcon from './WeatherIcon';

export default function DayRow({ date, code, max, min, rainProb, precip, wind, unit, index = 0 }) {
  return (
    <div className="flex items-center gap-3 rounded-3xl bg-white dark:bg-slate-800 px-4 py-3 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700">
      <div className="w-24 shrink-0">
        <p className="text-sm font-bold text-ink dark:text-white">{index === 0 ? 'আজ' : weekdayBn(date)}</p>
        <p className="text-xs text-muted dark:text-slate-400">{formatDateShortBn(date)}</p>
      </div>
      <WeatherIcon code={code} size={30} className="shrink-0 text-primary" />
      <span className="hidden min-w-0 flex-1 truncate text-sm text-ink dark:text-slate-200 sm:block">{weatherInfo(code).label}</span>
      <span className="ml-auto hidden text-xs text-sky-700 dark:text-sky-300 sm:block">বৃষ্টি {toBn(rainProb ?? 0)}%</span>
      <span className="text-sm font-bold text-ink dark:text-white">{formatTemp(max, unit)}</span>
      <span className="text-sm text-muted dark:text-slate-400">{formatTemp(min, unit)}</span>
    </div>
  );
}
