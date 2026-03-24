namespace Crm.Domain.Entities;

public enum ContractStatus
{
    Draft,
    Sent,
    Signed,
    Completed,
    Cancelled
}

public class Contract : BaseEntity, ITenantedEntity
{
    public string Title { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public string Terms { get; set; } = string.Empty;
    public string Kpis { get; set; } = string.Empty;
    public ContractStatus Status { get; set; } = ContractStatus.Draft;
    
    public Guid ProjectId { get; set; }
    public Project? Project { get; set; }
    public Guid TenantId { get; set; }
}
