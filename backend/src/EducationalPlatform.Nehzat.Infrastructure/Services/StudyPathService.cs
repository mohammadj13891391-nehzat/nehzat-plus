using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Application.Constants;
using EducationalPlatform.Nehzat.Domain.Constants;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class StudyPathService : IStudyPathService
{
    private readonly AppDbContext _db;
    private readonly IStudentService _studentService;

    public StudyPathService(AppDbContext db, IStudentService studentService)
    {
        _db = db;
        _studentService = studentService;
    }

    #region Admin: Study Paths

    public async Task<List<StudyPathDto>> GetAllStudyPathsAsync()
    {
        var paths = await _db.StudyPaths
            .Include(p => p.AgeGroup)
            .Include(p => p.SubjectArea)
            .Include(p => p.Steps)
                .ThenInclude(s => s.Assessment)
            .Include(p => p.Accommodations)
                .ThenInclude(pa => pa.Accommodation)
            .OrderBy(p => p.SortOrder)
            .ToListAsync();

        return paths.Select(MapToDto).ToList();
    }

    public async Task<StudyPathDto> GetStudyPathAsync(int id)
    {
        var path = await _db.StudyPaths
            .Include(p => p.AgeGroup)
            .Include(p => p.SubjectArea)
            .Include(p => p.Steps)
                .ThenInclude(s => s.Assessment)
            .Include(p => p.Accommodations)
                .ThenInclude(pa => pa.Accommodation)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (path == null)
            throw new KeyNotFoundException(GenericErrorMessages.NotFound);

        return MapToDto(path);
    }

    public async Task<StudyPathDto> CreateStudyPathAsync(CreateStudyPathRequest request)
    {
        var path = new StudyPath
        {
            Key = request.Key,
            Title = request.Title,
            Description = request.Description,
            AgeGroupId = request.AgeGroupId,
            SubjectAreaId = request.SubjectAreaId,
            CognitiveLevel = request.CognitiveLevel,
            IsActive = request.IsActive,
            SortOrder = request.SortOrder,
        };

        _db.StudyPaths.Add(path);
        await _db.SaveChangesAsync();

        // Add accommodation links
        if (request.AccommodationIds?.Any() == true)
        {
            var accommodations = await _db.Accommodations
                .Where(a => request.AccommodationIds.Contains(a.Id))
                .ToListAsync();

            foreach (var acc in accommodations)
            {
                _db.StudyPathAccommodations.Add(new StudyPathAccommodation
                {
                    StudyPathId = path.Id,
                    AccommodationId = acc.Id
                });
            }
        }

        // Add steps
        if (request.Steps?.Any() == true)
        {
            foreach (var stepReq in request.Steps)
            {
                var step = new StudyPathStep
                {
                    StudyPathId = path.Id,
                    StepOrder = stepReq.StepOrder,
                    Title = stepReq.Title,
                    Description = stepReq.Description,
                    CognitiveLevel = stepReq.CognitiveLevel,
                    EstimatedDurationMinutes = stepReq.EstimatedDurationMinutes,
                    PrerequisitesJson = stepReq.PrerequisitesJson,
                    ContentUrl = stepReq.ContentUrl,
                    ResourceId = stepReq.ResourceId,
                    AssessmentId = stepReq.AssessmentId,
                };
                _db.StudyPathSteps.Add(step);
            }
        }

        await _db.SaveChangesAsync();

        return await GetStudyPathAsync(path.Id);
    }

    public async Task<StudyPathDto> UpdateStudyPathAsync(int id, UpdateStudyPathRequest request)
    {
        var path = await _db.StudyPaths.FindAsync(id);
        if (path == null)
            throw new KeyNotFoundException(GenericErrorMessages.NotFound);

        if (request.Key != null) path.Key = request.Key;
        if (request.Title != null) path.Title = request.Title;
        if (request.Description != null) path.Description = request.Description;
        if (request.AgeGroupId.HasValue) path.AgeGroupId = request.AgeGroupId.Value;
        if (request.SubjectAreaId.HasValue) path.SubjectAreaId = request.SubjectAreaId.Value;
        if (request.CognitiveLevel != null) path.CognitiveLevel = request.CognitiveLevel;
        if (request.IsActive.HasValue) path.IsActive = request.IsActive.Value;
        if (request.SortOrder.HasValue) path.SortOrder = request.SortOrder.Value;

        path.UpdatedAt = DateTime.UtcNow;
        _db.StudyPaths.Update(path);

        // Update accommodations if provided
        if (request.AccommodationIds != null)
        {
            var existing = await _db.StudyPathAccommodations
                .Where(pa => pa.StudyPathId == id)
                .ToListAsync();
            _db.StudyPathAccommodations.RemoveRange(existing);

            var accommodations = await _db.Accommodations
                .Where(a => request.AccommodationIds.Contains(a.Id))
                .ToListAsync();
            foreach (var acc in accommodations)
            {
                _db.StudyPathAccommodations.Add(new StudyPathAccommodation
                {
                    StudyPathId = id,
                    AccommodationId = acc.Id
                });
            }
        }

        await _db.SaveChangesAsync();

        return await GetStudyPathAsync(path.Id);
    }

    public async Task DeleteStudyPathAsync(int id)
    {
        var path = await _db.StudyPaths.FindAsync(id);
        if (path == null)
            throw new KeyNotFoundException(GenericErrorMessages.NotFound);

        _db.StudyPaths.Remove(path);
        await _db.SaveChangesAsync();
    }

    #endregion

    #region Admin: Steps

    public async Task<StudyPathStepDto> AddStepAsync(int studyPathId, CreateStudyPathStepRequest request)
    {
        var path = await _db.StudyPaths.FindAsync(studyPathId);
        if (path == null)
            throw new KeyNotFoundException(GenericErrorMessages.NotFound);

        var step = new StudyPathStep
        {
            StudyPathId = studyPathId,
            StepOrder = request.StepOrder,
            Title = request.Title,
            Description = request.Description,
            CognitiveLevel = request.CognitiveLevel,
            EstimatedDurationMinutes = request.EstimatedDurationMinutes,
            PrerequisitesJson = request.PrerequisitesJson,
            ContentUrl = request.ContentUrl,
            ResourceId = request.ResourceId,
            AssessmentId = request.AssessmentId,
        };

        _db.StudyPathSteps.Add(step);
        await _db.SaveChangesAsync();

        return await MapStepToDtoAsync(step.Id);
    }

    public async Task<StudyPathStepDto> UpdateStepAsync(int stepId, UpdateStudyPathStepRequest request)
    {
        var step = await _db.StudyPathSteps.FindAsync(stepId);
        if (step == null)
            throw new KeyNotFoundException(GenericErrorMessages.NotFound);

        if (request.StepOrder.HasValue) step.StepOrder = request.StepOrder.Value;
        if (request.Title != null) step.Title = request.Title;
        if (request.Description != null) step.Description = request.Description;
        if (request.CognitiveLevel != null) step.CognitiveLevel = request.CognitiveLevel;
        if (request.EstimatedDurationMinutes.HasValue) step.EstimatedDurationMinutes = request.EstimatedDurationMinutes.Value;
        if (request.PrerequisitesJson != null) step.PrerequisitesJson = request.PrerequisitesJson;
        if (request.ContentUrl != null) step.ContentUrl = request.ContentUrl;
        if (request.ResourceId.HasValue) step.ResourceId = request.ResourceId;
        if (request.AssessmentId.HasValue) step.AssessmentId = request.AssessmentId;

        step.UpdatedAt = DateTime.UtcNow;
        _db.StudyPathSteps.Update(step);
        await _db.SaveChangesAsync();

        return await MapStepToDtoAsync(step.Id);
    }

    public async Task DeleteStepAsync(int stepId)
    {
        var step = await _db.StudyPathSteps.FindAsync(stepId);
        if (step == null)
            throw new KeyNotFoundException(GenericErrorMessages.NotFound);

        _db.StudyPathSteps.Remove(step);
        await _db.SaveChangesAsync();
    }

    public async Task ReorderStepsAsync(int studyPathId, ReorderStepsRequest request)
    {
        var path = await _db.StudyPaths.FindAsync(studyPathId);
        if (path == null)
            throw new KeyNotFoundException(GenericErrorMessages.NotFound);

        var steps = await _db.StudyPathSteps
            .Where(s => s.StudyPathId == studyPathId)
            .ToListAsync();

        foreach (var step in steps)
        {
            var newOrder = request.StepIds.IndexOf(step.Id);
            if (newOrder >= 0)
                step.StepOrder = newOrder;
        }

        _db.StudyPathSteps.UpdateRange(steps);
        await _db.SaveChangesAsync();
    }

    #endregion

    #region Admin: Accommodations

    public async Task<List<AccommodationDto>> GetAllAccommodationsAsync()
    {
        return await _db.Accommodations
            .Select(a => new AccommodationDto(
                a.Id, a.Code, a.Name, a.Description, a.Icon))
            .ToListAsync();
    }

    public async Task<AccommodationDto> CreateAccommodationAsync(CreateAccommodationRequest request)
    {
        var accommodation = new Accommodation
        {
            Code = request.Code,
            Name = request.Name,
            Description = request.Description,
            Icon = request.Icon,
        };

        _db.Accommodations.Add(accommodation);
        await _db.SaveChangesAsync();

        return new AccommodationDto(
            accommodation.Id, accommodation.Code, accommodation.Name,
            accommodation.Description, accommodation.Icon);
    }

    #endregion

    #region Admin: Lookup Data

    public async Task<List<AgeGroupDto>> GetAllAgeGroupsAsync()
    {
        return await _db.AgeGroups
            .Select(ag => new AgeGroupDto(
                ag.Id, ag.Key, ag.Name, ag.Description,
                ag.MinAge, ag.MaxAge, ag.SortOrder))
            .ToListAsync();
    }

    public async Task<List<SubjectAreaDto>> GetAllSubjectAreasAsync()
    {
        return await _db.SubjectAreas
            .Select(sa => new SubjectAreaDto(
                sa.Id, sa.Key, sa.Name, sa.Description, sa.SortOrder))
            .ToListAsync();
    }

    #endregion

    #region Student: Browse + Enroll

    public async Task<List<StudyPathDto>> GetAvailableStudyPathsAsync(string username)
    {
        var student = await _studentService.FindByUsernameAsync(username);
        if (student == null)
            throw new KeyNotFoundException(GenericErrorMessages.NotFound);

        // Get age group for student's branch
        int? ageGroupId = null;
        if (student.BranchId.HasValue)
        {
            var branch = await _db.Branches.FindAsync(student.BranchId.Value);
            // Age group mapping would depend on student's age - for now, return all active paths
        }

        var paths = await _db.StudyPaths
            .Where(p => p.IsActive)
            .Include(p => p.Steps)
            .Include(p => p.Accommodations)
                .ThenInclude(pa => pa.Accommodation)
            .OrderBy(p => p.SortOrder)
            .ToListAsync();

        return paths.Select(MapToDto).ToList();
    }

    public async Task<StudentStudyPathDto> EnrollAsync(string username, int studyPathId)
    {
        var student = await _studentService.FindByUsernameAsync(username);
        if (student == null)
            throw new KeyNotFoundException(GenericErrorMessages.NotFound);

        var path = await _db.StudyPaths.FindAsync(studyPathId);
        if (path == null)
            throw new KeyNotFoundException(GenericErrorMessages.NotFound);

        // Check if already enrolled
        var existing = await _db.StudentStudyPaths
            .FirstOrDefaultAsync(e => e.StudentId == student.Id && e.StudyPathId == studyPathId);
        if (existing != null)
            throw new InvalidOperationException(GenericErrorMessages.Conflict);

        var enrollment = new StudentStudyPath
        {
            StudentId = student.Id,
            StudyPathId = studyPathId,
            Status = "active",
            ProgressPercentage = 0,
            EnrollmentDate = DateTime.UtcNow,
            StartedAt = DateTime.UtcNow,
        };

        // Set current step to first step
        var firstStep = await _db.StudyPathSteps
            .Where(s => s.StudyPathId == studyPathId)
            .OrderBy(s => s.StepOrder)
            .FirstOrDefaultAsync();
        if (firstStep != null)
            enrollment.CurrentStepId = firstStep.Id;

        _db.StudentStudyPaths.Add(enrollment);
        await _db.SaveChangesAsync();

        return await MapEnrollmentToDtoAsync(enrollment.Id);
    }

    public async Task<List<StudentStudyPathDto>> GetMyStudyPathsAsync(string username)
    {
        var student = await _studentService.FindByUsernameAsync(username);
        if (student == null)
            throw new KeyNotFoundException(GenericErrorMessages.NotFound);

        var enrollments = await _db.StudentStudyPaths
            .Where(e => e.StudentId == student.Id)
            .Include(e => e.StudyPath)
            .Include(e => e.CurrentStep)
            .Include(e => e.StudyPath)
                .ThenInclude(p => p.Steps)
            .ToListAsync();

        return enrollments.Select(MapEnrollmentTo).ToList();
    }

    public async Task<StudentStudyPathDto> GetMyStudyPathAsync(string username, int enrollmentId)
    {
        var student = await _studentService.FindByUsernameAsync(username);
        if (student == null)
            throw new KeyNotFoundException(GenericErrorMessages.NotFound);

        var enrollment = await _db.StudentStudyPaths
            .Include(e => e.StudyPath)
                .ThenInclude(p => p.AgeGroup)
            .Include(e => e.StudyPath)
                .ThenInclude(p => p.SubjectArea)
            .Include(e => e.StudyPath)
                .ThenInclude(p => p.Steps)
            .Include(e => e.StudyPath)
                .ThenInclude(p => p.Accommodations)
                    .ThenInclude(pa => pa.Accommodation)
            .Include(e => e.CurrentStep)
            .FirstOrDefaultAsync(e => e.Id == enrollmentId && e.StudentId == student.Id);

        if (enrollment == null)
            throw new KeyNotFoundException(GenericErrorMessages.NotFound);

        return MapEnrollmentTo(enrollment);
    }

    public async Task<StudentStudyPathDto> CompleteStepAsync(string username, int studyPathId, int stepId)
    {
        var enrollment = await GetEnrollmentByUsernameAndPathAsync(username, studyPathId);
        
        var path = enrollment.StudyPath;
        var steps = path.Steps.OrderBy(s => s.StepOrder).ToList();
        var currentStepIndex = steps.FindIndex(s => s.Id == stepId);
        if (currentStepIndex < 0)
            throw new KeyNotFoundException(GenericErrorMessages.NotFound);

        // Advance to next step
        var nextStep = steps.ElementAtOrDefault(currentStepIndex + 1);
        enrollment.CurrentStepId = nextStep?.Id;

        // Recalculate progress
        var completedSteps = currentStepIndex + 1;
        var totalSteps = steps.Count;
        enrollment.ProgressPercentage = totalSteps > 0 
            ? (int)Math.Round((double)completedSteps / totalSteps * 100) 
            : 0;

        if (enrollment.ProgressPercentage >= 100)
        {
            enrollment.Status = "completed";
            enrollment.CompletedAt = DateTime.UtcNow;
        }

        enrollment.UpdatedAt = DateTime.UtcNow;
        _db.StudentStudyPaths.Update(enrollment);
        await _db.SaveChangesAsync();

        return await MapEnrollmentToDtoAsync(enrollment.Id);
    }

    public async Task<StudentStudyPathDto> SkipStepAsync(string username, int studyPathId, int stepId)
    {
        var enrollment = await GetEnrollmentByUsernameAndPathAsync(username, studyPathId);
        
        var path = enrollment.StudyPath;
        var steps = path.Steps.OrderBy(s => s.StepOrder).ToList();
        var currentStepIndex = steps.FindIndex(s => s.Id == stepId);
        if (currentStepIndex < 0)
            throw new KeyNotFoundException(GenericErrorMessages.NotFound);

        // Skip to next step (same as complete but doesn't count toward progress)
        var nextStep = steps.ElementAtOrDefault(currentStepIndex + 1);
        enrollment.CurrentStepId = nextStep?.Id;

        var completedSteps = currentStepIndex + 1;
        var totalSteps = steps.Count;
        enrollment.ProgressPercentage = totalSteps > 0
            ? (int)Math.Round((double)completedSteps / totalSteps * 100)
            : 0;

        enrollment.UpdatedAt = DateTime.UtcNow;
        _db.StudentStudyPaths.Update(enrollment);
        await _db.SaveChangesAsync();

        return await MapEnrollmentToDtoAsync(enrollment.Id);
    }

    #region Analytics

    public async Task<StudyPathProgressAnalyticsDto> GetStudyPathProgressAsync(string username, int enrollmentId)
    {
        var student = await _studentService.FindByUsernameAsync(username);
        if (student == null)
            throw new KeyNotFoundException(GenericErrorMessages.NotFound);

        var enrollment = await _db.StudentStudyPaths
            .Include(e => e.StudyPath)
                .ThenInclude(p => p.AgeGroup)
            .Include(e => e.StudyPath)
                .ThenInclude(p => p.SubjectArea)
            .Include(e => e.StudyPath)
                .ThenInclude(p => p.Steps)
            .Include(e => e.StudyPath)
                .ThenInclude(p => p.Accommodations)
                    .ThenInclude(pa => pa.Accommodation)
            .Include(e => e.CurrentStep)
            .FirstOrDefaultAsync(e => e.Id == enrollmentId && e.StudentId == student.Id);

        if (enrollment == null)
            throw new KeyNotFoundException(GenericErrorMessages.NotFound);

        return MapEnrollmentToAnalytics(enrollment);
    }

    public async Task<StudentOverallProgressDto> GetStudentOverallProgressAsync(string username)
    {
        var student = await _studentService.FindByUsernameAsync(username);
        if (student == null)
            throw new KeyNotFoundException(GenericErrorMessages.NotFound);

        var enrollments = await _db.StudentStudyPaths
            .Where(e => e.StudentId == student.Id)
            .Include(e => e.StudyPath)
                .ThenInclude(p => p.SubjectArea)
            .ToListAsync();

        var summaries = enrollments.Select(e => new StudyPathSummaryDto(
            e.Id,
            e.StudyPathId,
            e.StudyPath?.Title ?? string.Empty,
            e.StudyPath?.SubjectArea?.Name ?? string.Empty,
            e.ProgressPercentage,
            e.Status,
            e.EnrollmentDate,
            e.CompletedAt
        )).ToList();

        var activeCount = summaries.Count(s => s.Status == "active");
        var completedCount = summaries.Count(s => s.Status == "completed");
        var avgProgress = summaries.Any() ? summaries.Average(s => s.ProgressPercentage) : 0;

        return new StudentOverallProgressDto(
            student.Id,
            $"{student.FirstName} {student.LastName}".Trim(),
            summaries.Count,
            activeCount,
            completedCount,
            avgProgress,
            summaries
        );
    }

    public async Task<List<CoachStudentProgressDto>> GetCoachStudentsProgressAsync(int branchId)
    {
        // Get all students in the branch
        var students = await _db.Students
            .Where(s => s.BranchId == branchId)
            .Include(s => s.Branch)
            .ToListAsync();

        var result = new List<CoachStudentProgressDto>();

        foreach (var student in students)
        {
            var enrollments = await _db.StudentStudyPaths
                .Where(e => e.StudentId == student.Id)
                .Include(e => e.StudyPath)
                    .ThenInclude(p => p.SubjectArea)
                .ToListAsync();

            var summaries = enrollments.Select(e => new StudyPathSummaryDto(
                e.Id,
                e.StudyPathId,
                e.StudyPath?.Title ?? string.Empty,
                e.StudyPath?.SubjectArea?.Name ?? string.Empty,
                e.ProgressPercentage,
                e.Status,
                e.EnrollmentDate,
                e.CompletedAt
            )).ToList();

            var activeCount = summaries.Count(s => s.Status == "active");
            var completedCount = summaries.Count(s => s.Status == "completed");
            var avgProgress = summaries.Any() ? summaries.Average(s => s.ProgressPercentage) : 0;

            result.Add(new CoachStudentProgressDto(
                student.Id,
                $"{student.FirstName} {student.LastName}".Trim(),
                branchId,
                student.Branch?.Name ?? string.Empty,
                summaries,
                summaries.Count,
                activeCount,
                completedCount,
                avgProgress
            ));
        }

        return result;
    }

    public async Task<CoachBranchProgressDto> GetCoachBranchProgressAsync(int branchId)
    {
        var branch = await _db.Branches.FindAsync(branchId);
        if (branch == null)
            throw new KeyNotFoundException(GenericErrorMessages.NotFound);

        var students = await GetCoachStudentsProgressAsync(branchId);
        
        var totalStudents = students.Count;
        var studentsWithEnrollments = students.Count(s => s.TotalEnrollments > 0);
        var totalEnrollments = students.Sum(s => s.TotalEnrollments);
        var activeEnrollments = students.Sum(s => s.ActiveEnrollments);
        var completedEnrollments = students.Sum(s => s.CompletedEnrollments);
        var avgProgress = studentsWithEnrollments > 0 
            ? students.Where(s => s.TotalEnrollments > 0).Average(s => s.AverageProgressPercentage) 
            : 0;

        return new CoachBranchProgressDto(
            branchId,
            branch.Name,
            totalStudents,
            studentsWithEnrollments,
            totalEnrollments,
            activeEnrollments,
            completedEnrollments,
            avgProgress,
            students
        );
    }

    private StudyPathProgressAnalyticsDto MapEnrollmentToAnalytics(StudentStudyPath enrollment)
    {
        var steps = enrollment.StudyPath?.Steps.OrderBy(s => s.StepOrder).ToList() ?? new List<StudyPathStep>();
        var currentStepIndex = enrollment.CurrentStepId.HasValue 
            ? steps.FindIndex(s => s.Id == enrollment.CurrentStepId) 
            : steps.Count;
        if (enrollment.Status == "completed") currentStepIndex = steps.Count - 1;

        var completedStepsCount = enrollment.Status == "completed" 
            ? steps.Count 
            : Math.Max(0, currentStepIndex);

        var stepAnalytics = steps.Select(s => {
            var isCompleted = enrollment.Status == "completed" || (enrollment.CurrentStepId.HasValue && steps.FindIndex(st => st.Id == enrollment.CurrentStepId) > steps.FindIndex(st => st.Id == s.Id));
            var isSkipped = false; // Could be tracked separately if needed
            var isCurrent = enrollment.CurrentStepId == s.Id;
            
            return new StepAnalyticsDto(
                s.Id,
                s.StepOrder,
                s.Title,
                s.CognitiveLevel,
                s.EstimatedDurationMinutes,
                null, // Actual duration not tracked yet
                isCompleted,
                isSkipped,
                isCurrent,
                isCompleted ? enrollment.CompletedAt : null
            );
        }).ToList();

        var estimatedTimeRemaining = steps
            .Where(s => !stepAnalytics.Any(sa => sa.StepId == s.Id && sa.IsCompleted))
            .Sum(s => s.EstimatedDurationMinutes);

        var totalEstimated = steps.Sum(s => s.EstimatedDurationMinutes);
        var avgTimePerStep = steps.Any() ? (double)totalEstimated / steps.Count : 0;

        return new StudyPathProgressAnalyticsDto(
            enrollment.Id,
            enrollment.StudyPath?.Title ?? string.Empty,
            steps.Count,
            completedStepsCount,
            0, // Skipped steps not tracked separately yet
            currentStepIndex + 1,
            enrollment.ProgressPercentage,
            enrollment.Status,
            enrollment.EnrollmentDate,
            enrollment.StartedAt,
            enrollment.CompletedAt,
            stepAnalytics,
            TimeSpan.FromMinutes(estimatedTimeRemaining),
            avgTimePerStep
        );
    }

    #endregion

    #endregion

    #region Private Helpers

    private async Task<StudentStudyPath> GetEnrollmentByUsernameAndPathAsync(string username, int studyPathId)
    {
        var student = await _studentService.FindByUsernameAsync(username);
        if (student == null)
            throw new KeyNotFoundException(GenericErrorMessages.NotFound);

        var enrollment = await _db.StudentStudyPaths
            .Include(e => e.StudyPath)
                .ThenInclude(p => p.AgeGroup)
            .Include(e => e.StudyPath)
                .ThenInclude(p => p.SubjectArea)
            .Include(e => e.StudyPath)
                .ThenInclude(p => p.Steps)
            .Include(e => e.StudyPath)
                .ThenInclude(p => p.Accommodations)
                    .ThenInclude(pa => pa.Accommodation)
            .Include(e => e.CurrentStep)
            .FirstOrDefaultAsync(e => e.StudentId == student.Id && e.StudyPathId == studyPathId);

        if (enrollment == null)
            throw new KeyNotFoundException("هنوز در این مسیر ثبت نام نکرده‌اید.");

        return enrollment;
    }

    private StudyPathDto MapToDto(StudyPath path)
    {
        return new StudyPathDto(
            path.Id,
            path.Key,
            path.Title,
            path.Description,
            path.AgeGroupId,
            path.AgeGroup?.Name ?? string.Empty,
            path.SubjectAreaId,
            path.SubjectArea?.Name ?? string.Empty,
            path.CognitiveLevel,
            path.IsActive,
            path.SortOrder,
            path.Accommodations.Select(pa => new AccommodationDto(
                pa.Accommodation.Id, pa.Accommodation.Code,
                pa.Accommodation.Name, pa.Accommodation.Description,
                pa.Accommodation.Icon)).ToList(),
            path.Steps.OrderBy(s => s.StepOrder).Select(s => new StudyPathStepDto(
                s.Id, s.StudyPathId, s.StepOrder, s.Title, s.Description,
                s.CognitiveLevel, s.EstimatedDurationMinutes, s.PrerequisitesJson,
                s.ContentUrl, s.ResourceId, s.AssessmentId, s.Assessment?.Title,
                s.CreatedAt, s.UpdatedAt)).ToList(),
            path.CreatedAt,
            path.UpdatedAt);
    }

    private async Task<StudyPathStepDto> MapStepToDtoAsync(int stepId)
    {
        var step = await _db.StudyPathSteps
            .Include(s => s.Assessment)
            .FirstOrDefaultAsync(s => s.Id == stepId);

        if (step == null)
            throw new KeyNotFoundException(GenericErrorMessages.NotFound);

        return new StudyPathStepDto(
            step.Id, step.StudyPathId, step.StepOrder, step.Title, step.Description,
            step.CognitiveLevel, step.EstimatedDurationMinutes, step.PrerequisitesJson,
            step.ContentUrl, step.ResourceId, step.AssessmentId, step.Assessment?.Title,
            step.CreatedAt, step.UpdatedAt);
    }

    private StudentStudyPathDto MapEnrollmentTo(StudentStudyPath e)
    {
        var steps = e.StudyPath?.Steps.OrderBy(s => s.StepOrder).ToList() ?? new List<StudyPathStep>();
        var completedStepsCount = e.CurrentStepId.HasValue 
            ? steps.FindIndex(s => s.Id == e.CurrentStepId) 
            : steps.Count;
        if (e.Status == "completed") completedStepsCount = steps.Count;

        var stepDtos = steps.Select(s => new StudyPathStepDto(
            s.Id, s.StudyPathId, s.StepOrder, s.Title, s.Description,
            s.CognitiveLevel, s.EstimatedDurationMinutes, s.PrerequisitesJson,
            s.ContentUrl, s.ResourceId, s.AssessmentId, s.Assessment?.Title,
            s.CreatedAt, s.UpdatedAt)).ToList();

        var currentStepDto = stepDtos.FirstOrDefault(s => s.Id == (e.CurrentStep?.Id ?? (e.CurrentStepId ?? 0)));

        return new StudentStudyPathDto(
            e.Id, e.StudentId, e.StudyPathId, e.StudyPath?.Title ?? string.Empty,
            e.EnrollmentDate, e.CurrentStepId, currentStepDto, e.Status,
            e.ProgressPercentage, e.StartedAt, e.CompletedAt, stepDtos, completedStepsCount);
    }

    private async Task<StudentStudyPathDto> MapEnrollmentToDtoAsync(int enrollmentId)
    {
        var enrollment = await _db.StudentStudyPaths
            .Include(e => e.StudyPath)
                .ThenInclude(p => p.AgeGroup)
            .Include(e => e.StudyPath)
                .ThenInclude(p => p.SubjectArea)
            .Include(e => e.StudyPath)
                .ThenInclude(p => p.Steps)
            .Include(e => e.StudyPath)
                .ThenInclude(p => p.Accommodations)
                    .ThenInclude(pa => pa.Accommodation)
            .Include(e => e.CurrentStep)
            .FirstOrDefaultAsync(e => e.Id == enrollmentId);

        if (enrollment == null)
            throw new KeyNotFoundException(GenericErrorMessages.NotFound);

        return MapEnrollmentTo(enrollment);
    }

    #endregion
}