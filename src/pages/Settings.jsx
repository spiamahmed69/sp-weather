import { useState } from 'react';
import { Sun, Moon, Thermometer, RefreshCw, Bell, Trash2, Download, MapPin, Check, HardDrive } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { clearWeatherCache } from '../services/weatherService';
import { toBn } from '../utils/format';

export default function Settings() {
  const { theme, toggleTheme, district, districts, districtId, setDistrictId, unit, setUnit, refreshInterval, setRefreshInterval, notifications, setNotifications, online } = useApp();
  const [cacheMsg, setCacheMsg] = useState('');
  const [installMsg, setInstallMsg] = useState('');

  const handleClearCache = () => {
    clearWeatherCache();
    try { localStorage.removeItem('spw-district'); } catch { /* ignore */ }
    setCacheMsg('ক্যাশ মুছে ফেলা হয়েছে। পরের বার আবহাওয়া নতুন করে আনা হবে।');
    setTimeout(() => setCacheMsg(''), 4000);
  };

  const handleInstallHint = () => {
    setInstallMsg('ব্রাউজারের ঠিকানা বারের পাশের "ইনস্টল" বা শেয়ার মেনুর "হোম স্ক্রিনে যোগ করুন" বিকল্পটি ব্যবহার করুন।');
    setTimeout(() => setInstallMsg(''), 6000);
  };

  let cacheCount = 0;
  try { cacheCount = Object.keys(localStorage).filter((k) => k.startsWith('spw-cache-')).length; } catch { /* ignore */ }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink dark:text-white">সেটিংস</h1>
        <p className="mt-1 text-sm text-muted dark:text-slate-300">আপনার পছন্দ এই ডিভাইসে সংরক্ষিত থাকবে।</p>
      </div>

      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700">
        <h2 className="font-display text-lg font-bold text-ink dark:text-white">চেহারা</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={() => theme !== 'light' && toggleTheme()} aria-pressed={theme === 'light'} className={`inline-flex min-h-[44px] items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary ${theme === 'light' ? 'bg-primary text-white' : 'bg-slate-100 text-ink dark:bg-slate-700 dark:text-slate-200'}`}>
            <Sun size={16} /> হালকা মোড
          </button>
          <button type="button" onClick={() => theme !== 'dark' && toggleTheme()} aria-pressed={theme === 'dark'} className={`inline-flex min-h-[44px] items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary ${theme === 'dark' ? 'bg-primary text-white' : 'bg-slate-100 text-ink dark:bg-slate-700 dark:text-slate-200'}`}>
            <Moon size={16} /> অন্ধকার মোড
          </button>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink dark:text-white"><MapPin size={20} className="text-primary" /> আমার জেলা</h2>
        <p className="mt-1 text-sm text-muted dark:text-slate-300">বর্তমান জেলা: <b className="text-ink dark:text-white">{district.nameBn}</b></p>
        <select value={districtId} onChange={(e) => setDistrictId(e.target.value)} aria-label="জেলা নির্বাচন করুন" className="mt-3 min-h-[44px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-ink outline-none focus:ring-2 focus:ring-primary dark:border-slate-600 dark:bg-slate-700 dark:text-white">
          {districts.map((d) => <option key={d.id} value={d.id}>{d.nameBn} — {d.divisionBn}</option>)}
        </select>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink dark:text-white"><Thermometer size={20} className="text-primary" /> তাপমাত্রার একক</h2>
        <div className="mt-4 flex gap-2">
          {['C', 'F'].map((u) => (
            <button key={u} type="button" onClick={() => setUnit(u)} aria-pressed={unit === u} className={`min-h-[44px] min-w-[64px] rounded-full px-5 py-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary ${unit === u ? 'bg-primary text-white' : 'bg-slate-100 text-ink dark:bg-slate-700 dark:text-slate-200'}`}>
              °{u}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink dark:text-white"><RefreshCw size={20} className="text-primary" /> হালনাগাদের বিরতি</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {[0, 10, 30, 60].map((m) => (
            <button key={m} type="button" onClick={() => setRefreshInterval(m)} aria-pressed={refreshInterval === m} className={`min-h-[44px] rounded-full px-5 py-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary ${refreshInterval === m ? 'bg-primary text-white' : 'bg-slate-100 text-ink dark:bg-slate-700 dark:text-slate-200'}`}>
              {m === 0 ? 'স্বয়ংক্রিয় নয়' : `প্রতি ${toBn(m)} মিনিট`}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted dark:text-slate-400">স্বয়ংক্রিয় হালনাগাদ বন্ধ থাকলেও উপরের রিফ্রেশ বোতাম দিয়ে যেকোনো সময় হালনাগাদ করা যাবে।</p>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink dark:text-white"><Bell size={20} className="text-primary" /> বিজ্ঞপ্তি</h2>
        <button type="button" role="switch" aria-checked={notifications} onClick={() => setNotifications(!notifications)} className="mt-4 flex min-h-[44px] w-full items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-700">
          <span className="text-sm font-semibold text-ink dark:text-white">আবহাওয়া সতর্কবার্তার বিজ্ঞপ্তি (শুধু পছন্দ সংরক্ষণ)</span>
          <span className={`flex h-7 w-12 shrink-0 items-center rounded-full px-1 transition ${notifications ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-500'}`}>
            <span className={`h-5 w-5 rounded-full bg-white shadow transition ${notifications ? 'translate-x-5' : ''}`} />
          </span>
        </button>
        <p className="mt-2 text-xs text-muted dark:text-slate-400">এই সংস্করণে বিজ্ঞপ্তি পাঠানো হয় না — শুধু আপনার পছন্দটি সংরক্ষণ করা হয়। সরকারি সতর্কবার্তা যাচাই হলে ভবিষ্যতে বিজ্ঞপ্তি যুক্ত হবে।</p>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink dark:text-white"><HardDrive size={20} className="text-primary" /> সংরক্ষণ ও অফলাইন</h2>
        <p className="mt-2 text-sm text-muted dark:text-slate-300">অবস্থা: <b className="text-ink dark:text-white">{online ? 'অনলাইন' : 'অফলাইন — সংরক্ষিত তথ্য দেখানো হচ্ছে'}</b></p>
        <p className="mt-1 text-sm text-muted dark:text-slate-300">সংরক্ষিত জেলার আবহাওয়া: {toBn(cacheCount)}টি</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={handleClearCache} className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-rose-50 px-5 py-2.5 text-sm font-bold text-rose-600 ring-1 ring-rose-200 hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-500 dark:bg-rose-950 dark:text-rose-300">
            <Trash2 size={16} /> ক্যাশ মুছুন
          </button>
          <button type="button" onClick={handleInstallHint} className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary">
            <Download size={16} /> অ্যাপ হিসেবে ইনস্টল করুন
          </button>
        </div>
        {cacheMsg && <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-emerald-600"><Check size={16} /> {cacheMsg}</p>}
        {installMsg && <p className="mt-3 text-sm text-muted dark:text-slate-300">{installMsg}</p>}
      </section>
    </div>
  );
}
