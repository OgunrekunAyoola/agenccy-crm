namespace Crm.Domain.Entities;

public class Client : BaseEntity, ITenantedEntity
{
    public string Name { get; set; } = string.Empty;
    public Guid TenantId { get; set; }
    public ICollection<Contact> Contacts { get; set; } = new List<Contact>();
}
