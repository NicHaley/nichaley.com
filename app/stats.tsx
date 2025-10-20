import { Redis } from "@upstash/redis";
import {
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
  PopcornIcon,
  Sun,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import tzLookup from "tz-lookup";
import { Skeleton } from "@/components/ui/skeleton";
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
  return <IconComponent className="size-4 inline-block align-middle" />;
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
  return (
    <div className="grid grid-cols-[auto_1fr] gap-2 text-sm items-center">
      {/* <BabyIcon className="size-4 inline-block" />{" "} */}
      <span className="relative flex size-3 m-0.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75"></span>
        <span className="relative inline-flex size-3 rounded-full bg-yellow-500"></span>
      </span>
      <span>On parental leave</span>
      <Suspense fallback={<LocationFallback />}>
        {/* Location icon + text */}
        <LocationRow />
      </Suspense>
      <Suspense fallback={<WeatherFallback />}>
        {/* Weather icon + text */}
        <WeatherRow />
      </Suspense>
      <Suspense fallback={<FilmFallback />}>
        {/* Film icon + text */}
        <FilmRow />
      </Suspense>
    </div>
  );
}

async function getCurrentLocation() {
  const _currentLocation = (await redis.get("current_location")) as {
    lat: number;
    lon: number;
    city: string;
    state: string;
    region: string;
    updatedAt: string;
  } | null;
  return _currentLocation ?? fallbackLocation;
}

async function LocationRow() {
  const currentLocation = await getCurrentLocation();
  return (
    <>
      <EarthIcon className="size-4 inline-block align-middle" />{" "}
      <span className="leading-5 align-middle">
        Now in {currentLocation.city}, {currentLocation.state}
      </span>
    </>
  );
}

function LocationFallback() {
  return (
    <>
      <EarthIcon className="size-4 inline-block align-middle" />{" "}
      <Skeleton className="w-40 h-5" />
    </>
  );
}

async function WeatherRow() {
  const currentLocation = await getCurrentLocation();
  const weatherData = await getWeather(
    currentLocation.lat,
    currentLocation.lon
  );

  const description = weatherData.current.weather[0].description;

  return (
    <>
      <WeatherIcon
        iconCode={
          weatherData.current.weather[0]
            .icon as keyof typeof openWeatherToLucideIcons
        }
      />
      <span className="leading-5 align-middle">
        {Math.round(weatherData.current.temp)}°C •{" "}
        <span className="capitalize">{description}</span>
      </span>
    </>
  );
}

function WeatherFallback() {
  return (
    <>
      <Cloud className="size-4 inline-block align-middle" />
      <Skeleton className="w-24 h-5" />
    </>
  );
}

async function FilmRow() {
  const diaryEntry = await getFirstDiaryEntry();
  return (
    <>
      <PopcornIcon className="size-4 inline-block align-middle" />{" "}
      <span className="leading-5 align-middle">
        <Link
          className="hover:underline no-underline text-inherit font-normal"
          href={diaryEntry.link}
        >
          {diaryEntry.title}
        </Link>{" "}
        • {diaryEntry.rating}
      </span>
    </>
  );
}

function FilmFallback() {
  return (
    <>
      <PopcornIcon className="size-4 inline-block align-middle" />{" "}
      <Skeleton className="w-48 h-5" />
    </>
  );
}
