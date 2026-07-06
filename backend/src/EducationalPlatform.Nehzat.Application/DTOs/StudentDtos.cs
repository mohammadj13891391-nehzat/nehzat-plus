using System.ComponentModel.DataAnnotations;

namespace EducationalPlatform.Nehzat.Application.DTOs;

public record StudentProgressResponse(
    int TotalCourses,
    int CompletedAssignments,
    int TotalAssignments,
    double CompletionPercentage,
    int AverageScore
);

public record CourseStatisticsResponse(
    int TotalStudents,
    int ActiveStudents,
    double AverageProgress,
    int TotalSubmissions
);
