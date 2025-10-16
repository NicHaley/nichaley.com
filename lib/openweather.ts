import axios from "axios";

export const openWeather = axios.create({
  baseURL: "https://api.openweathermap.org/data/3.0/onecall",
  params: {
    appid: process.env.OPEN_WEATHER_API_KEY,
  },
});

export function getWeather(lat: number, lon: number) {
  return openWeather.get<OneCallResponse>("", {
    params: {
      lat,
      lon,
      units: "metric",
    },
  });
}

export type OneCallResponse = {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: CurrentWeather;
  minutely: Minutely[];
  hourly: Hourly[];
  daily: Daily[];
  alerts: Alert[];
};

export type CurrentWeather = {
  dt: number;
  sunrise: number;
  sunset: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust?: number;
  rain?: rain1hr;
  snow?: snow1hr;
  weather: Weather[];
};

export type rain1hr = {
  "1h": number; // rain volume in mm
};

export type snow1hr = {
  "1h": number; // snow volume in mm
};

export type Weather = {
  id: number;
  main: string;
  description: string;
  icon: string;
};

export type Minutely = {
  dt: number;
  precipitation: number;
};

export type Hourly = {
  dt: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust?: number;
  rain?: rain1hr;
  snow?: snow1hr;
  weather: Weather[];
  pop: number;
};

export type Daily = {
  dt: number;
  sunrise: number;
  sunset: number;
  moonrise: number;
  moonset: number;
  moon_phase: number;
  summary: string;
  temp: DayTemp;
  feels_like: DayFeelsLike;
  pressure: number;
  humidity: number;
  dew_point: number;
  wind_speed: number;
  wind_deg: number;
  wind_gust?: number;
  weather: Weather[];
  clouds: number;
  pop: number;
  rain?: number; // rain volume in mm
  snow?: number; // snow volume in mm
  uvi: number;
};

export type DayTemp = {
  day: number;
  min: number;
  max: number;
  night: number;
  eve: number;
  morn: number;
};

export type DayFeelsLike = {
  day: number;
  night: number;
  eve: number;
  morn: number;
};

export type Alert = {
  sender_name: string;
  event: string;
  start: number;
  end: number;
  description: string;
  tags: string[];
};
