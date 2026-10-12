namespace WeatherApi.Options;

public sealed class OpenWeatherOptions
{
    public const string SectionName = "OpenWeather";

    public string ApiKey { get; set; } = string.Empty;

    public string BaseUrl { get; set; } = "https://api.openweathermap.org";
}
