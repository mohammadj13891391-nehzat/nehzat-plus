# OTUH2 (EhrazHoviat) Auth — Nehzat Plus

Project-specific authentication guide. The generic [EHRAZHOVIAT_INTEGRATION_GUIDE.md](../../EHRAZHOVIAT_INTEGRATION_GUIDE.md) (outside this repo) describes the general integration; this file records **how this project actually implements it** and where it diverges.

## Flow: Redirect-Based OIDC (not password grant for login)

The generic guide presents both password-grant and redirect flows. This project uses the **redirect-based** login flow:

```
Browser                Nehzat FE              EhrazHoviat (OTUH2)
  │  GET /dashboard      │                       │
  │─────────────────────>│                       │
  │                      │ authGuard: not auth   │
  │ 302 ────────────────│──────────────────────>│ /auth/login?returnUrl=callback
  │  to OTUH2 login      │                       │
  │  Login page <────────│───────────────────────│
  │  user logs in        │                       │
  │ 302 ────────────────│<──────────────────────│ back to /auth/callback?access_token=..&id_token=..&refresh_token=..
  │                      │ AuthCallbackComponent │
  │                      │ stores tokens         │
  │  GET /dashboard ────>│  Bearer <access>      │
  │  Admin Dashboard <───│                       │
```

1. `authGuard` (`core/guards/auth.guard.ts`) — if `AuthService.isAuthenticated()` is false, builds
   `{origin}/auth/callback?returnTo={path}` and redirects the browser to
   `{otuh2Url}/auth/login?returnUrl={callback}` (otuh2Url from `resolveOtuh2BaseUrl()`).
2. OTUH2 authenticates, then redirects to our `/auth/callback` with tokens in the **query string**.
3. `AuthCallbackComponent` (`features/auth/pages/callback`) reads `access_token`/`id_token`/`refresh_token`,
   stores them (sessionStorage for access+id, localStorage for refresh), then navigates to `returnTo`
   or the role dashboard via `getDashboardPathForRole()`.
4. The auth interceptor attaches `Bearer <access_token>` to API calls.
5. Backend `OidcSyncMiddleware` creates/updates the local `User` on first authenticated request.

The local `/auth/login` page (`features/auth/pages/login`) is now a **pass-through** that links to OTUH2
login and `/auth/register`. It does NOT collect credentials.

## Token Storage (matches guide)

| Token | Storage | Lifetime |
|-------|---------|----------|
| access_token | `sessionStorage` (`otuh2_access_token`) | cleared on tab close |
| id_token | `sessionStorage` (`otuh2_id_token`) | cleared on tab close |
| refresh_token | `localStorage` (`otuh2_refresh_token`) | persists |

## Client IDs & Scopes (actual config)

- **SPA client**: `otuh2-spa-client` (public) — used by `HttpOtuh2Api` for the signup/`/api/register` path and any service-to-service password/refresh calls. Scope: `openid email profile roles offline_access`.
- **Service client (confidential)**: `nehzat-plus` (from `Otuh2Client:ClientId` in `appsettings*.json`). Used by `IOtuh2AuthClient` (Refit) for role seeding/provisioning. Real dev keys live in `appsettings.Development.json` (`ClientSecret`, `ApiKey`).

## Backend (ASP.NET Core)

- JWT validation: `Program.cs` sets `ValidTypes = ["at+jwt"]`, `NameClaimType = "sub"`, `RoleClaimType = "role"`, `RequireHttpsMetadata = false` in dev. Authority = `Oidc:Authority` (`http://localhost:5000`).
- `OidcSyncMiddleware` (`API/Middleware`) creates local `User` from `sub`/`userId`/`role` claims; sync is non-fatal (try/catch).
- `AuthController` only has `SignUp` (delegates to OTUH2 registration; creates a local pending user). Sign-in is fully delegated to OTUH2.
- Dev `UseMockAuth: true` swaps JWT for `MockAuthHandler` returning manager claims.

## Frontend Config

- `environment.ts`: `otuh2Url: 'http://localhost:5000'`, `apiUrl: 'http://localhost:3000'`.
- `api-url.util.ts` resolves otuh2Url: runtime `__otuh2Base` → `environment.otuh2Url` → fallback `http://localhost:5000`.
- `public/config.json` can override at runtime.

## EhrazHoviat Endpoints

| Purpose | URL (dev) |
|---------|-----------|
| Login page | `http://localhost:5000/auth/login` |
| Token | `http://localhost:5000/connect/token` |
| UserInfo | `http://localhost:5000/connect/userinfo` |
| JWKS | `http://localhost:5000/.well-known/jwks` |
| Discovery | `http://localhost:5000/.well-known/openid-configuration` |
| Admin roles | `http://localhost:5000/api/admin/roles` |
| Register | `http://localhost:5000/api/register` |

## CORS

Backend allows `localhost:4200`, `localhost:4201`, `localhost:3000`. OTUH2 must also allow the FE origin (OTUH2-side config).

## Divergences from the generic guide

- Login is **redirect-based**, not SPA password-grant from the login form. The SPA never sees the password.
- `auth.guard` redirects to OTUH2's hosted login, not a local route (the generic guide's Angular snippet points at `localhost:5000/auth/login` — correct; the old project code pointed at `localhost:4200/auth/login` and has been fixed).
- Real client IDs are `otuh2-spa-client` (SPA) and `nehzat-plus` (service), not the guide's `your-app` placeholders.
- Scope includes `offline_access` for refresh tokens.
