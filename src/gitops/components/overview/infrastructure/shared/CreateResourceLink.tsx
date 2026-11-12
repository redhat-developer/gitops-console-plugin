import { Link } from 'react-router-dom-v5-compat';

import { Flex, FlexItem } from '@patternfly/react-core';
import { PlusCircleIcon } from '@patternfly/react-icons';

import { LINK_MARGIN, LINK_MARGIN_FOR_EMPTY_LIST } from './constants';

export interface CreateResourcePanelProps {
  isEmptyList: boolean;
  createLinkUrlString: string;
  createLinkText: string;
}

const CreateResourceLink: React.FC<CreateResourcePanelProps> = ({
  isEmptyList,
  createLinkUrlString,
  createLinkText,
}) => {
  return (
    <Flex>
      <FlexItem>
        <div style={isEmptyList ? LINK_MARGIN_FOR_EMPTY_LIST : LINK_MARGIN}></div>
        <Link to={createLinkUrlString}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <PlusCircleIcon />
            {createLinkText}
          </span>
        </Link>
      </FlexItem>
    </Flex>
  );
};

export default CreateResourceLink;
