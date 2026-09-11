import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MockDataContext } from './mock-data-context';
import {
  Accommodation,
  AgeGroup,
  ApiMessageResponse,
  CoachBranchProgressDto,
  CoachStudentProgressDto,
  CompleteStepRequest,
  CreateAccommodationRequest,
  CreateStudyPathRequest,
  CreateStudyPathStepRequest,
  EnrollRequest,
  ReorderStepsRequest,
  SkipStepRequest,
  StudentOverallProgressDto,
  StudentStudyPath,
  StudyPath,
  StudyPathProgressAnalyticsDto,
  StudyPathStep,
  SubjectArea,
  UpdateStudyPathRequest,
  UpdateStudyPathStepRequest,
} from '../../models/lesson-planner.models';

@Injectable({ providedIn: 'root' })
export class MockStudyPathService {
  constructor(private ctx: MockDataContext) {}

  // Admin: Study Paths CRUD
  getStudyPaths(): Observable<StudyPath[]> {
    return this.ctx.delayed(this.mapStudyPaths(this.ctx.studyPaths));
  }

  getStudyPath(id: number): Observable<StudyPath> {
    const path = this.ctx.studyPaths.find((p) => p.id === id);
    if (!path) throw new Error('Study path not found');
    return this.ctx.delayed(this.mapStudyPath(path));
  }

  createStudyPath(payload: CreateStudyPathRequest): Observable<StudyPath> {
    const id = this.ctx.nextId(this.ctx.studyPaths);
    const path: any = {
      id,
      key: payload.key,
      title: payload.title,
      description: payload.description,
      ageGroupId: payload.ageGroupId,
      subjectAreaId: payload.subjectAreaId,
      cognitiveLevel: payload.cognitiveLevel ?? 'awareness',
      isActive: payload.isActive ?? true,
      sortOrder: payload.sortOrder ?? 0,
      createdAt: this.ctx.now(),
      updatedAt: this.ctx.now(),
    };
    this.ctx.studyPaths.push(path);

    if (payload.steps?.length) {
      payload.steps.forEach((s) => {
        const stepId = this.ctx.nextId(this.ctx.studyPathSteps);
        this.ctx.studyPathSteps.push({
          id: stepId,
          studyPathId: id,
          stepOrder: s.stepOrder,
          title: s.title,
          description: s.description,
          cognitiveLevel: s.cognitiveLevel ?? 'awareness',
          estimatedDurationMinutes: s.estimatedDurationMinutes ?? 15,
          prerequisitesJson: s.prerequisitesJson,
          contentUrl: s.contentUrl,
          resourceId: s.resourceId,
          assessmentId: s.assessmentId,
          createdAt: this.ctx.now(),
          updatedAt: this.ctx.now(),
        });
      });
    }

    if (payload.accommodationIds?.length) {
      payload.accommodationIds.forEach((aid) => {
        const linkId = this.ctx.nextId(this.ctx.studyPathAccommodations);
        this.ctx.studyPathAccommodations.push({
          id: linkId,
          studyPathId: id,
          accommodationId: aid,
        });
      });
    }

    return this.getStudyPath(id);
  }

  updateStudyPath(id: number, payload: UpdateStudyPathRequest): Observable<StudyPath> {
    const path = this.ctx.studyPaths.find((p) => p.id === id);
    if (!path) throw new Error('Study path not found');
    if (payload.key !== undefined) path.key = payload.key;
    if (payload.title !== undefined) path.title = payload.title;
    if (payload.description !== undefined) path.description = payload.description;
    if (payload.ageGroupId !== undefined) path.ageGroupId = payload.ageGroupId;
    if (payload.subjectAreaId !== undefined) path.subjectAreaId = payload.subjectAreaId;
    if (payload.cognitiveLevel !== undefined) path.cognitiveLevel = payload.cognitiveLevel;
    if (payload.isActive !== undefined) path.isActive = payload.isActive;
    if (payload.sortOrder !== undefined) path.sortOrder = payload.sortOrder;
    path.updatedAt = this.ctx.now();

    if (payload.accommodationIds !== undefined) {
      this.ctx.studyPathAccommodations = this.ctx.studyPathAccommodations.filter(
        (l) => l.studyPathId !== id,
      );
      payload.accommodationIds.forEach((aid) => {
        const linkId = this.ctx.nextId(this.ctx.studyPathAccommodations);
        this.ctx.studyPathAccommodations.push({
          id: linkId,
          studyPathId: id,
          accommodationId: aid,
        });
      });
    }

    return this.getStudyPath(id);
  }

  deleteStudyPath(id: number): Observable<ApiMessageResponse> {
    const idx = this.ctx.studyPaths.findIndex((p) => p.id === id);
    if (idx < 0) throw new Error('Study path not found');
    this.ctx.studyPaths.splice(idx, 1);
    this.ctx.studyPathSteps = this.ctx.studyPathSteps.filter((s) => s.studyPathId !== id);
    this.ctx.studyPathAccommodations = this.ctx.studyPathAccommodations.filter(
      (l) => l.studyPathId !== id,
    );
    return this.ctx.delayed({ message: 'مسیر مطالعاتی حذف شد.' });
  }

  // Admin: Steps CRUD
  addStep(studyPathId: number, payload: CreateStudyPathStepRequest): Observable<StudyPathStep> {
    const path = this.ctx.studyPaths.find((p) => p.id === studyPathId);
    if (!path) throw new Error('Study path not found');
    const stepId = this.ctx.nextId(this.ctx.studyPathSteps);
    this.ctx.studyPathSteps.push({
      id: stepId,
      studyPathId,
      stepOrder: payload.stepOrder,
      title: payload.title,
      description: payload.description,
      cognitiveLevel: payload.cognitiveLevel ?? 'awareness',
      estimatedDurationMinutes: payload.estimatedDurationMinutes ?? 15,
      prerequisitesJson: payload.prerequisitesJson,
      contentUrl: payload.contentUrl,
      resourceId: payload.resourceId,
      assessmentId: payload.assessmentId,
      createdAt: this.ctx.now(),
      updatedAt: this.ctx.now(),
    });
    return this.ctx.delayed(this.mapStep(this.ctx.studyPathSteps.find((s) => s.id === stepId)!));
  }

  updateStep(stepId: number, payload: UpdateStudyPathStepRequest): Observable<StudyPathStep> {
    const step = this.ctx.studyPathSteps.find((s) => s.id === stepId);
    if (!step) throw new Error('Step not found');
    if (payload.stepOrder !== undefined) step.stepOrder = payload.stepOrder;
    if (payload.title !== undefined) step.title = payload.title;
    if (payload.description !== undefined) step.description = payload.description;
    if (payload.cognitiveLevel !== undefined) step.cognitiveLevel = payload.cognitiveLevel;
    if (payload.estimatedDurationMinutes !== undefined)
      step.estimatedDurationMinutes = payload.estimatedDurationMinutes;
    if (payload.prerequisitesJson !== undefined) step.prerequisitesJson = payload.prerequisitesJson;
    if (payload.contentUrl !== undefined) step.contentUrl = payload.contentUrl;
    if (payload.resourceId !== undefined) step.resourceId = payload.resourceId;
    if (payload.assessmentId !== undefined) step.assessmentId = payload.assessmentId;
    return this.ctx.delayed(this.mapStep(step));
  }

  deleteStep(stepId: number): Observable<ApiMessageResponse> {
    const idx = this.ctx.studyPathSteps.findIndex((s) => s.id === stepId);
    if (idx < 0) throw new Error('Step not found');
    this.ctx.studyPathSteps.splice(idx, 1);
    return this.ctx.delayed({ message: 'مرحله حذف شد.' });
  }

  reorderSteps(studyPathId: number, payload: ReorderStepsRequest): Observable<ApiMessageResponse> {
    const path = this.ctx.studyPaths.find((p) => p.id === studyPathId);
    if (!path) throw new Error('Study path not found');
    const steps = this.ctx.studyPathSteps
      .filter((s) => s.studyPathId === studyPathId)
      .sort((a, b) => a.stepOrder - b.stepOrder);
    steps.forEach((s) => {
      const newOrder = payload.stepIds.indexOf(s.id);
      if (newOrder >= 0) s.stepOrder = newOrder;
    });
    return this.ctx.delayed({ message: 'مراحل مرتب شدند.' });
  }

  // Admin: Accommodations
  getAccommodations(): Observable<Accommodation[]> {
    return this.ctx.delayed([...this.ctx.accommodations]);
  }

  createAccommodation(payload: CreateAccommodationRequest): Observable<Accommodation> {
    const id = this.ctx.nextId(this.ctx.accommodations);
    const acc: Accommodation = {
      id,
      code: payload.code,
      name: payload.name,
      description: payload.description,
      icon: payload.icon,
      createdAt: this.ctx.now(),
    };
    this.ctx.accommodations.push(acc);
    return this.ctx.delayed(acc);
  }

  // Admin: Lookup data
  getStudyPathAgeGroups(): Observable<AgeGroup[]> {
    return this.ctx.delayed([...this.ctx.ageGroups]);
  }

  getStudyPathSubjectAreas(): Observable<SubjectArea[]> {
    return this.ctx.delayed([...this.ctx.subjectAreas]);
  }

  // Student: Enroll + Progress
  getAvailableStudyPaths(): Observable<StudyPath[]> {
    return this.ctx.delayed(this.mapStudyPaths(this.ctx.studyPaths.filter((p) => p.isActive)));
  }

  enroll(payload: EnrollRequest): Observable<StudentStudyPath> {
    const path = this.ctx.studyPaths.find((p) => p.id === payload.studyPathId);
    if (!path) throw new Error('Study path not found');
    const username = this.ctx.currentUsername ?? '';
    const student = this.ctx.students.find((s) => (s as any).username === username);
    if (!student) throw new Error('Student not found');
    const existing = this.ctx.studentStudyPaths.find(
      (e) => e.studentId === student.id && e.studyPathId === payload.studyPathId,
    );
    if (existing) throw new Error('Already enrolled');

    const enrollmentId = this.ctx.nextId(this.ctx.studentStudyPaths);
    const steps = this.ctx.studyPathSteps
      .filter((s) => s.studyPathId === payload.studyPathId)
      .sort((a, b) => a.stepOrder - b.stepOrder);
    const currentStepId = steps.length > 0 ? steps[0]?.id : undefined;

    this.ctx.studentStudyPaths.push({
      id: enrollmentId,
      studentId: student.id,
      studyPathId: payload.studyPathId,
      enrollmentDate: this.ctx.now(),
      currentStepId,
      status: 'active',
      progressPercentage: 0,
      startedAt: this.ctx.now(),
      completedAt: undefined,
      createdAt: this.ctx.now(),
      updatedAt: this.ctx.now(),
    });

    return this.getMyStudyPath(enrollmentId);
  }

  getMyStudyPaths(): Observable<StudentStudyPath[]> {
    const username = this.ctx.currentUsername ?? '';
    const student = this.ctx.students.find((s) => (s as any).username === username);
    if (!student) return this.ctx.delayed([]);
    const enrollments = this.ctx.studentStudyPaths.filter((e) => e.studentId === student.id);
    return this.ctx.delayed(enrollments.map(this.mapEnrollment.bind(this)));
  }

  getMyStudyPath(enrollmentId: number): Observable<StudentStudyPath> {
    const enrollment = this.ctx.studentStudyPaths.find((e) => e.id === enrollmentId);
    if (!enrollment) throw new Error('Enrollment not found');
    return this.ctx.delayed(this.mapEnrollment(enrollment));
  }

  completeStep(payload: CompleteStepRequest): Observable<StudentStudyPath> {
    const username = this.ctx.currentUsername ?? '';
    const student = this.ctx.students.find((s) => (s as any).username === username);
    if (!student) throw new Error('Student not found');
    const enrollment = this.ctx.studentStudyPaths.find(
      (e) => e.studentId === student.id && e.studyPathId === payload.studyPathId,
    );
    if (!enrollment) throw new Error('Not enrolled');

    const steps = this.ctx.studyPathSteps
      .filter((s) => s.studyPathId === payload.studyPathId)
      .sort((a, b) => a.stepOrder - b.stepOrder);
    const idx = steps.findIndex((s) => s.id === payload.stepId);
    if (idx < 0) throw new Error('Step not found');

    const completedSteps = idx + 1;
    enrollment.progressPercentage = steps.length > 0
      ? Math.round((completedSteps / steps.length) * 100)
      : 0;
    const nextStep = steps[idx + 1];
    enrollment.currentStepId = nextStep ? nextStep.id : undefined;
    if (enrollment.progressPercentage >= 100) {
      enrollment.status = 'completed';
      enrollment.completedAt = this.ctx.now();
    }

    return this.ctx.delayed(this.mapEnrollment(enrollment));
  }

  skipStep(payload: SkipStepRequest): Observable<StudentStudyPath> {
    const username = this.ctx.currentUsername ?? '';
    const student = this.ctx.students.find((s) => (s as any).username === username);
    if (!student) throw new Error('Student not found');
    const enrollment = this.ctx.studentStudyPaths.find(
      (e) => e.studentId === student.id && e.studyPathId === payload.studyPathId,
    );
    if (!enrollment) throw new Error('Not enrolled');

    const steps = this.ctx.studyPathSteps
      .filter((s) => s.studyPathId === payload.studyPathId)
      .sort((a, b) => a.stepOrder - b.stepOrder);
    const idx = steps.findIndex((s) => s.id === payload.stepId);
    if (idx < 0) throw new Error('Step not found');

    const completedSteps = idx + 1;
    enrollment.progressPercentage = steps.length > 0
      ? Math.round((completedSteps / steps.length) * 100)
      : 0;
    const nextStep = steps[idx + 1];
    enrollment.currentStepId = nextStep ? nextStep.id : undefined;

    return this.ctx.delayed(this.mapEnrollment(enrollment));
  }

  // Analytics
  getStudyPathAnalytics(enrollmentId: number): Observable<StudyPathProgressAnalyticsDto> {
    const enrollment = this.ctx.studentStudyPaths.find((e) => e.id === enrollmentId);
    if (!enrollment) throw new Error('Enrollment not found');

    const path = this.ctx.studyPaths.find((p) => p.id === enrollment.studyPathId);
    const steps = path
      ? this.ctx.studyPathSteps
          .filter((s) => s.studyPathId === enrollment.studyPathId)
          .sort((a, b) => a.stepOrder - b.stepOrder)
          .map(this.mapStep.bind(this))
      : [];

    let currentStepIndex = enrollment.currentStepId
      ? steps.findIndex((s) => s.id === enrollment.currentStepId)
      : steps.length;
    if (enrollment.status === 'completed') currentStepIndex = steps.length - 1;

    const completedStepsCount = enrollment.status === 'completed'
      ? steps.length
      : Math.max(0, currentStepIndex);

    const stepAnalytics = steps.map(s => {
      const completedIdx = enrollment.currentStepId ? steps.findIndex(st => st.id === enrollment.currentStepId) : -1;
      const isCompleted = enrollment.status === 'completed' || (completedIdx >= 0 && completedIdx > steps.findIndex(st => st.id === s.id));
      return {
        stepId: s.id,
        stepOrder: s.stepOrder,
        title: s.title,
        cognitiveLevel: s.cognitiveLevel,
        estimatedDurationMinutes: s.estimatedDurationMinutes,
        actualDurationMinutes: undefined,
        isCompleted,
        isSkipped: false,
        isCurrent: enrollment.currentStepId === s.id,
        completedAt: enrollment.status === 'completed' ? enrollment.completedAt : undefined,
      };
    });

    const estimatedTimeRemaining = steps
      .filter(s => !stepAnalytics.some(sa => sa.stepId === s.id && sa.isCompleted))
      .reduce((sum, s) => sum + s.estimatedDurationMinutes, 0);

    const totalEstimated = steps.reduce((sum, s) => sum + s.estimatedDurationMinutes, 0);
    const avgTimePerStep = steps.length > 0 ? totalEstimated / steps.length : 0;

    return this.ctx.delayed({
      enrollmentId: enrollment.id,
      studyPathTitle: path?.title ?? '',
      totalSteps: steps.length,
      completedSteps: completedStepsCount,
      skippedSteps: 0,
      currentStepIndex: currentStepIndex + 1,
      progressPercentage: enrollment.progressPercentage ?? 0,
      status: enrollment.status ?? 'active',
      enrollmentDate: enrollment.enrollmentDate ?? this.ctx.now(),
      startedAt: enrollment.startedAt,
      completedAt: enrollment.completedAt,
      steps: stepAnalytics,
      estimatedTimeRemaining: `${Math.floor(estimatedTimeRemaining / 60)}h ${estimatedTimeRemaining % 60}m`,
      averageTimePerStepMinutes: Math.round(avgTimePerStep * 10) / 10,
    });
  }

  getMyOverallProgress(): Observable<StudentOverallProgressDto> {
    const username = this.ctx.currentUsername ?? '';
    const student = this.ctx.students.find((s) => (s as any).username === username);
    if (!student) throw new Error('Student not found');

    const enrollments = this.ctx.studentStudyPaths
      .filter((e) => e.studentId === student.id)
      .map(this.mapEnrollment.bind(this));

    const summaries = enrollments.map(e => ({
      enrollmentId: e.id,
      studyPathId: e.studyPathId,
      studyPathTitle: e.studyPathTitle ?? '',
      subjectAreaName: this.ctx.studyPaths.find(p => p.id === e.studyPathId)?.subjectAreaName ?? '',
      progressPercentage: e.progressPercentage,
      status: e.status,
      enrollmentDate: e.enrollmentDate,
      completedAt: e.completedAt,
    }));

    const activeCount = summaries.filter(s => s.status === 'active').length;
    const completedCount = summaries.filter(s => s.status === 'completed').length;
    const avgProgress = summaries.length > 0 ? summaries.reduce((sum, s) => sum + s.progressPercentage, 0) / summaries.length : 0;

    return this.ctx.delayed({
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`.trim(),
      totalEnrollments: summaries.length,
      activeEnrollments: activeCount,
      completedEnrollments: completedCount,
      averageProgressPercentage: Math.round(avgProgress * 10) / 10,
      enrollments: summaries,
    });
  }

  getCoachStudentsProgress(branchId: number): Observable<CoachStudentProgressDto[]> {
    const students = this.ctx.students.filter((s) => s.branchId === branchId);
    const branch = this.ctx.branches.find(b => b.id === branchId);

    const result = students.map(student => {
      const enrollments = this.ctx.studentStudyPaths
        .filter((e) => e.studentId === student.id)
        .map(this.mapEnrollment.bind(this));

      const summaries = enrollments.map(e => ({
        enrollmentId: e.id,
        studyPathId: e.studyPathId,
        studyPathTitle: e.studyPathTitle ?? '',
        subjectAreaName: this.ctx.studyPaths.find(p => p.id === e.studyPathId)?.subjectAreaName ?? '',
        progressPercentage: e.progressPercentage,
        status: e.status,
        enrollmentDate: e.enrollmentDate,
        completedAt: e.completedAt,
      }));

      const activeCount = summaries.filter(s => s.status === 'active').length;
      const completedCount = summaries.filter(s => s.status === 'completed').length;
      const avgProgress = summaries.length > 0 ? summaries.reduce((sum, s) => sum + s.progressPercentage, 0) / summaries.length : 0;

      return {
        studentId: student.id,
        studentName: `${student.firstName} ${student.lastName}`.trim(),
        branchId,
        branchName: branch?.name ?? '',
        enrollments: summaries,
        totalEnrollments: summaries.length,
        activeEnrollments: activeCount,
        completedEnrollments: completedCount,
        averageProgressPercentage: Math.round(avgProgress * 10) / 10,
      };
    });

    return this.ctx.delayed(result);
  }

  getCoachBranchProgress(branchId: number): Observable<CoachBranchProgressDto> {
    const branch = this.ctx.branches.find(b => b.id === branchId);
    if (!branch) throw new Error('Branch not found');

    const students = this.ctx.students.filter((s) => s.branchId === branchId);
    const studentsProgress = students.map(student => {
      const enrollments = this.ctx.studentStudyPaths
        .filter((e) => e.studentId === student.id)
        .map(this.mapEnrollment.bind(this));

      const summaries = enrollments.map(e => ({
        enrollmentId: e.id,
        studyPathId: e.studyPathId,
        studyPathTitle: e.studyPathTitle ?? '',
        subjectAreaName: this.ctx.studyPaths.find(p => p.id === e.studyPathId)?.subjectAreaName ?? '',
        progressPercentage: e.progressPercentage,
        status: e.status,
        enrollmentDate: e.enrollmentDate,
        completedAt: e.completedAt,
      }));

      const activeCount = summaries.filter(s => s.status === 'active').length;
      const completedCount = summaries.filter(s => s.status === 'completed').length;
      const avgProgress = summaries.length > 0 ? summaries.reduce((sum, s) => sum + s.progressPercentage, 0) / summaries.length : 0;

      return {
        studentId: student.id,
        studentName: `${student.firstName} ${student.lastName}`.trim(),
        branchId,
        branchName: branch.name,
        enrollments: summaries,
        totalEnrollments: summaries.length,
        activeEnrollments: activeCount,
        completedEnrollments: completedCount,
        averageProgressPercentage: Math.round(avgProgress * 10) / 10,
      };
    });

    const totalStudents = students.length;
    const studentsWithEnrollments = studentsProgress.filter(s => s.totalEnrollments > 0).length;
    const totalEnrollments = studentsProgress.reduce((sum, s) => sum + s.totalEnrollments, 0);
    const activeEnrollments = studentsProgress.reduce((sum, s) => sum + s.activeEnrollments, 0);
    const completedEnrollments = studentsProgress.reduce((sum, s) => sum + s.completedEnrollments, 0);
    const avgProgress = studentsWithEnrollments > 0
      ? studentsProgress.filter(s => s.totalEnrollments > 0).reduce((sum, s) => sum + s.averageProgressPercentage, 0) / studentsWithEnrollments
      : 0;

    return this.ctx.delayed({
      branchId,
      branchName: branch.name,
      totalStudents,
      studentsWithEnrollments,
      totalEnrollments,
      activeEnrollments,
      completedEnrollments,
      averageProgressPercentage: Math.round(avgProgress * 10) / 10,
      students: studentsProgress,
    });
  }

  private mapStudyPaths(paths: any[]): StudyPath[] {
    return paths.map(this.mapStudyPath.bind(this));
  }

  private mapStudyPath(path: any): StudyPath {
    const steps = this.ctx.studyPathSteps
      .filter((s) => s.studyPathId === path.id)
      .sort((a, b) => a.stepOrder - b.stepOrder)
      .map(this.mapStep.bind(this));

    const accommodations = (path.studyPathAccommodations ?? [])
      .map((pa: any) => {
        const acc = pa.accommodation ?? this.ctx.accommodations.find((a) => a.id === pa.accommodationId);
        return {
          id: acc?.id ?? 0,
          code: acc?.code ?? '',
          name: acc?.name ?? '',
          description: acc?.description,
          icon: acc?.icon,
          createdAt: acc?.createdAt ?? this.ctx.now(),
        };
      });

    return {
      id: path.id,
      key: path.key,
      title: path.title,
      description: path.description,
      ageGroupId: path.ageGroupId,
      ageGroupName: this.ctx.ageGroups.find((g) => g.id === path.ageGroupId)?.name ?? '',
      subjectAreaId: path.subjectAreaId,
      subjectAreaName: this.ctx.subjectAreas.find((s) => s.id === path.subjectAreaId)?.name ?? '',
      cognitiveLevel: path.cognitiveLevel ?? 'awareness',
      isActive: path.isActive,
      sortOrder: path.sortOrder,
      accommodations,
      steps,
      createdAt: path.createdAt ?? this.ctx.now(),
      updatedAt: path.updatedAt ?? this.ctx.now(),
    };
  }

  private mapStep(step: any): StudyPathStep {
    const assessment = step.assessmentId
      ? this.ctx.assessments.find((a) => a.id === step.assessmentId)
      : undefined;
    return {
      id: step.id,
      studyPathId: step.studyPathId,
      stepOrder: step.stepOrder,
      title: step.title,
      description: step.description,
      cognitiveLevel: step.cognitiveLevel ?? 'awareness',
      estimatedDurationMinutes: step.estimatedDurationMinutes ?? 15,
      prerequisitesJson: step.prerequisitesJson,
      contentUrl: step.contentUrl,
      resourceId: step.resourceId,
      assessmentId: step.assessmentId,
      assessmentTitle: assessment?.title,
      createdAt: step.createdAt ?? this.ctx.now(),
      updatedAt: step.updatedAt ?? this.ctx.now(),
    };
  }

  private mapEnrollment(e: any): StudentStudyPath {
    const path = this.ctx.studyPaths.find((p) => p.id === e.studyPathId);
    const steps = path
      ? this.ctx.studyPathSteps
          .filter((s) => s.studyPathId === e.studyPathId)
          .sort((a, b) => a.stepOrder - b.stepOrder)
          .map(this.mapStep.bind(this))
      : [];
    const currentStep = e.currentStepId
      ? steps.find((s) => s.id === e.currentStepId)
      : undefined;
    const completedStepsCount = e.currentStepId
      ? steps.findIndex((s) => s.id === e.currentStepId)
      : steps.length;

    return {
      id: e.id,
      studentId: e.studentId,
      studyPathId: e.studyPathId,
      studyPathTitle: path?.title ?? '',
      enrollmentDate: e.enrollmentDate ?? this.ctx.now(),
      currentStepId: e.currentStepId,
      currentStep,
      status: e.status ?? 'active',
      progressPercentage: e.progressPercentage ?? 0,
      startedAt: e.startedAt,
      completedAt: e.completedAt,
      createdAt: e.createdAt ?? this.ctx.now(),
      updatedAt: e.updatedAt ?? this.ctx.now(),
      steps,
      completedStepsCount,
    };
  }
}
