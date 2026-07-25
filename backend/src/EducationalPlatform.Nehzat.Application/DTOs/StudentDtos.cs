using System.ComponentModel.DataAnnotations;

namespace EducationalPlatform.Nehzat.Application.DTOs;

public record StudentProgressResponse(
    int TotalCourses,
    int CompletedAssignments,
    int TotalAssignments,
    double CompletionPercentage,
    int AverageScore
);

public record BiweeklyProgressResponse(
    int StudentId,
    string StudentName,
    DateTime PeriodStart,
    DateTime PeriodEnd,
    int TotalAssignments,
    int CompletedAssignments,
    int PendingAssignments,
    double CompletionPercentage,
    double AverageScore,
    int TotalSubmissions,
    List<AssignmentProgressItem> Assignments
);

public record AssignmentProgressItem(
    int AssignmentId,
    string AssignmentTitle,
    DateTime AssignmentDate,
    bool IsSubmitted,
    int? DailyScore,
    int? CumulativeScore,
    string Status
);

public record CourseStatisticsResponse(
    int TotalStudents,
    int ActiveStudents,
    double AverageProgress,
    int TotalSubmissions
);
