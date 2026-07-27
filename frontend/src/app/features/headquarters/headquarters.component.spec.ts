import { mountStandalone } from '../shared/testing-utils';

import { HeadquartersComponent } from './headquarters.component';

describe('HeadquartersComponent', () => {
  it('should be defined', () => {
    expect(HeadquartersComponent).toBeDefined();
  });

  it('should create with mocked dependencies', () => {
    const instance = mountStandalone(HeadquartersComponent);
    expect(instance).toBeTruthy();
  });
});
