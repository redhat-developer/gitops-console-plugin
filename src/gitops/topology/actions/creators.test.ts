import { getDeleteRolloutAction, editRollout } from './creators';

describe('topology action creators', () => {
  it('returns the delete action id and label', () => {
    const action = getDeleteRolloutAction(() => {});
    expect({ id: action.id, label: action.label }).toMatchInlineSnapshot(`
      {
        "id": "delete-rollout",
        "label": "Delete Rollout",
      }
    `);
  });

  it('calls the delete modal from the action', () => {
    const deleteModal = jest.fn();
    const action = getDeleteRolloutAction(deleteModal);
    expect(typeof action.cta).toBe('function');
    (action.cta as () => void)();
    expect(deleteModal).toHaveBeenCalledTimes(1);
  });

  it('returns the edit action with a yaml href', () => {
    const action = editRollout({
      apiVersion: 'argoproj.io/v1alpha1',
      kind: 'Rollout',
      metadata: { name: 'my-rollout', namespace: 'default' },
    } as any);
    expect({ id: action.id, label: action.label, cta: action.cta }).toMatchInlineSnapshot(`
      {
        "cta": {
          "href": "/ns/default/argoproj.io~v1alpha1~Rollout/my-rollout/yaml",
        },
        "id": "edit-rollout",
        "label": "Edit Rollout",
      }
    `);
  });

  it('builds the edit href when namespace is missing', () => {
    const action = editRollout({
      apiVersion: 'argoproj.io/v1alpha1',
      kind: 'Rollout',
      metadata: { name: 'my-rollout' },
    } as any);
    expect(action.cta).toMatchInlineSnapshot(`
      {
        "href": "/ns/undefined/argoproj.io~v1alpha1~Rollout/my-rollout/yaml",
      }
    `);
  });

  it('builds the edit href when name is missing', () => {
    const action = editRollout({
      apiVersion: 'argoproj.io/v1alpha1',
      kind: 'Rollout',
      metadata: { namespace: 'default' },
    } as any);
    expect(action.cta).toMatchInlineSnapshot(`
      {
        "href": "/ns/default/argoproj.io~v1alpha1~Rollout/undefined/yaml",
      }
    `);
  });
});
