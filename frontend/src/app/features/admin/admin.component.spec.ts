import { mountStandalone } from '../shared/testing-utils';

import { AdminComponent } from './admin.component';

describe('AdminComponent', () => {
  it('should be defined', () => {
    expect(AdminComponent).toBeDefined();
  });

  it('should create with mocked dependencies', () => {
    const instance = mountStandalone(AdminComponent);
    expect(instance).toBeTruthy();
  });
});
