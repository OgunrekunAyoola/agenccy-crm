namespace Crm.Application.DTOs.Clients;

public class CreateClientRequest
{
    public string Name { get; set; } = string.Empty;
}

public class ClientResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
