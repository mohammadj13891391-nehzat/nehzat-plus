import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MockDataContext } from './mock-data-context';
import {
  Student,
  StudentProgressResponse,
  AssignmentSubmission,
  StudentAssignmentGateState,
  AssignmentProgressResponse,
  StudentProgressSummary,
  ApiMessageResponse,
} from '../../models/lesson-planner.models';

@Injectable({ providedIn: 'root' })
export class MockStudentProgressService {
  constructor(private ctx: MockDataContext) {}

  getMyStudents(): Observable<Student[]> {
    return this.ctx.delayed([...this.ctx.students]);
  }

  getStudentProgress(studentId: number): Observable<StudentProgressResponse> {
    const student = this.ctx.students.find((s) => s.id === studentId);
    if (!student) throw new Error('Student not found');

    const enrolledCourseIds = Array.from(this.ctx.courseEnrollments.entries())
      .filter(([, students]) => students.includes(studentId))
      .map(([courseId]) => courseId);

    const courses = this.ctx.courses
      .filter((c) => enrolledCourseIds.includes(c.id))
      .map((course) => ({
        course,
        assignments: this.ctx.assignments.filter((a) => a.courseId === course.id),
      }));

    const submissions = this.ctx.submissions.filter((s) => s.studentId === studentId);

    return this.ctx.delayed({
      student: {
        id: student.id,
        studentId: student.studentId,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        phoneNumber: student.phoneNumber,
      },
      courses,
      submissions,
    });
  }

  getStudentSubmissions(
    studentId: number,
    assignmentId?: number,
  ): Observable<AssignmentSubmission[]> {
    let result = this.ctx.submissions.filter((s) => s.studentId === studentId);
    if (assignmentId !== undefined) {
      result = result.filter((s) => s.assignmentId === assignmentId);
    }
    return this.ctx.delayed(result);
  }

  getAssignmentProgress(
    studentId: number,
    assignmentId: number,
  ): Observable<StudentAssignmentGateState> {
    const assignment = this.ctx.assignments.find((a) => a.id === assignmentId);
    const latest = this.ctx.submissions
      .filter((s) => s.studentId === studentId && s.assignmentId === assignmentId)
      .sort(
        (a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime(),
      )[0];

    return this.ctx.delayed({
      assignmentId,
      hasSubmission: !!latest,
      latestSubmission: latest ?? null,
      requiredListenCount: assignment?.requiredListenCount ?? 1,
      currentListenCount: assignment?.currentListenCount ?? 0,
      isRecordingUnlocked: assignment?.isRecordingUnlocked ?? true,
      instructionAudioVersion: assignment?.instructionAudioVersion,
      hasPlayableInstructionAudio: !!assignment?.primaryInstructionAudioUrl,
      primaryInstructionAudioUrl: assignment?.primaryInstructionAudioUrl,
    });
  }

  registerAssignmentListenCompletion(
    studentId: number,
    assignmentId: number,
    instructionAudioVersion?: string,
  ): Observable<StudentAssignmentGateState> {
    const assignment = this.ctx.assignments.find((a) => a.id === assignmentId);
    if (assignment) {
      assignment.currentListenCount = (assignment.currentListenCount ?? 0) + 1;
      if (assignment.currentListenCount >= (assignment.requiredListenCount ?? 1)) {
        assignment.isRecordingUnlocked = true;
      }
    }
    return this.getAssignmentProgress(studentId, assignmentId);
  }

  submitAssignment(
    studentId: number,
    assignmentId: number,
    payload: FormData,
  ): Observable<AssignmentSubmission> {
    const submission: AssignmentSubmission = {
      id: this.ctx.nextId(this.ctx.submissions),
      studentId,
      assignmentId,
      submissionDate: this.ctx.now(),
      status: 'submitted',
      audioFileUrl: (payload.get('fileUrl') as string) ?? '',
      notes: (payload.get('notes') as string) ?? '',
    };
    this.ctx.submissions.push(submission);
    return this.ctx.delayed(submission);
  }

  uploadSubmissionFile(
    studentId: number,
    submissionId: number,
    payload: FormData,
  ): Observable<AssignmentSubmission> {
    const submission = this.ctx.submissions.find((s) => s.id === submissionId);
    if (!submission) throw new Error('Submission not found');
    submission.audioFileUrl = URL.createObjectURL(payload.get('file') as File);
    return this.ctx.delayed(submission);
  }

  getProgressSummary(studentId: number): Observable<StudentProgressSummary> {
    const submissions = this.ctx.submissions.filter((s) => s.studentId === studentId);
    return this.ctx.delayed({
      studentId,
      summary: {
        totalObjectives: this.ctx.objectives.length,
        masteredCount: 0,
        achievedCount: submissions.length,
        inProgressCount: Math.max(0, this.ctx.objectives.length - submissions.length),
        notStartedCount: 0,
        averageScore: 0,
      },
      subjectAreas: this.ctx.subjectAreas.map((sa) => ({
        subjectAreaId: sa.id,
        subjectAreaTitle: sa.name,
        subjectAreaKey: sa.key,
        averageScore: 0,
        masteredCount: 0,
        totalObjectives: this.ctx.objectives.filter((o) => o.subjectAreaId === sa.id).length,
      })),
    });
  }

  syncFromSubmission(submissionId: number): Observable<ApiMessageResponse> {
    return this.ctx.delayed({ message: 'همگام‌سازی انجام شد' });
  }
}
