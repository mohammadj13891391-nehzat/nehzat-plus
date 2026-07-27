import { mountStandalone } from '../shared/testing-utils';

import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  it('should be defined', () => {
    expect(DashboardComponent).toBeDefined();
  });

  it('should create with mocked dependencies', () => {
    const instance = mountStandalone(DashboardComponent);
    expect(instance).toBeTruthy();
  });
});
