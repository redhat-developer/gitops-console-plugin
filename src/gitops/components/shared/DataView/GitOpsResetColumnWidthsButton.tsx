import * as React from 'react';

import { RhUiUndoIcon } from '@gitops/components/shared/icons/rhUiIcons';
import { useGitOpsTranslation } from '@gitops/utils/hooks/useGitOpsTranslation';
import { Button, ButtonVariant, Tooltip } from '@patternfly/react-core';

export type GitOpsResetColumnWidthsButtonProps = {
  onReset: () => void;
};

/** Console DataView toolbar control — RhUi undo icon, "Reset column widths". */
export const GitOpsResetColumnWidthsButton: React.FC<GitOpsResetColumnWidthsButtonProps> = ({
  onReset,
}) => {
  const { t } = useGitOpsTranslation();
  const label = t('Reset column widths');

  return (
    <Tooltip content={label}>
      <Button
        variant={ButtonVariant.plain}
        aria-label={label}
        data-test="gitops-reset-column-widths"
        onClick={onReset}
        icon={<RhUiUndoIcon />}
      />
    </Tooltip>
  );
};
