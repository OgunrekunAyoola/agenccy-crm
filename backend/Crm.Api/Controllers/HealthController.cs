using Crm.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;

namespace Crm.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class HealthController : ControllerBase
{
    private readonly AppDbContext _context;

    public HealthController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        try
        {
            var canConnect = await _context.Database.CanConnectAsync();
            if (canConnect)
            {
                return Ok(new { Status = "Healthy", Database = "Connected" });
            }
            return StatusCode(503, new { Status = "Unhealthy", Database = "Disconnected" });
        }
        catch (Exception ex)
        {
            return StatusCode(503, new { Status = "Unhealthy", Error = ex.Message });
        }
    }
}
