using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EducationalPlatform.Nehzat.Domain.Entities.ArabicLiterature
{
    [Table("Nehzat_arabic_lessons")]
    public class ArabicLesson
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int CourseId { get; set; }

        [ForeignKey(nameof(CourseId))]
        [JsonIgnore]
        public ArabicCourse? Course { get; set; }

        [Column(TypeName = "nvarchar(200)")]
        public string Title { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(1000)")]
        public string? Description { get; set; }

        [Column(TypeName = "text")]
        public string? Objectives { get; set; } // JSON array of learning objectives

        public int? PoemId { get; set; }

        [ForeignKey(nameof(PoemId))]
        [JsonIgnore]
        public ArabicPoem? Poem { get; set; }

        [Column(TypeName = "text")]
        public string? Content { get; set; } // Educational content text

        [Column(TypeName = "text")]
        public string? ExerciseData { get; set; } // JSON - exercises

        [Column(TypeName = "text")]
        public string? QuizData { get; set; } // JSON - quiz questions

        [Column(TypeName = "int")]
        public int DurationMinutes { get; set; } = 30;

        public int SortOrder { get; set; }

        [Column(TypeName = "nvarchar(500)")]
        public string? PrerequisiteLessonIds { get; set; } // JSON array of ints

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
