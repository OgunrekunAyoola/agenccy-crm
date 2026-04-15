using Crm.Application.DTOs.TimeEntries;
using Crm.Application.Interfaces;
using Crm.Domain.Entities;

namespace Crm.Application.Services;

public class TimeEntryService
{
    private readonly IGenericRepository<TimeEntry> _repository;
    private readonly ICurrentUserContext _currentUserContext;

    public TimeEntryService(IGenericRepository<TimeEntry> repository, ICurrentUserContext currentUserContext)
    {
        _repository = repository;
        _currentUserContext = currentUserContext;
    }

    public async Task<IEnumerable<TimeEntryResponse>> GetProjectTimeEntriesAsync(Guid projectId)
    {
        var entries = await _repository.GetAllAsync();
        return entries.Where(e => e.ProjectId == projectId).Select(MapToResponse).ToList();
    }

    public async Task<IEnumerable<TimeEntryResponse>> GetAllAsync()
    {
        var entries = await _repository.GetAllAsync();
        return entries.Select(MapToResponse).ToList();
    }

    public async Task<TimeEntryResponse> CreateAsync(CreateTimeEntryRequest request)
    {
        var userId = _currentUserContext.UserId ?? throw new UnauthorizedAccessException("User must be logged in to create a time entry.");
        var tenantId = _currentUserContext.TenantId ?? throw new UnauthorizedAccessException("Tenant context is required to create a time entry.");

        var entry = new TimeEntry
        {
            Id = Guid.NewGuid(),
            ProjectId = request.ProjectId,
            UserId = userId,
            TenantId = tenantId,
            Hours = request.Hours,
            Description = request.Description,
            Date = request.Date
        };

        await _repository.AddAsync(entry);
        await _repository.SaveChangesAsync();

        return MapToResponse(entry);
    }

    private TimeEntryResponse MapToResponse(TimeEntry e)
    {
        return new TimeEntryResponse
        {
            Id = e.Id,
            ProjectId = e.ProjectId,
            UserId = e.UserId,
            Hours = e.Hours,
            Description = e.Description,
            Date = e.Date,
            CreatedAt = e.CreatedAt
        };
    }
}
