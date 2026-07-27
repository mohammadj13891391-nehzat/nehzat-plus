import { mountStandalone } from '../shared/testing-utils';

import { BranchManagerComponent } from './branch-manager.component';

describe('BranchManagerComponent', () => {
  it('should be defined', () => {
    expect(BranchManagerComponent).toBeDefined();
  });

  it('should create with mocked dependencies', () => {
    const instance = mountStandalone(BranchManagerComponent);
    expect(instance).toBeTruthy();
  });
});
