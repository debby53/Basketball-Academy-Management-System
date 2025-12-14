using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BAMS_backend.Models
{
    public class Payment
    {
        [Key]
        public int Id { get; set; }

        // Optional FK to Player
        public int? PlayerId { get; set; }
        public Player Player { get; set; }

        // Denormalized player name used by UI
        [MaxLength(200)]
        public string PlayerName { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        public DateTime Date { get; set; } = DateTime.UtcNow;

        [MaxLength(100)]
        public string Method { get; set; } = "Cash";

        [MaxLength(500)]
        public string Description { get; set; }

        // Paid, Pending, Overdue
        [MaxLength(50)]
        public string Status { get; set; } = "Pending";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}