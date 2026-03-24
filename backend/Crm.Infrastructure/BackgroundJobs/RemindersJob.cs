using Microsoft.Extensions.Logging;

namespace Crm.Infrastructure.BackgroundJobs;

public class RemindersJob
{
    private readonly ILogger<RemindersJob> _logger;

    public RemindersJob(ILogger<RemindersJob> logger)
    {
        _logger = logger;
    }

    public async Task ExecuteAsync()
    {
        _logger.LogInformation("Starting Reminders Job at {Time}", DateTimeOffset.Now);
        
        // Stub for Overdue Offers
        _logger.LogInformation("Checking for overdue offers and sending reminders... [STUB]");
        await Task.Delay(300);
        
        // Stub for Overdue Invoices
        _logger.LogInformation("Checking for unpaid invoices and sending reminders... [STUB]");
        await Task.Delay(300);

        _logger.LogInformation("Reminders Job completed successfully at {Time}", DateTimeOffset.Now);
    }
}
