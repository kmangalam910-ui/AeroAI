import type { OpenMeteoWeatherRes, Geocoding } from "@/types";
import defaultDataRaw from "../data.txt?raw";

export type WeatherData = {
  data: OpenMeteoWeatherRes;
  location: Geocoding;
};

export interface WmoWeatherInfo {
  code: number;
  label: string;
  description: string;
  category: "clear" | "cloudy" | "rain" | "snow" | "thunderstorm" | "fog";
  severity: "normal" | "advisory" | "warning" | "severe";
  alertText?: string;
  iconName: string;
}

/**
 * Parses and returns the default weather data pre-fetched in src/data.txt
 */
export const getDefaultWeatherData = (): WeatherData => {
  try {
    const parsed = JSON.parse(defaultDataRaw);
    return {
      data: parsed.data,
      location: parsed.location,
    };
  } catch (error) {
    console.error("Failed to parse data.txt:", error);
    // Fallback static structure if parsing fails
    return {
      data: {
        latitude: 22.390158,
        longitude: 82.546585,
        timezone: "Asia/Kolkata",
        timezone_abbreviation: "GMT+5:30",
        utc_offset_seconds: 19800,
        elevation: 315,
        current_units: {
          time: "iso8601",
          interval: "seconds",
          temperature_2m: "°C",
          relative_humidity_2m: "%",
          apparent_temperature: "°C",
          precipitation: "mm",
          weather_code: "wmo code",
          wind_speed_10m: "km/h",
        },
        current: {
          time: new Date().toISOString(),
          interval: 900,
          temperature_2m: 28.5,
          relative_humidity_2m: 80,
          apparent_temperature: 32.4,
          precipitation: 0.1,
          weather_code: 95,
          wind_speed_10m: 18.4,
        },
        minutely_15_units: {},
        minutely_15: { time: [], temperature_2m: [], precipitation: [], weather_code: [] },
        hourly_units: {},
        hourly: {
          time: [],
          temperature_2m: [],
          relative_humidity_2m: [],
          precipitation_probability: [],
          weather_code: [],
          uv_index: [],
          wind_speed_10m: [],
          cloud_cover: [],
          surface_pressure: [],
          visibility: [],
          apparent_temperature: [],
        },
        daily_units: {},
        daily: {
          time: [],
          temperature_2m_max: [],
          temperature_2m_min: [],
          sunrise: [],
          sunset: [],
          precipitation_sum: [],
          uv_index_max: [],
        },
      },
      location: {
        name: "Katghora Tahsil",
        lat: 22.3942454,
        lon: 82.5892146,
        country: "IN",
        state: "Chhattisgarh",
      },
    };
  }
};

/**
 * Returns WMO weather details given a weather code
 */
export const getWmoWeatherInfo = (code: number): WmoWeatherInfo => {
  switch (code) {
    case 0:
      return {
        code,
        label: "Clear Sky",
        description: "Clear sunny skies with excellent visibility.",
        category: "clear",
        severity: "normal",
        iconName: "Sun",
      };
    case 1:
      return {
        code,
        label: "Mainly Clear",
        description: "Mostly clear with minor scattered clouds.",
        category: "clear",
        severity: "normal",
        iconName: "SunDim",
      };
    case 2:
      return {
        code,
        label: "Partly Cloudy",
        description: "Partially cloudy conditions with periods of sunshine.",
        category: "cloudy",
        severity: "normal",
        iconName: "CloudSun",
      };
    case 3:
      return {
        code,
        label: "Overcast",
        description: "Dense cloud cover spanning the sky.",
        category: "cloudy",
        severity: "normal",
        iconName: "Cloud",
      };
    case 45:
      return {
        code,
        label: "Foggy",
        description: "Foggy conditions reducing driving visibility.",
        category: "fog",
        severity: "advisory",
        alertText: "Drive cautiously due to reduced fog visibility.",
        iconName: "CloudFog",
      };
    case 48:
      return {
        code,
        label: "Rime Fog",
        description: "Depositing rime fog causing slippery surfaces.",
        category: "fog",
        severity: "warning",
        alertText: "Freezing fog advisory! Watch out for slippery roads.",
        iconName: "CloudFog",
      };
    case 51:
    case 53:
    case 55:
      return {
        code,
        label: "Drizzle",
        description: "Light misting rain showers.",
        category: "rain",
        severity: "normal",
        iconName: "CloudDrizzle",
      };
    case 61:
      return {
        code,
        label: "Slight Rain",
        description: "Light rain shower. Carrying an umbrella is recommended.",
        category: "rain",
        severity: "normal",
        iconName: "CloudRain",
      };
    case 63:
      return {
        code,
        label: "Moderate Rain",
        description: "Steady rainfall occurring across the area.",
        category: "rain",
        severity: "advisory",
        iconName: "CloudRain",
      };
    case 65:
      return {
        code,
        label: "Heavy Rain",
        description: "Heavy rain downpour. Possible localized waterlogging.",
        category: "rain",
        severity: "warning",
        alertText: "Heavy Rain Warning! Expect wet conditions & possible travel delays.",
        iconName: "CloudRainWind",
      };
    case 80:
    case 81:
      return {
        code,
        label: "Rain Showers",
        description: "Intermittent rain showers expected.",
        category: "rain",
        severity: "normal",
        iconName: "CloudRain",
      };
    case 82:
      return {
        code,
        label: "Violent Rain Showers",
        description: "Torrential rain showers with high intensity.",
        category: "rain",
        severity: "warning",
        alertText: "Violent Rain Advisory! Take shelter.",
        iconName: "CloudRainWind",
      };
    case 95:
      return {
        code,
        label: "Thunderstorm",
        description: "Active thunderstorm with potential lightning & gusty winds.",
        category: "thunderstorm",
        severity: "severe",
        alertText: "Thunderstorm Warning! Stay indoors and seek lightning safety shelter.",
        iconName: "CloudLightning",
      };
    case 96:
    case 99:
      return {
        code,
        label: "Severe Thunderstorm & Hail",
        description: "Severe thunderstorm accompanied by heavy rain and hail.",
        category: "thunderstorm",
        severity: "severe",
        alertText: "Severe Thunderstorm & Hail Alert! Protect vehicles and remain indoors.",
        iconName: "CloudLightning",
      };
    default:
      return {
        code,
        label: "Moderate Weather",
        description: "Standard atmospheric weather conditions.",
        category: "cloudy",
        severity: "normal",
        iconName: "CloudSun",
      };
  }
};

/**
 * Returns UV Index Risk Category & Advice
 */
export const getUvIndexInfo = (uv: number) => {
  if (uv < 3) {
    return {
      level: "Low",
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      advice: "Minimal sun protection needed. Safe for outdoor activities.",
    };
  } else if (uv < 6) {
    return {
      level: "Moderate",
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
      advice: "Wear sunglasses and use SPF 30+ sunscreen if outdoors.",
    };
  } else if (uv < 8) {
    return {
      level: "High",
      color: "text-orange-500 bg-orange-500/10 border-orange-500/20",
      advice: "Protection required! Wear hat, sunglasses, and SPF 30+ sunscreen.",
    };
  } else if (uv < 11) {
    return {
      level: "Very High",
      color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
      advice: "Extra protection needed. Avoid sun exposure between 10am - 4pm.",
    };
  } else {
    return {
      level: "Extreme",
      color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
      advice: "Extreme UV danger! Take all precautions and remain in shade.",
    };
  }
};

/**
 * Calculates outdoor activity suitability scores (0 to 100)
 */
export const getOutdoorActivityScores = (
  temp: number,
  humidity: number,
  windSpeed: number,
  precip: number,
  weatherCode: number,
  cloudCover: number = 50
) => {
  // Base penalty for thunderstorm or severe weather
  const isThunderstorm = weatherCode >= 90;
  const isHeavyRain = precip > 2.0 || weatherCode === 65 || weatherCode === 82;
  const isRain = precip > 0.1 || (weatherCode >= 50 && weatherCode <= 85);

  // 1. Running & Jogging Score
  let runningScore = 95;
  if (temp > 32 || temp < 5) runningScore -= 25;
  if (humidity > 75) runningScore -= 15;
  if (windSpeed > 25) runningScore -= 20;
  if (isRain) runningScore -= 35;
  if (isThunderstorm) runningScore = 15;
  runningScore = Math.max(10, Math.min(100, runningScore));

  // 2. Cycling / Biking Score
  let cyclingScore = 90;
  if (windSpeed > 20) cyclingScore -= 30;
  if (isRain) cyclingScore -= 40;
  if (isThunderstorm) cyclingScore = 10;
  if (temp > 35) cyclingScore -= 20;
  cyclingScore = Math.max(10, Math.min(100, cyclingScore));

  // 3. Driving / Road Safety Score
  let drivingScore = 98;
  if (isHeavyRain) drivingScore -= 30;
  if (isThunderstorm) drivingScore -= 40;
  if (weatherCode === 45 || weatherCode === 48) drivingScore -= 45; // Fog
  drivingScore = Math.max(20, Math.min(100, drivingScore));

  // 4. Stargazing / Night Sky Score
  let stargazingScore = 100 - cloudCover;
  if (isRain || isThunderstorm) stargazingScore = 5;
  stargazingScore = Math.max(5, Math.min(100, stargazingScore));

  return {
    running: Math.round(runningScore),
    cycling: Math.round(cyclingScore),
    driving: Math.round(drivingScore),
    stargazing: Math.round(stargazingScore),
  };
};

/**
 * Calculates daylight duration & daylight percentage progress
 */
export const getDaylightDetails = (sunriseStr?: string, sunsetStr?: string) => {
  if (!sunriseStr || !sunsetStr) {
    return { duration: "12h 00m", progress: 50, sunriseTime: "06:00", sunsetTime: "18:00" };
  }

  const sunriseDate = new Date(sunriseStr);
  const sunsetDate = new Date(sunsetStr);
  const now = new Date();

  const totalDiffMs = sunsetDate.getTime() - sunriseDate.getTime();
  const hours = Math.floor(totalDiffMs / (1000 * 60 * 60));
  const minutes = Math.floor((totalDiffMs % (1000 * 60 * 60)) / (1000 * 60));

  let progress = 0;
  if (now >= sunriseDate && now <= sunsetDate) {
    progress = Math.round(((now.getTime() - sunriseDate.getTime()) / totalDiffMs) * 100);
  } else if (now > sunsetDate) {
    progress = 100;
  }

  const sunriseTime = sunriseDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const sunsetTime = sunsetDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return {
    duration: `${hours}h ${minutes}m`,
    progress: Math.max(0, Math.min(100, progress)),
    sunriseTime,
    sunsetTime,
  };
};
