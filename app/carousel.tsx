"use client";

import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";

import "mapbox-gl/dist/mapbox-gl.css";

interface CarouselProps {
  longitude: number;
  latitude: number;
  isRaining?: boolean;
}

export default function Carousel({
  longitude,
  latitude,
  isRaining = false,
}: CarouselProps) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <only run once>
  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoibmljaGFsZXkiLCJhIjoiY2xzbmRrMTVyMDMwaDJqb2d4Z2NlOXVjYyJ9.QeENRU4-2oC2PnN8VlCHlA";
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current as HTMLElement,
      style: "mapbox://styles/mapbox/streets-v9",
      center: [longitude, latitude],
      zoom: 14,
    });

    mapRef.current.on("load", () => {
      if (isRaining) {
        mapRef.current?.setRain({
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

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  return <div className="w-full aspect-video" ref={mapContainerRef} />;
}
