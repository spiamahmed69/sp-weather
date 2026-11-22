export default function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-700 ${className}`} aria-hidden="true" />;
}
export function WeatherSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-56 w-full" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
      </div>
      <Skeleton className="h-36 w-full" />
    </div>
  );
}
