namespace WeatherApi.Models;

/// <summary>
/// Aggregated daily forecast row matching the FE <c>DailyForecast</c> shape.
/// </summary>
public sealed class DailyForecastDto
{
    public long DateUnix { get; init; }

    public double TempMin { get; init; }

    public double TempMax { get; init; }

    public string Description { get; init; } = string.Empty;

    public string Icon { get; init; } = "01d";
}
