import { isDenyRule, getDisplayValue } from './project-utils';

describe('isDenyRule', () => {
  it('detects deny rules', () => {
    expect(isDenyRule('!denied')).toMatchInlineSnapshot(`true`);
    expect(isDenyRule('allowed')).toMatchInlineSnapshot(`false`);
    expect(isDenyRule(undefined)).toMatchInlineSnapshot(`false`);
    expect(isDenyRule('')).toMatchInlineSnapshot(`false`);
    expect(isDenyRule('!')).toMatchInlineSnapshot(`true`);
  });
});

describe('getDisplayValue', () => {
  it('strips deny prefix and handles empty values', () => {
    expect(getDisplayValue('!denied')).toMatchInlineSnapshot(`"denied"`);
    expect(getDisplayValue('allowed')).toMatchInlineSnapshot(`"allowed"`);
    expect(getDisplayValue(undefined)).toMatchInlineSnapshot(`"-"`);
    expect(getDisplayValue('')).toMatchInlineSnapshot(`"-"`);
    expect(getDisplayValue('!multiple!bangs')).toMatchInlineSnapshot(`"multiple!bangs"`);
  });
});
