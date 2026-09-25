import { SearchDialog, ThemeDropdown, UnitDropdown } from "./index";

const TopAppBar = () => {

  return (
    <header className="py-4 border shadow-lg rounded-2xl">
      <div className="px-4 flex items-center justify-between bg-background/50 backdrop-blur-lg">
        <img
          src="/Logo.png"
          alt="logo"
          className="h-16 w-24 rounded-2xl"
        />
        <SearchDialog />

        <div className="flex gap-4">
          <ThemeDropdown />
          <UnitDropdown />
        </div>
      </div>
    </header>
  );
};

export default TopAppBar;
