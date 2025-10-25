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
  MusicIcon,
  PopcornIcon,
  Sun,
} from "lucide-react";
import Link from "next/link";
import List from "@/components/list";
import Page from "@/components/page";
import { getRecentPlayedTracks } from "@/lib/apple-music";
import { getFirstDiaryEntry } from "@/lib/letterboxd";
import { getWeather } from "@/lib/openweather";
import Carousel from "./carousel";

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
  const [weatherData, diaryEntry, recentPlayedTracks] = await Promise.all([
    getWeather(currentLocation.lat, currentLocation.lon),
    getFirstDiaryEntry(),
    getRecentPlayedTracks(),
  ]);
  const recentPlayedTrack = recentPlayedTracks?.data?.[0];
  const description = weatherData.current.weather[0].description;
  const rainMmPerHr = weatherData.current.rain?.["1h"] ?? 0;
  const isRaining = rainMmPerHr > 0 || /rain|drizzle/i.test(description);
  // Normalize 0-1 intensity roughly from mm/hr (cap at 10mm/hr)
  const rainIntensity = Math.min(1, rainMmPerHr / 10);

  return (
    <Page title="Nic Haley">
      <List
        items={[
          {
            title: "Now",
            content: (
              <div className="flex flex-col gap-4">
                <p>
                  I&apos;m Nic — a product engineer based in Montreal 🥯 I enjoy
                  building tools that help connect people and places. Find me on{" "}
                  <Link
                    className="font-medium underline"
                    href="https://github.com/nichaley"
                  >
                    GitHub
                  </Link>{" "}
                  or{" "}
                  <Link
                    className="font-medium underline"
                    href="https://www.linkedin.com/in/nicholas-haley-22757389/"
                  >
                    LinkedIn
                  </Link>
                  , or reach out at{" "}
                  <Link
                    className="font-medium underline"
                    href="mailto:hello@nichaley.com"
                  >
                    hello@nichaley.com
                  </Link>
                  .
                </p>
                <Carousel
                  longitude={currentLocation.lon}
                  latitude={currentLocation.lat}
                  city={currentLocation.city}
                  state={currentLocation.state}
                  isRaining={isRaining}
                  recentPlayedTrack={recentPlayedTrack}
                />
              </div>
            ),
          },
          {
            title: "Work",
            subItems: [
              {
                title: "Upfront",
                text: "Founding Engineer",
                dateString: "2024 - 2025",
              },
              {
                title: "Floe",
                text: "Founder",
                dateString: "2023 - 2024",
              },
              {
                title: "Local Logic",
                text: "Lead Frontend Developer",
                dateString: "2021 - 2023",
              },
              {
                title: "Memberstack",
                text: "Software Engineer",
                dateString: "2020 - 2021",
              },
              {
                title: "Ada",
                text: "Founding Engineer",
                dateString: "2016 - 2020",
              },
              {
                title: "Trip Elephant",
                text: "Developer",
                dateString: "2015 - 2016",
              },
            ],
          },
          {
            title: "Volunteer",
            subItems: [
              {
                title: "Santrovélo",
                text: "Bike Mechanic",
                dateString: "2022 - Now",
              },
              {
                title: "Bike Sauce",
                text: "Bike Mechanic",
                dateString: "2021 - 2022",
              },
              {
                title: "Cycle Toronto",
                text: "Volunteer",
                dateString: "Various",
              },
              {
                title: "TIFF",
                text: "Volunteer",
                dateString: "Various",
              },
            ],
          },
          {
            title: "Education",
            subItems: [
              {
                title: "OCAD",
                text: "Principles of Design",
                dateString: "2015",
              },
              {
                title: "Bitmaker",
                text: "Web Development",
                dateString: "2014",
              },
              {
                title: "Queen's University",
                text: "B.Sc. Geological Engineering",
                dateString: "2009 - 2013",
              },
            ],
          },
        ]}
      />
      {/* <div className="grid grid-cols-[auto_1fr] gap-2 text-sm items-center">
        <span className="relative flex size-3 m-0.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex size-3 rounded-full bg-green-500"></span>
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
        <Link
          className="leading-5 align-middle hover:underline no-underline text-inherit font-normal"
          href={diaryEntry.link}
          target="_blank"
        >
          Last watched {diaryEntry.title} • {diaryEntry.rating}
        </Link>
        {recentPlayedTrack ? (
          <>
            <MusicIcon className="size-4 inline-block align-middle" />
            <Link
              href={recentPlayedTrack.attributes.url}
              className="leading-5 align-middle hover:underline no-underline text-inherit font-normal"
              target="_blank"
            >
              Last played {recentPlayedTrack.attributes.name} •{" "}
              {recentPlayedTrack.attributes.artistName}
            </Link>
          </>
        ) : null}
      </div> */}
    </Page>
  );
}
