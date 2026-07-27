import { mountStandalone } from '../shared/testing-utils';

import { CoachComponent } from './coach.component';

describe('CoachComponent', () => {
  it('should be defined', () => {
    expect(CoachComponent).toBeDefined();
  });

  it('should create with mocked dependencies', () => {
    const instance = mountStandalone(CoachComponent);
    expect(instance).toBeTruthy();
  });
});
