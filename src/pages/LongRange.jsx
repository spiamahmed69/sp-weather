import { AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import DayRow from '../components/DayRow';
import { WeatherSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';

export default function LongRange() {
  const { weather, loading, error, refresh, district, unit } = useApp();
  if (loading && !weather) return <WeatherSkeleton />;
  if (error && !weather) {
    return <EmptyState title="আবহাওয়ার তথ্য আনা যায়নি" message={error} action={<button type="button" onClick={refresh} className="min-h-[44px] rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white">আবার চেষ্টা করুন</button>} />;
  }
  const daily = weather.daily;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink dark:text-white">১৬ দিনের পূর্বাভাস — {district.nameBn}</h1>
        <p className="mt-1 text-sm text-muted dark:text-slate-300">দীর্ঘমেয়াদি ধারণা — পরিকল্পনার জন্য সহায়ক, নিশ্চিত তথ্য নয়।</p>
      </div>
      <div className="flex items-start gap-3 rounded-3xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950" role="alert">
        <AlertTriangle size={26} className="shrink-0 text-amber-500" />
        <div>
          <p className="font-bold text-ink dark:text-white">১৬ দিনের পূর্বাভাস নিশ্চিত নয়</p>
          <p className="mt-1 text-sm text-muted dark:text-slate-300">দীর্ঘমেয়াদে অনিশ্চয়তা বেশি। প্রথম ৩ দিনের পূর্বাভাস সবচেয়ে নির্ভরযোগ্য; পরের দিনগুলোর তাপমাত্রা ও বৃষ্টির সম্ভাবনা বদলে যেতে পারে। গুরুত্বপূর্ণ সিদ্ধান্তের আগে হালনাগাদ পূর্বাভাস দেখুন।</p>
        </div>
      </div>
      <div className="grid gap-2 lg:grid-cols-2">
        {daily.time.map((date, i) => (
          <DayRow key={date} date={date} index={i} code={daily.weather_code[i]} max={daily.temperature_2m_max[i]} min={daily.temperature_2m_min[i]} rainProb={daily.precipitation_probability_max[i]} precip={daily.precipitation_sum[i]} wind={daily.wind_speed_10m_max[i]} unit={unit} />
        ))}
      </div>
    </div>
  );
}
