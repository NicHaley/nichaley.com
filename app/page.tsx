import { Redis } from "@upstash/redis";
import Link from "next/link";
import List from "@/components/list";
import Page from "@/components/page";
import { getRecentPlayedTracks } from "@/lib/apple-music";
import { getFirstDiaryEntry } from "@/lib/letterboxd";
import { getWeather } from "@/lib/openweather";
import Carousel from "./carousel";

export const dynamic = "force-static";
export const revalidate = 3600; // 1 hour

const redisUrl = process.env.UPSTASH_REDIS_KV_REST_API_URL;
const redisToken = process.env.UPSTASH_REDIS_KV_REST_API_TOKEN;

const redis = new Redis({
  url: redisUrl,
  token: redisToken,
});

const fallbackLocation = {
  fullAddress: "Montréal, Québec, Canada",
  latitude: 45.5017,
  longitude: -73.5673,
  bbox: [45.49, -73.58, 45.51, -73.55] as [number, number, number, number],
};

async function getCurrentLocation() {
  const _currentLocation = (await redis.get("current_location")) as {
    fullAddress: string;
    latitude: number;
    longitude: number;
    bbox: [number, number, number, number];
  } | null;
  return _currentLocation ?? fallbackLocation;
}

export default async function Home() {
  const currentLocation = await getCurrentLocation();
  const [weatherData, diaryEntry, recentPlayedTracks] = await Promise.all([
    getWeather(currentLocation.latitude, currentLocation.longitude),
    getFirstDiaryEntry(),
    getRecentPlayedTracks(),
  ]);
  const recentPlayedTrack = recentPlayedTracks?.data?.[0];

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
                  longitude={currentLocation.longitude}
                  latitude={currentLocation.latitude}
                  fullAddress={currentLocation.fullAddress}
                  bbox={currentLocation.bbox}
                  weatherData={weatherData}
                  recentPlayedTrack={recentPlayedTrack}
                  diaryEntry={diaryEntry}
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
    </Page>
  );
}
