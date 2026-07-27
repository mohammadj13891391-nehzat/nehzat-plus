import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthService, LOCAL_STORAGE } from './auth.service';
import { OTUH2_API } from './otuh2-api.token';
import { AuthTokenResponse, RegisterPayload, ApiMessageResponse } from '../models/otuh2.models';
import { CurrentUser } from '../models/lesson-planner.models';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

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

function createMockJwt(payload: JwtPayload): string {
  const header = { alg: 'none', typ: 'JWT' };
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  return `${encodedHeader}.${encodedPayload}.`;
}

describe('AuthService', () => {
  let service: AuthService;
  let mockOtuh2Api: { signin: ReturnType<typeof vi.fn>; signup: ReturnType<typeof vi.fn> };
  let mockRouter: { navigate: ReturnType<typeof vi.fn>; navigateByUrl: ReturnType<typeof vi.fn> };
  let mockLocalStorage: Storage;
  let store: Map<string, string>;

  beforeEach(() => {
    TestBed.resetTestingModule();
    store = new Map<string, string>();
    mockLocalStorage = {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => { store.set(key, String(value)); },
      removeItem: (key: string) => { store.delete(key); },
      clear: () => { store.clear(); },
      get length() { return store.size; },
      key: (index: number) => [...store.keys()][index] ?? null,
    };
    mockOtuh2Api = {
      signin: vi.fn(),
      signup: vi.fn(),
    };
    mockRouter = {
      navigate: vi.fn(),
      navigateByUrl: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: OTUH2_API, useValue: mockOtuh2Api },
        { provide: Router, useValue: mockRouter },
        { provide: LOCAL_STORAGE, useValue: mockLocalStorage },
      ],
    });

    service = TestBed.inject(AuthService);

    try { sessionStorage.clear(); } catch {}
  });

  afterEach(() => {
    vi.clearAllMocks();
    try { sessionStorage.clear(); } catch {}
    try { store.clear(); } catch {}
  });

  describe('signin', () => {
    it('should call OTUH2_API.signin and store tokens', async () => {
      const mockResponse: AuthTokenResponse = {
        access_token: 'access-token',
        token_type: 'Bearer',
        expires_in: 3600,
        id_token: 'id-token',
        refresh_token: 'refresh-token',
      };
      mockOtuh2Api.signin.mockReturnValue(of(mockResponse));

      await service.signin('testuser', 'password123').toPromise();

      expect(mockOtuh2Api.signin).toHaveBeenCalledWith('testuser', 'password123');
      expect(sessionStorage.getItem(ACCESS_TOKEN_KEY)).toBe('access-token');
      expect(sessionStorage.getItem(ID_TOKEN_KEY)).toBe('id-token');
      expect(mockLocalStorage.getItem(REFRESH_TOKEN_KEY)).toBe('refresh-token');
    });

    it('should store only access_token and id_token when refresh_token is absent', async () => {
      const mockResponse: AuthTokenResponse = {
        access_token: 'access-token',
        token_type: 'Bearer',
        expires_in: 3600,
        id_token: 'id-token',
      };
      mockOtuh2Api.signin.mockReturnValue(of(mockResponse));

      await service.signin('testuser', 'password123').toPromise();

      expect(sessionStorage.getItem(ACCESS_TOKEN_KEY)).toBe('access-token');
      expect(sessionStorage.getItem(ID_TOKEN_KEY)).toBe('id-token');
      expect(mockLocalStorage.getItem(REFRESH_TOKEN_KEY)).toBeNull();
    });
  });

  describe('signup', () => {
    it('should call OTUH2_API.signup with payload', async () => {
      const payload: RegisterPayload = {
        firstName: 'Test',
        lastName: 'User',
        username: 'testuser',
        email: 'test@example.com',
        phoneNumber: '09123456789',
        password: 'password123',
      };
      const mockResponse: ApiMessageResponse = { message: 'Success' };
      mockOtuh2Api.signup.mockReturnValue(of(mockResponse));

      await service.signup(payload).toPromise();

      expect(mockOtuh2Api.signup).toHaveBeenCalledWith(payload);
    });
  });

  describe('logout', () => {
    it('should clear tokens from storage', () => {
      sessionStorage.setItem(ACCESS_TOKEN_KEY, 'access');
      sessionStorage.setItem(ID_TOKEN_KEY, 'id');
      mockLocalStorage.setItem(REFRESH_TOKEN_KEY, 'refresh');

      service.logout();

      expect(sessionStorage.getItem(ACCESS_TOKEN_KEY)).toBeNull();
      expect(sessionStorage.getItem(ID_TOKEN_KEY)).toBeNull();
      expect(mockLocalStorage.getItem(REFRESH_TOKEN_KEY)).toBeNull();
    });
  });

  describe('hasRole', () => {
    it('should return false when no user', () => {
      expect(service.hasRole('admin')).toBe(false);
    });

    it('should return true for matching role (case-insensitive)', () => {
      const payload: JwtPayload = {
        sub: 'testuser',
        role: 'Parent',
        exp: Date.now() / 1000 + 3600,
      };
      sessionStorage.setItem(ID_TOKEN_KEY, createMockJwt(payload));

      expect(service.hasRole('parent')).toBe(true);
      expect(service.hasRole('PARENT')).toBe(true);
      expect(service.hasRole('Parent')).toBe(true);
    });

    it('should return false for non-matching role', () => {
      const payload: JwtPayload = {
        sub: 'testuser',
        role: 'parent',
        exp: Date.now() / 1000 + 3600,
      };
      sessionStorage.setItem(ID_TOKEN_KEY, createMockJwt(payload));

      expect(service.hasRole('admin')).toBe(false);
    });

    it('should handle array of roles', () => {
      const payload: JwtPayload = {
        sub: 'testuser',
        role: ['parent', 'coach'],
        exp: Date.now() / 1000 + 3600,
      };
      sessionStorage.setItem(ID_TOKEN_KEY, createMockJwt(payload));

      expect(service.hasRole('parent')).toBe(true);
      expect(service.hasRole('coach')).toBe(true);
      expect(service.hasRole('admin')).toBe(false);
    });
  });

  describe('getCurrentUser', () => {
    it('should return null when no id_token', () => {
      expect(service.getCurrentUser()).toBeNull();
    });

    it('should return parsed user from valid token', () => {
      const payload: JwtPayload = {
        sub: 'testuser',
        role: 'parent',
        userId: '42',
        studentId: '5',
        branchId: '1',
        exp: Date.now() / 1000 + 3600,
      };
      sessionStorage.setItem(ID_TOKEN_KEY, createMockJwt(payload));

      const user = service.getCurrentUser();

      expect(user).toBeTruthy();
      expect(user?.username).toBe('testuser');
      expect(user?.userType).toBe('parent');
      expect(user?.studentId).toBe(5);
      expect(user?.branchId).toBe(1);
    });

    it('should handle missing role gracefully', () => {
      const payload: JwtPayload = {
        sub: 'testuser',
        exp: Date.now() / 1000 + 3600,
      };
      sessionStorage.setItem(ID_TOKEN_KEY, createMockJwt(payload));

      const user = service.getCurrentUser();

      expect(user).toBeTruthy();
      expect(user?.username).toBe('testuser');
      expect(user?.roles).toEqual([]);
    });

    it('should handle string role', () => {
      const payload: JwtPayload = {
        sub: 'testuser',
        role: 'coach',
        exp: Date.now() / 1000 + 3600,
      };
      sessionStorage.setItem(ID_TOKEN_KEY, createMockJwt(payload));

      const user = service.getCurrentUser();

      expect(user).toBeTruthy();
      expect(user?.userType).toBe('coach');
      expect(user?.roles).toEqual(['coach']);
    });

    it('should handle array of roles', () => {
      const payload: JwtPayload = {
        sub: 'testuser',
        role: ['parent', 'coach'],
        exp: Date.now() / 1000 + 3600,
      };
      sessionStorage.setItem(ID_TOKEN_KEY, createMockJwt(payload));

      const user = service.getCurrentUser();

      expect(user).toBeTruthy();
      expect(user?.userType).toBe('coach');
      expect(user?.roles).toEqual(['parent', 'coach']);
    });
  });

  describe('getDashboardPathForRole', () => {
    it('should return correct paths for each role', () => {
      expect(service.getDashboardPathForRole('manager')).toBe('/admin');
      expect(service.getDashboardPathForRole('admin')).toBe('/admin');
      expect(service.getDashboardPathForRole('trainee')).toBe('/dashboard');
      expect(service.getDashboardPathForRole('coach')).toBe('/coach');
      expect(service.getDashboardPathForRole('parent')).toBe('/parent');
      expect(service.getDashboardPathForRole('branch_manager')).toBe('/branch-manager');
      expect(service.getDashboardPathForRole('evaluator')).toBe('/evaluator');
      expect(service.getDashboardPathForRole('headquarters')).toBe('/headquarters');
      expect(service.getDashboardPathForRole('teacher')).toBe('/teacher');
      expect(service.getDashboardPathForRole('unknown')).toBe('/dashboard');
    });
  });
});