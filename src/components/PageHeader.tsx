import { APP } from "@/config";
import { getUserLocation } from "@/lib/utils";
import { useWeather } from "@/hooks/useWeather";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LocateIcon, Loader2Icon, MapPin, Globe, Mountain } from "lucide-react";
import { useState } from "react";

const PageHeader = () => {
  const { weather, setWeather } = useWeather();
  const [isLocating, setIsLocating] = useState(false);

  if (!weather) return <Skeleton className="w-60 h-8 mt-2 mb-6" />;

  const location = weather.location ?? {
    name: "Katghora Tahsil",
    country: "IN",
    state: "Chhattisgarh",
    lat: 22.3942454,
    lon: 82.5892146262517
  };

  const lat = weather.data.latitude ?? location.lat;
  const lon = weather.data.longitude ?? location.lon;
  const elevation = weather.data.elevation;
  const timezone = weather.data.timezone;

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-2 border-b border-border/40">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
          <MapPin className="size-6" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-2xl tracking-tight text-foreground">
              {location.name ? location.name : "Location Overview"}
            </h1>
            <Button
              variant="outline"
              size="icon-sm"
              disabled={isLocating}
              aria-label="Get current location"
              title="Use current geolocation"
              className="rounded-full size-7"
              onClick={async () => {
                setIsLocating(true);
                getUserLocation()
                  .then(({ lat, lon }) => {
                    setWeather({ lat, lon });
                    localStorage.setItem(APP.STORE_KEY.LAT, lat.toString());
                    localStorage.setItem(APP.STORE_KEY.LON, lon.toString());
                  })
                  .catch((error) => {
                    alert(error);
                  })
                  .finally(() => {
                    setIsLocating(false);
                  });
              }}
            >
              {isLocating ? (
                <Loader2Icon className="size-3.5 animate-spin text-primary" />
              ) : (
                <LocateIcon className="size-3.5 text-muted-foreground hover:text-primary" />
              )}
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted-foreground font-medium">
            <span>
              {location.state ? location.state + ", " : ""}
              {location.country}
            </span>
            {lat !== undefined && lon !== undefined && (
              <>
                <span className="text-border">•</span>
                <span className="font-mono text-[11px] bg-secondary px-1.5 py-0.5 rounded">
                  {lat.toFixed(2)}°N, {lon.toFixed(2)}°E
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-center text-xs">
        {elevation !== undefined && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/60 border border-border/40 font-medium">
            <Mountain size={14} className="text-amber-500" />
            <span>Elev: <strong>{elevation}m</strong></span>
          </div>
        )}

        {timezone && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/60 border border-border/40 font-medium">
            <Globe size={14} className="text-sky-500" />
            <span>TZ: <strong>{timezone}</strong></span>
          </div>
        )}
      </div>
    </header>
  );
};

export default PageHeader;
