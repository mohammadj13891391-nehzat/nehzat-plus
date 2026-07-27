import { mountStandalone } from '../shared/testing-utils';

import { EvaluatorComponent } from './evaluator.component';

describe('EvaluatorComponent', () => {
  it('should be defined', () => {
    expect(EvaluatorComponent).toBeDefined();
  });

  it('should create with mocked dependencies', () => {
    const instance = mountStandalone(EvaluatorComponent);
    expect(instance).toBeTruthy();
  });
});
