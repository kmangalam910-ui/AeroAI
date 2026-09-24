/*<=============== Node Modules ===============> */
import { createPortal } from "react-dom";
import mapboxgl from "mapbox-gl";

/*<=============== Custom Modules ===============> */
import { APP, WEATHER_API } from "@/config";

/*<=============== Hooks ===============> */
import { useEffect, useMemo, useRef } from "react";
import { useWeather } from "@/hooks/useWeather";

/*<=============== Types & Assets ===============> */
import { ThermometerSunIcon } from "lucide-react";
import type { WeatherUnitType } from "./WeatherProvider";
import type { Map, LngLatLike, Marker as MarketType } from "mapbox-gl";

type Props = {
  map: Map;
  coordinates: LngLatLike;
};

const Marker = ({ map, coordinates }: Props) => {
  // Hooks & Refs
  const { weather } = useWeather();
  const markerRef = useRef<MarketType | null>(null);

  // Memos
  const markerElement = useMemo(() => document.createElement("div"), []);
  const weatherUnit =
    (localStorage.getItem(APP.STORE_KEY.UNIT) as WeatherUnitType | null) ||
    WEATHER_API.DEFAULTS.UNIT;

  // Effects
  useEffect(() => {
    markerRef.current = new mapboxgl.Marker({
      element: markerElement,
    })
      .setLngLat(coordinates)
      .addTo(map);
  }, [map, coordinates, markerElement]);

  if (!weather) return;

  return (
    <>
      {createPortal(
        <div className="relative flex items-center gap-2 bg-foreground text-background w-fit rounded-md px-3 py-1.5 text-sm font-semibold text-balance drop-shadow-lg isolate">
          <ThermometerSunIcon size={16} fill="currentColor" />

          <span>{weather.data.current.temperature_2m.toFixed()}{APP.UNIT.TEMP[weatherUnit]}</span>

          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 rotate-45 size-3 rounded-xs bg-foreground -z-10"></div>
        </div>,
        markerElement,
      )}
    </>
  );
};

export default Marker;
