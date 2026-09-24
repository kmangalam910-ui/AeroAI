import {
  ThemeProvider,
  TopAppBar,
  WeatherProvider,
  PageHeader,
  WeatherAdvisoryBanner,
  CurrentWeatherCard,
  Map,
  MinutelyNowcast,
  AeroAIInsightsCard,
  DailyForecastCard,
  HourlyWeatherTab,
} from "@/components/index";

const App = () => {
  return (
    <ThemeProvider>
      <WeatherProvider>
        <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
          <main className="py-4 px-4 md:px-8 max-w-7xl mx-auto">
            <TopAppBar />

            <section className="my-6">
              {/* Severe Weather Warning/Advisory Banner */}
              <WeatherAdvisoryBanner />

              {/* Location & Page Header */}
              <PageHeader />

              {/* Current Weather & Map Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 my-6 gap-6">
                <CurrentWeatherCard />
                <Map />
              </div>

              {/* 15-Minute Nowcast & Rain Radar */}
              <MinutelyNowcast />

              {/* AeroAI Health & Activity Insights */}
              <AeroAIInsightsCard />

              {/* 7-Day Forecast & Daily Solar Highlights */}
              <DailyForecastCard />

              {/* Hourly Forecast Charts */}
              <HourlyWeatherTab />
            </section>

            <footer className="mt-12 py-6 border-t border-border/40 text-center text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2">
              <p>© AeroAI Weather Intelligence Platform. Powered by Open-Meteo & OpenWeather.</p>
              <p className="font-mono text-[11px]">Katghora Tahsil • Chhattisgarh Dataset Loaded</p>
            </footer>
          </main>
        </div>
      </WeatherProvider>
    </ThemeProvider>
  );
};

export default App;
