using BAMS_backend.Data;
using BAMS_backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace BAMS_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class UserManagementController : ControllerBase
    {
        private readonly ApiContext _context;

        public UserManagementController(ApiContext context)
        {
            _context = context;
        }


        // GET: api/usermanagement/pending
        [HttpGet("pending")]
        public async Task<IActionResult> GetPendingUsers()
        {
            var users = await _context.Users
                .Where(u => !u.IsApproved)
                .Select(u => new
                {
                    id = u.Id,
                    email = u.Email,
                    firstName = u.FirstName,
                    lastName = u.LastName,
                    role = u.Role,
                    phone = u.Phone,
                    date = u.CreatedAt
                })
                .ToListAsync();

            return Ok(users);
        }

        // POST: api/usermanagement/{id}/approve
        [HttpPost("{id}/approve")]
        public async Task<IActionResult> Approve(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound(new { message = "User not found" });

            user.IsApproved = true;
            await _context.SaveChangesAsync();

            return Ok(new { message = "User approved", userId = user.Id });
        }

        // POST: api/usermanagement/{id}/reject
        [HttpPost("{id}/reject")]
        public async Task<IActionResult> Reject(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound(new { message = "User not found" });

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User rejected and removed", userId = id });
        }

        // POST: api/usermanagement/create-admin
        [HttpPost("create-admin")]
        public async Task<IActionResult> CreateAdmin([FromBody] CreateAdminRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email))
                return BadRequest(new { message = "Email is required" });

            if (await _context.Users.AnyAsync(u => u.Email.ToLower() == request.Email.ToLower()))
                return BadRequest(new { message = "User with this email already exists" });

            var password = string.IsNullOrEmpty(request.Password) ? GenerateTemporaryPassword(12) : request.Password;
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(password);

            var user = new User
            {
                Email = request.Email,
                FirstName = request.FirstName,
                LastName = request.LastName,
                Phone = request.Phone,
                Role = "Admin",
                PasswordHash = passwordHash,
                CreatedAt = DateTime.UtcNow,
                IsApproved = true
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // If you generated a temp password, return it so caller can communicate it to the admin.
            return Ok(new
            {
                id = user.Id,
                email = user.Email,
                tempPassword = string.IsNullOrEmpty(request.Password) ? password : null
            });
        }

        private string GenerateTemporaryPassword(int length = 12)
        {
            const string chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var data = new byte[length];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(data);
            var result = new StringBuilder(length);
            foreach (var b in data)
            {
                result.Append(chars[b % chars.Length]);
            }
            return result.ToString();
        }
    }

    public class CreateAdminRequest
    {
        public string Email { get; set; }
        public string Password { get; set; } // optional; if empty a temp password is generated
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Phone { get; set; }
    }
}