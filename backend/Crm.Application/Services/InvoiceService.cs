using Crm.Application.DTOs.Invoices;
using Crm.Application.Interfaces;
using Crm.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Crm.Application.Services;

public class InvoiceService
{
    private readonly IGenericRepository<Invoice> _repository;
    private readonly IGenericRepository<Contract> _contractRepository;
    private readonly IGenericRepository<Project> _projectRepository;

    public InvoiceService(
        IGenericRepository<Invoice> repository,
        IGenericRepository<Contract> contractRepository,
        IGenericRepository<Project> projectRepository)
    {
        _repository = repository;
        _contractRepository = contractRepository;
        _projectRepository = projectRepository;
    }

    public async Task<IEnumerable<InvoiceResponse>> GetAllAsync()
    {
        var invoices = await _repository.AsQueryable().Include(i => i.Items).ToListAsync();
        return invoices.Select(MapToResponse).ToList();
    }

    public async Task<InvoiceResponse> CreateAsync(CreateInvoiceRequest request)
    {
        var invoice = new Invoice
        {
            Id = Guid.NewGuid(),
            InvoiceNumber = request.InvoiceNumber,
            TotalAmount = request.TotalAmount,
            Currency = request.Currency,
            DueDate = request.DueDate,
            ContractId = request.ContractId,
            ProjectId = request.ProjectId,
            Status = InvoiceStatus.Draft,
            Items = request.Items?.Select(i => new InvoiceItem
            {
                Id = Guid.NewGuid(),
                Description = i.Description,
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice
            }).ToList() ?? new List<InvoiceItem>()
        };

        await _repository.AddAsync(invoice);
        await _repository.SaveChangesAsync();

        return MapToResponse(invoice);
    }

    public async Task<InvoiceResponse> GenerateFromContractAsync(Guid contractId)
    {
        var contract = await _contractRepository.GetByIdAsync(contractId)
            ?? throw new KeyNotFoundException("Contract not found");

        var invoice = new Invoice
        {
            Id = Guid.NewGuid(),
            InvoiceNumber = $"INV-{DateTime.UtcNow:yyyyMMdd}-{contract.Title.Substring(0, Math.Min(3, contract.Title.Length)).ToUpper()}",
            TotalAmount = contract.TotalAmount,
            Currency = "USD",
            DueDate = DateTime.UtcNow.AddDays(30),
            ContractId = contractId,
            ProjectId = contract.ProjectId,
            Status = InvoiceStatus.Draft,
            Items = new List<InvoiceItem>
            {
                new InvoiceItem
                {
                    Id = Guid.NewGuid(),
                    Description = $"Services as per contract: {contract.Title}",
                    Quantity = 1,
                    UnitPrice = contract.TotalAmount
                }
            }
        };

        await _repository.AddAsync(invoice);
        await _repository.SaveChangesAsync();

        return MapToResponse(invoice);
    }

    public async Task<InvoiceResponse> GenerateFromProjectAsync(Guid projectId)
    {
        var project = await _projectRepository.GetByIdAsync(projectId)
            ?? throw new KeyNotFoundException("Project not found");

        var invoice = new Invoice
        {
            Id = Guid.NewGuid(),
            InvoiceNumber = $"INV-{DateTime.UtcNow:yyyyMMdd}-{project.Name.Substring(0, Math.Min(3, project.Name.Length)).ToUpper()}",
            TotalAmount = 0,
            Currency = "USD",
            DueDate = DateTime.UtcNow.AddDays(14),
            ProjectId = projectId,
            Status = InvoiceStatus.Draft,
            Items = new List<InvoiceItem>
            {
                new InvoiceItem
                {
                    Id = Guid.NewGuid(),
                    Description = $"Project Services: {project.Name}",
                    Quantity = 1,
                    UnitPrice = 0 // Needs manual update
                }
            }
        };

        await _repository.AddAsync(invoice);
        await _repository.SaveChangesAsync();

        return MapToResponse(invoice);
    }

    public async Task<InvoiceResponse?> UpdateStatusAsync(Guid id, InvoiceStatus newStatus)
    {
        var invoice = await _repository.GetByIdAsync(id);
        if (invoice == null) return null;

        invoice.Status = newStatus;
        await _repository.UpdateAsync(invoice);
        await _repository.SaveChangesAsync();

        return MapToResponse(invoice);
    }

    public async Task<InvoiceResponse?> UpdateAsync(Guid id, UpdateInvoiceRequest request)
    {
        var invoice = await _repository.AsQueryable()
            .Include(i => i.Items)
            .FirstOrDefaultAsync(i => i.Id == id);
            
        if (invoice == null) return null;

        invoice.TotalAmount = request.TotalAmount;
        invoice.DueDate = request.DueDate;
        invoice.Status = request.Status;

        invoice.Items.Clear();
        foreach (var item in request.Items)
        {
            invoice.Items.Add(new InvoiceItem
            {
                Id = Guid.NewGuid(),
                Description = item.Description,
                Quantity = item.Quantity,
                UnitPrice = item.UnitPrice,
                InvoiceId = invoice.Id
            });
        }

        await _repository.UpdateAsync(invoice);
        await _repository.SaveChangesAsync();

        return MapToResponse(invoice);
    }

    private InvoiceResponse MapToResponse(Invoice i)
    {
        return new InvoiceResponse
        {
            Id = i.Id,
            InvoiceNumber = i.InvoiceNumber,
            TotalAmount = i.TotalAmount,
            Currency = i.Currency,
            Status = i.Status,
            DueDate = i.DueDate,
            ProjectId = i.ProjectId,
            CreatedAt = i.CreatedAt,
            Items = (i.Items ?? new List<InvoiceItem>()).Select(item => new InvoiceItemResponse
            {
                Id = item.Id,
                Description = item.Description,
                Quantity = item.Quantity,
                UnitPrice = item.UnitPrice,
                Amount = item.Amount
            }).ToList()
        };
    }
}
