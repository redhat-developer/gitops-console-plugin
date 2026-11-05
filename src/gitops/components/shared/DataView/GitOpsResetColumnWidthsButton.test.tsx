import { renderToStaticMarkup } from 'react-dom/server';

import { GitOpsResetColumnWidthsButton } from './GitOpsResetColumnWidthsButton';

describe('GitOpsResetColumnWidthsButton', () => {
  it('renders Reset column widths label and aria', () => {
    const markup = renderToStaticMarkup(
      <GitOpsResetColumnWidthsButton onReset={() => undefined} />,
    );
    expect(markup).toContain('Reset column widths');
    expect(markup).toContain('data-test="gitops-reset-column-widths"');
    expect(markup).toContain('data-icon="RhUiUndoIcon"');
  });
});
