using Crm.Application.DTOs.Offers;
using Crm.Application.Interfaces;
using Crm.Domain.Entities;

namespace Crm.Application.Services;

public class OfferService
{
    private readonly IGenericRepository<Offer> _repository;
    private readonly IGenericRepository<Lead> _leadRepository;
    private readonly IGenericRepository<Client> _clientRepository;
    private readonly IGenericRepository<Project> _projectRepository;
    private readonly IGenericRepository<CrmTask> _taskRepository;

    public OfferService(
        IGenericRepository<Offer> repository,
        IGenericRepository<Lead> leadRepository,
        IGenericRepository<Client> clientRepository,
        IGenericRepository<Project> projectRepository,
        IGenericRepository<CrmTask> taskRepository)
    {
        _repository = repository;
        _leadRepository = leadRepository;
        _clientRepository = clientRepository;
        _projectRepository = projectRepository;
        _taskRepository = taskRepository;
    }

    public async Task<IEnumerable<OfferResponse>> GetAllAsync()
    {
        var offers = await _repository.GetAllAsync();
        return offers.Select(o => new OfferResponse
        {
            Id = o.Id,
            Title = o.Title,
            TotalAmount = o.TotalAmount,
            Status = o.Status,
            Notes = o.Notes,
            LeadId = o.LeadId,
            CreatedAt = o.CreatedAt
        });
    }

    public async Task<OfferResponse> CreateAsync(CreateOfferRequest request)
    {
        var offer = new Offer
        {
            Id = Guid.NewGuid(),
            Title = request.Title,
            TotalAmount = request.TotalAmount,
            Notes = request.Notes,
            LeadId = request.LeadId
        };

        await _repository.AddAsync(offer);
        await _repository.SaveChangesAsync();

        return new OfferResponse
        {
            Id = offer.Id,
            Title = offer.Title,
            TotalAmount = offer.TotalAmount,
            Status = offer.Status,
            Notes = offer.Notes,
            LeadId = offer.LeadId,
            CreatedAt = offer.CreatedAt
        };
    }

    public async Task<OfferResponse?> UpdateStatusAsync(Guid id, UpdateOfferStatusRequest request)
    {
        var offer = await _repository.GetByIdAsync(id);
        if (offer == null) return null;

        var previousStatus = offer.Status;
        offer.Status = request.Status;
        
        await _repository.UpdateAsync(offer);

        // Automation: When moving to Accepted, create Project + Client + Tasks
        if (previousStatus != OfferStatus.Accepted && request.Status == OfferStatus.Accepted)
        {
            var lead = await _leadRepository.GetByIdAsync(offer.LeadId);
            if (lead != null)
            {
                // 1. Create or Reuse Client from Lead
                Guid clientId;
                if (lead.ConvertedClientId.HasValue)
                {
                    clientId = lead.ConvertedClientId.Value;
                }
                else
                {
                    var newClient = new Client
                    {
                        Id = Guid.NewGuid(),
                        Name = lead.Title
                    };
                    await _clientRepository.AddAsync(newClient);
                    clientId = newClient.Id;

                    lead.ConvertedClientId = clientId;
                    await _leadRepository.UpdateAsync(lead);
                }

                // 2. Create Project
                var project = new Project
                {
                    Id = Guid.NewGuid(),
                    Name = offer.Title,
                    Description = lead.Description,
                    OfferId = offer.Id,
                    ClientId = clientId
                };
                await _projectRepository.AddAsync(project);

                // 3. Create Default Tasks
                var initialTasks = new List<CrmTask>
                {
                    new CrmTask { Id = Guid.NewGuid(), ProjectId = project.Id, Title = "Kickoff Meeting", Description = "Schedule and hold project kickoff" },
                    new CrmTask { Id = Guid.NewGuid(), ProjectId = project.Id, Title = "Technical Setup", Description = "Environment and access setup" },
                    new CrmTask { Id = Guid.NewGuid(), ProjectId = project.Id, Title = "Contract Finalization", Description = "Review and sign the formal contract" }
                };

                foreach (var task in initialTasks)
                {
                    await _taskRepository.AddAsync(task);
                }
            }
        }

        await _repository.SaveChangesAsync();

        return new OfferResponse
        {
            Id = offer.Id,
            Title = offer.Title,
            TotalAmount = offer.TotalAmount,
            Status = offer.Status,
            Notes = offer.Notes,
            LeadId = offer.LeadId,
            CreatedAt = offer.CreatedAt
        };
    }
}
