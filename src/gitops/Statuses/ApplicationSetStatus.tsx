import * as React from 'react';
import {
  HealthDegradedIcon,
  HealthHealthyIcon,
  HealthUnknownIcon,
} from 'src/gitops/utils/components/Icons/Icons';
import { ApplicationSetStatus as AppSetStatus } from 'src/gitops/utils/constants';

interface ApplicationSetStatusProps {
  status: string;
}

const ApplicationSetStatus: React.FC<ApplicationSetStatusProps> = ({ status }) => {
  let targetIcon: React.ReactNode;

  switch (status) {
    case AppSetStatus.HEALTHY:
      targetIcon = <HealthHealthyIcon />;
      break;
    case AppSetStatus.ERROR:
      targetIcon = <HealthDegradedIcon />;
      break;
    default:
      targetIcon = <HealthUnknownIcon />;
  }

  return (
    <span>
      {targetIcon} {status}
    </span>
  );
};

export default ApplicationSetStatus;
