/*<=============== Node Modules ===============> */
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';

/*<=============== Custom Modules ===============> */
import { MAPBOX } from "@/config";

/*<=============== Hooks ===============> */
import { useEffect, useRef, useMemo, useState } from "react";
import { useTheme } from "./ThemeProvider";
import { useWeather } from "@/hooks/useWeather";

/*<=============== Components ===============> */
import { Marker } from "@/components/index";

/*<=============== Types & Assets ===============> */
import type { LngLatLike, Map as MapType } from "mapbox-gl";

const Map = () => {
  // Hooks
  const { theme } = useTheme();
  const { weather } = useWeather();

  // Memos
  const center = useMemo<LngLatLike>(
    () =>
      weather
        ? [weather.location.lon, weather.location.lat]
        : MAPBOX.DEFAULTS.CENTER,
    [weather],
  );

  // Refs & States
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<MapType | null>(null);

  // Initial Mapbox map
  useEffect(() => {
    if (!mapContainerRef.current || !center) return;

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
    setMap (
      new mapboxgl.Map({
      container: mapContainerRef.current,
      center,
      zoom: MAPBOX.DEFAULTS.ZOOM,
      style: "mapbox://styles/mapbox/standard",
      config: {
        basemap: {
          lightPreset: theme === "light" ? "day" : "night",
        },
      },
    })
  );

    return () => map?.remove()
  }, [center, theme]);

  return (
    <div ref={mapContainerRef} className="min-h-75 max-h-80 bg-card text-card-foreground rounded-xl border overflow-hidden text-sm p-4">
      {map && (
        <Marker map={map} coordinates={center} />
      )}
    </div>
  );
};

export default Map;
