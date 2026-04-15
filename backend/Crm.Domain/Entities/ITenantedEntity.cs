namespace Crm.Domain.Entities;

public interface ITenantedEntity
{
    Guid TenantId { get; set; }
}
