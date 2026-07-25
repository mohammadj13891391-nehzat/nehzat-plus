using System.ComponentModel.DataAnnotations;

namespace EducationalPlatform.Nehzat.Application.DTOs;

public record CreateSubjectAreaRequest(
    [Required][StringLength(100)] string Key,
    [Required][StringLength(200)] string Name,
    [StringLength(500)] string? Description,
    int SortOrder = 0
);

public record UpdateSubjectAreaRequest(
    [StringLength(200)] string? Name,
    [StringLength(500)] string? Description,
    int? SortOrder
);

public record CreateTeachingMethodRequest(
    [Required][StringLength(100)] string Key,
    [Required][StringLength(200)] string Name,
    [StringLength(500)] string? Description,
    int SortOrder = 0
);

public record UpdateTeachingMethodRequest(
    [StringLength(200)] string? Name,
    [StringLength(500)] string? Description,
    int? SortOrder
);

public record CreateRingRequest(
    [Required][StringLength(100)] string Key,
    [Required][StringLength(200)] string Name,
    [StringLength(500)] string? Description,
    [Required] int MadrasahId,
    int? CoachId,
    int? CourseId,
    string Status = "active",
    string? Gender = null
);

public record UpdateRingRequest(
    [StringLength(200)] string? Name,
    [StringLength(500)] string? Description,
    int? MadrasahId,
    int? CoachId,
    int? CourseId,
    string? Status,
    string? Gender
);

public record CreateRingStudentRequest(
    [Required] int RingId,
    [Required] int StudentId,
    string Status = "active"
);

public record CreateCurriculumObjectiveRequest(
    [Required][StringLength(100)] string Key,
    [Required][StringLength(300)] string Title,
    [StringLength(1000)] string? Description,
    [Required] int SubjectAreaId,
    int? ParentObjectiveId,
    int SortOrder = 0,
    string Level = "beginner"
);

public record UpdateCurriculumObjectiveRequest(
    [StringLength(300)] string? Title,
    [StringLength(1000)] string? Description,
    int? SubjectAreaId,
    int? ParentObjectiveId,
    int? SortOrder,
    string? Level
);

public record CreateBookRequest(
    [Required][StringLength(100)] string Key,
    [Required][StringLength(300)] string Title,
    [StringLength(500)] string? Author,
    [Required] int SubjectAreaId,
    [StringLength(50)] string? Level,
    [StringLength(100)] string? Publisher,
    int? Pages
);

public record UpdateBookRequest(
    [StringLength(300)] string? Title,
    [StringLength(500)] string? Author,
    int? SubjectAreaId,
    [StringLength(50)] string? Level,
    [StringLength(100)] string? Publisher,
    int? Pages
);

public record CreateRingBookRequest(
    [Required] int RingId,
    [Required] int BookId,
    int SortOrder = 0
);

public record CreateRingTeachingMethodRequest(
    [Required] int RingId,
    [Required] int TeachingMethodId
);
