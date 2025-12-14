using BAMS_backend.Data;
using BAMS_backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BAMS_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PerformanceController : ControllerBase
    {
        private readonly ApiContext _context;

        public PerformanceController(ApiContext context)
        {
            _context = context;
        }

        // GET: api/performance/team
        [HttpGet("team")]
        public async Task<IActionResult> GetTeamPerformance([FromQuery] string team = null)
        {
            var query = _context.Performances
                .Include(p => p.Player)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(team))
                query = query.Where(p => p.Player.Team == team);

            var performances = await query
                .OrderByDescending(p => p.Date)
                .Take(100)
                .ToListAsync();

            // Group by metric type and calculate averages
            var stats = performances
                .GroupBy(p => p.MetricType)
                .Select(g => new
                {
                    metricType = g.Key,
                    average = g.Average(p => p.Value),
                    count = g.Count(),
                    unit = g.First().Unit
                })
                .ToList();

            return Ok(new
            {
                team = team ?? "All Teams",
                totalRecords = performances.Count,
                metrics = stats,
                lastUpdated = performances.Any() ? performances.Max(p => p.Date) : (DateTime?)null
            });
        }

        // GET: api/performance/player/5
        [HttpGet("player/{playerId:int}")]
        public async Task<ActionResult<IEnumerable<PerformanceDto>>> GetPlayerPerformance(int playerId)
        {
            var performances = await _context.Performances
                .Include(p => p.Player)
                .Where(p => p.PlayerId == playerId)
                .OrderByDescending(p => p.Date)
                .ToListAsync();

            return performances.Select(p => ToDto(p)).ToList();
        }

        // POST: api/performance
        [HttpPost]
        public async Task<ActionResult<PerformanceDto>> LogPerformance([FromBody] CreatePerformanceDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var performance = new Performance
            {
                PlayerId = dto.PlayerId,
                Date = dto.Date ?? DateTime.UtcNow,
                MetricType = dto.MetricType,
                Value = dto.Value,
                Unit = dto.Unit,
                Notes = dto.Notes
            };

            _context.Performances.Add(performance);
            await _context.SaveChangesAsync();

            await _context.Entry(performance).Reference(p => p.Player).LoadAsync();

            var result = ToDto(performance);
            return CreatedAtAction(nameof(GetPlayerPerformance), new { playerId = performance.PlayerId }, result);
        }

        // Mapping helper
        private static PerformanceDto ToDto(Performance p) => new PerformanceDto
        {
            Id = p.Id,
            PlayerId = p.PlayerId,
            PlayerName = p.Player != null ? $"{p.Player.FirstName} {p.Player.LastName}" : null,
            Date = p.Date,
            MetricType = p.MetricType,
            Value = p.Value,
            Unit = p.Unit,
            Notes = p.Notes,
            CreatedAt = p.CreatedAt
        };
    }

    // DTOs
    public class CreatePerformanceDto
    {
        public int PlayerId { get; set; }
        public DateTime? Date { get; set; }
        public string MetricType { get; set; }
        public decimal Value { get; set; }
        public string Unit { get; set; }
        public string Notes { get; set; }
    }

    public class PerformanceDto
    {
        public int Id { get; set; }
        public int PlayerId { get; set; }
        public string PlayerName { get; set; }
        public DateTime Date { get; set; }
        public string MetricType { get; set; }
        public decimal Value { get; set; }
        public string Unit { get; set; }
        public string Notes { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
