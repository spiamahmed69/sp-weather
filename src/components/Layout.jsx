import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { CloudSun, Sun, Moon, RefreshCw, Home, Clock, CalendarDays, MapPin, Newspaper, Menu, X, Wifi, WifiOff, LocateFixed } from 'lucide-react';
import { useApp } from '../context/AppContext';
import SearchBox from './SearchBox';
import { formatDateBn, formatTimeBn, toBn } from '../utils/format';
import { OPEN_METEO_URL } from '../services/weatherService';

const DESKTOP_NAV = [
  { to: '/', label: 'হোম', end: true },
  { to: '/ajker-abhawa', label: 'আজকের আবহাওয়া' },
  { to: '/ghontabhittik', label: 'ঘণ্টাভিত্তিক' },
  { to: '/7-din', label: '৭ দিনের পূর্বাভাস' },
  { to: '/16-din', label: '১৬ দিনের পূর্বাভাস' },
  { to: '/jela', label: 'জেলা আবহাওয়া' },
  { to: '/sangbad', label: 'আবহাওয়া সংবাদ' },
  { to: '/sotorkobarta', label: 'সতর্কবার্তা' },
  { to: '/manchitro', label: 'মানচিত্র' },
  { to: '/amader-somporke', label: 'আমাদের সম্পর্কে' },
];
const BOTTOM_NAV = [
  { to: '/', label: 'হোম', icon: Home, end: true },
  { to: '/ghontabhittik', label: 'ঘণ্টাভিত্তিক', icon: Clock },
  { to: '/7-din', label: '৭ দিন', icon: CalendarDays },
  { to: '/jela', label: 'জেলা', icon: MapPin },
  { to: '/sangbad', label: 'সংবাদ', icon: Newspaper },
];

export default function Layout() {
  const { theme, toggleTheme, refresh, loading, lastUpdated, online, district, detectLocation, locating, locationMsg } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg text-ink dark:bg-[#0B1626] dark:text-slate-100">
      <header className="sticky top-0 z-40 border-b border-white/60 bg-bg/80 backdrop-blur-lg dark:border-slate-800 dark:bg-[#0B1626]/80">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          <Link to="/" className="flex shrink-0 items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary rounded-xl" aria-label="এসপি ওয়েদার হোম">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-cyan-sky text-white shadow-md">
              <CloudSun size={26} />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-lg font-bold text-navy dark:text-white">এসপি ওয়েদার</span>
              <span className="hidden text-[11px] text-muted dark:text-slate-400 sm:block">বাংলাদেশের আবহাওয়া, সংবাদ ও সতর্কবার্তা</span>
            </span>
          </Link>
          <div className="hidden min-w-0 flex-1 md:block"><SearchBox /></div>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <span className={`hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold lg:flex ${online ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200' : 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-200'}`}>
              {online ? <Wifi size={14} /> : <WifiOff size={14} />} {online ? 'অনলাইন' : 'অফলাইন'}
            </span>
            <button type="button" onClick={detectLocation} disabled={locating} title="আমার অবস্থান দিয়ে কাছের জেলা খুঁজুন" className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-white text-primary shadow-sm ring-1 ring-slate-200 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:ring-slate-700">
              <LocateFixed size={19} />
            </button>
            <button type="button" onClick={refresh} disabled={loading} title="আবহাওয়া হালনাগাদ করুন" aria-label="আবহাওয়া হালনাগাদ করুন" className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-white text-primary shadow-sm ring-1 ring-slate-200 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 dark:bg-slate-800 dark:ring-slate-700">
              <RefreshCw size={19} className={loading ? 'animate-spin' : ''} />
            </button>
            <button type="button" onClick={toggleTheme} title={theme === 'dark' ? 'হালকা মোড' : 'অন্ধকার মোড'} aria-label="থিম বদলান" className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-white text-primary shadow-sm ring-1 ring-slate-200 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:ring-slate-700">
              {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
            </button>
            <button type="button" onClick={() => setMenuOpen((v) => !v)} aria-label="মেনু" className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-white text-primary shadow-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:ring-slate-700 lg:hidden">
              {menuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>
        <div className="px-4 pb-3 md:hidden"><SearchBox /></div>
        <nav className="hidden overflow-x-auto no-scrollbar border-t border-slate-100 px-4 dark:border-slate-800 lg:block" aria-label="প্রধান মেনু">
          <ul className="mx-auto flex max-w-7xl gap-1 py-2">
            {DESKTOP_NAV.map((item) => (
              <li key={item.to} className="shrink-0">
                <NavLink to={item.to} end={item.end} className={({ isActive }) => `block rounded-full px-3.5 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-primary ${isActive ? 'bg-primary text-white shadow-sm' : 'text-ink hover:bg-white dark:text-slate-200 dark:hover:bg-slate-800'}`}>
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li className="ml-auto shrink-0">
              <NavLink to="/settings" className={({ isActive }) => `block rounded-full px-3.5 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary ${isActive ? 'bg-primary text-white' : 'text-ink hover:bg-white dark:text-slate-200 dark:hover:bg-slate-800'}`}>সেটিংস</NavLink>
            </li>
          </ul>
        </nav>
        {menuOpen && (
          <nav className="border-t border-slate-100 px-4 py-3 dark:border-slate-800 lg:hidden" aria-label="মোবাইল মেনু">
            <ul className="grid grid-cols-2 gap-2">
              {[...DESKTOP_NAV, { to: '/settings', label: 'সেটিংস' }].map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} end={item.end} onClick={() => setMenuOpen(false)} className={({ isActive }) => `block rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary ${isActive ? 'bg-primary text-white' : 'bg-white text-ink dark:bg-slate-800 dark:text-slate-200'}`}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      {locationMsg && (
        <div className="mx-auto max-w-7xl px-4 pt-3">
          <p className="rounded-2xl bg-sky-100 px-4 py-2.5 text-sm font-medium text-sky-800 dark:bg-sky-900 dark:text-sky-100">{locationMsg}</p>
        </div>
      )}

      <main className="mx-auto max-w-7xl px-4 pb-28 pt-4 sm:pt-6 lg:pb-10">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-xs text-muted dark:text-slate-400 sm:text-sm">
          <span>{formatDateBn(new Date())} · {district.nameBn}, {district.divisionBn}</span>
          <span>{lastUpdated ? `সর্বশেষ হালনাগাদ: ${formatTimeBn(lastUpdated)}` : 'হালনাগাদ হচ্ছে…'}</span>
        </div>
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white pb-24 dark:border-slate-800 dark:bg-slate-900 lg:pb-8">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:grid-cols-3">
          <div>
            <p className="flex items-center gap-2 font-display text-lg font-bold text-navy dark:text-white"><CloudSun size={22} className="text-primary" /> এসপি ওয়েদার</p>
            <p className="mt-2 text-sm text-muted dark:text-slate-300">বাংলাদেশের আবহাওয়া, সংবাদ ও সতর্কবার্তা — ৬৪ জেলার মডেল-ভিত্তিক পূর্বাভাস ও সম্পাদকীয় আবহাওয়া সংবাদ।</p>
          </div>
          <div>
            <p className="font-bold text-ink dark:text-white">দ্রুত লিংক</p>
            <ul className="mt-2 space-y-1.5 text-sm">
              <li><Link className="text-primary hover:underline" to="/7-din">৭ দিনের পূর্বাভাস</Link></li>
              <li><Link className="text-primary hover:underline" to="/jela">জেলা আবহাওয়া</Link></li>
              <li><Link className="text-primary hover:underline" to="/sangbad">আবহাওয়া সংবাদ</Link></li>
              <li><Link className="text-primary hover:underline" to="/sotorkobarta">সতর্কবার্তা</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-bold text-ink dark:text-white">তথ্যসূত্র</p>
            <ul className="mt-2 space-y-1.5 text-sm text-muted dark:text-slate-300">
              <li>আবহাওয়ার তথ্য: <a href={OPEN_METEO_URL} target="_blank" rel="noreferrer" className="text-primary hover:underline">Open-Meteo</a> (বিনামূল্যে অ-বাণিজ্যিক ব্যবহার)</li>
              <li>সরকারি সতর্কবার্তা: <a href="https://bmd.gov.bd/" target="_blank" rel="noreferrer" className="text-primary hover:underline">বাংলাদেশ আবহাওয়া অধিদপ্তর</a></li>
              <li>বন্যা পূর্বাভাস: <a href="https://ffwc.gov.bd/" target="_blank" rel="noreferrer" className="text-primary hover:underline">বন্যা পূর্বাভাস ও সতর্কীকরণ কেন্দ্র</a></li>
            </ul>
          </div>
        </div>
        <p className="border-t border-slate-100 px-4 py-4 text-center text-xs text-muted dark:border-slate-800 dark:text-slate-400">© {toBn(new Date().getFullYear())} এসপি ওয়েদার · মডেল পূর্বাভাস সরকারি সতর্কবার্তার বিকল্প নয়।</p>
      </footer>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur dark:border-slate-700 dark:bg-slate-900/95 lg:hidden" aria-label="নিচের মেনু">
        <ul className="grid grid-cols-5">
          {BOTTOM_NAV.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} end={item.end} className={({ isActive }) => `flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-[11px] font-semibold focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary ${isActive ? 'text-primary' : 'text-muted dark:text-slate-400'}`}>
                <item.icon size={21} />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
