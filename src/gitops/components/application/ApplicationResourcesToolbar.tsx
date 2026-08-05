import * as React from 'react';

import GitOpsViewSwitcher from '../shared/GitOpsViewSwitcher';
import { GitOpsViewType } from '../shared/GitOpsViewType';

type ApplicationResourcesToolbarProps = {
  viewType: GitOpsViewType;
  onViewChange: (view: GitOpsViewType) => void;
  isDisabled?: boolean;
};

const ApplicationResourcesToolbar: React.FC<ApplicationResourcesToolbarProps> = (props) => (
  <GitOpsViewSwitcher {...props} testId="application-resources-view-switcher" />
);

export default ApplicationResourcesToolbar;
