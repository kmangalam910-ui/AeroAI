import { useWeather } from "@/hooks/useWeather";
import { getUvIndexInfo, getDaylightDetails } from "@/lib/weatherUtils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CalendarDays,
  Sunrise,
  Sunset,
  Sun,
  Droplet,
  ChevronRight,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

const DailyForecastCard = () => {
  const { weather } = useWeather();
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  if (!weather || !weather.data.daily || !weather.data.daily.time?.length) {
    return <Skeleton className="h-96 w-full rounded-xl" />;
  }

  const daily = weather.data.daily;
  const times = daily.time;
  const maxTemps = daily.temperature_2m_max;
  const minTemps = daily.temperature_2m_min;
  const rainSums = daily.precipitation_sum;
  const uvMaxs = daily.uv_index_max;
  const sunrises = daily.sunrise;
  const sunsets = daily.sunset;

  // Calculate overall min/max for temperature scale bars
  const overallMin = Math.min(...minTemps);
  const overallMax = Math.max(...maxTemps);
  const tempRange = overallMax - overallMin || 1;

  const selectedSunrise = sunrises[selectedDayIndex];
  const selectedSunset = sunsets[selectedDayIndex];
  const daylight = getDaylightDetails(selectedSunrise, selectedSunset);

  const selectedDateStr = new Date(times[selectedDayIndex]).toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const selectedUv = getUvIndexInfo(uvMaxs[selectedDayIndex] ?? 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6">
      {/* 7-Day Forecast Main Card */}
      <Card className="lg:col-span-2 rounded-xl border border-border/60 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <CalendarDays className="size-5 text-primary" />
              7-Day Weather Forecast
            </CardTitle>
            <CardDescription className="text-xs">
              Daily temperature ranges, rain predictions & max UV index
            </CardDescription>
          </div>

          <div className="text-xs font-semibold px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground">
            7 Days Total
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {times.map((time, index) => {
            const dateObj = new Date(time);
            const dayName =
              index === 0
                ? "Today"
                : dateObj.toLocaleDateString(undefined, { weekday: "short" });
            const dateFormatted = dateObj.toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            });

            const minTemp = Math.round(minTemps[index]);
            const maxTemp = Math.round(maxTemps[index]);
            const rainSum = rainSums[index] ?? 0;
            const uvMax = uvMaxs[index] ?? 0;

            // Bar calculation
            const leftPercent = ((minTemps[index] - overallMin) / tempRange) * 100;
            const rightPercent = 100 - ((maxTemps[index] - overallMin) / tempRange) * 100;

            const isSelected = selectedDayIndex === index;

            return (
              <div
                key={time}
                onClick={() => setSelectedDayIndex(index)}
                className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-primary/5 border-primary/40 shadow-xs"
                    : "bg-card hover:bg-secondary/40 border-border/40"
                }`}
              >
                <div className="flex items-center gap-3 min-w-[140px]">
                  <div className="w-16">
                    <p className="font-bold text-sm leading-none">{dayName}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{dateFormatted}</p>
                  </div>

                  {rainSum > 0 ? (
                    <div className="flex items-center gap-1 text-xs text-sky-500 font-medium">
                      <Droplet size={14} />
                      <span>{rainSum.toFixed(1)}mm</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-xs text-amber-500 font-medium">
                      <Sun size={14} />
                      <span>Dry</span>
                    </div>
                  )}
                </div>

                {/* Temperature visual range bar */}
                <div className="flex-1 flex items-center gap-3 px-2">
                  <span className="text-xs font-semibold w-8 text-right text-muted-foreground">
                    {minTemp}°
                  </span>

                  <div className="flex-1 h-2 bg-secondary rounded-full relative overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-blue-400 via-amber-400 to-rose-500"
                      style={{
                        left: `${Math.max(0, leftPercent)}%`,
                        right: `${Math.max(0, rightPercent)}%`,
                      }}
                    />
                  </div>

                  <span className="text-xs font-bold w-8 text-foreground">{maxTemp}°</span>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2 text-xs font-medium shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                      uvMax >= 6
                        ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                        : "bg-secondary text-muted-foreground border-border/40"
                    }`}
                  >
                    UV {uvMax.toFixed(1)}
                  </span>
                  <ChevronRight
                    size={16}
                    className={`text-muted-foreground group-hover:text-foreground transition-transform ${
                      isSelected ? "rotate-90 text-primary" : ""
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Selected Day Highlights & Solar Info */}
      <Card className="rounded-xl border border-border/60 shadow-sm flex flex-col justify-between">
        <div>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Sparkles className="size-4 text-amber-500" />
                Day Details
              </CardTitle>
              <span className="text-xs font-semibold text-primary px-2.5 py-0.5 rounded bg-primary/10">
                {selectedDateStr}
              </span>
            </div>
            <CardDescription className="text-xs">
              Solar daylight, precipitation totals and UV exposure
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Sunrise & Sunset arc */}
            <div className="p-4 rounded-xl bg-secondary/50 border border-border/40 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
                  <Sunrise size={18} />
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase">Sunrise</p>
                    <p className="text-sm">{daylight.sunriseTime}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 font-bold text-orange-600 dark:text-orange-400 text-right">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase">Sunset</p>
                    <p className="text-sm">{daylight.sunsetTime}</p>
                  </div>
                  <Sunset size={18} />
                </div>
              </div>

              {/* Solar Progress Bar */}
              <div>
                <div className="h-2 w-full bg-border/40 rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500 rounded-full"
                    style={{ width: `${daylight.progress}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] text-muted-foreground mt-1 font-medium">
                  <span>Daylight Duration</span>
                  <span className="font-bold text-foreground">{daylight.duration}</span>
                </div>
              </div>
            </div>

            {/* Rain & UV cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-secondary/40 border border-border/40">
                <div className="flex items-center gap-1.5 text-sky-500 font-semibold text-xs mb-1">
                  <Droplet size={16} />
                  <span>Rainfall Sum</span>
                </div>
                <p className="text-xl font-extrabold">
                  {rainSums[selectedDayIndex]?.toFixed(1) ?? 0}{" "}
                  <span className="text-xs font-normal text-muted-foreground">mm</span>
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {rainSums[selectedDayIndex] > 5
                    ? "Wet day expected"
                    : rainSums[selectedDayIndex] > 0
                    ? "Light showers"
                    : "No rainfall expected"}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-secondary/40 border border-border/40">
                <div className="flex items-center gap-1.5 text-amber-500 font-semibold text-xs mb-1">
                  <Sun size={16} />
                  <span>Max UV Index</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <p className="text-xl font-extrabold">
                    {uvMaxs[selectedDayIndex]?.toFixed(1) ?? 0}
                  </p>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${selectedUv.color}`}>
                    {selectedUv.level}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 line-clamp-1">
                  {selectedUv.advice}
                </p>
              </div>
            </div>
          </CardContent>
        </div>

        <div className="p-4 border-t border-border/40 bg-secondary/20 text-xs text-muted-foreground flex items-center justify-between rounded-b-xl">
          <span className="flex items-center gap-1">
            <TrendingUp size={14} className="text-primary" />
            Max Temp Range
          </span>
          <span className="font-bold text-foreground">
            {minTemps[selectedDayIndex]}° - {maxTemps[selectedDayIndex]}°
          </span>
        </div>
      </Card>
    </div>
  );
};

export default DailyForecastCard;
