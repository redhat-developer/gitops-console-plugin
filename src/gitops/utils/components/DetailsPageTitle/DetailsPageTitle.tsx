import { FC, ReactNode } from 'react';

import { Flex, PageBreadcrumb, PageGroup, PageSection } from '@patternfly/react-core';

import './details-page-title.scss';

type DetailsPageTitleProps = {
  breadcrumb: ReactNode;
};

export const PaneHeading: React.FC = ({ children }) => (
  <Flex
    alignItems={{ default: 'alignItemsCenter' }}
    justifyContent={{ default: 'justifyContentSpaceBetween' }}
  >
    {children}
  </Flex>
);

const DetailsPageTitle: FC<DetailsPageTitleProps> = ({ breadcrumb, children }) => (
  <div>
    <PageGroup>
      <PageBreadcrumb>{breadcrumb}</PageBreadcrumb>
      <PageSection className="details-page-title" hasBodyWrapper={false}>
        {children}
      </PageSection>
    </PageGroup>
  </div>
);

export default DetailsPageTitle;
