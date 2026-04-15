using System.Diagnostics.Metrics;

namespace Crm.Infrastructure.Monitoring;

public static class CrmMetrics
{
    private static readonly Meter Meter = new("Crm.Api", "1.0.0");

    public static readonly Counter<long> RequestCounter = Meter.CreateCounter<long>(
        "crm_requests_total",
        description: "Total number of API requests processed.");

    public static readonly Counter<long> ErrorCounter = Meter.CreateCounter<long>(
        "crm_errors_total",
        description: "Total number of API errors encountered.");

    public static readonly Histogram<double> RequestDuration = Meter.CreateHistogram<double>(
        "crm_request_duration_seconds",
        unit: "s",
        description: "Distribution of API request durations.");
}
