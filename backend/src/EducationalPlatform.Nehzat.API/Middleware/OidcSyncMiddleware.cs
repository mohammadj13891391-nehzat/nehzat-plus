using EducationalPlatform.Nehzat.Application.Interfaces;

namespace EducationalPlatform.Nehzat.API.Middleware;

public class OidcSyncMiddleware
{
    private readonly RequestDelegate _next;

    public OidcSyncMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, IUserService userService)
    {
        if (context.User.Identity?.IsAuthenticated == true)
        {
            var sub = context.User.FindFirst("sub")?.Value;
            var userIdClaim = context.User.FindFirst("userId")?.Value;
            var username = sub ?? userIdClaim;

            if (!string.IsNullOrEmpty(username))
            {
                var existingUser = await userService.FindByUsernameAsync(username);
                if (existingUser == null)
                {
                    var roles = context.User.FindAll("role").Select(c => c.Value).ToList();
                    var primaryRole = roles.FirstOrDefault() ?? "trainee";

                    try
                    {
                        await userService.CreateLocalUserAsync(username, primaryRole, userIdClaim);
                    }
                    catch
                    {
                        // User might already exist (race condition) — safe to ignore
                    }
                }
                else
                {
                    // Sync OidcSubject if changed
                    if (!string.IsNullOrEmpty(userIdClaim) && existingUser.OidcSubject != userIdClaim)
                    {
                        try
                        {
                            await userService.SyncOidcSubjectAsync(username, userIdClaim);
                        }
                        catch
                        {
                            // Sync failure is non-fatal
                        }
                    }

                    // Sync UserType from token roles if changed
                    var tokenRoles = context.User.FindAll("role").Select(c => c.Value).ToList();
                    if (tokenRoles.Count > 0)
                    {
                        var primaryRole = tokenRoles[0];
                        if (!string.Equals(existingUser.UserType, primaryRole, StringComparison.OrdinalIgnoreCase))
                        {
                            try
                            {
                                await userService.UpdateUserTypeAsync(existingUser.Id, primaryRole);
                        }
                        catch
                        {
                            // Role sync failure is non-fatal
                        }
                        }
                    }
                }
            }
        }

        await _next(context);
    }
}
