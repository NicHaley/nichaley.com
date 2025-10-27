"use client";

import { ArrowUpRightIcon } from "lucide-react";
import mapboxgl from "mapbox-gl";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  longitude: number;
  latitude: number;
  city: string;
  state: string;
  isRaining?: boolean;
  recentPlayedTrack?: RecentPlayedTrack;
  diaryEntry?: {
    title: string;
    link: string;
    rating: string;
    image: string;
  };
}

function MapPane({
  center,
  zoom,
  isRaining,
}: {
  center: [number, number];
  zoom: number;
  isRaining: boolean;
}) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoibmljaGFsZXkiLCJhIjoiY2xzbmRrMTVyMDMwaDJqb2d4Z2NlOXVjYyJ9.QeENRU4-2oC2PnN8VlCHlA";
    const map = new mapboxgl.Map({
      container: containerRef.current as HTMLElement,
      style: "mapbox://styles/mapbox/streets-v9",
      center,
      zoom,
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

    new mapboxgl.Marker().setLngLat(center).addTo(map);

    return () => {
      map.remove();
    };
  }, [center, zoom, isRaining]);

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
  city,
  state,
  isRaining = false,
  recentPlayedTrack,
  diaryEntry,
}: CarouselProps) {
  const [api, setApi] = useState<CarouselApi | undefined>(undefined);
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);

  console.log(diaryEntry);

  const slides: Slide[] = useMemo(
    () => [
      {
        id: "map",
        text: `${city}, ${state}`,
        tag: "Now in",
        children: (
          <MapPane
            center={[longitude, latitude]}
            zoom={13}
            isRaining={isRaining}
          />
        ),
      },
      {
        id: "music",
        text:
          recentPlayedTrack?.attributes.name +
          " • " +
          recentPlayedTrack?.attributes.artistName,
        tag: "Listening to",
        children: (
          <Image
            src={recentPlayedTrack?.attributes.artwork.url
              .replace("{w}", "500")
              .replace("{h}", "500")}
            alt={recentPlayedTrack?.attributes.name}
            className="rounded mt-8 drop-shadow-xl"
            width={220}
            height={220}
          />
        ),
      },
      {
        id: "diary",
        text: `${diaryEntry?.title} • ${diaryEntry?.rating}`,
        tag: "Last watched",
        children: (
          <div>
            <Image
              src={diaryEntry?.image}
              alt={diaryEntry?.title}
              className="rounded mt-8 drop-shadow-xl"
              width={180}
              height={180}
            />
          </div>
        ),
      },
    ],
    [isRaining, longitude, latitude, city, state, recentPlayedTrack, diaryEntry]
  );

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
            {slides.map((slide, i) => {
              return (
                <CarouselItem
                  key={slide.id}
                  className="h-[420px] w-full rounded-lg pl-4 md:h-[460px]"
                >
                  <div className="flex justify-center items-center group relative size-full cursor-pointer overflow-hidden rounded-lg bg-linear-to-t from-stone-200 to-stone-100  dark:from-stone-900 dark:to-stone-800">
                    <div className="absolute inset-0 z-10 p-4">
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
                    {slide.children}
                  </div>
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
