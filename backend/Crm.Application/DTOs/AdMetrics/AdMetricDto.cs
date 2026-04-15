using Crm.Domain.Entities;

namespace Crm.Application.DTOs.AdMetrics;

public class CreateAdMetricRequest
{
    public Guid ProjectId { get; set; }
    public AdPlatform Platform { get; set; }
    public decimal Spend { get; set; }
    public long Impressions { get; set; }
    public long Clicks { get; set; }
    public long Conversions { get; set; }
    public DateTime Date { get; set; }
}

public class AdMetricResponse
{
    public Guid Id { get; set; }
    public Guid ProjectId { get; set; }
    public AdPlatform Platform { get; set; }
    public decimal Spend { get; set; }
    public long Impressions { get; set; }
    public long Clicks { get; set; }
    public long Conversions { get; set; }
    public DateTime Date { get; set; }
    public DateTime CreatedAt { get; set; }
}
