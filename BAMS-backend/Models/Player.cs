using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BAMS_backend.Models
{
    public class Player
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public string FirstName { get; set; }

        [Required, MaxLength(100)]
        public string LastName { get; set; }

        [EmailAddress, MaxLength(200)]
        public string Email { get; set; }

        public int? Age { get; set; }

        [MaxLength(100)]
        public string Team { get; set; }

        [MaxLength(150)]
        public string GuardianName { get; set; }

        [Phone, MaxLength(50)]
        public string GuardianPhone { get; set; }

        [MaxLength(50)]
        public string Status { get; set; } = "Active";

        // Optional relationship to Parent (if you implement Parent entity)
        public int? ParentId { get; set; }
        public Parent Parent { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
