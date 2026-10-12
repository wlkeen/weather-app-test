using System.Net;
using WeatherApi.Options;
using WeatherApi.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.Configure<OpenWeatherOptions>(
    builder.Configuration.GetSection(OpenWeatherOptions.SectionName));

builder.Services.AddHttpClient<IOpenWeatherService, OpenWeatherService>(client =>
{
    client.Timeout = TimeSpan.FromSeconds(30);
});

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "ViteDev",
        policy =>
            policy
                .WithOrigins("http://localhost:5173", "http://127.0.0.1:5173")
                .AllowAnyHeader()
                .AllowAnyMethod());
});

builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("ViteDev");

app.MapGet(
        "/api/weather/forecast",
        async (
            double lat,
            double lon,
            string? lang,
            IOpenWeatherService weatherService,
            CancellationToken cancellationToken) =>
        {
            if (lat is < -90 or > 90 || lon is < -180 or > 180)
            {
                return Results.BadRequest(new { error = "lat must be -90..90 and lon -180..180." });
            }

            var language = string.IsNullOrWhiteSpace(lang) ? "en" : lang.Trim();

            try
            {
                var days = await weatherService.GetFiveDayForecastAsync(
                    lat,
                    lon,
                    language,
                    cancellationToken);
                return Results.Ok(days);
            }
            catch (InvalidOperationException ex)
            {
                return Results.Problem(
                    detail: ex.Message,
                    statusCode: StatusCodes.Status500InternalServerError);
            }
            catch (OpenWeatherUpstreamException ex) when (ex.StatusCode == HttpStatusCode.Unauthorized)
            {
                return Results.Json(
                    new { error = "errors.invalidApiKey" },
                    statusCode: StatusCodes.Status401Unauthorized);
            }
            catch (OpenWeatherUpstreamException)
            {
                return Results.Json(
                    new { error = "errors.weatherRequestFailed" },
                    statusCode: StatusCodes.Status502BadGateway);
            }
            catch (HttpRequestException)
            {
                return Results.Json(
                    new { error = "errors.weatherRequestFailed" },
                    statusCode: StatusCodes.Status502BadGateway);
            }
        })
    .WithName("GetFiveDayForecast");

app.Run();
