import { Cloud, CloudDrizzle, CloudFog, CloudHail, CloudLightning, CloudRain, CloudRainWind, CloudSnow, CloudSun, Sun } from 'lucide-react';
import { weatherInfo } from '../utils/weatherCodes';

const MAP = { Sun, CloudSun, Cloud, CloudFog, CloudDrizzle, CloudRain, CloudRainWind, CloudSnow, CloudLightning, CloudHail };
export default function WeatherIcon({ code, size = 40, className = '' }) {
  const info = weatherInfo(code);
  const Icon = MAP[info.icon] || Cloud;
  return <Icon size={size} className={className} aria-label={info.label} />;
}
export function iconForName(name, size = 40, className = '') {
  const Icon = MAP[name] || Cloud;
  return <Icon size={size} className={className} />;
}
