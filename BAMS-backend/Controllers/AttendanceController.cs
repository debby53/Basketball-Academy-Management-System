using BAMS_backend.Data;
using BAMS_backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BAMS_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AttendanceController : ControllerBase
    {
        private readonly ApiContext _context;

        public AttendanceController(ApiContext context)
        {
            _context = context;
        }

        // GET: api/attendance
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AttendanceDto>>> GetAll([FromQuery] int? playerId = null, [FromQuery] string status = null)
        {
            var query = _context.Attendances
                .Include(a => a.Player)
                .AsQueryable();

            if (playerId.HasValue)
                query = query.Where(a => a.PlayerId == playerId.Value);

            if (!string.IsNullOrWhiteSpace(status))
                query = query.Where(a => a.Status == status);

            var list = await query.OrderByDescending(a => a.Date).ToListAsync();
            return list.Select(a => ToDto(a)).ToList();
        }

        // GET: api/attendance/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<AttendanceDto>> GetById(int id)
        {
            var attendance = await _context.Attendances
                .Include(a => a.Player)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (attendance == null) return NotFound();
            return ToDto(attendance);
        }

        // GET: api/attendance/player/5
        [HttpGet("player/{playerId:int}")]
        public async Task<ActionResult<IEnumerable<AttendanceDto>>> GetByPlayer(int playerId)
        {
            var list = await _context.Attendances
                .Include(a => a.Player)
                .Where(a => a.PlayerId == playerId)
                .OrderByDescending(a => a.Date)
                .ToListAsync();

            return list.Select(a => ToDto(a)).ToList();
        }

        // POST: api/attendance/mark
        [HttpPost("mark")]
        public async Task<ActionResult<AttendanceDto>> MarkAttendance([FromBody] CreateAttendanceDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var attendance = new Attendance
            {
                PlayerId = dto.PlayerId,
                Date = dto.Date ?? System.DateTime.UtcNow,
                Status = dto.Status ?? "Present",
                SessionType = dto.SessionType,
                Notes = dto.Notes
            };

            _context.Attendances.Add(attendance);
            await _context.SaveChangesAsync();

            await _context.Entry(attendance).Reference(a => a.Player).LoadAsync();

            var result = ToDto(attendance);
            return CreatedAtAction(nameof(GetById), new { id = attendance.Id }, result);
        }

        // PUT: api/attendance/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateAttendanceDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var attendance = await _context.Attendances.FindAsync(id);
            if (attendance == null) return NotFound();

            attendance.Status = dto.Status ?? attendance.Status;
            attendance.SessionType = dto.SessionType ?? attendance.SessionType;
            attendance.Notes = dto.Notes ?? attendance.Notes;
            attendance.UpdatedAt = System.DateTime.UtcNow;

            _context.Attendances.Update(attendance);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Mapping helper
        private static AttendanceDto ToDto(Attendance a) => new AttendanceDto
        {
            Id = a.Id,
            PlayerId = a.PlayerId,
            PlayerName = a.Player != null ? $"{a.Player.FirstName} {a.Player.LastName}" : null,
            Date = a.Date,
            Status = a.Status,
            SessionType = a.SessionType,
            Notes = a.Notes,
            CreatedAt = a.CreatedAt,
            UpdatedAt = a.UpdatedAt
        };
    }

    // DTOs
    public class CreateAttendanceDto
    {
        public int PlayerId { get; set; }
        public System.DateTime? Date { get; set; }
        public string Status { get; set; }
        public string SessionType { get; set; }
        public string Notes { get; set; }
    }

    public class UpdateAttendanceDto
    {
        public string Status { get; set; }
        public string SessionType { get; set; }
        public string Notes { get; set; }
    }

    public class AttendanceDto
    {
        public int Id { get; set; }
        public int PlayerId { get; set; }
        public string PlayerName { get; set; }
        public System.DateTime Date { get; set; }
        public string Status { get; set; }
        public string SessionType { get; set; }
        public string Notes { get; set; }
        public System.DateTime CreatedAt { get; set; }
        public System.DateTime? UpdatedAt { get; set; }
    }
}
