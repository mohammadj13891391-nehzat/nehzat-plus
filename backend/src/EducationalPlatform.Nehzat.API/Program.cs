using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using EducationalPlatform.Nehzat.API.Middleware;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Infrastructure.Clients;
using EducationalPlatform.Nehzat.Infrastructure.Data;
using EducationalPlatform.Nehzat.Infrastructure.Services;
using EducationalPlatform.Nehzat.Infrastructure.Seeders;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping;
    });

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var useMockAuth = builder.Configuration.GetValue<bool>("UseMockAuth");
var oidcConfig = builder.Configuration.GetSection("Oidc");

if (useMockAuth)
{
    builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = "MockScheme";
        options.DefaultChallengeScheme = "MockScheme";
    })
    .AddScheme<AuthenticationSchemeOptions, MockAuthHandler>("MockScheme", null);
}
else
{
    builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.Authority = oidcConfig["Authority"];
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateAudience = false,
            ValidTypes = new[] { "at+jwt" },
            NameClaimType = "sub",
            RoleClaimType = "role"
        };
        options.RequireHttpsMetadata = oidcConfig.GetValue<bool>("RequireHttpsMetadata");
    });
}

builder.Services.AddAuthorization();

var otuh2ClientConfig = builder.Configuration.GetSection("Otuh2Client");
var otuh2BaseUrl = otuh2ClientConfig["BaseUrl"] ?? oidcConfig["Authority"] ?? "http://localhost:5000";
builder.Services.AddOtuh2AuthClient(otuh2BaseUrl);

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IStudentService, StudentService>();
builder.Services.AddScoped<ICourseService, CourseService>();
builder.Services.AddScoped<IAssignmentSubmissionService, AssignmentSubmissionService>();
builder.Services.AddScoped<ICoachService, CoachService>();
builder.Services.AddScoped<IBranchManagerService, BranchManagerService>();
builder.Services.AddScoped<IBranchService, BranchService>();
builder.Services.AddScoped<IParentService, ParentService>();
builder.Services.AddScoped<IEvaluatorService, EvaluatorService>();
builder.Services.AddScoped<IAssessmentService, AssessmentService>();
builder.Services.AddScoped<SampleDataSeeder>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:4200", "http://localhost:4201", "http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

var app = builder.Build();

app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsync(JsonSerializer.Serialize(new
        {
            message = "خطای داخلی سرور. لطفاً بعداً دوباره تلاش کنید"
        }));
    });
});

app.UseCors();
app.UseAuthentication();
app.UseMiddleware<OidcSyncMiddleware>();
app.UseAuthorization();
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "public")),
    RequestPath = ""
});
app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();

    if (args.Contains("--seed"))
    {
        db.Database.EnsureDeleted();
        db.Database.EnsureCreated();
    }

    var userService = scope.ServiceProvider.GetRequiredService<IUserService>();
    // Users are synced from OTUH2 via OidcSyncMiddleware on first request

    var branchService = scope.ServiceProvider.GetRequiredService<IBranchService>();
    var branches = await branchService.GetAllAsync();
    if (branches.Count == 0)
    {
        try
        {
            await branchService.CreateAsync("شعبه مرکزی", "تهران", "شعبه اصلی و مرکزی");
            Console.WriteLine("✅ شعبه پیش‌فرض (شعبه مرکزی) ایجاد شد");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"⚠️ خطا در ایجاد شعبه پیش‌فرض: {ex.Message}");
        }
    }

    var seeder = scope.ServiceProvider.GetRequiredService<SampleDataSeeder>();
    await seeder.SeedAsync();

    // Seed Nehzat Plus roles in OTUH2 (non-blocking — failure is logged, not fatal)
    _ = Task.Run(async () =>
    {
        try
        {
            await Otuh2RoleSeeder.SeedAsync(scope.ServiceProvider);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"⚠️ OTUH2 role seeding failed: {ex.Message}");
        }
    });
}

app.Run();
