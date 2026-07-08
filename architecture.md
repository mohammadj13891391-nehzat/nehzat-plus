```python
import os

service_structure_md = """# Multi-Repo Architecture & Decoupled Configuration Specification
## Service Boundary, Mock Environment, and Production Layout

This document provides the complete structural blueprint and configuration setup for splitting the Educational Platform into isolated, individual service repositories. Each service encapsulates its own independent backend (.NET 9) and frontend (Angular 20), utilizing a synchronous REST communication model and a switchable mock authentication workflow for localized development.

---

## 1. Repository Blueprints

### 1.1 Repository A: `educational-platform-nehzat`
This repository handles core educational frameworks, courses, and syllabus materials. In production, its backend maps to the `/shop` route prefix, and its frontend serves the primary retail user interface.


```

```text
File successfully created: Decoupled-Service-Architecture.md


```

/ (Git Root)
├── .gitignore
├── README.md
├── /backend
│   ├── EducationalPlatform.Nehzat.sln
│   └── /src
│       ├── EducationalPlatform.Nehzat.API/            # Binds to api.nehzat128.ir/shop (Prod)
│       │   ├── Controllers/
│       │   ├── Program.cs
│       │   ├── appsettings.json
│       │   └── appsettings.Development.json
│       ├── EducationalPlatform.Nehzat.Application/    # CQRS Handlers, DTOs, Mapping
│       ├── EducationalPlatform.Nehzat.Infrastructure/ # EF Core Migrations, REST Clients
│       └── EducationalPlatform.Nehzat.Domain/         # Domain Entities and Invariants
└── /frontend                                          # Binds to shop.nehzat128.ir (Prod)
├── package.json
├── angular.json
├── tsconfig.json
└── /src
├── main.ts
├── /app
│   ├── /core           # Interceptors, Base Guards, Mock-Bypass Auth Guard
│   ├── /shared         # Standalone presentational UI blocks
│   └── /features       # Features mapped to Nehzat context
└── /environments
├── environment.ts
└── environment.development.ts

```

### 1.2 Repository B: `educational-platform-personality`
This repository serves as the behavioral telemetry, psychological modeling, and learning style analysis engine. In production, its backend maps to the `/survey` prefix, and its frontend serves the testing interfaces.


```

/ (Git Root)
├── .gitignore
├── README.md
├── /backend
│   ├── EducationalPlatform.Personality.sln
│   └── /src
│       ├── EducationalPlatform.Personality.API/       # Binds to api.nehzat128.ir/survey (Prod)
│       │   ├── Controllers/
│       │   ├── Program.cs
│       │   ├── appsettings.json
│       │   └── appsettings.Development.json
│       ├── EducationalPlatform.Personality.Application/
│       ├── EducationalPlatform.Personality.Infrastructure/
│       └── EducationalPlatform.Personality.Domain/
└── /frontend                                          # Binds to survey.nehzat128.ir (Prod)
├── package.json
├── angular.json
└── /src
└── /app
├── /core
└── /features       # Psychological profiles and diagnostic workflows

```

---

## 2. Development Mode Configuration (Mock Bypass Auth)

To ensure rapid localized iteration without demanding external execution dependencies on an OAuth authorization provider, each application includes a decoupled mock mode switch.

### 2.1 Backend Mock Configuration Setup (`Program.cs`)
The API layer handles authentication switches dynamically via application state configuration variables.

```csharp
// Program.cs inside each Service API layer
using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

// Evaluate environmental profile properties
var isDevMockMode = builder.Environment.IsDevelopment() && 
                    builder.Configuration.GetValue<bool>("AuthSettings:UseMockAuth");

if (isDevMockMode)
{
    // Inject custom mock identity generation engine bypass
    builder.Services.AddAuthentication("MockScheme")
        .AddScheme<AuthenticationSchemeOptions, MockAuthHandler>("MockScheme", options => { });
        
    Console.WriteLine(">>>> SERVER BOUND TO DEVELOPMENT MOCK AUTH PIPELINE <<<<");
}
else
{
    // Standard Production Configuration mapping back to OAuth Token Server
    builder.Services.AddAuthentication("Bearer")
        .AddJwtBearer("Bearer", options =>
        {
            options.Authority = "[https://api.nehzat128.ir/oauth](https://api.nehzat128.ir/oauth)";
            options.Audience = builder.Configuration.GetValue<string>("AuthSettings:Audience");
            options.RequireHttpsMetadata = true;
        });
}

builder.Services.AddControllers();
var app = builder.Build();

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();

// Inline handler instance handling mock injections safely
public class MockAuthHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    public MockAuthHandler(
        IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder) : base(options, logger, encoder) { }

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        // Construct standard claims matching production JWT shapes
        var claims = new[] {
            new Claim(ClaimTypes.NameIdentifier, "usr_dev_mock_01H7X8Z5M3P"),
            new Claim(ClaimTypes.Name, "Developer Sandbox Account"),
            new Claim(ClaimTypes.Email, "sandbox-dev@nehzat128.ir"),
            new Claim(ClaimTypes.Role, "Administrator"),
            new Claim("permissions", "nehzat:courses:create"),
            new Claim("permissions", "personality:assessments:evaluate")
        };

        var identity = new ClaimsIdentity(claims, "MockScheme");
        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, "MockScheme");

        return Task.FromResult(AuthenticateResult.Success(ticket));
    }
}

```

### 2.2 Backend Dev Configuration JSON (`appsettings.Development.json`)

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AuthSettings": {
    "UseMockAuth": true,
    "Audience": "nehzat-local"
  }
}

```

### 2.3 Angular Core Environment Configuration (`environment.development.ts`)

```typescript
export const environment = {
  production: false,
  useMockAuth: true,
  baseApiUrl: 'http://localhost:5001/api/v1/nehzat', // Binds directly to independent service port
  mockUser: {
    id: 'usr_dev_mock_01H7X8Z5M3P',
    name: 'Developer Sandbox Account',
    email: 'sandbox-dev@nehzat128.ir',
    role: 'Administrator'
  }
};

```

---

## 3. Production Environment Routing & Gateway Topology

In production deployment, specialized routing patterns map individual application blocks into public domains, stripping paths before dispatching inbound streams to downstream application targets.

```
       Public Traffic Subdomains
 ┌───────────────────────────────────────┐
 │   shop.nehzat128.ir   (Frontend A)    │ ───► Serves Angular Content Directly
 │   survey.nehzat128.ir (Frontend B)    │ ───► Serves Angular Content Directly
 └───────────────────────────────────────┘

       Unified API Routing Gateway
 ┌───────────────────────────────────────┐
 │          api.nehzat128.ir             │ (YARP Edge Reverse Proxy Host)
 └──────────────────┬────────────────────┘
                    │
       ┌────────────┼────────────┐
       ▼            ▼            ▼
   /oauth/       /shop/      /survey/
       │            │            │
  (Path Stripped) (Path Stripped) (Path Stripped)
       │            │            │
       ▼            ▼            ▼
 ┌───────────┐ ┌───────────┐ ┌───────────┐
 │ Identity  │ │  Nehzat   │ │Personality│  (Private Container Network Svc Targets)
 │ Service   │ │  Service  │ │  Service  │
 └───────────┘ └───────────┘ └───────────┘

```

### 3.1 Reverse Proxy Production Blueprint (`appsettings.Production.json`)

This configuration file manages routing policies within your infrastructure gateway layer:

```json
{
  "ReverseProxy": {
    "Routes": {
      "oauth-routing-rule": {
        "ClusterId": "oauth-backend-cluster",
        "Match": {
          "Host": [ "api.nehzat128.ir" ],
          "Path": "/oauth/{**catchall}"
        },
        "Transforms": [
          { "PathRemovePrefix": "/oauth" }
        ]
      },
      "shop-routing-rule": {
        "ClusterId": "nehzat-backend-cluster",
        "Match": {
          "Host": [ "api.nehzat128.ir" ],
          "Path": "/shop/{**catchall}"
        },
        "Transforms": [
          { "PathRemovePrefix": "/shop" }
        ]
      },
      "survey-routing-rule": {
        "ClusterId": "personality-backend-cluster",
        "Match": {
          "Host": [ "api.nehzat128.ir" ],
          "Path": "/survey/{**catchall}"
        },
        "Transforms": [
          { "PathRemovePrefix": "/survey" }
        ]
      }
    },
    "Clusters": {
      "oauth-backend-cluster": {
        "Destinations": {
          "srv-node-1": { "Address": "[http://platform-identity-srv.internal:8080](http://platform-identity-srv.internal:8080)" }
        }
      },
      "nehzat-backend-cluster": {
        "Destinations": {
          "srv-node-1": { "Address": "[http://platform-nehzat-srv.internal:8080](http://platform-nehzat-srv.internal:8080)" }
        }
      },
      "personality-backend-cluster": {
        "Destinations": {
          "srv-node-1": { "Address": "[http://platform-personality-srv.internal:8080](http://platform-personality-srv.internal:8080)" }
        }
      }
    }
  }
}

```

---

## 4. Service-to-Service REST Communication Protocol

As an event broker is excluded, all cross-service processing occurs through synchronous back-channel requests using typed, resilience-wrapped REST API calls over internal network infrastructures.

### 4.1 Internal Refit HTTP Engine Registration Example

When the `Nehzat` Service requires data managed within the `Personality` service boundary, it handles interaction through a typed proxy engine:

```csharp
namespace EducationalPlatform.Nehzat.Infrastructure.Clients;

using Refit;
using System.Threading.Tasks;

public interface IPersonalityClient
{
    [Get("/api/v1/personality/profiles/{userId}/metrics")]
    Task<PersonalityMetricsResponse> GetUserPsychometricProfileAsync(
        string userId, 
        [Header("Authorization")] string internalToken
    );
}

public record PersonalityMetricsResponse(string UserId, string PrimaryLearningStyle, double AnalyticalIndex);

```

### 4.2 Safe Lifecycle Registration with Policy Resiliency

```csharp
// Added within Nehzat Infrastructure Service Registration Pipeline
public static class InfrastructureServiceExtensions
{
    public static void AddInternalRestClients(this IServiceCollection services, IConfiguration configuration)
    {
        var targetUrl = configuration.GetValue<string>("InternalServices:PersonalityUrl") 
                        ?? "[http://platform-personality-srv.internal:8080](http://platform-personality-srv.internal:8080)";

        services.AddRefitClient<IPersonalityClient>()
            .ConfigureHttpClient(client => client.BaseAddress = new Uri(targetUrl))
            .AddTransientHttpErrorPolicy(policyBuilder => 
                policyBuilder.WaitAndRetryAsync(3, retryAttempt => 
                    TimeSpan.FromMilliseconds(Math.Pow(2, retryAttempt) * 100)));
    }
}

```

"""

file_name = "Decoupled-Service-Architecture.md"
with open(file_name, "w", encoding="utf-8") as f:
f.write(service_structure_md)

print(f"File successfully created: {file_name}")

```
Your Markdown file is ready
[file-tag: code-generated-file-0-1783348040542428340]

I have generated and compiled the detailed architectural blueprint file `Decoupled-Service-Architecture.md` to reflect your exact specifications. 

The configuration documents include:
1. **Repository Blueprints:** Explicit structural tree paths for separating backend (.NET 9) and frontend (Angular 20) code into independent Git repositories (`nehzat` vs `personality`).
2. **Development Mode Setup:** Custom C# `MockAuthHandler` runtime code mapping to a simple conditional logic switch (`UseMockAuth: true`), alongside matching Angular configurations allowing you to develop locally without external identity engines.
3. **Production URL Topology:** Comprehensive JSON configuration mapping templates optimized for **YARP (Yet Another Reverse Proxy)**. It defines prefix stripping (`/shop`, `/survey`, `/oauth`) bound under `api.nehzat128.ir` and routes traffic seamlessly onto internal microservice boundaries, while preserving your frontends on independent subdomains (`shop.nehzat128.ir` and `survey.nehzat128.ir`).
4. **REST API Core Pipelines:** Complete **Refit** integration patterns with built-in retry back-off rules to facilitate highly decoupled, synchronous Service-to-Service API operations without an event system.

```