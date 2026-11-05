using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.OpenApi;

using EducationalPlatform.Nehzat.API.Hubs;
using EducationalPlatform.Nehzat.API.Middleware;
using EducationalPlatform.Nehzat.API.Security;
using EducationalPlatform.Nehzat.API.Services;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Infrastructure.BackgroundServices;
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
            ValidateAudience = true,
            ValidAudience = "https://api.nehzat128.ir",
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
            ?? Environment.GetEnvironmentVariable("NEHZAT_DEV_AUTH_KEY")
            ?? throw new InvalidOperationException("DevAuth:DevAuthKey (or NEHZAT_DEV_AUTH_KEY env var) is required when DevAuth:UseMockAuth is true");
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

builder.Services.AddAuthorization(options =>
{
    // Default-deny: any endpoint without an explicit authorization attribute
    // (and without [AllowAnonymous]) requires an authenticated user.
    options.FallbackPolicy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build();
});

var otuh2ClientConfig = builder.Configuration.GetSection("Otuh2Client");
var otuh2BaseUrl = otuh2ClientConfig["BaseUrl"] ?? oidcConfig["Authority"] ?? "http://localhost:5000";
var otuh2ClientId = otuh2ClientConfig["ClientId"] ?? "nehzat-plus-client";
var otuh2ClientSecret = otuh2ClientConfig["ClientSecret"] ?? Environment.GetEnvironmentVariable("OTUH2_CLIENT_SECRET") ?? "";
var otuh2ApiKey = otuh2ClientConfig["ApiKey"] ?? Environment.GetEnvironmentVariable("OTUH2_API_KEY") ?? "";
builder.Services.AddOtuh2AuthClient(otuh2BaseUrl, otuh2ClientId, otuh2ClientSecret, otuh2ApiKey);
builder.Services.AddQuranComClient();
builder.Services.AddScoped<IQuranComService, QuranComService>();

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
builder.Services.AddScoped<INotificationBroadcaster, NotificationBroadcaster>();
builder.Services.AddScoped<ISkillProgressService, SkillProgressService>();
builder.Services.AddScoped<ISpiritualCatalogService, SpiritualCatalogService>();
builder.Services.AddScoped<ISpiritualEntryService, SpiritualEntryService>();
builder.Services.AddScoped<IDailyActivityService, DailyActivityService>();
builder.Services.AddScoped<IArtsService, ArtsService>();
builder.Services.AddScoped<ISpiritualOccasionService, SpiritualOccasionService>();
builder.Services.AddScoped<ISpiritualPathService, SpiritualPathService>();
builder.Services.AddScoped<ICurriculumVersionService, CurriculumVersionService>();
builder.Services.AddScoped<IMonthlyBookletService, MonthlyBookletService>();
builder.Services.AddScoped<ICompetitionService, CompetitionService>();
builder.Services.AddScoped<ILeagueService, LeagueService>();
builder.Services.AddScoped<IProgressionService, ProgressionService>();
builder.Services.AddScoped<SampleDataSeeder>();
builder.Services.AddScoped<QuranRingSeeder>();
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
builder.Services.AddScoped<IStudyPathService, StudyPathService>();
builder.Services.AddScoped<ISrsService, SrsService>();
builder.Services.AddScoped<IXpService, XpService>();
builder.Services.AddScoped<IGamificationService, GamificationService>();
builder.Services.AddScoped<XpDataSeeder>();
builder.Services.AddScoped<TrainingDataSeeder>();
builder.Services.AddScoped<ITrainingService, TrainingService>();
builder.Services.AddScoped<IMaktabService, MaktabService>();
builder.Services.AddScoped<IMaktabLookupService, MaktabLookupService>();
builder.Services.AddScoped<IFeedbackService, FeedbackService>();
builder.Services.AddScoped<IPhaseTransitionService, PhaseTransitionService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IHalghehService, HalghehService>();
builder.Services.AddScoped<IHalghehMaktabService, HalghehMaktabService>();
builder.Services.AddScoped<IHalghehAssignmentService, HalghehAssignmentService>();
builder.Services.AddScoped<IConversationService, ConversationService>();
builder.Services.AddScoped<IMessageService, MessageService>();
builder.Services.AddScoped<IAiService, AiService>();
builder.Services.AddScoped<IWorkflowService, WorkflowService>();
builder.Services.AddScoped<IEducationalProcessService, EducationalProcessService>();
builder.Services.AddSingleton<ICalendarConverter, CalendarConverter>();
builder.Services.AddScoped<IProfileService, ProfileService>();
builder.Services.AddScoped<IProgressService, ProgressService>();
builder.Services.AddScoped<ICalendarEventService, CalendarEventService>();
builder.Services.AddScoped<IEvaluationService, EvaluationService>();
builder.Services.AddScoped<IQuranRingService, QuranRingService>();
builder.Services.AddSignalR();
builder.Services.AddHttpClient<AiService>();

builder.Services.AddScoped<IMapService, MapService>();
builder.Services.AddHttpClient("OSRM", client =>
{
    var osrm = builder.Configuration["Osrm:BaseUrl"] ?? "https://router.project-osrm.org";
    client.BaseAddress = new Uri(osrm);
    client.Timeout = TimeSpan.FromSeconds(15);
});

builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<IFcmPushService, FcmPushService>();
builder.Services.AddScoped<ICourierReportService, CourierReportService>();
builder.Services.AddHostedService<LocationCleanupService>();
builder.Services.AddHostedService<OrderExpiryService>();

// Swagger/OpenAPI — circular references در EF Core navigation properties
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();
builder.Services.ConfigureHttpJsonOptions(o =>
{
    o.SerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    o.SerializerOptions.MaxDepth = 128;
});

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

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors();
app.UseAuthentication();
app.UseMiddleware<OidcSyncMiddleware>();
app.UseAuthorization();
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "public")),
    RequestPath = "",
    OnPrepareResponse = ctx =>
    {
        var path = ctx.Context.Request.Path.Value ?? "";
        var isPublicAsset = path.Equals("/config.json", StringComparison.OrdinalIgnoreCase)
            || path.Equals("/manifest.json", StringComparison.OrdinalIgnoreCase)
            || path.EndsWith(".ico", StringComparison.OrdinalIgnoreCase);

        if (!isPublicAsset && ctx.Context.User.Identity?.IsAuthenticated != true)
        {
            ctx.Context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            ctx.Context.Response.ContentType = "application/json";
            ctx.Context.Response.Headers.WWWAuthenticate = "Bearer";
            if (!ctx.Context.RequestAborted.IsCancellationRequested)
            {
                ctx.Context.Response.WriteAsync("{\"message\":\"دسترسی غیرمجاز\"}")
                    .GetAwaiter().GetResult();
            }
        }
    }
});
app.MapControllers();
app.MapOpenApi("/openapi/v1.json");
app.MapHub<NotificationHub>("/hubs/notifications");

using (var scope = app.Services.CreateScope())
{
    var logger = app.Services.GetRequiredService<ILoggerFactory>().CreateLogger("Startup");
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    // Database lifecycle (safe adoption of legacy EnsureCreated databases):
    //  - Missing DB:            create via real migrations when available
    //  - Existing DB w/ history: apply pending migrations
    //  - Existing DB w/o history (legacy EnsureCreated, has tables): leave as-is
    //  - Existing empty DB:     create via migrations
    if (args.Contains("--seed"))
    {
        db.Database.EnsureDeleted();
        if (db.Database.GetMigrations().Any()) db.Database.Migrate();
        else db.Database.EnsureCreated();
    }
    else
    {
        try
        {
            if (db.Database.GetAppliedMigrations().Any())
            {
                if (db.Database.GetPendingMigrations().Any()) db.Database.Migrate();
            }
            else if (!HasTables(db))
            {
                if (db.Database.GetMigrations().Any()) db.Database.Migrate();
                else db.Database.EnsureCreated();
            }
        }
        catch (Microsoft.Data.SqlClient.SqlException ex) when (ex.Number == 918)
        {
            if (db.Database.GetMigrations().Any()) db.Database.Migrate();
            else db.Database.EnsureCreated();
        }
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
            logger.LogInformation("✅ شعبه پیش‌فرض (شعبه مرکزی) ایجاد شد");
        }
        catch (Exception ex)
        {
            logger.LogWarning("⚠️ خطا در ایجاد شعبه پیش‌فرض: {Message}", ex.Message);
        }
    }

    var seeder = scope.ServiceProvider.GetRequiredService<SampleDataSeeder>();
    await seeder.SeedAsync();

    var quranSeeder = scope.ServiceProvider.GetRequiredService<QuranDataSeeder>();
    await quranSeeder.SeedAsync();

    var quranRingSeeder = scope.ServiceProvider.GetRequiredService<QuranRingSeeder>();
    await quranRingSeeder.SeedAsync();

    var hadithSeeder = scope.ServiceProvider.GetRequiredService<HadithDataSeeder>();
    await hadithSeeder.SeedAsync();

    var arabicLitSeeder = scope.ServiceProvider.GetRequiredService<ArabicLiteratureDataSeeder>();
    await arabicLitSeeder.SeedAsync();

    var mathSeeder = scope.ServiceProvider.GetRequiredService<MathDataSeeder>();
    await mathSeeder.SeedAsync();

    var experimentalScienceSeeder = scope.ServiceProvider.GetRequiredService<ExperimentalScienceDataSeeder>();
    await experimentalScienceSeeder.SeedAsync();

    var xpSeeder = scope.ServiceProvider.GetRequiredService<XpDataSeeder>();
    await xpSeeder.SeedAsync();

    var trainingSeeder = scope.ServiceProvider.GetRequiredService<TrainingDataSeeder>();
    await trainingSeeder.SeedAsync();

    // Seed Nehzat Plus roles in OTUH2 (non-blocking — failure is logged, not fatal).
    // A dedicated scope is created inside the task so the startup scope can be
    // disposed immediately without racing the background work.
    _ = Task.Run(async () =>
    {
        using var taskScope = app.Services.CreateScope();
        var taskLogService = taskScope.ServiceProvider.GetRequiredService<ILogService>();

        try
        {
            await Otuh2RoleSeeder.SeedAsync(taskScope.ServiceProvider);
        }
        catch (Exception ex)
        {
            logger.LogWarning("⚠️ OTUH2 role seeding failed: {Message}", ex.Message);
            await taskLogService.LogErrorAsync("Otuh2RoleSeeder", ex);
        }
    });
}

app.Run();

static bool HasTables(AppDbContext db)
    => db.Database.SqlQueryRaw<int>("SELECT 1 AS [Value] FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'").Any();
