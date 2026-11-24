import { Injectable, inject } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { resolveLightragApiBaseUrl } from '../../../core/services/api-url.util';

export interface LightragQueryResponse {
  response: string;
  references?: Array<{ file_path?: string; [key: string]: unknown }>;
}

export interface LightragDocumentStatus {
  status_counts: Record<string, number>;
}

export interface LightragHealth {
  status: string;
  pipeline?: { status?: string; busy?: boolean };
}

const API_KEY = 'lightrag-local-test';

@Injectable({ providedIn: 'root' })
export class LightragApiService {
  private readonly http = new HttpClient(inject(HttpBackend));

  private get base(): string {
    return resolveLightragApiBaseUrl();
  }

  private get headers(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY
    });
  }

  query(text: string, mode: 'local' | 'global' | 'hybrid' | 'naive' | 'mix' = 'hybrid'): Observable<LightragQueryResponse> {
    return this.http.post<LightragQueryResponse>(`${this.base}/query`, { query: text, mode }, { headers: this.headers });
  }

  health(): Observable<LightragHealth> {
    return this.http.get<LightragHealth>(`${this.base}/health`, { headers: this.headers });
  }

  documentStatus(): Observable<LightragDocumentStatus> {
    return this.http.get<LightragDocumentStatus>(`${this.base}/documents/status_counts`, { headers: this.headers });
  }

  graphLabels(): Observable<string[]> {
    return this.http.get<string[]>(`${this.base}/graph/label/list`, { headers: this.headers });
  }
}
