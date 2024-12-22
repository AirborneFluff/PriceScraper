using API.Interfaces;
using API.Services;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpClient<IWebScraper, JustKampersScraper>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapGet("api/scrape-item", async (IWebScraper webScraper, [FromQuery] string uniqueCode) =>
    {
        if (string.IsNullOrWhiteSpace(uniqueCode))
        {
            return Results.BadRequest("Unique code is required.");
        }

        var itemDetails = await webScraper.GetItemDetails(uniqueCode);
        return Results.Ok(itemDetails);
    })
    .WithName("ScrapeItem")
    .WithOpenApi();

app.Run();