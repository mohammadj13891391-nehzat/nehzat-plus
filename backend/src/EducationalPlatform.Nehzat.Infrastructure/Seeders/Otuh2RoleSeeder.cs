using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using EducationalPlatform.Nehzat.Infrastructure.Clients;

namespace EducationalPlatform.Nehzat.Infrastructure.Seeders;

public class Otuh2RoleSeeder
{
    private static readonly string[] RequiredRoles =
    [
        "manager", "headquarters", "branch_manager",
        "coach", "parent", "evaluator", "trainee"
    ];

    private static readonly Dictionary<string, string> RoleDescriptions = new()
    {
        ["manager"] = "مدیر سیستم - دسترسی کامل",
        ["headquarters"] = "ستاد - مدیریت چند شعبه",
        ["branch_manager"] = "مدیر شعبه - مدیریت یک شعبه",
        ["coach"] = "مربی - ارزیابی دانش‌آموزان",
        ["parent"] = "والدین - مشاهده وضعیت فرزند",
        ["evaluator"] = "ارزیاب - ارزیابی تخصصی",
        ["trainee"] = "دانش‌آموز - داشبورد شخصی"
    };

    public static async Task SeedAsync(IServiceProvider services)
    {
        var config = services.GetRequiredService<IConfiguration>();
        var logger = services.GetRequiredService<ILoggerFactory>().CreateLogger("Otuh2RoleSeeder");

        var client = services.GetRequiredService<IOtuh2AuthClient>();
        var baseUrl = config["Otuh2Client:BaseUrl"] ?? "http://localhost:5000";
        var clientId = config["Otuh2Client:ClientId"] ?? "nehzat-plus";
        var clientSecret = config["Otuh2Client:ClientSecret"] ?? "";

        try
        {
            // Get admin token via client_credentials
            var tokenParams = new Dictionary<string, string>
            {
                ["grant_type"] = "client_credentials",
                ["client_id"] = clientId,
                ["client_secret"] = clientSecret,
                ["scope"] = "openid"
            };

            TokenResponse? tokenResponse;
            try
            {
                tokenResponse = await client.GetTokenAsync(tokenParams);
            }
            catch
            {
                logger.LogWarning("OTUH2 role seeding skipped — could not obtain client_credentials token from {BaseUrl}", baseUrl);
                return;
            }

            var bearerToken = $"Bearer {tokenResponse.AccessToken}";

            // Fetch existing roles
            List<RoleDefinitionResponse> existingRoles;
            try
            {
                existingRoles = await client.GetRolesAsync(bearerToken);
            }
            catch
            {
                logger.LogWarning("OTUH2 role seeding skipped — could not fetch existing roles");
                return;
            }

            var existingRoleNames = existingRoles.Select(r => r.Name).ToHashSet(StringComparer.OrdinalIgnoreCase);

            // Create missing roles
            foreach (var role in RequiredRoles)
            {
                if (existingRoleNames.Contains(role))
                {
                    logger.LogInformation("OTUH2 role '{Role}' already exists — skipping", role);
                    continue;
                }

                try
                {
                    var description = RoleDescriptions.GetValueOrDefault(role, role);
                    await client.CreateRoleAsync(bearerToken, new CreateRoleRequest(role, description));
                    logger.LogInformation("OTUH2 role '{Role}' created successfully", role);
                }
                catch (Exception ex)
                {
                    logger.LogWarning(ex, "OTUH2 role '{Role}' creation failed", role);
                }
            }
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "OTUH2 role seeding failed — service may be unavailable");
        }
    }
}
