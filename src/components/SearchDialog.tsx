/*<=============== Hooks ===============> */
import { useEffect, useCallback, useState } from "react";
import { useWeather } from "@/hooks/useWeather";

/*<=============== Components ===============> */
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Item,
  ItemTitle,
  ItemDescription,
  ItemContent,
  ItemActions,
} from "@/components/ui/item";

/*<=============== Assets & Types ===============> */
import { MapPinnedIcon, SearchIcon } from "lucide-react";
import type { Geocoding } from "@/types";
import { openWeatherApi } from "@/api";
import { APP, WEATHER_API } from "@/config";

const SearchDialog = () => {
  // Hooks
  const { setWeather } = useWeather();

  // States
  const [search, setSearch] = useState<string>("");
  const [result, setResult] = useState<Geocoding[]>([]);
  const [searchDialogOpen, setSearchDialogOpen] = useState<boolean>(false);

  // Search Request
  const geocoding = useCallback(
    async (search: string): Promise<Geocoding[]> => {
      try {
        if (!search) return [];
        const response = await openWeatherApi.get("/geo/1.0/direct", {
          params: {
            q: search,
            limit: WEATHER_API.DEFAULTS.SEARCH_RESULT_LIMIT,
          },
        });

        return response.data as Geocoding[];
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }
        return [];
      }
    },
    [],
  );

  // Search functionality
  useEffect(() => {
    if (!search) return;

    const timer = setTimeout(() => {
      (async () => {
        const results = await geocoding(search);

        if (results) setResult(results);
      })();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, geocoding]);

  // Keyboard shortcut to open search dialog <Ctrl-K>
  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setSearchDialogOpen(true);
      }
    };
    document.addEventListener("keydown", shortcut);
    return () => document.removeEventListener("keydown", shortcut);
  }, []);

  return (
    <div>
      <Dialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen}>
        <DialogTrigger
          render={
            <Button
              variant="ghost"
              className="me-auto max-sm:size-9 border-gray-300 dark:border-gray-800 dark:lg:bg-secondary/50 border rounded-lg"
            />
          }
        >
          <SearchIcon className="lg:text-muted-foreground" />

          <div className="flex justify-between w-82.5 max-md:hidden  ">
            Search weather....
            <KbdGroup>
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </KbdGroup>
          </div>
        </DialogTrigger>

        <DialogContent className="p-0 bg-card gap-0" showCloseButton={false}>
          <DialogHeader className="sr-only">
            <DialogTitle>Search weather</DialogTitle>

            <DialogDescription>
              Search weather by city or country
            </DialogDescription>
          </DialogHeader>

          <InputGroup className="ring-0! border-t-0! border-x-0! border-b border-border! rounded-b-none bg-transparent! ">
            <InputGroupInput
              placeholder="Search weather....."
              value={search}
              onInput={(e) => setSearch(e.currentTarget.value)}
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>

          <InputGroup className="min-h-80 p-2 flex flex-col me-auto rounded-t-none text-center overflow-y-auto scrollbar-none">
            {!result.length && (
              <p className="mx-auto text-center text-sm text-destructive py-4">
                No results found!
              </p>
            )}

            {result.map(({ name, state, lat, lon, country }) => (
              <Item 
                key={name + lat + lon} 
                size="sm" 
                className="relative p-2"
                onClick={() => {
                      setWeather({ lat, lon });
                      setSearchDialogOpen(false)
                      localStorage.setItem(APP.STORE_KEY.LAT, lat.toString());
                      localStorage.setItem(APP.STORE_KEY.LON, lon.toString());
                    }}
              >
                <ItemContent>
                  <ItemTitle>{name}</ItemTitle>
                  <ItemDescription>
                    {state ? state + ", " : ""}
                    {country}
                  </ItemDescription>
                </ItemContent>

                <ItemActions>
                  <DialogClose
                    render={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="after:absolute after:inset-0 cursor-pointer"
                        onClick={() => {}}
                      />
                    }
                  >
                    <MapPinnedIcon />
                  </DialogClose>
                </ItemActions>
              </Item>
            ))}
          </InputGroup>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SearchDialog;
