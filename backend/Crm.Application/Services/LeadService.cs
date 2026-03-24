using Crm.Application.DTOs.Leads;
using Crm.Application.Interfaces;
using Crm.Domain.Entities;

namespace Crm.Application.Services;

public class LeadService
{
    private readonly IGenericRepository<Lead> _repository;

    public LeadService(IGenericRepository<Lead> repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<LeadResponse>> GetAllAsync()
    {
        var leads = await _repository.GetAllAsync();
        return leads.Select(l => new LeadResponse
        {
            Id = l.Id,
            Title = l.Title,
            Description = l.Description,
            Status = l.Status,
            CreatedAt = l.CreatedAt
        });
    }

    public async Task<LeadResponse> CreateAsync(CreateLeadRequest request)
    {
        var lead = new Lead
        {
            Id = Guid.NewGuid(),
            Title = request.Title,
            Description = request.Description
        };

        await _repository.AddAsync(lead);
        await _repository.SaveChangesAsync();

        return new LeadResponse
        {
            Id = lead.Id,
            Title = lead.Title,
            Description = lead.Description,
            Status = lead.Status,
            CreatedAt = lead.CreatedAt
        };
    }

    public async Task<LeadResponse?> UpdateStatusAsync(Guid id, UpdateLeadStatusRequest request)
    {
        var lead = await _repository.GetByIdAsync(id);
        if (lead == null) return null;

        lead.Status = request.Status;
        await _repository.UpdateAsync(lead);
        await _repository.SaveChangesAsync();

        return new LeadResponse
        {
            Id = lead.Id,
            Title = lead.Title,
            Description = lead.Description,
            Status = lead.Status,
            CreatedAt = lead.CreatedAt
        };
    }
}
