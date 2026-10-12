using System.Net;
using System.Text.Json;
using Microsoft.Extensions.Options;
using WeatherApi.Models;
using WeatherApi.Options;

namespace WeatherApi.Services;

public interface IOpenWeatherService
{
    Task<IReadOnlyList<DailyForecastDto>> GetFiveDayForecastAsync(
        double lat,
        double lon,
        string lang,
        CancellationToken cancellationToken = default);
}

public sealed class OpenWeatherService(
    HttpClient httpClient,
    IOptions<OpenWeatherOptions> options,
    ILogger<OpenWeatherService> logger) : IOpenWeatherService
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
    };

    public async Task<IReadOnlyList<DailyForecastDto>> GetFiveDayForecastAsync(
        double lat,
        double lon,
        string lang,
        CancellationToken cancellationToken = default)
    {
        var settings = options.Value;
        if (string.IsNullOrWhiteSpace(settings.ApiKey)
            || settings.ApiKey is "your_api_key_here" or "REPLACE_ME")
        {
            throw new InvalidOperationException(
                "OpenWeather API key is not configured. Set OpenWeather:ApiKey via user-secrets or environment.");
        }

        var baseUrl = settings.BaseUrl.TrimEnd('/');
        var url =
            $"{baseUrl}/data/2.5/forecast?lat={lat.ToString(System.Globalization.CultureInfo.InvariantCulture)}"
            + $"&lon={lon.ToString(System.Globalization.CultureInfo.InvariantCulture)}"
            + $"&units=metric&lang={Uri.EscapeDataString(lang)}&appid={Uri.EscapeDataString(settings.ApiKey)}";

        using var response = await httpClient.GetAsync(url, cancellationToken);

        if (response.StatusCode == HttpStatusCode.Unauthorized)
        {
            throw new OpenWeatherUpstreamException(
                HttpStatusCode.Unauthorized,
                "OpenWeatherMap rejected the API key (HTTP 401).");
        }

        if (!response.IsSuccessStatusCode)
        {
            logger.LogWarning(
                "OpenWeatherMap forecast failed with {StatusCode}",
                (int)response.StatusCode);
            throw new OpenWeatherUpstreamException(
                response.StatusCode,
                $"OpenWeatherMap request failed (HTTP {(int)response.StatusCode}).");
        }

        await using var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
        var payload = await JsonSerializer.DeserializeAsync<OpenWeatherForecastResponse>(
            stream,
            JsonOptions,
            cancellationToken);

        if (payload?.List is null || payload.List.Count == 0)
        {
            return [];
        }

        return ForecastAggregator.Aggregate(payload.List);
    }
}

public sealed class OpenWeatherUpstreamException(HttpStatusCode statusCode, string message)
    : Exception(message)
{
    public HttpStatusCode StatusCode { get; } = statusCode;
}
