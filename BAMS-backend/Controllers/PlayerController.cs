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
    public class PlayersController : ControllerBase
    {
        private readonly ApiContext _context;

        public PlayersController(ApiContext context)
        {
            _context = context;
        }

        // GET: api/players
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PlayerDto>>> GetPlayers()
        {
            var players = await _context.Players
                .Include(p => p.Parent)
                .ToListAsync();

            return players.Select(p => ToDto(p)).ToList();
        }

        // GET: api/players/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<PlayerDto>> GetPlayer(int id)
        {
            var player = await _context.Players
                .Include(p => p.Parent)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (player == null) return NotFound();

            return ToDto(player);
        }

        // POST: api/players
        [HttpPost]
        public async Task<ActionResult<PlayerDto>> CreatePlayer([FromBody] CreatePlayerDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var player = new Player
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                Age = dto.Age,
                Team = dto.Team,
                GuardianName = dto.GuardianName,
                GuardianPhone = dto.GuardianPhone,
                Status = string.IsNullOrWhiteSpace(dto.Status) ? "Active" : dto.Status,
                ParentId = dto.ParentId
            };

            _context.Players.Add(player);
            await _context.SaveChangesAsync();

            var result = ToDto(player);
            return CreatedAtAction(nameof(GetPlayer), new { id = player.Id }, result);
        }

        // PUT: api/players/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdatePlayer(int id, [FromBody] UpdatePlayerDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var player = await _context.Players.FindAsync(id);
            if (player == null) return NotFound();

            player.FirstName = dto.FirstName ?? player.FirstName;
            player.LastName = dto.LastName ?? player.LastName;
            player.Email = dto.Email ?? player.Email;
            player.Age = dto.Age ?? player.Age;
            player.Team = dto.Team ?? player.Team;
            player.GuardianName = dto.GuardianName ?? player.GuardianName;
            player.GuardianPhone = dto.GuardianPhone ?? player.GuardianPhone;
            player.Status = dto.Status ?? player.Status;
            player.ParentId = dto.ParentId ?? player.ParentId;
            player.UpdatedAt = System.DateTime.UtcNow;

            _context.Players.Update(player);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/players/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeletePlayer(int id)
        {
            var player = await _context.Players.FindAsync(id);
            if (player == null) return NotFound();

            _context.Players.Remove(player);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Mapping helper
        private static PlayerDto ToDto(Player p) => new PlayerDto
        {
            Id = p.Id,
            FirstName = p.FirstName,
            LastName = p.LastName,
            Email = p.Email,
            Age = p.Age,
            Team = p.Team,
            GuardianName = p.GuardianName,
            GuardianPhone = p.GuardianPhone,
            Status = p.Status,
            ParentId = p.ParentId,
            CreatedAt = p.CreatedAt,
            UpdatedAt = p.UpdatedAt
        };
    }

    // DTOs
    public class CreatePlayerDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public int? Age { get; set; }
        public string Team { get; set; }
        public string GuardianName { get; set; }
        public string GuardianPhone { get; set; }
        public string Status { get; set; }
        public int? ParentId { get; set; }
    }

    public class UpdatePlayerDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public int? Age { get; set; }
        public string Team { get; set; }
        public string GuardianName { get; set; }
        public string GuardianPhone { get; set; }
        public string Status { get; set; }
        public int? ParentId { get; set; }
    }

    public class PlayerDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public int? Age { get; set; }
        public string Team { get; set; }
        public string GuardianName { get; set; }
        public string GuardianPhone { get; set; }
        public string Status { get; set; }
        public int? ParentId { get; set; }
        public System.DateTime CreatedAt { get; set; }
        public System.DateTime? UpdatedAt { get; set; }
    }
}