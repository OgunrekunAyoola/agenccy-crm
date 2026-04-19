namespace Crm.Domain.Entities;

public class Contact : BaseEntity, ITenantedEntity
{
    public string FirstName   { get; set; } = string.Empty;
    public string LastName    { get; set; } = string.Empty;
    public string Email       { get; set; } = string.Empty;
    public string Phone       { get; set; } = string.Empty;
    public ContactType Type   { get; set; } = ContactType.Commercial;
    public Guid ClientId      { get; set; }
    public Client? Client     { get; set; }
    public Guid TenantId      { get; set; }
}
