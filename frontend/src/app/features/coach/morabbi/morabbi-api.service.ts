import { Injectable, inject, signal } from '@angular/core';
import { HttpBackend, HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, fromEvent, of, throwError } from 'rxjs';
import { resolveMorabbiApiBaseUrl } from '../../../core/services/api-url.util';
import {
  drainOfflineReportQueue,
  enqueueOfflineReport,
  pendingOfflineReportCount
} from './morabbi-offline-queue';
import {
  ApproveUserPayload,
  AuthUserDto,
  AwardRecognitionPayload,
  BoardEntry,
  Branch,
  ChangePasswordPayload,
  CreateBranchPayload,
  CreateEvaluationPayload,
  CreateLessonPlanPayload,
  CreateMaktabPayload,
  CreateReportPayload,
  DashboardData,
  DailyReport,
  Evaluation,
  EvaluationCriteria,
  LessonPlan,
  Maktab,
  NotificationListResponse,
  PointTransaction,
  Recognition,
  UpdateBranchPayload,
  UpdateEvaluationPayload,
  UpdateLessonPlanPayload,
  UpdateMaktabPayload,
  UpdateReportPayload
} from './morabbi.models';

const TOKEN_KEY = 'morabbi_token';
const USER_KEY = 'morabbi_user';

const PHONE_MAP: Record<string, string> = {
  admin: '09120000001',
  manager: '09120000002',
  branch_manager: '09120000003',
  evaluator: '09120000004',
  coach: '09120000005'
};
const DEV_PASSWORD = 'password123';

@Injectable({ providedIn: 'root' })
export class MorabbiApiService {
  private readonly http = new HttpClient(inject(HttpBackend));

  readonly user = signal<AuthUserDto | null>(this.restoreUser());
  readonly sessionReady = signal<boolean>(!!localStorage.getItem(TOKEN_KEY));
  readonly sessionError = signal<string | null>(null);
  readonly pendingOfflineReports = signal(0);

  private ensureSessionOnce: Promise<void> | null = null;
  private offlineSyncing = false;

  constructor() {
    fromEvent(window, 'online').subscribe(() => {
      void this.syncOfflineReports();
    });
    void this.refreshPendingOffline();
    void this.syncOfflineReports();
  }

  private get base(): string {
    return resolveMorabbiApiBaseUrl();
  }

  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  ensureSession(nehzatUserType: string | null | undefined): Observable<AuthUserDto | null> {
    if (localStorage.getItem(TOKEN_KEY) && this.user()) {
      this.sessionReady.set(true);
      return of(this.user());
    }
    const phone = PHONE_MAP[(nehzatUserType ?? '').toLowerCase()] ?? PHONE_MAP['coach'];
    this.ensureSessionOnce = this.http
      .post<{ token: string; user: AuthUserDto }>(`${this.base}/api/auth/local`, { phone, password: DEV_PASSWORD })
      .toPromise()
      .then((res) => {
        if (!res) {
          throw new Error('morabbi session unavailable');
        }
        localStorage.setItem(TOKEN_KEY, res.token);
        localStorage.setItem(USER_KEY, JSON.stringify(res.user));
        this.user.set(res.user);
        this.sessionReady.set(true);
      })
      .catch((err) => {
        const msg = (err as HttpErrorResponse)?.error?.message ?? 'اتصال به سامانه مربی ناموفق بود';
        this.sessionError.set(msg);
        this.sessionReady.set(true);
        throw err;
      });
    return new Observable((obs) => {
      this.ensureSessionOnce!.then(
        () => {
          obs.next(this.user());
          obs.complete();
        },
        (err) => obs.error(err)
      );
    });
  }

  private headers(): HttpHeaders {
    const token = this.token;
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }

  private req<T>(req: { method: string; path: string; body?: unknown; params?: HttpParams }): Observable<T> {
    const obs = this.http.request<T>(req.method, `${this.base}${req.path}`, {
      body: req.body,
      params: req.params,
      headers: this.headers()
    });
    return new Observable<T>((subscriber) => {
      obs.subscribe({
        next: (v) => subscriber.next(v),
        error: (err) => {
          if (err instanceof HttpErrorResponse && err.status === 401) {
            this.clearSession();
          }
          subscriber.error(err);
        },
        complete: () => subscriber.complete()
      });
    });
  }

  private clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.user.set(null);
    this.sessionReady.set(false);
    this.ensureSessionOnce = null;
  }

  me(): Observable<AuthUserDto> {
    return this.req<AuthUserDto>({ method: 'GET', path: '/api/auth/me' });
  }

  changePassword(payload: ChangePasswordPayload): Observable<{ message: string }> {
    return this.req<{ message: string }>({ method: 'POST', path: '/api/auth/change-password', body: payload });
  }

  pendingApprovals(): Observable<AuthUserDto[]> {
    return this.req<AuthUserDto[]>({ method: 'GET', path: '/api/auth/pending-approvals' });
  }

  approveUser(payload: ApproveUserPayload): Observable<AuthUserDto> {
    return this.req<AuthUserDto>({ method: 'POST', path: '/api/auth/approve', body: payload });
  }

  getDashboard(): Observable<DashboardData> {
    return this.req<DashboardData>({ method: 'GET', path: '/api/dashboard' });
  }

  getReports(branchId?: number): Observable<DailyReport[]> {
    const params = branchId ? new HttpParams().set('branchId', branchId.toString()) : undefined;
    return this.req<DailyReport[]>({ method: 'GET', path: '/api/reports', params });
  }

  getReport(id: number): Observable<DailyReport> {
    return this.req<DailyReport>({ method: 'GET', path: `/api/reports/${id}` });
  }

  createReport(payload: CreateReportPayload): Observable<{ report: DailyReport | null }> {
    const queueOffline = () =>
      new Observable<{ report: DailyReport | null }>((subscriber) => {
        enqueueOfflineReport(payload)
          .then(() => {
            this.refreshPendingOffline();
            subscriber.next({ report: null });
            subscriber.complete();
          })
          .catch((err) => subscriber.error(err));
      });

    if (!navigator.onLine) {
      return queueOffline();
    }

    return new Observable<{ report: DailyReport | null }>((subscriber) => {
      this.req<{ report: DailyReport }>({ method: 'POST', path: '/api/reports', body: payload }).subscribe({
        next: (v) => {
          subscriber.next({ report: v.report });
          subscriber.complete();
        },
        error: (err) => {
          const networkFailure = err instanceof HttpErrorResponse && (err.status === 0 || !navigator.onLine);
          if (networkFailure) {
            queueOffline().subscribe(subscriber);
          } else {
            subscriber.error(err);
          }
        }
      });
    });
  }

  async syncOfflineReports(): Promise<void> {
    if (this.offlineSyncing || !this.token || !navigator.onLine) return;
    this.offlineSyncing = true;
    try {
      const sent = await drainOfflineReportQueue(async (payload) => {
        await this.http
          .post<{ report: DailyReport }>(`${this.base}/api/reports`, payload, { headers: this.headers() })
          .toPromise();
      });
      if (sent > 0) this.refreshPendingOffline();
    } catch {
      // queue stays, retry on next online/startup
    } finally {
      this.offlineSyncing = false;
    }
  }

  private refreshPendingOffline(): void {
    pendingOfflineReportCount()
      .then((n) => this.pendingOfflineReports.set(n))
      .catch(() => {});
  }

  updateReport(id: number, payload: UpdateReportPayload): Observable<{ report: DailyReport }> {
    return this.req<{ report: DailyReport }>({ method: 'PUT', path: `/api/reports/${id}`, body: payload });
  }

  returnReport(id: number, comment: string | null): Observable<{ message: string }> {
    return this.req<{ message: string }>({ method: 'POST', path: `/api/reports/${id}/return`, body: { comment } });
  }

  getLessonPlans(branchId?: number): Observable<LessonPlan[]> {
    const params = branchId ? new HttpParams().set('branchId', branchId.toString()) : undefined;
    return this.req<LessonPlan[]>({ method: 'GET', path: '/api/lesson-plans', params });
  }

  getLessonPlan(id: number): Observable<LessonPlan> {
    return this.req<LessonPlan>({ method: 'GET', path: `/api/lesson-plans/${id}` });
  }

  createLessonPlan(payload: CreateLessonPlanPayload): Observable<{ lessonPlan: LessonPlan }> {
    return this.req<{ lessonPlan: LessonPlan }>({ method: 'POST', path: '/api/lesson-plans', body: payload });
  }

  updateLessonPlan(id: number, payload: UpdateLessonPlanPayload): Observable<{ lessonPlan: LessonPlan }> {
    return this.req<{ lessonPlan: LessonPlan }>({ method: 'PUT', path: `/api/lesson-plans/${id}`, body: payload });
  }

  returnLessonPlan(id: number, comment: string | null): Observable<{ message: string }> {
    return this.req<{ message: string }>({ method: 'POST', path: `/api/lesson-plans/${id}/return`, body: { comment } });
  }

  getCriteria(type: 'REPORT' | 'LESSON_PLAN'): Observable<EvaluationCriteria[]> {
    return this.req<EvaluationCriteria[]>({
      method: 'GET',
      path: '/api/evaluation-criteria',
      params: new HttpParams().set('type', type)
    });
  }

  getEvaluations(targetType: string, targetId: number): Observable<{ evaluations: Evaluation[] }> {
    return this.req<{ evaluations: Evaluation[] }>({
      method: 'GET',
      path: '/api/evaluations',
      params: new HttpParams().set('targetType', targetType).set('targetId', targetId.toString())
    });
  }

  createEvaluation(payload: CreateEvaluationPayload): Observable<{ evaluation: Evaluation }> {
    return this.req<{ evaluation: Evaluation }>({ method: 'POST', path: '/api/evaluations', body: payload });
  }

  updateEvaluation(id: number, payload: UpdateEvaluationPayload): Observable<{ evaluation: Evaluation }> {
    return this.req<{ evaluation: Evaluation }>({ method: 'PUT', path: `/api/evaluations/${id}`, body: payload });
  }

  getRecognitionBoard(branchId?: number): Observable<BoardEntry[]> {
    const params = branchId ? new HttpParams().set('branchId', branchId.toString()) : undefined;
    return this.req<BoardEntry[]>({ method: 'GET', path: '/api/recognition/board', params });
  }

  getRecognitions(userId?: number): Observable<Recognition[]> {
    const params = userId ? new HttpParams().set('userId', userId.toString()) : undefined;
    return this.req<Recognition[]>({ method: 'GET', path: '/api/recognition', params });
  }

  awardRecognition(payload: AwardRecognitionPayload): Observable<{ recognition: Recognition }> {
    return this.req<{ recognition: Recognition }>({ method: 'POST', path: '/api/recognition', body: payload });
  }

  getPoints(userId: number): Observable<PointTransaction[]> {
    return this.req<PointTransaction[]>({
      method: 'GET',
      path: '/api/points',
      params: new HttpParams().set('userId', userId.toString())
    });
  }

  getNotifications(): Observable<NotificationListResponse> {
    return this.req<NotificationListResponse>({ method: 'GET', path: '/api/notifications' });
  }

  markAllNotificationsRead(): Observable<{ message: string }> {
    return this.req<{ message: string }>({ method: 'POST', path: '/api/notifications/read-all', body: null });
  }

  getMaktabs(): Observable<Maktab[]> {
    return this.req<Maktab[]>({ method: 'GET', path: '/api/maktabs' });
  }

  createMaktab(payload: CreateMaktabPayload): Observable<Maktab> {
    return this.req<Maktab>({ method: 'POST', path: '/api/maktabs', body: payload });
  }

  updateMaktab(id: number, payload: UpdateMaktabPayload): Observable<Maktab> {
    return this.req<Maktab>({ method: 'PUT', path: `/api/maktabs/${id}`, body: payload });
  }

  deleteMaktab(id: number): Observable<void> {
    return this.req<void>({ method: 'DELETE', path: `/api/maktabs/${id}` });
  }

  getBranches(): Observable<Branch[]> {
    return this.req<Branch[]>({ method: 'GET', path: '/api/branches' });
  }

  createBranch(payload: CreateBranchPayload): Observable<Branch> {
    return this.req<Branch>({ method: 'POST', path: '/api/branches', body: payload });
  }

  updateBranch(id: number, payload: UpdateBranchPayload): Observable<Branch> {
    return this.req<Branch>({ method: 'PUT', path: `/api/branches/${id}`, body: payload });
  }

  deleteBranch(id: number): Observable<void> {
    return this.req<void>({ method: 'DELETE', path: `/api/branches/${id}` });
  }

  logout(): void {
    this.clearSession();
  }

  hasRole(...roles: string[]): boolean {
    const u = this.user();
    if (!u || !u.role) return false;
    const current = u.role.toLowerCase();
    return roles.some((r) => r.toLowerCase() === current);
  }

  isStaff(): boolean {
    return this.hasRole('admin', 'manager', 'branch_manager', 'evaluator', 'brothers_skills_supervisor', 'sisters_skills_supervisor');
  }

  canEvaluate(): boolean {
    return this.hasRole('evaluator', 'branch_manager', 'manager', 'admin');
  }

  canApprove(): boolean {
    return this.hasRole('admin', 'manager', 'branch_manager');
  }

  isAdminManager(): boolean {
    return this.hasRole('admin', 'manager');
  }

  private restoreUser(): AuthUserDto | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as AuthUserDto) : null;
    } catch {
      return null;
    }
  }
}
