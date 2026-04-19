using Crm.Application.DTOs.Clients;
using Crm.Application.Interfaces;
using Crm.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Crm.Application.Services;

public class ClientService
{
    private readonly IGenericRepository<Client> _repository;
    private readonly IGenericRepository<Project> _projects;
    private readonly IGenericRepository<Lead> _leads;
    private readonly IGenericRepository<Offer> _offers;
    private readonly IGenericRepository<Invoice> _invoices;
    private readonly IGenericRepository<AdMetric> _adMetrics;
    private readonly ICurrentUserContext _currentUserContext;

    public ClientService(
        IGenericRepository<Client> repository,
        IGenericRepository<Project> projects,
        IGenericRepository<Lead> leads,
        IGenericRepository<Offer> offers,
        IGenericRepository<Invoice> invoices,
        IGenericRepository<AdMetric> adMetrics,
        ICurrentUserContext currentUserContext)
    {
        _repository   = repository;
        _projects     = projects;
        _leads        = leads;
        _offers       = offers;
        _invoices     = invoices;
        _adMetrics    = adMetrics;
        _currentUserContext = currentUserContext;
    }

    public async Task<IEnumerable<ClientResponse>> GetAllAsync()
    {
        var clients = await _repository.AsQueryable()
            .Include(c => c.Contacts)
            .ToListAsync();

        return clients.Select(MapToResponse).ToList();
    }

    public async Task<ClientResponse> CreateAsync(CreateClientRequest request)
    {
        var tenantId = _currentUserContext.TenantId ?? Guid.Empty;

        var client = new Client
        {
            Id              = Guid.NewGuid(),
            Name            = request.Name,
            LegalName       = request.LegalName,
            VatNumber       = request.VatNumber,
            BusinessAddress = request.BusinessAddress,
            Industry        = request.Industry,
            Priority        = request.Priority,
            TenantId        = tenantId,
        };

        if (request.CommercialContact is { } cc && !string.IsNullOrWhiteSpace(cc.FirstName))
        {
            client.Contacts.Add(new Contact
            {
                Id        = Guid.NewGuid(),
                FirstName = cc.FirstName,
                LastName  = cc.LastName,
                Email     = cc.Email,
                Phone     = cc.Phone,
                Type      = ContactType.Commercial,
                TenantId  = tenantId,
            });
        }

        if (request.FinancialContact is { } fc && !string.IsNullOrWhiteSpace(fc.FirstName))
        {
            client.Contacts.Add(new Contact
            {
                Id        = Guid.NewGuid(),
                FirstName = fc.FirstName,
                LastName  = fc.LastName,
                Email     = fc.Email,
                Phone     = fc.Phone,
                Type      = ContactType.Financial,
                TenantId  = tenantId,
            });
        }

        await _repository.AddAsync(client);
        await _repository.SaveChangesAsync();

        return MapToResponse(client);
    }

    /// <summary>
    /// Returns aggregated dashboard metrics for a single client.
    /// All queries rely on EF Core global tenant filter — no explicit TenantId filter needed.
    /// </summary>
    public async Task<ClientDashboardDto?> GetDashboardAsync(Guid clientId)
    {
        var client = await _repository.AsQueryable()
            .FirstOrDefaultAsync(c => c.Id == clientId);

        if (client == null) return null;

        var clientProjectIds = await _projects.AsQueryable()
            .Where(p => p.ClientId == clientId)
            .Select(p => p.Id)
            .ToListAsync();

        var activeProjectsCount = await _projects.AsQueryable()
            .CountAsync(p => p.ClientId == clientId && p.Status == ProjectStatus.Active);

        var openLeadsCount = await _leads.AsQueryable()
            .CountAsync(l => l.ConvertedClientId == clientId &&
                (l.Status == LeadStatus.New || l.Status == LeadStatus.Contacted || l.Status == LeadStatus.Qualified));

        var pendingOffersCount = await _offers.AsQueryable()
            .Where(o => o.Lead != null && o.Lead.ConvertedClientId == clientId)
            .CountAsync(o => o.Status == OfferStatus.Draft || o.Status == OfferStatus.Sent);

        // Cast to double — SQLite does not support Sum on decimal columns.
        var totalInvoiced = (decimal)(await _invoices.AsQueryable()
            .Where(i => i.ClientId == clientId)
            .SumAsync(i => (double?)i.TotalAmount) ?? 0d);

        var totalPaid = (decimal)(await _invoices.AsQueryable()
            .Where(i => i.ClientId == clientId && i.Status == InvoiceStatus.Paid)
            .SumAsync(i => (double?)i.TotalAmount) ?? 0d);

        var totalAdSpend = clientProjectIds.Any()
            ? (decimal)(await _adMetrics.AsQueryable()
                .Where(m => clientProjectIds.Contains(m.ProjectId))
                .SumAsync(m => (double?)m.Spend) ?? 0d)
            : 0m;

        return new ClientDashboardDto
        {
            Id                  = client.Id,
            Name                = client.Name,
            LegalName           = client.LegalName,
            Industry            = client.Industry,
            BusinessAddress     = client.BusinessAddress,
            ActiveProjectsCount = activeProjectsCount,
            OpenLeadsCount      = openLeadsCount,
            PendingOffersCount  = pendingOffersCount,
            TotalInvoiced       = totalInvoiced,
            TotalPaid           = totalPaid,
            TotalOutstanding    = totalInvoiced - totalPaid,
            TotalAdSpend        = totalAdSpend,
        };
    }

    private static ClientResponse MapToResponse(Client c) => new()
    {
        Id              = c.Id,
        Name            = c.Name,
        LegalName       = c.LegalName,
        VatNumber       = c.VatNumber,
        BusinessAddress = c.BusinessAddress,
        Industry        = c.Industry,
        Priority        = c.Priority,
        CreatedAt       = c.CreatedAt,
        Contacts        = c.Contacts.Select(ct => new ContactResponse
        {
            FirstName = ct.FirstName,
            LastName  = ct.LastName,
            Email     = ct.Email,
            Phone     = ct.Phone,
            Type      = ct.Type,
        }).ToList(),
    };
}
