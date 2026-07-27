import {
  Student, Branch, Course, Assignment, AssignmentAttachment,
  AssignmentSubmission, Coach, BranchManager, Parent, Evaluator,
  Madrasah, MaktabBranch, SubjectArea, TeachingMethod, Ring,
  RingStudent, CurriculumObjective, Book, RingBook,
  RingTeachingMethod, EvaluationRecord, Assessment, MonthlyBooklet,
  CurriculumVersion, StudentPathHistory, Teacher, TeacherCourse,
  AssignmentGrading, Competition, CompetitionParticipant, League,
  LeagueRanking, IssueSurvey, IssueSurveyQuestion, IssueItemPool,
  IssueSurveyResponse, IssueSurveyComment, IssueAction, IssueActionUpdate,
  StudentSkillProgress, AgeGroup, SpiritualPracticeItem, SpiritualOccasion,
  SpiritualPath, DailySpiritualEntry, UserOccasionProgress,
  StudentPathSelection, ServiceSurvey, ServiceSurveyQuestion,
  ServiceSurveyResponse, ServiceDashboardSummary
} from '../models/lesson-planner.models';
import { UserType } from '../models/lesson-planner.models';

interface MockUser {
  id: number;
  username: string;
  password: string;
  userType: UserType;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  imageUrl?: string;
  studentId?: number;
  branchId?: number;
}

export const mockUsers: MockUser[] = [
  { id: 1, username: 'test', password: 'password', userType: 'manager' as UserType, approvalStatus: 'approved' as const, firstName: 'مدیر', lastName: 'سیستم', email: 'admin@example.com', phoneNumber: '09120000000' },
  { id: 2, username: 'ali.ahmadi', password: 'password123', userType: 'trainee' as UserType, approvalStatus: 'approved' as const, firstName: 'علی', lastName: 'احمدی', email: 'ali@example.com', phoneNumber: '09121111111', studentId: 1 },
  { id: 3, username: 'fateme.mohammadi', password: 'password123', userType: 'trainee' as UserType, approvalStatus: 'approved' as const, firstName: 'فاطمه', lastName: 'محمدی', email: 'fateme@example.com', phoneNumber: '09122222222', studentId: 2 },
  { id: 4, username: 'mohammad.rezaei', password: 'password123', userType: 'trainee' as UserType, approvalStatus: 'approved' as const, firstName: 'محمد', lastName: 'رضایی', email: 'mohammad@example.com', phoneNumber: '09123333333', studentId: 3 },
];

export const mockStudents: Student[] = [
  { id: 1, username: 'ali.ahmadi', studentId: 'STD-001', firstName: 'علی', lastName: 'احمدی', email: 'ali@example.com', phoneNumber: '09121111111', status: 'active', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 2, username: 'fateme.mohammadi', studentId: 'STD-002', firstName: 'فاطمه', lastName: 'محمدی', email: 'fateme@example.com', phoneNumber: '09122222222', status: 'active', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 3, username: 'mohammad.rezaei', studentId: 'STD-003', firstName: 'محمد', lastName: 'رضایی', email: 'mohammad@example.com', phoneNumber: '09123333333', status: 'active', createdAt: '2026-01-01T00:00:00.000Z' },
];

export const mockBranches: Branch[] = [
  { id: 1, name: 'شعبه مرکزی', province: 'تهران', description: 'شعبه اصلی و مرکزی', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 2, name: 'شعبه شرق تهران', province: 'تهران', description: 'شعبه منطقه شرق تهران', createdAt: '2026-01-15T00:00:00.000Z' },
  { id: 3, name: 'شعبه غرب تهران', province: 'تهران', description: 'شعبه منطقه غرب تهران', createdAt: '2026-02-01T00:00:00.000Z' },
  { id: 4, name: 'شعبه اصفهان', province: 'اصفهان', description: 'شعبه استان اصفهان', createdAt: '2026-03-01T00:00:00.000Z' },
  { id: 5, name: 'شعبه مشهد', province: 'خراسان رضوی', description: 'شعبه استان خراسان رضوی', createdAt: '2026-03-15T00:00:00.000Z' },
];

export const mockCourses: Course[] = [
  { id: 1, title: 'قرآن و معارف اسلامی', description: 'دوره آموزش قرآن کریم و معارف اسلامی', courseCode: 'QUR-101', credits: 3, instructor: 'استاد محمدی', status: 'active', startDate: '2026-01-01', endDate: '2026-06-01', maxStudents: 30, createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 2, title: 'آموزش تجوید', description: 'دوره تخصصی تجوید قرآن کریم', courseCode: 'TJT-201', credits: 2, instructor: 'استاد رضایی', status: 'active', startDate: '2026-01-01', endDate: '2026-06-01', maxStudents: 20, createdAt: '2026-01-01T00:00:00.000Z' },
];

export const mockCourseEnrollments = new Map<number, number[]>([[1, [1, 2, 3]], [2, [1, 2]]]);
export const mockInviteCodes = new Map<number, any>();
