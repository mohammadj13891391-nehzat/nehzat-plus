import { UserType } from '../models/lesson-planner.models';

export function base64UrlEncode(value: string): string {
  return btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function createDummyToken(
  username: string,
  userType: UserType,
  studentId?: number,
  branchId?: number
): string {
  const header = JSON.stringify({ alg: 'none', typ: 'JWT' });
  const payload = JSON.stringify({
    sub: username,
    userType,
    studentId,
    branchId,
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
    iat: Math.floor(Date.now() / 1000),
  });
  const signature = '';
  return `${base64UrlEncode(header)}.${base64UrlEncode(payload)}.${signature}`;
}

export function mockDelay<T>(value: T, delayMs: number = 300): T {
  // Simulates network delay — callers wrap with `of(value).pipe(delay(delayMs))`
  return value;
}

export function nextId<T extends { id: number }>(items: T[]): number {
  return items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1;
}
