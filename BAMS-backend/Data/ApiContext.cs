using BAMS_backend.Models;
using Microsoft.EntityFrameworkCore;
using System;


namespace BAMS_backend.Data
{
    public class ApiContext : DbContext
    {
        private static readonly DateTime SeedDate = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc);

        public DbSet<User> Users { get; set; }
        public DbSet<Player> Players { get; set; }
        public DbSet<Parent> Parents { get; set; }
        public DbSet<Coach> Coaches { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Communication> Communications { get; set; }
        
        // New entities for missing features
        public DbSet<Attendance> Attendances { get; set; }
        public DbSet<Schedule> Schedules { get; set; }
        public DbSet<Performance> Performances { get; set; }
        public DbSet<Notification> Notifications { get; set; }

        public ApiContext(DbContextOptions<ApiContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Seed users: one admin, one coach, one player, one parent
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Email = "admin@bams.com",
                    FirstName = "Admin",
                    LastName = "Ryan",
                    Phone = "",
                    Role = "Admin",
                    PasswordHash = "$2a$11$uY4zfr1p4nbksd4Sy4cn0.LTc44mHE41Sod5CKn9Wc65vBdvU/mA.",
                    RefreshToken = null,
                    RefreshTokenExpiryTime = null,
                    PasswordResetToken = null,
                    PasswordResetTokenExpiryTime = null,
                    CreatedAt = SeedDate,
                    IsApproved = true
                },
                new User
                {
                    Id = 2,
                    Email = "coach@bams.com",
                    FirstName = "Head",
                    LastName = "Coach",
                    Phone = "",
                    Role = "Coach",
                    PasswordHash = "$2a$11$uY4zfr1p4nbksd4Sy4cn0.LTc44mHE41Sod5CKn9Wc65vBdvU/mA.",
                    RefreshToken = null,
                    RefreshTokenExpiryTime = null,
                    PasswordResetToken = null,
                    PasswordResetTokenExpiryTime = null,
                    CreatedAt = SeedDate,
                    IsApproved = true
                },
                new User
                {
                    Id = 3,
                    Email = "player@bams.com",
                    FirstName = "Team",
                    LastName = "Player",
                    Phone = "",
                    Role = "Player",
                    PasswordHash = "$2a$11$uY4zfr1p4nbksd4Sy4cn0.LTc44mHE41Sod5CKn9Wc65vBdvU/mA.",
                    RefreshToken = null,
                    RefreshTokenExpiryTime = null,
                    PasswordResetToken = null,
                    PasswordResetTokenExpiryTime = null,
                    CreatedAt = SeedDate,
                    IsApproved = false
                },
                new User
                {
                    Id = 4,
                    Email = "parent@bams.com",
                    FirstName = "Guardian",
                    LastName = "Parent",
                    Phone = "",
                    Role = "Parent",
                    PasswordHash = "$2a$11$uY4zfr1p4nbksd4Sy4cn0.LTc44mHE41Sod5CKn9Wc65vBdvU/mA.",
                    RefreshToken = null,
                    RefreshTokenExpiryTime = null,
                    PasswordResetToken = null,
                    PasswordResetTokenExpiryTime = null,
                    CreatedAt = SeedDate,
                    IsApproved = true
                }
            );
        }

    }
}
