import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import type {
  ProfileDto,
  UpdateProfileRequest,
  NotificationSettingsDto,
  UpdateNotificationSettingsRequest,
} from '../../models/lesson-planner.models';

@Injectable({ providedIn: 'root' })
export class MockProfileService {
  private profile: ProfileDto = {
    id: 1,
    firstName: 'علی',
    lastName: 'احمدی',
    fullName: 'علی احمدی',
    email: 'ali@example.com',
    phoneNumber: '09121234567',
    nationalCode: '1234567890',
    imageUrl: undefined,
    biography: undefined,
    userType: 'trainee',
    maktabName: 'مکتب مرکزی',
    approvalStatus: 'approved',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    phase: 'E',
    ageCluster: 'youngAdult',
    ringNumber: 8,
    maktabNameEn: 'central',
    age: 21,
  };

  private notifications: NotificationSettingsDto = {
    newAssignment: true,
    submissionReviewed: true,
    newMember: true,
    sessionReminder: true,
    systemAnnouncement: true,
  };

  getProfile(): Observable<ProfileDto> {
    return of(this.profile);
  }

  updateProfile(payload: UpdateProfileRequest): Observable<ProfileDto> {
    this.profile = { ...this.profile, ...payload };
    return of(this.profile);
  }

  getNotificationSettings(): Observable<NotificationSettingsDto> {
    return of(this.notifications);
  }

  updateNotificationSettings(payload: UpdateNotificationSettingsRequest): Observable<NotificationSettingsDto> {
    this.notifications = { ...payload };
    return of(this.notifications);
  }
}
