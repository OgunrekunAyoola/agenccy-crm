namespace Crm.Application.Interfaces;

public interface ITenantProvider
{
    Guid? GetTenantId();
}
