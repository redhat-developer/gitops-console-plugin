import * as React from 'react';

import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from '@patternfly/react-core';
import { ContainerNodeIcon } from '@patternfly/react-icons';
import { OCIAppSetGenerator } from "@gitops/models/ApplicationSetModel";
import GeneratorView from './GeneratorView';

interface OCIGeneratorProps {
  generator: OCIAppSetGenerator;
}

const OCIGenerator: React.FC<OCIGeneratorProps> = ({ generator }) => {
  const generatorType = generator.files?.length ? 'File' : 'Directory';

  return (
    <GeneratorView icon={<ContainerNodeIcon />} title={`OCI (${generatorType})`}>
      <DescriptionList isHorizontal isCompact>
        {generator.repoURL && (
          <DescriptionListGroup>
            <DescriptionListTerm>Repository</DescriptionListTerm>
            <DescriptionListDescription>{generator.repoURL}</DescriptionListDescription>
          </DescriptionListGroup>
        )}
        {generator.revision && (
          <DescriptionListGroup>
            <DescriptionListTerm>Revision</DescriptionListTerm>
            <DescriptionListDescription>{generator.revision}</DescriptionListDescription>
          </DescriptionListGroup>
        )}
        {generator.directories && (
          <DescriptionListGroup>
            <DescriptionListTerm>Directories</DescriptionListTerm>
            <DescriptionListDescription>
              {generator.directories.length} directory(ies)
            </DescriptionListDescription>
          </DescriptionListGroup>
        )}
        {generator.files && (
          <DescriptionListGroup>
            <DescriptionListTerm>Files</DescriptionListTerm>
            <DescriptionListDescription>
              {generator.files.length} file(s)
            </DescriptionListDescription>
          </DescriptionListGroup>
        )}
      </DescriptionList>
    </GeneratorView>
  );
};

export default OCIGenerator;
