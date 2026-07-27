using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EducationalPlatform.Nehzat.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddNehzatSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "nehzat");

            migrationBuilder.CreateTable(
                name: "Nehzat_age_groups",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Key = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    MinAge = table.Column<int>(type: "int", nullable: false),
                    MaxAge = table.Column<int>(type: "int", nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_age_groups", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_branches",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(200)", nullable: false),
                    Province = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_branches", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_courses",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(200)", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    CourseCode = table.Column<string>(type: "nvarchar(20)", nullable: false),
                    Credits = table.Column<int>(type: "int", nullable: false),
                    Instructor = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    StartDate = table.Column<DateTime>(type: "date", nullable: false),
                    EndDate = table.Column<DateTime>(type: "date", nullable: false),
                    MaxStudents = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_courses", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_curriculum_versions",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Key = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    VersionNumber = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(20)", nullable: false),
                    ValidFrom = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ValidTo = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_curriculum_versions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_issue_item_pool",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    QuestionText = table.Column<string>(type: "nvarchar(500)", nullable: false),
                    Category = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    SubCategory = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    TargetAudience = table.Column<string>(type: "nvarchar(50)", nullable: true),
                    SuggestedActions = table.Column<string>(type: "nvarchar(2000)", nullable: true),
                    Source = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    UsageCount = table.Column<int>(type: "int", nullable: false),
                    AvgScore = table.Column<double>(type: "float", nullable: true),
                    Trend = table.Column<string>(type: "nvarchar(20)", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_issue_item_pool", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_logs",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Timestamp = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Level = table.Column<string>(type: "nvarchar(20)", nullable: false),
                    Source = table.Column<string>(type: "nvarchar(200)", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    IpAddress = table.Column<string>(type: "nvarchar(45)", nullable: true),
                    TraceId = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    Message = table.Column<string>(type: "nvarchar(2000)", nullable: false),
                    ExceptionDetails = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_logs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_nehzat_sections",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Key = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", nullable: false),
                    Gender = table.Column<string>(type: "nvarchar(20)", nullable: true),
                    ParentSectionId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_nehzat_sections", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_nehzat_sections_Nehzat_nehzat_sections_ParentSectionId",
                        column: x => x.ParentSectionId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_nehzat_sections",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_quran_recitation_levels",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    LevelNumber = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1000)", nullable: false),
                    Criteria = table.Column<string>(type: "nvarchar(500)", nullable: false),
                    ColorCode = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    PointsRequired = table.Column<int>(type: "int", nullable: false),
                    EstimatedWeeks = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_quran_recitation_levels", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_spiritual_occasions",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Key = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    TitleFa = table.Column<string>(type: "nvarchar(200)", nullable: false),
                    DescriptionFa = table.Column<string>(type: "text", nullable: true),
                    HijriMonth = table.Column<int>(type: "int", nullable: true),
                    HijriDay = table.Column<int>(type: "int", nullable: true),
                    GenderMask = table.Column<string>(type: "nvarchar(20)", nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_spiritual_occasions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_spiritual_paths",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Key = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    TitleFa = table.Column<string>(type: "nvarchar(200)", nullable: false),
                    DescriptionFa = table.Column<string>(type: "text", nullable: true),
                    GenderMask = table.Column<string>(type: "nvarchar(20)", nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    AgeEntryPoint = table.Column<int>(type: "int", nullable: false),
                    AgeFinalizePoint = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(20)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_spiritual_paths", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_spiritual_practice_items",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Key = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    TitleFa = table.Column<string>(type: "nvarchar(200)", nullable: false),
                    DescriptionFa = table.Column<string>(type: "text", nullable: true),
                    StepKind = table.Column<string>(type: "nvarchar(20)", nullable: false),
                    MinAge = table.Column<int>(type: "int", nullable: true),
                    MaxAge = table.Column<int>(type: "int", nullable: true),
                    GenderMask = table.Column<string>(type: "nvarchar(20)", nullable: false),
                    RoleMask = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_spiritual_practice_items", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_subject_areas",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Key = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_subject_areas", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_teaching_methods",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Key = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_teaching_methods", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_branch_managers",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Username = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(255)", nullable: true),
                    FirstName = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(20)", nullable: true),
                    BranchId = table.Column<int>(type: "int", nullable: false),
                    Gender = table.Column<string>(type: "nvarchar(20)", nullable: false),
                    NationalCode = table.Column<string>(type: "nvarchar(20)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_branch_managers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_branch_managers_Nehzat_branches_BranchId",
                        column: x => x.BranchId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_branches",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_coaches",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Username = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(255)", nullable: true),
                    FirstName = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(20)", nullable: true),
                    Specialization = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    NationalCode = table.Column<string>(type: "nvarchar(20)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    BranchId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_coaches", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_coaches_Nehzat_branches_BranchId",
                        column: x => x.BranchId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_branches",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_evaluators",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Username = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(255)", nullable: true),
                    FirstName = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(20)", nullable: true),
                    Expertise = table.Column<string>(type: "nvarchar(200)", nullable: true),
                    NationalCode = table.Column<string>(type: "nvarchar(20)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    BranchId = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_evaluators", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_evaluators_Nehzat_branches_BranchId",
                        column: x => x.BranchId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_branches",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_parents",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Username = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(255)", nullable: true),
                    FirstName = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(20)", nullable: true),
                    Address = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    NationalCode = table.Column<string>(type: "nvarchar(20)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    BranchId = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_parents", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_parents_Nehzat_branches_BranchId",
                        column: x => x.BranchId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_branches",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_students",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    StudentId = table.Column<string>(type: "nvarchar(20)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(20)", nullable: true),
                    Address = table.Column<string>(type: "text", nullable: true),
                    DateOfBirth = table.Column<DateTime>(type: "date", nullable: true),
                    Gender = table.Column<string>(type: "nvarchar(20)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    BranchId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_students", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_students_Nehzat_branches_BranchId",
                        column: x => x.BranchId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_branches",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_teachers",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Username = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(255)", nullable: true),
                    FirstName = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(20)", nullable: true),
                    Specialization = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    NationalCode = table.Column<string>(type: "nvarchar(20)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    BranchId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_teachers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_teachers_Nehzat_branches_BranchId",
                        column: x => x.BranchId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_branches",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_competitions",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(200)", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    Type = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(20)", nullable: false),
                    CourseId = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_competitions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_competitions_Nehzat_courses_CourseId",
                        column: x => x.CourseId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_courses",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_leagues",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(200)", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    Season = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(20)", nullable: false),
                    CourseId = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_leagues", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_leagues_Nehzat_courses_CourseId",
                        column: x => x.CourseId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_courses",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_madrasahs",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Key = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", nullable: false),
                    Label = table.Column<string>(type: "nvarchar(200)", nullable: true),
                    Level = table.Column<string>(type: "nvarchar(50)", nullable: true),
                    Gender = table.Column<string>(type: "nvarchar(20)", nullable: false),
                    Grade = table.Column<int>(type: "int", nullable: false),
                    Capacity = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    SectionId = table.Column<int>(type: "int", nullable: true),
                    ManagerId = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_madrasahs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_madrasahs_Nehzat_nehzat_sections_SectionId",
                        column: x => x.SectionId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_nehzat_sections",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_spiritual_occasion_practices",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OccasionId = table.Column<int>(type: "int", nullable: false),
                    PracticeItemId = table.Column<int>(type: "int", nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_spiritual_occasion_practices", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_spiritual_occasion_practices_Nehzat_spiritual_occasions_OccasionId",
                        column: x => x.OccasionId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_spiritual_occasions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Nehzat_spiritual_occasion_practices_Nehzat_spiritual_practice_items_PracticeItemId",
                        column: x => x.PracticeItemId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_spiritual_practice_items",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_books",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Key = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(300)", nullable: false),
                    Author = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    SubjectAreaId = table.Column<int>(type: "int", nullable: false),
                    Level = table.Column<string>(type: "nvarchar(50)", nullable: true),
                    Publisher = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    Pages = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_books", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_books_Nehzat_subject_areas_SubjectAreaId",
                        column: x => x.SubjectAreaId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_subject_areas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_curriculum_objectives",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Key = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(300)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1000)", nullable: true),
                    SubjectAreaId = table.Column<int>(type: "int", nullable: false),
                    ParentObjectiveId = table.Column<int>(type: "int", nullable: true),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    Level = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_curriculum_objectives", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_curriculum_objectives_Nehzat_curriculum_objectives_ParentObjectiveId",
                        column: x => x.ParentObjectiveId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_curriculum_objectives",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Nehzat_curriculum_objectives_Nehzat_subject_areas_SubjectAreaId",
                        column: x => x.SubjectAreaId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_subject_areas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_coach_courses",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CoachId = table.Column<int>(type: "int", nullable: false),
                    CourseId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_coach_courses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_coach_courses_Nehzat_coaches_CoachId",
                        column: x => x.CoachId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_coaches",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Nehzat_coach_courses_Nehzat_courses_CourseId",
                        column: x => x.CourseId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_courses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_parent_students",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ParentId = table.Column<int>(type: "int", nullable: false),
                    StudentId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_parent_students", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_parent_students_Nehzat_parents_ParentId",
                        column: x => x.ParentId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_parents",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Nehzat_parent_students_Nehzat_students_StudentId",
                        column: x => x.StudentId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_students",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_student_courses",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EnrollmentDate = table.Column<DateTime>(type: "date", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    FinalGrade = table.Column<int>(type: "int", nullable: true),
                    LetterGrade = table.Column<string>(type: "nvarchar(2)", nullable: true),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    StudentId = table.Column<int>(type: "int", nullable: false),
                    CourseId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_student_courses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_student_courses_Nehzat_courses_CourseId",
                        column: x => x.CourseId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_courses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Nehzat_student_courses_Nehzat_students_StudentId",
                        column: x => x.StudentId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_students",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_student_path_selections",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StudentId = table.Column<int>(type: "int", nullable: false),
                    HijriSelectionYear = table.Column<int>(type: "int", nullable: false),
                    Stage = table.Column<string>(type: "nvarchar(20)", nullable: false),
                    FinalizedPathId = table.Column<int>(type: "int", nullable: true),
                    SelectedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FinalizedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_student_path_selections", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_student_path_selections_Nehzat_spiritual_paths_FinalizedPathId",
                        column: x => x.FinalizedPathId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_spiritual_paths",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Nehzat_student_path_selections_Nehzat_students_StudentId",
                        column: x => x.StudentId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_students",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_users",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Username = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    OidcSubject = table.Column<string>(type: "nvarchar(255)", nullable: true),
                    FirstName = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    LastName = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(20)", nullable: true),
                    ImageUrl = table.Column<string>(type: "nvarchar(255)", nullable: true),
                    StudentId = table.Column<int>(type: "int", nullable: true),
                    ApprovalStatus = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    UserType = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_users", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_users_Nehzat_students_StudentId",
                        column: x => x.StudentId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_students",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_quran_curricula",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(200)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1000)", nullable: false),
                    Language = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    StartSurah = table.Column<int>(type: "int", nullable: false),
                    EndSurah = table.Column<int>(type: "int", nullable: false),
                    TotalAyahs = table.Column<int>(type: "int", nullable: false),
                    EstimatedDays = table.Column<int>(type: "int", nullable: false),
                    DifficultyLevel = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    LearningObjectives = table.Column<string>(type: "text", nullable: false),
                    TeacherId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_quran_curricula", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_quran_curricula_Nehzat_teachers_TeacherId",
                        column: x => x.TeacherId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_teachers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_teacher_courses",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TeacherId = table.Column<int>(type: "int", nullable: false),
                    CourseId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_teacher_courses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_teacher_courses_Nehzat_courses_CourseId",
                        column: x => x.CourseId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_courses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Nehzat_teacher_courses_Nehzat_teachers_TeacherId",
                        column: x => x.TeacherId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_teachers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_competition_participants",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompetitionId = table.Column<int>(type: "int", nullable: false),
                    StudentId = table.Column<int>(type: "int", nullable: false),
                    Score = table.Column<decimal>(type: "decimal(5,2)", nullable: true),
                    Rank = table.Column<int>(type: "int", nullable: true),
                    CompletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_competition_participants", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_competition_participants_Nehzat_competitions_CompetitionId",
                        column: x => x.CompetitionId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_competitions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Nehzat_competition_participants_Nehzat_students_StudentId",
                        column: x => x.StudentId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_students",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_league_rankings",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    LeagueId = table.Column<int>(type: "int", nullable: false),
                    StudentId = table.Column<int>(type: "int", nullable: false),
                    Score = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    Rank = table.Column<int>(type: "int", nullable: false),
                    PreviousRank = table.Column<int>(type: "int", nullable: true),
                    Trend = table.Column<string>(type: "nvarchar(10)", nullable: false),
                    LastUpdated = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_league_rankings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_league_rankings_Nehzat_leagues_LeagueId",
                        column: x => x.LeagueId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_leagues",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Nehzat_league_rankings_Nehzat_students_StudentId",
                        column: x => x.StudentId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_students",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_evaluator_madrasahs",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EvaluatorId = table.Column<int>(type: "int", nullable: false),
                    MadrasahId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_evaluator_madrasahs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_evaluator_madrasahs_Nehzat_evaluators_EvaluatorId",
                        column: x => x.EvaluatorId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_evaluators",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Nehzat_evaluator_madrasahs_Nehzat_madrasahs_MadrasahId",
                        column: x => x.MadrasahId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_madrasahs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_madrasah_branches",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(200)", nullable: false),
                    Province = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    City = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    Address = table.Column<string>(type: "nvarchar(300)", nullable: true),
                    Phone = table.Column<string>(type: "nvarchar(20)", nullable: true),
                    Capacity = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    MadrasahId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_madrasah_branches", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_madrasah_branches_Nehzat_madrasahs_MadrasahId",
                        column: x => x.MadrasahId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_madrasahs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_rings",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Key = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    MadrasahId = table.Column<int>(type: "int", nullable: false),
                    CoachId = table.Column<int>(type: "int", nullable: true),
                    CourseId = table.Column<int>(type: "int", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    Gender = table.Column<string>(type: "nvarchar(50)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_rings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_rings_Nehzat_madrasahs_MadrasahId",
                        column: x => x.MadrasahId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_madrasahs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_assignments",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(200)", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    MaxScore = table.Column<int>(type: "int", nullable: false),
                    AssignmentDate = table.Column<DateTime>(type: "date", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    Instructions = table.Column<string>(type: "text", nullable: true),
                    ObjectiveId = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CourseId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_assignments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_assignments_Nehzat_courses_CourseId",
                        column: x => x.CourseId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_courses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Nehzat_assignments_Nehzat_curriculum_objectives_ObjectiveId",
                        column: x => x.ObjectiveId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_curriculum_objectives",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_student_path_rankings",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SelectionId = table.Column<int>(type: "int", nullable: false),
                    PathId = table.Column<int>(type: "int", nullable: false),
                    RankOrdinal = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_student_path_rankings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_student_path_rankings_Nehzat_spiritual_paths_PathId",
                        column: x => x.PathId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_spiritual_paths",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Nehzat_student_path_rankings_Nehzat_student_path_selections_SelectionId",
                        column: x => x.SelectionId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_student_path_selections",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_assessments",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(200)", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    MaxScore = table.Column<int>(type: "int", nullable: false),
                    DurationMinutes = table.Column<int>(type: "int", nullable: false),
                    AssessmentDate = table.Column<DateTime>(type: "date", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    Instructions = table.Column<string>(type: "text", nullable: true),
                    CourseId = table.Column<int>(type: "int", nullable: false),
                    GeneratedByUserId = table.Column<int>(type: "int", nullable: true),
                    GenerationCriteria = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_assessments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_assessments_Nehzat_courses_CourseId",
                        column: x => x.CourseId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_courses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Nehzat_assessments_Nehzat_users_GeneratedByUserId",
                        column: x => x.GeneratedByUserId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_daily_spiritual_entries",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    EntryDate = table.Column<DateTime>(type: "date", nullable: false),
                    MoodScore = table.Column<int>(type: "int", nullable: true),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    CompletedSteps = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_daily_spiritual_entries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_daily_spiritual_entries_Nehzat_users_UserId",
                        column: x => x.UserId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_issue_surveys",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(200)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1000)", nullable: false),
                    SurveyType = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    TargetRole = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(20)", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsAnonymous = table.Column<bool>(type: "bit", nullable: false),
                    MinScoreLabel = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    MaxScoreLabel = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    ScoreScaleMin = table.Column<int>(type: "int", nullable: false),
                    ScoreScaleMax = table.Column<int>(type: "int", nullable: false),
                    CreatedById = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_issue_surveys", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_issue_surveys_Nehzat_users_CreatedById",
                        column: x => x.CreatedById,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_monthly_booklets",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StudentId = table.Column<int>(type: "int", nullable: false),
                    Month = table.Column<int>(type: "int", nullable: false),
                    Year = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(20)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedByUserId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_monthly_booklets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_monthly_booklets_Nehzat_students_StudentId",
                        column: x => x.StudentId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_students",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Nehzat_monthly_booklets_Nehzat_users_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_student_path_history",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StudentId = table.Column<int>(type: "int", nullable: false),
                    ChangedByUserId = table.Column<int>(type: "int", nullable: false),
                    PreviousStage = table.Column<string>(type: "nvarchar(20)", nullable: true),
                    NewStage = table.Column<string>(type: "nvarchar(20)", nullable: true),
                    PreviousFinalizedPathId = table.Column<int>(type: "int", nullable: true),
                    NewFinalizedPathId = table.Column<int>(type: "int", nullable: true),
                    Reason = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    ChangedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_student_path_history", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_student_path_history_Nehzat_students_StudentId",
                        column: x => x.StudentId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_students",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Nehzat_student_path_history_Nehzat_users_ChangedByUserId",
                        column: x => x.ChangedByUserId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_user_occasion_progress",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    OccasionId = table.Column<int>(type: "int", nullable: false),
                    PracticeItemId = table.Column<int>(type: "int", nullable: false),
                    HijriYear = table.Column<int>(type: "int", nullable: false),
                    IsCompleted = table.Column<bool>(type: "bit", nullable: false),
                    CompletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_user_occasion_progress", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_user_occasion_progress_Nehzat_spiritual_occasions_OccasionId",
                        column: x => x.OccasionId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_spiritual_occasions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Nehzat_user_occasion_progress_Nehzat_spiritual_practice_items_PracticeItemId",
                        column: x => x.PracticeItemId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_spiritual_practice_items",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Nehzat_user_occasion_progress_Nehzat_users_UserId",
                        column: x => x.UserId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_quran_surahs",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Number = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", nullable: false),
                    TranslatedName = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    RevelationPlace = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    RevelationOrder = table.Column<int>(type: "int", nullable: false),
                    TotalAyahs = table.Column<int>(type: "int", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(20)", nullable: false),
                    Bismillah = table.Column<string>(type: "text", nullable: false),
                    HizbBegin = table.Column<int>(type: "int", nullable: false),
                    HizbEnd = table.Column<int>(type: "int", nullable: false),
                    JuzBegin = table.Column<int>(type: "int", nullable: false),
                    JuzEnd = table.Column<int>(type: "int", nullable: false),
                    Ruqyah = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    Summary = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    QuranCurriculumId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_quran_surahs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_quran_surahs_Nehzat_quran_curricula_QuranCurriculumId",
                        column: x => x.QuranCurriculumId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_quran_curricula",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_maktab_sub_sections",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Key = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", nullable: false),
                    Level = table.Column<string>(type: "nvarchar(20)", nullable: true),
                    MadrasahBranchId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_maktab_sub_sections", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_maktab_sub_sections_Nehzat_madrasah_branches_MadrasahBranchId",
                        column: x => x.MadrasahBranchId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_madrasah_branches",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_ring_books",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RingId = table.Column<int>(type: "int", nullable: false),
                    BookId = table.Column<int>(type: "int", nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_ring_books", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_ring_books_Nehzat_books_BookId",
                        column: x => x.BookId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_books",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Nehzat_ring_books_Nehzat_rings_RingId",
                        column: x => x.RingId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_rings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_ring_students",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RingId = table.Column<int>(type: "int", nullable: false),
                    StudentId = table.Column<int>(type: "int", nullable: false),
                    JoinedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(50)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_ring_students", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_ring_students_Nehzat_rings_RingId",
                        column: x => x.RingId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_rings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_ring_teaching_methods",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RingId = table.Column<int>(type: "int", nullable: false),
                    TeachingMethodId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_ring_teaching_methods", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_ring_teaching_methods_Nehzat_rings_RingId",
                        column: x => x.RingId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_rings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Nehzat_ring_teaching_methods_Nehzat_teaching_methods_TeachingMethodId",
                        column: x => x.TeachingMethodId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_teaching_methods",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_student_skill_progress",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StudentId = table.Column<int>(type: "int", nullable: false),
                    ObjectiveId = table.Column<int>(type: "int", nullable: false),
                    RingId = table.Column<int>(type: "int", nullable: true),
                    ProficiencyLevel = table.Column<string>(type: "nvarchar(20)", nullable: false),
                    Score = table.Column<int>(type: "int", nullable: false),
                    LastAssessedAt = table.Column<DateTime>(type: "date", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_student_skill_progress", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_student_skill_progress_Nehzat_curriculum_objectives_ObjectiveId",
                        column: x => x.ObjectiveId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_curriculum_objectives",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Nehzat_student_skill_progress_Nehzat_rings_RingId",
                        column: x => x.RingId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_rings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Nehzat_student_skill_progress_Nehzat_students_StudentId",
                        column: x => x.StudentId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_students",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_assignment_attachments",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(200)", nullable: true),
                    Description = table.Column<string>(type: "text", nullable: true),
                    Kind = table.Column<string>(type: "nvarchar(20)", nullable: false),
                    Url = table.Column<string>(type: "nvarchar(255)", nullable: false),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AssignmentId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_assignment_attachments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_assignment_attachments_Nehzat_assignments_AssignmentId",
                        column: x => x.AssignmentId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_assignments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_assignment_submissions",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SubmissionDate = table.Column<DateTime>(type: "date", nullable: false),
                    DailyScore = table.Column<int>(type: "int", nullable: false),
                    CumulativeScore = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    Feedback = table.Column<string>(type: "text", nullable: true),
                    AudioFileUrl = table.Column<string>(type: "nvarchar(255)", nullable: true),
                    DocumentUrl = table.Column<string>(type: "nvarchar(255)", nullable: true),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    IsCompleted = table.Column<bool>(type: "bit", nullable: false),
                    TimeSpent = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    StudentId = table.Column<int>(type: "int", nullable: false),
                    AssignmentId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_assignment_submissions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_assignment_submissions_Nehzat_assignments_AssignmentId",
                        column: x => x.AssignmentId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_assignments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Nehzat_assignment_submissions_Nehzat_students_StudentId",
                        column: x => x.StudentId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_students",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_assessment_questions",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Type = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    QuestionText = table.Column<string>(type: "text", nullable: false),
                    OptionsJson = table.Column<string>(type: "text", nullable: true),
                    CorrectAnswerJson = table.Column<string>(type: "text", nullable: true),
                    Points = table.Column<int>(type: "int", nullable: false),
                    Order = table.Column<int>(type: "int", nullable: false),
                    Difficulty = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    Topic = table.Column<string>(type: "nvarchar(200)", nullable: true),
                    Explanation = table.Column<string>(type: "text", nullable: true),
                    AssessmentId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_assessment_questions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_assessment_questions_Nehzat_assessments_AssessmentId",
                        column: x => x.AssessmentId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_assessments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_assessment_results",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompletedAt = table.Column<DateTime>(type: "date", nullable: false),
                    Score = table.Column<int>(type: "int", nullable: false),
                    MaxPossibleScore = table.Column<int>(type: "int", nullable: false),
                    Percentage = table.Column<double>(type: "float", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    AnswersJson = table.Column<string>(type: "text", nullable: true),
                    Feedback = table.Column<string>(type: "text", nullable: true),
                    TimeSpentMinutes = table.Column<int>(type: "int", nullable: false),
                    AssessmentId = table.Column<int>(type: "int", nullable: false),
                    StudentId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_assessment_results", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_assessment_results_Nehzat_assessments_AssessmentId",
                        column: x => x.AssessmentId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_assessments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Nehzat_assessment_results_Nehzat_students_StudentId",
                        column: x => x.StudentId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_students",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_issue_survey_comments",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SurveyId = table.Column<int>(type: "int", nullable: false),
                    RespondentId = table.Column<int>(type: "int", nullable: true),
                    Comment = table.Column<string>(type: "nvarchar(2000)", nullable: false),
                    IsPublic = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_issue_survey_comments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_issue_survey_comments_Nehzat_issue_surveys_SurveyId",
                        column: x => x.SurveyId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_issue_surveys",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Nehzat_issue_survey_comments_Nehzat_users_RespondentId",
                        column: x => x.RespondentId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_issue_survey_questions",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SurveyId = table.Column<int>(type: "int", nullable: false),
                    ItemPoolId = table.Column<int>(type: "int", nullable: true),
                    QuestionText = table.Column<string>(type: "nvarchar(500)", nullable: false),
                    Category = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    SubCategory = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    TargetAudience = table.Column<string>(type: "nvarchar(50)", nullable: true),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_issue_survey_questions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_issue_survey_questions_Nehzat_issue_item_pool_ItemPoolId",
                        column: x => x.ItemPoolId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_issue_item_pool",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Nehzat_issue_survey_questions_Nehzat_issue_surveys_SurveyId",
                        column: x => x.SurveyId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_issue_surveys",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_quran_ayahs",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SurahId = table.Column<int>(type: "int", nullable: false),
                    VerseNumber = table.Column<int>(type: "int", nullable: false),
                    Text = table.Column<string>(type: "nvarchar(500)", nullable: false),
                    Translation = table.Column<string>(type: "nvarchar(500)", nullable: false),
                    Transliteration = table.Column<string>(type: "nvarchar(1000)", nullable: false),
                    Footnote = table.Column<string>(type: "nvarchar(500)", nullable: false),
                    Ruku = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    Sajda = table.Column<string>(type: "nvarchar(20)", nullable: false),
                    AyaNumber = table.Column<int>(type: "int", nullable: false),
                    Juz = table.Column<string>(type: "nvarchar(10)", nullable: false),
                    HizbQuarter = table.Column<string>(type: "nvarchar(10)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_quran_ayahs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_quran_ayahs_Nehzat_quran_surahs_SurahId",
                        column: x => x.SurahId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_quran_surahs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_quran_student_courses",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StudentId = table.Column<int>(type: "int", nullable: false),
                    CourseId = table.Column<int>(type: "int", nullable: false),
                    SurahId = table.Column<int>(type: "int", nullable: false),
                    CurrentPage = table.Column<int>(type: "int", nullable: false),
                    CurrentAyah = table.Column<int>(type: "int", nullable: false),
                    RecitationLevelId = table.Column<int>(type: "int", nullable: false),
                    EnrolledDate = table.Column<DateTime>(type: "date", nullable: false),
                    CompletionDate = table.Column<DateTime>(type: "date", nullable: true),
                    Grade = table.Column<int>(type: "int", nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_quran_student_courses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_quran_student_courses_Nehzat_courses_CourseId",
                        column: x => x.CourseId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_courses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Nehzat_quran_student_courses_Nehzat_quran_recitation_levels_RecitationLevelId",
                        column: x => x.RecitationLevelId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_quran_recitation_levels",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Nehzat_quran_student_courses_Nehzat_quran_surahs_SurahId",
                        column: x => x.SurahId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_quran_surahs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Nehzat_quran_student_courses_Nehzat_students_StudentId",
                        column: x => x.StudentId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_students",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_quran_student_progress",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StudentId = table.Column<int>(type: "int", nullable: false),
                    SurahId = table.Column<int>(type: "int", nullable: false),
                    AyahNumber = table.Column<int>(type: "int", nullable: false),
                    SurahProgress = table.Column<int>(type: "int", nullable: false),
                    TotalSurahs = table.Column<int>(type: "int", nullable: false),
                    Percentage = table.Column<int>(type: "int", nullable: false),
                    ProgressDate = table.Column<DateTime>(type: "date", nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_quran_student_progress", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_quran_student_progress_Nehzat_quran_surahs_SurahId",
                        column: x => x.SurahId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_quran_surahs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Nehzat_quran_student_progress_Nehzat_students_StudentId",
                        column: x => x.StudentId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_students",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_quran_tajweed_rules",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RuleCode = table.Column<string>(type: "nvarchar(20)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1000)", nullable: false),
                    ExampleText = table.Column<string>(type: "nvarchar(500)", nullable: false),
                    RuleLevel = table.Column<int>(type: "int", nullable: false),
                    AffectedRecitationType = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    Guidelines = table.Column<string>(type: "text", nullable: false),
                    SurahId = table.Column<int>(type: "int", nullable: false),
                    AyahNumber = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_quran_tajweed_rules", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_quran_tajweed_rules_Nehzat_quran_surahs_SurahId",
                        column: x => x.SurahId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_quran_surahs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_assignment_gradings",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SubmissionId = table.Column<int>(type: "int", nullable: false),
                    TeacherId = table.Column<int>(type: "int", nullable: false),
                    DailyScore = table.Column<decimal>(type: "decimal(5,2)", nullable: true),
                    CumulativeScore = table.Column<decimal>(type: "decimal(5,2)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(20)", nullable: true),
                    Feedback = table.Column<string>(type: "text", nullable: true),
                    GradedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_assignment_gradings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_assignment_gradings_Nehzat_assignment_submissions_SubmissionId",
                        column: x => x.SubmissionId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_assignment_submissions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Nehzat_assignment_gradings_Nehzat_teachers_TeacherId",
                        column: x => x.TeacherId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_teachers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_issue_actions",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SurveyId = table.Column<int>(type: "int", nullable: false),
                    QuestionId = table.Column<int>(type: "int", nullable: true),
                    Category = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(300)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(2000)", nullable: false),
                    Priority = table.Column<string>(type: "nvarchar(20)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(20)", nullable: false),
                    AssignedToId = table.Column<int>(type: "int", nullable: true),
                    AssignedTeam = table.Column<string>(type: "nvarchar(200)", nullable: true),
                    TargetDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CompletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    KpiDefinition = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_issue_actions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_issue_actions_Nehzat_issue_survey_questions_QuestionId",
                        column: x => x.QuestionId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_issue_survey_questions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Nehzat_issue_actions_Nehzat_issue_surveys_SurveyId",
                        column: x => x.SurveyId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_issue_surveys",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Nehzat_issue_actions_Nehzat_users_AssignedToId",
                        column: x => x.AssignedToId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_issue_survey_responses",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SurveyId = table.Column<int>(type: "int", nullable: false),
                    QuestionId = table.Column<int>(type: "int", nullable: false),
                    RespondentId = table.Column<int>(type: "int", nullable: true),
                    RespondentRole = table.Column<string>(type: "nvarchar(50)", nullable: true),
                    RespondentBranchId = table.Column<int>(type: "int", nullable: true),
                    Score = table.Column<int>(type: "int", nullable: false),
                    AnsweredAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_issue_survey_responses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_issue_survey_responses_Nehzat_branches_RespondentBranchId",
                        column: x => x.RespondentBranchId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_branches",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Nehzat_issue_survey_responses_Nehzat_issue_survey_questions_QuestionId",
                        column: x => x.QuestionId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_issue_survey_questions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Nehzat_issue_survey_responses_Nehzat_issue_surveys_SurveyId",
                        column: x => x.SurveyId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_issue_surveys",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Nehzat_issue_survey_responses_Nehzat_users_RespondentId",
                        column: x => x.RespondentId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_issue_action_updates",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ActionId = table.Column<int>(type: "int", nullable: false),
                    UpdatedById = table.Column<int>(type: "int", nullable: false),
                    PreviousStatus = table.Column<string>(type: "nvarchar(20)", nullable: false),
                    NewStatus = table.Column<string>(type: "nvarchar(20)", nullable: false),
                    Note = table.Column<string>(type: "nvarchar(1000)", nullable: false),
                    ProgressPercent = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_issue_action_updates", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_issue_action_updates_Nehzat_issue_actions_ActionId",
                        column: x => x.ActionId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_issue_actions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Nehzat_issue_action_updates_Nehzat_users_UpdatedById",
                        column: x => x.UpdatedById,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_age_groups_Key",
                schema: "nehzat",
                table: "Nehzat_age_groups",
                column: "Key",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_assessment_questions_AssessmentId",
                schema: "nehzat",
                table: "Nehzat_assessment_questions",
                column: "AssessmentId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_assessment_questions_Difficulty",
                schema: "nehzat",
                table: "Nehzat_assessment_questions",
                column: "Difficulty");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_assessment_questions_Topic",
                schema: "nehzat",
                table: "Nehzat_assessment_questions",
                column: "Topic");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_assessment_results_AssessmentId",
                schema: "nehzat",
                table: "Nehzat_assessment_results",
                column: "AssessmentId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_assessment_results_CompletedAt",
                schema: "nehzat",
                table: "Nehzat_assessment_results",
                column: "CompletedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_assessment_results_StudentId",
                schema: "nehzat",
                table: "Nehzat_assessment_results",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_assessments_AssessmentDate",
                schema: "nehzat",
                table: "Nehzat_assessments",
                column: "AssessmentDate");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_assessments_CourseId",
                schema: "nehzat",
                table: "Nehzat_assessments",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_assessments_GeneratedByUserId",
                schema: "nehzat",
                table: "Nehzat_assessments",
                column: "GeneratedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_assessments_Status",
                schema: "nehzat",
                table: "Nehzat_assessments",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_assignment_attachments_AssignmentId",
                schema: "nehzat",
                table: "Nehzat_assignment_attachments",
                column: "AssignmentId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_assignment_gradings_SubmissionId",
                schema: "nehzat",
                table: "Nehzat_assignment_gradings",
                column: "SubmissionId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_assignment_gradings_TeacherId",
                schema: "nehzat",
                table: "Nehzat_assignment_gradings",
                column: "TeacherId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_assignment_submissions_AssignmentId",
                schema: "nehzat",
                table: "Nehzat_assignment_submissions",
                column: "AssignmentId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_assignment_submissions_StudentId",
                schema: "nehzat",
                table: "Nehzat_assignment_submissions",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_assignments_CourseId",
                schema: "nehzat",
                table: "Nehzat_assignments",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_assignments_ObjectiveId",
                schema: "nehzat",
                table: "Nehzat_assignments",
                column: "ObjectiveId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_books_Key",
                schema: "nehzat",
                table: "Nehzat_books",
                column: "Key",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_books_SubjectAreaId",
                schema: "nehzat",
                table: "Nehzat_books",
                column: "SubjectAreaId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_branch_managers_BranchId",
                schema: "nehzat",
                table: "Nehzat_branch_managers",
                column: "BranchId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_branch_managers_Email",
                schema: "nehzat",
                table: "Nehzat_branch_managers",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_branch_managers_Username",
                schema: "nehzat",
                table: "Nehzat_branch_managers",
                column: "Username",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_branches_Name",
                schema: "nehzat",
                table: "Nehzat_branches",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_coach_courses_CoachId",
                schema: "nehzat",
                table: "Nehzat_coach_courses",
                column: "CoachId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_coach_courses_CourseId",
                schema: "nehzat",
                table: "Nehzat_coach_courses",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_coaches_BranchId",
                schema: "nehzat",
                table: "Nehzat_coaches",
                column: "BranchId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_coaches_Email",
                schema: "nehzat",
                table: "Nehzat_coaches",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_coaches_Username",
                schema: "nehzat",
                table: "Nehzat_coaches",
                column: "Username",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_competition_participants_CompetitionId_StudentId",
                schema: "nehzat",
                table: "Nehzat_competition_participants",
                columns: new[] { "CompetitionId", "StudentId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_competition_participants_StudentId",
                schema: "nehzat",
                table: "Nehzat_competition_participants",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_competitions_CourseId",
                schema: "nehzat",
                table: "Nehzat_competitions",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_competitions_Title",
                schema: "nehzat",
                table: "Nehzat_competitions",
                column: "Title");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_curriculum_objectives_Key",
                schema: "nehzat",
                table: "Nehzat_curriculum_objectives",
                column: "Key",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_curriculum_objectives_ParentObjectiveId",
                schema: "nehzat",
                table: "Nehzat_curriculum_objectives",
                column: "ParentObjectiveId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_curriculum_objectives_SubjectAreaId",
                schema: "nehzat",
                table: "Nehzat_curriculum_objectives",
                column: "SubjectAreaId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_daily_spiritual_entries_UserId_EntryDate",
                schema: "nehzat",
                table: "Nehzat_daily_spiritual_entries",
                columns: new[] { "UserId", "EntryDate" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_evaluator_madrasahs_EvaluatorId_MadrasahId",
                schema: "nehzat",
                table: "Nehzat_evaluator_madrasahs",
                columns: new[] { "EvaluatorId", "MadrasahId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_evaluator_madrasahs_MadrasahId",
                schema: "nehzat",
                table: "Nehzat_evaluator_madrasahs",
                column: "MadrasahId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_evaluators_BranchId",
                schema: "nehzat",
                table: "Nehzat_evaluators",
                column: "BranchId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_evaluators_Email",
                schema: "nehzat",
                table: "Nehzat_evaluators",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_evaluators_Username",
                schema: "nehzat",
                table: "Nehzat_evaluators",
                column: "Username",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_issue_action_updates_ActionId",
                schema: "nehzat",
                table: "Nehzat_issue_action_updates",
                column: "ActionId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_issue_action_updates_UpdatedById",
                schema: "nehzat",
                table: "Nehzat_issue_action_updates",
                column: "UpdatedById");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_issue_actions_AssignedToId",
                schema: "nehzat",
                table: "Nehzat_issue_actions",
                column: "AssignedToId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_issue_actions_Priority",
                schema: "nehzat",
                table: "Nehzat_issue_actions",
                column: "Priority");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_issue_actions_QuestionId",
                schema: "nehzat",
                table: "Nehzat_issue_actions",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_issue_actions_Status",
                schema: "nehzat",
                table: "Nehzat_issue_actions",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_issue_actions_SurveyId",
                schema: "nehzat",
                table: "Nehzat_issue_actions",
                column: "SurveyId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_issue_item_pool_Category",
                schema: "nehzat",
                table: "Nehzat_issue_item_pool",
                column: "Category");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_issue_item_pool_IsActive",
                schema: "nehzat",
                table: "Nehzat_issue_item_pool",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_issue_survey_comments_RespondentId",
                schema: "nehzat",
                table: "Nehzat_issue_survey_comments",
                column: "RespondentId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_issue_survey_comments_SurveyId",
                schema: "nehzat",
                table: "Nehzat_issue_survey_comments",
                column: "SurveyId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_issue_survey_questions_Category",
                schema: "nehzat",
                table: "Nehzat_issue_survey_questions",
                column: "Category");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_issue_survey_questions_ItemPoolId",
                schema: "nehzat",
                table: "Nehzat_issue_survey_questions",
                column: "ItemPoolId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_issue_survey_questions_SurveyId",
                schema: "nehzat",
                table: "Nehzat_issue_survey_questions",
                column: "SurveyId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_issue_survey_responses_AnsweredAt",
                schema: "nehzat",
                table: "Nehzat_issue_survey_responses",
                column: "AnsweredAt");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_issue_survey_responses_QuestionId",
                schema: "nehzat",
                table: "Nehzat_issue_survey_responses",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_issue_survey_responses_RespondentBranchId",
                schema: "nehzat",
                table: "Nehzat_issue_survey_responses",
                column: "RespondentBranchId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_issue_survey_responses_RespondentId",
                schema: "nehzat",
                table: "Nehzat_issue_survey_responses",
                column: "RespondentId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_issue_survey_responses_SurveyId_QuestionId_RespondentId",
                schema: "nehzat",
                table: "Nehzat_issue_survey_responses",
                columns: new[] { "SurveyId", "QuestionId", "RespondentId" },
                unique: true,
                filter: "[RespondentId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_issue_surveys_CreatedById",
                schema: "nehzat",
                table: "Nehzat_issue_surveys",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_issue_surveys_EndDate",
                schema: "nehzat",
                table: "Nehzat_issue_surveys",
                column: "EndDate");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_issue_surveys_StartDate",
                schema: "nehzat",
                table: "Nehzat_issue_surveys",
                column: "StartDate");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_issue_surveys_Status",
                schema: "nehzat",
                table: "Nehzat_issue_surveys",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_league_rankings_LeagueId_StudentId",
                schema: "nehzat",
                table: "Nehzat_league_rankings",
                columns: new[] { "LeagueId", "StudentId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_league_rankings_StudentId",
                schema: "nehzat",
                table: "Nehzat_league_rankings",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_leagues_CourseId",
                schema: "nehzat",
                table: "Nehzat_leagues",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_leagues_Name",
                schema: "nehzat",
                table: "Nehzat_leagues",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_madrasah_branches_MadrasahId",
                schema: "nehzat",
                table: "Nehzat_madrasah_branches",
                column: "MadrasahId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_madrasahs_Key",
                schema: "nehzat",
                table: "Nehzat_madrasahs",
                column: "Key",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_madrasahs_SectionId",
                schema: "nehzat",
                table: "Nehzat_madrasahs",
                column: "SectionId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_maktab_sub_sections_MadrasahBranchId",
                schema: "nehzat",
                table: "Nehzat_maktab_sub_sections",
                column: "MadrasahBranchId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_monthly_booklets_CreatedByUserId",
                schema: "nehzat",
                table: "Nehzat_monthly_booklets",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_monthly_booklets_StudentId_Year_Month",
                schema: "nehzat",
                table: "Nehzat_monthly_booklets",
                columns: new[] { "StudentId", "Year", "Month" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_nehzat_sections_Key",
                schema: "nehzat",
                table: "Nehzat_nehzat_sections",
                column: "Key",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_nehzat_sections_ParentSectionId",
                schema: "nehzat",
                table: "Nehzat_nehzat_sections",
                column: "ParentSectionId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_parent_students_ParentId_StudentId",
                schema: "nehzat",
                table: "Nehzat_parent_students",
                columns: new[] { "ParentId", "StudentId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_parent_students_StudentId",
                schema: "nehzat",
                table: "Nehzat_parent_students",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_parents_BranchId",
                schema: "nehzat",
                table: "Nehzat_parents",
                column: "BranchId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_parents_Email",
                schema: "nehzat",
                table: "Nehzat_parents",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_parents_Username",
                schema: "nehzat",
                table: "Nehzat_parents",
                column: "Username",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_quran_ayahs_SurahId_VerseNumber",
                schema: "nehzat",
                table: "Nehzat_quran_ayahs",
                columns: new[] { "SurahId", "VerseNumber" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_quran_curricula_TeacherId",
                schema: "nehzat",
                table: "Nehzat_quran_curricula",
                column: "TeacherId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_quran_recitation_levels_LevelNumber",
                schema: "nehzat",
                table: "Nehzat_quran_recitation_levels",
                column: "LevelNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_quran_student_courses_CourseId",
                schema: "nehzat",
                table: "Nehzat_quran_student_courses",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_quran_student_courses_RecitationLevelId",
                schema: "nehzat",
                table: "Nehzat_quran_student_courses",
                column: "RecitationLevelId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_quran_student_courses_StudentId",
                schema: "nehzat",
                table: "Nehzat_quran_student_courses",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_quran_student_courses_SurahId",
                schema: "nehzat",
                table: "Nehzat_quran_student_courses",
                column: "SurahId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_quran_student_progress_StudentId_SurahId",
                schema: "nehzat",
                table: "Nehzat_quran_student_progress",
                columns: new[] { "StudentId", "SurahId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_quran_student_progress_SurahId",
                schema: "nehzat",
                table: "Nehzat_quran_student_progress",
                column: "SurahId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_quran_surahs_Number",
                schema: "nehzat",
                table: "Nehzat_quran_surahs",
                column: "Number",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_quran_surahs_QuranCurriculumId",
                schema: "nehzat",
                table: "Nehzat_quran_surahs",
                column: "QuranCurriculumId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_quran_tajweed_rules_RuleCode",
                schema: "nehzat",
                table: "Nehzat_quran_tajweed_rules",
                column: "RuleCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_quran_tajweed_rules_SurahId",
                schema: "nehzat",
                table: "Nehzat_quran_tajweed_rules",
                column: "SurahId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_ring_books_BookId",
                schema: "nehzat",
                table: "Nehzat_ring_books",
                column: "BookId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_ring_books_RingId_BookId",
                schema: "nehzat",
                table: "Nehzat_ring_books",
                columns: new[] { "RingId", "BookId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_ring_students_RingId_StudentId",
                schema: "nehzat",
                table: "Nehzat_ring_students",
                columns: new[] { "RingId", "StudentId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_ring_teaching_methods_RingId_TeachingMethodId",
                schema: "nehzat",
                table: "Nehzat_ring_teaching_methods",
                columns: new[] { "RingId", "TeachingMethodId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_ring_teaching_methods_TeachingMethodId",
                schema: "nehzat",
                table: "Nehzat_ring_teaching_methods",
                column: "TeachingMethodId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_rings_Key",
                schema: "nehzat",
                table: "Nehzat_rings",
                column: "Key",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_rings_MadrasahId",
                schema: "nehzat",
                table: "Nehzat_rings",
                column: "MadrasahId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_spiritual_occasion_practices_OccasionId_PracticeItemId",
                schema: "nehzat",
                table: "Nehzat_spiritual_occasion_practices",
                columns: new[] { "OccasionId", "PracticeItemId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_spiritual_occasion_practices_PracticeItemId",
                schema: "nehzat",
                table: "Nehzat_spiritual_occasion_practices",
                column: "PracticeItemId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_spiritual_occasions_Key",
                schema: "nehzat",
                table: "Nehzat_spiritual_occasions",
                column: "Key",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_spiritual_paths_Key",
                schema: "nehzat",
                table: "Nehzat_spiritual_paths",
                column: "Key",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_spiritual_practice_items_Key",
                schema: "nehzat",
                table: "Nehzat_spiritual_practice_items",
                column: "Key",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_student_courses_CourseId",
                schema: "nehzat",
                table: "Nehzat_student_courses",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_student_courses_StudentId",
                schema: "nehzat",
                table: "Nehzat_student_courses",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_student_path_history_ChangedByUserId",
                schema: "nehzat",
                table: "Nehzat_student_path_history",
                column: "ChangedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_student_path_history_StudentId",
                schema: "nehzat",
                table: "Nehzat_student_path_history",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_student_path_rankings_PathId",
                schema: "nehzat",
                table: "Nehzat_student_path_rankings",
                column: "PathId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_student_path_rankings_SelectionId_PathId",
                schema: "nehzat",
                table: "Nehzat_student_path_rankings",
                columns: new[] { "SelectionId", "PathId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_student_path_selections_FinalizedPathId",
                schema: "nehzat",
                table: "Nehzat_student_path_selections",
                column: "FinalizedPathId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_student_path_selections_StudentId",
                schema: "nehzat",
                table: "Nehzat_student_path_selections",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_student_skill_progress_ObjectiveId",
                schema: "nehzat",
                table: "Nehzat_student_skill_progress",
                column: "ObjectiveId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_student_skill_progress_RingId",
                schema: "nehzat",
                table: "Nehzat_student_skill_progress",
                column: "RingId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_student_skill_progress_StudentId_ObjectiveId",
                schema: "nehzat",
                table: "Nehzat_student_skill_progress",
                columns: new[] { "StudentId", "ObjectiveId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_students_BranchId",
                schema: "nehzat",
                table: "Nehzat_students",
                column: "BranchId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_students_Email",
                schema: "nehzat",
                table: "Nehzat_students",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_students_StudentId",
                schema: "nehzat",
                table: "Nehzat_students",
                column: "StudentId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_subject_areas_Key",
                schema: "nehzat",
                table: "Nehzat_subject_areas",
                column: "Key",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_teacher_courses_CourseId",
                schema: "nehzat",
                table: "Nehzat_teacher_courses",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_teacher_courses_TeacherId_CourseId",
                schema: "nehzat",
                table: "Nehzat_teacher_courses",
                columns: new[] { "TeacherId", "CourseId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_teachers_BranchId",
                schema: "nehzat",
                table: "Nehzat_teachers",
                column: "BranchId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_teachers_Email",
                schema: "nehzat",
                table: "Nehzat_teachers",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_teachers_Username",
                schema: "nehzat",
                table: "Nehzat_teachers",
                column: "Username",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_teaching_methods_Key",
                schema: "nehzat",
                table: "Nehzat_teaching_methods",
                column: "Key",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_user_occasion_progress_OccasionId",
                schema: "nehzat",
                table: "Nehzat_user_occasion_progress",
                column: "OccasionId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_user_occasion_progress_PracticeItemId",
                schema: "nehzat",
                table: "Nehzat_user_occasion_progress",
                column: "PracticeItemId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_user_occasion_progress_UserId_OccasionId_PracticeItemId_HijriYear",
                schema: "nehzat",
                table: "Nehzat_user_occasion_progress",
                columns: new[] { "UserId", "OccasionId", "PracticeItemId", "HijriYear" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_users_OidcSubject",
                schema: "nehzat",
                table: "Nehzat_users",
                column: "OidcSubject",
                unique: true,
                filter: "[OidcSubject] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_users_StudentId",
                schema: "nehzat",
                table: "Nehzat_users",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_users_Username",
                schema: "nehzat",
                table: "Nehzat_users",
                column: "Username",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Nehzat_age_groups",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_assessment_questions",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_assessment_results",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_assignment_attachments",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_assignment_gradings",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_branch_managers",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_coach_courses",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_competition_participants",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_curriculum_versions",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_daily_spiritual_entries",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_evaluator_madrasahs",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_issue_action_updates",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_issue_survey_comments",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_issue_survey_responses",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_league_rankings",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_logs",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_maktab_sub_sections",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_monthly_booklets",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_parent_students",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_quran_ayahs",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_quran_student_courses",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_quran_student_progress",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_quran_tajweed_rules",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_ring_books",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_ring_students",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_ring_teaching_methods",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_spiritual_occasion_practices",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_student_courses",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_student_path_history",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_student_path_rankings",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_student_skill_progress",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_teacher_courses",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_user_occasion_progress",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_assessments",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_assignment_submissions",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_coaches",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_competitions",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_evaluators",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_issue_actions",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_leagues",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_madrasah_branches",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_parents",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_quran_recitation_levels",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_quran_surahs",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_books",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_teaching_methods",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_student_path_selections",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_rings",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_spiritual_occasions",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_spiritual_practice_items",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_assignments",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_issue_survey_questions",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_quran_curricula",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_spiritual_paths",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_madrasahs",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_courses",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_curriculum_objectives",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_issue_item_pool",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_issue_surveys",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_teachers",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_nehzat_sections",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_subject_areas",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_users",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_students",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_branches",
                schema: "nehzat");
        }
    }
}
