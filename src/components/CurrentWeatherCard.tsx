import { getWmoWeatherInfo } from "@/lib/weatherUtils";
import { useWeather } from "@/hooks/useWeather";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Navigation2Icon,
  Droplet,
  GlassWater,
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudLightning,
  Mountain,
  Compass,
  AlertTriangle,
} from "lucide-react";

const renderWeatherIcon = (iconName: string) => {
  switch (iconName) {
    case "Sun":
      return <Sun className="size-20 text-amber-500 animate-pulse" />;
    case "CloudSun":
      return <CloudSun className="size-20 text-amber-400" />;
    case "Cloud":
      return <Cloud className="size-20 text-blue-400" />;
    case "CloudFog":
      return <CloudFog className="size-20 text-slate-400" />;
    case "CloudDrizzle":
      return <CloudDrizzle className="size-20 text-sky-400" />;
    case "CloudRain":
    case "CloudRainWind":
      return <CloudRain className="size-20 text-blue-500" />;
    case "CloudLightning":
      return <CloudLightning className="size-20 text-yellow-400 animate-bounce" />;
    default:
      return <CloudSun className="size-20 text-amber-400" />;
  }
};

const CurrentWeatherCard = () => {
  const { weather } = useWeather();

  if (!weather) return <Skeleton className="min-h-75 rounded-xl" />;

  const currentData = weather.data.current;
  const currentUnits = weather.data.current_units;
  const elevation = weather.data.elevation;
  const timezoneAbbr = weather.data.timezone_abbreviation || weather.data.timezone;

  const wmoInfo = getWmoWeatherInfo(currentData?.weather_code ?? 0);

  const formattedTime = currentData?.time
    ? new Date(currentData.time).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        weekday: "short",
      })
    : "";

  const currentWeather = {
    dt: formattedTime,
    temp: currentData?.temperature_2m !== undefined ? Math.round(currentData.temperature_2m) : "--",
    feelsLike:
      (currentData?.apparent_temperature !== undefined
        ? Math.round(currentData.apparent_temperature)
        : "--") + (currentUnits?.apparent_temperature || "°C"),
    windSpeed:
      (currentData?.wind_speed_10m !== undefined
        ? currentData.wind_speed_10m.toFixed(1)
        : "--") + " " + (currentUnits?.wind_speed_10m || "km/h"),
    precipitation:
      (currentData?.precipitation !== undefined
        ? currentData.precipitation.toFixed(1)
        : "--") + " " + (currentUnits?.precipitation || "mm"),
    humidity:
      (currentData?.relative_humidity_2m !== undefined
        ? Math.round(currentData.relative_humidity_2m)
        : "--") + (currentUnits?.relative_humidity_2m || "%"),
    label: wmoInfo.label,
    description: wmoInfo.description,
    code: currentData?.weather_code ?? 0,
  };

  return (
    <Card className="@container min-h-75 rounded-xl border border-border/60 shadow-sm relative overflow-hidden bg-gradient-to-br from-card via-card to-secondary/30">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            Current Weather
            {wmoInfo.severity === "severe" && (
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-destructive/15 text-destructive font-medium border border-destructive/20 animate-pulse">
                <AlertTriangle size={12} /> Live Alert
              </span>
            )}
          </CardTitle>
          <CardDescription className="text-xs font-medium text-muted-foreground mt-0.5">
            Updated {currentWeather.dt} • {timezoneAbbr}
          </CardDescription>
        </div>

        {elevation !== undefined && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground bg-secondary/80 px-2.5 py-1 rounded-md border border-border/40">
            <Mountain size={14} className="text-primary" />
            <span>{elevation}m Elev.</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="grow py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-baseline gap-1">
            <span className="text-6xl font-extrabold tracking-tight">
              {currentWeather.temp}
            </span>
            <span className="text-3xl font-semibold text-muted-foreground">
              {currentUnits?.temperature_2m || "°C"}
            </span>
          </div>

          <div className="flex-1 min-w-[140px]">
            <p className="font-bold text-lg leading-tight text-foreground">
              {currentWeather.label}
            </p>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {currentWeather.description}
            </p>

            <div className="text-xs flex items-center gap-1.5 mt-2 font-medium">
              <span className="text-muted-foreground">Feels Like</span>
              <span className="text-foreground font-semibold px-2 py-0.5 rounded bg-secondary">
                {currentWeather.feelsLike}
              </span>
            </div>
          </div>

          <div className="p-3 bg-secondary/50 rounded-2xl border border-border/40 flex items-center justify-center">
            {renderWeatherIcon(wmoInfo.iconName)}
          </div>
        </div>
      </CardContent>

      <CardFooter className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-border/40 text-xs">
        <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/40">
          <Navigation2Icon size={16} className="text-blue-500 shrink-0" />
          <div>
            <p className="text-muted-foreground text-[10px] uppercase font-semibold">Wind Speed</p>
            <p className="font-bold">{currentWeather.windSpeed}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/40">
          <GlassWater size={16} className="text-sky-500 shrink-0" />
          <div>
            <p className="text-muted-foreground text-[10px] uppercase font-semibold">Humidity</p>
            <p className="font-bold">{currentWeather.humidity}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/40">
          <Droplet size={16} className="text-indigo-500 shrink-0" />
          <div>
            <p className="text-muted-foreground text-[10px] uppercase font-semibold">Precipitation</p>
            <p className="font-bold">{currentWeather.precipitation}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/40">
          <Compass size={16} className="text-amber-500 shrink-0" />
          <div>
            <p className="text-muted-foreground text-[10px] uppercase font-semibold">WMO Code</p>
            <p className="font-bold">Code {currentWeather.code}</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CurrentWeatherCard;
