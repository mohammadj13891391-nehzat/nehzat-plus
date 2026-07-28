using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Domain.Entities.Quran;
using EducationalPlatform.Nehzat.Domain.Entities.PersianLiterature;
using EducationalPlatform.Nehzat.Domain.Entities.ArabicLiterature;
using EducationalPlatform.Nehzat.Domain.Entities.Math;
using EducationalPlatform.Nehzat.Domain.Entities.ExperimentalSciences;
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
    public DbSet<RingTeachingMethod> RingTeachingMethods => Set<RingTeachingMethod>();

    public DbSet<AgeGroup> AgeGroups => Set<AgeGroup>();
    public DbSet<StudentSkillProgress> StudentSkillProgressList => Set<StudentSkillProgress>();

    public DbSet<SpiritualPracticeItem> SpiritualPracticeItems => Set<SpiritualPracticeItem>();
    public DbSet<SpiritualOccasion> SpiritualOccasions => Set<SpiritualOccasion>();
    public DbSet<SpiritualOccasionPractice> SpiritualOccasionPractices => Set<SpiritualOccasionPractice>();
    public DbSet<DailySpiritualEntry> DailySpiritualEntries => Set<DailySpiritualEntry>();
    public DbSet<UserOccasionProgress> UserOccasionProgress => Set<UserOccasionProgress>();
    public DbSet<SpiritualPath> SpiritualPaths => Set<SpiritualPath>();
    public DbSet<StudentPathSelection> StudentPathSelections => Set<StudentPathSelection>();
    public DbSet<StudentPathRanking> StudentPathRankings => Set<StudentPathRanking>();
    public DbSet<StudentPathHistory> StudentPathHistory => Set<StudentPathHistory>();

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

  public DbSet<Poet> PersianLiteraturePoets => Set<Poet>();
  public DbSet<Poem> PersianLiteraturePoems => Set<Poem>();
  public DbSet<PoemAnalysis> PersianLiteratureAnalyses => Set<PoemAnalysis>();

  public DbSet<ArabicPoet> ArabicLiteraturePoets => Set<ArabicPoet>();
  public DbSet<ArabicPoem> ArabicLiteraturePoems => Set<ArabicPoem>();
  public DbSet<ArabicPoemAnalysis> ArabicLiteratureAnalyses => Set<ArabicPoemAnalysis>();
  public DbSet<ArabicCourse> ArabicCourses => Set<ArabicCourse>();
  public DbSet<ArabicLesson> ArabicLessons => Set<ArabicLesson>();
  public DbSet<ArabicUserProgress> ArabicUserProgresses => Set<ArabicUserProgress>();

  public DbSet<MathTopic> MathTopics => Set<MathTopic>();
  public DbSet<MathLesson> MathLessons => Set<MathLesson>();
  public DbSet<MathQuestion> MathQuestions => Set<MathQuestion>();
  public DbSet<MathProgress> MathProgresses => Set<MathProgress>();
  public DbSet<MathScholar> MathScholars => Set<MathScholar>();
  public DbSet<MathContribution> MathContributions => Set<MathContribution>();

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

  public DbSet<Phase> ExperimentalSciencesPhases => Set<Phase>();
  public DbSet<Topic> ExperimentalSciencesTopics => Set<Topic>();
  public DbSet<Lesson> ExperimentalSciencesLessons => Set<Lesson>();
  public DbSet<Experiment> ExperimentalSciencesExperiments => Set<Experiment>();
  public DbSet<Domain.Entities.ExperimentalSciences.Quiz> ExperimentalSciencesQuizzes => Set<Domain.Entities.ExperimentalSciences.Quiz>();
  public DbSet<Domain.Entities.ExperimentalSciences.QuizQuestion> ExperimentalSciencesQuizQuestions => Set<Domain.Entities.ExperimentalSciences.QuizQuestion>();
  public DbSet<StudentProgress> ExperimentalSciencesStudentProgresses => Set<StudentProgress>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("nehzat");
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
        });

        modelBuilder.Entity<MathLesson>(entity =>
        {
            entity.HasOne(e => e.Topic)
                  .WithMany(t => t.Lessons)
                  .HasForeignKey(e => e.MathTopicId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => e.MathTopicId);
        });

        modelBuilder.Entity<MathQuestion>(entity =>
        {
            entity.HasOne(e => e.Lesson)
                  .WithMany(l => l.Questions)
                  .HasForeignKey(e => e.MathLessonId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasIndex(e => e.MathLessonId);
        });

        modelBuilder.Entity<MathProgress>(entity =>
        {
            entity.HasOne(e => e.Student)
                  .WithMany()
                  .HasForeignKey(e => e.StudentId)
                  .OnDelete(DeleteBehavior.Restrict);
            entity.HasOne(e => e.Lesson)
                  .WithMany(l => l.ProgressRecords)
                  .HasForeignKey(e => e.MathLessonId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Question)
                  .WithMany()
                  .HasForeignKey(e => e.MathQuestionId)
                  .IsRequired(false)
                  .OnDelete(DeleteBehavior.SetNull);
            entity.HasIndex(e => new { e.StudentId, e.MathLessonId });
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
    }
}
