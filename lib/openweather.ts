import axios from "axios";

export const openWeather = axios.create({
  baseURL: "https://api.openweathermap.org/data/3.0/onecall",
  params: {
    appid: process.env.OPEN_WEATHER_API_KEY,
  },
});

export function getWeather(lat: number, lon: number) {
  return openWeather.get("", {
    params: {
      lat,
      lon,
    },
  });
}
