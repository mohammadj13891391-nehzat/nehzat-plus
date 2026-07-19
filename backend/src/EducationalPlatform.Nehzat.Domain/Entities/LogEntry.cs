using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_logs")]
public class LogEntry
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public long Id { get; set; }

    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    [Column(TypeName = "nvarchar(20)")]
    public string Level { get; set; } = "Error";

    [Column(TypeName = "nvarchar(200)")]
    public string? Source { get; set; }

    [Column(TypeName = "nvarchar(100)")]
    public string? UserId { get; set; }

    [Column(TypeName = "nvarchar(45)")]
    public string? IpAddress { get; set; }

    [Column(TypeName = "nvarchar(100)")]
    public string? TraceId { get; set; }

    [Column(TypeName = "nvarchar(2000)")]
    public string Message { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(max)")]
    public string? ExceptionDetails { get; set; }
}
