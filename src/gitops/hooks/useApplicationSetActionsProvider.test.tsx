import * as fs from 'fs';
import * as path from 'path';

describe('useApplicationSetActionsProvider', () => {
  const source = fs.readFileSync(
    path.join(__dirname, 'useApplicationSetActionsProvider.tsx'),
    'utf8',
  );

  it('includes namespace in delete action accessReview', () => {
    const deleteBlock = source.slice(
      source.indexOf('gitops-action-delete-applicationset'),
      source.indexOf('cta: () => launchDeleteModal()'),
    );

    expect(deleteBlock).toContain("verb: 'delete' as K8sVerb");
    expect(deleteBlock).toContain('resource: ApplicationSetModel.plural');
    expect(deleteBlock).toContain('namespace: applicationSet?.metadata?.namespace');
  });

  it('includes namespace in edit action accessReview for consistency', () => {
    const editBlock = source.slice(
      source.indexOf('gitops-action-edit-applicationset'),
      source.indexOf('navigate('),
    );

    expect(editBlock).toContain('namespace: applicationSet?.metadata?.namespace');
  });
});
