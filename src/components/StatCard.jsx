export default function StatCard({ icon, label, value, sub }) {
  return (
    <div className="rounded-3xl bg-white dark:bg-slate-800 p-4 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700">
      <div className="flex items-center gap-2 text-muted dark:text-slate-400">
        {icon}
        <span className="text-xs font-medium sm:text-sm">{label}</span>
      </div>
      <p className="mt-2 text-xl font-bold text-ink dark:text-white sm:text-2xl">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted dark:text-slate-400">{sub}</p>}
    </div>
  );
}
