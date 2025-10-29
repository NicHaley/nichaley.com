"use client";

import { ArrowUpRightIcon } from "lucide-react";
import mapboxgl from "mapbox-gl";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  Carousel as UICarousel,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

import "mapbox-gl/dist/mapbox-gl.css";
import type { RecentPlayedTrack } from "@/lib/apple-music";

type Slide = {
  id: string;
  text: string;
  tag: string;
  children: React.ReactNode;
  url?: string;
};

interface CarouselProps {
  fullAddress: string;
  latitude: number;
  longitude: number;
  bbox: [number, number, number, number];
  isRaining?: boolean;
  recentPlayedTrack?: RecentPlayedTrack;
  diaryEntry?: {
    title: string;
    link: string;
    rating: string;
    image: string;
  };
}

function lngLatToWorld(lng: number, lat: number) {
  const sin = Math.sin((lat * Math.PI) / 180);
  return {
    x: (lng + 180) / 360,
    y: 0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI),
  };
}

function getZoomForBounds(
  bbox: [number, number, number, number],
  mapWidth: number,
  mapHeight: number,
  padding = 0
) {
  const nw = lngLatToWorld(bbox[0], bbox[3]);
  const se = lngLatToWorld(bbox[2], bbox[1]);

  const worldWidth = Math.abs(se.x - nw.x);
  const worldHeight = Math.abs(se.y - nw.y);

  const zoomX = Math.log2(mapWidth / (worldWidth * 512 + padding * 2));
  const zoomY = Math.log2(mapHeight / (worldHeight * 512 + padding * 2));

  return Math.min(zoomX, zoomY);
}

function AvatarPin() {
  return (
    <div className="overflow-hidden border-4 border-white shadow-lg size-20 rounded-full relative">
      <Image src="/me.jpeg" alt="Location" fill className="object-cover" />
    </div>
  );
}

function MapPane({
  bbox,
  center,
  isRaining,
}: {
  bbox: [number, number, number, number];
  center: [number, number];
  isRaining: boolean;
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
      style: "mapbox://styles/mapbox/standard",
      center: center,
      config: {
        basemap: {
          lightPreset: resolvedTheme === "dark" ? "night" : "day",
          showPointOfInterestLabels: false,
        },
      },

      // Don't use bounds directly since we want to center the map around the
      // city center (but at the zoom level that would be used when fitting
      // bounds).
      zoom: getZoomForBounds(
        bbox,
        containerRef.current?.clientWidth ?? 500,
        containerRef.current?.clientHeight ?? 500
      ),
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
          color: "#d9d9d9",
          opacity: 0.19,
          "center-thinning": 0,
          direction: [0, 50],
          "droplet-size": [1, 10],
          "distortion-strength": 0.5,
          vignette: 0.5,
          "vignette-color": "#6e6e6e",
        });
      }
    });

    const el = document.createElement("div");
    markerElementRef.current = el;
    const root = createRoot(el);
    root.render(<AvatarPin />);

    markerRef.current = new mapboxgl.Marker({
      element: el,
      anchor: "bottom",
      offset: [0, 48],
    })
      .setLngLat(center)
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
  }, [center, isRaining, bbox, resolvedTheme]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 h-full w-full rounded-t-xl"
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
  longitude,
  latitude,
  fullAddress,
  bbox,
  isRaining = false,
  recentPlayedTrack,
  diaryEntry,
}: CarouselProps) {
  const [api, setApi] = useState<CarouselApi | undefined>(undefined);
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);

  const slides: Slide[] = useMemo(() => {
    const result: Slide[] = [
      {
        id: "map",
        text: fullAddress,
        tag: "Now in",
        children: (
          <MapPane
            bbox={bbox}
            center={[longitude, latitude]}
            isRaining={isRaining}
          />
        ),
      },
    ];

    if (recentPlayedTrack) {
      const artworkUrl = recentPlayedTrack.attributes.artwork.url
        .replace("{w}", "500")
        .replace("{h}", "500");
      result.push({
        id: "music",
        text: `${recentPlayedTrack.attributes.name} • ${recentPlayedTrack.attributes.artistName}`,
        tag: "Listening to",
        url: recentPlayedTrack.attributes.url,
        children: (
          <Image
            src={artworkUrl}
            alt={recentPlayedTrack.attributes.name}
            className="rounded mt-8 drop-shadow-xl"
            width={220}
            height={220}
          />
        ),
      });
    }

    if (diaryEntry) {
      result.push({
        id: "diary",
        text: `${diaryEntry.title} • ${diaryEntry.rating}`,
        tag: "Last watched",
        url: diaryEntry.link,
        children: (
          <div>
            <Image
              src={diaryEntry.image}
              alt={diaryEntry.title}
              className="rounded mt-8 drop-shadow-xl"
              width={180}
              height={180}
            />
          </div>
        ),
      });
    }

    return result;
  }, [
    isRaining,
    longitude,
    latitude,
    recentPlayedTrack,
    diaryEntry,
    bbox,
    fullAddress,
  ]);
  useEffect(() => {
    if (!api) return;

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
  }, [api, current, slides.length]);

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
    [api]
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
                <div className="absolute inset-0 z-10 p-4">
                  <span className="mb-1 inline-flex rounded-md bg-gray-800 dark:bg-gray-200 px-2 py-0.5 text-xs font-medium text-white dark:text-gray-800">
                    {slide.tag}
                  </span>
                  <div className="flex items-center gap-1">
                    <div
                      className={cn(
                        "text-lg font-medium text-gray-800 dark:text-gray-200 md:text-2xl",
                        {
                          "group-hover:underline": slide.url,
                        }
                      )}
                    >
                      {slide.text}
                    </div>
                    {slide.url && <ArrowUpRightIcon className="size-6" />}
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
            {/* <CarouselItem
              key="map"
              className="h-[420px] w-full rounded-lg pl-4 md:h-[460px]"
            >
              <div className="group relative size-full cursor-pointer overflow-hidden rounded-lg bg-gray-100 transition-colors duration-300 hover:bg-gray-200">
                <MemoizedMapPane
                  center={[longitude, latitude]}
                  zoom={13}
                  isRaining={isRaining}
                />
              </div>
            </CarouselItem> */}
            {/* {slides.map((slide, i) => (
              <CarouselItem
                key={slide.id}
                className="h-[420px] w-full rounded-lg pl-4 md:h-[460px]"
                onClick={() => {
                  if (i === current && slide.url) {
                    window.open(slide.url, "_blank");
                  } else {
                    api?.scrollTo(i);
                    setProgress(0);
                  }
                }}
              >
                <div className="group relative h-full w-full cursor-pointer overflow-hidden rounded-lg bg-gray-100 transition-colors duration-300 hover:bg-gray-200">
                  <div
                    className={cn(
                      "p-4 transition-all delay-200 duration-500 ease-in-out md:p-6",
                      i === current
                        ? "translate-x-0 opacity-100"
                        : "-translate-x-[50px] opacity-0"
                    )}
                  >
                    <span className="mb-1 inline-flex rounded-md bg-gray-800 px-2 py-0.5 text-xs font-medium text-white">
                      {slide.tag}
                    </span>
                    <div className="flex items-center gap-1">
                      <div className="text-lg font-medium text-gray-800 md:text-2xl">
                        {slide.text}
                      </div>
                      <ArrowUpRightIcon className="size-6" />
                    </div>
                  </div>
                  <div
                    className={cn(
                      "absolute bottom-0 left-1/2 h-[300px] w-[calc(100%-2rem)] max-w-[900px] -translate-x-1/2 translate-y-4 overflow-hidden rounded-t-xl shadow-xl transition-all delay-200 duration-500 ease-in-out md:h-[340px] md:w-[calc(100%-8rem)]",
                      {
                        "translate-y-1/3 opacity-0": i !== current,
                        "delay-0 group-hover:translate-y-0": i === current,
                      }
                    )}
                  >
                    {slide.children}
                  </div>
                </div>
              </CarouselItem>
            ))} */}
          </CarouselContent>
        </UICarousel>

        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 justify-center gap-3 rounded-full bg-white/80 p-2 shadow-lg backdrop-blur-md">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              onClick={() => onPillClick(i)}
              className={cn(
                "relative h-2 rounded-full bg-gray-400 transition-all",
                current === i ? "w-12" : "w-2"
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
      </div>
    </section>
  );
}
