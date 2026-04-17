using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Crm.Infrastructure.Migrations
{
    public partial class AddMissingInvoiceColumns : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "PaidAmount",
                table: "Invoices",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<Guid>(
                name: "ClientId",
                table: "Invoices",
                type: "uuid",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "PaidAmount", table: "Invoices");
            migrationBuilder.DropColumn(name: "ClientId", table: "Invoices");
        }
    }
}
