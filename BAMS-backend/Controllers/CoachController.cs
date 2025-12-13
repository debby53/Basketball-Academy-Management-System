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
    public class CoachesController : ControllerBase
    {
        private readonly ApiContext _context;

        public CoachesController(ApiContext context)
        {
            _context = context;
        }

        // GET: api/coaches
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CoachDto>>> GetCoaches()
        {
            var coaches = await _context.Coaches.ToListAsync();
            return coaches.Select(c => ToDto(c)).ToList();
        }

        // GET: api/coaches/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<CoachDto>> GetCoach(int id)
        {
            var coach = await _context.Coaches.FindAsync(id);
            if (coach == null) return NotFound();
            return ToDto(coach);
        }

        // POST: api/coaches
        [HttpPost]
        public async Task<ActionResult<CoachDto>> CreateCoach([FromBody] CreateCoachDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var coach = new Coach
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                Phone = dto.Phone,
                Specialization = dto.Specialization,
                Experience = dto.Experience,
                Certification = dto.Certification,
                Status = string.IsNullOrWhiteSpace(dto.Status) ? "Active" : dto.Status
            };

            _context.Coaches.Add(coach);
            await _context.SaveChangesAsync();

            var result = ToDto(coach);
            return CreatedAtAction(nameof(GetCoach), new { id = coach.Id }, result);
        }

        // PUT: api/coaches/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateCoach(int id, [FromBody] UpdateCoachDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var coach = await _context.Coaches.FindAsync(id);
            if (coach == null) return NotFound();

            coach.FirstName = dto.FirstName ?? coach.FirstName;
            coach.LastName = dto.LastName ?? coach.LastName;
            coach.Email = dto.Email ?? coach.Email;
            coach.Phone = dto.Phone ?? coach.Phone;
            coach.Specialization = dto.Specialization ?? coach.Specialization;
            coach.Experience = dto.Experience ?? coach.Experience;
            coach.Certification = dto.Certification ?? coach.Certification;
            coach.Status = dto.Status ?? coach.Status;
            coach.UpdatedAt = System.DateTime.UtcNow;

            _context.Coaches.Update(coach);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/coaches/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteCoach(int id)
        {
            var coach = await _context.Coaches.FindAsync(id);
            if (coach == null) return NotFound();

            _context.Coaches.Remove(coach);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Mapping helper
        private static CoachDto ToDto(Coach c) => new CoachDto
        {
            Id = c.Id,
            FirstName = c.FirstName,
            LastName = c.LastName,
            Email = c.Email,
            Phone = c.Phone,
            Specialization = c.Specialization,
            Experience = c.Experience,
            Certification = c.Certification,
            Status = c.Status,
            CreatedAt = c.CreatedAt,
            UpdatedAt = c.UpdatedAt
        };
    }

    // DTOs
    public class CreateCoachDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Specialization { get; set; }
        public string Experience { get; set; }
        public string Certification { get; set; }
        public string Status { get; set; }
    }

    public class UpdateCoachDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Specialization { get; set; }
        public string Experience { get; set; }
        public string Certification { get; set; }
        public string Status { get; set; }
    }

    public class CoachDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Specialization { get; set; }
        public string Experience { get; set; }
        public string Certification { get; set; }
        public string Status { get; set; }
        public System.DateTime CreatedAt { get; set; }
        public System.DateTime? UpdatedAt { get; set; }
    }
}