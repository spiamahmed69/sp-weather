import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, MapPin, Newspaper } from 'lucide-react';
import { useApp } from '../context/AppContext';
import news from '../data/news.json';

const PAGES = [
  { label: 'আজকের আবহাওয়া', path: '/ajker-abhawa', kind: 'পাতা' },
  { label: 'ঘণ্টাভিত্তিক পূর্বাভাস', path: '/ghontabhittik', kind: 'পাতা' },
  { label: '৭ দিনের পূর্বাভাস', path: '/7-din', kind: 'পাতা' },
  { label: '১৬ দিনের পূর্বাভাস', path: '/16-din', kind: 'পাতা' },
  { label: 'জেলা আবহাওয়া', path: '/jela', kind: 'পাতা' },
  { label: 'আবহাওয়া সংবাদ', path: '/sangbad', kind: 'পাতা' },
  { label: 'সতর্কবার্তা', path: '/sotorkobarta', kind: 'পাতা' },
  { label: 'মানচিত্র', path: '/manchitro', kind: 'পাতা' },
  { label: 'আমাদের সম্পর্কে', path: '/amader-somporke', kind: 'পাতা' },
  { label: 'সেটিংস', path: '/settings', kind: 'পাতা' },
];

export default function SearchBox({ onNavigate }) {
  const { districts, setDistrictId } = useApp();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const boxRef = useRef(null);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return [];
    const d = districts
      .filter((x) => x.nameBn.includes(q.trim()) || x.nameEn.toLowerCase().includes(query) || x.divisionBn.includes(q.trim()))
      .slice(0, 5)
      .map((x) => ({ type: 'district', label: x.nameBn, sub: `${x.divisionBn} বিভাগ`, path: `/jela/${x.id}`, id: x.id }));
    const n = news
      .filter((a) => a.title.includes(q.trim()) || a.category.includes(q.trim()) || a.excerpt.includes(q.trim()))
      .slice(0, 4)
      .map((a) => ({ type: 'news', label: a.title, sub: a.category, path: `/sangbad/${a.slug}` }));
    const p = PAGES.filter((pg) => pg.label.includes(q.trim())).slice(0, 3)
      .map((pg) => ({ type: 'page', label: pg.label, sub: pg.kind, path: pg.path }));
    return [...d, ...n, ...p].slice(0, 10);
  }, [q, districts]);

  useEffect(() => {
    const handler = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const go = (r) => {
    if (r.type === 'district') setDistrictId(r.id);
    navigate(r.path);
    setQ(''); setOpen(false);
    if (onNavigate) onNavigate();
  };

  return (
    <div ref={boxRef} className="relative w-full">
      <div className="flex items-center gap-2 rounded-full bg-white dark:bg-slate-800 px-4 py-2.5 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 focus-within:ring-2 focus-within:ring-primary">
        <Search size={18} className="shrink-0 text-muted" />
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(0); }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
            if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
            if (e.key === 'Enter' && results[active]) go(results[active]);
            if (e.key === 'Escape') { setQ(''); setOpen(false); }
          }}
          type="search"
          placeholder="জেলা, সংবাদ বা পাতা খুঁজুন…"
          aria-label="খুঁজুন"
          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted dark:text-white"
        />
        {q && (
          <button type="button" onClick={() => setQ('')} aria-label="খোঁজ মুছুন" className="rounded-full p-1 text-muted hover:bg-slate-100 dark:hover:bg-slate-700">
            <X size={16} />
          </button>
        )}
      </div>
      {open && q.trim() && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-xl ring-1 ring-slate-200 dark:ring-slate-700">
          {results.length === 0 ? (
            <p className="px-4 py-4 text-sm text-muted dark:text-slate-300">কোনো ফলাফল পাওয়া যায়নি। অন্য নাম দিয়ে খুঁজে দেখুন।</p>
          ) : (
            <ul role="listbox">
              {results.map((r, i) => (
                <li key={r.path + r.label}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={i === active}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(r)}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm ${i === active ? 'bg-sky-50 dark:bg-slate-700' : ''}`}
                  >
                    {r.type === 'district' ? <MapPin size={16} className="shrink-0 text-primary" /> : r.type === 'news' ? <Newspaper size={16} className="shrink-0 text-primary" /> : <Search size={16} className="shrink-0 text-primary" />}
                    <span className="min-w-0 flex-1 truncate font-medium text-ink dark:text-white">{r.label}</span>
                    <span className="shrink-0 text-xs text-muted dark:text-slate-400">{r.sub}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
