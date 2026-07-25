using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_evaluator_madrasahs")]
public class EvaluatorMadrasah
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int EvaluatorId { get; set; }

    public int MadrasahId { get; set; }

    [ForeignKey(nameof(EvaluatorId))]
    public Evaluator? Evaluator { get; set; }

    [ForeignKey(nameof(MadrasahId))]
    public Madrasah? Madrasah { get; set; }
}
