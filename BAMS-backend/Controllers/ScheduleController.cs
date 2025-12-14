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
    public class ScheduleController : ControllerBase
    {
        private readonly ApiContext _context;

        public ScheduleController(ApiContext context)
        {
            _context = context;
        }

        // GET: api/schedule
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ScheduleDto>>> GetAll([FromQuery] string team = null, [FromQuery] string eventType = null)
        {
            var query = _context.Schedules
                .Include(s => s.Coach)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(team))
                query = query.Where(s => s.Team == team);

            if (!string.IsNullOrWhiteSpace(eventType))
                query = query.Where(s => s.EventType == eventType);

            var list = await query.OrderBy(s => s.StartTime).ToListAsync();
            return list.Select(s => ToDto(s)).ToList();
        }

        // GET: api/schedule/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<ScheduleDto>> GetById(int id)
        {
            var schedule = await _context.Schedules
                .Include(s => s.Coach)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (schedule == null) return NotFound();
            return ToDto(schedule);
        }

        // POST: api/schedule
        [HttpPost]
        public async Task<ActionResult<ScheduleDto>> Create([FromBody] CreateScheduleDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var schedule = new Schedule
            {
                Title = dto.Title,
                Description = dto.Description,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime,
                Location = dto.Location,
                CoachId = dto.CoachId,
                EventType = dto.EventType ?? "Training",
                Team = dto.Team
            };

            _context.Schedules.Add(schedule);
            await _context.SaveChangesAsync();

            await _context.Entry(schedule).Reference(s => s.Coach).LoadAsync();

            var result = ToDto(schedule);
            return CreatedAtAction(nameof(GetById), new { id = schedule.Id }, result);
        }

        // PUT: api/schedule/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateScheduleDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var schedule = await _context.Schedules.FindAsync(id);
            if (schedule == null) return NotFound();

            schedule.Title = dto.Title ?? schedule.Title;
            schedule.Description = dto.Description ?? schedule.Description;
            schedule.StartTime = dto.StartTime ?? schedule.StartTime;
            schedule.EndTime = dto.EndTime ?? schedule.EndTime;
            schedule.Location = dto.Location ?? schedule.Location;
            schedule.CoachId = dto.CoachId ?? schedule.CoachId;
            schedule.EventType = dto.EventType ?? schedule.EventType;
            schedule.Team = dto.Team ?? schedule.Team;
            schedule.UpdatedAt = DateTime.UtcNow;

            _context.Schedules.Update(schedule);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/schedule/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var schedule = await _context.Schedules.FindAsync(id);
            if (schedule == null) return NotFound();

            _context.Schedules.Remove(schedule);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Mapping helper
        private static ScheduleDto ToDto(Schedule s) => new ScheduleDto
        {
            Id = s.Id,
            Title = s.Title,
            Description = s.Description,
            StartTime = s.StartTime,
            EndTime = s.EndTime,
            Location = s.Location,
            CoachId = s.CoachId,
            CoachName = s.Coach != null ? $"{s.Coach.FirstName} {s.Coach.LastName}" : null,
            EventType = s.EventType,
            Team = s.Team,
            CreatedAt = s.CreatedAt,
            UpdatedAt = s.UpdatedAt
        };
    }

    // DTOs
    public class CreateScheduleDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Location { get; set; }
        public int? CoachId { get; set; }
        public string EventType { get; set; }
        public string Team { get; set; }
    }

    public class UpdateScheduleDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public string Location { get; set; }
        public int? CoachId { get; set; }
        public string EventType { get; set; }
        public string Team { get; set; }
    }

    public class ScheduleDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Location { get; set; }
        public int? CoachId { get; set; }
        public string CoachName { get; set; }
        public string EventType { get; set; }
        public string Team { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
