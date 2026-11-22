import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { fetchCurrentOnly } from '../services/weatherService';
import { toBn, formatTemp } from '../utils/format';
import { weatherInfo } from '../utils/weatherCodes';
import WeatherIcon from '../components/WeatherIcon';
import EmptyState from '../components/EmptyState';
import Skeleton from '../components/Skeleton';

const DIVISIONS = ['সব বিভাগ', 'ঢাকা', 'চট্টগ্রাম', 'খুলনা', 'রাজশাহী', 'বরিশাল', 'সিলেট', 'রংপুর', 'ময়মনসিংহ'];

export default function Districts() {
  const { districts, unit } = useApp();
  const [division, setDivision] = useState('সব বিভাগ');
  const [q, setQ] = useState('');
  const [temps, setTemps] = useState({});
  const [loadingIds, setLoadingIds] = useState(new Set());

  const filtered = useMemo(() => {
    return districts.filter((d) => {
      const okDiv = division === 'সব বিভাগ' || d.divisionBn === division;
      const query = q.trim();
      const okQ = !query || d.nameBn.includes(query) || d.nameEn.toLowerCase().includes(query.toLowerCase());
      return okDiv && okQ;
    });
  }, [districts, division, q]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const chunks = [];
      for (let i = 0; i < filtered.length; i += 8) chunks.push(filtered.slice(i, i + 8));
      for (const chunk of chunks) {
        if (cancelled) return;
        setLoadingIds(new Set(chunk.map((d) => d.id)));
        const results = await Promise.allSettled(chunk.map((d) => fetchCurrentOnly(d)));
        if (cancelled) return;
        setTemps((prev) => {
          const next = { ...prev };
          chunk.forEach((d, i) => {
            const r = results[i];
            if (r.status === 'fulfilled' && r.value?.current) {
              next[d.id] = {
                temp: r.value.current.temperature_2m,
                code: r.value.current.weather_code,
                max: r.value.daily?.temperature_2m_max?.[0],
                min: r.value.daily?.temperature_2m_min?.[0],
                rain: r.value.daily?.precipitation_probability_max?.[0],
              };
            }
          });
          return next;
        });
        setLoadingIds(new Set());
      }
    };
    load();
    return () => { cancelled = true; };
  }, [filtered]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink dark:text-white">জেলা আবহাওয়া</h1>
        <p className="mt-1 text-sm text-muted dark:text-slate-300">বাংলাদেশের ৮ বিভাগের ৬৪ জেলার বর্তমান আবহাওয়া। জেলায় ক্লিক করলে বিস্তারিত দেখা যাবে।</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 items-center gap-2 rounded-full bg-white px-4 py-2.5 shadow-sm ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-primary dark:bg-slate-800 dark:ring-slate-700">
          <Search size={18} className="shrink-0 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} type="search" placeholder="জেলার নাম লিখুন…" aria-label="জেলা খুঁজুন" className="w-full bg-transparent text-sm outline-none placeholder:text-muted dark:text-white" />
          {q && <button type="button" onClick={() => setQ('')} aria-label="খোঁজ মুছুন" className="rounded-full p-1 text-muted hover:bg-slate-100 dark:hover:bg-slate-700"><X size={16} /></button>}
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1" role="group" aria-label="বিভাগ নির্বাচন">
        {DIVISIONS.map((div) => (
          <button key={div} type="button" onClick={() => setDivision(div)} aria-pressed={division === div} className={`min-h-[44px] shrink-0 rounded-full px-4 py-2 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-primary ${division === div ? 'bg-primary text-white shadow' : 'bg-white text-ink ring-1 ring-slate-200 hover:bg-sky-50 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700'}`}>
            {div === 'সব বিভাগ' ? div : `${div} বিভাগ`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="কোনো জেলা পাওয়া যায়নি" message="অন্য নাম বা বিভাগ দিয়ে খুঁজে দেখুন।" action={<button type="button" onClick={() => { setQ(''); setDivision('সব বিভাগ'); }} className="min-h-[44px] rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white">সব জেলা দেখুন</button>} />
      ) : (
        <>
          <p className="text-sm text-muted dark:text-slate-300">{toBn(filtered.length)}টি জেলা দেখানো হচ্ছে</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((d) => {
              const t = temps[d.id];
              const busy = loadingIds.has(d.id);
              return (
                <Link key={d.id} to={`/jela/${d.id}`} className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100 transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:ring-slate-700">
                  <p className="flex items-center gap-1.5 font-bold text-ink dark:text-white"><MapPin size={15} className="shrink-0 text-primary" /> {d.nameBn}</p>
                  <p className="mt-0.5 text-xs text-muted dark:text-slate-400">{d.divisionBn} বিভাগ</p>
                  {busy && !t ? (
                    <Skeleton className="mt-3 h-14 w-full" />
                  ) : t ? (
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <div>
                        <p className="text-2xl font-bold text-ink dark:text-white">{formatTemp(t.temp, unit)}</p>
                        <p className="text-xs text-muted dark:text-slate-400">{weatherInfo(t.code).label}</p>
                        <p className="text-xs text-muted dark:text-slate-400">সর্বোচ্চ {formatTemp(t.max, unit)} · সর্বনিম্ন {formatTemp(t.min, unit)}</p>
                        <p className="text-xs text-sky-700 dark:text-sky-300">বৃষ্টি {toBn(t.rain ?? 0)}%</p>
                      </div>
                      <WeatherIcon code={t.code} size={40} className="shrink-0 text-primary" />
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-muted dark:text-slate-400">তাপমাত্রা আনা যায়নি — বিস্তারিত দেখতে ক্লিক করুন।</p>
                  )}
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
