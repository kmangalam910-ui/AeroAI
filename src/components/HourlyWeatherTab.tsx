import { useState, useMemo } from "react";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import HourlyMetricChart, { type HourlyMetric } from "@/components/HourlyMetricChart";
import { useWeather } from "@/hooks/useWeather";
import { Clock, TrendingUp, TrendingDown, Activity } from "lucide-react";

type Tab =
  | "overview"
  | "precipitation"
  | "wind"
  | "humidity"
  | "cloudCover"
  | "pressure"
  | "uv"
  | "visibility"
  | "feelsLike";

const TABS_LIST: {
  title: string;
  value: Tab;
  metric: HourlyMetric;
  unit: string;
  chartType?: "line" | "bar" | "area";
}[] = [
  {
    title: "Overview",
    value: "overview",
    metric: "temperature_2m",
    unit: "°C",
    chartType: "area",
  },
  {
    title: "Precipitation",
    value: "precipitation",
    metric: "precipitation_probability",
    unit: "%",
    chartType: "area",
  },
  {
    title: "Wind",
    value: "wind",
    metric: "wind_speed_10m",
    unit: " km/h",
  },
  {
    title: "Humidity",
    value: "humidity",
    metric: "relative_humidity_2m",
    unit: "%",
    chartType: "area",
  },
  {
    title: "Cloud cover",
    value: "cloudCover",
    metric: "cloud_cover",
    unit: "%",
  },
  {
    title: "Pressure",
    value: "pressure",
    metric: "surface_pressure",
    unit: " hPa",
  },
  {
    title: "UV Index",
    value: "uv",
    metric: "uv_index",
    unit: "",
  },
  {
    title: "Visibility",
    value: "visibility",
    metric: "visibility",
    unit: " m",
  },
  {
    title: "Feels like",
    value: "feelsLike",
    metric: "apparent_temperature",
    unit: "°C",
    chartType: "area",
  },
];

const HourlyWeatherTab = () => {
  const { weather } = useWeather();
  const [tab, setTab] = useState<Tab>("overview");
  const [hoursRange, setHoursRange] = useState<24 | 48>(24);

  const activeTab = TABS_LIST.find((item) => item.value === tab) ?? TABS_LIST[0];

  const stats = useMemo(() => {
    const hourly = weather?.data.hourly;
    if (!hourly || !hourly[activeTab.metric]) return null;

    const values = hourly[activeTab.metric].slice(0, hoursRange).map(Number);
    if (!values.length) return null;

    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;

    return { min, max, avg };
  }, [weather, activeTab.metric, hoursRange]);

  return (
    <div className="py-4 gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Clock className="size-5 text-primary" />
          <h2 className="font-bold text-xl">Hourly Forecast & Trends</h2>
        </div>

        <div className="flex items-center gap-2 bg-secondary/60 p-1 rounded-lg border border-border/40 text-xs font-semibold self-start sm:self-center">
          <button
            onClick={() => setHoursRange(24)}
            className={`px-3 py-1.5 rounded-md transition ${
              hoursRange === 24 ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            24 Hours
          </button>
          <button
            onClick={() => setHoursRange(48)}
            className={`px-3 py-1.5 rounded-md transition ${
              hoursRange === 48 ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            48 Hours
          </button>
        </div>
      </div>

      <Tabs value={tab} onValueChange={(value) => setTab(value as Tab)}>
        <TabsList className="bg-secondary/40 border border-border/40 p-1 gap-1 overflow-x-auto overflow-y-hidden justify-start scrollbar-none rounded-xl mb-4 w-full">
          {TABS_LIST.map(({ title, value }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="border-none h-8 text-xs px-3.5 rounded-lg font-medium text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition"
            >
              {title}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab.value} className="mt-0">
          <Card className="rounded-xl border border-border/60 shadow-sm">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-2">
              <div>
                <CardTitle className="text-lg font-bold">{activeTab.title} Trend ({hoursRange}h)</CardTitle>
                <CardDescription className="text-xs">
                  Detailed hourly progression of {activeTab.title.toLowerCase()} across time
                </CardDescription>
              </div>

              {stats && (
                <div className="flex items-center gap-3 text-xs bg-secondary/50 px-3 py-1.5 rounded-lg border border-border/40 font-medium">
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <TrendingDown size={14} /> Min: <strong>{stats.min.toFixed(1)}{activeTab.unit}</strong>
                  </span>
                  <span className="text-border">|</span>
                  <span className="flex items-center gap-1 text-primary">
                    <Activity size={14} /> Avg: <strong>{stats.avg.toFixed(1)}{activeTab.unit}</strong>
                  </span>
                  <span className="text-border">|</span>
                  <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400">
                    <TrendingUp size={14} /> Max: <strong>{stats.max.toFixed(1)}{activeTab.unit}</strong>
                  </span>
                </div>
              )}
            </CardHeader>

            <CardContent className="pt-2">
              <HourlyMetricChart
                metric={activeTab.metric}
                label={activeTab.title}
                unit={activeTab.unit}
                chartType={activeTab.chartType}
                hoursRange={hoursRange}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HourlyWeatherTab;
