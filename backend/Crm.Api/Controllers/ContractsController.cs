using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Crm.Application.Services;
using Crm.Application.DTOs.Contracts;

namespace Crm.Api.Controllers;

[Authorize(Roles = "Admin,SalesManager,ProjectManager")]
[ApiController]
[Route("api/[controller]")]
public class ContractsController : ControllerBase
{
    private readonly ContractService _contractService;

    public ContractsController(ContractService contractService)
    {
        _contractService = contractService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ContractResponse>>> GetContracts()
    {
        var contracts = await _contractService.GetAllAsync();
        return Ok(contracts);
    }

    [HttpPost]
    public async Task<ActionResult<ContractResponse>> CreateContract(CreateContractRequest request)
    {
        var response = await _contractService.CreateAsync(request);
        return CreatedAtAction(nameof(GetContracts), new { id = response.Id }, response);
    }

    [HttpPost("generate/{projectId}")]
    public async Task<ActionResult<ContractResponse>> GenerateFromProject(Guid projectId)
    {
        var response = await _contractService.GenerateFromProjectAsync(projectId);
        return Ok(response);
    }
}
