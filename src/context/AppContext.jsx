import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import districts from '../data/bangladesh-locations.json';
import { fetchWeather } from '../services/weatherService';

const AppContext = createContext(null);

function readStored(key, fallback) {
  try { const v = localStorage.getItem(key); return v === null ? fallback : v; } catch { return fallback; }
}

export function AppProvider({ children }) {
  const [districtId, setDistrictIdState] = useState(() => readStored('spw-district', 'dhaka'));
  const [theme, setThemeState] = useState(() => readStored('spw-theme', 'light'));
  const [unit, setUnitState] = useState(() => readStored('spw-unit', 'C'));
  const [refreshInterval, setRefreshIntervalState] = useState(() => Number(readStored('spw-refresh', '10')) || 10);
  const [notifications, setNotificationsState] = useState(() => readStored('spw-notifications', 'off') === 'on');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [fromCache, setFromCache] = useState(false);
  const [online, setOnline] = useState(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));
  const [locating, setLocating] = useState(false);
  const [locationMsg, setLocationMsg] = useState('');
  const timerRef = useRef(null);

  const district = useMemo(
    () => districts.find((d) => d.id === districtId) || districts[0],
    [districtId]
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try { localStorage.setItem('spw-theme', theme); } catch { /* ignore */ }
  }, [theme]);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  const load = useCallback(async (force = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeather(district, { force });
      setWeather(data);
      setLastUpdated(data.cachedAt ? new Date(data.cachedAt) : new Date());
      setFromCache(Boolean(data.fromCache));
    } catch (err) {
      setError(err?.message || 'আবহাওয়ার তথ্য আনা যায়নি।');
    } finally {
      setLoading(false);
    }
  }, [district]);

  const refresh = useCallback(() => load(true), [load]);

  useEffect(() => { load(false); }, [load]);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (refreshInterval > 0) {
      timerRef.current = setInterval(() => load(false), refreshInterval * 60 * 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [refreshInterval, load]);

  const setDistrictId = (id) => {
    setDistrictIdState(id);
    try { localStorage.setItem('spw-district', id); } catch { /* ignore */ }
  };
  const toggleTheme = () => setThemeState((t) => (t === 'dark' ? 'light' : 'dark'));
  const setUnit = (u) => { setUnitState(u); try { localStorage.setItem('spw-unit', u); } catch { /* ignore */ } };
  const setRefreshInterval = (m) => { setRefreshIntervalState(m); try { localStorage.setItem('spw-refresh', String(m)); } catch { /* ignore */ } };
  const setNotifications = (on) => { setNotificationsState(on); try { localStorage.setItem('spw-notifications', on ? 'on' : 'off'); } catch { /* ignore */ } };

  const detectLocation = () => {
    if (!('geolocation' in navigator)) { setLocationMsg('আপনার ডিভাইসে অবস্থান সুবিধা নেই।'); return; }
    setLocating(true);
    setLocationMsg('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const { latitude, longitude } = pos.coords;
        let best = districts[0]; let bestD = Infinity;
        for (const d of districts) {
          const dd = (d.latitude - latitude) ** 2 + (d.longitude - longitude) ** 2;
          if (dd < bestD) { bestD = dd; best = d; }
        }
        setDistrictId(best.id);
        setLocationMsg(`আপনার কাছের জেলা ${best.nameBn} নির্বাচন করা হয়েছে।`);
      },
      () => { setLocating(false); setLocationMsg('অবস্থান নেওয়া যায়নি। অনুমতি দিলে আবার চেষ্টা করুন।'); },
      { timeout: 10000 }
    );
  };

  const value = {
    districts, district, districtId, setDistrictId,
    theme, toggleTheme, unit, setUnit,
    refreshInterval, setRefreshInterval,
    notifications, setNotifications,
    weather, loading, error, lastUpdated, fromCache, refresh,
    online, locating, locationMsg, detectLocation,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp অবশ্যই AppProvider-এর ভেতরে ব্যবহার করতে হবে');
  return ctx;
}
export { districts };
