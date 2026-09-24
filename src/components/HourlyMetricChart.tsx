import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { useWeather } from "@/hooks/useWeather";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export type HourlyMetric =
  | "temperature_2m"
  | "precipitation_probability"
  | "wind_speed_10m"
  | "relative_humidity_2m"
  | "cloud_cover"
  | "surface_pressure"
  | "uv_index"
  | "visibility"
  | "apparent_temperature";

type HourlyMetricChartProps = {
  metric: HourlyMetric;
  label: string;
  unit: string;
  chartType?: "line" | "bar" | "area";
  hoursRange?: number;
};

const HourlyMetricChart = ({
  metric,
  label,
  unit,
  chartType = "line",
  hoursRange = 24,
}: HourlyMetricChartProps) => {
  const { weather } = useWeather();

  const chartData = useMemo(() => {
    const hourly = weather?.data.hourly;
    if (!hourly) return [];

    return hourly.time.slice(0, hoursRange).map((time, index) => {
      const d = new Date(time);

      const timeStr = d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const formattedTime =
        hoursRange > 24
          ? `${d.toLocaleDateString(undefined, { weekday: "short" })} ${timeStr}`
          : timeStr;

      return {
        time: formattedTime,
        shortTime: timeStr,
        value: Number(hourly[metric]?.[index] ?? 0),
      };
    });
  }, [metric, weather, hoursRange]);

  if (!weather || !chartData.length) {
    return <Skeleton className="h-80 w-full rounded-xl" />;
  }

  const chartConfig = {
    value: {
      label,
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  const chartProps = {
    accessibilityLayer: true,
    data: chartData,
    margin: { left: 4, right: 16, top: 12, bottom: 8 },
  };

  const renderXAxis = () => (
    <XAxis
      dataKey="time"
      tickLine={false}
      axisLine={false}
      interval="preserveStartEnd"
      minTickGap={40}
      tickMargin={12}
      padding={{ left: 12, right: 12 }}
      tick={{ fontSize: 11 }}
    />
  );

  const renderYAxis = () => (
    <YAxis
      tickLine={false}
      axisLine={false}
      tickCount={5}
      tickMargin={10}
      tick={{ fontSize: 11 }}
      tickFormatter={(value) => `${value}${unit}`}
    />
  );

  return (
    <ChartContainer config={chartConfig} className="h-80 w-full overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        {chartType === "area" ? (
          <AreaChart {...chartProps}>
            <defs>
              <linearGradient id="metricAreaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-value, #3b82f6)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--color-value, #3b82f6)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
            {renderXAxis()}
            {renderYAxis()}
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Area
              dataKey="value"
              type="monotone"
              fill="url(#metricAreaFill)"
              stroke="var(--color-value, #3b82f6)"
              strokeWidth={2.5}
            />
          </AreaChart>
        ) : chartType === "bar" ? (
          <BarChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
            {renderXAxis()}
            {renderYAxis()}
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="value" fill="var(--color-value, #3b82f6)" radius={[4, 4, 0, 0]} />
          </BarChart>
        ) : (
          <LineChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
            {renderXAxis()}
            {renderYAxis()}
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="value"
              type="monotone"
              stroke="var(--color-value, #3b82f6)"
              strokeWidth={2.5}
              dot={false}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default HourlyMetricChart;
