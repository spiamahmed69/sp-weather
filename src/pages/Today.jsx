import { Droplets, Wind, Umbrella, CloudRain, Gauge, Cloud, Compass, Thermometer, Sunrise, Sunset, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import WeatherIcon from '../components/WeatherIcon';
import StatCard from '../components/StatCard';
import HourlyStrip from '../components/HourlyStrip';
import { WeatherSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import { weatherInfo } from '../utils/weatherCodes';
import { formatTemp, toBn, formatTimeBn, formatTime24Bn, windDirectionBn } from '../utils/format';
import { OPEN_METEO_URL } from '../services/weatherService';

export default function Today() {
  const { weather, loading, error, refresh, district, unit, lastUpdated, fromCache } = useApp();
  if (loading && !weather) return <WeatherSkeleton />;
  if (error && !weather) {
    return <EmptyState title="আবহাওয়ার তথ্য আনা যায়নি" message={error} action={<button type="button" onClick={refresh} className="min-h-[44px] rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white">আবার চেষ্টা করুন</button>} />;
  }
  const current = weather.current;
  const daily = weather.daily;
  const info = weatherInfo(current.weather_code);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink dark:text-white">আজকের আবহাওয়া — {district.nameBn}</h1>
          <p className="mt-1 text-sm text-muted dark:text-slate-300">{info.label} · {lastUpdated ? `সর্বশেষ হালনাগাদ ${formatTimeBn(lastUpdated)}` : ''}{fromCache ? ' · সংরক্ষিত তথ্য' : ''}</p>
        </div>
        <button type="button" onClick={refresh} disabled={loading} className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> হালনাগাদ করুন
        </button>
      </div>

      <section className="hero-gradient relative overflow-hidden rounded-[2rem] p-6 text-white shadow-lg sm:p-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-white/85">{district.nameBn}, {district.divisionBn} বিভাগ</p>
            <p className="mt-2 text-7xl font-bold leading-none">{formatTemp(current.temperature_2m, unit).replace('°C', '').replace('°F', '')}°</p>
            <p className="mt-2 text-xl font-bold">{info.label}</p>
            <p className="mt-1 text-sm text-white/90">অনুভূত হয় {formatTemp(current.apparent_temperature, unit)} · সর্বোচ্চ {formatTemp(daily.temperature_2m_max[0], unit)} · সর্বনিম্ন {formatTemp(daily.temperature_2m_min[0], unit)}</p>
          </div>
          <WeatherIcon code={current.weather_code} size={120} className="text-white drop-shadow-lg" />
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={<Droplets size={18} className="text-primary" />} label="আর্দ্রতা" value={`${toBn(Math.round(current.relative_humidity_2m))}%`} />
        <StatCard icon={<Wind size={18} className="text-primary" />} label="বাতাসের গতি" value={`${toBn(Math.round(current.wind_speed_10m))} কিমি/ঘণ্টা`} sub={`দিক: ${windDirectionBn(current.wind_direction_10m)}`} />
        <StatCard icon={<Compass size={18} className="text-primary" />} label="বাতাসের দিক" value={windDirectionBn(current.wind_direction_10m)} sub={`${toBn(Math.round(current.wind_direction_10m))}°`} />
        <StatCard icon={<Umbrella size={18} className="text-primary" />} label="বৃষ্টির সম্ভাবনা" value={`${toBn(daily.precipitation_probability_max[0] ?? 0)}%`} sub="আজকের সর্বোচ্চ" />
        <StatCard icon={<CloudRain size={18} className="text-primary" />} label="বৃষ্টিপাত" value={`${toBn(current.precipitation ?? 0)} মিমি`} sub={`আজ মোট: ${toBn(daily.precipitation_sum[0] ?? 0)} মিমি`} />
        <StatCard icon={<Cloud size={18} className="text-primary" />} label="মেঘের পরিমাণ" value={`${toBn(Math.round(current.cloud_cover ?? 0))}%`} />
        <StatCard icon={<Gauge size={18} className="text-primary" />} label="বায়ুচাপ" value={`${toBn(Math.round(current.pressure_msl ?? 0))} হপা`} />
        <StatCard icon={<Thermometer size={18} className="text-primary" />} label="অনুভূত তাপমাত্রা" value={formatTemp(current.apparent_temperature, unit)} />
      </div>

      <section className="grid gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700">
          <Sunrise size={36} className="shrink-0 text-amber-500" />
          <div><p className="font-bold text-ink dark:text-white">সূর্যোদয়</p><p className="text-lg font-bold text-primary">{formatTime24Bn(daily.sunrise[0])}</p></div>
        </div>
        <div className="flex items-center gap-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700">
          <Sunset size={36} className="shrink-0 text-orange-500" />
          <div><p className="font-bold text-ink dark:text-white">সূর্যাস্ত</p><p className="text-lg font-bold text-primary">{formatTime24Bn(daily.sunset[0])}</p></div>
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-bold text-ink dark:text-white">আজকের ঘণ্টাভিত্তিক পূর্বাভাস</h2>
        <HourlyStrip hourly={weather.hourly} unit={unit} count={24} />
      </section>
      <p className="text-center text-xs text-muted dark:text-slate-400">আবহাওয়ার তথ্য: <a className="text-primary hover:underline" href={OPEN_METEO_URL} target="_blank" rel="noreferrer">Open-Meteo</a></p>
    </div>
  );
}
