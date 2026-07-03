import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

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
const USER_KEY = 'current-user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(LESSON_PLANNER_API);
  readonly useMockApi = environment.useMockApi;

  signin(payload: AuthSigninPayload): Observable<AuthSigninResponse> {
    return this.api.signin(payload).pipe(
      tap((response) => {
        localStorage.setItem(TOKEN_KEY, 'dummy-token');
        const user: CurrentUser = {
          username: response.username,
          userType: response.userType,
          studentId: response.studentId,
          imageUrl: response.imageUrl,
          studentInfo: response.studentInfo,
          branchId: response.branchId
        };
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      })
    );
  }

  signup(payload: AuthSignupPayload): Observable<AuthSignupResponse> {
    return this.api.signup(payload);
  }

  register(payload: AuthSignupPayload): Observable<AuthSignupResponse> {
    return this.signup(payload);
  }

  isAuthenticated(): boolean {
    return Boolean(localStorage.getItem(TOKEN_KEY));
  }

  getCurrentUser(): CurrentUser | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as CurrentUser;
    } catch {
      return null;
    }
  }

  isManager(): boolean {
    return this.getCurrentUser()?.userType === 'manager';
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
    localStorage.removeItem(USER_KEY);
  }
}
