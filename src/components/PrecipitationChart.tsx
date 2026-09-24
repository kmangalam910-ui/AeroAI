import { useMemo } from "react";
import { useWeather } from "@/hooks/useWeather";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  prep: {
    label: "Precipitation",
    color: "var(--chart-1)",
  },
  humidity: {
    label: "Humidity",
    color: "var(--muted-foreground)",
  },
} satisfies ChartConfig;

const PrecipitationChart = () => {
  const { weather } = useWeather();

  const chartData = useMemo(() => {
    const hourly = weather?.data?.hourly;

    if (!hourly) return [];

    return hourly.time.slice(0, 24).map((time, index) => ({
      temp: Number(hourly.precipitation_probability[index] ?? 0),
      time: new Date(time).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      humidity: Number(hourly.relative_humidity_2m[index] ?? 0),
    }));
  }, [weather]);

  if (!weather || !chartData.length) return <Skeleton className="h-90 rounded-xl" />;

  return (
    <ChartContainer config={chartConfig} className="h-90 w-full overflow-hidden">
      <AreaChart accessibilityLayer data={chartData} margin={{ left: 4, right: 16, top: 12, bottom: 8 }}>
        <CartesianGrid strokeDasharray="4" />

        <XAxis
          dataKey="time"
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
          minTickGap={35}
          tickMargin={16}
        />

        <YAxis
          dataKey="temp"
          tickLine={false}
          axisLine={false}
          tickCount={5}
          tickMargin={16}
          tickFormatter={(value) => `${value}°`}
        />

        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

        <defs>
          <linearGradient id="fillTemp" x1="0" y1="0" x2="0" y2="1">
            <stop 
              offset="0%" 
              stopColor="var(--temp-high)" 
              stopOpacity={1} 
            />
            <stop 
              offset="50%" 
              stopColor="var(--temp-mid)" 
              stopOpacity={0.5} 
            />
            <stop 
              offset="100%" 
              stopColor="var(--temp-low)" 
              stopOpacity={0} 
            />
          </linearGradient>
        </defs>

        <Area
          dataKey="temp"
          fill="url(#fillTemp)"
          fillOpacity={0.5}
          stroke="var(--aero-accent)"
        />

        <Area
          dataKey="humidity"
          fillOpacity={0}
          stroke="var(--aero-surface)"
          strokeWidth={2}
          strokeOpacity={0}
        />

        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    </ChartContainer>
  );
};

export default PrecipitationChart;
