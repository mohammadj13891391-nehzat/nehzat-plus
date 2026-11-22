using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Yarp.ReverseProxy.Transforms;

var builder = WebApplication.CreateBuilder(args);

var prefixes = new Dictionary<string, string>
{
    ["auth"] = "/oauth",
    ["lesson"] = "/lesson",
    ["share"] = "/share",
    ["personality"] = "/personality",
    ["shop"] = "/shop",
};

builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"))
    .AddTransforms(ctx =>
    {
        if (prefixes.TryGetValue(ctx.Route.RouteId, out var prefix))
        {
            ctx.AddPathRemovePrefix(prefix);
        }
    });
builder.Logging.ClearProviders();
builder.Logging.AddSimpleConsole();

var app = builder.Build();
app.UseRouting();
app.MapReverseProxy();

app.Run("http://localhost:8080");
