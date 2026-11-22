import { Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import DayRow from '../components/DayRow';
import { WeatherSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import { toBn, formatTime24Bn } from '../utils/format';
import { weatherInfo } from '../utils/weatherCodes';
import WeatherIcon from '../components/WeatherIcon';
import { formatTemp } from '../utils/format';

export default function Weekly() {
  const { weather, loading, error, refresh, district, unit } = useApp();
  if (loading && !weather) return <WeatherSkeleton />;
  if (error && !weather) {
    return <EmptyState title="আবহাওয়ার তথ্য আনা যায়নি" message={error} action={<button type="button" onClick={refresh} className="min-h-[44px] rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white">আবার চেষ্টা করুন</button>} />;
  }
  const daily = weather.daily;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink dark:text-white">৭ দিনের পূর্বাভাস — {district.nameBn}</h1>
        <p className="mt-1 text-sm text-muted dark:text-slate-300">আগামী ৭ দিনের সর্বোচ্চ ও সর্বনিম্ন তাপমাত্রা, বৃষ্টির সম্ভাবনা ও বাতাসের গতি।</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          {daily.time.slice(0, 7).map((date, i) => (
            <DayRow key={date} date={date} index={i} code={daily.weather_code[i]} max={daily.temperature_2m_max[i]} min={daily.temperature_2m_min[i]} rainProb={daily.precipitation_probability_max[i]} precip={daily.precipitation_sum[i]} wind={daily.wind_speed_10m_max[i]} unit={unit} />
          ))}
        </div>
        <div className="space-y-3">
          {daily.time.slice(0, 7).map((date, i) => (
            <div key={date} className="flex items-center gap-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700">
              <WeatherIcon code={daily.weather_code[i]} size={36} className="shrink-0 text-primary" />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-ink dark:text-white">{i === 0 ? 'আজ' : ''} {weatherInfo(daily.weather_code[i]).label}</p>
                <p className="text-xs text-muted dark:text-slate-400">বৃষ্টি {toBn(daily.precipitation_probability_max[i] ?? 0)}% · বৃষ্টিপাত {toBn(daily.precipitation_sum[i] ?? 0)} মিমি · বাতাস {toBn(Math.round(daily.wind_speed_10m_max[i]))} কিমি/ঘণ্টা</p>
                <p className="text-xs text-muted dark:text-slate-400">সূর্যোদয় {formatTime24Bn(daily.sunrise[i])} · সূর্যাস্ত {formatTime24Bn(daily.sunset[i])}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-ink dark:text-white">{formatTemp(daily.temperature_2m_max[i], unit)}</p>
                <p className="text-sm text-muted dark:text-slate-400">{formatTemp(daily.temperature_2m_min[i], unit)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="flex items-start gap-2 rounded-2xl bg-sky-50 p-4 text-sm text-sky-800 dark:bg-sky-950 dark:text-sky-200">
        <Info size={18} className="mt-0.5 shrink-0" /> ৭ দিনের পূর্বাভাস মডেল-ভিত্তিক; যত দিন এগোবে, অনিশ্চয়তা তত বাড়বে। সর্বশেষ সরকারি সতর্কবার্তার জন্য bmd.gov.bd দেখুন।
      </p>
    </div>
  );
}
