using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Crm.Infrastructure.Migrations
{
    public partial class AddMissingLeadOfferProjectColumns : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(name: "ContactName", table: "Leads", type: "text", nullable: false, defaultValue: "");
            migrationBuilder.AddColumn<string>(name: "CompanyName", table: "Leads", type: "text", nullable: false, defaultValue: "");
            migrationBuilder.AddColumn<string>(name: "Email", table: "Leads", type: "text", nullable: false, defaultValue: "");
            migrationBuilder.AddColumn<string>(name: "Phone", table: "Leads", type: "text", nullable: false, defaultValue: "");
            migrationBuilder.AddColumn<int>(name: "Source", table: "Leads", type: "integer", nullable: false, defaultValue: 4);
            migrationBuilder.AddColumn<int>(name: "Interest", table: "Leads", type: "integer", nullable: false, defaultValue: 3);
            migrationBuilder.AddColumn<string>(name: "BudgetRange", table: "Leads", type: "text", nullable: false, defaultValue: "");
            migrationBuilder.AddColumn<int>(name: "PipelineStage", table: "Leads", type: "integer", nullable: false, defaultValue: 0);
            migrationBuilder.AddColumn<int>(name: "Probability", table: "Leads", type: "integer", nullable: false, defaultValue: 0);
            migrationBuilder.AddColumn<decimal>(name: "DealValue", table: "Leads", type: "numeric", nullable: true);
            migrationBuilder.AddColumn<Guid>(name: "OwnerId", table: "Leads", type: "uuid", nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(name: "ViewedAt", table: "Offers", type: "timestamp with time zone", nullable: true);
            migrationBuilder.AddColumn<string>(name: "QuoteTemplateId", table: "Offers", type: "text", nullable: true);
            migrationBuilder.AddColumn<DateTimeOffset>(name: "QuoteOpenedAt", table: "Offers", type: "timestamp with time zone", nullable: true);
            migrationBuilder.AddColumn<bool>(name: "HasBeenViewed", table: "Offers", type: "boolean", nullable: false, defaultValue: false);

            migrationBuilder.AddColumn<int>(name: "Status", table: "Projects", type: "integer", nullable: false, defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "ContactName", table: "Leads");
            migrationBuilder.DropColumn(name: "CompanyName", table: "Leads");
            migrationBuilder.DropColumn(name: "Email", table: "Leads");
            migrationBuilder.DropColumn(name: "Phone", table: "Leads");
            migrationBuilder.DropColumn(name: "Source", table: "Leads");
            migrationBuilder.DropColumn(name: "Interest", table: "Leads");
            migrationBuilder.DropColumn(name: "BudgetRange", table: "Leads");
            migrationBuilder.DropColumn(name: "PipelineStage", table: "Leads");
            migrationBuilder.DropColumn(name: "Probability", table: "Leads");
            migrationBuilder.DropColumn(name: "DealValue", table: "Leads");
            migrationBuilder.DropColumn(name: "OwnerId", table: "Leads");

            migrationBuilder.DropColumn(name: "ViewedAt", table: "Offers");
            migrationBuilder.DropColumn(name: "QuoteTemplateId", table: "Offers");
            migrationBuilder.DropColumn(name: "QuoteOpenedAt", table: "Offers");
            migrationBuilder.DropColumn(name: "HasBeenViewed", table: "Offers");

            migrationBuilder.DropColumn(name: "Status", table: "Projects");
        }
    }
}
