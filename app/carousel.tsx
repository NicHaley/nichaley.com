"use client";

import {
  ArrowUpRightIcon,
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudSnow,
  CloudSun,
  Cloudy,
  Moon,
  PauseIcon,
  PlayIcon,
  Sun,
} from "lucide-react";
import mapboxgl from "mapbox-gl";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Calendar, { type Activity } from "react-activity-calendar";
import { createRoot } from "react-dom/client";
import {
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  Carousel as UICarousel,
} from "@/components/ui/carousel";
import type { Response } from "@/lib/github";
import type { OneCallResponse } from "@/lib/openweather";
import { cn } from "@/lib/utils";

import "mapbox-gl/dist/mapbox-gl.css";
import type { RecentPlayedTrack } from "@/lib/apple-music";

type Slide = {
  id: string;
  text: React.ReactNode;
  tag: string;
  children: React.ReactNode;
  url?: string;
};

interface CarouselProps {
  fullAddress: string;
  bbox: [number, number, number, number];
  weatherData?: OneCallResponse;
  recentPlayedTrack?: RecentPlayedTrack;
  diaryEntry?: {
    title: string;
    link: string;
    rating: string;
    image: string;
  };
  contributions?: Response;
}

function AvatarPin() {
  return (
    <div className="overflow-hidden border-4 border-white shadow-lg size-20 rounded-full relative">
      <Image src="/me.jpeg" alt="Location" fill className="object-cover" />
    </div>
  );
}

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
  openWeatherIconCode: keyof typeof openWeatherToLucideIcons,
) => {
  return openWeatherToLucideIcons[openWeatherIconCode] || Cloud;
};

const WeatherIcon = ({
  iconCode,
}: {
  iconCode: keyof typeof openWeatherToLucideIcons;
}) => {
  const IconComponent = getLucideIcon(iconCode);
  return <IconComponent className="size-5 inline-block align-middle" />;
};

function MapPane({
  bbox,
  isRaining,
  isSnowing,
}: {
  bbox: [number, number, number, number];
  isRaining: boolean;
  isSnowing: boolean;
}) {
  const { resolvedTheme } = useTheme();
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const markerElementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoibmljaGFsZXkiLCJhIjoiY2xzbmRrMTVyMDMwaDJqb2d4Z2NlOXVjYyJ9.QeENRU4-2oC2PnN8VlCHlA";
    const map = new mapboxgl.Map({
      container: containerRef.current as HTMLElement,
      style:
        resolvedTheme === "dark"
          ? "mapbox://styles/mapbox/dark-v11"
          : "mapbox://styles/mapbox/light-v11",
      bounds: bbox,
      interactive: false,
    });

    mapRef.current = map;

    map.on("load", () => {
      if (isRaining) {
        (
          map as unknown as {
            setRain?: (options: Record<string, unknown>) => void;
          }
        ).setRain?.({
          density: 1,
          intensity: 1,
          color: "#B8B8B8",
          opacity: resolvedTheme === "dark" ? 0.2 : 0.8,
          "center-thinning": 0,
          direction: [0, 50],
          "droplet-size": [1, 10],
          "distortion-strength": 0.5,
          vignette: 0.5,
          "vignette-color": "#6e6e6e",
        });
      }

      if (isSnowing) {
        (
          map as unknown as {
            setSnow?: (options: Record<string, unknown>) => void;
          }
        ).setSnow?.({
          density: 1,
          intensity: 1,
          color: "#FFFFFF",
          opacity: 1,
          "center-thinning": 0.4,
          direction: [0, 50],
          "flake-size": 0.71,
          vignette: 0.3,
          vignetteColor: "#FFFFFF",
        });
      }
    });

    const el = document.createElement("div");
    markerElementRef.current = el;
    const root = createRoot(el);
    root.render(<AvatarPin />);

    // Center of bbox: [minLon, minLat, maxLon, maxLat]
    const [minLon, minLat, maxLon, maxLat] = bbox;
    const centerLongitude = (minLon + maxLon) / 2;
    const centerLatitude = (minLat + maxLat) / 2;

    markerRef.current = new mapboxgl.Marker({
      element: el,
      anchor: "bottom",
      offset: [0, 48],
    })
      .setLngLat([centerLongitude, centerLatitude])
      .addTo(map);

    return () => {
      markerRef.current?.remove();
      markerRef.current = null;
      try {
        root.unmount();
      } catch {}
      markerElementRef.current = null;
      map.remove();
    };
  }, [isRaining, isSnowing, bbox, resolvedTheme]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 h-full w-full rounded-t-xl"
      style={{
        contain: "layout paint",
        WebkitMaskImage:
          "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 25%, rgba(0,0,0,1) 50%, rgba(0,0,0,1) 100%)",
        maskImage:
          "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 25%, rgba(0,0,0,1) 50%, rgba(0,0,0,1) 100%)",
      }}
    />
  );
}

export default function Carousel({
  fullAddress,
  bbox,
  weatherData,
  recentPlayedTrack,
  diaryEntry,
  contributions,
}: CarouselProps) {
  const isRaining = useMemo(() => {
    if (!weatherData) return false;
    const description = weatherData.current.weather?.[0]?.description ?? "";
    const rainMmPerHr = weatherData.current.rain?.["1h"] ?? 0;
    return rainMmPerHr > 0 || /rain|drizzle/i.test(description);
  }, [weatherData]);
  const isSnowing = useMemo(() => {
    if (!weatherData) return false;
    const description = weatherData.current.weather?.[0]?.description ?? "";
    const icon = weatherData.current.weather?.[0]?.icon ?? "";
    const snowMmPerHr = weatherData.current.snow?.["1h"] ?? 0;
    return (
      snowMmPerHr > 0 || /snow/i.test(description) || /^13[dn]$/.test(icon)
    );
  }, [weatherData]);
  const [api, setApi] = useState<CarouselApi | undefined>(undefined);
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const slides: Slide[] = useMemo(() => {
    const result: Slide[] = [
      {
        id: "map",
        text: (
          <div className="flex items-center gap-1">
            <span className="truncate">{fullAddress}</span>
            <span> • </span>
            <div className="flex items-center gap-1 flex-shrink-0">
              <WeatherIcon
                iconCode={
                  weatherData?.current.weather[0]
                    .icon as keyof typeof openWeatherToLucideIcons
                }
              />
              <span>{Math.round(weatherData?.current.temp ?? 0)}°C</span>
            </div>
          </div>
        ),
        tag: "Now in",
        children: (
          <MapPane bbox={bbox} isRaining={isRaining} isSnowing={isSnowing} />
        ),
      },
      ...(recentPlayedTrack
        ? [
            {
              id: "music",
              text: (
                <div className="flex items-center gap-1">
                  <span className="truncate">
                    {recentPlayedTrack.attributes.name}
                  </span>
                  <span className="!no-underline">•</span>
                  <span className="flex-shrink-0">
                    {recentPlayedTrack.attributes.artistName}
                  </span>
                </div>
              ),
              tag: "Listening to",
              url: recentPlayedTrack.attributes.url,
              children: (
                <Image
                  src={recentPlayedTrack.attributes.artwork.url
                    .replace("{w}", "500")
                    .replace("{h}", "500")}
                  alt={recentPlayedTrack.attributes.name}
                  className="rounded mt-6 drop-shadow-xl"
                  width={220}
                  height={220}
                />
              ),
            },
          ]
        : []),
      ...(diaryEntry
        ? [
            {
              id: "diary",
              text: (
                <div className="flex items-center gap-1">
                  <span className="truncate">{diaryEntry.title}</span>
                  <span>•</span>
                  <span className="flex-shrink-0">{diaryEntry.rating}</span>
                </div>
              ),
              tag: "Last watched",
              url: diaryEntry.link,
              children: (
                <Image
                  src={diaryEntry.image}
                  alt={diaryEntry.title}
                  className="rounded mt-6 drop-shadow-xl"
                  width={180}
                  height={180}
                />
              ),
            },
          ]
        : []),
      {
        id: "contributions",
        text: `${contributions?.total.lastYear} in the last year`,
        tag: "Contributions",
        url: "https://github.com/nichaley",
        children: (
          <div
            className="overflow-hidden flex justify-end pr-4 relative"
            style={{ direction: "rtl" }}
          >
            <Calendar
              data={contributions?.contributions as Activity[]}
              maxLevel={4}
              theme={{
                light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
                dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
              }}
              hideTotalCount
            />
          </div>
        ),
      },
    ];

    return result;
  }, [
    isRaining,
    isSnowing,
    recentPlayedTrack,
    diaryEntry,
    bbox,
    fullAddress,
    weatherData,
    contributions,
  ]);
  useEffect(() => {
    if (!api || !isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          const nextIndex = (current + 1) % slides.length;
          api.scrollTo(nextIndex);
          return 0;
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [api, current, slides.length, isPlaying]);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
      setProgress(0);
    };
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const onPillClick = useCallback(
    (index: number) => {
      api?.scrollTo(index);
      setProgress(0);
    },
    [api],
  );

  return (
    <section className="pb-6">
      <div className="relative mt-2 lg:mt-6">
        <UICarousel
          opts={{ loop: true, align: "center" }}
          setApi={setApi}
          className="w-full"
        >
          <CarouselContent>
            {slides.map((slide) => {
              const containerClass =
                "flex justify-center items-center group relative size-full cursor-pointer overflow-hidden rounded-lg bg-linear-to-t from-stone-200 to-stone-100  dark:from-stone-900 dark:to-stone-800";

              const overlay = (
                <div
                  className={cn("absolute inset-0 z-10 p-4", {
                    "pointer-events-none": !slide.url,
                  })}
                >
                  <div className="flex">
                    <span className="mb-1 inline-flex rounded-md bg-gray-800 dark:bg-gray-200 px-2 py-0.5 text-xs font-medium text-white dark:text-gray-800">
                      {slide.tag}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div
                      className={cn(
                        "text-lg font-medium text-gray-800 dark:text-gray-200 overflow-hidden",
                        {
                          "group-hover:underline": slide.url,
                        },
                      )}
                    >
                      {slide.text}
                    </div>
                    {slide.url && <ArrowUpRightIcon className="size-5" />}
                  </div>
                </div>
              );

              return (
                <CarouselItem
                  key={slide.id}
                  className="w-full rounded-lg pl-4 h-[460px] group"
                >
                  {slide.url ? (
                    <Link
                      href={slide.url}
                      className={containerClass}
                      target="_blank"
                    >
                      {overlay}
                      {slide.children}
                    </Link>
                  ) : (
                    <div className={containerClass}>
                      {overlay}
                      {slide.children}
                    </div>
                  )}
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </UICarousel>

        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          <div className="rounded-full bg-white/80 py-2 px-4 shadow-lg backdrop-blur-md gap-3 flex items-center justify-center">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                onClick={() => {
                  onPillClick(i);
                }}
                className={cn(
                  "relative h-2 rounded-full bg-gray-400 transition-all cursor-pointer",
                  current === i ? "w-12" : "w-2",
                )}
                type="button"
              >
                {current === i ? (
                  <div className="absolute inset-0 overflow-hidden rounded-full">
                    <div
                      className="h-full w-full rounded-full bg-gray-900"
                      style={{
                        width: `${progress}%`,
                        transition: "width 50ms linear",
                      }}
                    />
                  </div>
                ) : null}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="rounded-full bg-white/80 p-2 shadow-lg backdrop-blur-md cursor-pointer"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <PauseIcon className="size-4" fill="currentColor" />
            ) : (
              <PlayIcon className="size-4" fill="currentColor" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
