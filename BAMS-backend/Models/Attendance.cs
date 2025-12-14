using System;
using System.ComponentModel.DataAnnotations;

namespace BAMS_backend.Models
{
    public class Attendance
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int PlayerId { get; set; }
        public Player Player { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        [MaxLength(20)]
        public string Status { get; set; } // Present, Absent, Late, Excused

        [MaxLength(100)]
        public string SessionType { get; set; } // Training, Match, Practice, etc.

        [MaxLength(500)]
        public string Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
