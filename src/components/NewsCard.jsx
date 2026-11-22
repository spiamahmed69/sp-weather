import { Link } from 'react-router-dom';
import { Calendar, ArrowLeft } from 'lucide-react';
import { formatDateBn } from '../utils/format';
import { iconForName } from './WeatherIcon';

export default function NewsCard({ article, featured = false }) {
  return (
    <Link to={`/sangbad/${article.slug}`} className="group block overflow-hidden rounded-3xl bg-white dark:bg-slate-800 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700 transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary">
      <div className={`relative flex h-36 items-center justify-center bg-gradient-to-br ${article.coverGradient}`}>
        <span className="text-white/90">{iconForName(article.coverIcon, 56)}</span>
        <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-navy">{article.category}</span>
        {featured && <span className="absolute left-3 top-3 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-navy">বিশেষ</span>}
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 font-display text-base font-bold leading-snug text-ink group-hover:text-primary dark:text-white">{article.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted dark:text-slate-300">{article.excerpt}</p>
        <div className="mt-3 flex items-center justify-between text-xs text-muted dark:text-slate-400">
          <span className="flex items-center gap-1"><Calendar size={13} /> {formatDateBn(article.publishedAt)}</span>
          <span className="flex items-center gap-1 font-semibold text-primary">পড়ুন <ArrowLeft size={13} /></span>
        </div>
      </div>
    </Link>
  );
}
