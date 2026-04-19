using System.ComponentModel.DataAnnotations;
using Crm.Domain.Entities;

namespace Crm.Application.DTOs.Clients;

public class ContactRequest
{
    [StringLength(100)]
    public string FirstName { get; set; } = string.Empty;

    [StringLength(100)]
    public string LastName { get; set; } = string.Empty;

    [EmailAddress]
    [StringLength(200)]
    public string Email { get; set; } = string.Empty;

    [Phone]
    [StringLength(50)]
    public string Phone { get; set; } = string.Empty;
}

public class ContactResponse
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName  { get; set; } = string.Empty;
    public string Email     { get; set; } = string.Empty;
    public string Phone     { get; set; } = string.Empty;
    public ContactType Type { get; set; }
}

public class CreateClientRequest
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [StringLength(200)]
    public string LegalName { get; set; } = string.Empty;

    /// <summary>
    /// Bulgarian VAT number — 9 digits, optionally prefixed with "BG".
    /// Examples: "123456789" or "BG123456789".
    /// </summary>
    [Required]
    [RegularExpression(@"^(BG)?\d{9}$",
        ErrorMessage = "VAT number must be exactly 9 digits, optionally prefixed with 'BG' (e.g. BG123456789).")]
    public string VatNumber { get; set; } = string.Empty;

    [StringLength(500)]
    public string BusinessAddress { get; set; } = string.Empty;

    [StringLength(100)]
    public string Industry { get; set; } = string.Empty;

    public PriorityTier Priority { get; set; }

    public ContactRequest? CommercialContact { get; set; }
    public ContactRequest? FinancialContact  { get; set; }
}

public class ClientResponse
{
    public Guid    Id              { get; set; }
    public string  Name            { get; set; } = string.Empty;
    public string  LegalName       { get; set; } = string.Empty;
    public string  VatNumber       { get; set; } = string.Empty;
    public string  BusinessAddress { get; set; } = string.Empty;
    public string  Industry        { get; set; } = string.Empty;
    public PriorityTier Priority   { get; set; }
    public DateTime CreatedAt      { get; set; }
    public List<ContactResponse> Contacts { get; set; } = new();
}
