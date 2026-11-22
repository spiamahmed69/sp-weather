// WMO weather code -> Bengali label + Lucide icon name
export const WEATHER_CODES = {
  0: { label: 'পরিষ্কার আকাশ', icon: 'Sun' },
  1: { label: 'প্রায় পরিষ্কার', icon: 'CloudSun' },
  2: { label: 'আংশিক মেঘলা', icon: 'CloudSun' },
  3: { label: 'মেঘলা', icon: 'Cloud' },
  45: { label: 'কুয়াশা', icon: 'CloudFog' },
  48: { label: 'কুয়াশা', icon: 'CloudFog' },
  51: { label: 'হালকা গুঁড়ি বৃষ্টি', icon: 'CloudDrizzle' },
  53: { label: 'গুঁড়ি বৃষ্টি', icon: 'CloudDrizzle' },
  55: { label: 'ঘন গুঁড়ি বৃষ্টি', icon: 'CloudDrizzle' },
  56: { label: 'বরফ-মিশ্র গুঁড়ি বৃষ্টি', icon: 'CloudDrizzle' },
  57: { label: 'বরফ-মিশ্র গুঁড়ি বৃষ্টি', icon: 'CloudDrizzle' },
  61: { label: 'হালকা বৃষ্টি', icon: 'CloudRain' },
  63: { label: 'মাঝারি বৃষ্টি', icon: 'CloudRain' },
  65: { label: 'ভারী বৃষ্টি', icon: 'CloudRainWind' },
  66: { label: 'বরফ-মিশ্র বৃষ্টি', icon: 'CloudRain' },
  67: { label: 'বরফ-মিশ্র বৃষ্টি', icon: 'CloudRain' },
  71: { label: 'হালকা তুষারপাত', icon: 'CloudSnow' },
  73: { label: 'তুষারপাত', icon: 'CloudSnow' },
  75: { label: 'ভারী তুষারপাত', icon: 'CloudSnow' },
  77: { label: 'তুষারপাত', icon: 'CloudSnow' },
  80: { label: 'হালকা ঝড়ো বৃষ্টি', icon: 'CloudRain' },
  81: { label: 'মাঝারি ঝড়ো বৃষ্টি', icon: 'CloudRainWind' },
  82: { label: 'ভারী ঝড়ো বৃষ্টি', icon: 'CloudRainWind' },
  85: { label: 'তুষার ঝড়', icon: 'CloudSnow' },
  86: { label: 'তুষার ঝড়', icon: 'CloudSnow' },
  95: { label: 'বজ্রসহ বৃষ্টি', icon: 'CloudLightning' },
  96: { label: 'শিলাসহ বজ্রঝড়', icon: 'CloudHail' },
  99: { label: 'শিলাসহ বজ্রঝড়', icon: 'CloudHail' },
};
export function weatherInfo(code) {
  return WEATHER_CODES[code] || { label: 'আবহাওয়া তথ্য পাওয়া যায়নি', icon: 'Cloud' };
}
