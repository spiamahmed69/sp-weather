import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Share2, Link2, Check, ExternalLink } from 'lucide-react';
import news from '../data/news.json';
import NewsCard from '../components/NewsCard';
import EmptyState from '../components/EmptyState';
import { formatDateBn } from '../utils/format';
import { iconForName } from '../components/WeatherIcon';

export default function NewsDetails() {
  const { id } = useParams();
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const article = news.find((a) => a.slug === id);
  const related = useMemo(() => {
    if (!article) return [];
    return news.filter((a) => a.id !== article.id && a.category === article.category).concat(news.filter((a) => a.id !== article.id && a.category !== article.category)).slice(0, 3);
  }, [article]);

  if (!article) {
    return <EmptyState title="নিবন্ধ পাওয়া যায়নি" message="ঠিকানাটি যাচাই করে আবার চেষ্টা করুন।" action={<Link to="/sangbad" className="inline-block min-h-[44px] rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white">সব সংবাদ দেখুন</Link>} />;
  }

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: article.title, text: article.excerpt, url }); setShared(true); return; } catch { /* user cancelled */ }
    }
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2500); } catch { /* clipboard unavailable */ }
  };
  const copyLink = async () => {
    try { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2500); } catch { /* ignore */ }
  };

  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <Link to="/sangbad" className="inline-flex min-h-[44px] items-center gap-1 rounded-full bg-white px-4 py-2.5 text-sm font-bold text-primary shadow-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:ring-slate-700"><ArrowLeft size={16} /> সব সংবাদ</Link>

      <div className={`flex h-48 items-center justify-center rounded-[2rem] bg-gradient-to-br ${article.coverGradient} shadow-md`}>
        <span className="text-white/90">{iconForName(article.coverIcon, 72)}</span>
      </div>

      <div>
        <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-700 dark:bg-sky-900 dark:text-sky-200">{article.category}</span>
        <h1 className="mt-3 font-display text-2xl font-bold leading-snug text-ink dark:text-white sm:text-3xl">{article.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted dark:text-slate-300">
          <span className="flex items-center gap-1.5"><User size={15} /> {article.author}</span>
          <span className="flex items-center gap-1.5"><Calendar size={15} /> প্রকাশ: {formatDateBn(article.publishedAt)}</span>
          <span>হালনাগাদ: {formatDateBn(article.updatedAt)}</span>
        </div>
        <p className="mt-2 text-xs text-muted dark:text-slate-400">উৎস: {article.source}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={share} className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary">
          <Share2 size={16} /> {shared ? 'শেয়ার করা হয়েছে' : 'শেয়ার করুন'}
        </button>
        <button type="button" onClick={copyLink} className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-primary shadow-sm ring-1 ring-slate-200 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:ring-slate-700">
          {copied ? <Check size={16} /> : <Link2 size={16} />} {copied ? 'লিংক কপি হয়েছে' : 'লিংক কপি করুন'}
        </button>
      </div>

      <div className="space-y-4 rounded-3xl bg-white p-6 text-[15px] leading-relaxed text-ink shadow-sm dark:bg-slate-800 dark:text-slate-100 sm:p-8">
        <p className="text-lg font-semibold leading-relaxed">{article.excerpt}</p>
        {article.body.map((para, i) => <p key={i}>{para}</p>)}
      </div>

      <div className="rounded-3xl border border-sky-200 bg-sky-50 p-5 text-sm text-sky-800 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-200">
        <p className="font-bold">গুরুত্বপূর্ণ নোট</p>
        <p className="mt-1">এটি সম্পাদকীয় ব্যাখ্যামূলক নিবন্ধ; সর্বশেষ সরকারি সতর্কবার্তার জন্য <a href="https://bmd.gov.bd/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-bold underline">bmd.gov.bd দেখুন <ExternalLink size={13} /></a></p>
      </div>

      <section>
        <h2 className="mb-3 font-display text-lg font-bold text-ink dark:text-white">সম্পর্কিত সংবাদ</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {related.map((a) => <NewsCard key={a.id} article={a} />)}
        </div>
      </section>
    </article>
  );
}
