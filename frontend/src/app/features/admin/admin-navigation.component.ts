import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AdminSidebarService, MenuItem } from './services/admin-sidebar.service';

@Component({
  selector: 'app-admin-navigation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-navigation.component.html',
  styleUrls: ['./admin-navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminNavigationComponent {
  private readonly sidebarService = inject(AdminSidebarService);
  private readonly router = inject(Router);

  // Expose service signals as component signals for template
  readonly activeMenu = this.sidebarService.activeMenu;
  readonly expandedMenus = this.sidebarService.expandedMenus;
  readonly visibleMenuItems = this.sidebarService.visibleMenuItems;
  readonly isBranchManager = this.sidebarService.isBranchManager;
  readonly currentUserBranchId = this.sidebarService.currentUserBranchId;
  readonly madrasahs = this.sidebarService.madrasahs;
  readonly makatibGirls = this.sidebarService.makatibGirls;
  readonly makatibBoys = this.sidebarService.makatibBoys;
  readonly loadingMadrasahs = this.sidebarService.loadingMadrasahs;

  // Service method delegates
  readonly toggleExpand = (key: string) => this.sidebarService.toggleExpand(key);
  readonly isExpanded = (key: string) => this.sidebarService.isExpanded(key);

  onMenuClick(key: string): void {
    this.sidebarService.setActiveMenu(key);
    void this.router.navigate(['/admin', key]);
  }

  onMadrasahClick(madrasah: any): void {
    this.sidebarService.onMadrasahSidebarClick(madrasah);
    void this.router.navigate(['/admin/makatib', madrasah.key]);
  }

  onSpiritualClick(): void {
    void this.router.navigate(['/admin/spiritual']);
  }

  // Template helpers
  readonly trackByKey = (_: number, item: MenuItem) => item.key;
  readonly trackByMadrasah = (_: number, m: any) => m.key;
}