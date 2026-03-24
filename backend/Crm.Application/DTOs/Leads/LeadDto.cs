using Crm.Domain.Entities;

namespace Crm.Application.DTOs.Leads;

public class CreateLeadRequest
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class UpdateLeadStatusRequest
{
    public LeadStatus Status { get; set; }
}

public class LeadResponse
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public LeadStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
}
