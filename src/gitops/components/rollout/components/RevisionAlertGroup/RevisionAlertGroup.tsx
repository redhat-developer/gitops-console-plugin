import * as React from 'react';

import { useGitOpsTranslation } from '@gitops/utils/hooks/useGitOpsTranslation';
import { Alert, AlertActionCloseButton, AlertGroup, AlertVariant } from '@patternfly/react-core';

export type RevisionAlert = {
  key: string;
  title: string;
  message: string;
  details?: string;
  variant: AlertVariant;
  actionLinks?: React.ReactNode;
};

type RevisionAlertGroupProps = {
  alerts: RevisionAlert[];
  onRemove: (key: string) => void;
};

export const RevisionAlertGroup: React.FC<RevisionAlertGroupProps> = ({ alerts, onRemove }) => {
  const { t } = useGitOpsTranslation();

  return (
    <AlertGroup isToast hasAnimations isLiveRegion>
      {alerts.map(({ key, title, message, details, variant }) => (
        <Alert
          key={key}
          variant={variant}
          title={title}
          isExpandable={true}
          onTimeout={() => onRemove(key)}
          actionClose={
            <AlertActionCloseButton aria-label={t('Close')} onClose={() => onRemove(key)} />
          }
        >
          {message}
          {details && <div>{details}</div>}
        </Alert>
      ))}
    </AlertGroup>
  );
};

export const useRevisionAlerts = () => {
  const { t } = useGitOpsTranslation();
  const [alerts, setAlerts] = React.useState<RevisionAlert[]>([]);

  const removeAlert = React.useCallback((key: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.key !== key));
  }, []);

  const onRevisionError = React.useCallback(
    (error: Error | string, action: string) => {
      setAlerts((prev) => [
        ...prev,
        {
          key: `${Date.now()}-${prev.length}`,
          title: t('{{x}} failed with an error.', { x: action }),
          message: error instanceof Error ? error.message : error,
          details: error instanceof Error ? error.stack : undefined,
          variant: AlertVariant.danger,
        },
      ]);
    },
    [t],
  );

  return { alerts, removeAlert, onRevisionError };
};
