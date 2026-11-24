using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EducationalPlatform.Nehzat.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCoachFiles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Nehzat_arabic_lessons_Nehzat_arabic_courses_CourseId",
                schema: "nehzat",
                table: "Nehzat_arabic_lessons");

            migrationBuilder.DropForeignKey(
                name: "FK_Nehzat_arabic_lessons_Nehzat_arabic_literature_poems_PoemId",
                schema: "nehzat",
                table: "Nehzat_arabic_lessons");

            migrationBuilder.DropForeignKey(
                name: "FK_Nehzat_arabic_user_progress_Nehzat_arabic_lessons_LessonId",
                schema: "nehzat",
                table: "Nehzat_arabic_user_progress");

            migrationBuilder.DropForeignKey(
                name: "FK_Nehzat_arabic_user_progress_Nehzat_users_UserId",
                schema: "nehzat",
                table: "Nehzat_arabic_user_progress");

            migrationBuilder.DropForeignKey(
                name: "FK_Nehzat_assignment_submissions_Nehzat_assignments_AssignmentId",
                schema: "nehzat",
                table: "Nehzat_assignment_submissions");

            migrationBuilder.DropForeignKey(
                name: "FK_Nehzat_assignment_submissions_Nehzat_students_StudentId",
                schema: "nehzat",
                table: "Nehzat_assignment_submissions");

            migrationBuilder.DropForeignKey(
                name: "FK_Nehzat_assignments_Nehzat_courses_CourseId",
                schema: "nehzat",
                table: "Nehzat_assignments");

            migrationBuilder.DropForeignKey(
                name: "FK_Nehzat_assignments_Nehzat_curriculum_objectives_ObjectiveId",
                schema: "nehzat",
                table: "Nehzat_assignments");

            migrationBuilder.DropForeignKey(
                name: "FK_Nehzat_coach_courses_Nehzat_coaches_CoachId",
                schema: "nehzat",
                table: "Nehzat_coach_courses");

            migrationBuilder.DropForeignKey(
                name: "FK_Nehzat_coach_courses_Nehzat_courses_CourseId",
                schema: "nehzat",
                table: "Nehzat_coach_courses");

            migrationBuilder.DropForeignKey(
                name: "FK_Nehzat_competitions_Nehzat_courses_CourseId",
                schema: "nehzat",
                table: "Nehzat_competitions");

            migrationBuilder.DropForeignKey(
                name: "FK_Nehzat_hadith_assessments_Nehzat_hadith_chapters_HadithChapterId",
                schema: "nehzat",
                table: "Nehzat_hadith_assessments");

            migrationBuilder.DropForeignKey(
                name: "FK_Nehzat_hadith_assessments_Nehzat_hadiths_HadithId",
                schema: "nehzat",
                table: "Nehzat_hadith_assessments");

            migrationBuilder.DropForeignKey(
                name: "FK_Nehzat_leagues_Nehzat_courses_CourseId",
                schema: "nehzat",
                table: "Nehzat_leagues");

            migrationBuilder.DropForeignKey(
                name: "FK_Nehzat_quran_student_courses_Nehzat_quran_recitation_levels_RecitationLevelId",
                schema: "nehzat",
                table: "Nehzat_quran_student_courses");

            migrationBuilder.DropForeignKey(
                name: "FK_Nehzat_quran_surahs_Nehzat_quran_curricula_QuranCurriculumId",
                schema: "nehzat",
                table: "Nehzat_quran_surahs");

            migrationBuilder.DropForeignKey(
                name: "FK_Nehzat_student_courses_Nehzat_courses_CourseId",
                schema: "nehzat",
                table: "Nehzat_student_courses");

            migrationBuilder.DropForeignKey(
                name: "FK_Nehzat_student_courses_Nehzat_students_StudentId",
                schema: "nehzat",
                table: "Nehzat_student_courses");

            migrationBuilder.DropForeignKey(
                name: "FK_Nehzat_training_stages_Nehzat_training_stages_PrerequisiteStageId",
                schema: "nehzat",
                table: "Nehzat_training_stages");

            migrationBuilder.DropForeignKey(
                name: "FK_Nehzat_users_Nehzat_students_StudentId",
                schema: "nehzat",
                table: "Nehzat_users");

            migrationBuilder.AddColumn<string>(
                name: "Biography",
                schema: "nehzat",
                table: "Nehzat_users",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastLoginAt",
                schema: "nehzat",
                table: "Nehzat_users",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NationalCode",
                schema: "nehzat",
                table: "Nehzat_users",
                type: "nvarchar(20)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Phase",
                schema: "nehzat",
                table: "Nehzat_students",
                type: "nvarchar(5)",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "MatnArabic",
                schema: "nehzat",
                table: "Nehzat_hadiths",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<string>(
                name: "CoverImageUrl",
                schema: "nehzat",
                table: "Nehzat_books",
                type: "nvarchar(200)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ai_conversations",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ai_conversations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ai_conversations_Nehzat_users_UserId",
                        column: x => x.UserId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "badges",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "varchar(100)", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    IconUrl = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    ConditionType = table.Column<string>(type: "varchar(100)", nullable: false),
                    ConditionValue = table.Column<string>(type: "nvarchar(255)", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_badges", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "maktabs",
                schema: "nehzat",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    name_en = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    city = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    phone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    owner_user_id = table.Column<int>(type: "int", nullable: false),
                    invite_code = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    is_public = table.Column<bool>(type: "bit", nullable: false),
                    is_deleted = table.Column<bool>(type: "bit", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_maktabs", x => x.id);
                    table.ForeignKey(
                        name: "FK_maktabs_Nehzat_users_owner_user_id",
                        column: x => x.owner_user_id,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_accommodations",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Icon = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_accommodations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_calendar_events",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(200)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Start = table.Column<DateTime>(type: "datetime2", nullable: false),
                    End = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AllDay = table.Column<bool>(type: "bit", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    Color = table.Column<string>(type: "nvarchar(20)", nullable: false),
                    Location = table.Column<string>(type: "nvarchar(200)", nullable: true),
                    CreatorUserId = table.Column<int>(type: "int", nullable: true),
                    IsPublic = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_calendar_events", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_calendar_events_Nehzat_users_CreatorUserId",
                        column: x => x.CreatorUserId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_coach_files",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CoachId = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", nullable: false),
                    FileName = table.Column<string>(type: "nvarchar(300)", nullable: false),
                    StoredPath = table.Column<string>(type: "nvarchar(500)", nullable: false),
                    ContentType = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    Kind = table.Column<string>(type: "nvarchar(20)", nullable: false),
                    SizeBytes = table.Column<long>(type: "bigint", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_coach_files", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_coach_files_Nehzat_coaches_CoachId",
                        column: x => x.CoachId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_coaches",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_courier_daily_stats",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CourierUserId = table.Column<int>(type: "int", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DeliveredCount = table.Column<int>(type: "int", nullable: false),
                    DistanceKm = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    EarningsAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    AverageDeliveryMinutes = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_courier_daily_stats", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_courier_daily_stats_Nehzat_users_CourierUserId",
                        column: x => x.CourierUserId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_delivery_routes",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderId = table.Column<int>(type: "int", nullable: true),
                    CreatedByUserId = table.Column<int>(type: "int", nullable: true),
                    Title = table.Column<string>(type: "nvarchar(200)", nullable: false),
                    TotalDistanceKm = table.Column<double>(type: "float", nullable: false),
                    EstimatedDurationMin = table.Column<int>(type: "int", nullable: true),
                    Geometry = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_delivery_routes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_gamification_profiles",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    TotalXp = table.Column<int>(type: "int", nullable: false),
                    Level = table.Column<int>(type: "int", nullable: false),
                    Coins = table.Column<int>(type: "int", nullable: false),
                    StreakDays = table.Column<int>(type: "int", nullable: false),
                    TotalLogins = table.Column<int>(type: "int", nullable: false),
                    QuizzesCompleted = table.Column<int>(type: "int", nullable: false),
                    CorrectAnswers = table.Column<int>(type: "int", nullable: false),
                    LastLoginDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_gamification_profiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_gamification_profiles_Nehzat_users_UserId",
                        column: x => x.UserId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_maktab_lookup",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Gender = table.Column<string>(type: "nvarchar(20)", nullable: false),
                    AgeMin = table.Column<int>(type: "int", nullable: false),
                    AgeMax = table.Column<int>(type: "int", nullable: false),
                    MaktabName = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    MaktabNameEn = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    Phase = table.Column<string>(type: "nvarchar(10)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_maktab_lookup", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_map_orders",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderCode = table.Column<string>(type: "nvarchar(20)", nullable: false),
                    CreatedByUserId = table.Column<int>(type: "int", nullable: true),
                    AssignedToUserId = table.Column<int>(type: "int", nullable: true),
                    HalghehId = table.Column<int>(type: "int", nullable: true),
                    Title = table.Column<string>(type: "nvarchar(200)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PickupLatitude = table.Column<double>(type: "float", nullable: false),
                    PickupLongitude = table.Column<double>(type: "float", nullable: false),
                    PickupAddress = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    DeliveryLatitude = table.Column<double>(type: "float", nullable: false),
                    DeliveryLongitude = table.Column<double>(type: "float", nullable: false),
                    DeliveryAddress = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(20)", nullable: false),
                    AcceptedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    AssignedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    PickedUpAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeliveredAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_map_orders", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_notifications",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Type = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    Body = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Link = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    IconUrl = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    SenderUserId = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_notifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_notifications_Nehzat_users_SenderUserId",
                        column: x => x.SenderUserId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_progress_reports",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StudentId = table.Column<int>(type: "int", nullable: false),
                    PeriodStart = table.Column<DateTime>(type: "datetime2", nullable: false),
                    PeriodEnd = table.Column<DateTime>(type: "datetime2", nullable: false),
                    OverallScore = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    AttendanceRate = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    AssignmentCompletionRate = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    CompletedAssignments = table.Column<int>(type: "int", nullable: false),
                    TotalAssignments = table.Column<int>(type: "int", nullable: false),
                    CoachNote = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    GeneratedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_progress_reports", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_progress_reports_Nehzat_students_StudentId",
                        column: x => x.StudentId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_students",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_qr_sessions",
                schema: "nehzat",
                columns: table => new
                {
                    QrSessionId = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(20)", nullable: false),
                    ScannedByUsername = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    ConfirmedToken = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ScannedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ConfirmedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_qr_sessions", x => x.QrSessionId);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_question_bank",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Text = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Category = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    Difficulty = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(20)", nullable: false),
                    OptionsJson = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CorrectAnswer = table.Column<string>(type: "nvarchar(500)", nullable: false),
                    Points = table.Column<int>(type: "int", nullable: false),
                    CreatedByUserId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_question_bank", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_question_bank_Nehzat_users_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_quran_rings",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(2000)", nullable: true),
                    AgeGroup = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    Gender = table.Column<string>(type: "nvarchar(20)", nullable: true),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    MinAge = table.Column<int>(type: "int", nullable: true),
                    MaxAge = table.Column<int>(type: "int", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    HasSpecializedPath = table.Column<bool>(type: "bit", nullable: false),
                    SpecializedPeriods = table.Column<int>(type: "int", nullable: true),
                    SpecializedTimePercent = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_quran_rings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_random_evaluations",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StudentId = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    Category = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    StartedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CompletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    TotalQuestions = table.Column<int>(type: "int", nullable: false),
                    CorrectAnswers = table.Column<int>(type: "int", nullable: false),
                    TotalScore = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(20)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_random_evaluations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_random_evaluations_Nehzat_students_StudentId",
                        column: x => x.StudentId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_students",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_study_paths",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Key = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AgeGroupId = table.Column<int>(type: "int", nullable: false),
                    SubjectAreaId = table.Column<int>(type: "int", nullable: false),
                    CognitiveLevel = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_study_paths", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_study_paths_Nehzat_age_groups_AgeGroupId",
                        column: x => x.AgeGroupId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_age_groups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Nehzat_study_paths_Nehzat_subject_areas_SubjectAreaId",
                        column: x => x.SubjectAreaId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_subject_areas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_tadabbor_entries",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StudentId = table.Column<int>(type: "int", nullable: false),
                    AyahId = table.Column<int>(type: "int", nullable: true),
                    SurahId = table.Column<int>(type: "int", nullable: true),
                    AyahNumber = table.Column<int>(type: "int", nullable: true),
                    Word = table.Column<string>(type: "nvarchar(200)", nullable: false),
                    WhyThisWord = table.Column<string>(type: "text", nullable: false),
                    SynonymsJson = table.Column<string>(type: "text", nullable: true),
                    DifferenceFromSynonyms = table.Column<string>(type: "text", nullable: true),
                    JalalainReference = table.Column<string>(type: "text", nullable: true),
                    StudentNote = table.Column<string>(type: "text", nullable: true),
                    CoachNote = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_tadabbor_entries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_tadabbor_entries_Nehzat_quran_ayahs_AyahId",
                        column: x => x.AyahId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_quran_ayahs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Nehzat_tadabbor_entries_Nehzat_quran_surahs_SurahId",
                        column: x => x.SurahId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_quran_surahs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Nehzat_tadabbor_entries_Nehzat_students_StudentId",
                        column: x => x.StudentId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_students",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_user_devices",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    DeviceToken = table.Column<string>(type: "nvarchar(500)", nullable: false),
                    Platform = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    DeviceName = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    RegisteredAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastSeenAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_user_devices", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_user_devices_Nehzat_users_UserId",
                        column: x => x.UserId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_user_locations",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Latitude = table.Column<double>(type: "float", nullable: false),
                    Longitude = table.Column<double>(type: "float", nullable: false),
                    Accuracy = table.Column<double>(type: "float", nullable: true),
                    Speed = table.Column<double>(type: "float", nullable: true),
                    Heading = table.Column<double>(type: "float", nullable: true),
                    IsSharing = table.Column<bool>(type: "bit", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_user_locations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_user_locations_Nehzat_users_UserId",
                        column: x => x.UserId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_user_notification_settings",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    NewAssignment = table.Column<bool>(type: "bit", nullable: false),
                    SubmissionReviewed = table.Column<bool>(type: "bit", nullable: false),
                    NewMember = table.Column<bool>(type: "bit", nullable: false),
                    SessionReminder = table.Column<bool>(type: "bit", nullable: false),
                    SystemAnnouncement = table.Column<bool>(type: "bit", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_user_notification_settings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_user_notification_settings_Nehzat_users_UserId",
                        column: x => x.UserId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_vocabulary_texts",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(200)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1000)", nullable: true),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Language = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    SubjectAreaId = table.Column<int>(type: "int", nullable: true),
                    OwnerUserId = table.Column<int>(type: "int", nullable: true),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_vocabulary_texts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_vocabulary_texts_Nehzat_subject_areas_SubjectAreaId",
                        column: x => x.SubjectAreaId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_subject_areas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Nehzat_vocabulary_texts_Nehzat_users_OwnerUserId",
                        column: x => x.OwnerUserId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "point_transactions",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Amount = table.Column<int>(type: "int", nullable: false),
                    Reason = table.Column<string>(type: "nvarchar(300)", nullable: false),
                    ReferenceType = table.Column<string>(type: "varchar(50)", nullable: true),
                    ReferenceId = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_point_transactions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_point_transactions_Nehzat_users_UserId",
                        column: x => x.UserId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "workflow_definitions",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(200)", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(2000)", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_workflow_definitions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ai_messages",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ConversationId = table.Column<int>(type: "int", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SourcesJson = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ai_messages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ai_messages_ai_conversations_ConversationId",
                        column: x => x.ConversationId,
                        principalSchema: "nehzat",
                        principalTable: "ai_conversations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "user_badges",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    BadgeId = table.Column<int>(type: "int", nullable: false),
                    AwardedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_user_badges", x => x.Id);
                    table.ForeignKey(
                        name: "FK_user_badges_Nehzat_users_UserId",
                        column: x => x.UserId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_user_badges_badges_BadgeId",
                        column: x => x.BadgeId,
                        principalSchema: "nehzat",
                        principalTable: "badges",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Conversations",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true),
                    Type = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    MaktabId = table.Column<int>(type: "int", nullable: true),
                    CreatedBy = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Conversations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Conversations_Nehzat_users_CreatedBy",
                        column: x => x.CreatedBy,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Conversations_maktabs_MaktabId",
                        column: x => x.MaktabId,
                        principalSchema: "nehzat",
                        principalTable: "maktabs",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "halghehs",
                schema: "nehzat",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    maktab_id = table.Column<int>(type: "int", nullable: false),
                    name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    name_en = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    code = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    max_members = table.Column<int>(type: "int", nullable: true),
                    moderator_user_id = table.Column<int>(type: "int", nullable: false),
                    status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    is_deleted = table.Column<bool>(type: "bit", nullable: false),
                    is_active = table.Column<bool>(type: "bit", nullable: false),
                    sort_order = table.Column<int>(type: "int", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_halghehs", x => x.id);
                    table.ForeignKey(
                        name: "FK_halghehs_Nehzat_users_moderator_user_id",
                        column: x => x.moderator_user_id,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_halghehs_maktabs_maktab_id",
                        column: x => x.maktab_id,
                        principalSchema: "nehzat",
                        principalTable: "maktabs",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "knowledge_documents",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DocumentType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    SubjectId = table.Column<int>(type: "int", nullable: true),
                    MaktabId = table.Column<int>(type: "int", nullable: true),
                    EmbeddingJson = table.Column<string>(type: "text", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_knowledge_documents", x => x.Id);
                    table.ForeignKey(
                        name: "FK_knowledge_documents_Nehzat_subject_areas_SubjectId",
                        column: x => x.SubjectId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_subject_areas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_knowledge_documents_maktabs_MaktabId",
                        column: x => x.MaktabId,
                        principalSchema: "nehzat",
                        principalTable: "maktabs",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "maktab_members",
                schema: "nehzat",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    maktab_id = table.Column<int>(type: "int", nullable: false),
                    user_id = table.Column<int>(type: "int", nullable: false),
                    role = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    joined_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    left_at = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_maktab_members", x => x.id);
                    table.ForeignKey(
                        name: "FK_maktab_members_Nehzat_users_user_id",
                        column: x => x.user_id,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_maktab_members_maktabs_maktab_id",
                        column: x => x.maktab_id,
                        principalSchema: "nehzat",
                        principalTable: "maktabs",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_calendar_event_attendees",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CalendarEventId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    ResponseStatus = table.Column<string>(type: "nvarchar(20)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_calendar_event_attendees", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_calendar_event_attendees_Nehzat_calendar_events_CalendarEventId",
                        column: x => x.CalendarEventId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_calendar_events",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Nehzat_calendar_event_attendees_Nehzat_users_UserId",
                        column: x => x.UserId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_route_points",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RouteId = table.Column<int>(type: "int", nullable: false),
                    Order = table.Column<int>(type: "int", nullable: false),
                    Latitude = table.Column<double>(type: "float", nullable: false),
                    Longitude = table.Column<double>(type: "float", nullable: false),
                    PointType = table.Column<string>(type: "nvarchar(20)", nullable: false),
                    Label = table.Column<string>(type: "nvarchar(200)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_route_points", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_route_points_Nehzat_delivery_routes_RouteId",
                        column: x => x.RouteId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_delivery_routes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_student_badges",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProfileId = table.Column<int>(type: "int", nullable: false),
                    BadgeCode = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    BadgeTitle = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    BadgeImageUrl = table.Column<string>(type: "nvarchar(200)", nullable: true),
                    EarnedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_student_badges", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_student_badges_Nehzat_gamification_profiles_ProfileId",
                        column: x => x.ProfileId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_gamification_profiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_order_tracking_points",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderId = table.Column<int>(type: "int", nullable: false),
                    Latitude = table.Column<double>(type: "float", nullable: false),
                    Longitude = table.Column<double>(type: "float", nullable: false),
                    Speed = table.Column<double>(type: "float", nullable: true),
                    Note = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    RecordedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_order_tracking_points", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_order_tracking_points_Nehzat_map_orders_OrderId",
                        column: x => x.OrderId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_map_orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_user_notifications",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NotificationId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    IsRead = table.Column<bool>(type: "bit", nullable: false),
                    ReadAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_user_notifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_user_notifications_Nehzat_notifications_NotificationId",
                        column: x => x.NotificationId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_notifications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Nehzat_user_notifications_Nehzat_users_UserId",
                        column: x => x.UserId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_progress_metrics",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProgressReportId = table.Column<int>(type: "int", nullable: false),
                    MetricKey = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    MetricLabel = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    Score = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    Target = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    Rank = table.Column<int>(type: "int", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_progress_metrics", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_progress_metrics_Nehzat_progress_reports_ProgressReportId",
                        column: x => x.ProgressReportId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_progress_reports",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_coach_interviews",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CoachUserId = table.Column<int>(type: "int", nullable: false),
                    RingId = table.Column<int>(type: "int", nullable: false),
                    InterviewDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Q1_ProcessSteps = table.Column<string>(type: "text", nullable: true),
                    Q2_PhoneticLayer = table.Column<string>(type: "text", nullable: true),
                    Q3_TranslationLayer = table.Column<string>(type: "text", nullable: true),
                    Q4_SpeedCategories = table.Column<string>(type: "text", nullable: true),
                    Q5_MainChallenges = table.Column<string>(type: "text", nullable: true),
                    Q6_CurrentSolutions = table.Column<string>(type: "text", nullable: true),
                    Q7_DailyListening = table.Column<string>(type: "text", nullable: true),
                    Q8_Memorization = table.Column<string>(type: "text", nullable: true),
                    Q9_Tajweed = table.Column<string>(type: "text", nullable: true),
                    Q10_Vocabulary = table.Column<string>(type: "text", nullable: true),
                    Q11_Syntax = table.Column<string>(type: "text", nullable: true),
                    Q12_Tadabbor = table.Column<string>(type: "text", nullable: true),
                    Q13_Writing = table.Column<string>(type: "text", nullable: true),
                    Q14_Presentations = table.Column<string>(type: "text", nullable: true),
                    Q15_Discussions = table.Column<string>(type: "text", nullable: true),
                    Q16_ParentReports = table.Column<string>(type: "text", nullable: true),
                    Q17_Resources = table.Column<string>(type: "text", nullable: true),
                    Q18_Needs = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_coach_interviews", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_coach_interviews_Nehzat_quran_rings_RingId",
                        column: x => x.RingId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_quran_rings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Nehzat_coach_interviews_Nehzat_users_CoachUserId",
                        column: x => x.CoachUserId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_quran_asset_evaluations",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StudentId = table.Column<int>(type: "int", nullable: false),
                    RingId = table.Column<int>(type: "int", nullable: false),
                    EvaluatorUserId = table.Column<int>(type: "int", nullable: false),
                    EvaluationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    MemorizationScore = table.Column<int>(type: "int", nullable: false),
                    MemorizationNotes = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    PhoneticSkillScore = table.Column<int>(type: "int", nullable: false),
                    PhoneticSkillNotes = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    LinguisticFoundationScore = table.Column<int>(type: "int", nullable: false),
                    LinguisticFoundationNotes = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    SemanticComprehensionScore = table.Column<int>(type: "int", nullable: false),
                    SemanticComprehensionNotes = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    TadabborWritingScore = table.Column<int>(type: "int", nullable: false),
                    TadabborWritingNotes = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    DailyThroughputScore = table.Column<int>(type: "int", nullable: false),
                    DailyThroughputNotes = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    EnvironmentalSupportScore = table.Column<int>(type: "int", nullable: false),
                    EnvironmentalSupportNotes = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    MotivationIdentityScore = table.Column<int>(type: "int", nullable: false),
                    MotivationIdentityNotes = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    TotalScore = table.Column<int>(type: "int", nullable: false),
                    SuggestedSpeedCategory = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    SuggestedRingId = table.Column<int>(type: "int", nullable: true),
                    GeneralNotes = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_quran_asset_evaluations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_quran_asset_evaluations_Nehzat_quran_rings_RingId",
                        column: x => x.RingId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_quran_rings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Nehzat_quran_asset_evaluations_Nehzat_students_StudentId",
                        column: x => x.StudentId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_students",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Nehzat_quran_asset_evaluations_Nehzat_users_EvaluatorUserId",
                        column: x => x.EvaluatorUserId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_quran_ring_resources",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RingId = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", nullable: false),
                    ResourceType = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(2000)", nullable: true),
                    Url = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    IsPrimary = table.Column<bool>(type: "bit", nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_quran_ring_resources", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_quran_ring_resources_Nehzat_quran_rings_RingId",
                        column: x => x.RingId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_quran_rings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_quran_ring_sessions",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RingId = table.Column<int>(type: "int", nullable: false),
                    SessionNumber = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(2000)", nullable: true),
                    SessionType = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    StartPage = table.Column<int>(type: "int", nullable: true),
                    EndPage = table.Column<int>(type: "int", nullable: true),
                    StartSurahId = table.Column<int>(type: "int", nullable: true),
                    EndSurahId = table.Column<int>(type: "int", nullable: true),
                    StartAyah = table.Column<int>(type: "int", nullable: true),
                    EndAyah = table.Column<int>(type: "int", nullable: true),
                    Surfaces = table.Column<int>(type: "int", nullable: false),
                    EstimatedMinutes = table.Column<int>(type: "int", nullable: false),
                    PrerequisiteSessionId = table.Column<int>(type: "int", nullable: true),
                    IsAssessment = table.Column<bool>(type: "bit", nullable: false),
                    Half = table.Column<string>(type: "nvarchar(20)", nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_quran_ring_sessions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_quran_ring_sessions_Nehzat_quran_rings_RingId",
                        column: x => x.RingId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_quran_rings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_quran_ring_surahs",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RingId = table.Column<int>(type: "int", nullable: false),
                    SurahId = table.Column<int>(type: "int", nullable: false),
                    ActivityType = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_quran_ring_surahs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_quran_ring_surahs_Nehzat_quran_rings_RingId",
                        column: x => x.RingId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_quran_rings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Nehzat_quran_ring_surahs_Nehzat_quran_surahs_SurahId",
                        column: x => x.SurahId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_quran_surahs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_student_interviews",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StudentId = table.Column<int>(type: "int", nullable: false),
                    RingId = table.Column<int>(type: "int", nullable: false),
                    InterviewerUserId = table.Column<int>(type: "int", nullable: false),
                    InterviewDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    S1_DailyListening = table.Column<string>(type: "text", nullable: true),
                    S2_FamilyListening = table.Column<string>(type: "text", nullable: true),
                    S3_MemorizedSurahs = table.Column<string>(type: "text", nullable: true),
                    S4_DailyProcess = table.Column<string>(type: "text", nullable: true),
                    S5_TimeSpent = table.Column<string>(type: "text", nullable: true),
                    S6_Difficulties = table.Column<string>(type: "text", nullable: true),
                    S7_EasyParts = table.Column<string>(type: "text", nullable: true),
                    S8_SelfSpeedCategory = table.Column<string>(type: "text", nullable: true),
                    S9_Motivation = table.Column<string>(type: "text", nullable: true),
                    S10_Goal = table.Column<string>(type: "text", nullable: true),
                    S11_Tadabbor = table.Column<string>(type: "text", nullable: true),
                    S12_Writing = table.Column<string>(type: "text", nullable: true),
                    S13_Books = table.Column<string>(type: "text", nullable: true),
                    S14_Discussion = table.Column<string>(type: "text", nullable: true),
                    S15_Presentations = table.Column<string>(type: "text", nullable: true),
                    S16_FamilyOpinion = table.Column<string>(type: "text", nullable: true),
                    S17_Needs = table.Column<string>(type: "text", nullable: true),
                    S18_Satisfaction = table.Column<string>(type: "text", nullable: true),
                    S19_Suggestion = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_student_interviews", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_student_interviews_Nehzat_quran_rings_RingId",
                        column: x => x.RingId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_quran_rings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Nehzat_student_interviews_Nehzat_students_StudentId",
                        column: x => x.StudentId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_students",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Nehzat_student_interviews_Nehzat_users_InterviewerUserId",
                        column: x => x.InterviewerUserId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_student_speed_categories",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StudentId = table.Column<int>(type: "int", nullable: false),
                    RingId = table.Column<int>(type: "int", nullable: false),
                    Category = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    DailyLines = table.Column<int>(type: "int", nullable: false),
                    AssignedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    PreviousCategory = table.Column<string>(type: "nvarchar(50)", nullable: true),
                    ChangeReason = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    MasteryScore = table.Column<int>(type: "int", nullable: false),
                    ActualDailyLines = table.Column<int>(type: "int", nullable: false),
                    ActiveDays = table.Column<int>(type: "int", nullable: false),
                    LastEvaluationAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsEligibleForPromotion = table.Column<bool>(type: "bit", nullable: false),
                    IsAtRiskOfDemotion = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_student_speed_categories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_student_speed_categories_Nehzat_quran_rings_RingId",
                        column: x => x.RingId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_quran_rings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Nehzat_student_speed_categories_Nehzat_students_StudentId",
                        column: x => x.StudentId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_students",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_evaluation_answers",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RandomEvaluationId = table.Column<int>(type: "int", nullable: false),
                    QuestionId = table.Column<int>(type: "int", nullable: false),
                    AnswerText = table.Column<string>(type: "nvarchar(500)", nullable: false),
                    IsCorrect = table.Column<bool>(type: "bit", nullable: false),
                    PointsEarned = table.Column<int>(type: "int", nullable: false),
                    AnsweredAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_evaluation_answers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_evaluation_answers_Nehzat_question_bank_QuestionId",
                        column: x => x.QuestionId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_question_bank",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Nehzat_evaluation_answers_Nehzat_random_evaluations_RandomEvaluationId",
                        column: x => x.RandomEvaluationId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_random_evaluations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_study_path_accommodations",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StudyPathId = table.Column<int>(type: "int", nullable: false),
                    AccommodationId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_study_path_accommodations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_study_path_accommodations_Nehzat_accommodations_AccommodationId",
                        column: x => x.AccommodationId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_accommodations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Nehzat_study_path_accommodations_Nehzat_study_paths_StudyPathId",
                        column: x => x.StudyPathId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_study_paths",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_study_path_steps",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StudyPathId = table.Column<int>(type: "int", nullable: false),
                    StepOrder = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CognitiveLevel = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    EstimatedDurationMinutes = table.Column<int>(type: "int", nullable: false),
                    PrerequisitesJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ContentUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    ResourceId = table.Column<int>(type: "int", nullable: true),
                    AssessmentId = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_study_path_steps", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_study_path_steps_Nehzat_assessments_AssessmentId",
                        column: x => x.AssessmentId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_assessments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Nehzat_study_path_steps_Nehzat_study_paths_StudyPathId",
                        column: x => x.StudyPathId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_study_paths",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_vocabulary_words",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    WordText = table.Column<string>(type: "nvarchar(200)", nullable: false),
                    Definition = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    ExampleSentence = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    ExampleTranslation = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    PartOfSpeech = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(200)", nullable: true),
                    AudioUrl = table.Column<string>(type: "nvarchar(200)", nullable: true),
                    DifficultyLevel = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    VocabularyTextId = table.Column<int>(type: "int", nullable: false),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_vocabulary_words", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_vocabulary_words_Nehzat_vocabulary_texts_VocabularyTextId",
                        column: x => x.VocabularyTextId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_vocabulary_texts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_educational_processes",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    WorkflowId = table.Column<int>(type: "int", nullable: false),
                    EntityType = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(2000)", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    AutoTrigger = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_educational_processes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_educational_processes_workflow_definitions_WorkflowId",
                        column: x => x.WorkflowId,
                        principalSchema: "nehzat",
                        principalTable: "workflow_definitions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "workflow_steps",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    WorkflowId = table.Column<int>(type: "int", nullable: false),
                    StepOrder = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", nullable: false),
                    RoleRequired = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    ActionType = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    IsFinalStep = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_workflow_steps", x => x.Id);
                    table.ForeignKey(
                        name: "FK_workflow_steps_workflow_definitions_WorkflowId",
                        column: x => x.WorkflowId,
                        principalSchema: "nehzat",
                        principalTable: "workflow_definitions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ConversationMembers",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ConversationId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    LastReadAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    JoinedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ConversationMembers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ConversationMembers_Conversations_ConversationId",
                        column: x => x.ConversationId,
                        principalSchema: "nehzat",
                        principalTable: "Conversations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ConversationMembers_Nehzat_users_UserId",
                        column: x => x.UserId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Messages",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ConversationId = table.Column<int>(type: "int", nullable: false),
                    SenderId = table.Column<int>(type: "int", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MessageType = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    ReplyToId = table.Column<int>(type: "int", nullable: true),
                    IsEdited = table.Column<bool>(type: "bit", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Messages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Messages_Conversations_ConversationId",
                        column: x => x.ConversationId,
                        principalSchema: "nehzat",
                        principalTable: "Conversations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Messages_Messages_ReplyToId",
                        column: x => x.ReplyToId,
                        principalSchema: "nehzat",
                        principalTable: "Messages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Messages_Nehzat_users_SenderId",
                        column: x => x.SenderId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "halgheh_assignments",
                schema: "nehzat",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    halgheh_id = table.Column<int>(type: "int", nullable: false),
                    title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    description = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    due_date = table.Column<DateTime>(type: "datetime2", nullable: true),
                    status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    created_by_user_id = table.Column<int>(type: "int", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_halgheh_assignments", x => x.id);
                    table.ForeignKey(
                        name: "FK_halgheh_assignments_halghehs_halgheh_id",
                        column: x => x.halgheh_id,
                        principalSchema: "nehzat",
                        principalTable: "halghehs",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "halgheh_members",
                schema: "nehzat",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    halgheh_id = table.Column<int>(type: "int", nullable: false),
                    user_id = table.Column<int>(type: "int", nullable: false),
                    role = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    joined_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    left_at = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_halgheh_members", x => x.id);
                    table.ForeignKey(
                        name: "FK_halgheh_members_Nehzat_users_user_id",
                        column: x => x.user_id,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_halgheh_members_halghehs_halgheh_id",
                        column: x => x.halgheh_id,
                        principalSchema: "nehzat",
                        principalTable: "halghehs",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ring_maktabs",
                schema: "nehzat",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ring_id = table.Column<int>(type: "int", nullable: false),
                    maktab_id = table.Column<int>(type: "int", nullable: false),
                    halgheh_id = table.Column<int>(type: "int", nullable: false),
                    academic_year = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    is_active = table.Column<bool>(type: "bit", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ring_maktabs", x => x.id);
                    table.ForeignKey(
                        name: "FK_ring_maktabs_Nehzat_rings_ring_id",
                        column: x => x.ring_id,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_rings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ring_maktabs_halghehs_halgheh_id",
                        column: x => x.halgheh_id,
                        principalSchema: "nehzat",
                        principalTable: "halghehs",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ring_maktabs_maktabs_maktab_id",
                        column: x => x.maktab_id,
                        principalSchema: "nehzat",
                        principalTable: "maktabs",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_quran_session_steps",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SessionId = table.Column<int>(type: "int", nullable: false),
                    StepType = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(2000)", nullable: true),
                    StepOrder = table.Column<int>(type: "int", nullable: false),
                    EstimatedMinutes = table.Column<int>(type: "int", nullable: false),
                    IsOptional = table.Column<bool>(type: "bit", nullable: false),
                    ResourcesJson = table.Column<string>(type: "text", nullable: true),
                    CompletionCriteria = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_quran_session_steps", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_quran_session_steps_Nehzat_quran_ring_sessions_SessionId",
                        column: x => x.SessionId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_quran_ring_sessions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_student_quran_session_progress",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StudentId = table.Column<int>(type: "int", nullable: false),
                    SessionId = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    ProgressPercent = table.Column<int>(type: "int", nullable: false),
                    LinesMemorized = table.Column<int>(type: "int", nullable: false),
                    SurfacesCompleted = table.Column<int>(type: "int", nullable: false),
                    AssessmentScore = table.Column<int>(type: "int", nullable: true),
                    CoachNotes = table.Column<string>(type: "text", nullable: true),
                    StartedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CompletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_student_quran_session_progress", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_student_quran_session_progress_Nehzat_quran_ring_sessions_SessionId",
                        column: x => x.SessionId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_quran_ring_sessions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Nehzat_student_quran_session_progress_Nehzat_students_StudentId",
                        column: x => x.StudentId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_students",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_student_study_paths",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StudentId = table.Column<int>(type: "int", nullable: false),
                    StudyPathId = table.Column<int>(type: "int", nullable: false),
                    EnrollmentDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CurrentStepId = table.Column<int>(type: "int", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    ProgressPercentage = table.Column<int>(type: "int", nullable: false),
                    StartedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CompletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_student_study_paths", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_student_study_paths_Nehzat_students_StudentId",
                        column: x => x.StudentId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_students",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Nehzat_student_study_paths_Nehzat_study_path_steps_CurrentStepId",
                        column: x => x.CurrentStepId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_study_path_steps",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Nehzat_student_study_paths_Nehzat_study_paths_StudyPathId",
                        column: x => x.StudyPathId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_study_paths",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_user_vocabulary_cards",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    VocabularyWordId = table.Column<int>(type: "int", nullable: false),
                    NextReviewAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Interval = table.Column<int>(type: "int", nullable: false),
                    EaseFactor = table.Column<double>(type: "float", nullable: false),
                    Repetition = table.Column<int>(type: "int", nullable: false),
                    Quality = table.Column<int>(type: "int", nullable: false),
                    IsKnown = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_user_vocabulary_cards", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_user_vocabulary_cards_Nehzat_users_UserId",
                        column: x => x.UserId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Nehzat_user_vocabulary_cards_Nehzat_vocabulary_words_VocabularyWordId",
                        column: x => x.VocabularyWordId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_vocabulary_words",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "workflow_requests",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    WorkflowId = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(2000)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    CurrentStepId = table.Column<int>(type: "int", nullable: true),
                    CreatedBy = table.Column<int>(type: "int", nullable: false),
                    EntityType = table.Column<string>(type: "nvarchar(50)", nullable: true),
                    EntityId = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_workflow_requests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_workflow_requests_Nehzat_users_CreatedBy",
                        column: x => x.CreatedBy,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_workflow_requests_workflow_definitions_WorkflowId",
                        column: x => x.WorkflowId,
                        principalSchema: "nehzat",
                        principalTable: "workflow_definitions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_workflow_requests_workflow_steps_CurrentStepId",
                        column: x => x.CurrentStepId,
                        principalSchema: "nehzat",
                        principalTable: "workflow_steps",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MessageAttachments",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MessageId = table.Column<int>(type: "int", nullable: false),
                    FileName = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    FilePath = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    FileSize = table.Column<long>(type: "bigint", nullable: false),
                    MimeType = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MessageAttachments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MessageAttachments_Messages_MessageId",
                        column: x => x.MessageId,
                        principalSchema: "nehzat",
                        principalTable: "Messages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_user_message_reads",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    MessageId = table.Column<int>(type: "int", nullable: false),
                    ReadAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_user_message_reads", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_user_message_reads_Messages_MessageId",
                        column: x => x.MessageId,
                        principalSchema: "nehzat",
                        principalTable: "Messages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Nehzat_user_message_reads_Nehzat_users_UserId",
                        column: x => x.UserId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "halgheh_assignment_submissions",
                schema: "nehzat",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    halgheh_assignment_id = table.Column<int>(type: "int", nullable: false),
                    user_id = table.Column<int>(type: "int", nullable: false),
                    content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    feedback = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    grade = table.Column<int>(type: "int", nullable: true),
                    submitted_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    reviewed_by_user_id = table.Column<int>(type: "int", nullable: true),
                    reviewed_at = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_halgheh_assignment_submissions", x => x.id);
                    table.ForeignKey(
                        name: "FK_halgheh_assignment_submissions_halgheh_assignments_halgheh_assignment_id",
                        column: x => x.halgheh_assignment_id,
                        principalSchema: "nehzat",
                        principalTable: "halgheh_assignments",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Nehzat_student_step_progress",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SessionProgressId = table.Column<int>(type: "int", nullable: false),
                    StepId = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    Score = table.Column<int>(type: "int", nullable: true),
                    RepetitionCount = table.Column<int>(type: "int", nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    StartedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CompletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nehzat_student_step_progress", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nehzat_student_step_progress_Nehzat_quran_session_steps_StepId",
                        column: x => x.StepId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_quran_session_steps",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Nehzat_student_step_progress_Nehzat_student_quran_session_progress_SessionProgressId",
                        column: x => x.SessionProgressId,
                        principalSchema: "nehzat",
                        principalTable: "Nehzat_student_quran_session_progress",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "workflow_actions",
                schema: "nehzat",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RequestId = table.Column<int>(type: "int", nullable: false),
                    StepId = table.Column<int>(type: "int", nullable: false),
                    ActorId = table.Column<int>(type: "int", nullable: false),
                    Action = table.Column<string>(type: "nvarchar(50)", nullable: false),
                    Comment = table.Column<string>(type: "nvarchar(1000)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_workflow_actions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_workflow_actions_workflow_requests_RequestId",
                        column: x => x.RequestId,
                        principalSchema: "nehzat",
                        principalTable: "workflow_requests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_workflow_actions_workflow_steps_StepId",
                        column: x => x.StepId,
                        principalSchema: "nehzat",
                        principalTable: "workflow_steps",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ai_conversations_UserId",
                schema: "nehzat",
                table: "ai_conversations",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ai_messages_ConversationId",
                schema: "nehzat",
                table: "ai_messages",
                column: "ConversationId");

            migrationBuilder.CreateIndex(
                name: "IX_badges_Code",
                schema: "nehzat",
                table: "badges",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ConversationMembers_ConversationId",
                schema: "nehzat",
                table: "ConversationMembers",
                column: "ConversationId");

            migrationBuilder.CreateIndex(
                name: "IX_ConversationMembers_UserId",
                schema: "nehzat",
                table: "ConversationMembers",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Conversations_CreatedBy",
                schema: "nehzat",
                table: "Conversations",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_Conversations_MaktabId",
                schema: "nehzat",
                table: "Conversations",
                column: "MaktabId");

            migrationBuilder.CreateIndex(
                name: "IX_halgheh_assignment_submissions_halgheh_assignment_id_user_id",
                schema: "nehzat",
                table: "halgheh_assignment_submissions",
                columns: new[] { "halgheh_assignment_id", "user_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_halgheh_assignments_halgheh_id_status",
                schema: "nehzat",
                table: "halgheh_assignments",
                columns: new[] { "halgheh_id", "status" });

            migrationBuilder.CreateIndex(
                name: "IX_halgheh_members_halgheh_id_user_id",
                schema: "nehzat",
                table: "halgheh_members",
                columns: new[] { "halgheh_id", "user_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_halgheh_members_user_id",
                schema: "nehzat",
                table: "halgheh_members",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_halghehs_maktab_id",
                schema: "nehzat",
                table: "halghehs",
                column: "maktab_id");

            migrationBuilder.CreateIndex(
                name: "IX_halghehs_moderator_user_id",
                schema: "nehzat",
                table: "halghehs",
                column: "moderator_user_id");

            migrationBuilder.CreateIndex(
                name: "IX_knowledge_documents_MaktabId",
                schema: "nehzat",
                table: "knowledge_documents",
                column: "MaktabId");

            migrationBuilder.CreateIndex(
                name: "IX_knowledge_documents_SubjectId",
                schema: "nehzat",
                table: "knowledge_documents",
                column: "SubjectId");

            migrationBuilder.CreateIndex(
                name: "IX_maktab_members_maktab_id_user_id",
                schema: "nehzat",
                table: "maktab_members",
                columns: new[] { "maktab_id", "user_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_maktab_members_user_id",
                schema: "nehzat",
                table: "maktab_members",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_maktabs_invite_code",
                schema: "nehzat",
                table: "maktabs",
                column: "invite_code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_maktabs_owner_user_id",
                schema: "nehzat",
                table: "maktabs",
                column: "owner_user_id");

            migrationBuilder.CreateIndex(
                name: "IX_MessageAttachments_MessageId",
                schema: "nehzat",
                table: "MessageAttachments",
                column: "MessageId");

            migrationBuilder.CreateIndex(
                name: "IX_Messages_ConversationId",
                schema: "nehzat",
                table: "Messages",
                column: "ConversationId");

            migrationBuilder.CreateIndex(
                name: "IX_Messages_ReplyToId",
                schema: "nehzat",
                table: "Messages",
                column: "ReplyToId");

            migrationBuilder.CreateIndex(
                name: "IX_Messages_SenderId",
                schema: "nehzat",
                table: "Messages",
                column: "SenderId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_accommodations_Code",
                schema: "nehzat",
                table: "Nehzat_accommodations",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_calendar_event_attendees_CalendarEventId_UserId",
                schema: "nehzat",
                table: "Nehzat_calendar_event_attendees",
                columns: new[] { "CalendarEventId", "UserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_calendar_event_attendees_UserId",
                schema: "nehzat",
                table: "Nehzat_calendar_event_attendees",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_calendar_events_CreatorUserId",
                schema: "nehzat",
                table: "Nehzat_calendar_events",
                column: "CreatorUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_coach_files_CoachId",
                schema: "nehzat",
                table: "Nehzat_coach_files",
                column: "CoachId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_coach_interviews_CoachUserId",
                schema: "nehzat",
                table: "Nehzat_coach_interviews",
                column: "CoachUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_coach_interviews_RingId",
                schema: "nehzat",
                table: "Nehzat_coach_interviews",
                column: "RingId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_courier_daily_stats_CourierUserId_Date",
                schema: "nehzat",
                table: "Nehzat_courier_daily_stats",
                columns: new[] { "CourierUserId", "Date" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_educational_processes_WorkflowId",
                schema: "nehzat",
                table: "Nehzat_educational_processes",
                column: "WorkflowId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_evaluation_answers_QuestionId",
                schema: "nehzat",
                table: "Nehzat_evaluation_answers",
                column: "QuestionId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_evaluation_answers_RandomEvaluationId",
                schema: "nehzat",
                table: "Nehzat_evaluation_answers",
                column: "RandomEvaluationId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_gamification_profiles_UserId",
                schema: "nehzat",
                table: "Nehzat_gamification_profiles",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_maktab_lookup_Gender_AgeMin_AgeMax",
                schema: "nehzat",
                table: "Nehzat_maktab_lookup",
                columns: new[] { "Gender", "AgeMin", "AgeMax" });

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_notifications_SenderUserId",
                schema: "nehzat",
                table: "Nehzat_notifications",
                column: "SenderUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_order_tracking_points_OrderId",
                schema: "nehzat",
                table: "Nehzat_order_tracking_points",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_progress_metrics_ProgressReportId",
                schema: "nehzat",
                table: "Nehzat_progress_metrics",
                column: "ProgressReportId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_progress_reports_StudentId",
                schema: "nehzat",
                table: "Nehzat_progress_reports",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_question_bank_CreatedByUserId",
                schema: "nehzat",
                table: "Nehzat_question_bank",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_quran_asset_evaluations_EvaluatorUserId",
                schema: "nehzat",
                table: "Nehzat_quran_asset_evaluations",
                column: "EvaluatorUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_quran_asset_evaluations_RingId",
                schema: "nehzat",
                table: "Nehzat_quran_asset_evaluations",
                column: "RingId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_quran_asset_evaluations_StudentId",
                schema: "nehzat",
                table: "Nehzat_quran_asset_evaluations",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_quran_ring_resources_RingId",
                schema: "nehzat",
                table: "Nehzat_quran_ring_resources",
                column: "RingId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_quran_ring_sessions_RingId_SessionNumber",
                schema: "nehzat",
                table: "Nehzat_quran_ring_sessions",
                columns: new[] { "RingId", "SessionNumber" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_quran_ring_surahs_RingId_SurahId",
                schema: "nehzat",
                table: "Nehzat_quran_ring_surahs",
                columns: new[] { "RingId", "SurahId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_quran_ring_surahs_SurahId",
                schema: "nehzat",
                table: "Nehzat_quran_ring_surahs",
                column: "SurahId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_quran_rings_Code",
                schema: "nehzat",
                table: "Nehzat_quran_rings",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_quran_rings_SortOrder",
                schema: "nehzat",
                table: "Nehzat_quran_rings",
                column: "SortOrder");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_quran_session_steps_SessionId_StepOrder",
                schema: "nehzat",
                table: "Nehzat_quran_session_steps",
                columns: new[] { "SessionId", "StepOrder" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_random_evaluations_StudentId",
                schema: "nehzat",
                table: "Nehzat_random_evaluations",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_route_points_RouteId",
                schema: "nehzat",
                table: "Nehzat_route_points",
                column: "RouteId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_student_badges_ProfileId",
                schema: "nehzat",
                table: "Nehzat_student_badges",
                column: "ProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_student_interviews_InterviewerUserId",
                schema: "nehzat",
                table: "Nehzat_student_interviews",
                column: "InterviewerUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_student_interviews_RingId",
                schema: "nehzat",
                table: "Nehzat_student_interviews",
                column: "RingId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_student_interviews_StudentId",
                schema: "nehzat",
                table: "Nehzat_student_interviews",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_student_quran_session_progress_SessionId",
                schema: "nehzat",
                table: "Nehzat_student_quran_session_progress",
                column: "SessionId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_student_quran_session_progress_StudentId_SessionId",
                schema: "nehzat",
                table: "Nehzat_student_quran_session_progress",
                columns: new[] { "StudentId", "SessionId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_student_speed_categories_RingId",
                schema: "nehzat",
                table: "Nehzat_student_speed_categories",
                column: "RingId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_student_speed_categories_StudentId_RingId",
                schema: "nehzat",
                table: "Nehzat_student_speed_categories",
                columns: new[] { "StudentId", "RingId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_student_step_progress_SessionProgressId_StepId",
                schema: "nehzat",
                table: "Nehzat_student_step_progress",
                columns: new[] { "SessionProgressId", "StepId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_student_step_progress_StepId",
                schema: "nehzat",
                table: "Nehzat_student_step_progress",
                column: "StepId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_student_study_paths_CurrentStepId",
                schema: "nehzat",
                table: "Nehzat_student_study_paths",
                column: "CurrentStepId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_student_study_paths_StudentId_StudyPathId",
                schema: "nehzat",
                table: "Nehzat_student_study_paths",
                columns: new[] { "StudentId", "StudyPathId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_student_study_paths_StudyPathId",
                schema: "nehzat",
                table: "Nehzat_student_study_paths",
                column: "StudyPathId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_study_path_accommodations_AccommodationId",
                schema: "nehzat",
                table: "Nehzat_study_path_accommodations",
                column: "AccommodationId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_study_path_accommodations_StudyPathId_AccommodationId",
                schema: "nehzat",
                table: "Nehzat_study_path_accommodations",
                columns: new[] { "StudyPathId", "AccommodationId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_study_path_steps_AssessmentId",
                schema: "nehzat",
                table: "Nehzat_study_path_steps",
                column: "AssessmentId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_study_path_steps_StudyPathId",
                schema: "nehzat",
                table: "Nehzat_study_path_steps",
                column: "StudyPathId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_study_paths_AgeGroupId",
                schema: "nehzat",
                table: "Nehzat_study_paths",
                column: "AgeGroupId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_study_paths_Key",
                schema: "nehzat",
                table: "Nehzat_study_paths",
                column: "Key",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_study_paths_SubjectAreaId",
                schema: "nehzat",
                table: "Nehzat_study_paths",
                column: "SubjectAreaId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_tadabbor_entries_AyahId",
                schema: "nehzat",
                table: "Nehzat_tadabbor_entries",
                column: "AyahId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_tadabbor_entries_StudentId",
                schema: "nehzat",
                table: "Nehzat_tadabbor_entries",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_tadabbor_entries_SurahId",
                schema: "nehzat",
                table: "Nehzat_tadabbor_entries",
                column: "SurahId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_user_devices_DeviceToken",
                schema: "nehzat",
                table: "Nehzat_user_devices",
                column: "DeviceToken",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_user_devices_UserId",
                schema: "nehzat",
                table: "Nehzat_user_devices",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_user_locations_UserId",
                schema: "nehzat",
                table: "Nehzat_user_locations",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_user_message_reads_MessageId",
                schema: "nehzat",
                table: "Nehzat_user_message_reads",
                column: "MessageId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_user_message_reads_UserId",
                schema: "nehzat",
                table: "Nehzat_user_message_reads",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_user_notification_settings_UserId",
                schema: "nehzat",
                table: "Nehzat_user_notification_settings",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_user_notifications_NotificationId",
                schema: "nehzat",
                table: "Nehzat_user_notifications",
                column: "NotificationId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_user_notifications_UserId_IsRead",
                schema: "nehzat",
                table: "Nehzat_user_notifications",
                columns: new[] { "UserId", "IsRead" });

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_user_vocabulary_cards_UserId",
                schema: "nehzat",
                table: "Nehzat_user_vocabulary_cards",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_user_vocabulary_cards_VocabularyWordId",
                schema: "nehzat",
                table: "Nehzat_user_vocabulary_cards",
                column: "VocabularyWordId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_vocabulary_texts_OwnerUserId",
                schema: "nehzat",
                table: "Nehzat_vocabulary_texts",
                column: "OwnerUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_vocabulary_texts_SubjectAreaId",
                schema: "nehzat",
                table: "Nehzat_vocabulary_texts",
                column: "SubjectAreaId");

            migrationBuilder.CreateIndex(
                name: "IX_Nehzat_vocabulary_words_VocabularyTextId",
                schema: "nehzat",
                table: "Nehzat_vocabulary_words",
                column: "VocabularyTextId");

            migrationBuilder.CreateIndex(
                name: "IX_point_transactions_UserId",
                schema: "nehzat",
                table: "point_transactions",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ring_maktabs_halgheh_id",
                schema: "nehzat",
                table: "ring_maktabs",
                column: "halgheh_id");

            migrationBuilder.CreateIndex(
                name: "IX_ring_maktabs_maktab_id",
                schema: "nehzat",
                table: "ring_maktabs",
                column: "maktab_id");

            migrationBuilder.CreateIndex(
                name: "IX_ring_maktabs_ring_id",
                schema: "nehzat",
                table: "ring_maktabs",
                column: "ring_id");

            migrationBuilder.CreateIndex(
                name: "IX_user_badges_BadgeId",
                schema: "nehzat",
                table: "user_badges",
                column: "BadgeId");

            migrationBuilder.CreateIndex(
                name: "IX_user_badges_UserId_BadgeId",
                schema: "nehzat",
                table: "user_badges",
                columns: new[] { "UserId", "BadgeId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_workflow_actions_RequestId",
                schema: "nehzat",
                table: "workflow_actions",
                column: "RequestId");

            migrationBuilder.CreateIndex(
                name: "IX_workflow_actions_StepId",
                schema: "nehzat",
                table: "workflow_actions",
                column: "StepId");

            migrationBuilder.CreateIndex(
                name: "IX_workflow_requests_CreatedBy",
                schema: "nehzat",
                table: "workflow_requests",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_workflow_requests_CurrentStepId",
                schema: "nehzat",
                table: "workflow_requests",
                column: "CurrentStepId");

            migrationBuilder.CreateIndex(
                name: "IX_workflow_requests_Status",
                schema: "nehzat",
                table: "workflow_requests",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_workflow_requests_WorkflowId",
                schema: "nehzat",
                table: "workflow_requests",
                column: "WorkflowId");

            migrationBuilder.CreateIndex(
                name: "IX_workflow_steps_WorkflowId_StepOrder",
                schema: "nehzat",
                table: "workflow_steps",
                columns: new[] { "WorkflowId", "StepOrder" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Nehzat_arabic_lessons_Nehzat_arabic_courses_CourseId",
                schema: "nehzat",
                table: "Nehzat_arabic_lessons",
                column: "CourseId",
                principalSchema: "nehzat",
                principalTable: "Nehzat_arabic_courses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Nehzat_arabic_lessons_Nehzat_arabic_literature_poems_PoemId",
                schema: "nehzat",
                table: "Nehzat_arabic_lessons",
                column: "PoemId",
                principalSchema: "nehzat",
                principalTable: "Nehzat_arabic_literature_poems",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Nehzat_arabic_user_progress_Nehzat_arabic_lessons_LessonId",
                schema: "nehzat",
                table: "Nehzat_arabic_user_progress",
                column: "LessonId",
                principalSchema: "nehzat",
                principalTable: "Nehzat_arabic_lessons",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Nehzat_arabic_user_progress_Nehzat_users_UserId",
                schema: "nehzat",
                table: "Nehzat_arabic_user_progress",
                column: "UserId",
                principalSchema: "nehzat",
                principalTable: "Nehzat_users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Nehzat_assignment_submissions_Nehzat_assignments_AssignmentId",
                schema: "nehzat",
                table: "Nehzat_assignment_submissions",
                column: "AssignmentId",
                principalSchema: "nehzat",
                principalTable: "Nehzat_assignments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Nehzat_assignment_submissions_Nehzat_students_StudentId",
                schema: "nehzat",
                table: "Nehzat_assignment_submissions",
                column: "StudentId",
                principalSchema: "nehzat",
                principalTable: "Nehzat_students",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Nehzat_assignments_Nehzat_courses_CourseId",
                schema: "nehzat",
                table: "Nehzat_assignments",
                column: "CourseId",
                principalSchema: "nehzat",
                principalTable: "Nehzat_courses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Nehzat_assignments_Nehzat_curriculum_objectives_ObjectiveId",
                schema: "nehzat",
                table: "Nehzat_assignments",
                column: "ObjectiveId",
                principalSchema: "nehzat",
                principalTable: "Nehzat_curriculum_objectives",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Nehzat_coach_courses_Nehzat_coaches_CoachId",
                schema: "nehzat",
                table: "Nehzat_coach_courses",
                column: "CoachId",
                principalSchema: "nehzat",
                principalTable: "Nehzat_coaches",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Nehzat_coach_courses_Nehzat_courses_CourseId",
                schema: "nehzat",
                table: "Nehzat_coach_courses",
                column: "CourseId",
                principalSchema: "nehzat",
                principalTable: "Nehzat_courses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Nehzat_competitions_Nehzat_courses_CourseId",
                schema: "nehzat",
                table: "Nehzat_competitions",
                column: "CourseId",
                principalSchema: "nehzat",
                principalTable: "Nehzat_courses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Nehzat_hadith_assessments_Nehzat_hadith_chapters_HadithChapterId",
                schema: "nehzat",
                table: "Nehzat_hadith_assessments",
                column: "HadithChapterId",
                principalSchema: "nehzat",
                principalTable: "Nehzat_hadith_chapters",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Nehzat_hadith_assessments_Nehzat_hadiths_HadithId",
                schema: "nehzat",
                table: "Nehzat_hadith_assessments",
                column: "HadithId",
                principalSchema: "nehzat",
                principalTable: "Nehzat_hadiths",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Nehzat_leagues_Nehzat_courses_CourseId",
                schema: "nehzat",
                table: "Nehzat_leagues",
                column: "CourseId",
                principalSchema: "nehzat",
                principalTable: "Nehzat_courses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Nehzat_quran_student_courses_Nehzat_quran_recitation_levels_RecitationLevelId",
                schema: "nehzat",
                table: "Nehzat_quran_student_courses",
                column: "RecitationLevelId",
                principalSchema: "nehzat",
                principalTable: "Nehzat_quran_recitation_levels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Nehzat_quran_surahs_Nehzat_quran_curricula_QuranCurriculumId",
                schema: "nehzat",
                table: "Nehzat_quran_surahs",
                column: "QuranCurriculumId",
                principalSchema: "nehzat",
                principalTable: "Nehzat_quran_curricula",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Nehzat_student_courses_Nehzat_courses_CourseId",
                schema: "nehzat",
                table: "Nehzat_student_courses",
                column: "CourseId",
                principalSchema: "nehzat",
                principalTable: "Nehzat_courses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Nehzat_student_courses_Nehzat_students_StudentId",
                schema: "nehzat",
                table: "Nehzat_student_courses",
                column: "StudentId",
                principalSchema: "nehzat",
                principalTable: "Nehzat_students",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Nehzat_training_stages_Nehzat_training_stages_PrerequisiteStageId",
                schema: "nehzat",
                table: "Nehzat_training_stages",
                column: "PrerequisiteStageId",
                principalSchema: "nehzat",
                principalTable: "Nehzat_training_stages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Nehzat_users_Nehzat_students_StudentId",
                schema: "nehzat",
                table: "Nehzat_users",
                column: "StudentId",
                principalSchema: "nehzat",
                principalTable: "Nehzat_students",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Nehzat_arabic_lessons_Nehzat_arabic_courses_CourseId",
                schema: "nehzat",
                table: "Nehzat_arabic_lessons");

            migrationBuilder.DropForeignKey(
                name: "FK_Nehzat_arabic_lessons_Nehzat_arabic_literature_poems_PoemId",
                schema: "nehzat",
                table: "Nehzat_arabic_lessons");

            migrationBuilder.DropForeignKey(
                name: "FK_Nehzat_arabic_user_progress_Nehzat_arabic_lessons_LessonId",
                schema: "nehzat",
                table: "Nehzat_arabic_user_progress");

            migrationBuilder.DropForeignKey(
                name: "FK_Nehzat_arabic_user_progress_Nehzat_users_UserId",
                schema: "nehzat",
                table: "Nehzat_arabic_user_progress");

            migrationBuilder.DropForeignKey(
                name: "FK_Nehzat_assignment_submissions_Nehzat_assignments_AssignmentId",
                schema: "nehzat",
                table: "Nehzat_assignment_submissions");

            migrationBuilder.DropForeignKey(
                name: "FK_Nehzat_assignment_submissions_Nehzat_students_StudentId",
                schema: "nehzat",
                table: "Nehzat_assignment_submissions");

            migrationBuilder.DropForeignKey(
                name: "FK_Nehzat_assignments_Nehzat_courses_CourseId",
                schema: "nehzat",
                table: "Nehzat_assignments");

            migrationBuilder.DropForeignKey(
                name: "FK_Nehzat_assignments_Nehzat_curriculum_objectives_ObjectiveId",
                schema: "nehzat",
                table: "Nehzat_assignments");

            migrationBuilder.DropForeignKey(
                name: "FK_Nehzat_coach_courses_Nehzat_coaches_CoachId",
                schema: "nehzat",
                table: "Nehzat_coach_courses");

            migrationBuilder.DropForeignKey(
                name: "FK_Nehzat_coach_courses_Nehzat_courses_CourseId",
                schema: "nehzat",
                table: "Nehzat_coach_courses");

            migrationBuilder.DropForeignKey(
                name: "FK_Nehzat_competitions_Nehzat_courses_CourseId",
                schema: "nehzat",
                table: "Nehzat_competitions");

            migrationBuilder.DropForeignKey(
                name: "FK_Nehzat_hadith_assessments_Nehzat_hadith_chapters_HadithChapterId",
                schema: "nehzat",
                table: "Nehzat_hadith_assessments");

            migrationBuilder.DropForeignKey(
                name: "FK_Nehzat_hadith_assessments_Nehzat_hadiths_HadithId",
                schema: "nehzat",
                table: "Nehzat_hadith_assessments");

            migrationBuilder.DropForeignKey(
                name: "FK_Nehzat_leagues_Nehzat_courses_CourseId",
                schema: "nehzat",
                table: "Nehzat_leagues");

            migrationBuilder.DropForeignKey(
                name: "FK_Nehzat_quran_student_courses_Nehzat_quran_recitation_levels_RecitationLevelId",
                schema: "nehzat",
                table: "Nehzat_quran_student_courses");

            migrationBuilder.DropForeignKey(
                name: "FK_Nehzat_quran_surahs_Nehzat_quran_curricula_QuranCurriculumId",
                schema: "nehzat",
                table: "Nehzat_quran_surahs");

            migrationBuilder.DropForeignKey(
                name: "FK_Nehzat_student_courses_Nehzat_courses_CourseId",
                schema: "nehzat",
                table: "Nehzat_student_courses");

            migrationBuilder.DropForeignKey(
                name: "FK_Nehzat_student_courses_Nehzat_students_StudentId",
                schema: "nehzat",
                table: "Nehzat_student_courses");

            migrationBuilder.DropForeignKey(
                name: "FK_Nehzat_training_stages_Nehzat_training_stages_PrerequisiteStageId",
                schema: "nehzat",
                table: "Nehzat_training_stages");

            migrationBuilder.DropForeignKey(
                name: "FK_Nehzat_users_Nehzat_students_StudentId",
                schema: "nehzat",
                table: "Nehzat_users");

            migrationBuilder.DropTable(
                name: "ai_messages",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "ConversationMembers",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "halgheh_assignment_submissions",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "halgheh_members",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "knowledge_documents",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "maktab_members",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "MessageAttachments",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_calendar_event_attendees",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_coach_files",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_coach_interviews",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_courier_daily_stats",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_educational_processes",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_evaluation_answers",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_maktab_lookup",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_order_tracking_points",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_progress_metrics",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_qr_sessions",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_quran_asset_evaluations",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_quran_ring_resources",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_quran_ring_surahs",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_route_points",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_student_badges",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_student_interviews",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_student_speed_categories",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_student_step_progress",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_student_study_paths",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_study_path_accommodations",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_tadabbor_entries",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_user_devices",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_user_locations",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_user_message_reads",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_user_notification_settings",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_user_notifications",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_user_vocabulary_cards",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "point_transactions",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "ring_maktabs",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "user_badges",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "workflow_actions",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "ai_conversations",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "halgheh_assignments",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_calendar_events",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_question_bank",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_random_evaluations",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_map_orders",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_progress_reports",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_delivery_routes",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_gamification_profiles",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_quran_session_steps",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_student_quran_session_progress",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_study_path_steps",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_accommodations",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Messages",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_notifications",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_vocabulary_words",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "badges",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "workflow_requests",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "halghehs",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_quran_ring_sessions",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_study_paths",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Conversations",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_vocabulary_texts",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "workflow_steps",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "Nehzat_quran_rings",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "maktabs",
                schema: "nehzat");

            migrationBuilder.DropTable(
                name: "workflow_definitions",
                schema: "nehzat");

            migrationBuilder.DropColumn(
                name: "Biography",
                schema: "nehzat",
                table: "Nehzat_users");

            migrationBuilder.DropColumn(
                name: "LastLoginAt",
                schema: "nehzat",
                table: "Nehzat_users");

            migrationBuilder.DropColumn(
                name: "NationalCode",
                schema: "nehzat",
                table: "Nehzat_users");

            migrationBuilder.DropColumn(
                name: "Phase",
                schema: "nehzat",
                table: "Nehzat_students");

            migrationBuilder.DropColumn(
                name: "CoverImageUrl",
                schema: "nehzat",
                table: "Nehzat_books");

            migrationBuilder.AlterColumn<string>(
                name: "MatnArabic",
                schema: "nehzat",
                table: "Nehzat_hadiths",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddForeignKey(
                name: "FK_Nehzat_arabic_lessons_Nehzat_arabic_courses_CourseId",
                schema: "nehzat",
                table: "Nehzat_arabic_lessons",
                column: "CourseId",
                principalSchema: "nehzat",
                principalTable: "Nehzat_arabic_courses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Nehzat_arabic_lessons_Nehzat_arabic_literature_poems_PoemId",
                schema: "nehzat",
                table: "Nehzat_arabic_lessons",
                column: "PoemId",
                principalSchema: "nehzat",
                principalTable: "Nehzat_arabic_literature_poems",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Nehzat_arabic_user_progress_Nehzat_arabic_lessons_LessonId",
                schema: "nehzat",
                table: "Nehzat_arabic_user_progress",
                column: "LessonId",
                principalSchema: "nehzat",
                principalTable: "Nehzat_arabic_lessons",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Nehzat_arabic_user_progress_Nehzat_users_UserId",
                schema: "nehzat",
                table: "Nehzat_arabic_user_progress",
                column: "UserId",
                principalSchema: "nehzat",
                principalTable: "Nehzat_users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Nehzat_assignment_submissions_Nehzat_assignments_AssignmentId",
                schema: "nehzat",
                table: "Nehzat_assignment_submissions",
                column: "AssignmentId",
                principalSchema: "nehzat",
                principalTable: "Nehzat_assignments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Nehzat_assignment_submissions_Nehzat_students_StudentId",
                schema: "nehzat",
                table: "Nehzat_assignment_submissions",
                column: "StudentId",
                principalSchema: "nehzat",
                principalTable: "Nehzat_students",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Nehzat_assignments_Nehzat_courses_CourseId",
                schema: "nehzat",
                table: "Nehzat_assignments",
                column: "CourseId",
                principalSchema: "nehzat",
                principalTable: "Nehzat_courses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Nehzat_assignments_Nehzat_curriculum_objectives_ObjectiveId",
                schema: "nehzat",
                table: "Nehzat_assignments",
                column: "ObjectiveId",
                principalSchema: "nehzat",
                principalTable: "Nehzat_curriculum_objectives",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Nehzat_coach_courses_Nehzat_coaches_CoachId",
                schema: "nehzat",
                table: "Nehzat_coach_courses",
                column: "CoachId",
                principalSchema: "nehzat",
                principalTable: "Nehzat_coaches",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Nehzat_coach_courses_Nehzat_courses_CourseId",
                schema: "nehzat",
                table: "Nehzat_coach_courses",
                column: "CourseId",
                principalSchema: "nehzat",
                principalTable: "Nehzat_courses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Nehzat_competitions_Nehzat_courses_CourseId",
                schema: "nehzat",
                table: "Nehzat_competitions",
                column: "CourseId",
                principalSchema: "nehzat",
                principalTable: "Nehzat_courses",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Nehzat_hadith_assessments_Nehzat_hadith_chapters_HadithChapterId",
                schema: "nehzat",
                table: "Nehzat_hadith_assessments",
                column: "HadithChapterId",
                principalSchema: "nehzat",
                principalTable: "Nehzat_hadith_chapters",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Nehzat_hadith_assessments_Nehzat_hadiths_HadithId",
                schema: "nehzat",
                table: "Nehzat_hadith_assessments",
                column: "HadithId",
                principalSchema: "nehzat",
                principalTable: "Nehzat_hadiths",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Nehzat_leagues_Nehzat_courses_CourseId",
                schema: "nehzat",
                table: "Nehzat_leagues",
                column: "CourseId",
                principalSchema: "nehzat",
                principalTable: "Nehzat_courses",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Nehzat_quran_student_courses_Nehzat_quran_recitation_levels_RecitationLevelId",
                schema: "nehzat",
                table: "Nehzat_quran_student_courses",
                column: "RecitationLevelId",
                principalSchema: "nehzat",
                principalTable: "Nehzat_quran_recitation_levels",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Nehzat_quran_surahs_Nehzat_quran_curricula_QuranCurriculumId",
                schema: "nehzat",
                table: "Nehzat_quran_surahs",
                column: "QuranCurriculumId",
                principalSchema: "nehzat",
                principalTable: "Nehzat_quran_curricula",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Nehzat_student_courses_Nehzat_courses_CourseId",
                schema: "nehzat",
                table: "Nehzat_student_courses",
                column: "CourseId",
                principalSchema: "nehzat",
                principalTable: "Nehzat_courses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Nehzat_student_courses_Nehzat_students_StudentId",
                schema: "nehzat",
                table: "Nehzat_student_courses",
                column: "StudentId",
                principalSchema: "nehzat",
                principalTable: "Nehzat_students",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Nehzat_training_stages_Nehzat_training_stages_PrerequisiteStageId",
                schema: "nehzat",
                table: "Nehzat_training_stages",
                column: "PrerequisiteStageId",
                principalSchema: "nehzat",
                principalTable: "Nehzat_training_stages",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Nehzat_users_Nehzat_students_StudentId",
                schema: "nehzat",
                table: "Nehzat_users",
                column: "StudentId",
                principalSchema: "nehzat",
                principalTable: "Nehzat_students",
                principalColumn: "Id");
        }
    }
}
