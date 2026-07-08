import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  AuthTokenResponse,
  RegisterPayload,
  ApiMessageResponse,
  UserInfoResponse
} from '../models/otuh2.models';
import { Otuh2Api } from './otuh2-api.interface';
import { resolveOtuh2BaseUrl } from './api-url.util';

@Injectable()
export class HttpOtuh2Api extends Otuh2Api {
  private readonly http = inject(HttpClient);
  private baseUrl: string;

  constructor() {
    super();
    this.baseUrl = resolveOtuh2BaseUrl();
  }

  signin(username: string, password: string): Observable<AuthTokenResponse> {
    const body = new HttpParams()
      .set('grant_type', 'password')
      .set('client_id', 'otuh2-spa-client')
      .set('username', username)
      .set('password', password)
      .set('scope', 'openid email profile roles offline_access');

    return this.http.post<AuthTokenResponse>(`${this.baseUrl}/connect/token`, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  }

  signup(payload: RegisterPayload): Observable<ApiMessageResponse> {
    return this.http.post<ApiMessageResponse>(`${this.baseUrl}/api/register`, payload);
  }

  refreshToken(refreshToken: string): Observable<AuthTokenResponse> {
    const body = new HttpParams()
      .set('grant_type', 'refresh_token')
      .set('client_id', 'otuh2-spa-client')
      .set('refresh_token', refreshToken);

    return this.http.post<AuthTokenResponse>(`${this.baseUrl}/connect/token`, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  }

  getUserInfo(): Observable<UserInfoResponse> {
    return this.http.get<UserInfoResponse>(`${this.baseUrl}/connect/userinfo`);
  }
}
