using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Crm.Infrastructure.Migrations
{
    public partial class AddMissingTenantColumns : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BillingEmail",
                table: "Tenants",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Currency",
                table: "Tenants",
                type: "text",
                nullable: false,
                defaultValue: "USD");

            migrationBuilder.AddColumn<int>(
                name: "DefaultPaymentTermsDays",
                table: "Tenants",
                type: "integer",
                nullable: false,
                defaultValue: 30);

            migrationBuilder.AddColumn<string>(
                name: "LogoUrl",
                table: "Tenants",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TaxId",
                table: "Tenants",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Timezone",
                table: "Tenants",
                type: "text",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "BillingEmail", table: "Tenants");
            migrationBuilder.DropColumn(name: "Currency", table: "Tenants");
            migrationBuilder.DropColumn(name: "DefaultPaymentTermsDays", table: "Tenants");
            migrationBuilder.DropColumn(name: "LogoUrl", table: "Tenants");
            migrationBuilder.DropColumn(name: "TaxId", table: "Tenants");
            migrationBuilder.DropColumn(name: "Timezone", table: "Tenants");
        }
    }
}
