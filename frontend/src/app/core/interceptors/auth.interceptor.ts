import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';

let isRefreshing = false;
const refreshQueue = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  // Never intercept OTUH2 /connect/token calls (refresh, signin)
  if (req.url.includes('/connect/token')) {
    return next(req);
  }

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401) {
        return throwError(() => error);
      }

      if (isRefreshing) {
        // Another 401 is already refreshing — queue this request
        return refreshQueue.pipe(
          filter(newToken => newToken !== null),
          take(1),
          switchMap(newToken =>
            next(req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } }))
          )
        );
      }

      isRefreshing = true;
      return authService.refreshToken().pipe(
        switchMap(success => {
          isRefreshing = false;
          if (success) {
            const newToken = authService.getAccessToken()!;
            refreshQueue.next(newToken);
            return next(req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } }));
          }
          refreshQueue.next(null);
          authService.logout();
          return throwError(() => error);
        }),
        catchError(() => {
          isRefreshing = false;
          refreshQueue.next(null);
          authService.logout();
          return throwError(() => error);
        })
      );
    })
  );
};
