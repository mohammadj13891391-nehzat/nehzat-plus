import { Constructor, HttpServiceContext } from './base';
import { Observable } from 'rxjs';
import {
  ProfileDto,
  UpdateProfileRequest,
  NotificationSettingsDto,
  UpdateNotificationSettingsRequest,
} from '../../models/lesson-planner.models';

export function WithProfile<TBase extends Constructor<HttpServiceContext>>(Base: TBase) {
  return class extends Base {
    getProfile(): Observable<ProfileDto> {
      return this.http.get<ProfileDto>(this.url('/api/profile'));
    }

    updateProfile(payload: UpdateProfileRequest): Observable<ProfileDto> {
      return this.http.put<ProfileDto>(this.url('/api/profile'), payload);
    }

    getNotificationSettings(): Observable<NotificationSettingsDto> {
      return this.http.get<NotificationSettingsDto>(this.url('/api/profile/notifications'));
    }

    updateNotificationSettings(
      payload: UpdateNotificationSettingsRequest,
    ): Observable<NotificationSettingsDto> {
      return this.http.put<NotificationSettingsDto>(
        this.url('/api/profile/notifications'),
        payload,
      );
    }
  };
}
