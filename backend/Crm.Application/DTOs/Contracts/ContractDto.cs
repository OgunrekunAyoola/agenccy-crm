using Crm.Domain.Entities;

namespace Crm.Application.DTOs.Contracts;

public class CreateContractRequest
{
    public string Title { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public string Terms { get; set; } = string.Empty;
    public string Kpis { get; set; } = string.Empty;
    public Guid ProjectId { get; set; }
}

public class ContractResponse
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public ContractStatus Status { get; set; }
    public Guid ProjectId { get; set; }
    public DateTime CreatedAt { get; set; }
}
