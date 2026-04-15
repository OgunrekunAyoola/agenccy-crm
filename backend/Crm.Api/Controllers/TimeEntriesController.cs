using Crm.Application.DTOs.TimeEntries;
using Crm.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Crm.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TimeEntriesController : ControllerBase
{
    private readonly TimeEntryService _timeEntryService;

    public TimeEntriesController(TimeEntryService timeEntryService)
    {
        _timeEntryService = timeEntryService;
    }

    [HttpGet("project/{projectId}")]
    public async Task<ActionResult<IEnumerable<TimeEntryResponse>>> GetProjectEntries(Guid projectId)
    {
        var entries = await _timeEntryService.GetProjectTimeEntriesAsync(projectId);
        return Ok(entries);
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TimeEntryResponse>>> GetAllEntries()
    {
        var entries = await _timeEntryService.GetAllAsync();
        return Ok(entries);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,ProjectManager")]
    public async Task<ActionResult<TimeEntryResponse>> CreateEntry(CreateTimeEntryRequest request)
    {
        var response = await _timeEntryService.CreateAsync(request);
        return Ok(response);
    }
}
