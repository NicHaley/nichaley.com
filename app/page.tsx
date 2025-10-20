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
import Page from "@/components/page";
import { getFirstDiaryEntry } from "@/lib/letterboxd";
import { getWeather } from "@/lib/openweather";

export const dynamic = "force-static";
export const revalidate = 3600; // 1 hour

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
  return openWeatherToLucideIcons[openWeatherIconCode] || Cloud;
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

export default async function Home() {
  const currentLocation = await getCurrentLocation();
  const [weatherData, diaryEntry] = await Promise.all([
    getWeather(currentLocation.lat, currentLocation.lon),
    getFirstDiaryEntry(),
  ]);

  const description = weatherData.current.weather[0].description;

  return (
    <Page title="Nic Haley">
      <p className="mb-10">
        I&apos;m Nic — a product engineer based in Montreal 🥯 As an urbanist, I
        love exploring the roles of technology and cycling in making our cities
        greener and better places to live. Find me on{" "}
        <a href="https://github.com/nichaley">GitHub</a> or{" "}
        <a href="https://www.linkedin.com/in/nicholas-haley-22757389/">
          LinkedIn
        </a>
        , or reach out to me at{" "}
        <a href="mailto:hello@nichaley.com">hello@nichaley.com</a>.
      </p>
      <div className="grid grid-cols-[auto_1fr] gap-2 text-sm items-center">
        {/* <BabyIcon className="size-4 inline-block" />{" "} */}
        <span className="relative flex size-3 m-0.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75"></span>
          <span className="relative inline-flex size-3 rounded-full bg-yellow-500"></span>
        </span>
        <span>On parental leave</span>
        <EarthIcon className="size-4 inline-block align-middle" />{" "}
        <span className="leading-5 align-middle">
          Now in {currentLocation.city}, {currentLocation.state}
        </span>
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
      </div>
    </Page>
  );
}
