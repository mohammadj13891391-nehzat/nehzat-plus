import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MockDataContext } from './mock-data-context';
import {
  HeadquartersSummary,
  BranchPerformance,
  CoachPerformance,
} from '../../models/lesson-planner.models';

@Injectable({ providedIn: 'root' })
export class MockHeadquartersService {
  constructor(private ctx: MockDataContext) {}

  getHeadquartersSummary(): Observable<HeadquartersSummary> {
    return this.ctx.delayed({
      totalStudents: this.ctx.students.length,
      totalCoaches: this.ctx.coaches.length,
      totalBranchManagers: this.ctx.branchManagers.length,
      totalEvaluators: this.ctx.evaluators.length,
      totalParents: this.ctx.parents.length,
      totalCourses: this.ctx.courses.length,
      activeCourses: this.ctx.courses.filter((c) => c.status === 'active').length,
      totalAssignments: this.ctx.assignments.length,
      totalSubmissions: this.ctx.submissions.length,
      totalMadrasahs: this.ctx.madrasahs.length,
      totalBranches: this.ctx.branches.length,
      averageScore: 0,
      averageAttendanceRate: 0,
      lastUpdated: this.ctx.now(),
    });
  }

  getBranchPerformance(): Observable<BranchPerformance[]> {
    return this.ctx.delayed(
      this.ctx.branches.map((b) => ({
        branchId: b.id,
        branchName: b.name,
        province: b.province,
        madrasahName: b.name,
        studentCount: this.ctx.students.filter((s) => s.branchId === b.id).length,
        averageScore: 0,
        attendanceRate: 0,
        activeCourses: this.ctx.courses.filter((c) => c.status === 'active').length,
        evaluationCount: this.ctx.evaluations.filter(
          (e) => e.targetType === 'branch' && e.targetId === b.id,
        ).length,
        averageEvaluationScore: 0,
        status: 'active',
      })),
    );
  }

  getCoachPerformance(): Observable<CoachPerformance[]> {
    return this.ctx.delayed(
      this.ctx.coaches.map((c) => ({
        coachId: c.id,
        coachName: `${c.firstName} ${c.lastName}`,
        specialization: c.specialization,
        assignedCourseCount: c.assignedCourseIds.length,
        studentCount: this.ctx.students.filter((s) => s.branchId === c.branchId).length,
        averageStudentScore: 0,
        evaluationCount: this.ctx.evaluations.filter(
          (e) => e.targetType === 'coach' && e.targetId === c.id,
        ).length,
        averageEvaluationScore: 0,
        status: c.status,
      })),
    );
  }

  getMyCoachPerformance(): Observable<CoachPerformance[]> {
    return this.ctx.delayed(
      this.ctx.coaches.map((c) => ({
        coachId: c.id,
        coachName: `${c.firstName} ${c.lastName}`,
        specialization: c.specialization,
        assignedCourseCount: c.assignedCourseIds.length,
        studentCount: this.ctx.students.filter((s) => s.branchId === c.branchId).length,
        averageStudentScore: 0,
        evaluationCount: 0,
        averageEvaluationScore: 0,
        status: c.status,
      })),
    );
  }
}
