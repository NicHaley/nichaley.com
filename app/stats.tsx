import {
  BabyIcon,
  CloudIcon,
  EarthIcon,
  MusicIcon,
  PopcornIcon,
} from "lucide-react";
import { getWeather } from "@/lib/openweather";

export function Stats() {
  const weather = getWeather(45.5017, -73.5673);

  console.log(111, weather);

  return (
    <div className="grid grid-cols-[auto_1fr] gap-2 text-sm items-center">
      <BabyIcon className="size-4 inline-block" />{" "}
      <span>On parental leave</span>
      <EarthIcon className="size-4 inline-block" /> <span>Montreal, QC</span>
      <CloudIcon className="size-4 inline-block" /> <span>18C</span>
      <MusicIcon className="size-4 inline-block" /> <span>Music</span>
      <PopcornIcon className="size-4 inline-block" /> <span>Popcorn</span>
    </div>
  );
}
