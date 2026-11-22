import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { WeatherSkeleton } from './components/Skeleton';
import Home from './pages/Home';
import Today from './pages/Today';
import Weekly from './pages/Weekly';
import LongRange from './pages/LongRange';
import Districts from './pages/Districts';
import DistrictDetails from './pages/DistrictDetails';
import News from './pages/News';
import NewsDetails from './pages/NewsDetails';
import Alerts from './pages/Alerts';
import About from './pages/About';
import Settings from './pages/Settings';
import EmptyState from './components/EmptyState';
import { Link } from 'react-router-dom';

// Heavy pages code-split (Leaflet + Recharts load only when visited)
const Hourly = lazy(() => import('./pages/Hourly'));
const WeatherMap = lazy(() => import('./pages/WeatherMap'));

const TITLES = {
  '/': 'এসপি ওয়েদার | বাংলাদেশের আবহাওয়া, সংবাদ ও সতর্কবার্তা',
  '/ajker-abhawa': 'আজকের আবহাওয়া | এসপি ওয়েদার',
  '/ghontabhittik': 'ঘণ্টাভিত্তিক পূর্বাভাস | এসপি ওয়েদার',
  '/7-din': '৭ দিনের পূর্বাভাস | এসপি ওয়েদার',
  '/16-din': '১৬ দিনের পূর্বাভাস | এসপি ওয়েদার',
  '/jela': 'জেলা আবহাওয়া | এসপি ওয়েদার',
  '/sangbad': 'আবহাওয়া সংবাদ | এসপি ওয়েদার',
  '/sotorkobarta': 'সতর্কবার্তা | এসপি ওয়েদার',
  '/manchitro': 'আবহাওয়া মানচিত্র | এসপি ওয়েদার',
  '/amader-somporke': 'আমাদের সম্পর্কে | এসপি ওয়েদার',
  '/settings': 'সেটিংস | এসপি ওয়েদার',
};

function TitleUpdater() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = TITLES[pathname] || 'এসপি ওয়েদার | বাংলাদেশের আবহাওয়া, সংবাদ ও সতর্কবার্তা';
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function NotFound() {
  return (
    <EmptyState
      title="পাতাটি পাওয়া যায়নি"
      message="ঠিকানাটি ভুল হতে পারে, অথবা পাতাটি সরিয়ে নেওয়া হয়েছে।"
      action={<Link to="/" className="inline-block min-h-[44px] rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white">হোমে ফিরুন</Link>}
    />
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <TitleUpdater />
        <ErrorBoundary>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="ajker-abhawa" element={<Today />} />
              <Route path="ghontabhittik" element={<Suspense fallback={<WeatherSkeleton />}><Hourly /></Suspense>} />
              <Route path="7-din" element={<Weekly />} />
              <Route path="16-din" element={<LongRange />} />
              <Route path="jela" element={<Districts />} />
              <Route path="jela/:id" element={<DistrictDetails />} />
              <Route path="sangbad" element={<News />} />
              <Route path="sangbad/:id" element={<NewsDetails />} />
              <Route path="sotorkobarta" element={<Alerts />} />
              <Route path="manchitro" element={<Suspense fallback={<WeatherSkeleton />}><WeatherMap /></Suspense>} />
              <Route path="amader-somporke" element={<About />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </AppProvider>
  );
}
