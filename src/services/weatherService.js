const BASE = 'https://api.open-meteo.com/v1/forecast';
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

function cacheKey(id) { return `spw-cache-${id}`; }

export function readCache(id) {
  try {
    const raw = localStorage.getItem(cacheKey(id));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.fetchedAt > CACHE_TTL_MS) return { ...parsed, stale: true };
    return { ...parsed, stale: false };
  } catch { return null; }
}

function writeCache(id, data) {
  try { localStorage.setItem(cacheKey(id), JSON.stringify({ ...data, fetchedAt: Date.now() })); } catch { /* storage full/blocked */ }
}

export function clearWeatherCache() {
  try {
    Object.keys(localStorage).filter((k) => k.startsWith('spw-cache-')).forEach((k) => localStorage.removeItem(k));
  } catch { /* ignore */ }
}

export async function fetchWeather(district, { force = false } = {}) {
  if (!force) {
    const cached = readCache(district.id);
    if (cached && !cached.stale) return { ...cached.data, cachedAt: cached.fetchedAt, fromCache: true };
  }
  const params = new URLSearchParams({
    latitude: String(district.latitude),
    longitude: String(district.longitude),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m',
    hourly: 'temperature_2m,precipitation_probability,precipitation,relative_humidity_2m,wind_speed_10m,weather_code',
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,sunrise,sunset,wind_speed_10m_max,weather_code',
    forecast_days: '16',
    timezone: 'Asia/Dhaka',
  });
  const url = `${BASE}?${params.toString()}`;
  let lastError = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`আবহাওয়া সার্ভার সাড়া দিচ্ছে না (কোড ${res.status})`);
      const data = await res.json();
      writeCache(district.id, { data });
      return { ...data, cachedAt: Date.now(), fromCache: false };
    } catch (err) {
      lastError = err;
      await new Promise((r) => setTimeout(r, 800));
    }
  }
  const stale = readCache(district.id);
  if (stale) return { ...stale.data, cachedAt: stale.fetchedAt, fromCache: true, stale: true };
  throw lastError || new Error('আবহাওয়ার তথ্য আনা যায়নি। ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।');
}

export async function fetchCurrentOnly(district) {
  const cached = readCache(district.id);
  if (cached && !cached.stale && cached.data?.current) {
    return { current: cached.data.current, daily: cached.data.daily, fromCache: true };
  }
  const params = new URLSearchParams({
    latitude: String(district.latitude),
    longitude: String(district.longitude),
    current: 'temperature_2m,weather_code,precipitation_probability',
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    forecast_days: '1',
    timezone: 'Asia/Dhaka',
  });
  const res = await fetch(`${BASE}?${params.toString()}`);
  if (!res.ok) throw new Error('তথ্য আনা যায়নি');
  return await res.json();
}

export const OPEN_METEO_URL = 'https://open-meteo.com';
