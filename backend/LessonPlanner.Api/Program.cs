using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using LessonPlanner.Api.Data;
using LessonPlanner.Api.Services;
using LessonPlanner.Api.Seeders;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping;
    });
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IStudentService, StudentService>();
builder.Services.AddScoped<ICourseService, CourseService>();
    builder.Services.AddScoped<IAssignmentSubmissionService, AssignmentSubmissionService>();
    builder.Services.AddScoped<ICoachService, CoachService>();
    builder.Services.AddScoped<IBranchManagerService, BranchManagerService>();
    builder.Services.AddScoped<IParentService, ParentService>();
    builder.Services.AddScoped<IEvaluatorService, EvaluatorService>();
    builder.Services.AddScoped<SampleDataSeeder>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseCors();
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

    // Sample data seeder is disabled; all data must be entered through the frontend.
    // var seeder = scope.ServiceProvider.GetRequiredService<SampleDataSeeder>();
    // try
    // {
    //     Console.WriteLine("🌱 شروع ایجاد داده‌های نمونه در راه‌اندازی برنامه...");
    //     await seeder.SeedAsync();
    //     Console.WriteLine("🎉 ایجاد داده‌های نمونه با موفقیت انجام شد");
    // }
    // catch (Exception ex)
    // {
    //     Console.WriteLine($"⚠️ خطا در ایجاد داده‌های نمونه: {ex.Message}");
    // }
}

app.Run();
