import { mountStandalone } from '../shared/testing-utils';

import { TeacherComponent } from './teacher.component';

describe('TeacherComponent', () => {
  it('should be defined', () => {
    expect(TeacherComponent).toBeDefined();
  });

  it('should create with mocked dependencies', () => {
    const instance = mountStandalone(TeacherComponent);
    expect(instance).toBeTruthy();
  });
});
