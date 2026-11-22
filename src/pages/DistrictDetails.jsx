import { useParams, Link } from 'react-router-dom';
import { MapPin, ArrowLeft, Droplets, Wind, Umbrella, CloudRain, Gauge, Cloud, Compass, Thermometer } from 'lucide-react';
import { useApp } from '../context/AppContext';
import WeatherIcon from '../components/WeatherIcon';
import StatCard from '../components/StatCard';
import HourlyStrip from '../components/HourlyStrip';
import DayRow from '../components/DayRow';
import { WeatherSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import { weatherInfo } from '../utils/weatherCodes';
import { formatTemp, toBn, formatTimeBn, windDirectionBn } from '../utils/format';
import { OPEN_METEO_URL } from '../services/weatherService';

export default function DistrictDetails() {
  const { id } = useParams();
  const { districts, district, setDistrictId, weather, loading, error, refresh, unit, lastUpdated } = useApp();
  const target = districts.find((d) => d.id === id);

  if (!target) {
    return <EmptyState title="জেলা পাওয়া যায়নি" message="ঠিকানাটি যাচাই করে আবার চেষ্টা করুন।" action={<Link to="/jela" className="inline-block min-h-[44px] rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white">সব জেলা দেখুন</Link>} />;
  }
  const isSelected = district.id === target.id;
  const showWeather = isSelected && weather;
  if (!isSelected) {
    return (
      <div className="space-y-6">
        <Link to="/jela" className="inline-flex min-h-[44px] items-center gap-1 rounded-full bg-white px-4 py-2.5 text-sm font-bold text-primary shadow-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:ring-slate-700"><ArrowLeft size={16} /> সব জেলা</Link>
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm dark:bg-slate-800">
          <MapPin size={40} className="mx-auto text-primary" />
          <h1 className="mt-3 font-display text-2xl font-bold text-ink dark:text-white">{target.nameBn}</h1>
          <p className="mt-1 text-sm text-muted dark:text-slate-300">{target.divisionBn} বিভাগ · {target.nameEn} · অক্ষাংশ {target.latitude}, দ্রাঘিমাংশ {target.longitude}</p>
          <button type="button" onClick={() => setDistrictId(target.id)} className="mt-5 min-h-[44px] rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary">
            {target.nameBn} নির্বাচন করে আবহাওয়া দেখুন
          </button>
          <p className="mt-3 text-xs text-muted dark:text-slate-400">নির্বাচন করলে এই জেলার বর্তমান আবহাওয়া, ঘণ্টাভিত্তিক ও ৭ দিনের পূর্বাভাস এখানেই দেখা যাবে।</p>
        </div>
      </div>
    );
  }
  if (loading && !showWeather) return <WeatherSkeleton />;
  if (error && !showWeather) {
    return <EmptyState title="আবহাওয়ার তথ্য আনা যায়নি" message={error} action={<button type="button" onClick={refresh} className="min-h-[44px] rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white">আবার চেষ্টা করুন</button>} />;
  }
  const current = weather.current;
  const daily = weather.daily;
  const info = weatherInfo(current.weather_code);
  return (
    <div className="space-y-6">
      <Link to="/jela" className="inline-flex min-h-[44px] items-center gap-1 rounded-full bg-white px-4 py-2.5 text-sm font-bold text-primary shadow-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:ring-slate-700"><ArrowLeft size={16} /> সব জেলা</Link>
      <section className="hero-gradient relative overflow-hidden rounded-[2rem] p-6 text-white shadow-lg sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="flex items-center gap-1.5 text-sm text-white/85"><MapPin size={16} /> {target.nameBn}, {target.divisionBn} বিভাগ</p>
            <p className="mt-2 text-7xl font-bold leading-none">{formatTemp(current.temperature_2m, unit).replace('°C', '').replace('°F', '')}°</p>
            <p className="mt-2 text-xl font-bold">{info.label}</p>
            <p className="mt-1 text-sm text-white/90">অনুভূত হয় {formatTemp(current.apparent_temperature, unit)} · সর্বোচ্চ {formatTemp(daily.temperature_2m_max[0], unit)} · সর্বনিম্ন {formatTemp(daily.temperature_2m_min[0], unit)}</p>
            <p className="mt-1 text-xs text-white/75">{lastUpdated ? `সর্বশেষ হালনাগাদ: ${formatTimeBn(lastUpdated)}` : ''}</p>
          </div>
          <WeatherIcon code={current.weather_code} size={110} className="text-white drop-shadow-lg" />
        </div>
      </section>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={<Droplets size={18} className="text-primary" />} label="আর্দ্রতা" value={`${toBn(Math.round(current.relative_humidity_2m))}%`} />
        <StatCard icon={<Wind size={18} className="text-primary" />} label="বাতাসের গতি" value={`${toBn(Math.round(current.wind_speed_10m))} কিমি/ঘণ্টা`} sub={`দিক: ${windDirectionBn(current.wind_direction_10m)}`} />
        <StatCard icon={<Compass size={18} className="text-primary" />} label="বাতাসের দিক" value={windDirectionBn(current.wind_direction_10m)} />
        <StatCard icon={<Umbrella size={18} className="text-primary" />} label="বৃষ্টির সম্ভাবনা" value={`${toBn(daily.precipitation_probability_max[0] ?? 0)}%`} />
        <StatCard icon={<CloudRain size={18} className="text-primary" />} label="বৃষ্টিপাত" value={`${toBn(current.precipitation ?? 0)} মিমি`} />
        <StatCard icon={<Cloud size={18} className="text-primary" />} label="মেঘের পরিমাণ" value={`${toBn(Math.round(current.cloud_cover ?? 0))}%`} />
        <StatCard icon={<Gauge size={18} className="text-primary" />} label="বায়ুচাপ" value={`${toBn(Math.round(current.pressure_msl ?? 0))} হপা`} />
        <StatCard icon={<Thermometer size={18} className="text-primary" />} label="অনুভূত তাপমাত্রা" value={formatTemp(current.apparent_temperature, unit)} />
      </div>
      <section>
        <h2 className="mb-3 font-display text-lg font-bold text-ink dark:text-white">আজকের ঘণ্টাভিত্তিক পূর্বাভাস</h2>
        <HourlyStrip hourly={weather.hourly} unit={unit} />
      </section>
      <section>
        <h2 className="mb-3 font-display text-lg font-bold text-ink dark:text-white">৭ দিনের পূর্বাভাস</h2>
        <div className="space-y-2">
          {daily.time.slice(0, 7).map((date, i) => (
            <DayRow key={date} date={date} index={i} code={daily.weather_code[i]} max={daily.temperature_2m_max[i]} min={daily.temperature_2m_min[i]} rainProb={daily.precipitation_probability_max[i]} precip={daily.precipitation_sum[i]} wind={daily.wind_speed_10m_max[i]} unit={unit} />
          ))}
        </div>
      </section>
      <p className="text-center text-xs text-muted dark:text-slate-400">আবহাওয়ার তথ্য: <a className="text-primary hover:underline" href={OPEN_METEO_URL} target="_blank" rel="noreferrer">Open-Meteo</a></p>
    </div>
  );
}
