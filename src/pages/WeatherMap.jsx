import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { fetchCurrentOnly } from '../services/weatherService';
import { formatTemp, toBn } from '../utils/format';

const MAP_DISTRICTS = ['dhaka', 'chattogram', 'khulna', 'rajshahi', 'sylhet', 'barishal', 'rangpur', 'mymensingh', 'coxsbazar', 'cumilla', 'bogura', 'jashore'];

export default function WeatherMap() {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const { districts, unit, setDistrictId } = useApp();
  const navigate = useNavigate();
  const [temps, setTemps] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, { scrollWheelZoom: true }).setView([23.8, 90.4], 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> অবদানকারীগণ',
      maxZoom: 12,
    }).addTo(map);
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const targets = MAP_DISTRICTS.map((id) => districts.find((d) => d.id === id)).filter(Boolean);
      const results = await Promise.allSettled(targets.map((d) => fetchCurrentOnly(d)));
      if (cancelled) return;
      const next = {};
      results.forEach((r, i) => {
        if (r.status === 'fulfilled' && r.value?.current) next[targets[i].id] = r.value.current.temperature_2m;
      });
      setTemps(next);
      setLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, [districts]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const layer = L.layerGroup().addTo(map);
    MAP_DISTRICTS.forEach((id) => {
      const d = districts.find((x) => x.id === id);
      if (!d) return;
      const temp = temps[id];
      const marker = L.circleMarker([d.latitude, d.longitude], {
        radius: 10, color: '#2676E8', weight: 2, fillColor: '#22C5E8', fillOpacity: 0.85,
      }).addTo(layer);
      marker.bindPopup(
        `<b>${d.nameBn}</b><br>${temp !== undefined ? `বর্তমান তাপমাত্রা: ${Math.round(temp)}°C` : 'তাপমাত্রা লোড হচ্ছে…'}<br><span style="color:#2676E8">বিস্তারিত দেখতে ক্লিক করুন</span>`
      );
      marker.on('click', () => { setDistrictId(d.id); navigate(`/jela/${d.id}`); });
      marker.bindTooltip(`${d.nameBn}${temp !== undefined ? ` · ${Math.round(temp)}°C` : ''}`, { direction: 'top', offset: [0, -10] });
    });
    return () => { layer.remove(); };
  }, [temps, districts, navigate, setDistrictId]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink dark:text-white">বাংলাদেশের আবহাওয়া মানচিত্র</h1>
        <p className="mt-1 text-sm text-muted dark:text-slate-300">প্রধান ১২ জেলার বর্তমান তাপমাত্রা চিহ্নসহ মানচিত্র। চিহ্নে ক্লিক করলে জেলার বিস্তারিত পাতা খুলবে।</p>
      </div>
      <div className="overflow-hidden rounded-[2rem] shadow-md ring-1 ring-slate-200 dark:ring-slate-700">
        <div ref={containerRef} className="h-[480px] w-full sm:h-[560px]" role="application" aria-label="বাংলাদেশের মানচিত্র" />
      </div>
      <div className="flex flex-wrap items-center gap-4 rounded-3xl bg-white p-4 text-sm shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700">
        <span className="flex items-center gap-2"><span className="inline-block h-4 w-4 rounded-full border-2 border-primary bg-cyan-sky" /> জেলা চিহ্ন</span>
        <span className="flex items-center gap-2 text-muted dark:text-slate-300"><MapPin size={16} className="text-primary" /> {loading ? 'তাপমাত্রা লোড হচ্ছে…' : `${toBn(Object.keys(temps).length)}টি জেলার তাপমাত্রা দেখানো হচ্ছে`}</span>
      </div>
      <p className="flex items-start gap-2 rounded-2xl bg-sky-50 p-4 text-sm text-sky-800 dark:bg-sky-950 dark:text-sky-200">
        <Info size={18} className="mt-0.5 shrink-0" /> এটি জেলা চিহ্নসহ মানচিত্র; লাইভ রাডার চিত্র নয়। মানচিত্রের তথ্য: OpenStreetMap। তাপমাত্রা: Open-Meteo।
      </p>
    </div>
  );
}
