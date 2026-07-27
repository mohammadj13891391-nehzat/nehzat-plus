import { mountStandalone } from '../shared/testing-utils';

import { ParentPanelComponent } from './parent-panel.component';

describe('ParentPanelComponent', () => {
  it('should be defined', () => {
    expect(ParentPanelComponent).toBeDefined();
  });

  it('should create with mocked dependencies', () => {
    const instance = mountStandalone(ParentPanelComponent);
    expect(instance).toBeTruthy();
  });
});
