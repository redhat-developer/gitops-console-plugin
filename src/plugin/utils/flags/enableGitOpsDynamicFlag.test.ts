import { FLAG_GITOPS_DYNAMIC } from '../../../const';
import { enableGitOpsDynamicFlag } from './enableGitOpsDynamicFlag';

describe('enableGitOpsDynamicFlag', () => {
  it('calls setFeatureFlag with correct args', () => {
    const setFeatureFlag = jest.fn();
    enableGitOpsDynamicFlag(setFeatureFlag);
    expect(setFeatureFlag).toHaveBeenCalledWith(FLAG_GITOPS_DYNAMIC, true);
  });

  it('FLAG_GITOPS_DYNAMIC value', () => {
    expect(FLAG_GITOPS_DYNAMIC).toMatchInlineSnapshot(`"GITOPS_DYNAMIC"`);
  });
});
