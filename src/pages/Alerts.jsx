import { ShieldAlert, ExternalLink, Info, Wind, CloudRain, Flame, CloudLightning, Waves, Ship, Droplets } from 'lucide-react';
import alerts from '../data/alerts.json';
import { formatDateBn, formatTimeBn } from '../utils/format';

const CATEGORIES = [
  { icon: Wind, title: 'ঘূর্ণিঝড় সতর্কতা', desc: 'বঙ্গোপসাগরে ঘূর্ণিঝড় তৈরি হলে আবহাওয়া অধিদপ্তর সমুদ্রবন্দরের জন্য সতর্ক সংকেত জারি করে।' },
  { icon: CloudRain, title: 'ভারী বৃষ্টির সতর্কতা', desc: 'অতিভারী বৃষ্টির সম্ভাবনা থাকলে অধিদপ্তর সতর্কবার্তা প্রকাশ করে।' },
  { icon: Flame, title: 'তাপপ্রবাহ', desc: 'তাপমাত্রা অস্বাভাবিক বেড়ে গেলে তাপপ্রবাহের সতর্কবার্তা দেওয়া হয়।' },
  { icon: CloudLightning, title: 'কালবৈশাখী', desc: 'গ্রীষ্মে ঝড়ো হাওয়া ও বজ্রপাতের পূর্বাভাস সতর্কবার্তা আকারে আসে।' },
  { icon: Ship, title: 'সমুদ্রবন্দর সতর্কতা', desc: 'সাগরে ঝুঁকি থাকলে চট্টগ্রাম, কক্সবাজার, মোংলা ও পায়রা বন্দরের জন্য সংকেত জারি হয়।' },
  { icon: Waves, title: 'নদীবন্দর সতর্কতা', desc: 'নদীপথে ঝড়ো হাওয়ার আশঙ্কা থাকলে নদীবন্দরগুলোর জন্য সতর্কবার্তা দেওয়া হয়।' },
  { icon: Droplets, title: 'বন্যা পরিস্থিতি', desc: 'নদীর পানি বিপৎসীমা ছাড়ালে বন্যা পূর্বাভাস ও সতর্কীকরণ কেন্দ্র তথ্য প্রকাশ করে।' },
];

export default function Alerts() {
  const hasActive = alerts.activeAlerts && alerts.activeAlerts.length > 0;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink dark:text-white">সতর্কবার্তা</h1>
        <p className="mt-1 text-sm text-muted dark:text-slate-300">সরকারি সতর্কবার্তা শুধুমাত্র আনুষ্ঠানিক উৎস থেকে যাচাই করে দেখানো হয়। মডেলের বৃষ্টির সম্ভাবনাকে সরকারি সতর্কতা হিসেবে দেখানো হয় না।</p>
        <p className="mt-1 text-xs text-muted dark:text-slate-400">সর্বশেষ যাচাই: {formatDateBn(alerts.updatedAt)} · {formatTimeBn(alerts.updatedAt)}</p>
      </div>

      {hasActive ? (
        <div className="space-y-3">
          {alerts.activeAlerts.map((a, i) => (
            <div key={i} className="rounded-3xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950">
              <p className="font-bold text-red-800 dark:text-red-200">{a.title}</p>
              <p className="mt-1 text-sm text-red-700 dark:text-red-300">{a.text}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4 rounded-3xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900 dark:bg-emerald-950 sm:flex-row sm:items-start">
          <ShieldAlert size={36} className="shrink-0 text-emerald-600" />
          <div>
            <p className="text-lg font-bold text-emerald-900 dark:text-emerald-100">সর্বশেষ যাচাইকৃত সরকারি সতর্কবার্তা পাওয়া যায়নি</p>
            <p className="mt-2 text-sm leading-relaxed text-emerald-800 dark:text-emerald-200">{alerts.note}</p>
            <p className="mt-2 text-sm text-emerald-800 dark:text-emerald-200">মেয়াদোত্তীর্ণ সতর্কবার্তা সক্রিয় হিসেবে দেখানো হয় না। সর্বশেষ আনুষ্ঠানিক তথ্যের জন্য নিচের সরকারি লিংকগুলো দেখুন।</p>
          </div>
        </div>
      )}

      <section>
        <h2 className="mb-3 font-display text-lg font-bold text-ink dark:text-white">সরকারি উৎস</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <a href="https://bmd.gov.bd/" target="_blank" rel="noreferrer" className="flex items-start gap-3 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100 transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:ring-slate-700">
            <ShieldAlert size={28} className="shrink-0 text-primary" />
            <span>
              <span className="flex items-center gap-1 font-bold text-ink dark:text-white">বাংলাদেশ আবহাওয়া অধিদপ্তর <ExternalLink size={14} className="text-muted" /></span>
              <span className="mt-1 block text-sm text-muted dark:text-slate-300">bmd.gov.bd — ঘূর্ণিঝড়, বৃষ্টি, তাপপ্রবাহসহ সব সরকারি সতর্কবার্তার আনুষ্ঠানিক উৎস।</span>
            </span>
          </a>
          <a href="https://ffwc.gov.bd/" target="_blank" rel="noreferrer" className="flex items-start gap-3 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100 transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:ring-slate-700">
            <Waves size={28} className="shrink-0 text-primary" />
            <span>
              <span className="flex items-center gap-1 font-bold text-ink dark:text-white">বন্যা পূর্বাভাস ও সতর্কীকরণ কেন্দ্র <ExternalLink size={14} className="text-muted" /></span>
              <span className="mt-1 block text-sm text-muted dark:text-slate-300">ffwc.gov.bd — নদীর পানির স্তর ও বন্যা পরিস্থিতির আনুষ্ঠানিক তথ্য।</span>
            </span>
          </a>
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-bold text-ink dark:text-white">সতর্কবার্তার ধরন — সাধারণ তথ্য</h2>
        <p className="mb-3 flex items-start gap-2 rounded-2xl bg-sky-50 p-4 text-sm text-sky-800 dark:bg-sky-950 dark:text-sky-200">
          <Info size={18} className="mt-0.5 shrink-0" /> নিচের ব্যাখ্যাগুলো সাধারণ তথ্য মাত্র; এটি সক্রিয় সতর্কবার্তা নয়। সক্রিয় সতর্কবার্তা থাকলে তা উপরে লাল/কমলা চিহ্নসহ দেখানো হবে।
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => (
            <div key={c.title} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700">
              <c.icon size={26} className="text-primary" />
              <p className="mt-3 font-bold text-ink dark:text-white">{c.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted dark:text-slate-300">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
