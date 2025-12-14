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
    public class ParentsController : ControllerBase
    {
        private readonly ApiContext _context;

        public ParentsController(ApiContext context)
        {
            _context = context;
        }

        // GET: api/parents
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ParentDto>>> GetParents()
        {
            var parents = await _context.Parents
                .Include(p => p.Children)
                .ToListAsync();

            return parents.Select(p => ToDto(p)).ToList();
        }

        // GET: api/parents/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<ParentDto>> GetParent(int id)
        {
            var parent = await _context.Parents
                .Include(p => p.Children)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (parent == null) return NotFound();

            return ToDto(parent);
        }

        // POST: api/parents
        [HttpPost]
        public async Task<ActionResult<ParentDto>> CreateParent([FromBody] CreateParentDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var parent = new Parent
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                Phone = dto.Phone,
                Address = dto.Address,
                Status = string.IsNullOrWhiteSpace(dto.Status) ? "Active" : dto.Status
            };

            _context.Parents.Add(parent);
            await _context.SaveChangesAsync();

            var result = ToDto(parent);
            return CreatedAtAction(nameof(GetParent), new { id = parent.Id }, result);
        }

        // PUT: api/parents/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateParent(int id, [FromBody] UpdateParentDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var parent = await _context.Parents.FindAsync(id);
            if (parent == null) return NotFound();

            parent.FirstName = dto.FirstName ?? parent.FirstName;
            parent.LastName = dto.LastName ?? parent.LastName;
            parent.Email = dto.Email ?? parent.Email;
            parent.Phone = dto.Phone ?? parent.Phone;
            parent.Address = dto.Address ?? parent.Address;
            parent.Status = dto.Status ?? parent.Status;
            parent.UpdatedAt = System.DateTime.UtcNow;

            _context.Parents.Update(parent);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/parents/5/children
        [HttpGet("{id:int}/children")]
        public async Task<ActionResult<IEnumerable<ChildRefDto>>> GetParentChildren(int id)
        {
            var parent = await _context.Parents
                .Include(p => p.Children)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (parent == null) return NotFound();

            var children = parent.Children?.Select(c => new ChildRefDto 
            { 
                Id = c.Id, 
                FirstName = c.FirstName, 
                LastName = c.LastName,
                Email = c.Email,
                Age = c.Age,
                Team = c.Team,
                Status = c.Status
            }).ToList() ?? new List<ChildRefDto>();

            return Ok(children);
        }

        // DELETE: api/parents/5
        // Safe delete: unassign children (set ParentId = null) before removing parent
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteParent(int id)
        {
            var parent = await _context.Parents
                .Include(p => p.Children)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (parent == null) return NotFound();

            // Unassign children to avoid FK constraint (if Player.ParentId is non-nullable update accordingly)
            if (parent.Children != null && parent.Children.Any())
            {
                foreach (var child in parent.Children)
                {
                    child.ParentId = null;
                }
                _context.Players.UpdateRange(parent.Children);
            }

            _context.Parents.Remove(parent);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Mapping helper
        private static ParentDto ToDto(Parent p) => new ParentDto
        {
            Id = p.Id,
            FirstName = p.FirstName,
            LastName = p.LastName,
            Email = p.Email,
            Phone = p.Phone,
            Address = p.Address,
            Status = p.Status,
            Children = p.Children?.Select(c => new ChildRefDto { Id = c.Id, FirstName = c.FirstName, LastName = c.LastName }).ToList(),
            CreatedAt = p.CreatedAt,
            UpdatedAt = p.UpdatedAt
        };
    }

    // DTOs
    public class CreateParentDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string Status { get; set; }
    }

    public class UpdateParentDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string Status { get; set; }
    }

    public class ParentDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string Status { get; set; }
        public List<ChildRefDto> Children { get; set; }
        public System.DateTime CreatedAt { get; set; }
        public System.DateTime? UpdatedAt { get; set; }
    }

    public class ChildRefDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public int? Age { get; set; }
        public string Team { get; set; }
        public string Status { get; set; }
    }
}