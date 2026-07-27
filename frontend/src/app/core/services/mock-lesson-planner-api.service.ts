import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { LessonPlannerApi } from './lesson-planner-api.interface';
import { base64UrlEncode, createDummyToken, nextId } from './mock-lesson-planner-helpers';
import { mockUsers, mockStudents, mockBranches, mockCourses, mockCourseEnrollments, mockInviteCodes } from './mock-lesson-planner-data';
import { seedSurveyData } from './mock-lesson-planner-seed';
import {
  AdminCourseStatistics,
  AdminSystemStatistics,
  AgeGroup,
  ApiMessageResponse,
  ApproveUserPayload,
  Assessment,
  AssessmentAnalytics,
  AssessmentQuestion,
  AssessmentQuestionPayload,
  AssessmentResult,
  Assignment,
  AssignmentAttachment,
  AssignmentProgressItem,
  AssignmentProgressResponse,
  AssignmentSubmission,
  AttachmentKind,
  AuthSigninPayload,
  AuthSigninResponse,
  AuthSignupPayload,
  AuthSignupResponse,
  BiweeklyProgressResponse,
  Book,
  Branch,
  BranchManager,
  Coach,
  Course,
  CourseEnrollment,
  CourseInviteCode,
  CreatedUser,
  CreateAssignmentPayload,
  CreateBookPayload,
  CreateBranchManagerPayload,
  CreateBranchPayload,
  UpdateBranchPayload,
  CreateCoachPayload,
  CreateCoursePayload,
  CreateCurriculumVersionPayload,
  CreateDailySeriesPayload,
  CreateEvaluationPayload,
  CreateEvaluatorPayload,
  CreateMadrasahPayload,
  CreateMaktabBranchPayload,
  CreateMonthlyBookletPayload,
  CreateParentPayload,
  CreateRingPayload,
  CreateRingBookPayload,
  CreateRingStudentPayload,
  CreateRingTeachingMethodPayload,
  CreateStudentPayload,
  CreateSubjectAreaPayload,
  CreateTeachingMethodPayload,
  CreateCurriculumObjectivePayload,
  CreateUserPayload,
  CurriculumObjective,
  CurriculumVersion,
  EvaluationRecord,
  Evaluator,
  GenerateWeeklyAssessmentPayload,
  HeadquartersSummary,
  BranchPerformance,
  CoachPerformance,
  Madrasah,
  MadrasahGender,
  MadrasahGrade,
  MadrasahStatus,
  MaktabBranch,
  MonthlyBooklet,
  Parent,
  ParentStudentInfo,
  PendingUser,
  ProgressionResult,
  Ring,
  RingBook,
  RingStudent,
  RingTeachingMethod,
  Student,
  StudentAssessmentHistory,
  StudentInfo,
  StudentPathHistory,
  StudentProgressResponse,
  StudentProgressSummary,
  StudentSkillProgress,
  ProgressSummary,
  SubjectAreaProgress,
  SubjectArea,
  RingDashboardDto,
  RingStudentProgressDto,
  SubmitAssessmentResultPayload,
  TeachingMethod,
  UpdateMadrasahPayload,
  UpdateStudentPayload,
  UpdateSubjectAreaPayload,
  UpdateTeachingMethodPayload,
  UpdateCurriculumVersionPayload,
  UpdateMonthlyBookletPayload,
  UpdateCurriculumObjectivePayload,
  UpdateBookPayload,
  UpdateRingPayload,
  UpdateSkillProgressPayload,
  UserType,
  SpiritualPracticeItem,
  SpiritualOccasion,
  SpiritualOccasionDetail,
  DailySpiritualEntry,
  UpsertDailySpiritualEntryPayload,
  UserOccasionProgress,
  MarkOccasionPracticePayload,
  SpiritualPath,
  StudentPathSelection,
  PathRankingPayload,
  FinalizePathPayload,
  AvailablePath,
  Teacher,
  TeacherCourse,
  AssignmentGrading,
  CreateTeacherPayload,
  UpdateTeacherPayload,
  TeacherDashboardSummary,
  GradeSubmissionPayload,
  Competition,
  CompetitionDetail,
  CompetitionParticipant,
  CompetitionResult,
  CompetitionStatus,
  CompetitionType,
  CreateCompetitionPayload,
  UpdateCompetitionPayload,
  RegisterParticipantPayload,
  UpdateParticipantScorePayload,
  League,
  LeagueDetail,
  LeagueRanking,
  LeagueStatus,
  CreateLeaguePayload,
  UpdateLeaguePayload,
  UpdateLeagueRankingPayload,
  RankingTrend,
  IssueSurvey,
  CreateIssueSurveyPayload,
  UpdateIssueSurveyPayload,
  IssueSurveyQuestion,
  CreateIssueQuestionPayload,
  IssueSurveyResponse,
  SubmitSurveyResponsePayload,
  IssueSurveyComment,
  IssueAction,
  CreateIssueActionPayload,
  IssueItemPool,
  CreateIssueItemPoolPayload,
  IssueDashboardSummary,
  SurveyAnalytics,
  CategoryAnalytics,
  QuestionAnalytics,
  IssueActionUpdate,
  ActionStatus,
  ServiceSurvey,
  CreateServiceSurveyPayload,
  UpdateServiceSurveyPayload,
  ServiceSurveyQuestion,
  CreateServiceQuestionPayload,
  ServiceSurveyResponse,
  SubmitServiceSurveyPayload,
  ServiceSurveyAnalytics,
  ServiceDashboardSummary
} from '../models/lesson-planner.models';

@Injectable()
export class MockLessonPlannerApi extends LessonPlannerApi {
  private readonly delayMs = 300;

  private users = [...mockUsers];

  private students = [...mockStudents];
  private branches = [...mockBranches];
  private courses = [...mockCourses];

  private assignments: Assignment[] = [];
  private attachments: AssignmentAttachment[] = [];
  private submissions: AssignmentSubmission[] = [];
  private coaches: Coach[] = [];
  private branchManagers: BranchManager[] = [];
  private parents: Parent[] = [];
  private evaluators: Evaluator[] = [];
  private madrasahs: Madrasah[] = [];
  private maktabBranches: MaktabBranch[] = [];
  private subjectAreas: SubjectArea[] = [];
  private teachingMethods: TeachingMethod[] = [];
  private rings: Ring[] = [];
  private ringStudents: RingStudent[] = [];
  private objectives: CurriculumObjective[] = [];
  private books: Book[] = [];
  private ringBooks: RingBook[] = [];
  private ringTeachingMethods: RingTeachingMethod[] = [];
  private evaluations: EvaluationRecord[] = [];
  private assessments: Assessment[] = [];
  private courseEnrollments = new Map(mockCourseEnrollments);
  private inviteCodes = new Map(mockInviteCodes);

  private spiritualPracticeItems: SpiritualPracticeItem[] = [];
  private spiritualOccasions: SpiritualOccasion[] = [];
  private spiritualPaths: SpiritualPath[] = [];
  private dailySpiritualEntries: DailySpiritualEntry[] = [];
  private userOccasionProgress: UserOccasionProgress[] = [];
  private studentPathSelections: StudentPathSelection[] = [];
  private monthlyBooklets: MonthlyBooklet[] = [];
  private curriculumVersions: CurriculumVersion[] = [];
  private progressionRecords: StudentPathHistory[] = [];
  private teachers: Teacher[] = [
    {
      id: 1,
      username: 'teacher.ahmadi',
      firstName: 'احمد',
      lastName: 'احمدی',
      email: 'ahmadi@example.com',
      phoneNumber: '09123333333',
      specialization: 'قرآن و تجوید',
      nationalCode: '1234567890',
      branchId: 1,
      status: 'active',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      teacherCourses: [],
      gradedSubmissions: []
    }
  ];
  private teacherCourses: TeacherCourse[] = [
    { id: 1, teacherId: 1, courseId: 1, createdAt: '2026-01-01T00:00:00.000Z' }
  ];
  private assignmentGradings: AssignmentGrading[] = [];

  constructor() {
    super();
    this.seedAssignments();
    this.seedCurriculumData();
    this.seedSpiritualData();
    this.seedSurveyData();
  }

  private seedSpiritualData(): void {
    const now = this.now();
    this.spiritualPracticeItems = [
      { id: 1, key: 'pledge.child.daily', titleFa: 'تعهد روزانه', descriptionFa: 'تعهد می‌کنم امروز نمازهایم را اول وقت بخوانم', stepKind: 'pledge', minAge: 6, maxAge: 9, genderMask: 'mixed', roleMask: '*', sortOrder: 1, createdAt: now, updatedAt: now },
      { id: 2, key: 'pledge.child.quran', titleFa: 'تعهد قرآنی', descriptionFa: 'تعهد می‌کنم امروز حداقل ۵ آیه از قرآن را بخوانم', stepKind: 'pledge', minAge: 6, maxAge: 9, genderMask: 'mixed', roleMask: '*', sortOrder: 2, createdAt: now, updatedAt: now },
      { id: 3, key: 'pledge.youth.morning', titleFa: 'تعهد صبحگاهی', descriptionFa: 'تعهد می‌کنم امروز نماز صبح را اول وقت بخوانم', stepKind: 'pledge', minAge: 10, maxAge: 14, genderMask: 'mixed', roleMask: '*', sortOrder: 3, createdAt: now, updatedAt: now },
      { id: 4, key: 'pledge.youth.study', titleFa: 'تعهد تحصیلی', descriptionFa: 'تعهد می‌کنم امروز حداقل ۲ ساعت مطالعه مفید داشته باشم', stepKind: 'pledge', minAge: 10, maxAge: 14, genderMask: 'mixed', roleMask: '*', sortOrder: 4, createdAt: now, updatedAt: now },
      { id: 5, key: 'pledge.adult.self', titleFa: 'تعهد خودسازی', descriptionFa: 'تعهد می‌کنم امروز یک گام در مسیر خودسازی بردارم', stepKind: 'pledge', minAge: 15, genderMask: 'mixed', roleMask: '*', sortOrder: 5, createdAt: now, updatedAt: now },
      { id: 6, key: 'monitor.child.prayer', titleFa: 'مراقبه نماز', descriptionFa: 'آیا نمازهای امروز را اول وقت خواندی؟', stepKind: 'monitoring', minAge: 6, maxAge: 9, genderMask: 'mixed', roleMask: '*', sortOrder: 6, createdAt: now, updatedAt: now },
      { id: 7, key: 'monitor.youth.prayer', titleFa: 'مراقبه نماز اول وقت', descriptionFa: 'آیا تمام نمازهای امروز را در اول وقت خواندی؟', stepKind: 'monitoring', minAge: 10, maxAge: 14, genderMask: 'mixed', roleMask: '*', sortOrder: 7, createdAt: now, updatedAt: now },
      { id: 8, key: 'monitor.youth.screen', titleFa: 'مراقبه فضای مجازی', descriptionFa: 'آیا استفاده از فضای مجازی امروز در حد مجاز بود؟', stepKind: 'monitoring', minAge: 10, maxAge: 14, genderMask: 'mixed', roleMask: '*', sortOrder: 8, createdAt: now, updatedAt: now },
      { id: 9, key: 'account.daily', titleFa: 'حساب‌کشی روزانه', descriptionFa: 'امروز را محاسبه کن: چند ساعت مفید، چند ساعت بیهوده؟', stepKind: 'accounting', minAge: 8, genderMask: 'mixed', roleMask: '*', sortOrder: 9, createdAt: now, updatedAt: now },
      { id: 10, key: 'reprimand.self', titleFa: 'عاتبه نفس', descriptionFa: 'آیا از عملکرد امروز خود راضی هستی؟ اگر نه، خود را ملامت کن', stepKind: 'reprimand', minAge: 8, genderMask: 'mixed', roleMask: '*', sortOrder: 10, createdAt: now, updatedAt: now },
      { id: 11, key: 'discipline.extra', titleFa: 'عمل اضافه', descriptionFa: 'یک کار نیک اضافی امروز انجام بده', stepKind: 'discipline', minAge: 6, genderMask: 'mixed', roleMask: '*', sortOrder: 11, createdAt: now, updatedAt: now },
    ];
    this.spiritualOccasions = [
      { id: 1, key: 'ramadan', titleFa: 'ماه رمضان', descriptionFa: 'ماه مبارک رمضان', hijriMonth: 9, hijriDay: 1, genderMask: 'mixed', sortOrder: 1, createdAt: now, updatedAt: now },
      { id: 2, key: 'eid-fitr', titleFa: 'عید فطر', descriptionFa: 'عید پایان ماه رمضان', hijriMonth: 10, hijriDay: 1, genderMask: 'mixed', sortOrder: 2, createdAt: now, updatedAt: now },
      { id: 3, key: 'eid-adha', titleFa: 'عید قربان', descriptionFa: 'عید قربان', hijriMonth: 12, hijriDay: 10, genderMask: 'mixed', sortOrder: 3, createdAt: now, updatedAt: now },
      { id: 4, key: 'ashura', titleFa: 'عاشورا', descriptionFa: 'روز شهادت امام حسین (ع)', hijriMonth: 1, hijriDay: 10, genderMask: 'mixed', sortOrder: 4, createdAt: now, updatedAt: now },
      { id: 5, key: 'mabath', titleFa: 'مبعث', descriptionFa: 'مبعث رسول اکرم (ص)', hijriMonth: 7, hijriDay: 27, genderMask: 'mixed', sortOrder: 5, createdAt: now, updatedAt: now },
    ];
    this.spiritualPaths = [
      { id: 1, key: 'quran', titleFa: 'مسیر قرآنی', descriptionFa: 'حفظ و تفسیر قرآن', genderMask: 'mixed', sortOrder: 1, ageEntryPoint: 9, ageFinalizePoint: 10, status: 'active', createdAt: now, updatedAt: now },
      { id: 2, key: 'talabgi', titleFa: 'مسیر طلبگی', descriptionFa: 'تحصیل علوم حوزوی', genderMask: 'mixed', sortOrder: 2, ageEntryPoint: 9, ageFinalizePoint: 10, status: 'active', createdAt: now, updatedAt: now },
      { id: 3, key: 'morabbegi', titleFa: 'مسیر مربی‌گری', descriptionFa: 'تربیت مربی', genderMask: 'mixed', sortOrder: 3, ageEntryPoint: 9, ageFinalizePoint: 10, status: 'active', createdAt: now, updatedAt: now },
      { id: 4, key: 'business', titleFa: 'مسیر کسب و کار', descriptionFa: 'کارآفرینی', genderMask: 'male', sortOrder: 4, ageEntryPoint: 9, ageFinalizePoint: 10, status: 'active', createdAt: now, updatedAt: now },
      { id: 5, key: 'standard_academic', titleFa: 'مسیر تحصیلی متعارف', descriptionFa: 'تحصیل دانشگاهی', genderMask: 'mixed', sortOrder: 5, ageEntryPoint: 9, ageFinalizePoint: 10, status: 'active', createdAt: now, updatedAt: now },
      { id: 6, key: 'home_children', titleFa: 'مسیر خانه‌داری و تربیت فرزند', descriptionFa: 'مهارت‌های همسرداری', genderMask: 'female', sortOrder: 1, ageEntryPoint: 9, ageFinalizePoint: 10, status: 'active', createdAt: now, updatedAt: now },
    ];
  }

  private seedCurriculumData(): void {
    const now = this.now();
    const subjectAreaData = [
      { key: 'quran', name: 'قرآن', description: 'آموزش قرآن کریم شامل روخوانی، روان‌خوانی، تجوید و حفظ', sortOrder: 1 },
      { key: 'ahkam', name: 'احکام', description: 'آموزش احکام شرعی بر اساس رساله مرجع تقلید', sortOrder: 2 },
      { key: 'aqayed', name: 'عقاید', description: 'آموزش مبانی اعتقادی و اصول دین', sortOrder: 3 },
      { key: 'akhlaq', name: 'اخلاق', description: 'آموزش مبانی اخلاقی و تهذیب نفس', sortOrder: 4 },
      { key: 'tarikh', name: 'تاریخ', description: 'آموزش تاریخ اسلام و تشیع', sortOrder: 5 },
      { key: 'sireh', name: 'سیره معصومین', description: 'آموزش سیره و زندگی معصومین', sortOrder: 6 },
      { key: 'manteq', name: 'منطق', description: 'آموزش علم منطق و قواعد استدلال', sortOrder: 7 },
      { key: 'falsafeh', name: 'فلسفه', description: 'آموزش مبانی فلسفه اسلامی', sortOrder: 8 },
      { key: 'feqh', name: 'فقه', description: 'آموزش فقه استدلالی و مسائل شرعی', sortOrder: 9 },
      { key: 'osul', name: 'اصول', description: 'آموزش اصول فقه و مبانی استنباط', sortOrder: 10 },
      { key: 'tajvid', name: 'تجوید', description: 'آموزش قواعد تجوید و قرائت صحیح قرآن', sortOrder: 11 },
      { key: 'tfsir', name: 'تفسیر', description: 'آموزش تفسیر قرآن کریم', sortOrder: 12 },
      { key: 'hadith', name: 'حدیث', description: 'آموزش علوم حدیث و متون روایی', sortOrder: 13 },
      { key: 'erfan', name: 'عرفان', description: 'آموزش عرفان اسلامی و سیر و سلوک', sortOrder: 14 },
      { key: 'lughat', name: 'لغت عربی', description: 'آموزش لغت و صرف و نحو عربی', sortOrder: 15 },
      { key: 'balaghah', name: 'بلاغت', description: 'آموزش علوم بلاغی (معانی، بیان، بدیع)', sortOrder: 16 },
      { key: 'tarbiat', name: 'تربیت', description: 'آموزش مبانی تربیتی و روش‌های پرورش', sortOrder: 17 },
      { key: 'ejtemae', name: 'اجتماعی', description: 'آموزش مبانی اجتماعی و سیاسی اسلام', sortOrder: 18 },
      { key: 'tarbiat-badani', name: 'تربیت بدنی', description: 'آموزش ورزش و تربیت بدنی', sortOrder: 19 },
      { key: 'fani-va-herfeh', name: 'فنی و حرفه‌ای', description: 'آموزش مهارت‌های فنی و حرفه‌ای', sortOrder: 20 }
    ];
    subjectAreaData.forEach((d, i) => {
      this.subjectAreas.push({ id: i + 1, ...d, createdAt: now });
    });

    const teachingMethodData = [
      { key: 'lecture', name: 'سخنرانی', description: 'ارائه مطالب توسط مربی به صورت شفاهی', sortOrder: 1 },
      { key: 'qa', name: 'پرسش و پاسخ', description: 'تعامل دوسویه مربی و متربی', sortOrder: 2 },
      { key: 'discussion', name: 'بحث گروهی', description: 'بحث و گفتگوی گروهی', sortOrder: 3 },
      { key: 'memorization', name: 'حفظ', description: 'حفظ آیات، روایات یا اشعار', sortOrder: 4 },
      { key: 'practice', name: 'تمرین عملی', description: 'انجام تمرین عملی توسط متربی', sortOrder: 5 },
      { key: 'storytelling', name: 'قصه‌گویی', description: 'بیان داستان‌های آموزنده', sortOrder: 6 },
      { key: 'roleplay', name: 'نقش‌آفرینی', description: 'ایفای نقش توسط متربیان', sortOrder: 7 },
      { key: 'project', name: 'پروژه تحقیقاتی', description: 'انجام تحقیق و پروژه', sortOrder: 8 },
      { key: 'visual', name: 'تصویری', description: 'استفاده از تصاویر و فیلم‌های آموزشی', sortOrder: 9 },
      { key: 'recitation', name: 'تلاوت', description: 'تلاوت و شنیدن قرآن', sortOrder: 10 },
      { key: 'writing', name: 'نوشتاری', description: 'انجام تکالیف کتبی و انشا', sortOrder: 11 },
      { key: 'gamification', name: 'بازی و سرگرمی', description: 'آموزش از طریق بازی و مسابقه', sortOrder: 12 },
      { key: 'field-trip', name: 'بازدید و اردو', description: 'آموزش در محیط بیرون', sortOrder: 13 },
      { key: 'peer-learning', name: 'یادگیری همتا', description: 'آموزش توسط هم‌کلاسی‌ها', sortOrder: 14 },
      { key: 'questionnaire', name: 'پرسشنامه', description: 'استفاده از پرسشنامه', sortOrder: 15 },
      { key: 'demonstration', name: 'نمایش عملی', description: 'اجرای عملی توسط مربی', sortOrder: 16 },
      { key: 'brainstorming', name: 'طوفان فکری', description: 'تولید ایده توسط گروه', sortOrder: 17 },
      { key: 'problem-solving', name: 'حل مسئله', description: 'ارائه مسئله و یافتن راه حل', sortOrder: 18 }
    ];
    teachingMethodData.forEach((d, i) => {
      this.teachingMethods.push({ id: i + 1, ...d, createdAt: now });
    });
  }

  private seedAssignments(): void {
    const start = new Date('2026-01-01');
    let assignmentId = 1;
    let attachmentId = 1;

    this.courses.forEach((course) => {
      for (let day = 0; day < 36; day++) {
        const date = new Date(start);
        date.setDate(date.getDate() + day);
        const dateStr = date.toISOString().split('T')[0];

        this.assignments.push({
          id: assignmentId,
          courseId: course.id,
          title: `تکلیف روز ${day + 1} - ${course.title}`,
          description: `تکلیف روزانه شماره ${day + 1} برای دوره ${course.title}`,
          type: 'daily',
          maxScore: 100,
          assignmentDate: dateStr,
          status: 'published',
          instructions: 'لطفاً فایل صوتی تلاوت خود را ضبط و ارسال کنید.',
          requiredListenCount: 1,
          currentListenCount: 0,
          isRecordingUnlocked: true,
          createdAt: '2026-01-01T00:00:00.000Z'
        });

        if (day === 0) {
          this.attachments.push({
            id: attachmentId++,
            assignmentId,
            title: 'فایل راهنمای صوتی',
            description: 'توضیحات تکلیف',
            kind: 'audio',
            url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
            displayOrder: 1,
            createdAt: '2026-01-01T00:00:00.000Z'
          });
        }

        assignmentId++;
      }
    });
  }

  private now(): string {
    return new Date().toISOString();
  }

  private nextId<T extends { id: number }>(items: T[] | string): number {
    if (typeof items === 'string') {
      switch (items) {
        case 'assessment':
          return this.assessments.length ? Math.max(...this.assessments.map((a) => a.id)) + 1 : 1;
        case 'question':
          const allQuestions = this.assessments.flatMap((a) => a.questions ?? []);
          return allQuestions.length ? Math.max(...allQuestions.map((q) => q.id)) + 1 : 1;
        case 'result':
          const allResults = this.assessments.flatMap((a) => a.results ?? []);
          return allResults.length ? Math.max(...allResults.map((r) => r.id)) + 1 : 1;
        default:
          return 1;
      }
    }
    return items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1;
  }

  private delayed<T>(value: T): Observable<T> {
    return of(value).pipe(delay(this.delayMs));
  }

  private findUserByUsername(username: string) {
    return this.users.find((u) => u.username === username);
  }

  signin(payload: AuthSigninPayload): Observable<AuthSigninResponse> {
    const user = this.findUserByUsername(payload.username);
    if (!user || user.password !== payload.password) {
      return this.delayed({
        message: 'نام کاربری یا رمز عبور اشتباه است',
        token: '',
        username: '',
        userType: 'trainee' as UserType
      });
    }

    if (user.approvalStatus === 'pending') {
      return this.delayed({
        message: 'حساب کاربری شما در انتظار تایید مدیر سیستم است',
        token: '',
        username: user.username,
        userType: user.userType
      });
    }

    if (user.approvalStatus === 'rejected') {
      return this.delayed({
        message: 'حساب کاربری شما رد شده است. لطفاً با مدیر سیستم تماس بگیرید',
        token: '',
        username: user.username,
        userType: user.userType
      });
    }

    const student = user.studentId ? this.students.find((s) => s.id === user.studentId) : undefined;
    const token = createDummyToken(user.username, user.userType, user.studentId, user.branchId);

    return this.delayed({
      message: 'ورود با موفقیت انجام شد',
      token,
      username: user.username,
      imageUrl: user.imageUrl,
      userType: user.userType,
      studentId: user.studentId,
      studentInfo: student
        ? {
            id: student.id,
            studentId: student.studentId,
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email,
            phoneNumber: student.phoneNumber
          }
        : undefined,
      branchId: user.branchId
    });
  }

  signup(payload: AuthSignupPayload | FormData): Observable<AuthSignupResponse> {
    let data: AuthSignupPayload;
    if (payload instanceof FormData) {
      data = {
        firstName: payload.get('firstName') as string,
        lastName: payload.get('lastName') as string,
        username: payload.get('username') as string,
        email: payload.get('email') as string,
        phoneNumber: payload.get('phoneNumber') as string,
        password: payload.get('password') as string
      };
    } else {
      data = payload;
    }

    if (this.findUserByUsername(data.username)) {
      return this.delayed({
        message: 'نام کاربری قبلاً ثبت شده است',
        status: 'pending'
      });
    }

    this.users.push({
      id: this.nextId(this.users),
      username: data.username,
      password: data.password,
      userType: 'trainee',
      approvalStatus: 'pending',
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber
    });

    return this.delayed({
      message: 'ثبت نام با موفقیت انجام شد. در انتظار تایید مدیر سیستم هستید.',
      status: 'pending'
    });
  }

  seedDatabase(): Observable<ApiMessageResponse> {
    this.users = this.users.filter((u) => u.id <= 4);
    this.students = this.students.filter((s) => s.id <= 3);
    this.courses = this.courses.filter((c) => c.id <= 2);
    this.assignments = [];
    this.attachments = [];
    this.submissions = [];
    this.coaches = [];
    this.branchManagers = [];
    this.parents = [];
    this.evaluators = [];
    this.madrasahs = [];
    this.maktabBranches = [];
    this.evaluations = [];
    this.courseEnrollments = new Map([[1, [1, 2, 3]], [2, [1, 2]]]);
    this.inviteCodes = new Map();
    this.seedAssignments();
    return this.delayed({ message: 'پایگاه داده با موفقیت بازنشانی شد' });
  }

  getActiveCourses(): Observable<Course[]> {
    return this.delayed(this.courses.filter((c) => c.status === 'active'));
  }

  getCourses(): Observable<Course[]> {
    return this.delayed([...this.courses]);
  }

  getCourseById(id: number): Observable<Course> {
    const course = this.courses.find((c) => c.id === id);
    if (!course) throw new Error('Course not found');
    return this.delayed(course);
  }

  createCourse(payload: CreateCoursePayload): Observable<Course> {
    const course: Course = {
      id: this.nextId(this.courses),
      title: payload.title,
      description: payload.description ?? '',
      courseCode: payload.courseCode,
      credits: payload.credits,
      instructor: payload.instructor ?? '',
      status: payload.status ?? 'active',
      startDate: payload.startDate ?? this.now().split('T')[0],
      endDate: payload.endDate ?? this.now().split('T')[0],
      maxStudents: payload.maxStudents,
      createdAt: this.now(),
      updatedAt: this.now()
    };
    this.courses.push(course);
    return this.delayed(course);
  }

  updateCourse(id: number, payload: Partial<CreateCoursePayload>): Observable<Course> {
    const course = this.courses.find((c) => c.id === id);
    if (!course) throw new Error('Course not found');
    Object.assign(course, payload, { updatedAt: this.now() });
    return this.delayed(course);
  }

  deleteCourse(id: number): Observable<ApiMessageResponse> {
    this.courses = this.courses.filter((c) => c.id !== id);
    this.assignments = this.assignments.filter((a) => a.courseId !== id);
    this.courseEnrollments.delete(id);
    return this.delayed({ message: 'دوره با موفقیت حذف شد' });
  }

  getCourseAssignments(courseId: number): Observable<Assignment[]> {
    return this.delayed(this.assignments.filter((a) => a.courseId === courseId));
  }

  createCourseAssignment(courseId: number, payload: Partial<CreateAssignmentPayload>): Observable<Assignment> {
    const assignment: Assignment = {
      id: this.nextId(this.assignments),
      courseId,
      title: payload.title ?? 'تکلیف جدید',
      description: payload.description ?? '',
      type: payload.type ?? 'daily',
      maxScore: payload.maxScore ?? 100,
      assignmentDate: payload.assignmentDate ?? this.now().split('T')[0],
      status: payload.status ?? 'published',
      instructions: payload.instructions,
      requiredListenCount: 1,
      currentListenCount: 0,
      isRecordingUnlocked: true,
      createdAt: this.now(),
      updatedAt: this.now()
    };
    this.assignments.push(assignment);
    return this.delayed(assignment);
  }

  getStudentProgress(studentId: number): Observable<StudentProgressResponse> {
    const student = this.students.find((s) => s.id === studentId);
    if (!student) throw new Error('Student not found');

    const enrolledCourseIds = Array.from(this.courseEnrollments.entries())
      .filter(([, students]) => students.includes(studentId))
      .map(([courseId]) => courseId);

    const courses = this.courses
      .filter((c) => enrolledCourseIds.includes(c.id))
      .map((course) => ({
        course,
        assignments: this.assignments.filter((a) => a.courseId === course.id)
      }));

    const submissions = this.submissions.filter((s) => s.studentId === studentId);

    return this.delayed({
      student: {
        id: student.id,
        studentId: student.studentId,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        phoneNumber: student.phoneNumber
      },
      courses,
      submissions
    });
  }

  getStudentSubmissions(studentId: number, assignmentId?: number): Observable<AssignmentSubmission[]> {
    let result = this.submissions.filter((s) => s.studentId === studentId);
    if (assignmentId !== undefined) {
      result = result.filter((s) => s.assignmentId === assignmentId);
    }
    return this.delayed(result);
  }

  getAssignmentProgress(studentId: number, assignmentId: number): Observable<AssignmentProgressResponse> {
    const assignment = this.assignments.find((a) => a.id === assignmentId);
    const latest = this.submissions
      .filter((s) => s.studentId === studentId && s.assignmentId === assignmentId)
      .sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime())[0];

    return this.delayed({
      assignmentId,
      hasSubmission: !!latest,
      latestSubmission: latest ?? null,
      requiredListenCount: assignment?.requiredListenCount ?? 1,
      currentListenCount: latest?.timeSpent ?? 0,
      isRecordingUnlocked: true,
      hasPlayableInstructionAudio: false
    });
  }

  registerAssignmentListenCompletion(
    studentId: number,
    assignmentId: number,
    instructionAudioVersion?: string
  ): Observable<AssignmentProgressResponse> {
    const latest = this.submissions.find((s) => s.studentId === studentId && s.assignmentId === assignmentId);
    if (latest) {
      latest.timeSpent = (latest.timeSpent ?? 0) + 1;
    }
    return this.getAssignmentProgress(studentId, assignmentId);
  }

  submitAssignment(studentId: number, assignmentId: number, payload: FormData): Observable<AssignmentSubmission> {
    const submission: AssignmentSubmission = {
      id: this.nextId(this.submissions),
      assignmentId,
      studentId,
      submissionDate: this.now(),
      status: 'submitted',
      dailyScore: 0,
      cumulativeScore: 0,
      isCompleted: true,
      timeSpent: 0,
      notes: payload.get('notes') as string | undefined,
      feedback: ''
    };
    this.submissions.push(submission);
    return this.delayed(submission);
  }

  uploadSubmissionFile(
    studentId: number,
    submissionId: number,
    payload: FormData
  ): Observable<AssignmentSubmission> {
    const submission = this.submissions.find((s) => s.id === submissionId && s.studentId === studentId);
    if (!submission) throw new Error('Submission not found');
    submission.audioFileUrl = 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav';
    return this.delayed(submission);
  }

  getAllStudents(): Observable<StudentInfo[]> {
    return this.delayed(
      this.students.map((s) => ({
        id: s.id,
        studentId: s.studentId,
        firstName: s.firstName,
        lastName: s.lastName,
        email: s.email,
        phoneNumber: s.phoneNumber
      }))
    );
  }

  getPendingUsers(): Observable<PendingUser[]> {
    return this.delayed(
      this.users
        .filter((u) => u.approvalStatus === 'pending')
        .map((u) => ({
          id: u.id,
          username: u.username,
          firstName: u.firstName ?? '',
          lastName: u.lastName ?? '',
          email: u.email ?? '',
          phoneNumber: u.phoneNumber ?? '',
          status: 'pending' as const,
          createdAt: this.now()
        }))
    );
  }

  approveUser(userId: number, payload: ApproveUserPayload): Observable<ApiMessageResponse> {
    const user = this.users.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');

    const student: Student = {
      id: this.nextId(this.students),
      username: user.username,
      studentId: payload.studentId,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      status: 'active',
      createdAt: this.now()
    };
    this.students.push(student);

    user.approvalStatus = 'approved';
    user.studentId = student.id;
    user.firstName = payload.firstName;
    user.lastName = payload.lastName;
    user.email = payload.email;
    user.phoneNumber = payload.phoneNumber;

    payload.courseIds.forEach((courseId) => {
      const list = this.courseEnrollments.get(courseId) ?? [];
      if (!list.includes(student.id)) {
        list.push(student.id);
        this.courseEnrollments.set(courseId, list);
      }
    });

    return this.delayed({ message: 'کاربر با موفقیت تایید شد' });
  }

  rejectUser(userId: number): Observable<ApiMessageResponse> {
    const user = this.users.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');
    user.approvalStatus = 'rejected';
    return this.delayed({ message: 'کاربر رد شد' });
  }

  createUser(payload: CreateUserPayload): Observable<CreatedUser> {
    const user = {
      id: this.nextId(this.users),
      username: payload.username,
      password: payload.password,
      userType: payload.userType,
      approvalStatus: 'approved' as const,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phoneNumber: payload.phoneNumber
    };
    this.users.push(user);
    return this.delayed({
      id: user.id,
      username: user.username,
      userType: user.userType,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber
    });
  }

  getAdminCourses(): Observable<Course[]> {
    return this.getCourses();
  }

  createAdminCourse(payload: CreateCoursePayload): Observable<Course> {
    return this.createCourse(payload);
  }

  updateAdminCourse(id: number, payload: Partial<CreateCoursePayload>): Observable<Course> {
    return this.updateCourse(id, payload);
  }

  deleteAdminCourse(id: number): Observable<ApiMessageResponse> {
    return this.deleteCourse(id);
  }

  searchAdminCourses(query: string): Observable<Course[]> {
    const q = query.toLowerCase();
    return this.delayed(
      this.courses.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.courseCode.toLowerCase().includes(q) ||
          c.instructor.toLowerCase().includes(q)
      )
    );
  }

  filterAdminCourses(status: string): Observable<Course[]> {
    return this.delayed(this.courses.filter((c) => c.status === status));
  }

  getAdminCourseAssignments(courseId: number): Observable<Assignment[]> {
    return this.getCourseAssignments(courseId);
  }

  getAssignmentById(id: number): Observable<Assignment> {
    const assignment = this.assignments.find((a) => a.id === id);
    if (!assignment) throw new Error('Assignment not found');
    return this.delayed(assignment);
  }

  createAdminAssignment(courseId: number, payload: Partial<CreateAssignmentPayload>): Observable<Assignment> {
    return this.createCourseAssignment(courseId, payload);
  }

  updateAdminAssignment(id: number, payload: Partial<CreateAssignmentPayload>): Observable<Assignment> {
    const assignment = this.assignments.find((a) => a.id === id);
    if (!assignment) throw new Error('Assignment not found');
    Object.assign(assignment, payload, { updatedAt: this.now() });
    return this.delayed(assignment);
  }

  deleteAdminAssignment(id: number): Observable<ApiMessageResponse> {
    this.assignments = this.assignments.filter((a) => a.id !== id);
    this.attachments = this.attachments.filter((a) => a.assignmentId !== id);
    return this.delayed({ message: 'تکلیف با موفقیت حذف شد' });
  }

  createDailyAssignments(courseId: number, payload: CreateDailySeriesPayload): Observable<Assignment[]> {
    const start = new Date(payload.startDate);
    const created: Assignment[] = [];

    for (let day = 0; day < payload.days; day++) {
      const date = new Date(start);
      date.setDate(date.getDate() + day);
      const assignment: Assignment = {
        id: this.nextId(this.assignments),
        courseId,
        title: `${payload.titlePrefix ?? 'تکلیف روزانه'} ${day + 1}`,
        description: `${payload.descriptionPrefix ?? ''} ${day + 1}`.trim(),
        type: payload.type ?? 'daily',
        maxScore: payload.maxScore ?? 100,
        assignmentDate: date.toISOString().split('T')[0],
        status: 'published',
        instructions: payload.instructions,
        requiredListenCount: 1,
        currentListenCount: 0,
        isRecordingUnlocked: true,
        createdAt: this.now(),
        updatedAt: this.now()
      };
      this.assignments.push(assignment);
      created.push(assignment);
    }

    return this.delayed(created);
  }

  getAssignmentAttachments(assignmentId: number): Observable<AssignmentAttachment[]> {
    return this.delayed(this.attachments.filter((a) => a.assignmentId === assignmentId));
  }

  createAttachment(assignmentId: number, payload: FormData): Observable<AssignmentAttachment> {
    const file = payload.get('file') as File | null;
    const attachment: AssignmentAttachment = {
      id: this.nextId(this.attachments),
      assignmentId,
      title: (payload.get('title') as string) ?? 'پیوست',
      description: (payload.get('description') as string) ?? undefined,
      kind: (payload.get('kind') as AttachmentKind) ?? 'document',
      url: file ? URL.createObjectURL(file) : '',
      displayOrder: Number(payload.get('displayOrder')) || 1,
      createdAt: this.now(),
      updatedAt: this.now()
    };
    this.attachments.push(attachment);
    return this.delayed(attachment);
  }

  uploadAttachmentFile(attachmentId: number, payload: FormData): Observable<AssignmentAttachment> {
    const attachment = this.attachments.find((a) => a.id === attachmentId);
    if (!attachment) throw new Error('Attachment not found');
    const file = payload.get('file') as File | null;
    if (file) {
      attachment.url = URL.createObjectURL(file);
    }
    attachment.updatedAt = this.now();
    return this.delayed(attachment);
  }

  updateAttachment(attachmentId: number, payload: Partial<AssignmentAttachment>): Observable<AssignmentAttachment> {
    const attachment = this.attachments.find((a) => a.id === attachmentId);
    if (!attachment) throw new Error('Attachment not found');
    Object.assign(attachment, payload, { updatedAt: this.now() });
    return this.delayed(attachment);
  }

  deleteAttachment(attachmentId: number): Observable<ApiMessageResponse> {
    this.attachments = this.attachments.filter((a) => a.id !== attachmentId);
    return this.delayed({ message: 'پیوست با موفقیت حذف شد' });
  }

  getCoaches(): Observable<Coach[]> {
    return this.delayed([...this.coaches]);
  }

  createCoach(payload: CreateCoachPayload): Observable<Coach> {
    const coach: Coach = {
      id: this.nextId(this.coaches),
      username: payload.username,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      specialization: payload.specialization,
      nationalCode: payload.nationalCode,
      branchId: payload.branchId,
      assignedCourseIds: payload.assignedCourseIds ?? [],
      status: 'active',
      createdAt: this.now()
    };
    this.coaches.push(coach);
    return this.delayed(coach);
  }

  updateCoach(id: number, payload: Partial<CreateCoachPayload>): Observable<Coach> {
    const coach = this.coaches.find((c) => c.id === id);
    if (!coach) throw new Error('Coach not found');
    Object.assign(coach, payload, { updatedAt: this.now() });
    return this.delayed(coach);
  }

  deleteCoach(id: number): Observable<ApiMessageResponse> {
    this.coaches = this.coaches.filter((c) => c.id !== id);
    return this.delayed({ message: 'مربی با موفقیت حذف شد' });
  }

  getStudents(): Observable<Student[]> {
    return this.delayed([...this.students]);
  }

  createStudent(payload: CreateStudentPayload): Observable<Student> {
    const student: Student = {
      id: this.nextId(this.students),
      username: payload.username,
      studentId: payload.studentId ?? `STD-${String(this.nextId(this.students)).padStart(3, '0')}`,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      branchId: payload.branchId,
      gender: payload.gender ?? 'mixed',
      status: 'active',
      createdAt: this.now()
    };
    this.students.push(student);
    this.users.push({
      id: this.nextId(this.users),
      username: payload.username,
      password: payload.password,
      userType: 'trainee',
      approvalStatus: 'approved',
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      studentId: student.id
    });
    return this.delayed(student);
  }

  updateStudent(id: number, payload: UpdateStudentPayload): Observable<Student> {
    const student = this.students.find((s) => s.id === id);
    if (!student) throw new Error('Student not found');
    Object.assign(student, payload, { updatedAt: this.now() });
    return this.delayed(student);
  }

  deleteStudent(id: number): Observable<ApiMessageResponse> {
    this.students = this.students.filter((s) => s.id !== id);
    this.users = this.users.filter((u) => u.studentId !== id);
    return this.delayed({ message: 'دانش‌آموز با موفقیت حذف شد' });
  }

  getBranchManagers(): Observable<BranchManager[]> {
    return this.delayed([...this.branchManagers]);
  }

  createBranchManager(payload: CreateBranchManagerPayload): Observable<BranchManager> {
    const branch = this.branches.find((b) => b.id === payload.branchId);
    const manager: BranchManager = {
      id: this.nextId(this.branchManagers),
      username: payload.username,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      branchId: payload.branchId,
      branchName: branch?.name,
      gender: payload.gender,
      nationalCode: payload.nationalCode,
      status: 'active',
      createdAt: this.now()
    };
    this.branchManagers.push(manager);
    return this.delayed(manager);
  }

  updateBranchManager(
    id: number,
    payload: Partial<CreateBranchManagerPayload>
  ): Observable<BranchManager> {
    const manager = this.branchManagers.find((m) => m.id === id);
    if (!manager) throw new Error('Branch manager not found');
    Object.assign(manager, payload, { updatedAt: this.now() });
    return this.delayed(manager);
  }

  deleteBranchManager(id: number): Observable<ApiMessageResponse> {
    this.branchManagers = this.branchManagers.filter((m) => m.id !== id);
    return this.delayed({ message: 'مدیر شعبه حذف شد' });
  }

  getBranches(): Observable<Branch[]> {
    return this.delayed([...this.branches]);
  }

  createBranch(payload: CreateBranchPayload): Observable<Branch> {
    const branch: Branch = {
      id: this.nextId(this.branches),
      name: payload.name,
      province: payload.province,
      description: payload.description,
      createdAt: new Date().toISOString(),
    };
    this.branches.push(branch);
    return this.delayed(branch);
  }

  updateBranch(id: number, payload: UpdateBranchPayload): Observable<Branch> {
    const idx = this.branches.findIndex(b => b.id === id);
    if (idx < 0) throw new Error('شعبه یافت نشد');
    this.branches[idx] = { ...this.branches[idx], ...payload };
    return this.delayed(this.branches[idx]);
  }

  deleteBranch(id: number): Observable<ApiMessageResponse> {
    this.branches = this.branches.filter(b => b.id !== id);
    return this.delayed({ message: 'شعبه حذف شد' });
  }

  getSystemStatistics(): Observable<AdminSystemStatistics> {
    return this.delayed({
      totalCourses: this.courses.length,
      totalAssignments: this.assignments.length,
      totalAttachments: this.attachments.length,
      activeCourses: this.courses.filter((c) => c.status === 'active').length
    });
  }

  getCourseStatistics(courseId: number): Observable<AdminCourseStatistics> {
    const course = this.courses.find((c) => c.id === courseId);
    if (!course) throw new Error('Course not found');
    return this.delayed({
      course,
      totalAssignments: this.assignments.filter((a) => a.courseId === courseId).length,
      totalAttachments: this.attachments.filter((a) => {
        const assignment = this.assignments.find((asg) => asg.id === a.assignmentId);
        return assignment?.courseId === courseId;
      }).length
    });
  }

  getCourseEnrollments(courseId: number): Observable<CourseEnrollment[]> {
    const studentIds = this.courseEnrollments.get(courseId) ?? [];
    return this.delayed(
      studentIds.map((id) => {
        const student = this.students.find((s) => s.id === id)!;
        return {
          studentId: student.id,
          studentName: `${student.firstName} ${student.lastName}`,
          studentCode: student.studentId,
          enrollmentDate: this.now()
        };
      })
    );
  }

  enrollStudentInCourse(courseId: number, studentId: number): Observable<ApiMessageResponse> {
    const list = this.courseEnrollments.get(courseId) ?? [];
    if (!list.includes(studentId)) {
      list.push(studentId);
      this.courseEnrollments.set(courseId, list);
    }
    return this.delayed({ message: 'دانش‌آموز در دوره ثبت‌نام شد' });
  }

  unenrollStudentFromCourse(courseId: number, studentId: number): Observable<ApiMessageResponse> {
    const list = this.courseEnrollments.get(courseId) ?? [];
    this.courseEnrollments.set(
      courseId,
      list.filter((id) => id !== studentId)
    );
    return this.delayed({ message: 'دانش‌آموز از دوره حذف شد' });
  }

  generateCourseInviteCode(courseId: number): Observable<CourseInviteCode> {
    const code = `INV-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const invite: CourseInviteCode = {
      code,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      courseId
    };
    this.inviteCodes.set(courseId, invite);
    return this.delayed(invite);
  }

  getMadrasahs(): Observable<Madrasah[]> {
    return this.delayed([...this.madrasahs]);
  }

  createMadrasah(payload: CreateMadrasahPayload): Observable<Madrasah> {
    const madrasah: Madrasah = {
      id: this.nextId(this.madrasahs),
      name: payload.name,
      key: payload.key,
      label: payload.label,
      level: payload.level,
      gender: payload.gender,
      grade: payload.grade,
      capacity: payload.capacity,
      managerId: payload.managerId,
      status: payload.status ?? 'active',
      createdAt: this.now(),
      updatedAt: this.now()
    };
    this.madrasahs.push(madrasah);
    return this.delayed(madrasah);
  }

  updateMadrasah(id: number, payload: UpdateMadrasahPayload): Observable<Madrasah> {
    const madrasah = this.madrasahs.find((m) => m.id === id);
    if (!madrasah) throw new Error('Madrasah not found');
    Object.assign(madrasah, payload, { updatedAt: this.now() });
    return this.delayed(madrasah);
  }

  deleteMadrasah(id: number): Observable<ApiMessageResponse> {
    this.madrasahs = this.madrasahs.filter((m) => m.id !== id);
    return this.delayed({ message: 'مدرسه حذف شد' });
  }

  getMaktabBranches(madrasahId: number): Observable<MaktabBranch[]> {
    return this.delayed(this.maktabBranches.filter((b) => b.madrasahId === madrasahId));
  }

  createMaktabBranch(
    madrasahId: number,
    payload: CreateMaktabBranchPayload
  ): Observable<MaktabBranch> {
    const branch: MaktabBranch = {
      id: this.nextId(this.maktabBranches),
      madrasahId,
      province: payload.province,
      name: payload.name,
      address: payload.address ?? '',
      capacity: payload.capacity ?? 0,
      status: payload.status ?? 'active',
      createdAt: this.now(),
      updatedAt: this.now()
    };
    this.maktabBranches.push(branch);
    return this.delayed(branch);
  }

  deleteMaktabBranch(madrasahId: number, branchId: number): Observable<ApiMessageResponse> {
    this.maktabBranches = this.maktabBranches.filter(
      (b) => !(b.madrasahId === madrasahId && b.id === branchId)
    );
    return this.delayed({ message: 'شعبه مکتب حذف شد' });
  }

  getSubjectAreas(): Observable<SubjectArea[]> {
    return this.delayed([...this.subjectAreas]);
  }

  createSubjectArea(payload: CreateSubjectAreaPayload): Observable<SubjectArea> {
    const area: SubjectArea = {
      id: this.nextId(this.subjectAreas),
      key: payload.key,
      name: payload.name,
      description: payload.description ?? '',
      sortOrder: payload.sortOrder ?? 0,
      createdAt: this.now()
    };
    this.subjectAreas.push(area);
    return this.delayed(area);
  }

  updateSubjectArea(id: number, payload: UpdateSubjectAreaPayload): Observable<SubjectArea> {
    const area = this.subjectAreas.find((a) => a.id === id);
    if (!area) throw new Error('SubjectArea not found');
    Object.assign(area, payload);
    return this.delayed(area);
  }

  deleteSubjectArea(id: number): Observable<ApiMessageResponse> {
    this.subjectAreas = this.subjectAreas.filter((a) => a.id !== id);
    return this.delayed({ message: 'حوزه درسی حذف شد' });
  }

  getTeachingMethods(): Observable<TeachingMethod[]> {
    return this.delayed([...this.teachingMethods]);
  }

  createTeachingMethod(payload: CreateTeachingMethodPayload): Observable<TeachingMethod> {
    const method: TeachingMethod = {
      id: this.nextId(this.teachingMethods),
      key: payload.key,
      name: payload.name,
      description: payload.description ?? '',
      sortOrder: payload.sortOrder ?? 0,
      createdAt: this.now()
    };
    this.teachingMethods.push(method);
    return this.delayed(method);
  }

  updateTeachingMethod(id: number, payload: UpdateTeachingMethodPayload): Observable<TeachingMethod> {
    const method = this.teachingMethods.find((m) => m.id === id);
    if (!method) throw new Error('TeachingMethod not found');
    Object.assign(method, payload);
    return this.delayed(method);
  }

  deleteTeachingMethod(id: number): Observable<ApiMessageResponse> {
    this.teachingMethods = this.teachingMethods.filter((m) => m.id !== id);
    return this.delayed({ message: 'روش تدریس حذف شد' });
  }

  getRings(): Observable<Ring[]> {
    return this.delayed([...this.rings]);
  }

  getRingById(id: number): Observable<Ring> {
    const ring = this.rings.find((r) => r.id === id);
    if (!ring) throw new Error('Ring not found');
    return this.delayed(ring);
  }

  createRing(payload: CreateRingPayload): Observable<Ring> {
    const ring: Ring = {
      id: this.nextId(this.rings),
      key: payload.key,
      name: payload.name,
      description: payload.description ?? '',
      madrasahId: payload.madrasahId,
      coachId: payload.coachId,
      courseId: payload.courseId,
      status: payload.status ?? 'active',
      gender: payload.gender,
      createdAt: this.now()
    };
    this.rings.push(ring);
    return this.delayed(ring);
  }

  updateRing(id: number, payload: UpdateRingPayload): Observable<Ring> {
    const ring = this.rings.find((r) => r.id === id);
    if (!ring) throw new Error('Ring not found');
    Object.assign(ring, payload, { updatedAt: this.now() });
    return this.delayed(ring);
  }

  deleteRing(id: number): Observable<ApiMessageResponse> {
    this.rings = this.rings.filter((r) => r.id !== id);
    this.ringStudents = this.ringStudents.filter((rs) => rs.ringId !== id);
    this.ringBooks = this.ringBooks.filter((rb) => rb.ringId !== id);
    this.ringTeachingMethods = this.ringTeachingMethods.filter((rtm) => rtm.ringId !== id);
    return this.delayed({ message: 'حلقه حذف شد' });
  }

  getRingStudents(ringId: number): Observable<RingStudent[]> {
    return this.delayed(this.ringStudents.filter((rs) => rs.ringId === ringId));
  }

  addRingStudent(ringId: number, payload: CreateRingStudentPayload): Observable<RingStudent> {
    const rs: RingStudent = {
      id: this.nextId(this.ringStudents),
      ringId,
      studentId: payload.studentId,
      joinedAt: this.now(),
      status: payload.status ?? 'active'
    };
    this.ringStudents.push(rs);
    return this.delayed(rs);
  }

  removeRingStudent(ringId: number, studentId: number): Observable<ApiMessageResponse> {
    this.ringStudents = this.ringStudents.filter(
      (rs) => !(rs.ringId === ringId && rs.studentId === studentId)
    );
    return this.delayed({ message: 'دانش‌آموز از حلقه حذف شد' });
  }

  addRingBook(ringId: number, payload: CreateRingBookPayload): Observable<ApiMessageResponse> {
    const rb: RingBook = {
      id: this.nextId(this.ringBooks),
      ringId,
      bookId: payload.bookId,
      sortOrder: payload.sortOrder ?? 0
    };
    this.ringBooks.push(rb);
    return this.delayed({ message: 'کتاب به حلقه اضافه شد' });
  }

  removeRingBook(ringId: number, bookId: number): Observable<ApiMessageResponse> {
    this.ringBooks = this.ringBooks.filter(
      (rb) => !(rb.ringId === ringId && rb.bookId === bookId)
    );
    return this.delayed({ message: 'کتاب از حلقه حذف شد' });
  }

  addRingTeachingMethod(ringId: number, payload: CreateRingTeachingMethodPayload): Observable<ApiMessageResponse> {
    const rtm: RingTeachingMethod = {
      id: this.nextId(this.ringTeachingMethods),
      ringId,
      teachingMethodId: payload.teachingMethodId
    };
    this.ringTeachingMethods.push(rtm);
    return this.delayed({ message: 'روش تدریس به حلقه اضافه شد' });
  }

  removeRingTeachingMethod(ringId: number, teachingMethodId: number): Observable<ApiMessageResponse> {
    this.ringTeachingMethods = this.ringTeachingMethods.filter(
      (rtm) => !(rtm.ringId === ringId && rtm.teachingMethodId === teachingMethodId)
    );
    return this.delayed({ message: 'روش تدریس از حلقه حذف شد' });
  }

  getObjectives(): Observable<CurriculumObjective[]> {
    return this.delayed([...this.objectives]);
  }

  createObjective(payload: CreateCurriculumObjectivePayload): Observable<CurriculumObjective> {
    const obj: CurriculumObjective = {
      id: this.nextId(this.objectives),
      key: payload.key,
      title: payload.title,
      description: payload.description ?? '',
      subjectAreaId: payload.subjectAreaId,
      parentObjectiveId: payload.parentObjectiveId,
      sortOrder: payload.sortOrder ?? 0,
      level: payload.level ?? 'beginner',
      createdAt: this.now()
    };
    this.objectives.push(obj);
    return this.delayed(obj);
  }

  updateObjective(id: number, payload: UpdateCurriculumObjectivePayload): Observable<CurriculumObjective> {
    const obj = this.objectives.find((o) => o.id === id);
    if (!obj) throw new Error('CurriculumObjective not found');
    Object.assign(obj, payload);
    return this.delayed(obj);
  }

  deleteObjective(id: number): Observable<ApiMessageResponse> {
    this.objectives = this.objectives.filter((o) => o.id !== id);
    return this.delayed({ message: 'هدف آموزشی حذف شد' });
  }

  getBooks(): Observable<Book[]> {
    return this.delayed([...this.books]);
  }

  createBook(payload: CreateBookPayload): Observable<Book> {
    const book: Book = {
      id: this.nextId(this.books),
      key: payload.key,
      title: payload.title,
      author: payload.author ?? '',
      subjectAreaId: payload.subjectAreaId,
      level: payload.level ?? '',
      publisher: payload.publisher ?? '',
      pages: payload.pages,
      createdAt: this.now()
    };
    this.books.push(book);
    return this.delayed(book);
  }

  updateBook(id: number, payload: UpdateBookPayload): Observable<Book> {
    const book = this.books.find((b) => b.id === id);
    if (!book) throw new Error('Book not found');
    Object.assign(book, payload);
    return this.delayed(book);
  }

  deleteBook(id: number): Observable<ApiMessageResponse> {
    this.books = this.books.filter((b) => b.id !== id);
    return this.delayed({ message: 'کتاب حذف شد' });
  }

  /* ─── Skill Progress ─── */

  private skillProgressRecords: StudentSkillProgress[] = [];
  private ageGroupData: AgeGroup[] = [
    { id: 1, key: '7-10', name: 'کودک (۷-۱۰ سال)', description: 'گروه سنی کودک', minAge: 7, maxAge: 10, sortOrder: 1 },
    { id: 2, key: '11-14', name: 'نوجوان (۱۱-۱۴ سال)', description: 'گروه سنی نوجوان', minAge: 11, maxAge: 14, sortOrder: 2 },
    { id: 3, key: '15-18', name: 'جوان (۱۵-۱۸ سال)', description: 'گروه سنی جوان', minAge: 15, maxAge: 18, sortOrder: 3 },
    { id: 4, key: '19-plus', name: 'بزرگسال (۱۹+ سال)', description: 'گروه سنی بزرگسال', minAge: 19, maxAge: 99, sortOrder: 4 },
  ];

  getAgeGroups(): Observable<AgeGroup[]> {
    return this.delayed([...this.ageGroupData]);
  }

  getSkillProgressByStudent(studentId: number): Observable<StudentSkillProgress[]> {
    return this.delayed(this.skillProgressRecords.filter((p) => p.studentId === studentId));
  }

  getSkillProgressByRing(ringId: number): Observable<StudentSkillProgress[]> {
    return this.delayed(this.skillProgressRecords.filter((p) => p.ringId === ringId));
  }

  updateSkillProgress(id: number, payload: UpdateSkillProgressPayload): Observable<StudentSkillProgress> {
    const record = this.skillProgressRecords.find((p) => p.id === id);
    if (!record) throw new Error('SkillProgress not found');
    Object.assign(record, payload);
    return this.delayed(record);
  }

  getProgressSummary(studentId: number): Observable<StudentProgressSummary> {
    const records = this.skillProgressRecords.filter((p) => p.studentId === studentId);

    const subjectAreas = records
      .filter((p) => p.objectiveTitle)
      .reduce((acc, p) => {
        const key = p.objectiveTitle.split(' ')[0]; // simple grouping
        if (!acc[key]) acc[key] = { scores: [], mastered: 0, total: 0 };
        acc[key].scores.push(p.score);
        if (p.proficiencyLevel === 'mastered') acc[key].mastered++;
        acc[key].total++;
        return acc;
      }, {} as Record<string, { scores: number[]; mastered: number; total: number }>);

    const subjectAreaList: SubjectAreaProgress[] = Object.entries(subjectAreas).map(([title, data], idx) => ({
      subjectAreaId: idx + 1,
      subjectAreaTitle: title,
      subjectAreaKey: title.toLowerCase().replace(/\s+/g, '-'),
      averageScore: data.scores.length ? data.scores.reduce((a, b) => a + b, 0) / data.scores.length : 0,
      masteredCount: data.mastered,
      totalObjectives: data.total,
    }));

    const summary: ProgressSummary = {
      totalObjectives: records.length,
      masteredCount: records.filter((p) => p.proficiencyLevel === 'mastered').length,
      achievedCount: records.filter((p) => p.proficiencyLevel === 'achieved').length,
      inProgressCount: records.filter((p) => p.proficiencyLevel === 'in_progress').length,
      notStartedCount: records.filter((p) => p.proficiencyLevel === 'not_started').length,
      averageScore: records.length ? Math.round(records.reduce((a, p) => a + p.score, 0) / records.length) : 0,
    };

    return this.delayed({
      studentId,
      summary,
      subjectAreas: subjectAreaList,
    });
  }

  syncFromSubmission(submissionId: number): Observable<ApiMessageResponse> {
    // Mock: just return success message
    return this.delayed({ message: 'پیشرفت مهارتی با موفقیت همگام‌سازی شد' });
  }

  getMyRings(): Observable<Ring[]> {
    // Mock: return coach's rings (for now return all rings as mock)
    return this.delayed([...this.rings]);
  }

  getMyRingStudents(): Observable<RingStudent[]> {
    // Mock: return all ring students for coach's rings
    return this.delayed([...this.ringStudents]);
  }

  getRingDashboard(ringId: number): Observable<RingDashboardDto> {
    // Mock: return dashboard data for a ring
    const ring = this.rings.find(r => r.id === ringId);
    const students = this.ringStudents.filter(rs => rs.ringId === ringId);
    
    const mockDashboard: RingDashboardDto = {
      ringId: ringId,
      ringName: ring?.name || '',
      studentCount: students.length,
      averageScore: 75,
      masteredCount: 0,
      achievedCount: 0,
      inProgressCount: 0,
      notStartedCount: 0,
      students: students.map(s => ({
        studentId: s.studentId,
        studentName: this.students.find(st => st.id === s.studentId)?.firstName + ' ' + this.students.find(st => st.id === s.studentId)?.lastName || '',
        score: 75,
        proficiencyLevel: 'in_progress',
        lastAssessedAt: undefined
      }))
    };
    return this.delayed(mockDashboard);
  }

  getParents(): Observable<Parent[]> {
    return this.delayed([...this.parents]);
  }

  createParent(payload: CreateParentPayload): Observable<Parent> {
    const parent: Parent = {
      id: this.nextId(this.parents),
      username: payload.username,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      address: payload.address ?? '',
      nationalCode: payload.nationalCode ?? '',
      branchId: payload.branchId,
      studentIds: payload.studentIds ?? [],
      status: 'active',
      createdAt: this.now()
    };
    this.parents.push(parent);
    return this.delayed(parent);
  }

  updateParent(id: number, payload: Partial<CreateParentPayload>): Observable<Parent> {
    const parent = this.parents.find((p) => p.id === id);
    if (!parent) throw new Error('Parent not found');
    Object.assign(parent, payload, { updatedAt: this.now() });
    return this.delayed(parent);
  }

  deleteParent(id: number): Observable<ApiMessageResponse> {
    this.parents = this.parents.filter((p) => p.id !== id);
    return this.delayed({ message: 'والد حذف شد' });
  }

  getParentStudents(parentId: number): Observable<ParentStudentInfo[]> {
    const parent = this.parents.find((p) => p.id === parentId);
    if (!parent) throw new Error('Parent not found');
    return this.delayed(
      parent.studentIds.map((studentId) => {
        const student = this.students.find((s) => s.id === studentId)!;
        return {
          studentId: student.id,
          studentName: `${student.firstName} ${student.lastName}`,
          studentCode: student.studentId,
          courseName: 'قرآن و معارف اسلامی',
          latestGrade: 0,
          attendanceRate: 100
        };
      })
    );
  }

  getEvaluators(): Observable<Evaluator[]> {
    return this.delayed([...this.evaluators]);
  }

  createEvaluator(payload: CreateEvaluatorPayload): Observable<Evaluator> {
    const evaluator: Evaluator = {
      id: this.nextId(this.evaluators),
      username: payload.username,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      expertise: payload.expertise ?? '',
      branchId: payload.branchId,
      assignedMadrasahIds: payload.assignedMadrasahIds ?? [],
      nationalCode: payload.nationalCode,
      status: 'active',
      createdAt: this.now()
    };
    this.evaluators.push(evaluator);
    return this.delayed(evaluator);
  }

  updateEvaluator(id: number, payload: Partial<CreateEvaluatorPayload>): Observable<Evaluator> {
    const evaluator = this.evaluators.find((e) => e.id === id);
    if (!evaluator) throw new Error('Evaluator not found');
    Object.assign(evaluator, payload, { updatedAt: this.now() });
    return this.delayed(evaluator);
  }

  deleteEvaluator(id: number): Observable<ApiMessageResponse> {
    this.evaluators = this.evaluators.filter((e) => e.id !== id);
    return this.delayed({ message: 'ارزیاب حذف شد' });
  }

  getEvaluationRecords(evaluatorId?: number): Observable<EvaluationRecord[]> {
    let result = [...this.evaluations];
    if (evaluatorId !== undefined) {
      result = result.filter((e) => e.evaluatorId === evaluatorId);
    }
    return this.delayed(result);
  }

  createEvaluation(payload: CreateEvaluationPayload): Observable<EvaluationRecord> {
    const evaluator = this.evaluators.find((e) => e.id === payload.evaluatorId);
    const record: EvaluationRecord = {
      id: this.nextId(this.evaluations),
      evaluatorId: payload.evaluatorId,
      evaluatorName: evaluator ? `${evaluator.firstName} ${evaluator.lastName}` : '',
      targetName: payload.targetName,
      targetType: payload.targetType,
      targetId: payload.targetId,
      score: payload.score,
      feedback: payload.feedback,
      evaluationDate: payload.evaluationDate,
      createdAt: this.now()
    };
    this.evaluations.push(record);
    return this.delayed(record);
  }

  deleteEvaluation(id: number): Observable<ApiMessageResponse> {
    this.evaluations = this.evaluations.filter((e) => e.id !== id);
    return this.delayed({ message: 'ارزیابی حذف شد' });
  }

  getHeadquartersSummary(): Observable<HeadquartersSummary> {
    return this.delayed({
      totalStudents: this.students.length,
      totalCoaches: this.coaches.length,
      totalBranchManagers: this.branchManagers.length,
      totalEvaluators: this.evaluators.length,
      totalParents: this.parents.length,
      totalCourses: this.courses.length,
      activeCourses: this.courses.filter((c) => c.status === 'active').length,
      totalAssignments: this.assignments.length,
      totalSubmissions: this.submissions.length,
      totalMadrasahs: this.madrasahs.length,
      totalBranches: this.maktabBranches.length,
      averageScore: 0,
      averageAttendanceRate: 100,
      lastUpdated: this.now()
    });
  }

  getBranchPerformance(): Observable<BranchPerformance[]> {
    return this.delayed(
      this.branches.map((b) => ({
        branchId: b.id,
        branchName: b.name,
        province: b.province,
        madrasahName: 'مدرسه نمونه',
        studentCount: this.students.length,
        averageScore: 0,
        attendanceRate: 100,
        activeCourses: this.courses.filter((c) => c.status === 'active').length,
        evaluationCount: 0,
        averageEvaluationScore: 0,
        status: 'active' as const
      }))
    );
  }

  getCoachPerformance(): Observable<CoachPerformance[]> {
    return this.delayed(
      this.coaches.map((c) => ({
        coachId: c.id,
        coachName: `${c.firstName} ${c.lastName}`,
        specialization: c.specialization,
        assignedCourseCount: c.assignedCourseIds.length,
        studentCount: this.students.length,
        averageStudentScore: 0,
        evaluationCount: 0,
        averageEvaluationScore: 0,
        status: c.status
      }))
    );
  }

  getAssessments(): Observable<Assessment[]> {
    return this.delayed(this.assessments);
  }

  getAssessmentById(id: number): Observable<Assessment> {
    const assessment = this.assessments.find((a) => a.id === id);
    if (!assessment) {
      return this.delayed(null as unknown as Assessment);
    }
    return this.delayed(assessment);
  }

  getAssessmentsByCourse(courseId: number): Observable<Assessment[]> {
    return this.delayed(this.assessments.filter((a) => a.courseId === courseId));
  }

  getAssessmentsByDateRange(courseId: number, startDate: string, endDate: string): Observable<Assessment[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return this.delayed(
      this.assessments.filter((a) => {
        const date = new Date(a.assessmentDate);
        return a.courseId === courseId && date >= start && date <= end;
      })
    );
  }

  createAssessment(payload: Partial<Assessment>): Observable<Assessment> {
    const assessment: Assessment = {
      id: this.nextId('assessment'),
      title: payload.title ?? '',
      description: payload.description ?? '',
      type: payload.type ?? 'weekly',
      maxScore: payload.maxScore ?? 100,
      durationMinutes: payload.durationMinutes ?? 60,
      assessmentDate: payload.assessmentDate ?? this.now(),
      status: payload.status ?? 'draft',
      instructions: payload.instructions,
      courseId: payload.courseId ?? 0,
      generatedByUserId: payload.generatedByUserId,
      generationCriteria: payload.generationCriteria,
      questions: [],
      results: [],
      createdAt: this.now(),
      updatedAt: this.now()
    };
    this.assessments.push(assessment);
    return this.delayed(assessment);
  }

  updateAssessment(id: number, payload: Partial<Assessment>): Observable<Assessment> {
    const assessment = this.assessments.find((a) => a.id === id);
    if (!assessment) {
      return this.delayed(null as unknown as Assessment);
    }
    Object.assign(assessment, payload, { updatedAt: this.now() });
    return this.delayed(assessment);
  }

  deleteAssessment(id: number): Observable<ApiMessageResponse> {
    this.assessments = this.assessments.filter((a) => a.id !== id);
    return this.delayed({ message: 'Assessment deleted' });
  }

  generateWeeklyAssessment(payload: GenerateWeeklyAssessmentPayload): Observable<Assessment> {
    const assessment: Assessment = {
      id: this.nextId('assessment'),
      title: payload.title,
      description: payload.description,
      type: 'weekly',
      maxScore: payload.maxScore,
      durationMinutes: payload.durationMinutes,
      assessmentDate: payload.assessmentDate,
      status: 'draft',
      instructions: 'این ارزیابی هفتگی بر اساس پیشرفت شما و محتوای درس‌های هفته قبل تولید شده است.',
      courseId: payload.courseId,
      generatedByUserId: payload.generatedByUserId,
      generationCriteria: JSON.stringify(payload.criteria),
      questions: this.generateMockQuestions(payload.courseId),
      results: [],
      createdAt: this.now(),
      updatedAt: this.now()
    };
    this.assessments.push(assessment);
    return this.delayed(assessment);
  }

  getAssessmentQuestions(assessmentId: number): Observable<AssessmentQuestion[]> {
    const assessment = this.assessments.find((a) => a.id === assessmentId);
    return this.delayed(assessment?.questions ?? []);
  }

  createAssessmentQuestion(assessmentId: number, payload: AssessmentQuestionPayload): Observable<AssessmentQuestion> {
    const question: AssessmentQuestion = {
      id: this.nextId('question'),
      type: payload.type,
      questionText: payload.questionText,
      optionsJson: payload.optionsJson,
      correctAnswerJson: payload.correctAnswerJson,
      points: payload.points,
      order: payload.order,
      difficulty: payload.difficulty,
      topic: payload.topic,
      explanation: payload.explanation,
      assessmentId,
      createdAt: this.now(),
      updatedAt: this.now()
    };
    const assessment = this.assessments.find((a) => a.id === assessmentId);
    if (assessment) {
      assessment.questions = assessment.questions ?? [];
      assessment.questions.push(question);
    }
    return this.delayed(question);
  }

  updateAssessmentQuestion(questionId: number, payload: AssessmentQuestionPayload): Observable<AssessmentQuestion> {
    for (const assessment of this.assessments) {
      const question = assessment.questions?.find((q) => q.id === questionId);
      if (question) {
        Object.assign(question, payload, { updatedAt: this.now() });
        return this.delayed(question);
      }
    }
    return this.delayed(null as unknown as AssessmentQuestion);
  }

  deleteAssessmentQuestion(questionId: number): Observable<ApiMessageResponse> {
    for (const assessment of this.assessments) {
      assessment.questions = assessment.questions?.filter((q) => q.id !== questionId);
    }
    return this.delayed({ message: 'Question deleted' });
  }

  submitAssessmentResult(assessmentId: number, payload: SubmitAssessmentResultPayload): Observable<AssessmentResult> {
    const result: AssessmentResult = {
      id: this.nextId('result'),
      completedAt: payload.completedAt,
      score: payload.score,
      maxPossibleScore: payload.maxPossibleScore,
      percentage: payload.percentage,
      status: payload.status,
      answersJson: payload.answersJson,
      feedback: payload.feedback,
      timeSpentMinutes: payload.timeSpentMinutes,
      assessmentId,
      studentId: payload.studentId,
      createdAt: this.now(),
      updatedAt: this.now()
    };
    const assessment = this.assessments.find((a) => a.id === assessmentId);
    if (assessment) {
      assessment.results = assessment.results ?? [];
      assessment.results.push(result);
    }
    return this.delayed(result);
  }

  startAssessment(assessmentId: number, studentId: number): Observable<AssessmentResult> {
    const assessment = this.assessments.find((a) => a.id === assessmentId);
    if (!assessment) {
      return this.delayed(null as unknown as AssessmentResult);
    }
    const existing = (assessment.results ?? []).find((r) => r.studentId === studentId);
    if (existing) {
      return this.delayed(existing);
    }
    const result: AssessmentResult = {
      id: this.nextId('result'),
      assessmentId,
      studentId,
      status: 'in_progress',
      score: 0,
      maxPossibleScore: assessment?.maxScore ?? 100,
      percentage: 0,
      completedAt: this.now(),
      timeSpentMinutes: 0,
      createdAt: this.now(),
      updatedAt: this.now()
    };
    assessment.results = assessment.results ?? [];
    assessment.results.push(result);
    return this.delayed(result);
  }

  getAssessmentResults(assessmentId: number): Observable<AssessmentResult[]> {
    const assessment = this.assessments.find((a) => a.id === assessmentId);
    return this.delayed(assessment?.results ?? []);
  }

  getStudentAssessmentResults(studentId: number): Observable<AssessmentResult[]> {
    const results: AssessmentResult[] = [];
    for (const assessment of this.assessments) {
      const studentResults = assessment.results?.filter((r) => r.studentId === studentId) ?? [];
      results.push(...studentResults);
    }
    return this.delayed(results);
  }

  getAssessmentAnalytics(assessmentId: number): Observable<AssessmentAnalytics> {
    const assessment = this.assessments.find((a) => a.id === assessmentId);
    if (!assessment) {
      return this.delayed(null as unknown as AssessmentAnalytics);
    }
    const results = assessment.results ?? [];
    const completedResults = results.filter((r) => r.status === 'completed');
    return this.delayed({
      assessment: {
        id: assessment.id,
        title: assessment.title,
        type: assessment.type,
        maxScore: assessment.maxScore,
        assessmentDate: assessment.assessmentDate,
        status: assessment.status
      },
      totalStudents: results.length,
      completedCount: completedResults.length,
      completionRate: results.length > 0 ? (completedResults.length / results.length) * 100 : 0,
      averageScore: completedResults.length > 0
        ? completedResults.reduce((sum, r) => sum + r.percentage, 0) / completedResults.length
        : 0,
      passRate: completedResults.length > 0
        ? (completedResults.filter((r) => r.percentage >= 60).length / completedResults.length) * 100
        : 0,
      questionStats: (assessment.questions ?? []).map((q) => ({
        questionId: q.id,
        questionText: q.questionText,
        topic: q.topic,
        difficulty: q.difficulty,
        points: q.points,
        correctRate: 0
      }))
    });
  }

  getStudentAssessmentHistory(studentId: number, courseId: number): Observable<StudentAssessmentHistory> {
    const student = this.students.find((s) => s.id === studentId);
    const courseAssessments = this.assessments.filter((a) => a.courseId === courseId);
    const history = courseAssessments.map((a) => ({
      assessment: {
        id: a.id,
        title: a.title,
        type: a.type,
        assessmentDate: a.assessmentDate,
        maxScore: a.maxScore,
        status: a.status
      },
      result: a.results?.find((r) => r.studentId === studentId) ?? null
    }));
    const completedResults = history
      .filter((h) => h.result !== null)
      .map((h) => ({ date: h.result!.completedAt, score: h.result!.percentage }));
    return this.delayed({
      student: {
        id: student?.id ?? 0,
        name: student ? `${student.firstName} ${student.lastName}` : '',
        studentId: student?.studentId ?? ''
      },
      history,
      trend: completedResults,
      statistics: {
        totalAssessments: courseAssessments.length,
        completedAssessments: completedResults.length,
        averageScore: completedResults.length > 0
          ? completedResults.reduce((sum, r) => sum + r.score, 0) / completedResults.length
          : 0,
        bestScore: completedResults.length > 0 ? Math.max(...completedResults.map((r) => r.score)) : 0
      }
    });
  }

  getSpiritualPractices(): Observable<SpiritualPracticeItem[]> {
    return this.delayed([...this.spiritualPracticeItems]);
  }

  getSpiritualPracticesForMe(age?: number, gender?: string, role?: string): Observable<SpiritualPracticeItem[]> {
    let items = [...this.spiritualPracticeItems];
    if (age !== undefined) {
      items = items.filter(p => (p.minAge === undefined || p.minAge <= age) && (p.maxAge === undefined || p.maxAge >= age));
    }
    if (gender) {
      items = items.filter(p => p.genderMask === 'mixed' || p.genderMask === gender);
    }
    if (role) {
      items = items.filter(p => p.roleMask === '*' || p.roleMask === role);
    }
    return this.delayed(items);
  }

  getSpiritualOccasions(): Observable<SpiritualOccasion[]> {
    return this.delayed([...this.spiritualOccasions]);
  }

  getSpiritualOccasionDetail(occasionId: number): Observable<SpiritualOccasionDetail> {
    const occasion = this.spiritualOccasions.find(o => o.id === occasionId);
    if (!occasion) return this.delayed({} as SpiritualOccasionDetail);
    return this.delayed({
      ...occasion,
      practices: this.spiritualPracticeItems.slice(0, 3)
    });
  }

  getDailySpiritualEntry(userId: number, date: string): Observable<DailySpiritualEntry> {
    const entry = this.dailySpiritualEntries.find(e => e.userId === userId && e.entryDate === date);
    if (!entry) return this.delayed({} as DailySpiritualEntry);
    return this.delayed(entry);
  }

  upsertDailySpiritualEntry(payload: UpsertDailySpiritualEntryPayload): Observable<DailySpiritualEntry> {
    const now = this.now();
    const existing = this.dailySpiritualEntries.find(e => e.userId === payload.userId && e.entryDate === payload.entryDate);
    if (existing) {
      existing.moodScore = payload.moodScore;
      existing.notes = payload.notes;
      existing.completedSteps = payload.completedSteps;
      existing.updatedAt = now;
      return this.delayed(existing);
    }
    const entry: DailySpiritualEntry = {
      id: this.nextId(this.dailySpiritualEntries),
      userId: payload.userId,
      entryDate: payload.entryDate,
      moodScore: payload.moodScore,
      notes: payload.notes,
      completedSteps: payload.completedSteps,
      createdAt: now,
      updatedAt: now
    };
    this.dailySpiritualEntries.push(entry);
    return this.delayed(entry);
  }

  getSpiritualEntryHistory(userId: number, fromDate?: string, toDate?: string): Observable<DailySpiritualEntry[]> {
    let entries = this.dailySpiritualEntries.filter(e => e.userId === userId);
    if (fromDate) entries = entries.filter(e => e.entryDate >= fromDate!);
    if (toDate) entries = entries.filter(e => e.entryDate <= toDate!);
    entries.sort((a, b) => b.entryDate.localeCompare(a.entryDate));
    return this.delayed(entries);
  }

  getSpiritualStreak(userId: number): Observable<{ streak: number }> {
    const entries = this.dailySpiritualEntries
      .filter(e => e.userId === userId)
      .sort((a, b) => b.entryDate.localeCompare(a.entryDate));
    let streak = 0;
    if (entries.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      if (entries[0].entryDate === today || entries[0].entryDate === this.yesterday()) {
        streak = 1;
        for (let i = 1; i < entries.length; i++) {
          const prev = new Date(entries[i - 1].entryDate);
          const curr = new Date(entries[i].entryDate);
          const diff = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
          if (diff === 1) streak++;
          else break;
        }
      }
    }
    return this.delayed({ streak });
  }

  private yesterday(): string {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  }

  getUserOccasionProgress(userId: number, occasionId?: number, hijriYear?: number): Observable<UserOccasionProgress[]> {
    let items = this.userOccasionProgress.filter(p => p.userId === userId);
    if (occasionId !== undefined) items = items.filter(p => p.occasionId === occasionId);
    if (hijriYear !== undefined) items = items.filter(p => p.hijriYear === hijriYear);
    return this.delayed(items);
  }

  markOccasionPractice(payload: MarkOccasionPracticePayload): Observable<UserOccasionProgress> {
    const now = this.now();
    const existing = this.userOccasionProgress.find(p =>
      p.userId === payload.userId && p.occasionId === payload.occasionId &&
      p.practiceItemId === payload.practiceItemId && p.hijriYear === payload.hijriYear);
    if (existing) {
      existing.isCompleted = payload.isCompleted;
      existing.completedAt = payload.isCompleted ? now : undefined;
      existing.notes = payload.notes;
      existing.updatedAt = now;
      return this.delayed(existing);
    }
    const progress: UserOccasionProgress = {
      id: this.nextId(this.userOccasionProgress),
      userId: payload.userId,
      occasionId: payload.occasionId,
      practiceItemId: payload.practiceItemId,
      hijriYear: payload.hijriYear,
      isCompleted: payload.isCompleted,
      completedAt: payload.isCompleted ? now : undefined,
      notes: payload.notes,
      createdAt: now,
      updatedAt: now
    };
    this.userOccasionProgress.push(progress);
    return this.delayed(progress);
  }

  getAvailablePaths(studentId: number): Observable<AvailablePath[]> {
    const student = this.students.find(s => s.id === studentId);
    const gender = student?.gender ?? 'mixed';
    const paths = this.spiritualPaths
      .filter(p => p.status === 'active' && (p.genderMask === 'mixed' || p.genderMask === gender))
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(p => ({ ...p }));
    return this.delayed(paths);
  }

  submitPathRanking(studentId: number, payload: PathRankingPayload): Observable<StudentPathSelection> {
    const now = this.now();
    let selection = this.studentPathSelections.find(s => s.studentId === studentId);
    if (!selection) {
      selection = {
        id: this.nextId(this.studentPathSelections),
        studentId,
        hijriSelectionYear: new Date().getFullYear(),
        stage: 'ranking',
        selectedAt: now,
        updatedAt: now
      };
      this.studentPathSelections.push(selection);
    }
    selection.stage = 'ranking';
    selection.updatedAt = now;
    return this.delayed({ ...selection });
  }

  finalizePath(payload: FinalizePathPayload): Observable<StudentPathSelection> {
    const now = this.now();
    let selection = this.studentPathSelections.find(s => s.studentId === payload.studentId);
    if (!selection) {
      selection = {
        id: this.nextId(this.studentPathSelections),
        studentId: payload.studentId,
        hijriSelectionYear: new Date().getFullYear(),
        stage: 'finalized',
        finalizedPathId: payload.pathId,
        selectedAt: now,
        finalizedAt: now,
        updatedAt: now
      };
      this.studentPathSelections.push(selection);
    } else {
      selection.stage = 'finalized';
      selection.finalizedPathId = payload.pathId;
      selection.finalizedAt = now;
      selection.updatedAt = now;
    }
    return this.delayed({ ...selection });
  }

  switchFinalizedPath(payload: FinalizePathPayload): Observable<StudentPathSelection> {
    const now = this.now();
    const selection = this.studentPathSelections.find(s => s.studentId === payload.studentId);
    if (!selection) return this.delayed({} as StudentPathSelection);
    selection.finalizedPathId = payload.pathId;
    selection.updatedAt = now;
    return this.delayed({ ...selection });
  }

  getStudentPathSelection(studentId: number): Observable<StudentPathSelection> {
    const selection = this.studentPathSelections.find(s => s.studentId === studentId);
    if (!selection) return this.delayed({} as StudentPathSelection);
    return this.delayed({ ...selection });
  }

  getStudentPathHistory(studentId: number): Observable<unknown[]> {
    return this.delayed([]);
  }

  // Monthly Booklets
  getMonthlyBooklets(studentId?: number): Observable<MonthlyBooklet[]> {
    let booklets = [...this.monthlyBooklets];
    if (studentId !== undefined) {
      booklets = booklets.filter((b) => b.studentId === studentId);
    }
    return this.delayed(booklets);
  }

  getMonthlyBookletById(id: number): Observable<MonthlyBooklet> {
    const booklet = this.monthlyBooklets.find((b) => b.id === id);
    return this.delayed(booklet ?? ({} as MonthlyBooklet));
  }

  getMonthlyBookletsByStudent(studentId: number): Observable<MonthlyBooklet[]> {
    return this.delayed(this.monthlyBooklets.filter((b) => b.studentId === studentId));
  }

  getMonthlyBookletByPeriod(studentId: number, year: number, month: number): Observable<MonthlyBooklet> {
    const booklet = this.monthlyBooklets.find(
      (b) => b.studentId === studentId && b.month === month && b.year === year
    );
    return this.delayed(booklet ?? ({} as MonthlyBooklet));
  }

  createMonthlyBooklet(payload: CreateMonthlyBookletPayload): Observable<MonthlyBooklet> {
    const booklet: MonthlyBooklet = {
      id: this.nextId(this.monthlyBooklets),
      studentId: payload.studentId,
      studentName: '',
      month: payload.month,
      year: payload.year,
      title: payload.title,
      content: payload.content,
      status: 'draft',
      createdByUserId: payload.createdByUserId,
      createdAt: this.now(),
      updatedAt: this.now()
    };
    this.monthlyBooklets.push(booklet);
    return this.delayed(booklet);
  }

  updateMonthlyBooklet(id: number, payload: UpdateMonthlyBookletPayload): Observable<MonthlyBooklet> {
    const booklet = this.monthlyBooklets.find((b) => b.id === id);
    if (!booklet) throw new Error('MonthlyBooklet not found');
    if (payload.title !== undefined) booklet.title = payload.title;
    if (payload.content !== undefined) booklet.content = payload.content;
    if (payload.status !== undefined) booklet.status = payload.status;
    booklet.updatedAt = this.now();
    return this.delayed(booklet);
  }

  deleteMonthlyBooklet(id: number): Observable<ApiMessageResponse> {
    this.monthlyBooklets = this.monthlyBooklets.filter((b) => b.id !== id);
    return this.delayed({ message: 'دفترچه ماهانه حذف شد' });
  }

  // Curriculum Versions
  getCurriculumVersions(): Observable<CurriculumVersion[]> {
    return this.delayed([...this.curriculumVersions]);
  }

  getCurriculumVersionById(id: number): Observable<CurriculumVersion> {
    const version = this.curriculumVersions.find((v) => v.id === id);
    return this.delayed(version ?? ({} as CurriculumVersion));
  }

  getActiveCurriculumVersion(): Observable<CurriculumVersion> {
    const now = new Date();
    const active = this.curriculumVersions.find(
      (v) => v.status === 'published' && new Date(v.validFrom) <= now && (!v.validTo || new Date(v.validTo) >= now)
    );
    return this.delayed(active ?? ({} as CurriculumVersion));
  }

  createCurriculumVersion(payload: CreateCurriculumVersionPayload): Observable<CurriculumVersion> {
    const version: CurriculumVersion = {
      id: this.nextId(this.curriculumVersions),
      key: payload.key,
      versionNumber: payload.versionNumber,
      description: payload.description,
      status: payload.status,
      validFrom: payload.validFrom,
      validTo: payload.validTo,
      createdAt: this.now(),
      updatedAt: this.now()
    };
    this.curriculumVersions.push(version);
    return this.delayed(version);
  }

  updateCurriculumVersion(id: number, payload: UpdateCurriculumVersionPayload): Observable<CurriculumVersion> {
    const version = this.curriculumVersions.find((v) => v.id === id);
    if (!version) throw new Error('CurriculumVersion not found');
    if (payload.versionNumber !== undefined) version.versionNumber = payload.versionNumber;
    if (payload.description !== undefined) version.description = payload.description;
    if (payload.status !== undefined) version.status = payload.status;
    if (payload.validFrom !== undefined) version.validFrom = payload.validFrom;
    if (payload.validTo !== undefined) version.validTo = payload.validTo;
    version.updatedAt = this.now();
    return this.delayed(version);
  }

  deleteCurriculumVersion(id: number): Observable<ApiMessageResponse> {
    this.curriculumVersions = this.curriculumVersions.filter((v) => v.id !== id);
    return this.delayed({ message: 'نسخه برنامه درسی حذف شد' });
  }

  // Progression
  checkProgression(studentId: number): Observable<ProgressionResult> {
    const student = this.students.find((s) => s.id === studentId);
    if (!student) throw new Error('Student not found');
    return this.delayed({
      studentId,
      studentName: `${student.firstName} ${student.lastName}`,
      currentLevel: 'intermediate',
      currentRing: 'ring-beginner',
      canProgress: true,
      blockingReasons: [],
      skillMasteryRates: {},
      checkedAt: this.now()
    });
  }

  checkRingProgression(ringId: number): Observable<ProgressionResult[]> {
    const ringStudents = this.ringStudents
      .filter((rs) => rs.ringId === ringId && rs.status === 'active')
      .map((rs) => rs.studentId);
    const results: ProgressionResult[] = ringStudents.map((studentId) => {
      const student = this.students.find((s) => s.id === studentId);
      return {
        studentId,
        studentName: student ? `${student.firstName} ${student.lastName}` : `Student ${studentId}`,
        currentLevel: 'beginner',
        currentRing: 'ring-beginner',
        canProgress: false,
        blockingReasons: ['پیشرفت کافی نیست'],
        skillMasteryRates: {},
        checkedAt: this.now()
      };
    });
    return this.delayed(results);
  }

  recordProgression(payload: { studentId: number; fromLevel: string; toLevel: string }): Observable<StudentPathHistory> {
    const history: StudentPathHistory = {
      id: this.nextId(this.progressionRecords),
      studentId: payload.studentId,
      studentName: '',
      changedByUserId: 0,
      previousStage: payload.fromLevel,
      newStage: payload.toLevel,
      reason: `پیشرفت از ${payload.fromLevel} به ${payload.toLevel}`,
      changedAt: this.now()
    };
    this.progressionRecords.push(history);
    return this.delayed(history);
  }

  // Biweekly Progress (Phase 4)
  getBiweeklyProgress(studentId: number): Observable<BiweeklyProgressResponse> {
    const student = this.students.find((s) => s.id === studentId);
    if (!student) throw new Error('Student not found');

    const now = new Date();
    const periodEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const periodStart = new Date(periodEnd);
    periodStart.setDate(periodStart.getDate() - 13);

    // Generate mock data points for 14 days
    const dataPoints: AssignmentProgressItem[] = [];
    const courses = this.courses.filter((c) => c.status === 'active');
    let totalAssignments = 0;
    let completedAssignments = 0;
    let totalScore = 0;
    let scoredCount = 0;

    for (let i = 0; i < 14; i++) {
      const date = new Date(periodStart);
      date.setDate(date.getDate() + i);
      
      const dayAssignments = this.assignments.filter((a) => {
        const assignmentDate = new Date(a.assignmentDate);
        return assignmentDate.getDate() === date.getDate() && 
               assignmentDate.getMonth() === date.getMonth() && 
               assignmentDate.getFullYear() === date.getFullYear();
      });

      const dayCompleted = dayAssignments.filter((a) => 
        this.submissions.some((s) => s.assignmentId === a.id && s.studentId === studentId)
      ).length;
      
      totalAssignments += dayAssignments.length;
      completedAssignments += dayCompleted;
      
      const daySubmissions = this.submissions.filter((s) => 
        dayAssignments.some((a) => a.id === s.assignmentId) && s.studentId === studentId
      );
      
      daySubmissions.forEach((sub) => {
        if (sub.dailyScore && sub.dailyScore > 0) {
          totalScore += sub.dailyScore;
          scoredCount++;
        }
      });

      dataPoints.push({
        assignmentId: dayAssignments[0]?.id ?? 0,
        assignmentTitle: dayAssignments[0]?.title ?? `تکلیف ${date.getDate()}/${date.getMonth() + 1}`,
        assignmentDate: date.toISOString().split('T')[0],
        isSubmitted: dayCompleted > 0,
        dailyScore: daySubmissions[0]?.dailyScore ?? undefined,
        cumulativeScore: daySubmissions[0]?.cumulativeScore ?? undefined,
        status: dayCompleted > 0 ? 'submitted' : 'pending'
      });
    }

    const completionPercentage = totalAssignments > 0 ? (completedAssignments / totalAssignments) * 100 : 0;
    const averageScore = scoredCount > 0 ? totalScore / scoredCount : 0;

    return this.delayed({
      studentId,
      studentName: `${student.firstName} ${student.lastName}`,
      periodStart: periodStart.toISOString().split('T')[0],
      periodEnd: periodEnd.toISOString().split('T')[0],
      totalAssignments,
      completedAssignments,
      pendingAssignments: totalAssignments - completedAssignments,
      completionPercentage: Math.round(completionPercentage * 10) / 10,
      averageScore: Math.round(averageScore * 10) / 10,
      totalSubmissions: this.submissions.filter((s) => s.studentId === studentId).length,
      assignments: dataPoints
    });
  }

  getTeachers(): Observable<Teacher[]> {
    return this.delayed([...this.teachers]);
  }

  getTeacherById(id: number): Observable<Teacher> {
    const teacher = this.teachers.find(t => t.id === id);
    return this.delayed(teacher ?? ({} as Teacher));
  }

  createTeacher(payload: CreateTeacherPayload): Observable<Teacher> {
    const teacher: Teacher = {
      id: this.nextId(this.teachers),
      username: payload.username,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      specialization: payload.specialization,
      nationalCode: payload.nationalCode,
      branchId: payload.branchId,
      status: 'active',
      createdAt: this.now(),
      updatedAt: this.now()
    };
    this.teachers.push(teacher);
    return this.delayed(teacher);
  }

  updateTeacher(id: number, payload: UpdateTeacherPayload): Observable<Teacher> {
    const teacher = this.teachers.find(t => t.id === id);
    if (!teacher) throw new Error('Teacher not found');
    Object.assign(teacher, payload, { updatedAt: this.now() });
    return this.delayed(teacher);
  }

  deleteTeacher(id: number): Observable<ApiMessageResponse> {
    this.teachers = this.teachers.filter(t => t.id !== id);
    return this.delayed({ message: 'استاد حذف شد' });
  }

  getTeachersByCourse(courseId: number): Observable<Teacher[]> {
    const teacherIds = this.teacherCourses.filter(tc => tc.courseId === courseId).map(tc => tc.teacherId);
    return this.delayed(this.teachers.filter(t => teacherIds.includes(t.id)));
  }

  getTeacherDashboardSummary(teacherId: number): Observable<TeacherDashboardSummary> {
    const courses = this.teacherCourses.filter(tc => tc.teacherId === teacherId);
    const gradings = this.assignmentGradings.filter(g => g.teacherId === teacherId);
    return this.delayed({
      totalCourses: courses.length,
      totalStudents: 0,
      pendingGradings: gradings.filter(g => g.status === 'pending').length,
      completedGradings: gradings.filter(g => g.status === 'completed').length,
      averageScore: gradings.length > 0 ? Math.round(gradings.reduce((sum, g) => sum + (g.dailyScore ?? 0), 0) / gradings.length) : 0
    });
  }

  getTeacherCourses(teacherId: number): Observable<TeacherCourse[]> {
    return this.delayed(this.teacherCourses.filter(tc => tc.teacherId === teacherId));
  }

  getTeacherGradings(teacherId: number): Observable<AssignmentGrading[]> {
    return this.delayed(this.assignmentGradings.filter(g => g.teacherId === teacherId));
  }

  getPendingGradings(teacherId: number): Observable<AssignmentGrading[]> {
    return this.delayed(this.assignmentGradings.filter(g => g.teacherId === teacherId && g.status === 'pending'));
  }

  gradeSubmission(payload: GradeSubmissionPayload): Observable<AssignmentGrading> {
    const grading: AssignmentGrading = {
      id: this.nextId(this.assignmentGradings),
      submissionId: payload.submissionId,
      teacherId: payload.teacherId,
      dailyScore: payload.dailyScore,
      cumulativeScore: payload.cumulativeScore,
      status: payload.status ?? 'completed',
      feedback: payload.feedback,
      gradedAt: this.now()
    };
    this.assignmentGradings.push(grading);
    return this.delayed(grading);
  }

  private competitions: Competition[] = [
    { id: 1, title: 'مسابقه ریاضی پیشرفته', description: 'مسابقه مفاهیم پیشرفته ریاضی', type: 'assignment_based', startDate: '2026-07-01', endDate: '2026-07-30', status: 'published', courseId: 1, courseName: 'ریاضی', participantCount: 12, createdAt: '2026-06-25' },
    { id: 2, title: 'مسابقه علوم تجربی', description: 'آزمون جامع علوم', type: 'assessment_based', startDate: '2026-07-15', endDate: '2026-08-15', status: 'draft', participantCount: 0, createdAt: '2026-07-10' }
  ];

  private competitionParticipants: CompetitionParticipant[] = [
    { id: 1, studentId: 1, studentName: 'علی احمدی', score: 92, rank: 1, completedAt: '2026-07-20' },
    { id: 2, studentId: 2, studentName: 'فاطمه محمدی', score: 85, rank: 2, completedAt: '2026-07-20' }
  ];

  private leagues: League[] = [
    { id: 1, name: 'لیگ ریاضی تابستان', description: 'رقابت گروهی ریاضی', season: 'تابستان ۱۴۰۵', startDate: '2026-07-01', endDate: '2026-09-30', status: 'active', courseId: 1, courseName: 'ریاضی', participantCount: 8, createdAt: '2026-06-20' }
  ];

  private leagueRankings: LeagueRanking[] = [
    { id: 1, studentId: 1, studentName: 'علی احمدی', score: 280, rank: 1, previousRank: 2, trend: 'up', lastUpdated: '2026-07-23' },
    { id: 2, studentId: 2, studentName: 'فاطمه محمدی', score: 245, rank: 2, previousRank: 1, trend: 'down', lastUpdated: '2026-07-23' },
    { id: 3, studentId: 3, studentName: 'محمد رضایی', score: 210, rank: 3, trend: 'stable', lastUpdated: '2026-07-23' }
  ];

  private issueSurveys: IssueSurvey[] = [
    { id: 1, title: 'نظرسنجی جامع مسائل مکتب', description: 'نظرسنجی جامع برای ارزیابی مسائل مکتب از دیدگاه دانش‌آموزان و آموزجوها', surveyType: 'general', targetRole: 'all', status: 'active', startDate: '2026-07-01', endDate: '2026-07-31', isAnonymous: true, scoreScaleMin: 1, scoreScaleMax: 5, createdById: 1, createdByName: 'مدیر سیستم', createdAt: '2026-07-01', updatedAt: '2026-07-01', questionCount: 184, responseCount: 27 }
  ];
  private issueQuestions: IssueSurveyQuestion[] = [];
  private issuePoolItems: IssueItemPool[] = [];
  private issueResponses: IssueSurveyResponse[] = [];
  private issueComments: IssueSurveyComment[] = [
    { id: 1, surveyId: 1, respondentId: 1, respondentName: 'علی احمدی', comment: 'نظرسنجی خوبی بود و نتایج آن بینش‌آور بود.', isPublic: true, createdAt: '2026-07-10' },
    { id: 2, surveyId: 1, respondentId: 2, respondentName: 'فاطمه محمدی', comment: 'سوالات بسیار جامع بودند.', isPublic: true, createdAt: '2026-07-11' }
  ];
  private issueActions: IssueAction[] = [];
  private issueActionUpdates: IssueActionUpdate[] = [];

  getCompetitions(): Observable<Competition[]> {
    return this.delayed(this.competitions);
  }

  getActiveCompetitions(): Observable<Competition[]> {
    return this.delayed(this.competitions.filter(c => c.status === 'published' || c.status === 'in_progress'));
  }

  getCompetitionById(id: number): Observable<CompetitionDetail> {
    const comp = this.competitions.find(c => c.id === id);
    if (!comp) throw new Error('مسابقه یافت نشد');
    return this.delayed({ ...comp, participants: this.competitionParticipants.filter(p => p.studentId <= (comp.participantCount || 2)) });
  }

  createCompetition(payload: CreateCompetitionPayload): Observable<Competition> {
    const comp: Competition = { id: this.nextId(this.competitions), ...payload, status: 'draft', participantCount: 0, createdAt: this.now() };
    this.competitions.push(comp);
    return this.delayed(comp);
  }

  updateCompetition(id: number, payload: UpdateCompetitionPayload): Observable<Competition> {
    const idx = this.competitions.findIndex(c => c.id === id);
    if (idx < 0) throw new Error('مسابقه یافت نشد');
    this.competitions[idx] = { ...this.competitions[idx], ...payload };
    return this.delayed(this.competitions[idx]);
  }

  deleteCompetition(id: number): Observable<ApiMessageResponse> {
    this.competitions = this.competitions.filter(c => c.id !== id);
    return this.delayed({ message: 'مسابقه حذف شد' });
  }

  registerParticipant(competitionId: number, payload: RegisterParticipantPayload): Observable<CompetitionParticipant> {
    const p: CompetitionParticipant = { id: this.nextId('cp'), studentId: payload.studentId, studentName: `دانش‌آموز ${payload.studentId}` };
    this.competitionParticipants.push(p);
    const comp = this.competitions.find(c => c.id === competitionId);
    if (comp) comp.participantCount++;
    return this.delayed(p);
  }

  removeParticipant(competitionId: number, studentId: number): Observable<ApiMessageResponse> {
    this.competitionParticipants = this.competitionParticipants.filter(p => !(p.studentId === studentId));
    return this.delayed({ message: 'شرکت‌کننده حذف شد' });
  }

  updateParticipantScore(competitionId: number, studentId: number, payload: UpdateParticipantScorePayload): Observable<CompetitionParticipant> {
    const idx = this.competitionParticipants.findIndex(p => p.studentId === studentId);
    if (idx < 0) throw new Error('شرکت‌کننده یافت نشد');
    this.competitionParticipants[idx] = { ...this.competitionParticipants[idx], ...payload };
    return this.delayed(this.competitionParticipants[idx]);
  }

  getCompetitionResults(competitionId: number): Observable<CompetitionResult> {
    const comp = this.competitions.find(c => c.id === competitionId);
    return this.delayed({ competitionId, competitionTitle: comp?.title ?? '', rankings: this.competitionParticipants.sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999)).filter(p => p.score != null) });
  }

  getLeagues(): Observable<League[]> {
    return this.delayed(this.leagues);
  }

  getActiveLeagues(): Observable<League[]> {
    return this.delayed(this.leagues.filter(l => l.status === 'active'));
  }

  getLeagueById(id: number): Observable<LeagueDetail> {
    const league = this.leagues.find(l => l.id === id);
    if (!league) throw new Error('لیگ یافت نشد');
    return this.delayed({ ...league, rankings: this.leagueRankings.sort((a, b) => a.rank - b.rank) });
  }

  createLeague(payload: CreateLeaguePayload): Observable<League> {
    const league: League = { id: this.nextId(this.leagues), ...payload, status: 'active', participantCount: 0, createdAt: this.now() };
    this.leagues.push(league);
    return this.delayed(league);
  }

  updateLeague(id: number, payload: UpdateLeaguePayload): Observable<League> {
    const idx = this.leagues.findIndex(l => l.id === id);
    if (idx < 0) throw new Error('لیگ یافت نشد');
    this.leagues[idx] = { ...this.leagues[idx], ...payload };
    return this.delayed(this.leagues[idx]);
  }

  deleteLeague(id: number): Observable<ApiMessageResponse> {
    this.leagues = this.leagues.filter(l => l.id !== id);
    return this.delayed({ message: 'لیگ حذف شد' });
  }

  getLeagueRankings(leagueId: number): Observable<LeagueRanking[]> {
    return this.delayed(this.leagueRankings.sort((a, b) => a.rank - b.rank));
  }

  updateLeagueRanking(leagueId: number, payload: UpdateLeagueRankingPayload): Observable<LeagueRanking> {
    const idx = this.leagueRankings.findIndex(r => r.studentId === payload.studentId);
    if (idx < 0) {
      const newRanking: LeagueRanking = { id: this.nextId('lr'), studentId: payload.studentId, studentName: `دانش‌آموز ${payload.studentId}`, score: payload.score, rank: this.leagueRankings.length + 1, trend: payload.trend ?? 'stable', lastUpdated: this.now() };
      this.leagueRankings.push(newRanking);
      return this.delayed(newRanking);
    }
    this.leagueRankings[idx] = { ...this.leagueRankings[idx], score: payload.score, previousRank: payload.previousRank, trend: payload.trend ?? this.leagueRankings[idx].trend, lastUpdated: this.now() };
    return this.delayed(this.leagueRankings[idx]);
  }

  // ── Survey Seed Data ──────────────────────────────────────────

  private seedSurveyData(): void {
    seedSurveyData({
      issueSurveys: this.issueSurveys,
      issueQuestions: this.issueQuestions,
      issueResponses: this.issueResponses,
      issueComments: this.issueComments,
      nextId: (arr: { id: number }[]) => this.nextId(arr),
      now: () => this.now(),
    });
  }

  // ── Issue / Survey Mock Methods ──────────────────────────────────────

  getIssueSurveys(): Observable<IssueSurvey[]> {
    return this.delayed(this.issueSurveys);
  }

  getIssueSurveyById(id: number): Observable<IssueSurvey> {
    const survey = this.issueSurveys.find(s => s.id === id);
    if (!survey) throw new Error('نظرسنجی یافت نشد');
    const full: IssueSurvey = {
      ...survey,
      questions: this.issueQuestions.filter(q => q.surveyId === id),
      responses: this.issueResponses.filter(r => r.surveyId === id),
      comments: this.issueComments.filter(c => c.surveyId === id),
      actions: this.issueActions.filter(a => a.surveyId === id)
    };
    return this.delayed(full);
  }

  createIssueSurvey(payload: CreateIssueSurveyPayload): Observable<IssueSurvey> {
    const survey: IssueSurvey = {
      id: this.nextId(this.issueSurveys),
      ...payload,
      status: 'draft',
      createdById: 1,
      createdByName: 'مدیر سیستم',
      createdAt: this.now(),
      updatedAt: this.now(),
      questionCount: 0,
      responseCount: 0
    };
    this.issueSurveys.push(survey);
    return this.delayed(survey);
  }

  updateIssueSurvey(id: number, payload: UpdateIssueSurveyPayload): Observable<IssueSurvey> {
    const idx = this.issueSurveys.findIndex(s => s.id === id);
    if (idx < 0) throw new Error('نظرسنجی یافت نشد');
    this.issueSurveys[idx] = { ...this.issueSurveys[idx], ...payload, updatedAt: this.now() };
    return this.delayed(this.issueSurveys[idx]);
  }

  deleteIssueSurvey(id: number): Observable<ApiMessageResponse> {
    this.issueSurveys = this.issueSurveys.filter(s => s.id !== id);
    this.issueQuestions = this.issueQuestions.filter(q => q.surveyId !== id);
    this.issueResponses = this.issueResponses.filter(r => r.surveyId !== id);
    this.issueComments = this.issueComments.filter(c => c.surveyId !== id);
    return this.delayed({ message: 'نظرسنجی حذف شد' });
  }

  publishIssueSurvey(id: number): Observable<IssueSurvey> {
    const idx = this.issueSurveys.findIndex(s => s.id === id);
    if (idx < 0) throw new Error('نظرسنجی یافت نشد');
    this.issueSurveys[idx] = { ...this.issueSurveys[idx], status: 'active', updatedAt: this.now() };
    return this.delayed(this.issueSurveys[idx]);
  }

  closeIssueSurvey(id: number): Observable<IssueSurvey> {
    const idx = this.issueSurveys.findIndex(s => s.id === id);
    if (idx < 0) throw new Error('نظرسنجی یافت نشد');
    this.issueSurveys[idx] = { ...this.issueSurveys[idx], status: 'closed', updatedAt: this.now() };
    return this.delayed(this.issueSurveys[idx]);
  }

  duplicateIssueSurvey(id: number): Observable<IssueSurvey> {
    const source = this.issueSurveys.find(s => s.id === id);
    if (!source) throw new Error('نظرسنجی یافت نشد');
    const newId = this.nextId(this.issueSurveys);
    const clone: IssueSurvey = {
      ...source,
      id: newId,
      title: source.title + ' (کپی)',
      status: 'draft',
      responseCount: 0,
      createdAt: this.now(),
      updatedAt: this.now()
    };
    this.issueSurveys.push(clone);
    const sourceQuestions = this.issueQuestions.filter(q => q.surveyId === id);
    sourceQuestions.forEach(q => {
      this.issueQuestions.push({ ...q, id: this.nextId(this.issueQuestions), surveyId: newId, createdAt: this.now() });
    });
    clone.questionCount = sourceQuestions.length;
    return this.delayed(clone);
  }

  getIssueSurveyQuestions(surveyId: number): Observable<IssueSurveyQuestion[]> {
    return this.delayed(this.issueQuestions.filter(q => q.surveyId === surveyId).sort((a, b) => a.sortOrder - b.sortOrder));
  }

  createIssueSurveyQuestion(surveyId: number, payload: CreateIssueQuestionPayload): Observable<IssueSurveyQuestion> {
    const { surveyId: _payloadSurveyId, ...rest } = payload;
    const question: IssueSurveyQuestion = {
      id: this.nextId(this.issueQuestions),
      surveyId,
      ...rest,
      isActive: true,
      createdAt: this.now()
    };
    this.issueQuestions.push(question);
    const survey = this.issueSurveys.find(s => s.id === surveyId);
    if (survey) survey.questionCount = this.issueQuestions.filter(q => q.surveyId === surveyId).length;
    return this.delayed(question);
  }

  updateIssueSurveyQuestion(surveyId: number, questionId: number, payload: Partial<CreateIssueQuestionPayload>): Observable<IssueSurveyQuestion> {
    const idx = this.issueQuestions.findIndex(q => q.id === questionId && q.surveyId === surveyId);
    if (idx < 0) throw new Error('سوال یافت نشد');
    this.issueQuestions[idx] = { ...this.issueQuestions[idx], ...payload };
    return this.delayed(this.issueQuestions[idx]);
  }

  deleteIssueSurveyQuestion(surveyId: number, questionId: number): Observable<ApiMessageResponse> {
    this.issueQuestions = this.issueQuestions.filter(q => !(q.id === questionId && q.surveyId === surveyId));
    const survey = this.issueSurveys.find(s => s.id === surveyId);
    if (survey) survey.questionCount = this.issueQuestions.filter(q => q.surveyId === surveyId).length;
    return this.delayed({ message: 'سوال حذف شد' });
  }

  reorderIssueQuestions(surveyId: number, questionIds: number[]): Observable<void> {
    questionIds.forEach((qId, index) => {
      const idx = this.issueQuestions.findIndex(q => q.id === qId && q.surveyId === surveyId);
      if (idx >= 0) this.issueQuestions[idx] = { ...this.issueQuestions[idx], sortOrder: index };
    });
    return this.delayed(undefined as unknown as void);
  }

  getIssueSurveysForRespond(surveyId: number): Observable<IssueSurvey> {
    const survey = this.issueSurveys.find(s => s.id === surveyId);
    if (!survey) throw new Error('نظرسنجی یافت نشد');
    const full: IssueSurvey = {
      ...survey,
      questions: this.issueQuestions.filter(q => q.surveyId === surveyId && q.isActive)
    };
    return this.delayed(full);
  }

  submitSurveyResponses(surveyId: number, payload: SubmitSurveyResponsePayload): Observable<IssueSurveyResponse[]> {
    const newResponses: IssueSurveyResponse[] = payload.answers.map(a => {
      const question = this.issueQuestions.find(q => q.id === a.questionId);
      return {
        id: this.nextId(this.issueResponses),
        surveyId,
        questionId: a.questionId,
        questionText: question?.questionText,
        respondentId: 1,
        respondentRole: 'student',
        score: a.score,
        answeredAt: this.now()
      };
    });
    this.issueResponses.push(...newResponses);
    const survey = this.issueSurveys.find(s => s.id === surveyId);
    if (survey) survey.responseCount = this.issueResponses.filter(r => r.surveyId === surveyId).length;
    return this.delayed(newResponses);
  }

  getSurveyAnalytics(surveyId: number): Observable<SurveyAnalytics> {
    const survey = this.issueSurveys.find(s => s.id === surveyId);
    const responses = this.issueResponses.filter(r => r.surveyId === surveyId);
    const questions = this.issueQuestions.filter(q => q.surveyId === surveyId);
    const overallAverage = responses.length > 0 ? responses.reduce((sum, r) => sum + r.score, 0) / responses.length : 0;

    const categoryMap = new Map<string, { scores: number[]; count: number }>();
    questions.forEach(q => {
      const qResponses = responses.filter(r => r.questionId === q.id);
      const existing = categoryMap.get(q.category) ?? { scores: [], count: 0 };
      qResponses.forEach(r => existing.scores.push(r.score));
      existing.count++;
      categoryMap.set(q.category, existing);
    });

    const categoryBreakdown: CategoryAnalytics[] = Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      averageScore: data.scores.length > 0 ? data.scores.reduce((a, b) => a + b, 0) / data.scores.length : 0,
      questionCount: data.count,
      severity: (data.scores.length > 0 && data.scores.reduce((a, b) => a + b, 0) / data.scores.length < 2.5 ? 'critical' : 'solvable') as 'critical' | 'problem' | 'solvable'
    }));

    const questionAnalytics: QuestionAnalytics[] = questions.map(q => {
      const qResponses = responses.filter(r => r.questionId === q.id);
      const avg = qResponses.length > 0 ? qResponses.reduce((s, r) => s + r.score, 0) / qResponses.length : 0;
      const variance = qResponses.length > 0 ? qResponses.reduce((s, r) => s + Math.pow(r.score - avg, 2), 0) / qResponses.length : 0;
      return {
        questionId: q.id,
        questionText: q.questionText,
        category: q.category,
        averageScore: avg,
        standardDeviation: Math.sqrt(variance),
        responseCount: qResponses.length,
        severity: (avg < 2.5 ? 'critical' : 'solvable') as 'critical' | 'problem' | 'solvable'
      };
    });

    const sorted = [...questionAnalytics].sort((a, b) => a.averageScore - b.averageScore);

    const analytics: SurveyAnalytics = {
      surveyId,
      title: survey?.title ?? '',
      totalRespondents: responses.length > 0 ? new Set(responses.map(r => r.respondentId)).size : 0,
      totalQuestions: questions.length,
      overallAverage,
      categoryBreakdown,
      topCriticalIssues: sorted.slice(0, 3),
      topStrengths: sorted.slice(-3).reverse()
    };
    return this.delayed(analytics);
  }

  getSurveyCategoryBreakdown(surveyId: number): Observable<CategoryAnalytics[]> {
    const questions = this.issueQuestions.filter(q => q.surveyId === surveyId);
    const responses = this.issueResponses.filter(r => r.surveyId === surveyId);
    const categoryMap = new Map<string, number[]>();
    questions.forEach(q => {
      if (!categoryMap.has(q.category)) categoryMap.set(q.category, []);
      responses.filter(r => r.questionId === q.id).forEach(r => categoryMap.get(q.category)!.push(r.score));
    });
    const breakdown: CategoryAnalytics[] = Array.from(categoryMap.entries()).map(([category, scores]) => ({
      category,
      averageScore: scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0,
      questionCount: questions.filter(q => q.category === category).length,
      severity: (scores.length > 0 && scores.reduce((a, b) => a + b, 0) / scores.length < 2.5 ? 'critical' : 'solvable') as 'critical' | 'problem' | 'solvable'
    }));
    return this.delayed(breakdown);
  }

  getSurveyTrends(): Observable<any[]> {
    return this.delayed([]);
  }

  exportSurveyJson(surveyId: number): Observable<any[]> {
    const survey = this.issueSurveys.find(s => s.id === surveyId);
    const questions = this.issueQuestions.filter(q => q.surveyId === surveyId);
    const responses = this.issueResponses.filter(r => r.surveyId === surveyId);
    const exportData = responses.map(r => ({
      surveyId,
      surveyTitle: survey?.title ?? '',
      questionId: r.questionId,
      questionText: questions.find(q => q.id === r.questionId)?.questionText ?? '',
      score: r.score,
      respondentId: r.respondentId,
      answeredAt: r.answeredAt
    }));
    return this.delayed(exportData);
  }

  getSurveyComments(surveyId: number): Observable<IssueSurveyComment[]> {
    return this.delayed(this.issueComments.filter(c => c.surveyId === surveyId));
  }

  addSurveyComment(surveyId: number, payload: { comment: string }): Observable<IssueSurveyComment> {
    const comment: IssueSurveyComment = {
      id: this.nextId(this.issueComments),
      surveyId,
      respondentId: 1,
      respondentName: 'مدیر سیستم',
      comment: payload.comment,
      isPublic: true,
      createdAt: this.now()
    };
    this.issueComments.push(comment);
    return this.delayed(comment);
  }

  getSurveyActions(surveyId: number): Observable<IssueAction[]> {
    return this.delayed(this.issueActions.filter(a => a.surveyId === surveyId));
  }

  createSurveyAction(surveyId: number, payload: CreateIssueActionPayload): Observable<IssueAction> {
    const action: IssueAction = {
      id: this.nextId(this.issueActions),
      ...payload,
      surveyId,
      status: 'proposed',
      createdAt: this.now(),
      updatedAt: this.now(),
      updateCount: 0
    };
    this.issueActions.push(action);
    return this.delayed(action);
  }

  updateIssueAction(id: number, payload: Partial<IssueAction>): Observable<IssueAction> {
    const idx = this.issueActions.findIndex(a => a.id === id);
    if (idx < 0) throw new Error('اقدام یافت نشد');
    this.issueActions[idx] = { ...this.issueActions[idx], ...payload, updatedAt: this.now() };
    return this.delayed(this.issueActions[idx]);
  }

  updateIssueActionStatus(id: number, status: string, updatedById: number, note?: string, progressPercent?: number): Observable<IssueAction> {
    const idx = this.issueActions.findIndex(a => a.id === id);
    if (idx < 0) throw new Error('اقدام یافت نشد');
    const previousStatus = this.issueActions[idx].status;
    const newStatus = status as ActionStatus;
    this.issueActions[idx] = {
      ...this.issueActions[idx],
      status: newStatus,
      updatedAt: this.now(),
      updateCount: this.issueActions[idx].updateCount + 1,
      completedAt: newStatus === 'completed' ? this.now() : this.issueActions[idx].completedAt
    };
    const update: IssueActionUpdate = {
      id: this.nextId(this.issueActionUpdates),
      actionId: id,
      updatedById,
      previousStatus,
      newStatus,
      note: note ?? '',
      progressPercent,
      createdAt: this.now()
    };
    this.issueActionUpdates.push(update);
    return this.delayed(this.issueActions[idx]);
  }

  getIssueItemPool(category?: string): Observable<IssueItemPool[]> {
    if (category) return this.delayed(this.issuePoolItems.filter(p => p.category === category && p.isActive));
    return this.delayed(this.issuePoolItems.filter(p => p.isActive));
  }

  createIssueItemPool(payload: CreateIssueItemPoolPayload): Observable<IssueItemPool> {
    const item: IssueItemPool = {
      id: this.nextId(this.issuePoolItems),
      ...payload,
      usageCount: 0,
      isActive: true,
      trend: 'stable',
      createdAt: this.now()
    };
    this.issuePoolItems.push(item);
    return this.delayed(item);
  }

  addPoolItemToSurvey(poolItemId: number, surveyId: number, sortOrder?: number): Observable<IssueItemPool> {
    const poolItem = this.issuePoolItems.find(p => p.id === poolItemId);
    if (!poolItem) throw new Error('آیتم استخر یافت نشد');
    const question: IssueSurveyQuestion = {
      id: this.nextId(this.issueQuestions),
      surveyId,
      itemPoolId: poolItemId,
      questionText: poolItem.questionText,
      category: poolItem.category,
      subCategory: poolItem.subCategory,
      targetAudience: poolItem.targetAudience,
      sortOrder: sortOrder ?? this.issueQuestions.filter(q => q.surveyId === surveyId).length,
      isActive: true,
      createdAt: this.now()
    };
    this.issueQuestions.push(question);
    poolItem.usageCount++;
    const survey = this.issueSurveys.find(s => s.id === surveyId);
    if (survey) survey.questionCount = this.issueQuestions.filter(q => q.surveyId === surveyId).length;
    return this.delayed(poolItem);
  }

  getIssueDashboardSummary(): Observable<IssueDashboardSummary> {
    const activeSurveys = this.issueSurveys.filter(s => s.status === 'active').length;
    const openActions = this.issueActions.filter(a => a.status !== 'completed' && a.status !== 'cancelled').length;
    const completedActions = this.issueActions.filter(a => a.status === 'completed').length;
    const totalActions = this.issueActions.length;
    const criticalIssues = this.issuePoolItems.filter(p => p.trend === 'declining').length;
    const improvingItems = this.issuePoolItems.filter(p => p.trend === 'improving').length;
    const summary: IssueDashboardSummary = {
      activeSurveys,
      openActions,
      completedActions,
      criticalIssuePercentage: totalActions > 0 ? Math.round((criticalIssues / totalActions) * 100) : 0,
      improvingTrendPercentage: this.issuePoolItems.length > 0 ? Math.round((improvingItems / this.issuePoolItems.length) * 100) : 0
    };
return this.delayed(summary);
  }

  private serviceSurveys: ServiceSurvey[] = [
    {
      id: 1,
      title: 'نظرسنجی رضایت والدین از خدمات حمل‌ونقل',
      description: 'لطفاً نظر خود را درباره کیفیت خدمات حمل‌ونقل فرزندان‌تان بیان کنید',
      targetRole: 'parent',
      status: 'active',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      scoreScaleMin: 1,
      scoreScaleMax: 5,
      isAnonymous: true,
      createdById: 1,
      createdByName: 'Admin',
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
      questionCount: 5,
      responseCount: 42,
    },
    {
      id: 2,
      title: 'نظرسنجی هماهنگی شعبه',
      description: 'ارزیابی هماهنگی و کیفیت خدمات شعبه‌ها',
      targetRole: 'branch_manager',
      status: 'active',
      startDate: '2026-01-15',
      endDate: '2026-06-30',
      scoreScaleMin: 1,
      scoreScaleMax: 5,
      isAnonymous: false,
      createdById: 2,
      createdByName: 'Admin',
      createdAt: '2026-01-15T00:00:00Z',
      updatedAt: '2026-01-15T00:00:00Z',
      questionCount: 8,
      responseCount: 15,
    },
    {
      id: 3,
      title: 'نظرسنجی سیاست‌گذاری مرکزی',
      description: 'نظرسنجی جهت بهبود سیاست‌های سرویس مرکزی',
      targetRole: 'headquarters',
      status: 'active',
      startDate: '2026-02-01',
      endDate: '2026-08-31',
      scoreScaleMin: 1,
      scoreScaleMax: 5,
      isAnonymous: true,
      createdById: 1,
      createdByName: 'Admin',
      createdAt: '2026-02-01T00:00:00Z',
      updatedAt: '2026-02-01T00:00:00Z',
      questionCount: 10,
      responseCount: 8,
    },
    {
      id: 4,
      title: 'نظرسنجی هزینه‌ها و بودجه خدمات',
      description: 'ارزیابی مالی و صرفه‌جویی هزینه‌های سرویس‌یاب',
      targetRole: 'manager',
      status: 'draft',
      startDate: '2026-03-01',
      endDate: '2026-09-30',
      scoreScaleMin: 1,
      scoreScaleMax: 5,
      isAnonymous: false,
      createdById: 3,
      createdByName: 'Admin',
      createdAt: '2026-03-01T00:00:00Z',
      updatedAt: '2026-03-01T00:00:00Z',
      questionCount: 6,
      responseCount: 0,
    },
  ];

  private serviceQuestions: ServiceSurveyQuestion[] = [
    { id: 1, surveyId: 1, questionText: 'کیفیت تعامل خلبان با شما چقدر رضایت‌بخش است؟', questionType: 'rating', category: 'حمل‌ونقل', options: undefined, scaleMin: 1, scaleMax: 5, sortOrder: 1, isRequired: true, isActive: true, createdAt: '2026-01-01T00:00:00Z' },
    { id: 2, surveyId: 1, questionText: 'نقطه قصد رانندگان مناسب و دقیق بود؟', questionType: 'radio', category: 'حمل‌ونقل', options: ['خیلی خوب', 'خوب', 'متوسط', 'ضعیف'], scaleMin: undefined, scaleMax: undefined, sortOrder: 2, isRequired: true, isActive: true, createdAt: '2026-01-01T00:00:00Z' },
    { id: 3, surveyId: 1, questionText: 'آیا خدمات حمل‌ونقل پیشنهاد داده می‌شود؟', questionType: 'checkbox', category: 'جمع‌آوری', options: ['بله، قطعاً', 'بله، تا حدی', 'خیر'], scaleMin: undefined, scaleMax: undefined, sortOrder: 3, isRequired: false, isActive: true, createdAt: '2026-01-01T00:00:00Z' },
    { id: 4, surveyId: 1, questionText: 'پیشنهاد ویژه یا توجه', questionType: 'text', category: 'جمع‌آوری', options: undefined, scaleMin: undefined, scaleMax: undefined, sortOrder: 4, isRequired: false, isActive: true, createdAt: '2026-01-01T00:00:00Z' },
    { id: 5, surveyId: 1, questionText: 'درصد رضایت کلی', questionType: 'rating', category: 'حمل‌ونقل', options: undefined, scaleMin: 1, scaleMax: 5, sortOrder: 5, isRequired: true, isActive: true, createdAt: '2026-01-01T00:00:00Z' },
  ];

  private serviceResponses: ServiceSurveyResponse[] = [
    { id: 1, surveyId: 1, questionId: 1, respondentRole: 'parent', respondentBranchId: 1, answerScore: 4, answerText: 'خوب', respondedAt: '2026-03-15T10:00:00Z' },
    { id: 2, surveyId: 1, questionId: 2, respondentRole: 'parent', respondentBranchId: 1, answerScore: 3, answerText: 'متوسط', respondedAt: '2026-03-15T10:05:00Z' },
    { id: 3, surveyId: 1, questionId: 3, respondentRole: 'parent', respondentBranchId: 1, answerOptions: ['بله، تا حدی'], respondedAt: '2026-03-15T10:10:00Z' },
    { id: 4, surveyId: 1, questionId: 5, respondentRole: 'parent', respondentBranchId: 1, answerScore: 4, answerText: 'خوب', respondedAt: '2026-03-15T10:15:00Z' },
  ];

  getServiceSurveys(targetRole?: string): Observable<ServiceSurvey[]> {
    let surveys = [...this.serviceSurveys];
    if (targetRole) {
      surveys = surveys.filter((s) => s.targetRole === targetRole);
    }
    return this.delayed(surveys);
  }

  getServiceSurveyById(id: number): Observable<ServiceSurvey> {
    const survey = this.serviceSurveys.find((s) => s.id === id);
    if (!survey) throw new Error('نظرسنجی یافت نشد');
    return this.delayed(survey);
  }

  createServiceSurvey(payload: CreateServiceSurveyPayload): Observable<ServiceSurvey> {
    const newSurvey: ServiceSurvey = {
      id: this.nextId(this.serviceSurveys),
      ...payload,
      status: 'draft',
      createdById: 1,
      questionCount: 0,
      responseCount: 0,
      createdAt: this.now(),
      updatedAt: this.now(),
    };
    this.serviceSurveys.push(newSurvey);
    return this.delayed(newSurvey);
  }

  updateServiceSurvey(id: number, payload: UpdateServiceSurveyPayload): Observable<ServiceSurvey> {
    const idx = this.serviceSurveys.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error('نظرسنجی یافت نشد');
    this.serviceSurveys[idx] = { ...this.serviceSurveys[idx], ...payload, updatedAt: this.now() };
    return this.delayed(this.serviceSurveys[idx]);
  }

  deleteServiceSurvey(id: number): Observable<ApiMessageResponse> {
    this.serviceSurveys = this.serviceSurveys.filter((s) => s.id !== id);
    return this.delayed({ message: 'نظرسنجی حذف شد' });
  }

  publishServiceSurvey(id: number): Observable<ServiceSurvey> {
    const survey = this.serviceSurveys.find((s) => s.id === id);
    if (survey) {
      survey.status = 'active';
      survey.updatedAt = this.now();
    }
    return this.delayed(survey!);
  }

  closeServiceSurvey(id: number): Observable<ServiceSurvey> {
    const survey = this.serviceSurveys.find((s) => s.id === id);
    if (survey) {
      survey.status = 'closed';
      survey.updatedAt = this.now();
    }
    return this.delayed(survey!);
  }

  getServiceSurveyQuestions(surveyId: number): Observable<ServiceSurveyQuestion[]> {
    return this.delayed(this.serviceQuestions.filter((q) => q.surveyId === surveyId));
  }

  createServiceQuestion(surveyId: number, payload: CreateServiceQuestionPayload): Observable<ServiceSurveyQuestion> {
    const question: ServiceSurveyQuestion = {
      id: this.nextId(this.serviceQuestions),
      ...payload,
      sortOrder: payload.sortOrder ?? this.serviceQuestions.filter((q) => q.surveyId === surveyId).length,
      isRequired: payload.isRequired ?? true,
      isActive: true,
      createdAt: this.now(),
    };
    this.serviceQuestions.push(question);
    return this.delayed(question);
  }

  deleteServiceQuestion(surveyId: number, questionId: number): Observable<ApiMessageResponse> {
    this.serviceQuestions = this.serviceQuestions.filter(
      (q) => !(q.surveyId === surveyId && q.id === questionId)
    );
    return this.delayed({ message: 'سوال حذف شد' });
  }

  getServiceSurveyResponses(surveyId: number): Observable<ServiceSurveyResponse[]> {
    return this.delayed(this.serviceResponses.filter((r) => r.surveyId === surveyId));
  }

  submitServiceSurveyResponse(payload: SubmitServiceSurveyPayload): Observable<ServiceSurveyResponse> {
    const response: ServiceSurveyResponse = {
      id: this.nextId(this.serviceResponses),
      surveyId: payload.surveyId,
      questionId: payload.answers[0]?.questionId ?? 0,
      respondentRole: 'parent',
      answerText: payload.answers[0]?.answerText ?? '',
      answerScore: payload.answers[0]?.answerScore,
      answerOptions: payload.answers[0]?.answerOptions,
      respondedAt: this.now(),
    };
    this.serviceResponses.push(response);
    return this.delayed(response);
  }

  getServiceSurveyAnalytics(surveyId: number): Observable<ServiceSurveyAnalytics> {
    const survey = this.serviceSurveys.find((s) => s.id === surveyId);
    const responses = this.serviceResponses.filter((r) => r.surveyId === surveyId);
    const questions = this.serviceQuestions.filter((q) => q.surveyId === surveyId);
    const avgScore = responses.length > 0
      ? responses.reduce((sum, r) => sum + (r.answerScore ?? 0), 0) / responses.length
      : 0;

    return this.delayed({
      surveyId,
      title: survey?.title ?? '',
      totalRespondents: responses.length,
      totalQuestions: questions.length,
      overallAverage: Math.round(avgScore * 10) / 10,
      responseCount: responses.length,
      categoryBreakdown: [
        { category: 'حمل‌ونقل', averageScore: Math.round(avgScore * 10) / 10, questionCount: questions.length, responseCount: responses.length },
      ],
      topQuestions: questions.slice(0, 3).map((q) => ({
        questionId: q.id,
        questionText: q.questionText,
        category: q.category,
        averageScore: Math.round(avgScore * 10) / 10,
        responseCount: responses.length,
        responseRate: responses.length > 0 ? Math.round((responses.length / (survey?.responseCount ?? 1)) * 100) : 0,
      })),
    });
  }

  getServiceDashboardSummary(): Observable<ServiceDashboardSummary> {
    const activeSurveys = this.serviceSurveys.filter((s) => s.status === 'active').length;
    const totalResponses = this.serviceResponses.length;
    const avgScore = totalResponses > 0
      ? Math.round(
          (this.serviceResponses.reduce((sum, r) => sum + (r.answerScore ?? 0), 0) / totalResponses) * 10
        ) / 10
      : 0;
    return this.delayed({
      activeSurveys,
      totalResponses,
      averageScore: avgScore,
      completionRate: totalResponses > 0 ? Math.round((totalResponses / 100) * 100) : 0,
      lastUpdated: this.now(),
    });
  }

  private generateMockQuestions(courseId: number): AssessmentQuestion[] {
    const topics = ['مفاهیم پایه', 'حل مسئله', 'درک مطلب', 'اعمال دانش', 'تحلیل'];
    const difficulties: Array<'easy' | 'medium' | 'hard'> = ['easy', 'easy', 'easy', 'medium', 'medium', 'medium', 'medium', 'medium', 'hard', 'hard'];
    return difficulties.map((diff, i) => ({
      id: this.nextId('question'),
      type: 'multiple_choice' as const,
      questionText: `سوال ${i + 1} در مورد ${topics[i % topics.length]}`,
      optionsJson: JSON.stringify(['گزینه صحیح', 'گزینه غلط ۱', 'گزینه غلط ۲', 'گزینه غلط ۳']),
      correctAnswerJson: JSON.stringify({ correctOption: 0 }),
      points: diff === 'easy' ? 8 : diff === 'medium' ? 12 : 15,
      order: i,
      difficulty: diff,
      topic: topics[i % topics.length],
      explanation: 'توضیح پاسخ صحیح',
      assessmentId: 0,
      createdAt: this.now(),
      updatedAt: this.now()
    }));
  }
}
