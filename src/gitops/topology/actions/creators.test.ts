import { getDeleteRolloutAction, editRollout } from './creators';

describe('topology action creators', () => {
  it('getDeleteRolloutAction', () => {
    const action = getDeleteRolloutAction(() => {});
    expect({ id: action.id, label: action.label }).toMatchInlineSnapshot(`
      {
        "id": "delete-rollout",
        "label": "Delete Rollout",
      }
    `);
  });

  it('editRollout', () => {
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
});
