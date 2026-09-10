import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { LessonPlannerApi } from './lesson-planner-api.interface';
import { QrCodeResponse, QrPollResponse, QrScanConfirm, Student, Coach, Branch, BranchPerformance } from '../models/lesson-planner.models';
import { MockLessonPlannerApiBase } from './mock-lesson-planner-base';
import { MockAuthService } from './mock/auth.service';
import { MockAdminUsersService } from './mock/admin-users.service';
import { MockAdminCoursesService } from './mock/admin-courses.service';
import { MockAdminCoachesService } from './mock/admin-coaches.service';
import { MockAdminBranchesService } from './mock/admin-branches.service';
import { MockAdminCurriculumService } from './mock/admin-curriculum.service';
import { MockAdminParentsService } from './mock/admin-parents.service';
import { MockAdminEvaluatorsService } from './mock/admin-evaluators.service';
import { MockAdminStatisticsService } from './mock/admin-statistics.service';
import { MockAssessmentsService } from './mock/assessments.service';
import { MockSpiritualService } from './mock/spiritual.service';
import { MockDailyActivitiesService } from './mock/daily-activities.service';
import { MockArtsService } from './mock/arts.service';
import { MockSurveysService } from './mock/surveys.service';
import { MockQuranService } from './mock/quran.service';
import { MockHadithService } from './mock/hadith.service';
import { MockLiteratureService } from './mock/literature.service';
import { MockMathService } from './mock/math.service';
import { MockSciencesService } from './mock/sciences.service';
import { MockLearningService } from './mock/learning.service';
import { MockCompetitionsService } from './mock/competitions.service';
import { MockCommunityService } from './mock/community.service';
import { MockHeadquartersService } from './mock/headquarters.service';
import { MockTeachersService } from './mock/teachers.service';
import { MockCoursesService } from './mock/courses.service';
import { MockStudentProgressService } from './mock/student-progress.service';
import { MockProfileService } from './mock/profile.service';
import { MockMapService } from './mock/map.service';
import { MockCalendarService } from './mock/calendar.service';
import { MockProgressService } from './mock/progress.service';
import { MockNotificationService } from './mock/notification.service';
import { MockCourierReportService } from './mock/courier-report.service';
import { MockEvaluationService } from './mock/evaluation.service';
import { MockMessagingService } from './mock/messaging.service';
import { MockTeacherGradingService } from './mock/teacher-grading.service';
import { MockTrainingService } from './mock/training.service';
import { withEducationalProcess } from './mock-educational-process.delegations';
import { withStudyPath } from './mock-study-path.delegations';
import { withTraining } from './mock-training.delegations';
import { withTeacherGrading } from './mock-teacher-grading.delegations';
import { withMessaging } from './mock-messaging.delegations';
import { withEvaluation } from './mock-evaluation.delegations';
import { withCalendar } from './mock-calendar.delegations';
import { withNotification } from './mock-notification.delegations';
import { withCourierReport } from './mock-courier-report.delegations';
import { withProgress } from './mock-progress.delegations';
import { withMap } from './mock-map.delegations';
import { withProfile } from './mock-profile.delegations';
import { withStudentProgress } from './mock-student-progress.delegations';
import { withCourses } from './mock-courses.delegations';
import { withTeachers } from './mock-teachers.delegations';
import { withHeadquarters } from './mock-headquarters.delegations';
import { withCommunity } from './mock-community.delegations';
import { withCompetitions } from './mock-competitions.delegations';
import { withLearningDefenses } from './mock-learning-defenses.delegations';
import { withLearning } from './mock-learning.delegations';
import { withSciences } from './mock-sciences.delegations';
import { withMath } from './mock-math.delegations';
import { withLiteratureArabic } from './mock-literature-arabic.delegations';
import { withLiterature } from './mock-literature.delegations';
import { withHadith } from './mock-hadith.delegations';
import { withQuran } from './mock-quran.delegations';
import { withSurveys } from './mock-surveys.delegations';
import { withArts } from './mock-arts.delegations';
import { withDaily } from './mock-daily.delegations';
import { withSpiritual } from './mock-spiritual.delegations';
import { withAssessments } from './mock-assessments.delegations';
import { withAdminEvaluators } from './mock-admin-evaluators.delegations';
import { withAdminParents } from './mock-admin-parents.delegations';
import { withAdminCurriculumBooklets } from './mock-admin-curriculum-booklets.delegations';
import { withAdminCurriculum } from './mock-admin-curriculum.delegations';
import { withAdminBranches } from './mock-admin-branches.delegations';
import { withAdminCoaches } from './mock-admin-coaches.delegations';
import { withAdminCourses } from './mock-admin-courses.delegations';
import { withAdminUsers } from './mock-admin-users.delegations';
import { withAdminStatistics } from './mock-admin-statistics.delegations';
import { withAuth } from './mock-auth.delegations';
import { withVocabulary } from './mock-vocabulary.delegations';
import { MockStudyPathService } from './mock/study-path.service';
import { MockEducationalProcessService } from './mock/educational-process.service';
import { MockVocabularyService } from './mock/vocabulary.service';

/**
 * Facade service that delegates every LessonPlannerApi method to one of the 26
 * injected domain services. The concrete method bodies live in the domain mixin
 * factories composed below (mock-*.delegations.ts), one file per domain.
 * This thin class only owns DI + the delegation wiring.
 */
@Injectable({ providedIn: 'root' })
export class MockLessonPlannerApi
  extends withEducationalProcess(
    withStudyPath(
      withTraining(
        withTeacherGrading(
          withMessaging(
            withEvaluation(
              withCalendar(
                withNotification(
                  withCourierReport(
                    withProgress(
                      withMap(
                        withProfile(
                          withStudentProgress(
                            withCourses(
                              withTeachers(
                                withHeadquarters(
                                  withCommunity(
                                    withCompetitions(
                                      withLearningDefenses(
                                        withLearning(
                                          withSciences(
                                            withMath(
                                              withLiteratureArabic(
                                                withLiterature(
                                                  withHadith(
                                                    withQuran(
                                                      withSurveys(
                                                        withArts(
                                                          withDaily(
                                                            withSpiritual(
                                                              withAssessments(
                                                                withAdminEvaluators(
                                                                  withAdminParents(
                                                                    withAdminCurriculumBooklets(
                                                                      withAdminCurriculum(
                                                                        withAdminBranches(
                                                                          withAdminCoaches(
                                                                            withAdminCourses(
                                                                              withAdminUsers(
                                                                                withAdminStatistics(
                                                                                  withAuth(
                                                                                    withVocabulary(
                                                                                      MockLessonPlannerApiBase
                                                                                    )
                                                                                  )
                                                                                )
                                                                              )
                                                                            )
                                                                          )
                                                                        )
                                                                      )
                                                                    )
                                                                  )
                                                                )
                                                              )
                                                            )
                                                          )
                                                        )
                                                      )
                                                    )
                                                  )
                                                )
                                              )
                                            )
                                          )
                                        )
                                      )
                                    )
                                  )
                                )
                              )
                            )
                          )
                        )
                      )
                    )
                  )
                )
              )
            )
          )
        )
      )
    )
  )
{
  constructor(
    auth: MockAuthService,
    adminUsers: MockAdminUsersService,
    adminCourses: MockAdminCoursesService,
    adminCoaches: MockAdminCoachesService,
    adminBranches: MockAdminBranchesService,
    adminCurriculum: MockAdminCurriculumService,
    adminParents: MockAdminParentsService,
    adminEvaluators: MockAdminEvaluatorsService,
    adminStatistics: MockAdminStatisticsService,
    assessments: MockAssessmentsService,
    spiritual: MockSpiritualService,
    dailyActivities: MockDailyActivitiesService,
    arts: MockArtsService,
    surveys: MockSurveysService,
    quran: MockQuranService,
    hadith: MockHadithService,
    literature: MockLiteratureService,
    math: MockMathService,
    sciences: MockSciencesService,
    learning: MockLearningService,
    competitions: MockCompetitionsService,
    community: MockCommunityService,
    headquarters: MockHeadquartersService,
    teachers: MockTeachersService,
    courses: MockCoursesService,
    studentProgress: MockStudentProgressService,
    profile: MockProfileService,
    map: MockMapService,
    calendar: MockCalendarService,
    notification: MockNotificationService,
    courierReport: MockCourierReportService,
    progress: MockProgressService,
    evaluation: MockEvaluationService,
    messaging: MockMessagingService,
    teacherGrading: MockTeacherGradingService,
    training: MockTrainingService,
    educationalProcess: MockEducationalProcessService,
    studyPath: MockStudyPathService,
    vocabulary: MockVocabularyService,
  ) {
    super(
      auth,
      adminUsers,
      adminCourses,
      adminCoaches,
      adminBranches,
      adminCurriculum,
      adminParents,
      adminEvaluators,
      adminStatistics,
      assessments,
      spiritual,
      dailyActivities,
      arts,
      surveys,
      quran,
      hadith,
      literature,
      math,
      sciences,
      learning,
      competitions,
      community,
      headquarters,
      teachers,
      courses,
      studentProgress,
      profile,
      map,
      calendar,
      notification,
      courierReport,
      progress,
      evaluation,
      messaging,
      teacherGrading,
      training,
      educationalProcess,
      studyPath,
      vocabulary,
    );
  }

  requestQrCode(_payload?: { deviceInfo?: string }): Observable<QrCodeResponse> {
    const sessionId = Math.random().toString(36).substring(2, 20);
    return of({
      sessionId,
      qrData: `NEHZAT-QR:${sessionId}`,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    }).pipe(delay(300));
  }

  pollQrStatus(_sessionId: string): Observable<QrPollResponse> {
    return of({ status: 'expired' as const }).pipe(delay(300));
  }

  confirmQrLogin(_payload: { sessionId: string; username: string }): Observable<QrScanConfirm> {
    return of({ status: 'confirmed' as const, message: 'QR با موفقیت تأیید شد' }).pipe(delay(300));
  }

  // Methods from StudentsApi & AdminResourcesApi (not covered by mixin chain)
  getMyStudents(): Observable<Student[]> {
    return of([] as Student[]);
  }

  getMyCoaches(): Observable<Coach[]> {
    return of([] as Coach[]);
  }

  getMyBranchManagers(): Observable<BranchManager[]> {
    return of([] as BranchManager[]);
  }

  getMyBranch(): Observable<Branch> {
    return of({} as Branch);
  }

  getMyBranchPerformance(): Observable<BranchPerformance> {
    return of({} as BranchPerformance);
  }
}