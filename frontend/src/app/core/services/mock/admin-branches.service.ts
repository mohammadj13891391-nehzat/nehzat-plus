import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MockDataContext } from './mock-data-context';
import {
  Branch,
  BranchManager,
  BranchPerformance,
  Madrasah,
  MaktabBranch,
  CreateBranchPayload,
  UpdateBranchPayload,
  CreateBranchManagerPayload,
  CreateMadrasahPayload,
  UpdateMadrasahPayload,
  CreateMaktabBranchPayload,
  ApiMessageResponse,
} from '../../models/lesson-planner.models';

@Injectable({ providedIn: 'root' })
export class MockAdminBranchesService {
  constructor(private ctx: MockDataContext) {}

  getBranchManagers(): Observable<BranchManager[]> {
    return this.ctx.delayed([...this.ctx.branchManagers]);
  }

  getMyBranch(): Observable<Branch> {
    const branch = this.ctx.branches[0];
    return this.ctx.delayed(branch);
  }

  getMyBranchPerformance(): Observable<BranchPerformance> {
    const branch = this.ctx.branches[0];
    const students = this.ctx.students.filter((s) => s.branchId === branch?.id).length;
    const coaches = this.ctx.coaches.filter((c) => c.branchId === branch?.id).length;
    const perf: BranchPerformance = {
      branchId: branch?.id || 1,
      branchName: branch?.name || 'شعبه مرکزی',
      province: branch?.province || 'تهران',
      madrasahName: branch?.name || 'شعبه مرکزی',
      studentCount: students,
      averageScore: 85,
      attendanceRate: 0.92,
      activeCourses: 12,
      evaluationCount: 45,
      averageEvaluationScore: 88,
      status: students > 0 ? 'active' : 'inactive',
    };
    return this.ctx.delayed(perf);
  }

  createBranchManager(payload: CreateBranchManagerPayload): Observable<BranchManager> {
    const manager: BranchManager = {
      id: this.ctx.nextId(this.ctx.branchManagers),
      username: payload.username,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      branchId: payload.branchId ?? 0,
      gender: payload.gender,
      nationalCode: payload.nationalCode,
      status: 'active',
      createdAt: this.ctx.now(),
    };
    this.ctx.branchManagers.push(manager);
    return this.ctx.delayed(manager);
  }

  updateBranchManager(
    id: number,
    payload: Partial<CreateBranchManagerPayload>,
  ): Observable<BranchManager> {
    const manager = this.ctx.branchManagers.find((m) => m.id === id);
    if (!manager) throw new Error('Branch manager not found');
    Object.assign(manager, payload);
    return this.ctx.delayed(manager);
  }

  deleteBranchManager(id: number): Observable<ApiMessageResponse> {
    this.ctx.branchManagers = this.ctx.branchManagers.filter((m) => m.id !== id);
    return this.ctx.delayed({ message: 'مدیر شعبه با موفقیت حذف شد' });
  }

  getBranches(): Observable<Branch[]> {
    return this.ctx.delayed([...this.ctx.branches]);
  }

  createBranch(payload: CreateBranchPayload): Observable<Branch> {
    const branch: Branch = {
      id: this.ctx.nextId(this.ctx.branches),
      name: payload.name,
      province: payload.province,
      description: payload.description,
      createdAt: this.ctx.now(),
    };
    this.ctx.branches.push(branch);
    return this.ctx.delayed(branch);
  }

  updateBranch(id: number, payload: UpdateBranchPayload): Observable<Branch> {
    const branch = this.ctx.branches.find((b) => b.id === id);
    if (!branch) throw new Error('Branch not found');
    Object.assign(branch, payload);
    return this.ctx.delayed(branch);
  }

  deleteBranch(id: number): Observable<ApiMessageResponse> {
    this.ctx.branches = this.ctx.branches.filter((b) => b.id !== id);
    return this.ctx.delayed({ message: 'شعبه با موفقیت حذف شد' });
  }

  getMadrasahs(): Observable<Madrasah[]> {
    return this.ctx.delayed([...this.ctx.madrasahs]);
  }

  createMadrasah(payload: CreateMadrasahPayload): Observable<Madrasah> {
    const madrasah: Madrasah = {
      id: this.ctx.nextId(this.ctx.madrasahs),
      name: payload.name,
      key: payload.key,
      label: payload.label,
      level: payload.level,
      gender: payload.gender,
      grade: payload.grade,
      capacity: payload.capacity,
      managerId: payload.managerId,
      status: payload.status ?? 'active',
      createdAt: this.ctx.now(),
      updatedAt: this.ctx.now(),
    };
    this.ctx.madrasahs.push(madrasah);
    return this.ctx.delayed(madrasah);
  }

  updateMadrasah(id: number, payload: UpdateMadrasahPayload): Observable<Madrasah> {
    const madrasah = this.ctx.madrasahs.find((m) => m.id === id);
    if (!madrasah) throw new Error('Madrasah not found');
    Object.assign(madrasah, payload, { updatedAt: this.ctx.now() });
    return this.ctx.delayed(madrasah);
  }

  deleteMadrasah(id: number): Observable<ApiMessageResponse> {
    this.ctx.madrasahs = this.ctx.madrasahs.filter((m) => m.id !== id);
    return this.ctx.delayed({ message: 'مدرسه با موفقیت حذف شد' });
  }

  getMaktabBranches(madrasahId: number): Observable<MaktabBranch[]> {
    return this.ctx.delayed(this.ctx.maktabBranches.filter((m) => m.madrasahId === madrasahId));
  }

  createMaktabBranch(
    madrasahId: number,
    payload: CreateMaktabBranchPayload,
  ): Observable<MaktabBranch> {
    const branch: MaktabBranch = {
      id: this.ctx.nextId(this.ctx.maktabBranches),
      madrasahId,
      name: payload.name,
      province: payload.province,
      address: payload.address ?? '',
      capacity: payload.capacity ?? 0,
      status: payload.status ?? 'active',
      createdAt: this.ctx.now(),
      updatedAt: this.ctx.now(),
    };
    this.ctx.maktabBranches.push(branch);
    return this.ctx.delayed(branch);
  }

  deleteMaktabBranch(madrasahId: number, branchId: number): Observable<ApiMessageResponse> {
    this.ctx.maktabBranches = this.ctx.maktabBranches.filter(
      (m) => !(m.madrasahId === madrasahId && m.id === branchId),
    );
    return this.ctx.delayed({ message: 'شعبه مکتب حذف شد' });
  }
}
