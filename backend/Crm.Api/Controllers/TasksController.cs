using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Crm.Application.Services;
using Crm.Application.DTOs.Tasks;

namespace Crm.Api.Controllers;

[Authorize(Roles = "Admin,ProjectManager")]
[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly TaskService _taskService;

    public TasksController(TaskService taskService)
    {
        _taskService = taskService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TaskResponse>>> GetTasks()
    {
        var tasks = await _taskService.GetAllAsync();
        return Ok(tasks);
    }

    [HttpPost]
    public async Task<ActionResult<TaskResponse>> CreateTask(CreateTaskRequest request)
    {
        var response = await _taskService.CreateAsync(request);
        return CreatedAtAction(nameof(GetTasks), new { id = response.Id }, response);
    }
}
