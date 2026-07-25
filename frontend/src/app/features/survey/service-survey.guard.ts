import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class serviceSurveyGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    // این گارد فقط اجازه دسترسی به کاربرانی را می‌دهد که نقش آنها اجازه دسترسی به نظرسنجی سرویس‌یاب را دارد
    const user = await this.authService.getCurrentUser();
    
    // فقط نقش‌های زیر اجازه دسترسی دارند:
    // - مدیر مدرسه
    // - معاونت فرهنگی / طلایی
    // - معاونت اداری / مالی
    const allowedRoles = ['مدیر مدرسه', 'معاونت فرهنگی/طلایی', 'معاونت اداری/مالی'];
    
    if (user && allowedRoles.includes(user.role)) {
      return true;
    }
    
    // برای سایر کاربران، به صفحه اصلی هدایت یا خطا نمایش می‌دهیم
    this.router.navigate(['/dashboard']);
    return false;
  }
}
