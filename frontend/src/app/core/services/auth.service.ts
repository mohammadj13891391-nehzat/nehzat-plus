import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { OTUH2_API } from './otuh2-api.token';
import { AuthTokenResponse, RegisterPayload, ApiMessageResponse } from '../models/otuh2.models';
import { CurrentUser } from '../models/lesson-planner.models';

const ACCESS_TOKEN_KEY = 'otuh2_access_token';
const ID_TOKEN_KEY = 'otuh2_id_token';
const REFRESH_TOKEN_KEY = 'otuh2_refresh_token';

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
  private readonly router = inject(Router);

  signin(username: string, password: string): Observable<AuthTokenResponse> {
    return this.api.signin(username, password).pipe(
      tap(response => {
        sessionStorage.setItem(ACCESS_TOKEN_KEY, response.access_token);
        if (response.id_token) {
          sessionStorage.setItem(ID_TOKEN_KEY, response.id_token);
        }
        if (response.refresh_token) {
          localStorage.setItem(REFRESH_TOKEN_KEY, response.refresh_token);
        }
      })
    );
  }

  signup(payload: RegisterPayload): Observable<ApiMessageResponse> {
    return this.api.signup(payload);
  }

  logout(): void {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(ID_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    void this.router.navigateByUrl('/auth/login');
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
        return '/admin';
      case 'evaluator':
        return '/evaluator';
      case 'headquarters':
        return '/headquarters';
      default:
        return '/dashboard';
    }
  }

  private resolvePrimaryRole(roles: string[]): string {
    const priority = ['admin', 'manager', 'headquarters', 'branch_manager', 'coach', 'parent', 'evaluator', 'trainee'];
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
}
