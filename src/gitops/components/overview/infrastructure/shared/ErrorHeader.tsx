import { dangerColor } from '@gitops/utils/components/Icons/Icons';
import { CardHeader, Flex, FlexItem } from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';

const ErrorHeader: React.FC<{ title: string; error: string }> = ({ title, error }) => {
  return (
    <CardHeader className="gitops-dashboard__infrastructure-card__error-condition">
      <Flex direction={{ default: 'column' }} alignSelf={{ default: 'alignSelfCenter' }}>
        <FlexItem alignSelf={{ default: 'alignSelfCenter' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ExclamationCircleIcon style={{ fill: dangerColor }} />
            {title}
          </span>
        </FlexItem>
        <FlexItem alignSelf={{ default: 'alignSelfCenter' }}>{String(error)}</FlexItem>
      </Flex>
    </CardHeader>
  );
};

export default ErrorHeader;
