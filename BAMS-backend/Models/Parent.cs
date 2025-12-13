using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BAMS_backend.Models
{
    public class Parent
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

        [MaxLength(300)]
        public string Address { get; set; }

        // Navigation: a parent can have many children (Players)
        public ICollection<Player> Children { get; set; } = new List<Player>();

        [MaxLength(50)]
        public string Status { get; set; } = "Active";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}