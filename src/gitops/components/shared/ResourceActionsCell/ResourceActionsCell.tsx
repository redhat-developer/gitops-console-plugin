import * as React from 'react';

import { useResourceActionsProvider } from '@gitops/hooks/useResourceActionsProvider';
import ActionDropDown from '@gitops/utils/components/ActionDropDown/ActionDropDown';
import { ApplicationKind, ApplicationResourceStatus } from '@gitops-models/ApplicationModel';

type ResourceActionsCellProps = {
  resource: ApplicationResourceStatus;
  app: ApplicationKind;
  argoBaseURL: string;
  index: number;
};

export const ResourceActionsCell: React.FC<ResourceActionsCellProps> = ({
  resource,
  app,
  argoBaseURL,
  index,
}) => {
  const actionList = useResourceActionsProvider(resource, app, argoBaseURL);

  return (
    <div style={{ textAlign: 'right' }}>
      <ActionDropDown
        actions={actionList ? actionList[0] : []}
        id={`gitops-app-resource-actions-${index}`}
        isKebabToggle={true}
      />
    </div>
  );
};

export default ResourceActionsCell;
