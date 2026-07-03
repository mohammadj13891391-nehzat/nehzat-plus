import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import {
  AuthSigninPayload,
  AuthSigninResponse,
  AuthSignupPayload,
  AuthSignupResponse,
  CurrentUser,
  UserType
} from '../models/lesson-planner.models';
import { LESSON_PLANNER_API } from './lesson-planner-api.token';

const TOKEN_KEY = 'token';

interface JwtPayload {
  sub: string;
  userType: UserType;
  userId?: number;
  studentId?: number;
  branchId?: number;
  exp?: number;
  iat?: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(LESSON_PLANNER_API);
  private readonly router = inject(Router);

  signin(payload: AuthSigninPayload): Observable<AuthSigninResponse> {
    return this.api.signin(payload).pipe(
      tap((response) => {
        localStorage.setItem(TOKEN_KEY, response.token);
      })
    );
  }

  signup(payload: AuthSignupPayload): Observable<AuthSignupResponse> {
    return this.api.signup(payload);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      return false;
    }
    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) {
      return false;
    }
    return payload.exp * 1000 > Date.now();
  }

  getCurrentUser(): CurrentUser | null {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      return null;
    }
    const payload = this.decodeToken(token);
    if (!payload || !payload.sub || !payload.userType) {
      return null;
    }
    return {
      username: payload.sub,
      userType: payload.userType,
      studentId: payload.studentId,
      branchId: payload.branchId
    };
  }

  getDashboardPathForRole(userType: UserType): string {
    switch (userType) {
      case 'manager':
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

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    void this.router.navigateByUrl('/auth/login');
  }

  private decodeToken(token: string): JwtPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }
      const payload = parts[1];
      const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(json) as JwtPayload;
    } catch {
      return null;
    }
  }
}
