import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MockDataContext } from './mock-data-context';
import {
  Coach,
  CoachFileDto,
  TrainingSampleDto,
  TrainingSummaryDto,
  Student,
  BranchManager,
  CreateCoachPayload,
  CreateStudentPayload,
  UpdateStudentPayload,
  ApiMessageResponse,
} from '../../models/lesson-planner.models';

@Injectable({ providedIn: 'root' })
export class MockAdminCoachesService {
  private coachFiles = new Map<number, CoachFileDto[]>();
  private trainingSamples: TrainingSampleDto[] = [];

  constructor(private ctx: MockDataContext) {}

  getCoaches(): Observable<Coach[]> {
    return this.ctx.delayed([...this.ctx.coaches]);
  }

  getMyCoaches(): Observable<Coach[]> {
    return this.ctx.delayed([...this.ctx.coaches]);
  }

  getMyBranchManagers(): Observable<BranchManager[]> {
    return this.ctx.delayed([...this.ctx.branchManagers]);
  }

  createCoach(payload: CreateCoachPayload): Observable<Coach> {
    const coach: Coach = {
      id: this.ctx.nextId(this.ctx.coaches),
      username: payload.username,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      specialization: payload.specialization,
      branchId: payload.branchId,
      assignedCourseIds: [],
      status: 'active',
      createdAt: this.ctx.now(),
    };
    this.ctx.coaches.push(coach);
    return this.ctx.delayed(coach);
  }

  updateCoach(id: number, payload: Partial<CreateCoachPayload>): Observable<Coach> {
    const coach = this.ctx.coaches.find((c) => c.id === id);
    if (!coach) throw new Error('Coach not found');
    Object.assign(coach, payload);
    return this.ctx.delayed(coach);
  }

  deleteCoach(id: number): Observable<ApiMessageResponse> {
    this.ctx.coaches = this.ctx.coaches.filter((c) => c.id !== id);
    this.coachFiles.delete(id);
    return this.ctx.delayed({ message: 'مربی با موفقیت حذف شد' });
  }

  getCoachFiles(coachId: number): Observable<CoachFileDto[]> {
    return this.ctx.delayed([...(this.coachFiles.get(coachId) ?? [])]);
  }

  uploadCoachFile(coachId: number, title: string, file: File): Observable<CoachFileDto> {
    const list = this.coachFiles.get(coachId) ?? [];
    const type = file.type;
    const kind = type.startsWith('audio/')
      ? 'audio'
      : type.startsWith('image/')
        ? 'image'
        : type.startsWith('video/')
          ? 'video'
          : type === 'application/pdf'
            ? 'document'
            : 'other';
    const dto: CoachFileDto = {
      id: this.ctx.nextId(list),
      title: title || file.name,
      fileName: file.name,
      storedPath: `/mock/uploads/coach-files/${file.name}`,
      contentType: type || 'application/octet-stream',
      kind,
      sizeBytes: file.size,
      createdAt: new Date().toISOString(),
    };
    list.push(dto);
    this.coachFiles.set(coachId, list);
    return this.ctx.delayed(dto);
  }

  deleteCoachFile(coachId: number, fileId: number): Observable<void> {
    const list = this.coachFiles.get(coachId) ?? [];
    this.coachFiles.set(coachId, list.filter((f) => f.id !== fileId));
    return this.ctx.delayed(undefined as void);
  }

  addTrainingSample(file: File, text: string, coachId?: number): Observable<TrainingSampleDto> {
    const coach = coachId != null ? this.ctx.coaches.find((c) => c.id === coachId) : undefined;
    const dto: TrainingSampleDto = {
      id: this.ctx.nextId(this.trainingSamples),
      audioPath: `/mock/uploads/training/${file.name}`,
      text: text.trim(),
      coachName: coach ? `${coach.firstName} ${coach.lastName}`.trim() : '',
      coachId: coach?.id ?? null,
      durationSec: null,
      createdAt: new Date().toISOString(),
    };
    this.trainingSamples.push(dto);
    return this.ctx.delayed(dto);
  }

  getTrainingSamples(coachId?: number): Observable<TrainingSampleDto[]> {
    let list = [...this.trainingSamples];
    if (coachId != null) list = list.filter((s) => s.coachId === coachId);
    return this.ctx.delayed(
      list.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    );
  }

  deleteTrainingSample(sampleId: number): Observable<void> {
    this.trainingSamples = this.trainingSamples.filter((s) => s.id !== sampleId);
    return this.ctx.delayed(undefined as void);
  }

  getTrainingSummary(): Observable<TrainingSummaryDto> {
    const byCoach = new Map<string, { coach: string; samples: number; durationSec: number }>();
    for (const s of this.trainingSamples) {
      const entry = byCoach.get(s.coachName) ?? { coach: s.coachName, samples: 0, durationSec: 0 };
      entry.samples += 1;
      entry.durationSec += s.durationSec ?? 0;
      byCoach.set(s.coachName, entry);
    }
    const rows = [...byCoach.values()].sort((a, b) => b.samples - a.samples);
    return this.ctx.delayed({
      count: this.trainingSamples.length,
      totalDurationSec: this.trainingSamples.reduce((sum, s) => sum + (s.durationSec ?? 0), 0),
      byCoach: rows,
    });
  }

  getStudents(): Observable<Student[]> {
    return this.ctx.delayed([...this.ctx.students]);
  }

  createStudent(payload: CreateStudentPayload): Observable<Student> {
    const student: Student = {
      id: this.ctx.nextId(this.ctx.students),
      studentId: payload.studentId ?? `S${this.ctx.nextId(this.ctx.students)}`,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      username: payload.username,
      branchId: payload.branchId,
      status: 'active',
      createdAt: this.ctx.now(),
    };
    this.ctx.students.push(student);
    return this.ctx.delayed(student);
  }

  updateStudent(id: number, payload: UpdateStudentPayload): Observable<Student> {
    const student = this.ctx.students.find((s) => s.id === id);
    if (!student) throw new Error('Student not found');
    Object.assign(student, payload);
    return this.ctx.delayed(student);
  }

  deleteStudent(id: number): Observable<ApiMessageResponse> {
    this.ctx.students = this.ctx.students.filter((s) => s.id !== id);
    return this.ctx.delayed({ message: 'دانش‌آموز با موفقیت حذف شد' });
  }

  getCoachStudents(): Observable<Student[]> {
    return this.ctx.delayed([...this.ctx.students]);
  }
}
