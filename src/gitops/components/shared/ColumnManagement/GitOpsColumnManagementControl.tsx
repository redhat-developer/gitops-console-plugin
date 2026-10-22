import * as React from 'react';

import { useGitOpsTranslation } from '@gitops/utils/hooks/useGitOpsTranslation';
import { Button, ButtonVariant, Tooltip } from '@patternfly/react-core';
import { ColumnsIcon } from '@patternfly/react-icons';

import { GitOpsColumnManagementModal } from './GitOpsColumnManagementModal';
import type { GitOpsColumnManagementModalColumn } from './types';

export type GitOpsColumnManagementControlProps = {
  appliedColumns: GitOpsColumnManagementModalColumn[];
  applyColumns: (columns: GitOpsColumnManagementModalColumn[]) => void;
  resourceType: string;
  showNamespaceHelp?: boolean;
};

export const GitOpsColumnManagementControl: React.FC<GitOpsColumnManagementControlProps> = ({
  appliedColumns,
  applyColumns,
  resourceType,
  showNamespaceHelp,
}) => {
  const { t } = useGitOpsTranslation();
  const [isOpen, setIsOpen] = React.useState(false);
  const manageColumnsLabel = t('Manage columns');

  const onClose = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  const onApplyColumns = React.useCallback(
    (columns: GitOpsColumnManagementModalColumn[]) => {
      applyColumns(columns);
      setIsOpen(false);
    },
    [applyColumns],
  );

  return (
    <>
      <Tooltip content={manageColumnsLabel}>
        <Button
          variant={ButtonVariant.plain}
          aria-label={manageColumnsLabel}
          data-test="gitops-manage-columns"
          onClick={() => setIsOpen(true)}
          icon={<ColumnsIcon />}
        />
      </Tooltip>
      <GitOpsColumnManagementModal
        isOpen={isOpen}
        onClose={onClose}
        appliedColumns={appliedColumns}
        applyColumns={onApplyColumns}
        resourceType={resourceType}
        showNamespaceHelp={showNamespaceHelp}
      />
    </>
  );
};
