import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MockDataContext } from './mock-data-context';
import {
  Coach,
  Student,
  BranchManager,
  CreateCoachPayload,
  CreateStudentPayload,
  UpdateStudentPayload,
  ApiMessageResponse,
} from '../../models/lesson-planner.models';

@Injectable({ providedIn: 'root' })
export class MockAdminCoachesService {
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
    return this.ctx.delayed({ message: 'مربی با موفقیت حذف شد' });
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
