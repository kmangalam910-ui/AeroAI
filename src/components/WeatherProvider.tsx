/*<=============== Node Modules ===============> */
import axios from "axios";
import { isAxiosError } from "axios";
import { createContext } from "react";

/*<=============== Custom Modules ===============> */
import { APP, WEATHER_API } from "@/config";
import { openWeatherApi } from "@/api";
import { getDefaultWeatherData } from "@/lib/weatherUtils";

/*<=============== Hooks ===============> */
import { useState, useEffect, useCallback, useMemo } from "react";

/*<=============== Types ===============> */
import type {
  Geocoding,
  OpenMeteoWeatherRes,
} from "@/types";

export type WeatherUnitType = "metric" | "imperial";

type Weather = {
  data: OpenMeteoWeatherRes;
  location: Geocoding;
};

type WeatherStateParam = {
  lat?: number;
  lon?: number;
  unit?: "metric" | "imperial";
};

type WeatherProviderState = {
  weather: Weather | null;
  setWeather: (params?: WeatherStateParam) => Promise<void>;
};

const defaultData = getDefaultWeatherData();

const initialState: WeatherProviderState = {
  weather: defaultData,
  setWeather: async () => {},
};

export const WeatherProviderContext = createContext<WeatherProviderState>(initialState);

const WeatherProvider = ({ children }: React.PropsWithChildren) => {
  const defaultWeatherSettings = useMemo(() => {
    if (typeof window === "undefined") {
      return {
        lat: WEATHER_API.DEFAULTS.LAT,
        lon: WEATHER_API.DEFAULTS.LON,
        unit: WEATHER_API.DEFAULTS.UNIT,
      };
    }

    const storedLat = Number(window.localStorage.getItem(APP.STORE_KEY.LAT));
    const storedLon = Number(window.localStorage.getItem(APP.STORE_KEY.LON));
    const storedUnit = (
      window.localStorage.getItem(APP.STORE_KEY.UNIT) as WeatherUnitType | null
    ) || WEATHER_API.DEFAULTS.UNIT;

    return {
      lat: Number.isFinite(storedLat) ? storedLat : WEATHER_API.DEFAULTS.LAT,
      lon: Number.isFinite(storedLon) ? storedLon : WEATHER_API.DEFAULTS.LON,
      unit: storedUnit === "metric" || storedUnit === "imperial" ? storedUnit : WEATHER_API.DEFAULTS.UNIT,
    };
  }, []);

  const defaultLat = defaultWeatherSettings.lat;
  const defaultLon = defaultWeatherSettings.lon;
  const defaultUnit = defaultWeatherSettings.unit;

  // States initialized with rich default data from data.txt
  const [weather, setWeather] = useState<Weather | null>(defaultData);

  // Callbacks
  const oneCall = useCallback(
    async (lat: number, lon: number, unit: WeatherUnitType) => {
      try {
        const response = await axios.get<OpenMeteoWeatherRes>(
          "https://api.open-meteo.com/v1/forecast",
          {
            params: {
              latitude: lat,
              longitude: lon,
              timezone: "auto",
              current:
                "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m",
              minutely_15: "temperature_2m,precipitation,weather_code",
              hourly:
                "temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,uv_index,wind_speed_10m,cloud_cover,surface_pressure,visibility,apparent_temperature",
              daily:
                "temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,uv_index_max",
              ...(unit === "imperial"
                ? {
                    temperature_unit: "fahrenheit",
                    wind_speed_unit: "mph",
                    precipitation_unit: "inch",
                  }
                : {}),
            },
          },
        );

        return response.data;
      } catch (error) {
        if (isAxiosError(error)) {
          console.error(
            "Weather request failed:",
            error.response?.status,
            error.response?.data ?? error.message,
          );
        } else if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error(error);
        }
      }
    },
    [],
  );

  const reverseGeo = useCallback(
    async (lat: number, lon: number, limit = 1) => {
      try {
        const response = await openWeatherApi.get("/geo/1.0/reverse", {
          params: {
            lat,
            lon,
            limit,
          },
        });

        return response.data;
      } catch (error) {
        if (isAxiosError(error)) {
          console.error(
            "Weather request failed: ",
            error.response?.status,
            error.response?.data ?? error.message,
          );
        } else if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.log(error);
        }
      }
    },
    [],
  );

  const getWeather = useCallback(async ({
    lat = defaultLat,
    lon = defaultLon,
    unit = defaultUnit,
  }: WeatherStateParam = {}) => {
    const oneCallRes = await oneCall(lat, lon, unit);
    const reverseGeoRes = await reverseGeo(lat, lon);

    if (oneCallRes) {
      const locationInfo = reverseGeoRes?.[0] ?? {
        name: defaultData.location.name,
        lat,
        lon,
        country: defaultData.location.country,
        state: defaultData.location.state,
      };

      setWeather({
        data: oneCallRes,
        location: locationInfo,
      });
    }
  }, [defaultLat, defaultLon, defaultUnit, oneCall, reverseGeo]);

  useEffect(() => {
    void getWeather();
  }, [getWeather]);

  return (
    <WeatherProviderContext.Provider value={{ weather, setWeather: getWeather }}>
      {children}
    </WeatherProviderContext.Provider>
  );
};

export default WeatherProvider;
