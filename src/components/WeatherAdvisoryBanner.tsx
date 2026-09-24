import { useWeather } from "@/hooks/useWeather";
import { getWmoWeatherInfo } from "@/lib/weatherUtils";
import { ShieldAlert, AlertTriangle, X } from "lucide-react";
import { useState } from "react";

const WeatherAdvisoryBanner = () => {
  const { weather } = useWeather();
  const [dismissed, setDismissed] = useState(false);

  if (!weather || dismissed) return null;

  const currentCode = weather.data.current?.weather_code ?? 0;
  const wmoInfo = getWmoWeatherInfo(currentCode);

  // Show banner for non-normal severity weather
  if (wmoInfo.severity === "normal") return null;

  const isSevere = wmoInfo.severity === "severe" || wmoInfo.severity === "warning";

  return (
    <div
      className={`w-full rounded-xl p-4 mb-6 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all ${
        isSevere
          ? "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300"
          : "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`p-2 rounded-lg shrink-0 ${
            isSevere ? "bg-rose-500/20 text-rose-600 dark:text-rose-400" : "bg-amber-500/20 text-amber-600 dark:text-amber-400"
          }`}
        >
          {isSevere ? <ShieldAlert className="size-5 animate-pulse" /> : <AlertTriangle className="size-5" />}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm uppercase tracking-wide">
              {wmoInfo.severity} Weather Alert: {wmoInfo.label}
            </span>
          </div>

          <p className="text-xs mt-0.5 opacity-90 font-medium">
            {wmoInfo.alertText || wmoInfo.description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center">
        <button
          onClick={() => setDismissed(true)}
          className="p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 text-muted-foreground hover:text-foreground transition"
          aria-label="Dismiss alert"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default WeatherAdvisoryBanner;
