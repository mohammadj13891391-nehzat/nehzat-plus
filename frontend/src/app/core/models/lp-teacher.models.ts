import { AssignmentGrading, Course } from './lp-core.models';

export interface Teacher {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  specialization?: string;
  nationalCode?: string;
  branchId?: number;
  branchName?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  teacherCourses?: TeacherCourse[];
  gradedSubmissions?: AssignmentGrading[];
}

export interface TeacherCourse {
  id: number;
  teacherId: number;
  courseId: number;
  course?: Course;
  createdAt: string;
}

export interface CreateTeacherRequest {
  username: string;
  password?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  specialization?: string;
  nationalCode?: string;
  branchId?: number;
  assignedCourseIds?: number[];
}

export interface UpdateTeacherRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  specialization?: string;
  nationalCode?: string;
  status?: string;
  branchId?: number;
  assignedCourseIds?: number[];
}

export interface GradeSubmissionRequest {
  submissionId: number;
  teacherId: number;
  dailyScore?: number;
  cumulativeScore?: number;
  status?: string;
  feedback?: string;
}

export interface CreateTeacherPayload {
  username: string;
  password?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  specialization?: string;
  nationalCode?: string;
  branchId?: number;
  assignedCourseIds?: number[];
}

export interface UpdateTeacherPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  specialization?: string;
  nationalCode?: string;
  status?: string;
  branchId?: number;
  assignedCourseIds?: number[];
}

export interface GradeSubmissionPayload {
  submissionId: number;
  teacherId: number;
  dailyScore?: number;
  cumulativeScore?: number;
  status?: string;
  feedback?: string;
}

export interface TeacherDashboardSummary {
  totalCourses: number;
  totalStudents: number;
  pendingGradings: number;
  completedGradings: number;
  averageScore: number;
}



