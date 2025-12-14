using System;
using System.ComponentModel.DataAnnotations;

namespace BAMS_backend.Models
{
    public class Coach
    {
        [Key]
        public int Id { get; set; }

        [Required, MaxLength(100)]
        public string FirstName { get; set; }

        [Required, MaxLength(100)]
        public string LastName { get; set; }

        [EmailAddress, MaxLength(200)]
        public string Email { get; set; }

        [Phone, MaxLength(50)]
        public string Phone { get; set; }

        [MaxLength(200)]
        public string Specialization { get; set; }

        // Could be years or free text (e.g. "5 years")
        [MaxLength(100)]
        public string Experience { get; set; }

        [MaxLength(200)]
        public string Certification { get; set; }

        [MaxLength(50)]
        public string Status { get; set; } = "Active";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}