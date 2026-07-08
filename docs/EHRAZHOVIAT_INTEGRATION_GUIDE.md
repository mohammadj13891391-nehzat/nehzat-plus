# EhrazHoviat (OTUH2) Integration Guide

A complete guide for integrating any web application with **EhrazHoviat** (OTUH2) as the centralized authentication system.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Step 1: Register Your Client in OTUH2](#step-1-register-your-client-in-otuh2)
- [Step 2: Backend — Validate JWT Tokens](#step-2-backend--validate-jwt-tokens)
- [Step 3: Frontend — Redirect-Based Login Flow](#step-3-frontend--redirect-based-login-flow)
- [Step 4: Frontend — Handle Callback & Store Tokens](#step-4-frontend--handle-callback--store-tokens)
- [Step 5: Frontend — Auth Guards](#step-5-frontend--auth-guards)
- [Step 6: Backend — Sync Users from OTUH2](#step-6-backend--sync-users-from-otuh2)
- [Step 7: Service-to-Service Communication](#step-7-service-to-service-communication)
- [Configuration Reference](#configuration-reference)
- [Troubleshooting](#troubleshooting)

---

## Overview

EhrazHoviat (OTUH2) is an OAuth 2.0 / OpenID Connect authorization server built on **OpenIddict**. It provides:

- **User authentication** via password grant (for SPAs) and authorization code flow
- **JWT access tokens** (unsigned `at+jwt`) for API authentication
- **Role-based access control** with custom roles per application
- **Client management** for service-to-service communication

### What You Get

| Feature | Description |
|---------|-------------|
| Single Sign-On | Users authenticate once at EhrazHoviat, access all connected apps |
| JWT Validation | Backend validates tokens via JWKS discovery (no shared secret needed) |
| Role Management | Assign roles to users via EhrazHoviat Admin API |
| Token Refresh | Silent token renewal via refresh_token grant |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        User's Browser                           │
│                                                                 │
│  1. Opens yourapp.com/admin                                     │
│  2. Redirected to EhrazHoviat login page                        │
│  3. Logs in at EhrazHoviat                                      │
│  4. Redirected back to yourapp.com/auth/callback?tokens=...     │
│  5. Tokens stored in sessionStorage                             │
│  6. API calls include Authorization: Bearer <access_token>      │
└─────────────────────────────────────────────────────────────────┘
        │                                    │
        ▼                                    ▼
┌───────────────────┐              ┌───────────────────┐
│  Your Frontend    │              │  EhrazHoviat      │
│  (SPA)            │              │  (OTUH2)          │
│                   │              │                   │
│  • Redirect login │              │  • Login page     │
│  • Store tokens   │              │  • Token endpoint  │
│  • Auth guards    │              │  • User management │
│  • API calls      │              │  • Role management │
└───────────────────┘              └───────────────────┘
        │
        ▼
┌───────────────────┐              ┌───────────────────┐
│  Your Backend     │──────────────│  OTUH2 JWKS       │
│  (API)            │  validates   │  Endpoint          │
│                   │  JWT via     │  /.well-known/     │
│  • JWT validation │  JWKS        │  openid-configuration
│  • User sync      │              │                   │
│  • Business logic │              └───────────────────┘
└───────────────────┘
```

### Login Flow (Redirect-Based)

```
Browser                Your App              EhrazHoviat
  │                       │                       │
  │  GET /admin           │                       │
  │──────────────────────>│                       │
  │                       │                       │
  │  302 Redirect ────────│──────────────────────>│
  │  to EhrazHoviat       │                       │
  │  /auth/login?         │                       │
  │  returnUrl=callback   │                       │
  │                       │                       │
  │  Login Page <─────────│───────────────────────│
  │  User enters          │                       │
  │  credentials          │                       │
  │                       │                       │
  │  302 Redirect <───────│───────────────────────│
  │  to callback URL      │                       │
  │  with tokens          │                       │
  │                       │                       │
  │  Store tokens ───────>│                       │
  │                       │                       │
  │  GET /admin           │                       │
  │  (with Bearer token)  │                       │
  │──────────────────────>│                       │
  │                       │  Validate JWT ───────>│
  │                       │  via JWKS             │
  │  Admin Dashboard <────│                       │
  │                       │                       │
```

---

## Prerequisites

1. **EhrazHoviat running** on a known URL (e.g., `http://localhost:5000` or `https://auth.example.com`)
2. **Client credentials** — you need a `client_id` and optionally `client_secret` from OTUH2
3. **Your app** — any SPA (React, Angular, Vue, etc.) with any backend (Node.js, .NET, Python, etc.)

---

## Step 1: Register Your Client in OTUH2

### Option A: Via OTUH2 Admin API

```bash
# Get an admin token (use OTUH2's own client credentials)
curl -X POST http://localhost:5000/connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&client_id=otuh2-spa-client&scope=openid"

# Register your client
curl -X POST http://localhost:5000/api/admin/clients \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "your-app",
    "displayName": "Your Application",
    "clientType": "public",
    "permissions": ["ept:token", "gt:password", "gt:refresh_token"]
  }'
```

### Option B: Via OTUH2 Database Seeder

```csharp
// In OTUH2 DevSeedData.cs
await manager.CreateAsync(new OpenIddictApplicationDescriptor
{
    ClientId = "your-app",
    ClientType = ClientTypes.Public,  // SPA - no client secret
    DisplayName = "Your Application",
    Permissions =
    {
        Permissions.GrantTypes.Password,
        Permissions.GrantTypes.RefreshToken,
        Permissions.Endpoints.Token,
        Permissions.Scopes.OpenId,
        Permissions.Scopes.Email,
        Permissions.Scopes.Profile,
        Permissions.Scopes.Roles
    }
});
```

### Option C: Service-to-Service Client (Confidential)

```csharp
await manager.CreateAsync(new OpenIddictApplicationDescriptor
{
    ClientId = "your-app-backend",
    ClientSecret = "your-secret-here",
    ClientType = ClientTypes.Confidential,
    DisplayName = "Your App Backend (Service)",
    Permissions =
    {
        Permissions.GrantTypes.ClientCredentials,
        Permissions.Endpoints.Token
    }
});
```

---

## Step 2: Backend — Validate JWT Tokens

Your backend validates JWT tokens from EhrazHoviat using **JWKS discovery**. No shared secret is needed — the backend fetches OTUH2's public signing key automatically.

### .NET (ASP.NET Core)

```csharp
// Program.cs
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = "http://localhost:5000";  // OTUH2 URL
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateAudience = false,
            ValidTypes = new[] { "at+jwt" },          // OTUH2 uses at+jwt for access tokens
            NameClaimType = "sub",
            RoleClaimType = "role"
        };
        options.RequireHttpsMetadata = false;  // true in production
    });
```

### Node.js (Express + jsonwebtoken)

```javascript
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const client = jwksClient({
  jwksUri: 'http://localhost:5000/.well-known/jwks'
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    callback(null, key.getPublicKey());
  });
}

app.use('/api/*', (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token' });

  jwt.verify(token, getKey, {
    issuer: 'http://localhost:5000/',
    algorithms: ['RS256']
  }, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.user = decoded;
    next();
  });
});
```

### Python (FastAPI)

```python
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer
from jose import jwt, JWTError
import httpx

security = HTTPBearer()
OTUH2_URL = "http://localhost:5000"

async def get_jwks():
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{OTUH2_URL}/.well-known/jwks")
        return resp.json()

async def verify_token(token = Depends(security)):
    try:
        jwks = await get_jwks()
        payload = jwt.decode(
            token.credentials,
            jwks,
            algorithms=["RS256"],
            issuer=f"{OTUH2_URL}/",
            options={"verify_aud": False}
        )
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

### Token Structure

OTUH2 access tokens contain these claims:

```json
{
  "iss": "http://localhost:5000/",
  "exp": 1783527851,
  "iat": 1783526651,
  "scope": "openid",
  "sub": "admin",
  "name": "مدیر سیستم",
  "preferred_username": "admin",
  "userId": "1",
  "role": "admin",
  "client_id": "your-app"
}
```

**Key claims:**
- `sub` — username (use as user identifier)
- `role` — user's role (can be string or array)
- `userId` — OTUH2's internal user ID
- `exp` — token expiration (Unix timestamp)

---

## Step 3: Frontend — Redirect-Based Login Flow

When an unauthenticated user tries to access a protected route, redirect them to EhrazHoviat's login page.

### Angular

```typescript
// auth.guard.ts
const OTUH2_LOGIN_URL = 'http://localhost:5000/auth/login';
const CALLBACK_PATH = '/auth/callback';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  if (authService.isAuthenticated()) return true;

  const callbackUrl = encodeURIComponent(
    `${window.location.origin}${CALLBACK_PATH}?returnTo=${encodeURIComponent(window.location.pathname)}`
  );
  window.location.href = `${OTUH2_LOGIN_URL}?returnUrl=${callbackUrl}`;
  return false;
};
```

### React

```typescript
// useAuthGuard.ts
export function useAuthGuard() {
  const isAuthenticated = () => {
    const token = sessionStorage.getItem('otuh2_id_token');
    if (!token) return false;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  };

  const redirectToLogin = () => {
    const callbackUrl = encodeURIComponent(
      `${window.location.origin}/auth/callback?returnTo=${encodeURIComponent(window.location.pathname)}`
    );
    window.location.href = `http://localhost:5000/auth/login?returnUrl=${callbackUrl}`;
  };

  return { isAuthenticated, redirectToLogin };
}
```

### Vue

```typescript
// router/guards.ts
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    const callbackUrl = encodeURIComponent(
      `${window.location.origin}/auth/callback?returnTo=${encodeURIComponent(to.fullPath)}`
    );
    window.location.href = `http://localhost:5000/auth/login?returnUrl=${callbackUrl}`;
    return;
  }
  next();
});
```

---

## Step 4: Frontend — Handle Callback & Store Tokens

After login, EhrazHoviat redirects back to your callback URL with tokens in the query parameters.

**Callback URL format:**
```
https://yourapp.com/auth/callback?returnTo=%2Fadmin&access_token=xxx&id_token=xxx&refresh_token=xxx
```

### Angular Callback Component

```typescript
// auth-callback.component.ts
@Component({
  template: '<p>Logging in...</p>'
})
export class AuthCallbackComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const accessToken = params['access_token'];
      const idToken = params['id_token'];
      const refreshToken = params['refresh_token'];
      const returnTo = params['returnTo'];

      if (accessToken) {
        sessionStorage.setItem('otuh2_access_token', accessToken);
        if (idToken) sessionStorage.setItem('otuh2_id_token', idToken);
        if (refreshToken) localStorage.setItem('otuh2_refresh_token', refreshToken);

        const destination = returnTo ? decodeURIComponent(returnTo) : '/dashboard';
        void this.router.navigateByUrl(destination);
      } else {
        void this.router.navigateByUrl('/login');
      }
    });
  }
}
```

### React Callback Component

```tsx
// AuthCallback.tsx
export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');
    const idToken = params.get('id_token');
    const refreshToken = params.get('refresh_token');
    const returnTo = params.get('returnTo');

    if (accessToken) {
      sessionStorage.setItem('otuh2_access_token', accessToken);
      if (idToken) sessionStorage.setItem('otuh2_id_token', idToken);
      if (refreshToken) localStorage.setItem('otuh2_refresh_token', refreshToken);

      navigate(returnTo ? decodeURIComponent(returnTo) : '/dashboard');
    } else {
      navigate('/login');
    }
  }, []);

  return <p>Logging in...</p>;
}
```

### Route Configuration

```typescript
// Angular routes
{ path: 'auth/callback', component: AuthCallbackComponent }

// React routes
<Route path="/auth/callback" element={<AuthCallback />} />

// Vue routes
{ path: '/auth/callback', component: AuthCallback }
```

---

## Step 5: Frontend — Auth Guards

### Token Validation

```typescript
function isAuthenticated(): boolean {
  const idToken = sessionStorage.getItem('otuh2_id_token');
  if (!idToken) return false;

  try {
    const payload = JSON.parse(atob(idToken.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

function getCurrentUser() {
  const idToken = sessionStorage.getItem('otuh2_id_token');
  if (!idToken) return null;

  const payload = JSON.parse(atob(idToken.split('.')[1]));
  const roles = Array.isArray(payload.role) ? payload.role : [payload.role];

  return {
    username: payload.sub,
    roles,
    primaryRole: resolvePrimaryRole(roles)
  };
}

function hasRole(role: string): boolean {
  const user = getCurrentUser();
  return user?.roles.some(r => r.toLowerCase() === role.toLowerCase()) ?? false;
}

function resolvePrimaryRole(roles: string[]): string {
  const priority = ['admin', 'manager', 'headquarters', 'branch_manager', 'coach', 'parent', 'evaluator', 'trainee'];
  const lowerRoles = roles.map(r => r.toLowerCase());
  return priority.find(p => lowerRoles.includes(p)) ?? roles[0] ?? 'trainee';
}
```

### API Interceptor (Attach Token)

```typescript
// Angular HTTP interceptor
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = sessionStorage.getItem('otuh2_access_token');
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
  return next(req);
};

// React axios interceptor
axios.interceptors.request.use(config => {
  const token = sessionStorage.getItem('otuh2_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Token Refresh

```typescript
async function refreshToken(): Promise<boolean> {
  const refreshToken = localStorage.getItem('otuh2_refresh_token');
  if (!refreshToken) return false;

  try {
    const response = await fetch('http://localhost:5000/connect/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: 'your-app',
        refresh_token: refreshToken
      })
    });

    if (!response.ok) return false;

    const data = await response.json();
    sessionStorage.setItem('otuh2_access_token', data.access_token);
    if (data.id_token) sessionStorage.setItem('otuh2_id_token', data.id_token);
    if (data.refresh_token) localStorage.setItem('otuh2_refresh_token', data.refresh_token);

    return true;
  } catch {
    return false;
  }
}
```

---

## Step 6: Backend — Sync Users from OTUH2

When a user authenticates via OTUH2, your backend should create/update a local user record.

### OidcSyncMiddleware Pattern

```csharp
// Middleware that runs on every authenticated request
public class OidcSyncMiddleware
{
    private readonly RequestDelegate _next;

    public OidcSyncMiddleware(RequestDelegate next) => _next = next;

    public async Task InvokeAsync(HttpContext context, IUserService userService)
    {
        if (context.User.Identity?.IsAuthenticated == true)
        {
            var username = context.User.FindFirst("sub")?.Value;
            var userId = context.User.FindFirst("userId")?.Value;
            var roles = context.User.FindAll("role").Select(c => c.Value).ToList();

            if (!string.IsNullOrEmpty(username))
            {
                var existingUser = await userService.FindByUsernameAsync(username);
                if (existingUser == null)
                {
                    var primaryRole = roles.FirstOrDefault() ?? "trainee";
                    await userService.CreateLocalUserAsync(username, primaryRole, userId);
                }
                else if (!string.IsNullOrEmpty(userId) && existingUser.OidcSubject != userId)
                {
                    await userService.SyncOidcSubjectAsync(username, userId);
                }
            }
        }

        await _next(context);
    }
}
```

### Node.js Equivalent

```javascript
app.use(async (req, res, next) => {
  if (req.user) {
    const { sub: username, userId, role } = req.user;
    const roles = Array.isArray(role) ? role : [role];

    let user = await db.users.findByUsername(username);
    if (!user) {
      await db.users.create({
        username,
        oidcSubject: userId,
        userType: roles[0] || 'trainee'
      });
    } else if (userId && user.oidcSubject !== userId) {
      await db.users.updateOidcSubject(username, userId);
    }
  }
  next();
});
```

---

## Step 7: Service-to-Service Communication

For backend-to-backend calls (e.g., your app creating users in OTUH2), use the **client_credentials** grant.

### Get Service Token

```bash
curl -X POST http://localhost:5000/connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&client_id=your-app-backend&client_secret=your-secret-here&scope=openid"
```

### .NET (Refit Client)

```csharp
// IOtuh2AuthClient.cs
public interface IOtuh2AuthClient
{
    [Post("/connect/token")]
    Task<ServiceTokenResponse> GetServiceTokenAsync(
        [Body(BodySerializationMethod.UrlEncoded)] Dictionary<string, string> request);

    [Post("/api/admin/roles")]
    Task CreateRoleAsync(
        [Header("Authorization")] string authorization,
        [Body] CreateRoleRequest request);
}

// Registration
builder.Services.AddRefitClient<IOtuh2AuthClient>()
    .ConfigureHttpClient(c => c.BaseAddress = new Uri("http://localhost:5000"));
```

### Role Management API

```bash
# List roles
curl http://localhost:5000/api/admin/roles \
  -H "Authorization: Bearer <service_token>"

# Create role
curl -X POST http://localhost:5000/api/admin/roles \
  -H "Authorization: Bearer <service_token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "coach", "description": "مربی - ارزیابی دانش‌آموزان"}'

# Assign role to user
curl -X POST http://localhost:5000/api/internal/users/{userId}/roles \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"role": "coach"}'
```

---

## Configuration Reference

### Backend Configuration

```json
{
  "Oidc": {
    "Authority": "http://localhost:5000",
    "RequireHttpsMetadata": false
  },
  "Otuh2Client": {
    "BaseUrl": "http://localhost:5000",
    "ClientId": "your-app-backend",
    "ClientSecret": "your-secret-here",
    "ApiKey": "your-api-key"
  }
}
```

### Frontend Configuration

```typescript
// environment.ts
export const environment = {
  otuh2Url: 'http://localhost:5000',
  apiUrl: 'http://localhost:3000'
};

// config.json (runtime override)
{
  "otuh2Url": "http://localhost:5000",
  "apiUrl": "http://localhost:3000"
}
```

### EhrazHoviat URLs

| Endpoint | URL | Description |
|----------|-----|-------------|
| Login Page | `http://localhost:5000/auth/login` | User-facing login form |
| Token | `http://localhost:5000/connect/token` | OAuth2 token endpoint |
| UserInfo | `http://localhost:5000/connect/userinfo` | OIDC userinfo endpoint |
| JWKS | `http://localhost:5000/.well-known/jwks` | Public signing keys |
| Discovery | `http://localhost:5000/.well-known/openid-configuration` | OIDC discovery |
| Logout | `http://localhost:5000/connect/logout` | End session endpoint |
| Admin Roles | `http://localhost:5000/api/admin/roles` | Role management |
| Admin Clients | `http://localhost:5000/api/admin/clients` | Client management |
| Internal Users | `http://localhost:5000/api/internal/users/{id}/roles` | User-role assignment |

### CORS Configuration (OTUH2 Side)

```json
{
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:4200",
      "http://localhost:3000",
      "https://yourapp.com"
    ]
  }
}
```

---

## Troubleshooting

### Tokens not received at callback

- Verify the `returnUrl` query parameter is correctly URL-encoded
- Check that your callback route matches exactly (e.g., `/auth/callback` not `/callback`)
- Check OTUH2 CORS settings include your frontend origin

### JWT validation fails (401)

- Ensure `ValidTypes = ["at+jwt"]` — OTUH2 access tokens use `at+jwt` type
- Ensure `RequireHttpsMetadata = false` in development
- Verify OTUH2 is reachable from your backend (check firewall/network)

### Infinite redirect loop

- Ensure the `/auth/callback` route exists in your router config
- Ensure the callback route has NO auth guards
- Ensure `isAuthenticated()` correctly reads from sessionStorage

### Roles not appearing in token

- Ensure the user has roles assigned in OTUH2
- Request the `roles` scope: `scope=openid email profile roles`
- Check the token payload at jwt.io to verify claims

### Token expired but not refreshed

- Implement a 401 interceptor that calls `refreshToken()` and retries
- Store refresh_token in `localStorage` (persists across page reloads)
- Access token and id_token go in `sessionStorage` (cleared on tab close)

---

## Quick Start Checklist

- [ ] Register your client in OTUH2 (get `client_id`)
- [ ] Configure backend JWT validation (Authority + JWKS)
- [ ] Add `/auth/callback` route (no guards)
- [ ] Implement `authGuard` — redirect to OTUH2 login
- [ ] Implement callback component — store tokens
- [ ] Implement API interceptor — attach Bearer token
- [ ] Implement user sync middleware
- [ ] Configure CORS on OTUH2 for your frontend origin
- [ ] Test: open protected page → login at OTUH2 → redirect back → access granted

---

*This guide is based on the Nehzat Plus ↔ EhrazHoviat integration. For questions, refer to the EhrazHoviat documentation or contact the OTUH2 team.*
