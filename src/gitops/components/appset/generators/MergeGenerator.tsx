import * as React from 'react';
import { DescriptionList, DescriptionListDescription, DescriptionListGroup, DescriptionListTerm } from '@patternfly/react-core';
import { ObjectGroupIcon } from '@patternfly/react-icons';
import GeneratorView from './GeneratorView';
import Generators from '../Generators';

interface MergeGeneratorProps {
  generator: any;
}

const MergeGenerator: React.FC<MergeGeneratorProps> = ({ generator }) => {
  return (
    <>
      <GeneratorView icon={<ObjectGroupIcon />} title="Merge">
        {generator.mergeKeys && (
          <DescriptionList isHorizontal isCompact>
            <DescriptionListGroup>
              <DescriptionListTerm>Merge Keys</DescriptionListTerm>
              <DescriptionListDescription>{generator.mergeKeys.join(', ')}</DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
        )}
      </GeneratorView>
      <br />
      <div style={{ marginLeft: "32px" }}>
        <Generators generators={generator.generators} />
      </div>
    </>
  );
};

export default MergeGenerator;
