using BAMS_backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace BAMS_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly ApiContext _context;

        public DashboardController(ApiContext context)
        {
            _context = context;
        }

        // GET: api/dashboard/stats
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var totalPlayers = await _context.Players.CountAsync();
            var totalCoaches = await _context.Coaches.CountAsync();
            var totalParents = await _context.Parents.CountAsync();
            
            var activePlayersCount = await _context.Players.CountAsync(p => p.Status == "Active");
            var activeCoachesCount = await _context.Coaches.CountAsync(c => c.Status == "Active");

            // Revenue stats
            var totalRevenue = await _context.Payments
                .Where(p => p.Status == "Paid")
                .SumAsync(p => (decimal?)p.Amount) ?? 0m;

            var monthlyRevenue = await _context.Payments
                .Where(p => p.Status == "Paid" && p.Date >= DateTime.UtcNow.Date.AddMonths(-1))
                .SumAsync(p => (decimal?)p.Amount) ?? 0m;

            // Attendance stats (if attendance records exist)
            var totalAttendances = 0;
            var monthlyAttendances = 0;
            try
            {
                totalAttendances = await _context.Attendances.CountAsync();
                monthlyAttendances = await _context.Attendances
                    .CountAsync(a => a.Date >= DateTime.UtcNow.Date.AddMonths(-1));
            }
            catch
            {
                // Attendances table might not exist yet
            }

            // Recent payments
            var recentPayments = await _context.Payments
                .OrderByDescending(p => p.Date)
                .Take(5)
                .Select(p => new
                {
                    id = p.Id,
                    playerName = p.PlayerName,
                    amount = p.Amount,
                    date = p.Date,
                    status = p.Status
                })
                .ToListAsync();

            var stats = new
            {
                summary = new
                {
                    totalPlayers,
                    totalCoaches,
                    totalParents,
                    activePlayers = activePlayersCount,
                    activeCoaches = activeCoachesCount,
                    totalRevenue,
                    monthlyRevenue,
                    totalAttendances,
                    monthlyAttendances
                },
                recentPayments,
                lastUpdated = DateTime.UtcNow
            };

            return Ok(stats);
        }

        // GET: api/dashboard/activity
        [HttpGet("activity")]
        public async Task<IActionResult> GetRecentActivity()
        {
            var activities = new System.Collections.Generic.List<object>();

            // Recent players
            var recentPlayers = await _context.Players
                .OrderByDescending(p => p.CreatedAt)
                .Take(5)
                .Select(p => new
                {
                    type = "player_registered",
                    title = $"New Player: {p.FirstName} {p.LastName}",
                    description = $"Team: {p.Team ?? "Unassigned"}",
                    timestamp = p.CreatedAt
                })
                .ToListAsync();

            // Recent payments
            var recentPayments = await _context.Payments
                .OrderByDescending(p => p.CreatedAt)
                .Take(5)
                .Select(p => new
                {
                    type = "payment_received",
                    title = $"Payment Received: ${p.Amount}",
                    description = $"From: {p.PlayerName}",
                    timestamp = p.CreatedAt
                })
                .ToListAsync();

            // Recent communications
            var recentCommunications = await _context.Communications
                .OrderByDescending(c => c.SentAt)
                .Take(5)
                .Select(c => new
                {
                    type = "announcement_sent",
                    title = c.Subject,
                    description = $"To: {c.RecipientType}",
                    timestamp = c.SentAt
                })
                .ToListAsync();

            // Combine and sort
            activities.AddRange(recentPlayers);
            activities.AddRange(recentPayments);
            activities.AddRange(recentCommunications);

            var sortedActivities = activities
                .OrderByDescending(a => (DateTime)a.GetType().GetProperty("timestamp").GetValue(a))
                .Take(15)
                .ToList();

            return Ok(sortedActivities);
        }
    }
}
