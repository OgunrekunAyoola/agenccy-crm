namespace Crm.Domain.Entities;

public enum LeadStatus
{
    New,
    Contacted,
    Qualified,
    Lost
}

public class Lead : BaseEntity, ITenantedEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public LeadStatus Status { get; set; } = LeadStatus.New;
    public Guid? ConvertedClientId { get; set; }
    public Client? ConvertedClient { get; set; }
    public Guid TenantId { get; set; }
    public ICollection<Offer> Offers { get; set; } = new List<Offer>();
}
