/*<=============== Hooks ===============> */
import { useTheme } from "@/components/ThemeProvider";

/*<=============== Components ===============> */
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

/*<=============== Assets ===============> */
import { MoonIcon, SunIcon } from "lucide-react";

const ThemeDropdown = () => {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="secondary" size="icon" />}>
        <SunIcon className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:-rotate-180 dark:scale-0" />
        <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-180 transition-all dark:-rotate-0 dark:scale-100" />

        <span className="sr-only">Toggle Theme</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-muted-foreground">
            Theme Settings
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeDropdown;
