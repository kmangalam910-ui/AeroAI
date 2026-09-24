import { useWeather } from "@/hooks/useWeather";
import { getOutdoorActivityScores, getUvIndexInfo } from "@/lib/weatherUtils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Brain,
  Activity,
  Footprints,
  Bike,
  Car,
  Sparkles,
  Sun,
  Gauge,
  Telescope,
} from "lucide-react";

const AeroAIInsightsCard = () => {
  const { weather } = useWeather();

  if (!weather) return <Skeleton className="h-80 w-full rounded-xl" />;

  const current = weather.data.current;
  const hourly = weather.data.hourly;
  const daily = weather.data.daily;

  const temp = current?.temperature_2m ?? 25;
  const humidity = current?.relative_humidity_2m ?? 50;
  const windSpeed = current?.wind_speed_10m ?? 10;
  const precip = current?.precipitation ?? 0;
  const weatherCode = current?.weather_code ?? 0;
  const cloudCover = hourly?.cloud_cover?.[0] ?? 50;
  const uvMax = daily?.uv_index_max?.[0] ?? hourly?.uv_index?.[0] ?? 4;
  const pressure = hourly?.surface_pressure?.[0] ?? 1013;
  const visibility = hourly?.visibility?.[0] ?? 10000;

  const scores = getOutdoorActivityScores(temp, humidity, windSpeed, precip, weatherCode, cloudCover);
  const uvInfo = getUvIndexInfo(uvMax);

  const getActivityColor = (score: number) => {
    if (score >= 80) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/30";
    if (score >= 55) return "text-amber-500 bg-amber-500/10 border-amber-500/30";
    return "text-rose-500 bg-rose-500/10 border-rose-500/30";
  };

  return (
    <Card className="my-6 rounded-xl border border-border/60 shadow-sm overflow-hidden bg-gradient-to-br from-card via-card to-primary/5">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Brain className="size-5 text-primary" />
            AeroAI Health & Activity Insights
          </CardTitle>
          <CardDescription className="text-xs">
            Intelligent outdoor activity scores, sun safety advisories & atmospheric comfort
          </CardDescription>
        </div>

        <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-primary/10 text-primary border border-primary/20">
          <Sparkles size={12} /> Live AI Analysis
        </span>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* 1. Outdoor Activity Scores Grid */}
        <div>
          <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-3 flex items-center gap-1.5">
            <Activity size={14} className="text-primary" /> Outdoor Activity Index
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Running */}
            <div className="p-3 rounded-xl bg-secondary/40 border border-border/40 space-y-2">
              <div className="flex items-center justify-between">
                <Footprints size={18} className="text-emerald-500" />
                <span className={`text-xs font-extrabold px-2 py-0.5 rounded border ${getActivityColor(scores.running)}`}>
                  {scores.running}%
                </span>
              </div>
              <div>
                <p className="font-bold text-xs">Running / Jogging</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {scores.running >= 80 ? "Optimal conditions" : scores.running >= 55 ? "Moderate comfort" : "Not recommended"}
                </p>
              </div>
            </div>

            {/* Cycling */}
            <div className="p-3 rounded-xl bg-secondary/40 border border-border/40 space-y-2">
              <div className="flex items-center justify-between">
                <Bike size={18} className="text-sky-500" />
                <span className={`text-xs font-extrabold px-2 py-0.5 rounded border ${getActivityColor(scores.cycling)}`}>
                  {scores.cycling}%
                </span>
              </div>
              <div>
                <p className="font-bold text-xs">Cycling / Biking</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {scores.cycling >= 80 ? "Great speed & wind" : scores.cycling >= 55 ? "Watch wind gusts" : "High wind / rain risk"}
                </p>
              </div>
            </div>

            {/* Driving */}
            <div className="p-3 rounded-xl bg-secondary/40 border border-border/40 space-y-2">
              <div className="flex items-center justify-between">
                <Car size={18} className="text-indigo-500" />
                <span className={`text-xs font-extrabold px-2 py-0.5 rounded border ${getActivityColor(scores.driving)}`}>
                  {scores.driving}%
                </span>
              </div>
              <div>
                <p className="font-bold text-xs">Driving Safety</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {scores.driving >= 80 ? "Clear roads & sight" : scores.driving >= 55 ? "Drive cautiously" : "Road hazard warning"}
                </p>
              </div>
            </div>

            {/* Stargazing */}
            <div className="p-3 rounded-xl bg-secondary/40 border border-border/40 space-y-2">
              <div className="flex items-center justify-between">
                <Telescope size={18} className="text-purple-500" />
                <span className={`text-xs font-extrabold px-2 py-0.5 rounded border ${getActivityColor(scores.stargazing)}`}>
                  {scores.stargazing}%
                </span>
              </div>
              <div>
                <p className="font-bold text-xs">Stargazing / Night</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {scores.stargazing >= 70 ? "Clear night sky" : "Cloudy / rain cover"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. UV Protection & Environmental Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border/40">
          {/* UV Card */}
          <div className="p-4 rounded-xl bg-secondary/30 border border-border/40 flex items-start gap-3">
            <div className={`p-2.5 rounded-xl border shrink-0 ${uvInfo.color}`}>
              <Sun size={22} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-sm">Sun Exposure & UV Index</p>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${uvInfo.color}`}>
                  {uvInfo.level} ({uvMax.toFixed(1)})
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {uvInfo.advice}
              </p>
            </div>
          </div>

          {/* Pressure & Visibility Card */}
          <div className="p-4 rounded-xl bg-secondary/30 border border-border/40 flex items-start gap-3">
            <div className="p-2.5 rounded-xl border border-primary/20 bg-primary/10 text-primary shrink-0">
              <Gauge size={22} />
            </div>

            <div>
              <p className="font-bold text-sm">Atmospheric Comfort</p>
              <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground mt-1">
                <span>Pressure: <strong className="text-foreground">{pressure} hPa</strong></span>
                <span>Visibility: <strong className="text-foreground">{(visibility / 1000).toFixed(1)} km</strong></span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                {pressure > 1013 ? "High pressure system - generally stable air" : "Low pressure system - possible rain/storm activity"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AeroAIInsightsCard;
