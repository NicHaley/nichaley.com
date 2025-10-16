import {
  BabyIcon,
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudIcon,
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

export async function Stats() {
  const weather = await getWeather(45.5017, -73.5673);
  const localTime = new Intl.DateTimeFormat("en-CA", {
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
    timeZone: weather.data.timezone,
  }).format(new Date());

  return (
    <div className="grid grid-cols-[auto_1fr] gap-2 text-sm items-center">
      <BabyIcon className="size-4 inline-block" />{" "}
      <span>On parental leave</span>
      <EarthIcon className="size-4 inline-block" /> <span>Montreal, QC</span>
      <WeatherIcon
        iconCode={
          weather.data.current.weather[0]
            .icon as keyof typeof openWeatherToLucideIcons
        }
      />
      <span>
        {Math.round(weather.data.current.temp)}°C • {localTime}
      </span>
      <MusicIcon className="size-4 inline-block" /> <span>Music</span>
      <PopcornIcon className="size-4 inline-block" /> <span>Popcorn</span>
    </div>
  );
}
