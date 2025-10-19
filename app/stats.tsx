import { Redis } from "@upstash/redis";
import {
  BabyIcon,
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudSnow,
  CloudSun,
  Cloudy,
  EarthIcon,
  Moon,
  MusicIcon,
  PopcornIcon,
  Sun,
} from "lucide-react";
import Link from "next/link";
import tzLookup from "tz-lookup";
import { getFirstDiaryEntry } from "@/lib/letterboxd";
import { getWeather } from "@/lib/openweather";

const openWeatherToLucideIcons = {
  "01d": Sun,
  "01n": Moon,
  "02d": CloudSun,
  "02n": CloudMoon,
  "03d": Cloud,
  "03n": Cloud,
  "04d": Cloudy,
  "04n": Cloudy,
  "09d": CloudDrizzle,
  "09n": CloudDrizzle,
  "10d": CloudRain,
  "10n": CloudRain,
  "11d": CloudLightning,
  "11n": CloudLightning,
  "13d": CloudSnow,
  "13n": CloudSnow,
  "50d": CloudFog,
  "50n": CloudFog,
};

const getLucideIcon = (
  openWeatherIconCode: keyof typeof openWeatherToLucideIcons
) => {
  return openWeatherToLucideIcons[openWeatherIconCode] || Cloud; // Default to a generic cloud icon
};

const WeatherIcon = ({
  iconCode,
}: {
  iconCode: keyof typeof openWeatherToLucideIcons;
}) => {
  const IconComponent = getLucideIcon(iconCode);
  return <IconComponent className="size-4 inline-block" />;
};

const redisUrl = process.env.UPSTASH_REDIS_KV_REST_API_URL;
const redisToken = process.env.UPSTASH_REDIS_KV_REST_API_TOKEN;

const redis = new Redis({
  url: redisUrl,
  token: redisToken,
});

const fallbackLocation = {
  lat: 45.5017,
  lon: -73.5673,
  city: "Montréal",
  state: "QC",
  region: "Canada",
  updatedAt: new Date().toISOString(),
};

export async function Stats() {
  const [diaryEntry, _currentLocation] = await Promise.all([
    getFirstDiaryEntry(),
    redis.get("current_location") as Promise<{
      lat: number;
      lon: number;
      city: string;
      state: string;
      region: string;
      updatedAt: string;
    } | null>,
  ]);

  const currentLocation = _currentLocation ?? fallbackLocation;
  const timeZone = tzLookup(currentLocation.lat, currentLocation.lon);

  const weatherData = await getWeather(
    currentLocation.lat,
    currentLocation.lon
  );

  const locationTime = new Intl.DateTimeFormat("en-CA", {
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
    timeZone,
  }).format(new Date());

  return (
    <div className="grid grid-cols-[auto_1fr] gap-2 text-sm items-center mt-10">
      {/* <BabyIcon className="size-4 inline-block" />{" "} */}
      <span className="relative flex size-3 m-0.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75"></span>
        <span className="relative inline-flex size-3 rounded-full bg-yellow-500"></span>
      </span>
      <span>On parental leave</span>
      <EarthIcon className="size-4 inline-block" />{" "}
      <span>
        Now in {currentLocation.city}, {currentLocation.state}
      </span>
      <WeatherIcon
        iconCode={
          weatherData.current.weather[0]
            .icon as keyof typeof openWeatherToLucideIcons
        }
      />
      <span>
        {Math.round(weatherData.current.temp)}°C • {locationTime}
      </span>
      {/* <MusicIcon className="size-4 inline-block" /> <span>Music</span> */}
      <PopcornIcon className="size-4 inline-block" />{" "}
      <span>
        <Link
          className="hover:underline no-underline text-inherit font-normal"
          href={diaryEntry.link}
        >
          {diaryEntry.title}
        </Link>{" "}
        • {diaryEntry.rating}
      </span>
    </div>
  );
}
