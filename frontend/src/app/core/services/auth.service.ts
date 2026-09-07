import { Injectable, inject, InjectionToken, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, switchMap, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { OTUH2_API } from './otuh2-api.token';
import { LESSON_PLANNER_API } from './lesson-planner-api.token';
import { AuthTokenResponse, RegisterPayload, ApiMessageResponse } from '../models/otuh2.models';
import { AuthSigninPayload, AuthSigninResponse, CurrentUser, ProfileDto, QrPollResponse } from '../models/lesson-planner.models';
import { resolveOtuh2BaseUrl } from './api-url.util';

const ACCESS_TOKEN_KEY = 'otuh2_access_token';
const ID_TOKEN_KEY = 'otuh2_id_token';
const REFRESH_TOKEN_KEY = 'otuh2_refresh_token';

export const LOCAL_STORAGE = new InjectionToken<Storage>('LOCAL_STORAGE', {
  providedIn: 'root',
  factory: () => {
    try {
      const ls = localStorage;
      if (ls) return ls;
    } catch { }
    return { getItem: () => null, setItem: () => {}, removeItem: () => {}, clear: () => {}, get length() { return 0; }, key: () => null } as Storage;
  },
});

interface JwtPayload {
  sub?: string;
  name?: string;
  email?: string;
  role?: string | string[];
  userId?: string;
  studentId?: string;
  branchId?: string;
  exp?: number;
  iat?: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(OTUH2_API);
  private readonly lessonPlannerApi = inject(LESSON_PLANNER_API);
  private readonly router = inject(Router);
  private readonly storage = inject(LOCAL_STORAGE);

  readonly #enrichedUser = signal<Partial<Pick<CurrentUser, 'phase' | 'ageCluster' | 'ringNumber' | 'maktabNameEn' | 'age'>> | null>(null);

  readonly phase = computed(() => this.#enrichedUser()?.phase ?? null);
  readonly age = computed(() => this.#enrichedUser()?.age ?? null);
  readonly ageCluster = computed(() => this.#enrichedUser()?.ageCluster ?? null);
  readonly ringNumber = computed(() => this.#enrichedUser()?.ringNumber ?? null);
  readonly maktabNameEn = computed(() => this.#enrichedUser()?.maktabNameEn ?? null);
  readonly isProfileLoaded = computed(() => this.#enrichedUser() !== null);

  enrichCurrentUser(profile: ProfileDto): void {
    this.#enrichedUser.set({
      phase: profile.phase,
      ageCluster: profile.ageCluster,
      ringNumber: profile.ringNumber,
      maktabNameEn: profile.maktabNameEn,
      age: profile.age,
    });
  }

  clearEnrichedUser(): void {
    this.#enrichedUser.set(null);
  }

  loadProfileAndEnrich(): void {
    if (!this.isAuthenticated()) {
      return;
    }
    this.lessonPlannerApi.getProfile().subscribe({
      next: (profile) => {
        this.enrichCurrentUser(profile);
      },
      error: (err) => {
        console.warn('[AuthService.loadProfileAndEnrich] profile fetch failed:', err);
      },
    });
  }

  signin(username: string, password: string): Observable<AuthTokenResponse> {
    return this.api.signin(username, password).pipe(
      tap(response => {
        sessionStorage.setItem(ACCESS_TOKEN_KEY, response.access_token);
        if (response.id_token) {
          sessionStorage.setItem(ID_TOKEN_KEY, response.id_token);
        }
        if (response.refresh_token) {
          this.storage.setItem(REFRESH_TOKEN_KEY, response.refresh_token);
        }
      })
    );
  }

  /** Centralized dev sign-in via the backend /auth/signin endpoint.
   *  Stores the returned token as both access+id token so the Bearer
   *  interceptor attaches it to every subsequent API call. */
  signinLocal(username: string, password: string): Observable<AuthSigninResponse> {
    return this.lessonPlannerApi.signin({ username, password }).pipe(
      tap((response: AuthSigninResponse) => {
        if (response.token) {
          sessionStorage.setItem(ACCESS_TOKEN_KEY, response.token);
          sessionStorage.setItem(ID_TOKEN_KEY, response.token);
        }
      })
    );
  }

  signup(payload: RegisterPayload): Observable<ApiMessageResponse> {
    return this.api.signup(payload);
  }

  /** Create mock JWT session (dev only). Accepts role override. */
  mockLogin(role?: string): void {
    const mockUser = environment.mockUser;
    if (!mockUser) {
      console.warn('[AuthService.mockLogin] no mockUser in environment');
      return;
    }
    const finalRole = role ?? 'admin';
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: mockUser.name,
      name: mockUser.name,
      email: mockUser.email,
      role: finalRole,
      userId: mockUser.id,
      studentId: finalRole === 'trainee' ? '42' : null,
      branchId: finalRole === 'branch_manager' || finalRole === 'admin' ? '1' : null,
      exp: Math.floor(Date.now() / 1000) + 365 * 24 * 3600,
      iat: Math.floor(Date.now() / 1000),
    }));
    const mockToken = `${header}.${payload}.mock-signature`;
    sessionStorage.setItem(ID_TOKEN_KEY, mockToken);
    sessionStorage.setItem(ACCESS_TOKEN_KEY, mockToken);
    console.log('[AuthService.mockLogin] mock session created role=' + finalRole + ' for:', mockUser.name);
  }

  logout(): void {
    this.clearEnrichedUser();
    const idToken = sessionStorage.getItem(ID_TOKEN_KEY);
    const refreshToken = this.storage.getItem(REFRESH_TOKEN_KEY);

    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(ID_TOKEN_KEY);
    this.storage.removeItem(REFRESH_TOKEN_KEY);

    if (environment.useMockAuth) {
      void this.router.navigateByUrl('/auth/login');
      return;
    }

    if (idToken || refreshToken) {
      this.endSession(idToken);
    } else {
      void this.router.navigateByUrl('/auth/login');
    }
  }

  /** Soft logout for 401 handling: clear tokens and navigate to /auth/login in-app (no IdP redirect). */
  logoutToLogin(): void {
    this.clearEnrichedUser();
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(ID_TOKEN_KEY);
    this.storage.removeItem(REFRESH_TOKEN_KEY);
    void this.router.navigateByUrl('/auth/login');
  }

  /** RP-initiated logout: ends the OTUH2 server-side session then returns to /auth/login. */
  endSession(idToken: string | null = null): void {
    const endSessionUrl = `${resolveOtuh2BaseUrl()}/connect/endsession`;
    const postLogoutUri = encodeURIComponent(`${window.location.origin}/auth/login`);
    const redirectUrl = idToken
      ? `${endSessionUrl}?id_token_hint=${encodeURIComponent(idToken)}&post_logout_redirect_uri=${postLogoutUri}`
      : `${endSessionUrl}?post_logout_redirect_uri=${postLogoutUri}`;
    window.location.href = redirectUrl;
  }

  /** Try to refresh the access token using the stored refresh token. */
  refreshToken(): Observable<boolean> {
    const stored = this.storage.getItem(REFRESH_TOKEN_KEY);
    if (!stored) {
      return of(false);
    }
    return this.api.refreshToken(stored).pipe(
      tap(response => {
        sessionStorage.setItem(ACCESS_TOKEN_KEY, response.access_token);
        if (response.id_token) {
          sessionStorage.setItem(ID_TOKEN_KEY, response.id_token);
        }
        if (response.refresh_token) {
          this.storage.setItem(REFRESH_TOKEN_KEY, response.refresh_token);
        }
      }),
      switchMap(() => of(true)),
    );
  }

  isAuthenticated(): boolean {
    const idToken = sessionStorage.getItem(ID_TOKEN_KEY);
    if (!idToken) {
      console.warn('[AuthService.isAuthenticated] NO id_token in sessionStorage');
      return false;
    }
    const payload = this.decodeToken(idToken);
    if (!payload?.exp) {
      console.warn('[AuthService.isAuthenticated] id_token found but NO exp claim:', payload);
      return false;
    }
    const valid = payload.exp * 1000 > Date.now();
    console.log('[AuthService.isAuthenticated] id_token exp=', new Date(payload.exp * 1000).toISOString(), 'now=', new Date().toISOString(), 'valid=', valid);
    return valid;
  }

  getAccessToken(): string | null {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY);
  }

  getCurrentUser(): CurrentUser | null {
    const idToken = sessionStorage.getItem(ID_TOKEN_KEY);
    if (!idToken) {
      console.log('[AuthService.getCurrentUser] no id_token');
      return null;
    }
    const payload = this.decodeToken(idToken);
    if (!payload?.sub) {
      console.warn('[AuthService.getCurrentUser] id_token decoded but no sub:', payload);
      return null;
    }
    const roles = typeof payload.role === 'string'
      ? [payload.role]
      : (payload.role ?? []);
    const user: CurrentUser = {
      username: payload.sub,
      roles,
      userType: this.resolvePrimaryRole(roles),
      studentId: payload.studentId ? parseInt(payload.studentId, 10) : undefined,
      branchId: payload.branchId ? parseInt(payload.branchId, 10) : undefined
    };
    console.log('[AuthService.getCurrentUser] user:', user);
    return user;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    if (!user?.roles) {
      return false;
    }
    return user.roles.some(r => r.toLowerCase() === role.toLowerCase());
  }

  getDashboardPathForRole(userType: string): string {
    switch (userType) {
      case 'manager':
      case 'admin':
        return '/admin';
      case 'trainee':
        return '/dashboard';
      case 'coach':
        return '/coach';
      case 'parent':
        return '/parent';
      case 'branch_manager':
        return '/branch-manager';
      case 'evaluator':
        return '/evaluator';
      case 'headquarters':
        return '/headquarters';
      case 'teacher':
        return '/teacher';
      default:
        return '/dashboard';
    }
  }

  resolvePrimaryRole(roles: string[]): string {
    const priority = ['admin', 'manager', 'headquarters', 'branch_manager', 'coach', 'parent', 'evaluator', 'teacher', 'trainee'];
    const lowerRoles = roles.map(r => r.toLowerCase());
    for (const role of priority) {
      if (lowerRoles.includes(role)) {
        return role;
      }
    }
    return roles[0]?.toLowerCase() ?? 'trainee';
  }

  private decodeToken(token: string): JwtPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }
      const json = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(json) as JwtPayload;
    } catch {
      return null;
    }
  }

  /** Request a QR code for QR-based login.
   *  Generates a new QR session with the given device info (or 'web' default).
   *  Returns the sessionId and qrData that can be displayed as a QR code. */
  requestQrCode(deviceInfo?: string) {
    return this.lessonPlannerApi.requestQrCode({ deviceInfo }).pipe(
      tap(({ sessionId }) => {
        sessionStorage.setItem('qr_session_id', sessionId);
      })
    );
  }

  /** Poll the QR status for a given sessionId.
   *  Returns the status ('pending' | 'confirmed' | 'expired') and optionally the token and user info. */
  pollQrStatus(): Observable<QrPollResponse> {
    const sessionId = sessionStorage.getItem('qr_session_id');
    if (!sessionId) {
      return of({ status: 'expired' as const });
    }
    return this.lessonPlannerApi.pollQrStatus(sessionId).pipe(
      tap(({ status, token, username, userType, studentId, branchId }) => {
        if (status === 'confirmed') {
          if (token) {
            sessionStorage.setItem('qr_token', token);
          }
          if (username) {
            sessionStorage.setItem('qr_username', username);
          }
        }
      })
    );
  }

  /** Confirm a QR code scan by providing the sessionId and username.
   *  Marks the QR as confirmed and issues a JWT token for the user. */
  confirmQrScan(username: string) {
    const sessionId = sessionStorage.getItem('qr_session_id');
    if (!sessionId) {
      return of({ status: 'expired', message: 'QR session not found' });
    }
    return this.lessonPlannerApi.confirmQrScan({ sessionId, username }).pipe(
      tap(({ status, message }) => {
        if (status === 'confirmed') {
          console.log('[AuthService.confirmQrScan] QR confirmed for:', username);
        }
      })
    );
  }
}