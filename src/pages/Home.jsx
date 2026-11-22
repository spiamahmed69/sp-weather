import { Link } from 'react-router-dom';
import { Droplets, Wind, Umbrella, CloudRain, Gauge, Cloud, Compass, Thermometer, Sunrise, Sunset, AlertTriangle, ArrowLeft, MapPin, CloudSun } from 'lucide-react';
import { useApp } from '../context/AppContext';
import WeatherIcon from '../components/WeatherIcon';
import StatCard from '../components/StatCard';
import HourlyStrip from '../components/HourlyStrip';
import DayRow from '../components/DayRow';
import NewsCard from '../components/NewsCard';
import Skeleton, { WeatherSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import { weatherInfo } from '../utils/weatherCodes';
import { formatTemp, toBn, formatTimeBn, windDirectionBn, formatTime24Bn } from '../utils/format';
import { OPEN_METEO_URL } from '../services/weatherService';
import news from '../data/news.json';
import alerts from '../data/alerts.json';

export default function Home() {
  const { weather, loading, error, refresh, district, districts, unit, lastUpdated, fromCache } = useApp();
  if (loading && !weather) return <WeatherSkeleton />;
  if (error && !weather) {
    return <EmptyState title="আবহাওয়ার তথ্য আনা যায়নি" message={error} action={<button type="button" onClick={refresh} className="min-h-[44px] rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary">আবার চেষ্টা করুন</button>} />;
  }
  const current = weather.current;
  const daily = weather.daily;
  const info = weatherInfo(current.weather_code);
  const rainProbToday = daily?.precipitation_probability_max?.[0];
  const featured = news.filter((a) => a.featured).slice(0, 3);
  const topDistricts = ['dhaka', 'chattogram', 'khulna', 'rajshahi', 'sylhet', 'barishal'];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden rounded-[2rem] p-6 text-white shadow-lg sm:p-8" aria-label="বর্তমান আবহাওয়া">
        <div className="pointer-events-none absolute -right-8 -top-10 h-48 w-48 rounded-full bg-white/15" />
        <div className="pointer-events-none absolute bottom-0 right-24 h-24 w-24 rounded-full bg-white/10" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="flex items-center gap-1.5 text-sm font-medium text-white/85"><MapPin size={16} /> {district.nameBn}, {district.divisionBn} বিভাগ</p>
            <div className="mt-2 flex items-end gap-3">
              <span className="text-7xl font-bold leading-none sm:text-8xl">{formatTemp(current.temperature_2m, unit).replace('°C', '').replace('°F', '')}°</span>
              <div className="pb-1">
                <p className="text-xl font-bold">{info.label}</p>
                <p className="text-sm text-white/85">অনুভূত হয় {formatTemp(current.apparent_temperature, unit)}</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-white/90">
              সর্বোচ্চ {formatTemp(daily.temperature_2m_max[0], unit)} · সর্বনিম্ন {formatTemp(daily.temperature_2m_min[0], unit)} · বৃষ্টির সম্ভাবনা {toBn(rainProbToday ?? 0)}%
            </p>
            <p className="mt-1 text-xs text-white/75">
              {lastUpdated ? `সর্বশেষ হালনাগাদ: ${formatTimeBn(lastUpdated)}` : ''}{fromCache ? ' · সংরক্ষিত তথ্য (ক্যাশ)' : ''}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-center">
            <WeatherIcon code={current.weather_code} size={110} className="text-white drop-shadow-lg" />
            <p className="mt-1 flex items-center gap-2 text-sm font-medium text-white/90"><CloudSun size={16} /> সূর্যোদয় {formatTime24Bn(daily.sunrise[0])} · সূর্যাস্ত {formatTime24Bn(daily.sunset[0])}</p>
          </div>
        </div>
        <div className="relative mt-6 flex flex-wrap gap-2">
          <Link to="/ajker-abhawa" className="rounded-full bg-white px-4 py-2.5 text-sm font-bold text-primary shadow hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-white">আজকের বিস্তারিত</Link>
          <Link to="/ghontabhittik" className="rounded-full bg-white/20 px-4 py-2.5 text-sm font-bold text-white ring-1 ring-white/50 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white">ঘণ্টাভিত্তিক পূর্বাভাস</Link>
          <Link to="/manchitro" className="rounded-full bg-white/20 px-4 py-2.5 text-sm font-bold text-white ring-1 ring-white/50 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white">মানচিত্র দেখুন</Link>
        </div>
      </section>

      {/* Stats */}
      <section aria-label="আবহাওয়ার বিস্তারিত তথ্য">
        <h2 className="mb-3 font-display text-lg font-bold text-ink dark:text-white">আবহাওয়ার বিস্তারিত</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard icon={<Droplets size={18} className="text-primary" />} label="আর্দ্রতা" value={`${toBn(Math.round(current.relative_humidity_2m))}%`} sub="বাতাসে জলীয় বাষ্পের পরিমাণ" />
          <StatCard icon={<Wind size={18} className="text-primary" />} label="বাতাসের গতি" value={`${toBn(Math.round(current.wind_speed_10m))} কিমি/ঘণ্টা`} sub={`দিক: ${windDirectionBn(current.wind_direction_10m)}`} />
          <StatCard icon={<Compass size={18} className="text-primary" />} label="বাতাসের দিক" value={windDirectionBn(current.wind_direction_10m)} sub={`${toBn(Math.round(current.wind_direction_10m))}°`} />
          <StatCard icon={<Umbrella size={18} className="text-primary" />} label="বৃষ্টির সম্ভাবনা" value={`${toBn(rainProbToday ?? 0)}%`} sub="আজকের সর্বোচ্চ সম্ভাবনা" />
          <StatCard icon={<CloudRain size={18} className="text-primary" />} label="বৃষ্টিপাত" value={`${toBn(current.precipitation ?? 0)} মিমি`} sub={`বৃষ্টি: ${toBn(current.rain ?? 0)} মিমি`} />
          <StatCard icon={<Cloud size={18} className="text-primary" />} label="মেঘের পরিমাণ" value={`${toBn(Math.round(current.cloud_cover ?? 0))}%`} sub="আকাশে মেঘের আচ্ছাদন" />
          <StatCard icon={<Gauge size={18} className="text-primary" />} label="বায়ুচাপ" value={`${toBn(Math.round(current.pressure_msl ?? 0))} হপা`} sub="সমুদ্রপৃষ্ঠের চাপ" />
          <StatCard icon={<Thermometer size={18} className="text-primary" />} label="অনুভূত তাপমাত্রা" value={formatTemp(current.apparent_temperature, unit)} sub={`প্রকৃত: ${formatTemp(current.temperature_2m, unit)}`} />
        </div>
      </section>

      {/* Hourly */}
      <section aria-label="আজকের ঘণ্টাভিত্তিক পূর্বাভাস">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-ink dark:text-white">আজকের ঘণ্টাভিত্তিক পূর্বাভাস</h2>
          <Link to="/ghontabhittik" className="flex items-center gap-1 text-sm font-bold text-primary hover:underline">সব দেখুন <ArrowLeft size={15} /></Link>
        </div>
        <HourlyStrip hourly={weather.hourly} unit={unit} />
      </section>

      {/* 7-day preview */}
      <section aria-label="৭ দিনের পূর্বাভাসের ঝলক">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-ink dark:text-white">৭ দিনের পূর্বাভাস</h2>
          <Link to="/7-din" className="flex items-center gap-1 text-sm font-bold text-primary hover:underline">সব দেখুন <ArrowLeft size={15} /></Link>
        </div>
        <div className="space-y-2">
          {daily.time.slice(0, 7).map((date, i) => (
            <DayRow key={date} date={date} index={i} code={daily.weather_code[i]} max={daily.temperature_2m_max[i]} min={daily.temperature_2m_min[i]} rainProb={daily.precipitation_probability_max[i]} precip={daily.precipitation_sum[i]} wind={daily.wind_speed_10m_max[i]} unit={unit} />
          ))}
        </div>
      </section>

      {/* Alerts preview */}
      <section aria-label="সতর্কবার্তা">
        <h2 className="mb-3 font-display text-lg font-bold text-ink dark:text-white">সতর্কবার্তা</h2>
        <div className="flex flex-col gap-3 rounded-3xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950 sm:flex-row sm:items-center">
          <AlertTriangle size={30} className="shrink-0 text-amber-500" />
          <div className="flex-1">
            <p className="font-bold text-ink dark:text-white">সর্বশেষ যাচাইকৃত সরকারি সতর্কবার্তা পাওয়া যায়নি</p>
            <p className="mt-1 text-sm text-muted dark:text-slate-300">{alerts.note}</p>
          </div>
          <Link to="/sotorkobarta" className="shrink-0 rounded-full bg-amber-500 px-4 py-2.5 text-center text-sm font-bold text-white hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500">বিস্তারিত দেখুন</Link>
        </div>
      </section>

      {/* News preview */}
      <section aria-label="আবহাওয়া সংবাদ">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-ink dark:text-white">আবহাওয়া সংবাদ</h2>
          <Link to="/sangbad" className="flex items-center gap-1 text-sm font-bold text-primary hover:underline">সব সংবাদ <ArrowLeft size={15} /></Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {featured.map((a) => <NewsCard key={a.id} article={a} featured />)}
        </div>
      </section>

      {/* Districts quick */}
      <section aria-label="জনপ্রিয় জেলা">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-ink dark:text-white">জনপ্রিয় জেলার আবহাওয়া</h2>
          <Link to="/jela" className="flex items-center gap-1 text-sm font-bold text-primary hover:underline">সব ৬৪ জেলা <ArrowLeft size={15} /></Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {topDistricts.map((id) => {
            const d = districts.find((x) => x.id === id);
            return (
              <Link key={id} to={`/jela/${id}`} className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100 transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:ring-slate-700">
                <p className="flex items-center gap-1.5 font-bold text-ink dark:text-white"><MapPin size={15} className="text-primary" /> {d.nameBn}</p>
                <p className="mt-1 text-xs text-muted dark:text-slate-400">{d.divisionBn} বিভাগ</p>
                <p className="mt-2 text-sm font-semibold text-primary">বিস্তারিত দেখুন</p>
              </Link>
            );
          })}
        </div>
        <p className="mt-4 text-center text-xs text-muted dark:text-slate-400">আবহাওয়ার তথ্য: <a className="text-primary hover:underline" href={OPEN_METEO_URL} target="_blank" rel="noreferrer">Open-Meteo</a> · বিনামূল্যে অ-বাণিজ্যিক ব্যবহারের শর্ত প্রযোজ্য</p>
      </section>
    </div>
  );
}
