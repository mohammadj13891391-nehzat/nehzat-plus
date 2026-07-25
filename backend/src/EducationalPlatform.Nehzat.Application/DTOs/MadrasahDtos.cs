using System.ComponentModel.DataAnnotations;

namespace EducationalPlatform.Nehzat.Application.DTOs;

public record CreateMadrasahRequest(
    [Required(ErrorMessage = "کلید مکتب الزامی است")]
    [StringLength(100)]
    [RegularExpression(@"^[a-z0-9\-]+$", ErrorMessage = "کلید معتبر نیست")]
    string Key,

    [Required(ErrorMessage = "نام مکتب الزامی است")]
    [StringLength(200)]
    string Name,

    [StringLength(200)]
    string? Label,

    [StringLength(50)]
    string? Level,

    [RegularExpression(@"^(boys|girls|mixed)$", ErrorMessage = "جنسیت معتبر نیست")]
    string Gender,

    [Range(1, 7)]
    int Grade,

    [Range(1, int.MaxValue)]
    int Capacity,

    [RegularExpression(@"^(active|inactive)$", ErrorMessage = "وضعیت معتبر نیست")]
    string Status,

    int? SectionId,

    int? ManagerId
);

public record UpdateMadrasahRequest(
    [StringLength(200)]
    string? Name,

    [StringLength(200)]
    string? Label,

    [StringLength(50)]
    string? Level,

    [RegularExpression(@"^(boys|girls|mixed)$", ErrorMessage = "جنسیت معتبر نیست")]
    string? Gender,

    [Range(1, 7)]
    int? Grade,

    [Range(1, int.MaxValue)]
    int? Capacity,

    [RegularExpression(@"^(active|inactive)$", ErrorMessage = "وضعیت معتبر نیست")]
    string? Status,

    int? SectionId,

    int? ManagerId
);

public record CreateMadrasahBranchRequest(
    [Required(ErrorMessage = "نام شعبه الزامی است")]
    [StringLength(200)]
    string Name,

    [StringLength(100)]
    string? Province,

    [StringLength(100)]
    string? City,

    [StringLength(300)]
    string? Address,

    [StringLength(20)]
    string? Phone,

    int Capacity,

    [RegularExpression(@"^(active|inactive)$", ErrorMessage = "وضعیت معتبر نیست")]
    string Status,

    [Required(ErrorMessage = "شناسه مکتب الزامی است")]
    int MadrasahId
);

public record CreateMaktabSubSectionRequest(
    [Required(ErrorMessage = "کلید زیربخش الزامی است")]
    [StringLength(100)]
    string Key,

    [Required(ErrorMessage = "نام زیربخش الزامی است")]
    [StringLength(200)]
    string Name,

    [StringLength(20)]
    string? Level,

    [Required(ErrorMessage = "شناسه شعبه الزامی است")]
    int MadrasahBranchId
);
