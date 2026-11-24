import { Injectable, inject } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { resolveRagflowApiBaseUrl } from '../../../core/services/api-url.util';

export interface RagflowApiEnvelope<T> {
  code: number;
  message: string;
  data: T;
}

export interface RagflowDataset {
  id: string;
  name: string;
  description?: string;
  document_count?: number;
  token_num?: number;
  chunk_count?: number;
  parser_id?: string;
  embedding_model?: string;
  [key: string]: unknown;
}

export interface RagflowChunk {
  id?: string;
  dataset_id?: string;
  document_id?: string;
  document_keyword?: string;
  content?: string;
  highlight?: string;
  similarity?: number;
  term_similarity?: number;
  vector_similarity?: number;
  [key: string]: unknown;
}

export interface RagflowDocAgg {
  doc_id?: string;
  doc_name?: string;
  count?: number;
  [key: string]: unknown;
}

export interface RagflowRetrievalData {
  total?: number;
  chunks?: RagflowChunk[];
  doc_aggs?: RagflowDocAgg[];
  [key: string]: unknown;
}

export interface RagflowHealth {
  status?: string;
  code?: number;
  message?: string;
  [key: string]: unknown;
}

const DEFAULT_API_KEY = 'ragflow-local-test';

@Injectable({ providedIn: 'root' })
export class RagflowApiService {
  private readonly http = new HttpClient(inject(HttpBackend));

  private get base(): string {
    return resolveRagflowApiBaseUrl();
  }

  private get apiKey(): string {
    const runtimeKey = (window as unknown as { __ragflowApiKey?: string }).__ragflowApiKey ?? '';
    return runtimeKey || DEFAULT_API_KEY;
  }

  private get headers(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`
    });
  }

  private fail(code: number, message: string): never {
    throw { code, message };
  }

  health(): Observable<RagflowHealth> {
    return this.http.get<RagflowHealth>(`${this.base}/api/v1/system/healthz`);
  }

  listDatasets(): Observable<RagflowDataset[]> {
    return this.http
      .get<RagflowApiEnvelope<RagflowDataset[]>>(`${this.base}/api/v1/datasets`, { headers: this.headers })
      .pipe(
        map((envelope) => {
          if (envelope.code !== 0) {
            this.fail(envelope.code, envelope.message);
          }
          return envelope.data ?? [];
        })
      );
  }

  retrieve(question: string, datasetIds: string[], pageSize = 8): Observable<RagflowRetrievalData> {
    return this.http
      .post<RagflowApiEnvelope<RagflowRetrievalData>>(
        `${this.base}/api/v1/retrieval`,
        { question, dataset_ids: datasetIds, page: 1, page_size: pageSize },
        { headers: this.headers }
      )
      .pipe(
        map((envelope) => {
          if (envelope.code !== 0) {
            this.fail(envelope.code, envelope.message);
          }
          return envelope.data ?? { total: 0, chunks: [] };
        })
      );
  }
}
