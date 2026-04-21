using Crm.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Crm.Api.Middleware;

public class TenantResolutionMiddleware
{
    private readonly RequestDelegate _next;

    public TenantResolutionMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, AppDbContext db)
    {
        var host = context.Request.Host.Host; // e.g. "tesla.studiomeshcrm.com"
        var parts = host.Split('.');

        // Expect at least subdomain.domain.tld (3 parts), and not "app" or "www"
        if (parts.Length >= 3)
        {
            var subdomain = parts[0].ToLowerInvariant();
            if (subdomain != "app" && subdomain != "www")
            {
                var tenant = await db.Tenants
                    .AsNoTracking()
                    .FirstOrDefaultAsync(t => t.Slug == subdomain);

                if (tenant != null)
                {
                    context.Items["TenantId"] = tenant.Id;
                }
            }
        }

        await _next(context);
    }
}
