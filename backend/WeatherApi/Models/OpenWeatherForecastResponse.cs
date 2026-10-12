using System.Text.Json.Serialization;

namespace WeatherApi.Models;

public sealed class OpenWeatherForecastResponse
{
    [JsonPropertyName("list")]
    public List<OpenWeatherForecastItem> List { get; set; } = [];
}

public sealed class OpenWeatherForecastItem
{
    [JsonPropertyName("dt")]
    public long Dt { get; set; }

    [JsonPropertyName("main")]
    public OpenWeatherMain Main { get; set; } = new();

    [JsonPropertyName("weather")]
    public List<OpenWeatherCondition> Weather { get; set; } = [];
}

public sealed class OpenWeatherMain
{
    [JsonPropertyName("temp")]
    public double Temp { get; set; }

    [JsonPropertyName("temp_min")]
    public double TempMin { get; set; }

    [JsonPropertyName("temp_max")]
    public double TempMax { get; set; }
}

public sealed class OpenWeatherCondition
{
    [JsonPropertyName("description")]
    public string Description { get; set; } = string.Empty;

    [JsonPropertyName("icon")]
    public string Icon { get; set; } = "01d";
}
