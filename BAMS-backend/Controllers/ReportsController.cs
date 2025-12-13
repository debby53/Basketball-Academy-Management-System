using BAMS_backend.Data;
using BAMS_backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace BAMS_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly ApiContext _context;
        public ReportsController(ApiContext context) => _context = context;

        // GET: api/reports/revenue?period=month
        [HttpGet("revenue")]
        public async Task<ActionResult<IEnumerable<RevenueRecordDto>>> GetRevenue([FromQuery] string period = "month")
        {
            DateTime from = period?.ToLower() switch
            {
                "week" => DateTime.UtcNow.Date.AddDays(-6),
                "year" => DateTime.UtcNow.Date.AddYears(-1),
                _ => DateTime.UtcNow.Date.AddMonths(-1)
            };

            var payments = await _context.Payments
                .Where(p => p.Date >= from && p.Status == "Paid")
                .ToListAsync();

            // Build buckets depending on period
            var buckets = new Dictionary<string, decimal>();
            if (period == "week")
            {
                // last 7 days labeled Mon, Tue...
                for (int i = 6; i >= 0; i--)
                {
                    var d = DateTime.UtcNow.Date.AddDays(-i);
                    buckets[d.ToString("ddd")] = 0m;
                }
                foreach (var p in payments)
                {
                    var key = p.Date.ToString("ddd");
                    if (buckets.ContainsKey(key)) buckets[key] += p.Amount;
                }
            }
            else if (period == "year")
            {
                // last 12 months
                for (int i = 11; i >= 0; i--)
                {
                    var d = DateTime.UtcNow.Date.AddMonths(-i);
                    var key = d.ToString("MMM", CultureInfo.InvariantCulture);
                    buckets[key] = 0m;
                }
                foreach (var p in payments)
                {
                    var key = p.Date.ToString("MMM", CultureInfo.InvariantCulture);
                    if (buckets.ContainsKey(key)) buckets[key] += p.Amount;
                }
            }
            else // month (default) - group by day
            {
                var start = from;
                var days = (DateTime.UtcNow.Date - start).Days;
                for (int i = days; i >= 0; i--)
                {
                    var d = start.AddDays(i);
                    var key = d.ToString("dd MMM");
                    buckets[key] = 0m;
                }
                foreach (var p in payments)
                {
                    var key = p.Date.ToString("dd MMM");
                    if (buckets.ContainsKey(key)) buckets[key] += p.Amount;
                }
            }

            var result = buckets.Select(kv => new RevenueRecordDto { Label = kv.Key, Value = kv.Value }).ToList();
            return Ok(result);
        }

        // GET: api/reports/attendance?period=month
        [HttpGet("attendance")]
        public async Task<ActionResult<AttendanceStatsDto>> GetAttendanceStats([FromQuery] string period = "month")
        {
            // If there's an Attendance table implement proper aggregation here.
            // Fallback: use Players count as a simple metric and payments-based proxy for "attendance rate"
            var totalPlayers = await _context.Players.CountAsync();
            var paidCount = await _context.Payments.CountAsync(p => p.Status == "Paid");

            var avg = totalPlayers == 0 ? "0%" : $"{Math.Round((double)paidCount / Math.Max(1, totalPlayers) * 100, 0)}%";

            var dto = new AttendanceStatsDto
            {
                Average = avg,
                BestGroup = "N/A",
                WorstGroup = "N/A",
                TotalSessions = 0,
                TotalPlayers = totalPlayers,
                TotalPaidPayments = paidCount,
                TotalRevenue = await _context.Payments.Where(p => p.Status == "Paid").SumAsync(p => (decimal?)p.Amount) ?? 0m
            };

            return Ok(dto);
        }

        // GET: api/reports/attendance/detailed
        [HttpGet("attendance/detailed")]
        public async Task<ActionResult<IEnumerable<DetailedAttendanceDto>>> GetDetailedAttendance()
        {
            // If there's an Attendance entity, replace this with actual queries.
            // Return empty list by default to satisfy frontend.
            return Ok(new List<DetailedAttendanceDto>());
        }
    }

    // DTOs
    public class RevenueRecordDto
    {
        public string Label { get; set; }
        public decimal Value { get; set; }
    }

    public class AttendanceStatsDto
    {
        public string Average { get; set; }
        public string BestGroup { get; set; }
        public string WorstGroup { get; set; }
        public int TotalSessions { get; set; }

        // extras useful for dashboards
        public int TotalPlayers { get; set; }
        public int TotalPaidPayments { get; set; }
        public decimal TotalRevenue { get; set; }
    }

    public class DetailedAttendanceDto
    {
        public string Group { get; set; }
        public int Sessions { get; set; }
        public string Attendance { get; set; }
        public string LastSession { get; set; }
    }
}