import { CardHeader, Flex, FlexItem } from '@patternfly/react-core';

import { loadingState } from '../../chartHelpers';

const LoadingHeader: React.FC = () => {
  return (
    <CardHeader className="gitops-dashboard__infrastructure-card__loading-condition">
      <Flex style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <FlexItem>
          <div>{loadingState()}</div>
        </FlexItem>
      </Flex>
    </CardHeader>
  );
};

export default LoadingHeader;
