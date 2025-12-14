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
    [Route("api/announcements")]
    [ApiController]
    public class CommunicationsController : ControllerBase
    {
        private readonly ApiContext _context;
        public CommunicationsController(ApiContext context) => _context = context;

        // GET: api/communications
        // Optional query: ?recipientType=parents
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CommunicationDto>>> GetAll([FromQuery] string recipientType = null)
        {
            var q = _context.Communications.AsQueryable();

            if (!string.IsNullOrWhiteSpace(recipientType))
                q = q.Where(c => c.RecipientType == recipientType);

            var list = await q.OrderByDescending(c => c.SentAt).ToListAsync();
            return list.Select(c => ToDto(c)).ToList();
        }

        // GET: api/communications/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<CommunicationDto>> GetById(int id)
        {
            var comm = await _context.Communications.FindAsync(id);
            if (comm == null) return NotFound();
            return ToDto(comm);
        }

        // POST: api/communications
        [HttpPost]
        public async Task<ActionResult<CommunicationDto>> Send([FromBody] CreateCommunicationDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var comm = new Communication
            {
                Subject = dto.Subject,
                Body = dto.Body,
                RecipientType = string.IsNullOrWhiteSpace(dto.RecipientType) ? "all" : dto.RecipientType,
                Recipient = dto.Recipient,
                SentAt = dto.Date ?? DateTime.UtcNow,
                Status = "Sent" // default; change if you implement queuing/actual delivery
            };

            _context.Communications.Add(comm);
            await _context.SaveChangesAsync();

            // TODO: enqueue actual delivery (email/notifications) and update Status accordingly.

            var result = ToDto(comm);
            return CreatedAtAction(nameof(GetById), new { id = comm.Id }, result);
        }

        // PUT: api/announcements/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateCommunicationDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var comm = await _context.Communications.FindAsync(id);
            if (comm == null) return NotFound();

            comm.Subject = dto.Subject ?? comm.Subject;
            comm.Body = dto.Body ?? comm.Body;
            comm.RecipientType = dto.RecipientType ?? comm.RecipientType;
            comm.Recipient = dto.Recipient ?? comm.Recipient;
            comm.UpdatedAt = DateTime.UtcNow;

            _context.Communications.Update(comm);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/announcements/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var comm = await _context.Communications.FindAsync(id);
            if (comm == null) return NotFound();

            _context.Communications.Remove(comm);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Mapping helper
        private static CommunicationDto ToDto(Communication c) => new CommunicationDto
        {
            Id = c.Id,
            Subject = c.Subject,
            Body = c.Body,
            RecipientType = c.RecipientType,
            Recipient = c.Recipient,
            SentAt = c.SentAt,
            Status = c.Status,
            CreatedAt = c.CreatedAt,
            UpdatedAt = c.UpdatedAt
        };
    }

    // DTOs
    public class CreateCommunicationDto
    {
        public string Subject { get; set; }
        public string Body { get; set; }
        public string RecipientType { get; set; } // "all", "parents", "coaches", "players"
        public string Recipient { get; set; } // optional custom audience
        public DateTime? Date { get; set; } // optional ISO date from frontend
    }

    public class CommunicationDto
    {
        public int Id { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
        public string RecipientType { get; set; }
        public string Recipient { get; set; }
        public DateTime SentAt { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class UpdateCommunicationDto
    {
        public string Subject { get; set; }
        public string Body { get; set; }
        public string RecipientType { get; set; }
        public string Recipient { get; set; }
    }
}