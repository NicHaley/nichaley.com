const OPEN_WEATHER_BASE_URL =
  "https://api.openweathermap.org/data/3.0/onecall" as const;

export async function getWeather(
  lat: number,
  lon: number,
): Promise<OneCallResponse> {
  const apiKey = process.env.OPEN_WEATHER_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPEN_WEATHER_API_KEY environment variable");
  }

  const url = new URL(OPEN_WEATHER_BASE_URL);
  url.searchParams.set("appid", apiKey);
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lon));
  url.searchParams.set("units", "metric");

  const res = await fetch(url.toString(), {
    method: "GET",
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenWeather request failed: ${res.status} ${text}`);
  }

  const data = (await res.json()) as OneCallResponse;
  return data;
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
