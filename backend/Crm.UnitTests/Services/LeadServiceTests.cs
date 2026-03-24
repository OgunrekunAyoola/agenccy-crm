using Moq;
using Crm.Application.Services;
using Crm.Application.Interfaces;
using Crm.Domain.Entities;
using Crm.Application.DTOs.Leads;
using Xunit;

namespace Crm.UnitTests.Services;

public class LeadServiceTests
{
    private readonly Mock<IGenericRepository<Lead>> _repositoryMock;
    private readonly LeadService _service;

    public LeadServiceTests()
    {
        _repositoryMock = new Mock<IGenericRepository<Lead>>();
        _service = new LeadService(_repositoryMock.Object);
    }

    [Fact]
    public async Task CreateAsync_ShouldCreateLeadAndSave()
    {
        // Arrange
        var request = new CreateLeadRequest
        {
            Title = "Test Lead",
            Description = "Test Description"
        };

        // Act
        var result = await _service.CreateAsync(request);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(request.Title, result.Title);
        _repositoryMock.Verify(r => r.AddAsync(It.IsAny<Lead>()), Times.Once);
        _repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task GetAllAsync_ShouldReturnLeads()
    {
        // Arrange
        var leads = new List<Lead>
        {
            new Lead { Id = Guid.NewGuid(), Title = "Lead 1" },
            new Lead { Id = Guid.NewGuid(), Title = "Lead 2" }
        };
        _repositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync(leads);

        // Act
        var result = await _service.GetAllAsync();

        // Assert
        Assert.Equal(2, result.Count());
        Assert.Contains(result, l => l.Title == "Lead 1");
        Assert.Contains(result, l => l.Title == "Lead 2");
    }

    [Fact]
    public async Task UpdateStatusAsync_ShouldUpdateStatus()
    {
        // Arrange
        var id = Guid.NewGuid();
        var lead = new Lead { Id = id, Title = "Test", Status = LeadStatus.New };
        _repositoryMock.Setup(r => r.GetByIdAsync(id)).ReturnsAsync(lead);

        var request = new UpdateLeadStatusRequest { Status = LeadStatus.Qualified };

        // Act
        var result = await _service.UpdateStatusAsync(id, request);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(LeadStatus.Qualified, result.Status);
        _repositoryMock.Verify(r => r.UpdateAsync(It.IsAny<Lead>()), Times.Once);
        _repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
    }
}
