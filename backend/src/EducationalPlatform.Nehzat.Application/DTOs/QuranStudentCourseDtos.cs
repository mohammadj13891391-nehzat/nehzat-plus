using System.ComponentModel.DataAnnotations;

namespace EducationalPlatform.Nehzat.Application.DTOs
{
    public record CreateQuranStudentCourseRequest(
        [Required] int StudentId,
        [Required] int CourseId,
        [Required] int SurahId,
        int CurrentPage = 0,
        int CurrentAyah = 0,
        int RecitationLevelId = 0,
        DateTime? EnrolledDate = null,
        int Grade = 0,
        string Notes = ""
    );

    public record UpdateQuranStudentCourseRequest(
        int? StudentId = null,
        int? CourseId = null,
        int? SurahId = null,
        int? CurrentPage = null,
        int? CurrentAyah = null,
        int? RecitationLevelId = null,
        DateTime? EnrolledDate = null,
        DateTime? CompletionDate = null,
        int? Grade = null,
        string? Notes = null
    );

    public record QuranStudentCourseDto(
        int Id,
        int StudentId,
        int CourseId,
        int SurahId,
        int CurrentPage,
        int CurrentAyah,
        int RecitationLevelId,
        DateTime EnrolledDate,
        DateTime? CompletionDate,
        int Grade,
        string Notes,
        DateTime CreatedAt,
        DateTime UpdatedAt
    );
}