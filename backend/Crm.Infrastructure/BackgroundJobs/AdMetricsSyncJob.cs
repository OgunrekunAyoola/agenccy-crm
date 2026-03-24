using Microsoft.Extensions.Logging;

namespace Crm.Infrastructure.BackgroundJobs;

public class AdMetricsSyncJob
{
    private readonly ILogger<AdMetricsSyncJob> _logger;

    public AdMetricsSyncJob(ILogger<AdMetricsSyncJob> logger)
    {
        _logger = logger;
    }

    public async Task ExecuteAsync()
    {
        _logger.LogInformation("Starting Ad Metrics Sync Job at {Time}", DateTimeOffset.Now);
        
        // Stub for Google Ads
        _logger.LogInformation("Syncing Google Ads metrics... [STUB]");
        await Task.Delay(500);
        
        // Stub for Meta Ads
        _logger.LogInformation("Syncing Meta Ads metrics... [STUB]");
        await Task.Delay(500);
        
        // Stub for TikTok Ads
        _logger.LogInformation("Syncing TikTok Ads metrics... [STUB]");
        await Task.Delay(500);

        _logger.LogInformation("Ad Metrics Sync Job completed successfully at {Time}", DateTimeOffset.Now);
    }
}
