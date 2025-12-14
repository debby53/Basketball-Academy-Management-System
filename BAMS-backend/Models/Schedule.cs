using System;
using System.ComponentModel.DataAnnotations;

namespace BAMS_backend.Models
{
    public class Schedule
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; }

        [MaxLength(1000)]
        public string Description { get; set; }

        [Required]
        public DateTime StartTime { get; set; }

        [Required]
        public DateTime EndTime { get; set; }

        [MaxLength(200)]
        public string Location { get; set; }

        public int? CoachId { get; set; }
        public Coach Coach { get; set; }

        [MaxLength(50)]
        public string EventType { get; set; } // Training, Match, Event, Meeting, etc.

        [MaxLength(50)]
        public string Team { get; set; } // Which team/group this is for

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
