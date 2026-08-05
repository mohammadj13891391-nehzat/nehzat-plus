using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace EducationalPlatform.Nehzat.API.Security
{
    public interface IDevTokenService
    {
        string CreateToken(string username, string role, string userId = "", string? studentId = null, string? branchId = null);
    }

    /// <summary>
    /// Development-only token issuer for the centralized local auth flow. It emits the
    /// OTUH2 at+jwt claim structure (sub/username/role/userId/studentId/branchId/exp/iat)
    /// described in EHRAZHOVIAT_INTEGRATION_GUIDE.md so frontend and backend agree on shape.
    /// NOT used in production: prod validates against the OTUH2 authority's JWKS.
    /// </summary>
    public class DevTokenService : IDevTokenService
    {
        private readonly SymmetricSecurityKey _key;
        private readonly string _issuer;
        private readonly string _audience;

        public DevTokenService(IConfiguration configuration)
        {
            var devAuth = configuration.GetSection("DevAuth");
            var devKey = devAuth["DevAuthKey"]
                ?? throw new InvalidOperationException("DevAuth:DevAuthKey is required for dev auth");
            _issuer = devAuth["Issuer"] ?? "http://localhost:3000";
            _audience = devAuth["Audience"] ?? "http://localhost:3000";
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(devKey));
        }

        public string CreateToken(string username, string role, string userId = "", string? studentId = null, string? branchId = null)
        {
            var now = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            var claims = new List<Claim>
            {
                new Claim("sub", username),
                new Claim("username", username),
                new Claim("role", role),
                new Claim("userId", userId),
                new Claim("exp", (now + 3600L).ToString(), ClaimValueTypes.Integer64),
                new Claim("iat", now.ToString(), ClaimValueTypes.Integer64)
            };
            if (studentId != null) claims.Add(new Claim("studentId", studentId));
            if (branchId != null) claims.Add(new Claim("branchId", branchId));

            var token = new JwtSecurityToken(
                issuer: _issuer,
                audience: _audience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: new SigningCredentials(_key, SecurityAlgorithms.HmacSha256));

            // at+jwt token type, matching ValidTypes=["at+jwt"] and the OTUH2 guide.
            token.Header["typ"] = "at+jwt";

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
