namespace Crm.Domain.Entities;

// Named CrmTask to avoid conflict with System.Threading.Tasks.Task
public class CrmTask : BaseEntity, ITenantedEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsCompleted { get; set; }
    public Guid ProjectId { get; set; }
    public Project? Project { get; set; }
    public Guid TenantId { get; set; }
}
