import { Observable } from 'rxjs';
import { AuthTokenResponse, RegisterPayload, ApiMessageResponse, UserInfoResponse } from '../models/otuh2.models';

export abstract class Otuh2Api {
  abstract signin(username: string, password: string): Observable<AuthTokenResponse>;
  abstract signup(payload: RegisterPayload): Observable<ApiMessageResponse>;
  abstract refreshToken(refreshToken: string): Observable<AuthTokenResponse>;
  abstract getUserInfo(): Observable<UserInfoResponse>;
}
