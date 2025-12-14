using System;
using System.ComponentModel.DataAnnotations;

namespace BAMS_backend.Models
{
    public class Performance
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int PlayerId { get; set; }
        public Player Player { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        [MaxLength(100)]
        public string MetricType { get; set; } // Speed, Accuracy, Endurance, Points, Assists, etc.

        [Required]
        public decimal Value { get; set; }

        [MaxLength(50)]
        public string Unit { get; set; } // seconds, meters, percentage, count, etc.

        [MaxLength(500)]
        public string Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
