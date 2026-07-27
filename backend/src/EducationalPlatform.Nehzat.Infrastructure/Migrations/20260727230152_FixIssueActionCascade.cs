using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EducationalPlatform.Nehzat.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixIssueActionCascade : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Nehzat_issue_actions_Nehzat_issue_surveys_SurveyId",
                schema: "nehzat",
                table: "Nehzat_issue_actions");

            migrationBuilder.AddForeignKey(
                name: "FK_Nehzat_issue_actions_Nehzat_issue_surveys_SurveyId",
                schema: "nehzat",
                table: "Nehzat_issue_actions",
                column: "SurveyId",
                principalSchema: "nehzat",
                principalTable: "Nehzat_issue_surveys",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Nehzat_issue_actions_Nehzat_issue_surveys_SurveyId",
                schema: "nehzat",
                table: "Nehzat_issue_actions");

            migrationBuilder.AddForeignKey(
                name: "FK_Nehzat_issue_actions_Nehzat_issue_surveys_SurveyId",
                schema: "nehzat",
                table: "Nehzat_issue_actions",
                column: "SurveyId",
                principalSchema: "nehzat",
                principalTable: "Nehzat_issue_surveys",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
