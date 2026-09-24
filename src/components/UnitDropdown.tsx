/*<=============== Custom Modules ===============> */
import { APP, WEATHER_API } from "@/config";

/*<=============== Hooks ===============> */
import { useEffect, useState } from "react";
import { useWeather } from "@/hooks/useWeather";

/*<=============== Components ===============> */
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu";

/*<=============== Types ===============> */
import type { WeatherUnitType } from "@/components/WeatherProvider";

const UnitDropdown = () => {

  // Hooks
  const { setWeather } = useWeather();

  // States
  const [unit, setUint] = useState<WeatherUnitType>((localStorage.getItem(APP.STORE_KEY.UNIT) as WeatherUnitType) || WEATHER_API.DEFAULTS.UNIT);

  useEffect(() => {
    setWeather({ unit });
    localStorage.setItem(APP.STORE_KEY.UNIT, unit)
  }, [unit]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="secondary" size="icon">
        °{unit === "metric" ? "C" : "F"}
      </Button>}>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="end" 
        className="w-50"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-muted-foreground">
            Weather Settings
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        
        <DropdownMenuRadioGroup
          value={unit}
          onValueChange={(value) => setUint(value as WeatherUnitType)}
        >
          <DropdownMenuRadioItem value="metric">
            Metric (°C)
          </DropdownMenuRadioItem>

          <DropdownMenuRadioItem value="imperial">
            Imperial (°F)
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UnitDropdown;
