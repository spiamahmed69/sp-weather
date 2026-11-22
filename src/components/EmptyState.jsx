import { SearchX } from 'lucide-react';
export default function EmptyState({ title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl bg-white dark:bg-slate-800 p-10 text-center shadow-sm">
      <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 text-primary dark:bg-slate-700 dark:text-sky-300">
        <SearchX size={30} />
      </span>
      <h3 className="text-lg font-bold text-ink dark:text-white">{title}</h3>
      {message && <p className="mt-2 max-w-md text-sm text-muted dark:text-slate-300">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
