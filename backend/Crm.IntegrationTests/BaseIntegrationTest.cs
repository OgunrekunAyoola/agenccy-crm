using Xunit;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Crm.Application.DTOs.Auth;
using Crm.Infrastructure.Data;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Respawn;
using Respawn.Graph;
using System.Net.Http.Headers;

namespace Crm.IntegrationTests;

public abstract class BaseIntegrationTest : IClassFixture<WebApplicationFactory<Program>>, IAsyncLifetime
{
    protected readonly HttpClient _client;
    protected readonly WebApplicationFactory<Program> _factory;
    private Respawner? _respawner;
    private static bool _dbInitialized = false;
    private static readonly object _dbLock = new();

    protected BaseIntegrationTest(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    public async Task InitializeAsync()
    {
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        
        lock (_dbLock)
        {
            if (!_dbInitialized)
            {
                context.Database.Migrate();
                _dbInitialized = true;
            }
        }

        await DbInitializer.SeedAsync(_factory.Services);

        var connection = context.Database.GetDbConnection();
        await connection.OpenAsync();

        _respawner ??= await Respawner.CreateAsync(connection, new RespawnerOptions
        {
            DbAdapter = DbAdapter.Postgres,
            SchemasToInclude = new[] { "public" },
            TablesToIgnore = new Table[] 
            { 
                "Tenants", 
                "Users",
                "__EFMigrationsHistory"
            }
        });

        await _respawner.ResetAsync(connection);
    }

    public Task DisposeAsync() => Task.CompletedTask;

    protected async Task AuthenticateAsync(string email = "admin@tenanta.com", string password = "Admin123!")
    {
        var response = await _client.PostAsJsonAsync("/api/auth/login", new LoginRequest { Email = email, Password = password });
        response.EnsureSuccessStatusCode();
        var result = await response.Content.ReadFromJsonAsync<AuthResponse>();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", result!.AccessToken);
    }

    protected async Task EnsureSuccessAsync(HttpResponseMessage response)
    {
        if (!response.IsSuccessStatusCode)
        {
            var content = await response.Content.ReadAsStringAsync();
            throw new Exception($"[TEST FAILURE] Status: {response.StatusCode}, Body: {content}");
        }
    }
}
