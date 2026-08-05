using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using EducationalPlatform.Nehzat.API.Middleware;
using EducationalPlatform.Nehzat.API.Security;
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

var oidcConfig = builder.Configuration.GetSection("Oidc");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    // Keep JWT claim names as-is (sub, role) instead of remapping to WIF URIs,
    // so NameClaimType="sub" and RoleClaimType="role" match the OTUH2 token.
    options.MapInboundClaims = false;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateAudience = false,
        ValidTypes = new[] { "at+jwt" },
        NameClaimType = "sub",
        RoleClaimType = "role"
    };

    // Production: validate tokens against the OTUH2 authority (JWKS).
    // Development: allow a local HMAC-issued token for the dev-only /auth/signin flow
    // without running OTUH2. UseMockAuth defaults false here; only enabled in Development
    // via appsettings.Development.json "DevAuth".
    var devAuthConfig = builder.Configuration.GetSection("DevAuth");
    var useMockAuth = builder.Environment.IsDevelopment()
        && devAuthConfig.GetValue<bool>("UseMockAuth", false);

    if (useMockAuth)
    {
        var devKey = devAuthConfig["DevAuthKey"]
            ?? throw new InvalidOperationException("DevAuth:DevAuthKey is required when DevAuth:UseMockAuth is true");
        var issuer = devAuthConfig["Issuer"] ?? "http://localhost:3000";
        var audience = devAuthConfig["Audience"] ?? "http://localhost:3000";
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(devKey));

        options.RequireHttpsMetadata = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = issuer,
            ValidateAudience = true,
            ValidAudiences = new[] { audience },
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = key,
            ValidateLifetime = true,
            ValidTypes = new[] { "at+jwt" },
            NameClaimType = "sub",
            RoleClaimType = "role"
        };
    }
    else
    {
        options.Authority = oidcConfig["Authority"];
        options.RequireHttpsMetadata = oidcConfig.GetValue<bool>("RequireHttpsMetadata");
    }
});

builder.Services.AddSingleton<IDevTokenService, DevTokenService>();

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
builder.Services.AddScoped<ITeacherService, TeacherService>();
builder.Services.AddScoped<IAssessmentService, AssessmentService>();
builder.Services.AddScoped<IMadrasahService, MadrasahService>();
builder.Services.AddScoped<ICurriculumService, CurriculumService>();
builder.Services.AddScoped<IRingService, RingService>();
builder.Services.AddScoped<ISkillProgressService, SkillProgressService>();
builder.Services.AddScoped<ITeacherService, TeacherService>();
    builder.Services.AddScoped<ISpiritualCatalogService, SpiritualCatalogService>();
    builder.Services.AddScoped<ISpiritualEntryService, SpiritualEntryService>();
    builder.Services.AddScoped<ISpiritualOccasionService, SpiritualOccasionService>();
    builder.Services.AddScoped<ISpiritualPathService, SpiritualPathService>();
    builder.Services.AddScoped<ICurriculumVersionService, CurriculumVersionService>();
    builder.Services.AddScoped<IMonthlyBookletService, MonthlyBookletService>();
builder.Services.AddScoped<ICompetitionService, CompetitionService>();
    builder.Services.AddScoped<ILeagueService, LeagueService>();
    builder.Services.AddScoped<IProgressionService, ProgressionService>();
    builder.Services.AddScoped<SampleDataSeeder>();
    builder.Services.AddScoped<QuranDataSeeder>();
    builder.Services.AddScoped<ILogService, LogService>();
    builder.Services.AddScoped<IIssueSurveyService, IssueSurveyService>();
    builder.Services.AddScoped<IQuranService, QuranService>();
    builder.Services.AddScoped<IPersianLiteratureService, PersianLiteratureService>();
    builder.Services.AddScoped<ILearningService, LearningService>();
    builder.Services.AddScoped<IArabicLiteratureService, ArabicLiteratureService>();
    builder.Services.AddScoped<ArabicLiteratureDataSeeder>();
    builder.Services.AddScoped<IMathService, MathService>();
    builder.Services.AddScoped<MathDataSeeder>();
    builder.Services.AddScoped<IExperimentalScienceService, ExperimentalScienceService>();
    builder.Services.AddScoped<ExperimentalScienceDataSeeder>();
    builder.Services.AddScoped<IHadithService, HadithService>();
    builder.Services.AddScoped<HadithDataSeeder>();

    builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>();
        if (allowedOrigins is not { Length: > 0 })
        {
            allowedOrigins = builder.Environment.IsDevelopment()
                ? new[] { "http://localhost:4200" }
                : Array.Empty<string>();
        }

        if (allowedOrigins.Length > 0)
        {
            policy.WithOrigins(allowedOrigins)
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials();
        }
    });
});

var app = builder.Build();

app.UseMiddleware<GlobalExceptionMiddleware>();

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

    if (args.Contains("--seed"))
    {
        db.Database.EnsureDeleted();
    }

    db.Database.EnsureCreated();

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

    var quranSeeder = scope.ServiceProvider.GetRequiredService<QuranDataSeeder>();
    await quranSeeder.SeedAsync();

    var hadithSeeder = scope.ServiceProvider.GetRequiredService<HadithDataSeeder>();
    await hadithSeeder.SeedAsync();

    var arabicLitSeeder = scope.ServiceProvider.GetRequiredService<ArabicLiteratureDataSeeder>();
    await arabicLitSeeder.SeedAsync();

    var mathSeeder = scope.ServiceProvider.GetRequiredService<MathDataSeeder>();
    await mathSeeder.SeedAsync();

    var experimentalScienceSeeder = scope.ServiceProvider.GetRequiredService<ExperimentalScienceDataSeeder>();
    await experimentalScienceSeeder.SeedAsync();

    var logService = scope.ServiceProvider.GetRequiredService<ILogService>();

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
            await logService.LogErrorAsync("Otuh2RoleSeeder", ex);
        }
    });
}

app.Run();
