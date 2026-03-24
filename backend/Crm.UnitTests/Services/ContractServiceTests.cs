using Moq;
using Crm.Application.Services;
using Crm.Application.Interfaces;
using Crm.Domain.Entities;
using Crm.Application.DTOs.Contracts;
using Xunit;

namespace Crm.UnitTests.Services;

public class ContractServiceTests
{
    private readonly Mock<IGenericRepository<Contract>> _repositoryMock;
    private readonly Mock<IGenericRepository<Project>> _projectRepositoryMock;
    private readonly Mock<IGenericRepository<Offer>> _offerRepositoryMock;
    private readonly ContractService _service;

    public ContractServiceTests()
    {
        _repositoryMock = new Mock<IGenericRepository<Contract>>();
        _projectRepositoryMock = new Mock<IGenericRepository<Project>>();
        _offerRepositoryMock = new Mock<IGenericRepository<Offer>>();
        _service = new ContractService(
            _repositoryMock.Object,
            _projectRepositoryMock.Object,
            _offerRepositoryMock.Object);
    }

    [Fact]
    public async Task CreateAsync_ShouldCreateContractAndSave()
    {
        // Arrange
        var request = new CreateContractRequest
        {
            Title = "Test Contract",
            ProjectId = Guid.NewGuid()
        };

        // Act
        var result = await _service.CreateAsync(request);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(request.Title, result.Title);
        _repositoryMock.Verify(r => r.AddAsync(It.IsAny<Contract>()), Times.Once);
        _repositoryMock.Verify(r => r.SaveChangesAsync(), Times.Once);
    }
}
