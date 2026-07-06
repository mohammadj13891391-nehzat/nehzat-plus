using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using EducationalPlatform.Nehzat.API.Middleware;
using EducationalPlatform.Nehzat.Application.Interfaces;
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
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

var useMockAuth = builder.Configuration.GetValue<bool>("UseMockAuth");

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
    var jwtSettings = builder.Configuration.GetSection("Jwt");
    var jwtKey = Encoding.UTF8.GetBytes(jwtSettings["Key"]!);

    builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(jwtKey),
            ClockSkew = TimeSpan.FromMinutes(5)
        };
    });
}

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy =>
        policy.RequireRole("admin", "manager", "headquarters"));

    options.AddPolicy("AllRoles", policy =>
        policy.RequireRole("admin", "manager", "headquarters", "branch_manager", "coach", "parent", "evaluator", "trainee"));
});

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
        policy.WithOrigins("http://localhost:4200", "http://localhost:3000")
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
    var existingAdmin = await userService.FindUserAsync("test");
    if (existingAdmin == null)
    {
        try
        {
            await userService.CreateUserAsync("test", "password", null, null, "manager");
            Console.WriteLine("✅ کاربر پیش‌فرض (مدیر) ایجاد شد");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"⚠️ خطا در ایجاد کاربر پیش‌فرض: {ex.Message}");
        }
    }
    else if (existingAdmin.UserType == "admin")
    {
        try
        {
            await userService.UpdateUserTypeAsync(existingAdmin.Id, "manager");
            Console.WriteLine("✅ نقش کاربر پیش‌فرض به manager به‌روزرسانی شد");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"⚠️ خطا در به‌روزرسانی نقش کاربر پیش‌فرض: {ex.Message}");
        }
    }

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
}

app.Run();
