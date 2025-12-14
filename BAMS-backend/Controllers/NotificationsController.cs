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
    public class NotificationsController : ControllerBase
    {
        private readonly ApiContext _context;

        public NotificationsController(ApiContext context)
        {
            _context = context;
        }

        // GET: api/notifications
        [HttpGet]
        public async Task<ActionResult<IEnumerable<NotificationDto>>> GetNotifications([FromQuery] int? userId = null, [FromQuery] bool? unreadOnly = null)
        {
            var query = _context.Notifications
                .Include(n => n.User)
                .AsQueryable();

            if (userId.HasValue)
                query = query.Where(n => n.UserId == userId.Value);

            if (unreadOnly == true)
                query = query.Where(n => !n.IsRead);

            var list = await query
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();

            return list.Select(n => ToDto(n)).ToList();
        }

        // POST: api/notifications/mark-read
        [HttpPost("mark-read")]
        public async Task<IActionResult> MarkAsRead([FromBody] MarkReadRequest request)
        {
            if (request.Ids == null || !request.Ids.Any())
                return BadRequest(new { message = "No notification IDs provided" });

            var notifications = await _context.Notifications
                .Where(n => request.Ids.Contains(n.Id))
                .ToListAsync();

            foreach (var notification in notifications)
            {
                notification.IsRead = true;
            }

            _context.Notifications.UpdateRange(notifications);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"{notifications.Count} notification(s) marked as read" });
        }

        // POST: api/notifications (create notification - for internal use)
        [HttpPost]
        public async Task<ActionResult<NotificationDto>> Create([FromBody] CreateNotificationDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var notification = new Notification
            {
                UserId = dto.UserId,
                Title = dto.Title,
                Message = dto.Message,
                Type = dto.Type ?? "Info"
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();

            await _context.Entry(notification).Reference(n => n.User).LoadAsync();

            var result = ToDto(notification);
            return CreatedAtAction(nameof(GetNotifications), new { userId = notification.UserId }, result);
        }

        // Mapping helper
        private static NotificationDto ToDto(Notification n) => new NotificationDto
        {
            Id = n.Id,
            UserId = n.UserId,
            Title = n.Title,
            Message = n.Message,
            Type = n.Type,
            IsRead = n.IsRead,
            CreatedAt = n.CreatedAt
        };
    }

    // DTOs
    public class CreateNotificationDto
    {
        public int UserId { get; set; }
        public string Title { get; set; }
        public string Message { get; set; }
        public string Type { get; set; }
    }

    public class NotificationDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Title { get; set; }
        public string Message { get; set; }
        public string Type { get; set; }
        public bool IsRead { get; set; }
        public System.DateTime CreatedAt { get; set; }
    }

    public class MarkReadRequest
    {
        public List<int> Ids { get; set; }
    }
}
