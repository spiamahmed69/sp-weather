import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import news from '../data/news.json';
import NewsCard from '../components/NewsCard';
import EmptyState from '../components/EmptyState';

const CATEGORIES = ['সব সংবাদ', 'আজকের আবহাওয়া', 'ঘূর্ণিঝড়', 'বৃষ্টিপাত', 'বন্যা', 'তাপপ্রবাহ', 'শৈত্যপ্রবাহ', 'কালবৈশাখী', 'নদী পরিস্থিতি', 'সমুদ্র পরিস্থিতি', 'আবহাওয়া বিশ্লেষণ'];

export default function News() {
  const [category, setCategory] = useState('সব সংবাদ');
  const [q, setQ] = useState('');
  const filtered = useMemo(() => {
    return news.filter((a) => {
      const okCat = category === 'সব সংবাদ' || a.category === category;
      const query = q.trim();
      const okQ = !query || a.title.includes(query) || a.excerpt.includes(query) || a.body.join(' ').includes(query);
      return okCat && okQ;
    });
  }, [category, q]);
  const featured = news.filter((a) => a.featured);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink dark:text-white">আবহাওয়া সংবাদ</h1>
        <p className="mt-1 text-sm text-muted dark:text-slate-300">সম্পাদকীয় ব্যাখ্যামূলক নিবন্ধ — কোনো বাস্তব ঘটনা বা সরকারি সতর্কবার্তা হিসেবে নয়। সর্বশেষ সরকারি সতর্কবার্তার জন্য bmd.gov.bd দেখুন।</p>
      </div>

      <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 shadow-sm ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-primary dark:bg-slate-800 dark:ring-slate-700">
        <Search size={18} className="shrink-0 text-muted" />
        <input value={q} onChange={(e) => setQ(e.target.value)} type="search" placeholder="সংবাদ খুঁজুন…" aria-label="সংবাদ খুঁজুন" className="w-full bg-transparent text-sm outline-none placeholder:text-muted dark:text-white" />
        {q && <button type="button" onClick={() => setQ('')} aria-label="খোঁজ মুছুন" className="rounded-full p-1 text-muted hover:bg-slate-100 dark:hover:bg-slate-700"><X size={16} /></button>}
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1" role="group" aria-label="বিভাগ নির্বাচন">
        {CATEGORIES.map((c) => (
          <button key={c} type="button" onClick={() => setCategory(c)} aria-pressed={category === c} className={`min-h-[44px] shrink-0 rounded-full px-4 py-2 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-primary ${category === c ? 'bg-primary text-white shadow' : 'bg-white text-ink ring-1 ring-slate-200 hover:bg-sky-50 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700'}`}>
            {c}
          </button>
        ))}
      </div>

      {category === 'সব সংবাদ' && !q.trim() && (
        <section aria-label="বিশেষ সংবাদ">
          <h2 className="mb-3 font-display text-lg font-bold text-ink dark:text-white">বিশেষ সংবাদ</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {featured.map((a) => <NewsCard key={a.id} article={a} featured />)}
          </div>
        </section>
      )}

      <section aria-label="সব সংবাদ">
        <h2 className="mb-3 font-display text-lg font-bold text-ink dark:text-white">{category === 'সব সংবাদ' ? 'সব সংবাদ' : category}</h2>
        {filtered.length === 0 ? (
          <EmptyState title="কোনো সংবাদ পাওয়া যায়নি" message="অন্য শব্দ বা বিভাগ দিয়ে খুঁজে দেখুন।" action={<button type="button" onClick={() => { setQ(''); setCategory('সব সংবাদ'); }} className="min-h-[44px] rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white">সব সংবাদ দেখুন</button>} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a) => <NewsCard key={a.id} article={a} />)}
          </div>
        )}
      </section>
    </div>
  );
}
