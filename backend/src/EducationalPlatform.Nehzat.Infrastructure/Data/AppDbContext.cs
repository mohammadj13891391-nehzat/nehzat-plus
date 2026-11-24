using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Domain.Entities.Quran;
using EducationalPlatform.Nehzat.Domain.Entities.Hadith;
using EducationalPlatform.Nehzat.Domain.Entities.PersianLiterature;
using EducationalPlatform.Nehzat.Domain.Entities.Math;
using EducationalPlatform.Nehzat.Domain.Entities.ArabicLiterature;
using EducationalPlatform.Nehzat.Domain.Entities.Math;
using EducationalPlatform.Nehzat.Domain.Entities.ExperimentalScience;
using PersLitQuiz = EducationalPlatform.Nehzat.Domain.Entities.PersianLiterature.Quiz;
using PersLitQuizQuestion = EducationalPlatform.Nehzat.Domain.Entities.PersianLiterature.QuizQuestion;

namespace EducationalPlatform.Nehzat.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Student> Students => Set<Student>();
    public DbSet<Course> Courses => Set<Course>();
    public DbSet<Assignment> Assignments => Set<Assignment>();
    public DbSet<AssignmentSubmission> AssignmentSubmissions => Set<AssignmentSubmission>();
    public DbSet<AssignmentAttachment> AssignmentAttachments => Set<AssignmentAttachment>();
    public DbSet<StudentCourse> StudentCourses => Set<StudentCourse>();
    public DbSet<Branch> Branches => Set<Branch>();
    public DbSet<Coach> Coaches => Set<Coach>();
    public DbSet<CoachCourse> CoachCourses => Set<CoachCourse>();
    public DbSet<CoachFile> CoachFiles => Set<CoachFile>();
    public DbSet<BranchManager> BranchManagers => Set<BranchManager>();
    public DbSet<Parent> Parents => Set<Parent>();
    public DbSet<Evaluator> Evaluators => Set<Evaluator>();
    public DbSet<Assessment> Assessments => Set<Assessment>();
    public DbSet<AssessmentQuestion> AssessmentQuestions => Set<AssessmentQuestion>();
    public DbSet<AssessmentResult> AssessmentResults => Set<AssessmentResult>();
    public DbSet<LogEntry> LogEntries => Set<LogEntry>();

    public DbSet<NehzatSection> NehzatSections => Set<NehzatSection>();
    public DbSet<Madrasah> Madrasahs => Set<Madrasah>();
    public DbSet<MadrasahBranch> MadrasahBranches => Set<MadrasahBranch>();
    public DbSet<MaktabSubSection> MaktabSubSections => Set<MaktabSubSection>();
    public DbSet<ParentStudent> ParentStudents => Set<ParentStudent>();
    public DbSet<EvaluatorMadrasah> EvaluatorMadrasahs => Set<EvaluatorMadrasah>();

    public DbSet<SubjectArea> SubjectAreas => Set<SubjectArea>();
    public DbSet<TeachingMethod> TeachingMethods => Set<TeachingMethod>();
    public DbSet<Ring> Rings => Set<Ring>();
    public DbSet<RingStudent> RingStudents => Set<RingStudent>();
    public DbSet<CurriculumObjective> CurriculumObjectives => Set<CurriculumObjective>();
    public DbSet<Book> Books => Set<Book>();
    public DbSet<RingBook> RingBooks => Set<RingBook>();

    public DbSet<VocabularyText> VocabularyTexts => Set<VocabularyText>();
    public DbSet<VocabularyWord> VocabularyWords => Set<VocabularyWord>();
    public DbSet<UserVocabularyCard> UserVocabularyCards => Set<UserVocabularyCard>();
    public DbSet<RingTeachingMethod> RingTeachingMethods => Set<RingTeachingMethod>();

    public DbSet<AgeGroup> AgeGroups => Set<AgeGroup>();
    public DbSet<StudentSkillProgress> StudentSkillProgressList => Set<StudentSkillProgress>();

    public DbSet<SpiritualPracticeItem> SpiritualPracticeItems => Set<SpiritualPracticeItem>();
    public DbSet<SpiritualOccasion> SpiritualOccasions => Set<SpiritualOccasion>();
    public DbSet<SpiritualOccasionPractice> SpiritualOccasionPractices => Set<SpiritualOccasionPractice>();
    public DbSet<DailySpiritualEntry> DailySpiritualEntries => Set<DailySpiritualEntry>();
    public DbSet<DailyActivity> DailyActivities => Set<DailyActivity>();
    public DbSet<XpBadge> XpBadges => Set<XpBadge>();
    public DbSet<UserXp> UserXp => Set<UserXp>();
    public DbSet<UserXpTransaction> XpTransactions => Set<UserXpTransaction>();
    public DbSet<Badge> Badges => Set<Badge>();
    public DbSet<UserBadge> UserBadges => Set<UserBadge>();
    public DbSet<PointTransaction> PointTransactions => Set<PointTransaction>();
    public DbSet<Artwork> Artworks => Set<Artwork>();
    public DbSet<MusicRecord> MusicRecords => Set<MusicRecord>();
    public DbSet<CalligraphySample> CalligraphySamples => Set<CalligraphySample>();
    public DbSet<UserOccasionProgress> UserOccasionProgress => Set<UserOccasionProgress>();
    public DbSet<SpiritualPath> SpiritualPaths => Set<SpiritualPath>();
    public DbSet<StudentPathSelection> StudentPathSelections => Set<StudentPathSelection>();
    public DbSet<StudentPathRanking> StudentPathRankings => Set<StudentPathRanking>();
    public DbSet<StudentPathHistory> StudentPathHistory => Set<StudentPathHistory>();

    public DbSet<StudyPath> StudyPaths => Set<StudyPath>();
    public DbSet<StudyPathStep> StudyPathSteps => Set<StudyPathStep>();
    public DbSet<StudentStudyPath> StudentStudyPaths => Set<StudentStudyPath>();
    public DbSet<Accommodation> Accommodations => Set<Accommodation>();
    public DbSet<StudyPathAccommodation> StudyPathAccommodations => Set<StudyPathAccommodation>();

    public DbSet<CurriculumVersion> CurriculumVersions => Set<CurriculumVersion>();
    public DbSet<MonthlyBooklet> MonthlyBooklets => Set<MonthlyBooklet>();

    public DbSet<Teacher> Teachers => Set<Teacher>();
    public DbSet<TeacherCourse> TeacherCourses => Set<TeacherCourse>();
  public DbSet<AssignmentGrading> AssignmentGradings => Set<AssignmentGrading>();

  public DbSet<Competition> Competitions => Set<Competition>();

  public DbSet<IssueSurvey> IssueSurveys => Set<IssueSurvey>();
  public DbSet<IssueItemPool> IssueItemPools => Set<IssueItemPool>();
  public DbSet<IssueSurveyQuestion> IssueSurveyQuestions => Set<IssueSurveyQuestion>();
  public DbSet<IssueSurveyResponse> IssueSurveyResponses => Set<IssueSurveyResponse>();
  public DbSet<IssueSurveyComment> IssueSurveyComments => Set<IssueSurveyComment>();
  public DbSet<IssueAction> IssueActions => Set<IssueAction>();
  public DbSet<IssueActionUpdate> IssueActionUpdates => Set<IssueActionUpdate>();
  public DbSet<CompetitionParticipant> CompetitionParticipants => Set<CompetitionParticipant>();
  public DbSet<League> Leagues => Set<League>();
  public DbSet<LeagueRanking> LeagueRankings => Set<LeagueRanking>();

  public DbSet<Surah> Surahs => Set<Surah>();
  public DbSet<Ayah> Ayahs => Set<Ayah>();
  public DbSet<TajweedRule> TajweedRules => Set<TajweedRule>();
  public DbSet<QuranStudentCourse> QuranStudentCourses => Set<QuranStudentCourse>();
  public DbSet<RecitationLevel> RecitationLevels => Set<RecitationLevel>();
  public DbSet<QuranCurriculum> QuranCurricula => Set<QuranCurriculum>();
  public DbSet<QuranStudentProgress> QuranStudentProgresses => Set<QuranStudentProgress>();

  // Phase 19: Quran Ring System
  public DbSet<QuranRing> QuranRings => Set<QuranRing>();
  public DbSet<QuranRingSession> QuranRingSessions => Set<QuranRingSession>();
  public DbSet<QuranSessionStep> QuranSessionSteps => Set<QuranSessionStep>();
  public DbSet<StudentQuranSessionProgress> StudentQuranSessionProgresses => Set<StudentQuranSessionProgress>();
  public DbSet<StudentStepProgress> StudentStepProgresses => Set<StudentStepProgress>();
  public DbSet<StudentSpeedCategory> StudentSpeedCategories => Set<StudentSpeedCategory>();
  public DbSet<TadabborEntry> TadabborEntries => Set<TadabborEntry>();
  public DbSet<QuranAssetEvaluation> QuranAssetEvaluations => Set<QuranAssetEvaluation>();
  public DbSet<CoachInterview> CoachInterviews => Set<CoachInterview>();
  public DbSet<StudentInterview> StudentInterviews => Set<StudentInterview>();
  public DbSet<QuranRingSurah> QuranRingSurahs => Set<QuranRingSurah>();
  public DbSet<QuranRingResource> QuranRingResources => Set<QuranRingResource>();

  public DbSet<HadithBook> HadithBooks => Set<HadithBook>();
  public DbSet<HadithChapter> HadithChapters => Set<HadithChapter>();
  public DbSet<Hadith> Hadiths => Set<Hadith>();
  public DbSet<UserHadithProgress> UserHadithProgresses => Set<UserHadithProgress>();
  public DbSet<HadithAssessment> HadithAssessments => Set<HadithAssessment>();

  public DbSet<Poet> PersianLiteraturePoets => Set<Poet>();
  public DbSet<Poem> PersianLiteraturePoems => Set<Poem>();
  public DbSet<PoemAnalysis> PersianLiteratureAnalyses => Set<PoemAnalysis>();

  public DbSet<MathTopic> MathTopics => Set<MathTopic>();
  public DbSet<MathLesson> MathLessons => Set<MathLesson>();
  public DbSet<MathQuestion> MathQuestions => Set<MathQuestion>();
  public DbSet<MathProgress> MathProgresses => Set<MathProgress>();
  public DbSet<MathScholar> MathScholars => Set<MathScholar>();
  public DbSet<MathContribution> MathContributions => Set<MathContribution>();

  public DbSet<ArabicPoet> ArabicLiteraturePoets => Set<ArabicPoet>();
  public DbSet<ArabicPoem> ArabicLiteraturePoems => Set<ArabicPoem>();
  public DbSet<ArabicPoemAnalysis> ArabicLiteratureAnalyses => Set<ArabicPoemAnalysis>();
  public DbSet<ArabicCourse> ArabicCourses => Set<ArabicCourse>();
  public DbSet<ArabicLesson> ArabicLessons => Set<ArabicLesson>();
  public DbSet<ArabicUserProgress> ArabicUserProgresses => Set<ArabicUserProgress>();

  public DbSet<LearningPath> LearningPaths => Set<LearningPath>();
  public DbSet<LearningLevel> LearningLevels => Set<LearningLevel>();
  public DbSet<StudyModule> StudyModules => Set<StudyModule>();
  public DbSet<StudyLesson> StudyLessons => Set<StudyLesson>();
  public DbSet<LessonContentBlock> LessonContentBlocks => Set<LessonContentBlock>();
  public DbSet<PersLitQuiz> Quizzes => Set<PersLitQuiz>();
  public DbSet<PersLitQuizQuestion> QuizQuestions => Set<PersLitQuizQuestion>();
  public DbSet<QuizOption> QuizOptions => Set<QuizOption>();
  public DbSet<UserEnrollment> UserEnrollments => Set<UserEnrollment>();
  public DbSet<UserLessonProgress> UserLessonProgresses => Set<UserLessonProgress>();
  public DbSet<UserQuizAttempt> UserQuizAttempts => Set<UserQuizAttempt>();

  public DbSet<ExperimentTopic> ExperimentalScienceTopics => Set<ExperimentTopic>();
  public DbSet<Experiment> ExperimentalScienceExperiments => Set<Experiment>();
  public DbSet<ExperimentAnalysis> ExperimentalScienceAnalyses => Set<ExperimentAnalysis>();
  public DbSet<ExperimentQuestion> ExperimentalScienceQuestions => Set<ExperimentQuestion>();
  public DbSet<ExperimentAttempt> ExperimentalScienceAttempts => Set<ExperimentAttempt>();
  public DbSet<ExperimentProgress> ExperimentalScienceProgresses => Set<ExperimentProgress>();

  public DbSet<SpacedRepetitionCard> SpacedRepetitionCards => Set<SpacedRepetitionCard>();

  public DbSet<TrainingCourse> TrainingCourses => Set<TrainingCourse>();
  public DbSet<TrainingStage> TrainingStages => Set<TrainingStage>();
  public DbSet<TrainingSession> TrainingSessions => Set<TrainingSession>();
  public DbSet<TrainingContent> TrainingContents => Set<TrainingContent>();
  public DbSet<TrainingEnrollment> TrainingEnrollments => Set<TrainingEnrollment>();
  public DbSet<TrainingProgress> TrainingProgresses => Set<TrainingProgress>();
  public DbSet<TrainingAssignment> TrainingAssignments => Set<TrainingAssignment>();
  public DbSet<TrainingSubmission> TrainingSubmissions => Set<TrainingSubmission>();

  public DbSet<Maktab> Maktabs => Set<Maktab>();
  public DbSet<Halgheh> Halghehs => Set<Halgheh>();
  public DbSet<HalghehMember> HalghehMembers => Set<HalghehMember>();
  public DbSet<HalghehAssignment> HalghehAssignments => Set<HalghehAssignment>();
  public DbSet<HalghehAssignmentSubmission> HalghehAssignmentSubmissions => Set<HalghehAssignmentSubmission>();
    public DbSet<MaktabMember> MaktabMembers => Set<MaktabMember>();
    public DbSet<RingMaktab> RingMaktabs => Set<RingMaktab>();
    public DbSet<MaktabLookup> MaktabLookups => Set<MaktabLookup>();

    public DbSet<GamificationProfile> GamificationProfiles => Set<GamificationProfile>();
    public DbSet<StudentBadge> StudentBadges => Set<StudentBadge>();
    public DbSet<UserMessageRead> UserMessageReads => Set<UserMessageRead>();
    public DbSet<QrSession> QrSessions => Set<QrSession>();

    public DbSet<KnowledgeDocument> KnowledgeDocuments => Set<KnowledgeDocument>();
    public DbSet<AiConversation> AiConversations => Set<AiConversation>();
    public DbSet<AiMessage> AiMessages => Set<AiMessage>();

    // Phase 2: Messaging
    public DbSet<Conversation> Conversations => Set<Conversation>();
    public DbSet<ConversationMember> ConversationMembers => Set<ConversationMember>();
    public DbSet<Message> Messages => Set<Message>();
    public DbSet<MessageAttachment> MessageAttachments => Set<MessageAttachment>();

    // Phase 3: Workflow
    public DbSet<WorkflowDefinition> WorkflowDefinitions => Set<WorkflowDefinition>();
    public DbSet<WorkflowStep> WorkflowSteps => Set<WorkflowStep>();
    public DbSet<WorkflowRequest> WorkflowRequests => Set<WorkflowRequest>();
    public DbSet<WorkflowAction> WorkflowActions => Set<WorkflowAction>();
    public DbSet<EducationalProcess> EducationalProcesses => Set<EducationalProcess>();

    // Phase 16: Map & Geo
    public DbSet<UserLocation> UserLocations => Set<UserLocation>();
    public DbSet<MapOrder> MapOrders => Set<MapOrder>();
    public DbSet<OrderTrackingPoint> OrderTrackingPoints => Set<OrderTrackingPoint>();
    public DbSet<DeliveryRoute> DeliveryRoutes => Set<DeliveryRoute>();
    public DbSet<RoutePoint> RoutePoints => Set<RoutePoint>();

    // Phase 11: Calendar
    public DbSet<CalendarEvent> CalendarEvents => Set<CalendarEvent>();
    public DbSet<CalendarEventAttendee> CalendarEventAttendees => Set<CalendarEventAttendee>();

    // Phase 8: Profile
    public DbSet<UserNotificationSettings> UserNotificationSettings => Set<UserNotificationSettings>();
    public DbSet<Question> Questions => Set<Question>();
    public DbSet<RandomEvaluation> RandomEvaluations => Set<RandomEvaluation>();
    public DbSet<EvaluationAnswer> EvaluationAnswers => Set<EvaluationAnswer>();

    // Phase 17: Notifications, Devices, Courier Reports
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<UserNotification> UserNotifications => Set<UserNotification>();
    public DbSet<UserDevice> UserDevices => Set<UserDevice>();
    public DbSet<CourierDailyStat> CourierDailyStats => Set<CourierDailyStat>();

    // Phase 10: Progress
    public DbSet<ProgressReport> ProgressReports => Set<ProgressReport>();
    public DbSet<ProgressMetric> ProgressMetrics => Set<ProgressMetric>();


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("nehzat");

        // Global: set ALL FKs to Restrict by default to prevent circular cascade
        // constraint issues during EnsureCreated(). Individual configs can override.
        foreach (var fk in modelBuilder.Model.GetEntityTypes()
            .SelectMany(t => t.GetForeignKeys()))
        {
            fk.DeleteBehavior = DeleteBehavior.Restrict;
        }

        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(e => e.Username).IsUnique();
            entity.HasIndex(e => e.OidcSubject).IsUnique().HasFilter("[OidcSubject] IS NOT NULL");
            entity.HasOne(e => e.Student)
                  .WithMany()
                  .HasForeignKey(e => e.StudentId)
                  .IsRequired(false);
        });

        modelBuilder.Entity<Branch>(entity =>
        {
            entity.HasIndex(e => e.Name).IsUnique();
        });

        modelBuilder.Entity<Student>(entity =>
        {
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasIndex(e => e.StudentId).IsUnique();

            entity.HasOne(e => e.Branch)
                  .WithMany()
                  .HasForeignKey(e => e.BranchId)
                  .IsRequired(false)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Assignment>(entity =>
        {
            entity.HasOne(e => e.Course)
                  .WithMany(c => c.Assignments)
                  .HasForeignKey(e => e.CourseId);
        });

        modelBuilder.Entity<AssignmentSubmission>(entity =>
        {
            entity.HasOne(e => e.Student)
                  .WithMany(s => s.Submissions)
                  .HasForeignKey(e => e.StudentId);

            entity.HasOne(e => e.Assignment)
                  .WithMany(a => a.Submissions)
                  .HasForeignKey(e => e.AssignmentId);
        });

        modelBuilder.Entity<AssignmentAttachment>(entity =>
        {
            entity.HasOne(e => e.Assignment)
                  .WithMany(a => a.Attachments)
                  .HasForeignKey(e => e.AssignmentId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<StudentCourse>(entity =>
        {
            entity.HasOne(e => e.Student)
                  .WithMany(s => s.StudentCourses)
                  .HasForeignKey(e => e.StudentId);

            entity.HasOne(e => e.Course)
                  .WithMany(c => c.StudentCourses)
                  .HasForeignKey(e => e.CourseId);
        });

        modelBuilder.Entity<Coach>(entity =>
        {
            entity.HasIndex(e => e.Username).IsUnique();
            entity.HasIndex(e => e.Email).IsUnique();

            entity.HasOne(e => e.Branch)
                  .WithMany()
                  .HasForeignKey(e => e.BranchId)
                  .IsRequired(false)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<CoachCourse>(entity =>
        {
            entity.HasOne(e => e.Coach)
                  .WithMany(c => c.CoachCourses)
                  .HasForeignKey(e => e.CoachId);

            entity.HasOne(e => e.Course)
                  .WithMany()
                  .HasForeignKey(e => e.CourseId);
        });

        modelBuilder.Entity<CoachFile>(entity =>
        {
            entity.HasOne(e => e.Coach)
                  .WithMany(c => c.Files)
                  .HasForeignKey(e => e.CoachId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => e.CoachId);
        });

        modelBuilder.Entity<BranchManager>(entity =>
        {
            entity.HasIndex(e => e.Username).IsUnique();
            entity.HasIndex(e => e.Email).IsUnique();

            entity.HasOne(e => e.Branch)
                  .WithMany()
                  .HasForeignKey(e => e.BranchId)
                  .IsRequired(true)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Parent>(entity =>
        {
            entity.HasIndex(e => e.Username).IsUnique();
            entity.HasIndex(e => e.Email).IsUnique();

            entity.HasOne(e => e.Branch)
                  .WithMany()
                  .HasForeignKey(e => e.BranchId)
                  .IsRequired(false)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Evaluator>(entity =>
        {
            entity.HasIndex(e => e.Username).IsUnique();
            entity.HasIndex(e => e.Email).IsUnique();

            entity.HasOne(e => e.Branch)
                  .WithMany()
                  .HasForeignKey(e => e.BranchId)
                  .IsRequired(false)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Assessment>(entity =>
        {
            entity.HasOne(e => e.Course)
                  .WithMany()
                  .HasForeignKey(e => e.CourseId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.GeneratedByUser)
                  .WithMany()
                  .HasForeignKey(e => e.GeneratedByUserId)
                  .IsRequired(false)
                  .OnDelete(DeleteBehavior.SetNull);

            entity.HasIndex(e => e.CourseId);
            entity.HasIndex(e => e.AssessmentDate);
            entity.HasIndex(e => e.Status);
        });

        modelBuilder.Entity<AssessmentQuestion>(entity =>
        {
            entity.HasOne(e => e.Assessment)
                  .WithMany(a => a.Questions)
                  .HasForeignKey(e => e.AssessmentId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => e.AssessmentId);
            entity.HasIndex(e => e.Topic);
            entity.HasIndex(e => e.Difficulty);
        });

        modelBuilder.Entity<AssessmentResult>(entity =>
        {
            entity.HasOne(e => e.Assessment)
                  .WithMany(a => a.Results)
                  .HasForeignKey(e => e.AssessmentId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Student)
                  .WithMany()
                  .HasForeignKey(e => e.StudentId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(e => e.AssessmentId);
            entity.HasIndex(e => e.StudentId);
            entity.HasIndex(e => e.CompletedAt);
        });

        modelBuilder.Entity<NehzatSection>(entity =>
        {
            entity.HasIndex(e => e.Key).IsUnique();
            entity.HasOne(e => e.ParentSection)
                  .WithMany(s => s.ChildSections)
                  .HasForeignKey(e => e.ParentSectionId)
                  .IsRequired(false)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Madrasah>(entity =>
        {
            entity.HasIndex(e => e.Key).IsUnique();
            entity.HasOne(e => e.Section)
                  .WithMany(s => s.Madrasahs)
                  .HasForeignKey(e => e.SectionId)
                  .IsRequired(false)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<MadrasahBranch>(entity =>
        {
            entity.HasOne(e => e.Madrasah)
                  .WithMany(m => m.Branches)
                  .HasForeignKey(e => e.MadrasahId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<MaktabSubSection>(entity =>
        {
            entity.HasOne(e => e.MadrasahBranch)
                  .WithMany(b => b.SubSections)
                  .HasForeignKey(e => e.MadrasahBranchId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ParentStudent>(entity =>
        {
            entity.HasOne(e => e.Parent)
                  .WithMany(p => p.ParentStudents)
                  .HasForeignKey(e => e.ParentId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Student)
                  .WithMany()
                  .HasForeignKey(e => e.StudentId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => new { e.ParentId, e.StudentId }).IsUnique();
        });

        modelBuilder.Entity<Maktab>(entity =>
        {
            entity.HasIndex(e => e.InviteCode).IsUnique();
            entity.HasIndex(e => e.OwnerUserId);
            entity.HasQueryFilter(e => !e.IsDeleted);

            entity.HasOne(e => e.Owner)
                .WithMany()
                .HasForeignKey(e => e.OwnerUserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<MaktabMember>(entity =>
        {
            entity.HasIndex(e => new { e.MaktabId, e.UserId }).IsUnique();

            entity.HasOne(e => e.Maktab)
                .WithMany(m => m.Members)
                .HasForeignKey(e => e.MaktabId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<MaktabLookup>(entity =>
        {
            entity.HasIndex(e => new { e.Gender, e.AgeMin, e.AgeMax });
        });

        modelBuilder.Entity<Halgheh>(entity =>
        {
            entity.HasQueryFilter(e => !e.IsDeleted);
            entity.HasIndex(e => e.MaktabId);
            entity.HasOne(e => e.Moderator)
                .WithMany()
                .HasForeignKey(e => e.ModeratorUserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<HalghehMember>(entity =>
        {
            entity.HasIndex(e => new { e.HalghehId, e.UserId }).IsUnique();

            entity.HasOne(e => e.Halgheh)
                .WithMany(h => h.Members)
                .HasForeignKey(e => e.HalghehId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<HalghehAssignment>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).HasMaxLength(2000);
            entity.Property(e => e.Status).IsRequired().HasMaxLength(20);

            entity.HasIndex(e => new { e.HalghehId, e.Status });

            entity.HasOne(e => e.Halgheh)
                .WithMany()
                .HasForeignKey(e => e.HalghehId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<HalghehAssignmentSubmission>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Content).IsRequired();
            entity.Property(e => e.Status).IsRequired().HasMaxLength(20);
            entity.Property(e => e.Feedback).HasMaxLength(2000);

            entity.HasIndex(e => new { e.HalghehAssignmentId, e.UserId }).IsUnique();

            entity.HasOne(e => e.HalghehAssignment)
                .WithMany(a => a.Submissions)
                .HasForeignKey(e => e.HalghehAssignmentId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<EvaluatorMadrasah>(entity =>
        {
            entity.HasOne(e => e.Evaluator)
                  .WithMany(ev => ev.EvaluatorMadrasahs)
                  .HasForeignKey(e => e.EvaluatorId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Madrasah)
                  .WithMany()
                  .HasForeignKey(e => e.MadrasahId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => new { e.EvaluatorId, e.MadrasahId }).IsUnique();
        });

        modelBuilder.Entity<SubjectArea>(entity =>
        {
            entity.HasIndex(e => e.Key).IsUnique();
        });

        modelBuilder.Entity<TeachingMethod>(entity =>
        {
            entity.HasIndex(e => e.Key).IsUnique();
        });

        modelBuilder.Entity<Ring>(entity =>
        {
            entity.HasIndex(e => e.Key).IsUnique();
            entity.HasOne(e => e.Madrasah)
                  .WithMany()
                  .HasForeignKey(e => e.MadrasahId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<RingStudent>(entity =>
        {
            entity.HasIndex(e => new { e.RingId, e.StudentId }).IsUnique();
            entity.HasOne(e => e.Ring)
                  .WithMany(r => r.RingStudents)
                  .HasForeignKey(e => e.RingId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<CurriculumObjective>(entity =>
        {
            entity.HasIndex(e => e.Key).IsUnique();
            entity.HasOne(e => e.SubjectArea)
                  .WithMany(s => s.Objectives)
                  .HasForeignKey(e => e.SubjectAreaId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.ParentObjective)
                  .WithMany(c => c.ChildObjectives)
                  .HasForeignKey(e => e.ParentObjectiveId)
                  .IsRequired(false)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Book>(entity =>
        {
            entity.HasIndex(e => e.Key).IsUnique();
            entity.HasOne(e => e.SubjectArea)
                  .WithMany(s => s.Books)
                  .HasForeignKey(e => e.SubjectAreaId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<RingBook>(entity =>
        {
            entity.HasIndex(e => new { e.RingId, e.BookId }).IsUnique();
            entity.HasOne(e => e.Ring)
                  .WithMany(r => r.RingBooks)
                  .HasForeignKey(e => e.RingId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Book)
                  .WithMany(b => b.RingBooks)
                  .HasForeignKey(e => e.BookId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<RingTeachingMethod>(entity =>
        {
            entity.HasIndex(e => new { e.RingId, e.TeachingMethodId }).IsUnique();
            entity.HasOne(e => e.Ring)
                  .WithMany(r => r.RingTeachingMethods)
                  .HasForeignKey(e => e.RingId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.TeachingMethod)
                  .WithMany(t => t.RingTeachingMethods)
                  .HasForeignKey(e => e.TeachingMethodId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<AgeGroup>(entity =>
        {
            entity.HasIndex(e => e.Key).IsUnique();
        });

        modelBuilder.Entity<StudentSkillProgress>(entity =>
        {
            entity.HasIndex(e => new { e.StudentId, e.ObjectiveId }).IsUnique();
            entity.HasOne(e => e.Student)
                  .WithMany()
                  .HasForeignKey(e => e.StudentId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.Objective)
                  .WithMany()
                  .HasForeignKey(e => e.ObjectiveId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.Ring)
                  .WithMany()
                  .HasForeignKey(e => e.RingId)
                  .IsRequired(false)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<SpiritualPracticeItem>(entity =>
        {
            entity.HasIndex(e => e.Key).IsUnique();
        });

        modelBuilder.Entity<SpiritualOccasion>(entity =>
        {
            entity.HasIndex(e => e.Key).IsUnique();
        });

        modelBuilder.Entity<SpiritualOccasionPractice>(entity =>
        {
            entity.HasIndex(e => new { e.OccasionId, e.PracticeItemId }).IsUnique();
            entity.HasOne(e => e.Occasion)
                  .WithMany(o => o.Practices)
                  .HasForeignKey(e => e.OccasionId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.PracticeItem)
                  .WithMany()
                  .HasForeignKey(e => e.PracticeItemId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<DailySpiritualEntry>(entity =>
        {
            entity.HasIndex(e => new { e.UserId, e.EntryDate }).IsUnique();
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<DailyActivity>(entity =>
        {
            entity.HasIndex(e => new { e.UserId, e.ActivityDate }).IsUnique();
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<XpBadge>(entity =>
        {
            entity.HasIndex(e => e.Code).IsUnique();
        });

        modelBuilder.Entity<UserXp>(entity =>
        {
            entity.HasIndex(e => e.UserId).IsUnique();
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<UserXpTransaction>(entity =>
        {
            entity.HasIndex(e => e.UserId);
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Badge)
                  .WithMany()
                  .HasForeignKey(e => e.BadgeId)
                  .IsRequired(false)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Badge>(entity =>
        {
            entity.HasIndex(e => e.Code).IsUnique();
            entity.HasMany(e => e.UserBadges)
                  .WithOne(ub => ub.Badge)
                  .HasForeignKey(ub => ub.BadgeId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<UserBadge>(entity =>
        {
            entity.HasIndex(e => new { e.UserId, e.BadgeId }).IsUnique();
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Badge)
                  .WithMany(b => b.UserBadges)
                  .HasForeignKey(e => e.BadgeId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<PointTransaction>(entity =>
        {
            entity.HasIndex(e => e.UserId);
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Artwork>(entity =>
        {
            entity.HasIndex(e => e.Type);
            entity.HasIndex(e => e.IsPublic);
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<MusicRecord>(entity =>
        {
            entity.HasIndex(e => e.Genre);
            entity.HasIndex(e => e.IsPublic);
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<CalligraphySample>(entity =>
        {
            entity.HasIndex(e => e.Style);
            entity.HasIndex(e => e.IsPublic);
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<UserOccasionProgress>(entity =>
        {
            entity.HasIndex(e => new { e.UserId, e.OccasionId, e.PracticeItemId, e.HijriYear }).IsUnique();
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Occasion)
                  .WithMany()
                  .HasForeignKey(e => e.OccasionId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.PracticeItem)
                  .WithMany()
                  .HasForeignKey(e => e.PracticeItemId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<SpiritualPath>(entity =>
        {
            entity.HasIndex(e => e.Key).IsUnique();
        });

        modelBuilder.Entity<StudyPath>(entity =>
        {
            entity.HasIndex(e => e.Key).IsUnique();
            entity.HasOne(e => e.AgeGroup)
                  .WithMany()
                  .HasForeignKey(e => e.AgeGroupId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.SubjectArea)
                  .WithMany()
                  .HasForeignKey(e => e.SubjectAreaId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<StudyPathStep>(entity =>
        {
            entity.HasOne(e => e.StudyPath)
                  .WithMany(p => p.Steps)
                  .HasForeignKey(e => e.StudyPathId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Assessment)
                  .WithMany()
                  .HasForeignKey(e => e.AssessmentId)
                  .IsRequired(false)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<StudentStudyPath>(entity =>
        {
            entity.HasIndex(e => new { e.StudentId, e.StudyPathId }).IsUnique();
            entity.HasOne(e => e.Student)
                  .WithMany()
                  .HasForeignKey(e => e.StudentId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.StudyPath)
                  .WithMany()
                  .HasForeignKey(e => e.StudyPathId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.CurrentStep)
                  .WithMany()
                  .HasForeignKey(e => e.CurrentStepId)
                  .IsRequired(false)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Accommodation>(entity =>
        {
            entity.HasIndex(e => e.Code).IsUnique();
        });

        modelBuilder.Entity<StudyPathAccommodation>(entity =>
        {
            entity.HasIndex(e => new { e.StudyPathId, e.AccommodationId }).IsUnique();
            entity.HasOne(e => e.StudyPath)
                  .WithMany(p => p.Accommodations)
                  .HasForeignKey(e => e.StudyPathId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Accommodation)
                  .WithMany(a => a.StudyPaths)
                  .HasForeignKey(e => e.AccommodationId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<StudentPathSelection>(entity =>
        {
            entity.HasOne(e => e.Student)
                  .WithMany()
                  .HasForeignKey(e => e.StudentId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.FinalizedPath)
                  .WithMany()
                  .HasForeignKey(e => e.FinalizedPathId)
                  .IsRequired(false)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<StudentPathRanking>(entity =>
        {
            entity.HasIndex(e => new { e.SelectionId, e.PathId }).IsUnique();
            entity.HasOne(e => e.Selection)
                  .WithMany(s => s.Rankings)
                  .HasForeignKey(e => e.SelectionId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Path)
                  .WithMany()
                  .HasForeignKey(e => e.PathId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<StudentPathHistory>(entity =>
        {
            entity.HasOne(e => e.Student)
                  .WithMany()
                  .HasForeignKey(e => e.StudentId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.ChangedByUser)
                  .WithMany()
                  .HasForeignKey(e => e.ChangedByUserId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<MonthlyBooklet>(entity =>
        {
            entity.HasIndex(e => new { e.StudentId, e.Year, e.Month }).IsUnique();
            entity.HasOne(e => e.Student)
                  .WithMany()
                  .HasForeignKey(e => e.StudentId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.CreatedBy)
                  .WithMany()
                  .HasForeignKey(e => e.CreatedByUserId)
                  .IsRequired(false)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Teacher>(entity =>
        {
            entity.HasIndex(e => e.Username).IsUnique();
            entity.HasIndex(e => e.Email).IsUnique();

            entity.HasOne(e => e.Branch)
                  .WithMany()
                  .HasForeignKey(e => e.BranchId)
                  .IsRequired(false)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<TeacherCourse>(entity =>
        {
            entity.HasOne(e => e.Teacher)
                  .WithMany(t => t.TeacherCourses)
                  .HasForeignKey(e => e.TeacherId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Course)
                  .WithMany()
                  .HasForeignKey(e => e.CourseId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(e => new { e.TeacherId, e.CourseId }).IsUnique();
        });

        modelBuilder.Entity<AssignmentGrading>(entity =>
        {
            entity.HasOne(e => e.Submission)
                  .WithMany()
                  .HasForeignKey(e => e.SubmissionId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Teacher)
                  .WithMany(t => t.GradedSubmissions)
                  .HasForeignKey(e => e.TeacherId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(e => e.SubmissionId).IsUnique();
        });

        modelBuilder.Entity<Competition>(entity =>
        {
            entity.HasIndex(e => e.Title);
        });

        modelBuilder.Entity<CompetitionParticipant>(entity =>
        {
            entity.HasOne(e => e.Competition)
                  .WithMany(c => c.Participants)
                  .HasForeignKey(e => e.CompetitionId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Student)
                  .WithMany()
                  .HasForeignKey(e => e.StudentId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(e => new { e.CompetitionId, e.StudentId }).IsUnique();
        });

        modelBuilder.Entity<League>(entity =>
        {
            entity.HasIndex(e => e.Name);
        });

        modelBuilder.Entity<LeagueRanking>(entity =>
        {
            entity.HasOne(e => e.League)
                  .WithMany(l => l.Rankings)
                  .HasForeignKey(e => e.LeagueId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Student)
                  .WithMany()
                  .HasForeignKey(e => e.StudentId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(e => new { e.LeagueId, e.StudentId }).IsUnique();
        });

        modelBuilder.Entity<IssueSurvey>(entity =>
        {
            entity.HasOne(e => e.CreatedBy)
                  .WithMany()
                  .HasForeignKey(e => e.CreatedById)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.StartDate);
            entity.HasIndex(e => e.EndDate);
        });

        modelBuilder.Entity<IssueSurveyQuestion>(entity =>
        {
            entity.HasOne(e => e.Survey)
                  .WithMany(s => s.Questions)
                  .HasForeignKey(e => e.SurveyId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.ItemPool)
                  .WithMany(p => p.SurveyQuestions)
                  .HasForeignKey(e => e.ItemPoolId)
                  .IsRequired(false)
                  .OnDelete(DeleteBehavior.SetNull);

            entity.HasIndex(e => e.SurveyId);
            entity.HasIndex(e => e.Category);
        });

        modelBuilder.Entity<IssueSurveyResponse>(entity =>
        {
            entity.HasOne(e => e.Survey)
                  .WithMany(s => s.Responses)
                  .HasForeignKey(e => e.SurveyId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Question)
                  .WithMany(q => q.Responses)
                  .HasForeignKey(e => e.QuestionId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Respondent)
                  .WithMany()
                  .HasForeignKey(e => e.RespondentId)
                  .IsRequired(false)
                  .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(e => e.RespondentBranch)
                  .WithMany()
                  .HasForeignKey(e => e.RespondentBranchId)
                  .IsRequired(false)
                  .OnDelete(DeleteBehavior.SetNull);

            entity.HasIndex(e => new { e.SurveyId, e.QuestionId, e.RespondentId }).IsUnique();
            entity.HasIndex(e => e.AnsweredAt);
        });

        modelBuilder.Entity<IssueSurveyComment>(entity =>
        {
            entity.HasOne(e => e.Survey)
                  .WithMany(s => s.Comments)
                  .HasForeignKey(e => e.SurveyId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Respondent)
                  .WithMany()
                  .HasForeignKey(e => e.RespondentId)
                  .IsRequired(false)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<IssueItemPool>(entity =>
        {
            entity.HasIndex(e => e.Category);
            entity.HasIndex(e => e.IsActive);
        });

        modelBuilder.Entity<IssueAction>(entity =>
        {
            entity.HasOne(e => e.Survey)
                  .WithMany(s => s.Actions)
                  .HasForeignKey(e => e.SurveyId)
                  .OnDelete(DeleteBehavior.NoAction);

            entity.HasOne(e => e.Question)
                  .WithMany(q => q.Actions)
                  .HasForeignKey(e => e.QuestionId)
                  .IsRequired(false)
                  .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(e => e.AssignedTo)
                  .WithMany()
                  .HasForeignKey(e => e.AssignedToId)
                  .IsRequired(false)
                  .OnDelete(DeleteBehavior.SetNull);

            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.Priority);
        });

        modelBuilder.Entity<IssueActionUpdate>(entity =>
        {
            entity.HasOne(e => e.Action)
                  .WithMany(a => a.Updates)
                  .HasForeignKey(e => e.ActionId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.UpdatedBy)
                  .WithMany()
                  .HasForeignKey(e => e.UpdatedById)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Surah>(entity =>
        {
            entity.HasIndex(e => e.Number).IsUnique();
            entity.HasMany(e => e.Ayahs)
                  .WithOne(a => a.Surah)
                  .HasForeignKey(a => a.SurahId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Ayah>(entity =>
        {
            entity.HasIndex(e => new { e.SurahId, e.VerseNumber }).IsUnique();
            entity.HasOne(e => e.Surah)
                  .WithMany(s => s.Ayahs)
                  .HasForeignKey(e => e.SurahId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<TajweedRule>(entity =>
        {
            entity.HasIndex(e => e.RuleCode).IsUnique();
            entity.HasOne(e => e.Surah)
                  .WithMany()
                  .HasForeignKey(e => e.SurahId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<QuranStudentCourse>(entity =>
        {
            entity.HasOne(e => e.Student)
                  .WithMany()
                  .HasForeignKey(e => e.StudentId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.Course)
                  .WithMany()
                  .HasForeignKey(e => e.CourseId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.Surah)
                  .WithMany()
                  .HasForeignKey(e => e.SurahId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<RecitationLevel>(entity =>
        {
            entity.HasIndex(e => e.LevelNumber).IsUnique();
        });

        modelBuilder.Entity<QuranCurriculum>(entity =>
        {
            entity.HasOne(e => e.Teacher)
                  .WithMany()
                  .HasForeignKey(e => e.TeacherId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<QuranStudentProgress>(entity =>
        {
            entity.HasIndex(e => new { e.StudentId, e.SurahId }).IsUnique();
            entity.HasOne(e => e.Student)
                  .WithMany()
                  .HasForeignKey(e => e.StudentId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Surah)
                  .WithMany()
                  .HasForeignKey(e => e.SurahId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<HadithBook>(entity =>
        {
            entity.HasMany(e => e.Chapters)
                  .WithOne(e => e.HadithBook)
                  .HasForeignKey(e => e.HadithBookId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<HadithChapter>(entity =>
        {
            entity.HasMany(e => e.Hadiths)
                  .WithOne(e => e.HadithChapter)
                  .HasForeignKey(e => e.HadithChapterId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Hadith>(entity =>
        {
            entity.HasMany(e => e.UserProgress)
                  .WithOne(e => e.Hadith)
                  .HasForeignKey(e => e.HadithId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<UserHadithProgress>(entity =>
        {
            entity.HasIndex(e => new { e.UserId, e.HadithId }).IsUnique();
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Poet>(entity =>
        {
            entity.HasIndex(e => e.Name).IsUnique();
            entity.HasIndex(e => e.Era);
            entity.HasIndex(e => e.DifficultyLevel);
        });

        modelBuilder.Entity<Poem>(entity =>
        {
            entity.HasOne(e => e.Poet)
                  .WithMany(p => p.Poems)
                  .HasForeignKey(e => e.PoetId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => e.Genre);
            entity.HasIndex(e => e.DifficultyLevel);
            entity.HasIndex(e => e.Theme);
        });

        modelBuilder.Entity<PoemAnalysis>(entity =>
        {
            entity.HasOne(e => e.Poem)
                  .WithMany(p => p.Analyses)
                  .HasForeignKey(e => e.PoemId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => e.AnalysisType);
        });

        modelBuilder.Entity<ArabicPoet>(entity =>
        {
            entity.HasIndex(e => e.Name).IsUnique();
            entity.HasIndex(e => e.Era);
            entity.HasIndex(e => e.DifficultyLevel);
        });

        modelBuilder.Entity<ArabicPoem>(entity =>
        {
            entity.HasOne(e => e.Poet)
                  .WithMany(p => p.Poems)
                  .HasForeignKey(e => e.PoetId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => e.Genre);
            entity.HasIndex(e => e.DifficultyLevel);
            entity.HasIndex(e => e.Theme);
        });

        modelBuilder.Entity<ArabicPoemAnalysis>(entity =>
        {
            entity.HasOne(e => e.Poem)
                  .WithMany(p => p.Analyses)
                  .HasForeignKey(e => e.PoemId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => e.AnalysisType);
        });

        modelBuilder.Entity<MathTopic>(entity =>
        {
            entity.HasIndex(e => e.Title);
            entity.HasIndex(e => e.DifficultyLevel);
            entity.HasIndex(e => e.DisplayOrder);
        });

        modelBuilder.Entity<MathLesson>(entity =>
        {
            entity.HasOne(e => e.Topic)
                  .WithMany(t => t.Lessons)
                  .HasForeignKey(e => e.MathTopicId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => e.MathTopicId);
            entity.HasIndex(e => e.DisplayOrder);
            entity.HasIndex(e => e.IsPublished);
        });

        modelBuilder.Entity<MathQuestion>(entity =>
        {
            entity.HasOne(e => e.Lesson)
                  .WithMany(l => l.Questions)
                  .HasForeignKey(e => e.MathLessonId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => e.MathLessonId);
            entity.HasIndex(e => e.DifficultyLevel);
        });

        modelBuilder.Entity<MathProgress>(entity =>
        {
            entity.HasOne(e => e.Student)
                  .WithMany()
                  .HasForeignKey(e => e.StudentId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Lesson)
                  .WithMany(l => l.ProgressRecords)
                  .HasForeignKey(e => e.MathLessonId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.Question)
                  .WithMany()
                  .HasForeignKey(e => e.MathQuestionId)
                  .IsRequired(false)
                  .OnDelete(DeleteBehavior.SetNull);
            entity.HasIndex(e => new { e.StudentId, e.MathLessonId, e.MathQuestionId });
        });

        modelBuilder.Entity<MathScholar>(entity =>
        {
            entity.HasIndex(e => e.Name);
        });

        modelBuilder.Entity<MathContribution>(entity =>
        {
            entity.HasOne(e => e.Scholar)
                  .WithMany(s => s.Contributions)
                  .HasForeignKey(e => e.MathScholarId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Topic)
                  .WithMany()
                  .HasForeignKey(e => e.MathTopicId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasIndex(e => e.MathScholarId);
            entity.HasIndex(e => e.MathTopicId);
        });

        modelBuilder.Entity<LearningPath>(entity =>
        {
            entity.HasIndex(e => e.Slug).IsUnique();
            entity.HasIndex(e => e.SortOrder);
        });

        modelBuilder.Entity<LearningLevel>(entity =>
        {
            entity.HasOne(e => e.LearningPath)
                  .WithMany(p => p.Levels)
                  .HasForeignKey(e => e.LearningPathId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => e.LevelNumber);
            entity.HasIndex(e => e.SortOrder);
        });

        modelBuilder.Entity<StudyModule>(entity =>
        {
            entity.HasOne(e => e.LearningLevel)
                  .WithMany(l => l.Modules)
                  .HasForeignKey(e => e.LearningLevelId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => e.SortOrder);
        });

        modelBuilder.Entity<StudyLesson>(entity =>
        {
            entity.HasOne(e => e.StudyModule)
                  .WithMany(m => m.Lessons)
                  .HasForeignKey(e => e.StudyModuleId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => e.SortOrder);
        });

        modelBuilder.Entity<LessonContentBlock>(entity =>
        {
            entity.HasOne(e => e.StudyLesson)
                  .WithMany(ls => ls.ContentBlocks)
                  .HasForeignKey(e => e.StudyLessonId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => new { e.StudyLessonId, e.SortOrder });
        });

        modelBuilder.Entity<PersLitQuiz>(entity =>
        {
            entity.HasOne(e => e.StudyLesson)
                  .WithMany(ls => ls.Quizzes)
                  .HasForeignKey(e => e.StudyLessonId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => e.SortOrder);
        });

        modelBuilder.Entity<PersLitQuizQuestion>(entity =>
        {
            entity.HasOne(e => e.Quiz)
                  .WithMany(q => q.Questions)
                  .HasForeignKey(e => e.QuizId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => e.SortOrder);
        });

        modelBuilder.Entity<QuizOption>(entity =>
        {
            entity.HasOne(e => e.QuizQuestion)
                  .WithMany(q => q.Options)
                  .HasForeignKey(e => e.QuizQuestionId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => e.SortOrder);
        });

        modelBuilder.Entity<UserEnrollment>(entity =>
        {
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.LearningPath)
                  .WithMany()
                  .HasForeignKey(e => e.LearningPathId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasIndex(e => new { e.UserId, e.LearningPathId }).IsUnique();
        });

        modelBuilder.Entity<UserLessonProgress>(entity =>
        {
            entity.HasOne(e => e.UserEnrollment)
                  .WithMany(e => e.LessonProgress)
                  .HasForeignKey(e => e.UserEnrollmentId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.StudyLesson)
                  .WithMany()
                  .HasForeignKey(e => e.StudyLessonId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasIndex(e => new { e.UserEnrollmentId, e.StudyLessonId }).IsUnique();
        });

        modelBuilder.Entity<UserQuizAttempt>(entity =>
        {
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Quiz)
                  .WithMany()
                  .HasForeignKey(e => e.QuizId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<ExperimentTopic>(entity =>
        {
            entity.HasIndex(e => e.Title).IsUnique();
            entity.HasIndex(e => e.DifficultyLevel);
        });

        modelBuilder.Entity<Experiment>(entity =>
        {
            entity.HasOne(e => e.Topic)
                  .WithMany(t => t.Experiments)
                  .HasForeignKey(e => e.TopicId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => e.TopicId);
            entity.HasIndex(e => e.DifficultyLevel);
        });

        modelBuilder.Entity<ExperimentAnalysis>(entity =>
        {
            entity.HasOne(e => e.Experiment)
                  .WithMany(e => e.Analyses)
                  .HasForeignKey(e => e.ExperimentId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => e.AnalysisType);
        });

        modelBuilder.Entity<ExperimentQuestion>(entity =>
        {
            entity.HasOne(e => e.Experiment)
                  .WithMany(e => e.Questions)
                  .HasForeignKey(e => e.ExperimentId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => e.ExperimentId);
        });

        modelBuilder.Entity<ExperimentAttempt>(entity =>
        {
            entity.HasOne(e => e.Student).WithMany().HasForeignKey(e => e.StudentId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Question).WithMany().HasForeignKey(e => e.QuestionId).OnDelete(DeleteBehavior.Restrict);
            entity.HasIndex(e => new { e.StudentId, e.QuestionId });
        });

        modelBuilder.Entity<ExperimentProgress>(entity =>
        {
            entity.HasIndex(e => new { e.StudentId, e.ExperimentId }).IsUnique();
            entity.HasOne(e => e.Student).WithMany().HasForeignKey(e => e.StudentId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Experiment).WithMany().HasForeignKey(e => e.ExperimentId).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<SpacedRepetitionCard>(entity =>
        {
            entity.HasIndex(e => new { e.UserId, e.NextReviewAt });
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<TrainingCourse>(entity =>
        {
            entity.HasIndex(e => e.Slug).IsUnique();
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.AcademicYear);
        });

        modelBuilder.Entity<TrainingStage>(entity =>
        {
            entity.HasOne(e => e.Course)
                  .WithMany(c => c.Stages)
                  .HasForeignKey(e => e.CourseId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => new { e.CourseId, e.StageOrder });
        });

        modelBuilder.Entity<TrainingSession>(entity =>
        {
            entity.HasOne(e => e.Stage)
                  .WithMany(s => s.Sessions)
                  .HasForeignKey(e => e.StageId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => new { e.StageId, e.SessionNumber });
        });

        modelBuilder.Entity<TrainingContent>(entity =>
        {
            entity.HasOne(e => e.Session)
                  .WithMany(s => s.Contents)
                  .HasForeignKey(e => e.SessionId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => e.SessionId);
        });

        modelBuilder.Entity<TrainingEnrollment>(entity =>
        {
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.Course)
                  .WithMany(c => c.Enrollments)
                  .HasForeignKey(e => e.CourseId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => new { e.UserId, e.CourseId }).IsUnique();
            entity.HasIndex(e => e.Status);
        });

        modelBuilder.Entity<TrainingProgress>(entity =>
        {
            entity.HasOne(e => e.Enrollment)
                  .WithMany(e => e.Progresses)
                  .HasForeignKey(e => e.EnrollmentId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Session)
                  .WithMany()
                  .HasForeignKey(e => e.SessionId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasIndex(e => new { e.EnrollmentId, e.SessionId }).IsUnique();
        });

        modelBuilder.Entity<TrainingAssignment>(entity =>
        {
            entity.HasOne(e => e.Session)
                  .WithMany(s => s.Assignments)
                  .HasForeignKey(e => e.SessionId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => e.SessionId);
        });

        modelBuilder.Entity<TrainingSubmission>(entity =>
        {
            entity.HasOne(e => e.Assignment)
                  .WithMany(a => a.Submissions)
                  .HasForeignKey(e => e.AssignmentId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasIndex(e => new { e.AssignmentId, e.UserId }).IsUnique();
        });

        modelBuilder.Entity<KnowledgeDocument>(entity =>
        {
            entity.Property(e => e.Title).HasMaxLength(300).IsRequired();
            entity.Property(e => e.Content).IsRequired();
            entity.Property(e => e.DocumentType).HasMaxLength(50);
            entity.Property(e => e.EmbeddingJson).HasColumnType("text");
            entity.HasOne(e => e.Subject)
                  .WithMany()
                  .HasForeignKey(e => e.SubjectId)
                  .OnDelete(DeleteBehavior.SetNull);
            entity.HasOne(e => e.Maktab)
                  .WithMany()
                  .HasForeignKey(e => e.MaktabId)
                  .OnDelete(DeleteBehavior.SetNull);
            entity.HasIndex(e => e.MaktabId);
            entity.HasIndex(e => e.SubjectId);
        });

        modelBuilder.Entity<AiConversation>(entity =>
        {
            entity.Property(e => e.Title).HasMaxLength(300);
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => e.UserId);
        });

        modelBuilder.Entity<AiMessage>(entity =>
        {
            entity.Property(e => e.Role).HasMaxLength(20).IsRequired();
            entity.Property(e => e.Content).IsRequired();
            entity.Property(e => e.SourcesJson).HasColumnType("text");
            entity.HasOne(e => e.Conversation)
                  .WithMany(c => c.Messages)
                  .HasForeignKey(e => e.ConversationId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => e.ConversationId);
        });

        modelBuilder.Entity<WorkflowStep>(entity =>
        {
            entity.HasIndex(e => new { e.WorkflowId, e.StepOrder }).IsUnique();
            entity.HasOne(e => e.Workflow)
                  .WithMany(w => w.Steps)
                  .HasForeignKey(e => e.WorkflowId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<WorkflowRequest>(entity =>
        {
            entity.HasOne(e => e.Workflow)
                  .WithMany(w => w.Requests)
                  .HasForeignKey(e => e.WorkflowId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.CurrentStep)
                .WithMany()
                .HasForeignKey(e => e.CurrentStepId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.Creator)
                  .WithMany()
                  .HasForeignKey(e => e.CreatedBy)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.CreatedBy);
        });

        modelBuilder.Entity<WorkflowAction>(entity =>
        {
            entity.HasOne(e => e.Request)
                  .WithMany(r => r.Actions)
                  .HasForeignKey(e => e.RequestId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Step)
                  .WithMany()
                  .HasForeignKey(e => e.StepId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasIndex(e => e.RequestId);
        });

        modelBuilder.Entity<CalendarEvent>(entity =>
        {
            entity.HasOne(e => e.Creator)
                  .WithMany()
                  .HasForeignKey(e => e.CreatorUserId)
                  .IsRequired(false);
        });

        modelBuilder.Entity<CalendarEventAttendee>(entity =>
        {
            entity.HasOne(e => e.CalendarEvent)
                  .WithMany(e => e.Attendees)
                  .HasForeignKey(e => e.CalendarEventId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId);
            entity.HasIndex(e => new { e.CalendarEventId, e.UserId }).IsUnique();
        });

        modelBuilder.Entity<ProgressReport>(entity =>
        {
            entity.HasOne(e => e.Student)
                  .WithMany()
                  .HasForeignKey(e => e.StudentId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ProgressMetric>(entity =>
        {
            entity.HasOne(e => e.Report)
                  .WithMany(r => r.Metrics)
                  .HasForeignKey(e => e.ProgressReportId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasOne(x => x.Sender).WithMany().HasForeignKey(x => x.SenderUserId).IsRequired(false);
        });

        modelBuilder.Entity<UserNotification>(entity =>
        {
            entity.HasOne(x => x.Notification).WithMany(n => n.Recipients).HasForeignKey(x => x.NotificationId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId);
            entity.HasIndex(x => new { x.UserId, x.IsRead });
        });

        modelBuilder.Entity<UserDevice>(entity =>
        {
            entity.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId);
            entity.HasIndex(x => x.DeviceToken).IsUnique();
        });

        modelBuilder.Entity<CourierDailyStat>(entity =>
        {
            entity.HasOne(x => x.Courier).WithMany().HasForeignKey(x => x.CourierUserId);
            entity.HasIndex(x => new { x.CourierUserId, x.Date }).IsUnique();
        });

        modelBuilder.Entity<Question>(entity =>
        {
            entity.HasOne(e => e.CreatedBy).WithMany().HasForeignKey(e => e.CreatedByUserId);
        });

        modelBuilder.Entity<RandomEvaluation>(entity =>
        {
            entity.HasOne(e => e.Student).WithMany().HasForeignKey(e => e.StudentId);
        });

        modelBuilder.Entity<EvaluationAnswer>(entity =>
        {
            entity.HasOne(e => e.RandomEvaluation).WithMany(r => r.Answers).HasForeignKey(e => e.RandomEvaluationId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Question).WithMany().HasForeignKey(e => e.QuestionId);
        });

        modelBuilder.Entity<QuranRing>(entity =>
        {
            entity.HasIndex(e => e.Code).IsUnique();
            entity.HasIndex(e => e.SortOrder);
        });

        modelBuilder.Entity<QuranRingSession>(entity =>
        {
            entity.HasIndex(e => new { e.RingId, e.SessionNumber }).IsUnique();
            entity.HasOne(e => e.Ring).WithMany(r => r.Sessions).HasForeignKey(e => e.RingId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<QuranSessionStep>(entity =>
        {
            entity.HasIndex(e => new { e.SessionId, e.StepOrder }).IsUnique();
            entity.HasOne(e => e.Session).WithMany(s => s.Steps).HasForeignKey(e => e.SessionId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<StudentQuranSessionProgress>(entity =>
        {
            entity.HasIndex(e => new { e.StudentId, e.SessionId }).IsUnique();
            entity.HasOne(e => e.Student).WithMany().HasForeignKey(e => e.StudentId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.Session).WithMany(s => s.StudentProgress).HasForeignKey(e => e.SessionId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<StudentStepProgress>(entity =>
        {
            entity.HasIndex(e => new { e.SessionProgressId, e.StepId }).IsUnique();
            entity.HasOne(e => e.SessionProgress).WithMany(p => p.StepProgress).HasForeignKey(e => e.SessionProgressId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Step).WithMany().HasForeignKey(e => e.StepId).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<StudentSpeedCategory>(entity =>
        {
            entity.HasIndex(e => new { e.StudentId, e.RingId }).IsUnique();
            entity.HasOne(e => e.Student).WithMany().HasForeignKey(e => e.StudentId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.Ring).WithMany().HasForeignKey(e => e.RingId).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<TadabborEntry>(entity =>
        {
            entity.HasOne(e => e.Student).WithMany().HasForeignKey(e => e.StudentId).OnDelete(DeleteBehavior.Cascade);
            // Restrict به‌جای SetNull: مسیر cascade مضاعف از طریق Ayah خطای 1785 SQL Server می‌دهد
            entity.HasOne(e => e.Ayah).WithMany().HasForeignKey(e => e.AyahId).IsRequired(false).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.Surah).WithMany().HasForeignKey(e => e.SurahId).IsRequired(false).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<QuranAssetEvaluation>(entity =>
        {
            entity.HasOne(e => e.Student).WithMany().HasForeignKey(e => e.StudentId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Ring).WithMany().HasForeignKey(e => e.RingId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.Evaluator).WithMany().HasForeignKey(e => e.EvaluatorUserId).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<CoachInterview>(entity =>
        {
            entity.HasOne(e => e.Coach).WithMany().HasForeignKey(e => e.CoachUserId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Ring).WithMany().HasForeignKey(e => e.RingId).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<StudentInterview>(entity =>
        {
            entity.HasOne(e => e.Student).WithMany().HasForeignKey(e => e.StudentId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Ring).WithMany().HasForeignKey(e => e.RingId).OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.Interviewer).WithMany().HasForeignKey(e => e.InterviewerUserId).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<QuranRingSurah>(entity =>
        {
            entity.HasIndex(e => new { e.RingId, e.SurahId }).IsUnique();
            entity.HasOne(e => e.Ring).WithMany(r => r.RingSurahs).HasForeignKey(e => e.RingId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Surah).WithMany().HasForeignKey(e => e.SurahId).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<QuranRingResource>(entity =>
        {
            entity.HasOne(e => e.Ring).WithMany(r => r.Resources).HasForeignKey(e => e.RingId).OnDelete(DeleteBehavior.Cascade);
        });
    }
}
