import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useApp } from '../context/AppContext';
import { WeatherSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import WeatherIcon from '../components/WeatherIcon';
import { weatherInfo } from '../utils/weatherCodes';
import { toBn, hourLabelBn, formatTemp } from '../utils/format';

export default function Hourly() {
  const { weather, loading, error, refresh, district, unit } = useApp();
  const data = useMemo(() => {
    if (!weather?.hourly) return [];
    const now = Date.now();
    return weather.hourly.time
      .map((t, i) => ({
        time: t,
        label: hourLabelBn(t),
        temp: Math.round(weather.hourly.temperature_2m[i]),
        rain: weather.hourly.precipitation_probability?.[i] ?? 0,
        wind: Math.round(weather.hourly.wind_speed_10m[i]),
        code: weather.hourly.weather_code[i],
      }))
      .filter((d) => new Date(d.time).getTime() >= now - 3600 * 1000)
      .slice(0, 24);
  }, [weather]);

  if (loading && !weather) return <WeatherSkeleton />;
  if (error && !weather) {
    return <EmptyState title="আবহাওয়ার তথ্য আনা যায়নি" message={error} action={<button type="button" onClick={refresh} className="min-h-[44px] rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white">আবার চেষ্টা করুন</button>} />;
  }
  const currentHourIdx = data.findIndex((d) => new Date(d.time).getTime() >= Date.now() - 3600 * 1000);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink dark:text-white">ঘণ্টাভিত্তিক পূর্বাভাস — {district.nameBn}</h1>
        <p className="mt-1 text-sm text-muted dark:text-slate-300">আগামী ২৪ ঘণ্টার তাপমাত্রা, বৃষ্টির সম্ভাবনা ও বাতাসের গতি।</p>
      </div>

      <section aria-label="ঘণ্টাভিত্তিক তালিকা">
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {data.map((d, i) => (
            <div key={d.time} className={`flex min-w-[84px] shrink-0 flex-col items-center rounded-3xl px-3 py-4 shadow-sm ring-1 ${i === currentHourIdx ? 'bg-primary text-white ring-primary' : 'bg-white text-ink ring-slate-100 dark:bg-slate-800 dark:text-white dark:ring-slate-700'}`}>
              <span className={`text-xs font-medium ${i === currentHourIdx ? 'text-white/85' : 'text-muted dark:text-slate-400'}`}>{i === currentHourIdx ? 'এখন' : d.label}</span>
              <WeatherIcon code={d.code} size={30} className={`my-2 ${i === currentHourIdx ? 'text-white' : 'text-primary'}`} />
              <span className="text-base font-bold">{toBn(d.temp)}°{unit}</span>
              <span className={`mt-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${i === currentHourIdx ? 'bg-white/20 text-white' : 'bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-200'}`}>{toBn(d.rain)}% বৃষ্টি</span>
              <span className={`mt-1 text-[11px] ${i === currentHourIdx ? 'text-white/85' : 'text-muted dark:text-slate-400'}`}>{weatherInfo(d.code).label}</span>
              <span className={`text-[11px] ${i === currentHourIdx ? 'text-white/85' : 'text-muted dark:text-slate-400'}`}>বাতাস {toBn(d.wind)} কিমি/ঘণ্টা</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700" aria-label="তাপমাত্রার চার্ট">
        <h2 className="mb-4 font-display text-lg font-bold text-ink dark:text-white">তাপমাত্রার ধারা (°{unit})</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={2} />
              <YAxis tick={{ fontSize: 11 }} domain={['dataMin - 2', 'dataMax + 2']} />
              <Tooltip formatter={(v) => [`${toBn(v)}°${unit}`, 'তাপমাত্রা']} labelFormatter={(l) => `সময়: ${l}`} />
              <Line type="monotone" dataKey="temp" stroke="#2676E8" strokeWidth={3} dot={false} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700" aria-label="বৃষ্টির সম্ভাবনার চার্ট">
        <h2 className="mb-4 font-display text-lg font-bold text-ink dark:text-white">বৃষ্টির সম্ভাবনা (%)</h2>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={2} />
              <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
              <Tooltip formatter={(v) => [`${toBn(v)}%`, 'বৃষ্টির সম্ভাবনা']} labelFormatter={(l) => `সময়: ${l}`} />
              <Bar dataKey="rain" fill="#22C5E8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-3 text-xs text-muted dark:text-slate-400">বৃষ্টির সম্ভাবনা মডেল-ভিত্তিক পূর্বাভাস; এটি সরকারি সতর্কবার্তা নয়।</p>
      </section>
    </div>
  );
}
