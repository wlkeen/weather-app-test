# Weather API (.NET 10)

Local BFF that proxies OpenWeatherMap and keeps the API key on the server.
Returns aggregated five-day forecast rows matching the FE `DailyForecast` shape.

## Prerequisites

- .NET 10 SDK
- An [OpenWeatherMap](https://openweathermap.org/) API key

## Configure the API key

Do **not** commit a real key. Prefer user-secrets:

```bash
cd WeatherApi
dotnet user-secrets set "OpenWeather:ApiKey" "your_real_key_here"
```

Alternatively set environment variable `OpenWeather__ApiKey`, or replace `REPLACE_ME` in
`appsettings.Development.json` (local only; keep it out of git).

## Run

```bash
cd WeatherApi
dotnet run
```

Listens on **http://localhost:5080**.

Try:

```text
GET http://localhost:5080/api/weather/forecast?lat=50.08&lon=14.43&lang=cz
```

## Frontend

The Vite app proxies `/api` → `http://localhost:5080`. Start this API first, then
`npm run dev` in the FE project. With `VITE_USE_MOCK_API=true`, MSW mocks `/api/weather/forecast`
and the backend is not required.
