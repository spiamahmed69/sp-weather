import { CloudSun, Database, ShieldAlert, Newspaper, MapPin, ExternalLink, CheckCircle2 } from 'lucide-react';

export default function About() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink dark:text-white">আমাদের সম্পর্কে</h1>
        <p className="mt-2 leading-relaxed text-muted dark:text-slate-300">
          এসপি ওয়েদার বাংলাদেশের আবহাওয়া, সংবাদ ও সতর্কবার্তার একটি তথ্যভিত্তিক প্ল্যাটফর্ম। আমাদের লক্ষ্য — ৬৪ জেলার নির্ভরযোগ্য মডেল-ভিত্তিক পূর্বাভাস, সহজ বাংলায় আবহাওয়া ব্যাখ্যা এবং সরকারি সতর্কবার্তার সঠিক নির্দেশনা এক জায়গায় পৌঁছে দেওয়া।
        </p>
      </div>

      <section className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700">
          <CloudSun size={26} className="text-primary" />
          <p className="mt-3 font-bold text-ink dark:text-white">৬৪ জেলার পূর্বাভাস</p>
          <p className="mt-1 text-sm leading-relaxed text-muted dark:text-slate-300">৮ বিভাগের সব জেলার বর্তমান আবহাওয়া, ঘণ্টাভিত্তিক, ৭ দিনের ও ১৬ দিনের পূর্বাভাস।</p>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700">
          <Newspaper size={26} className="text-primary" />
          <p className="mt-3 font-bold text-ink dark:text-white">সম্পাদকীয় সংবাদ</p>
          <p className="mt-1 text-sm leading-relaxed text-muted dark:text-slate-300">আবহাওয়া বিষয়ে ব্যাখ্যামূলক নিবন্ধ — কোনো বাস্তব ঘটনা বা সংখ্যা বানানো হয় না।</p>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700">
          <ShieldAlert size={26} className="text-primary" />
          <p className="mt-3 font-bold text-ink dark:text-white">সৎ সতর্কবার্তা</p>
          <p className="mt-1 text-sm leading-relaxed text-muted dark:text-slate-300">সরকারি সতর্কবার্তা যাচাই ছাড়া দেখানো হয় না; মডেলের সম্ভাবনাকে সতর্কতা বলা হয় না।</p>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700">
          <MapPin size={26} className="text-primary" />
          <p className="mt-3 font-bold text-ink dark:text-white">মানচিত্র ও অফলাইন</p>
          <p className="mt-1 text-sm leading-relaxed text-muted dark:text-slate-300">জেলা চিহ্নসহ মানচিত্র, অন্ধকার মোড এবং অফলাইনে শেষ সংরক্ষিত তথ্য দেখার সুবিধা।</p>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink dark:text-white"><Database size={20} className="text-primary" /> তথ্যসূত্র</h2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted dark:text-slate-300">
          <li>আবহাওয়ার তথ্য: <a href="https://open-meteo.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-bold text-primary">Open-Meteo <ExternalLink size={13} /></a> — বিনামূল্যে অ-বাণিজ্যিক ব্যবহারের শর্ত প্রযোজ্য।</li>
          <li>সরকারি সতর্কবার্তা: <a href="https://bmd.gov.bd/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-bold text-primary">বাংলাদেশ আবহাওয়া অধিদপ্তর <ExternalLink size={13} /></a></li>
          <li>বন্যা পূর্বাভাস: <a href="https://ffwc.gov.bd/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-bold text-primary">বন্যা পূর্বাভাস ও সতর্কীকরণ কেন্দ্র <ExternalLink size={13} /></a></li>
          <li>মানচিত্র: OpenStreetMap অবদানকারীগণ।</li>
        </ul>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700">
        <h2 className="font-display text-lg font-bold text-ink dark:text-white">আমাদের অঙ্গীকার</h2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted dark:text-slate-300">
          <li className="flex items-start gap-2"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-500" /> ভুয়া লাইভ আবহাওয়া দেখানো হয় না — সব তথ্য Open-Meteo থেকে আসে।</li>
          <li className="flex items-start gap-2"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-500" /> সরকারি সতর্কবার্তা বানানো হয় না; যাচাই না হলে "পাওয়া যায়নি" বলা হয়।</li>
          <li className="flex items-start gap-2"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-500" /> সংবাদ বানানো হয় না — নিবন্ধগুলো ব্যাখ্যামূলক ও সম্পাদকীয়।</li>
          <li className="flex items-start gap-2"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-500" /> ১৬ দিনের পূর্বাভাস নিশ্চিত বলে দাবি করা হয় না।</li>
          <li className="flex items-start gap-2"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-500" /> সংরক্ষিত (ক্যাশ) তথ্য সবসময় "সংরক্ষিত তথ্য" হিসেবে চিহ্নিত থাকে।</li>
        </ul>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700">
        <h2 className="font-display text-lg font-bold text-ink dark:text-white">ভবিষ্যৎ পরিকল্পনা</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted dark:text-slate-300">
          সংবাদ প্রকাশের জন্য একটি সিএমএস/ডেটাবেস ও অ্যাডমিন প্যানেল যুক্ত করার পরিকল্পনা আছে। সেটি হলে নিবন্ধ প্রকাশ, সম্পাদনা ও সরকারি সতর্কবার্তা হালনাগাদের ব্যবস্থা থাকবে — তবে ভুয়া লগইন বা হার্ডকোড করা পাসওয়ার্ড দিয়ে অ্যাডমিন প্যানেল বানানো হবে না; সঠিক প্রমাণীকরণসহই তা করা হবে।
        </p>
      </section>
    </div>
  );
}
