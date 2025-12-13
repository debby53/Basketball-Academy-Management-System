using System;
using System.ComponentModel.DataAnnotations;

namespace BAMS_backend.Models
{
    public class Communication
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(250)]
        public string Subject { get; set; }

        [Required]
        public string Body { get; set; }

        // Audience: "all", "parents", "coaches", "players", or custom
        [MaxLength(50)]
        public string RecipientType { get; set; } = "all";

        // Optional free-form recipient identifier (for future custom audiences)
        [MaxLength(500)]
        public string Recipient { get; set; }

        // Sender user id if applicable
        public int? SenderId { get; set; }

        // When the message was scheduled/sent (frontend passes ISO date)
        public DateTime SentAt { get; set; } = DateTime.UtcNow;

        // Status: Sent, Pending, Failed
        [MaxLength(50)]
        public string Status { get; set; } = "Sent";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}