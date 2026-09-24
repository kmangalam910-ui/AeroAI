import { useWeather } from "@/hooks/useWeather";
import { getWmoWeatherInfo } from "@/lib/weatherUtils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Clock, ShieldCheck, Zap } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const MinutelyNowcast = () => {
  const { weather } = useWeather();

  if (!weather || !weather.data.minutely_15 || !weather.data.minutely_15.time?.length) {
    return null;
  }

  const minutely = weather.data.minutely_15;
  const times = minutely.time.slice(0, 12); // Next 3 hours (12 x 15-min)
  const precips = minutely.precipitation;
  const temps = minutely.temperature_2m;
  const codes = minutely.weather_code;

  const chartData = times.map((t, idx) => ({
    time: new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    precipitation: Number(precips[idx] ?? 0),
    temperature: Number(temps[idx] ?? 0),
    label: getWmoWeatherInfo(codes[idx] ?? 0).label,
  }));

  const totalPrecipNext2Hours = precips.slice(0, 8).reduce((acc, curr) => acc + (curr || 0), 0);

  return (
    <Card className="my-6 rounded-xl border border-border/60 shadow-sm bg-gradient-to-r from-card via-card to-secondary/20">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-2">
        <div>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Clock className="size-5 text-sky-500 animate-spin-slow" />
            15-Minute Rain Nowcast (Next 3 Hours)
          </CardTitle>
          <CardDescription className="text-xs">
            High-precision 15-minute minute-by-minute atmospheric & precipitation trend
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          {totalPrecipNext2Hours > 0 ? (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 flex items-center gap-1.5">
              <Zap size={14} className="text-amber-500" />
              Rain Expected ({totalPrecipNext2Hours.toFixed(1)} mm total)
            </span>
          ) : (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <ShieldCheck size={14} />
              No Rain Expected Next 2 Hours
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-2">
        {/* Visual 15-Min Bar Chart */}
        <div className="h-36 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
              <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}mm`} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-popover text-popover-foreground border border-border p-2 rounded-lg text-xs shadow-md">
                        <p className="font-bold">{data.time}</p>
                        <p className="text-sky-500 font-semibold">{data.precipitation.toFixed(2)} mm rain</p>
                        <p className="text-muted-foreground">{data.temperature}°C • {data.label}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="precipitation" fill="var(--color-value, #3b82f6)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 15-Min Interval Horizontal Scroll Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {times.map((t, idx) => {
            const precip = precips[idx] ?? 0;
            const temp = Math.round(temps[idx] ?? 0);
            const timeFormatted = new Date(t).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={t}
                className="flex-shrink-0 flex flex-col items-center justify-between p-2.5 min-w-[76px] rounded-xl bg-secondary/50 border border-border/40 text-xs text-center"
              >
                <span className="font-bold text-[11px] text-muted-foreground">{timeFormatted}</span>
                <span className="font-extrabold text-sm my-1">{temp}°</span>

                {precip > 0 ? (
                  <span className="text-[10px] font-bold text-sky-500 bg-sky-500/10 px-1.5 py-0.5 rounded border border-sky-500/20">
                    {precip.toFixed(1)}mm
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-muted-foreground">Dry</span>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default MinutelyNowcast;
