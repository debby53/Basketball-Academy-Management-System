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
    public class PaymentsController : ControllerBase
    {
        private readonly ApiContext _context;
        public PaymentsController(ApiContext context) => _context = context;

        // GET: api/payments
        // Optional query: ?status=Paid&search=playerName
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaymentDto>>> GetPayments([FromQuery] string status = null, [FromQuery] string search = null)
        {
            var q = _context.Payments.AsQueryable();

            if (!string.IsNullOrWhiteSpace(status))
                q = q.Where(p => p.Status == status);

            if (!string.IsNullOrWhiteSpace(search))
                q = q.Where(p => p.PlayerName.Contains(search) || p.Description.Contains(search));

            var list = await q
                .Include(p => p.Player)
                .OrderByDescending(p => p.Date)
                .ToListAsync();

            return list.Select(p => ToDto(p)).ToList();
        }

        // GET: api/payments/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<PaymentDto>> GetPayment(int id)
        {
            var p = await _context.Payments.Include(x => x.Player).FirstOrDefaultAsync(x => x.Id == id);
            if (p == null) return NotFound();
            return ToDto(p);
        }

        // POST: api/payments
        [HttpPost]
        public async Task<ActionResult<PaymentDto>> CreatePayment([FromBody] CreatePaymentDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var payment = new Payment
            {
                PlayerId = dto.PlayerId,
                PlayerName = dto.PlayerName,
                Amount = dto.Amount,
                Date = dto.Date ?? System.DateTime.UtcNow,
                Method = dto.Method ?? "Cash",
                Description = dto.Description,
                Status = string.IsNullOrWhiteSpace(dto.Status) ? "Paid" : dto.Status
            };

            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            // reload with navigation
            await _context.Entry(payment).Reference(x => x.Player).LoadAsync();

            var result = ToDto(payment);
            return CreatedAtAction(nameof(GetPayment), new { id = payment.Id }, result);
        }

        // PUT: api/payments/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdatePayment(int id, [FromBody] UpdatePaymentDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var payment = await _context.Payments.FindAsync(id);
            if (payment == null) return NotFound();

            payment.PlayerId = dto.PlayerId ?? payment.PlayerId;
            payment.PlayerName = dto.PlayerName ?? payment.PlayerName;
            payment.Amount = dto.Amount ?? payment.Amount;
            payment.Date = dto.Date ?? payment.Date;
            payment.Method = dto.Method ?? payment.Method;
            payment.Description = dto.Description ?? payment.Description;
            payment.Status = dto.Status ?? payment.Status;
            payment.UpdatedAt = System.DateTime.UtcNow;

            _context.Payments.Update(payment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/payments/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeletePayment(int id)
        {
            var p = await _context.Payments.FindAsync(id);
            if (p == null) return NotFound();
            _context.Payments.Remove(p);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private static PaymentDto ToDto(Payment p) => new PaymentDto
        {
            Id = p.Id,
            PlayerId = p.PlayerId,
            PlayerName = p.PlayerName,
            Amount = p.Amount,
            Date = p.Date,
            Method = p.Method,
            Description = p.Description,
            Status = p.Status,
            CreatedAt = p.CreatedAt,
            UpdatedAt = p.UpdatedAt
        };
    }

    // DTOs
    public class CreatePaymentDto
    {
        public int? PlayerId { get; set; }
        public string PlayerName { get; set; }
        public decimal Amount { get; set; }
        public System.DateTime? Date { get; set; }
        public string Method { get; set; }
        public string Description { get; set; }
        public string Status { get; set; } // e.g., Paid
    }

    public class UpdatePaymentDto
    {
        public int? PlayerId { get; set; }
        public string PlayerName { get; set; }
        public decimal? Amount { get; set; }
        public System.DateTime? Date { get; set; }
        public string Method { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
    }

    public class PaymentDto
    {
        public int Id { get; set; }
        public int? PlayerId { get; set; }
        public string PlayerName { get; set; }
        public decimal Amount { get; set; }
        public System.DateTime Date { get; set; }
        public string Method { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public System.DateTime CreatedAt { get; set; }
        public System.DateTime? UpdatedAt { get; set; }
    }
}