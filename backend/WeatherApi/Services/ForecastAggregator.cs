using WeatherApi.Models;

namespace WeatherApi.Services;

/// <summary>
/// Aggregates OpenWeatherMap 3-hour slots into up to five daily rows
/// (same rules as the FE <c>aggregateDailyForecast</c> util).
/// </summary>
public static class ForecastAggregator
{
    public static IReadOnlyList<DailyForecastDto> Aggregate(IEnumerable<OpenWeatherForecastItem> items)
    {
        var byDay = new SortedDictionary<string, List<OpenWeatherForecastItem>>(StringComparer.Ordinal);

        foreach (var item in items)
        {
            var d = DateTimeOffset.FromUnixTimeSeconds(item.Dt).LocalDateTime;
            var key = $"{d.Year:D4}-{d.Month:D2}-{d.Day:D2}";

            if (!byDay.TryGetValue(key, out var bucket))
            {
                bucket = [];
                byDay[key] = bucket;
            }

            bucket.Add(item);
        }

        return byDay
            .Take(5)
            .Select(pair =>
            {
                var slots = pair.Value;
                var tempsMin = slots.Select(s => s.Main.TempMin);
                var tempsMax = slots.Select(s => s.Main.TempMax);

                var representative =
                    slots.FirstOrDefault(slot =>
                    {
                        var hour = DateTimeOffset.FromUnixTimeSeconds(slot.Dt).LocalDateTime.Hour;
                        return hour is >= 11 and <= 14;
                    })
                    ?? slots[slots.Count / 2];

                var condition = representative.Weather.FirstOrDefault();

                return new DailyForecastDto
                {
                    DateUnix = slots[0].Dt,
                    TempMin = tempsMin.Min(),
                    TempMax = tempsMax.Max(),
                    Description = condition?.Description ?? "n/a",
                    Icon = condition?.Icon ?? "01d",
                };
            })
            .ToList();
    }
}
