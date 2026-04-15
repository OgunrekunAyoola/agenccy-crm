using Microsoft.AspNetCore.Http;
using Serilog.Context;
using Crm.Application.Interfaces;

namespace Crm.Api.Middleware;

public class LogEnrichmentMiddleware
{
    private readonly RequestDelegate _next;

    public LogEnrichmentMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, ICurrentUserContext userContext)
    {
        var tenantId = userContext.TenantId;
        var userId = userContext.UserId;

        using (LogContext.PushProperty("TenantId", tenantId))
        using (LogContext.PushProperty("UserId", userId))
        using (LogContext.PushProperty("RequestId", context.TraceIdentifier))
        {
            await _next(context);
        }
    }
}
