import * as React from 'react';

import './GitOpsListPageToolbar.scss';

export type GitOpsListPageToolbarProps = {
  filters?: React.ReactNode;
  columnManagement?: React.ReactNode;
  actions?: React.ReactNode;
};

export const GitOpsListPageToolbar: React.FC<GitOpsListPageToolbarProps> = ({
  filters,
  columnManagement,
  actions,
}) => {
  if (!filters && !columnManagement && !actions) {
    return null;
  }

  return (
    <div className="gitops-list-page-toolbar" data-test="gitops-list-page-toolbar">
      <div className="gitops-list-page-toolbar__primary">
        {filters && <div className="gitops-list-page-toolbar__filters">{filters}</div>}
        {columnManagement && (
          <div className="gitops-list-page-toolbar__columns">{columnManagement}</div>
        )}
      </div>
      {actions && <div className="gitops-list-page-toolbar__actions">{actions}</div>}
    </div>
  );
};
