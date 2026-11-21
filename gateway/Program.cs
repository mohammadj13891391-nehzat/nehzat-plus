using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddReverseProxy().LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));
builder.Logging.ClearProviders();
builder.Logging.AddSimpleConsole();

var app = builder.Build();
app.UseRouting();
app.MapReverseProxy();

app.Run("http://localhost:8080");
