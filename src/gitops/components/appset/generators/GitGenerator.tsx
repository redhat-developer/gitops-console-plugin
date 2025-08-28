import * as React from 'react';
import { DescriptionList, DescriptionListDescription, DescriptionListGroup, DescriptionListTerm } from '@patternfly/react-core';
import { GitAltIcon } from '@patternfly/react-icons';
import GeneratorView from './GeneratorView';

interface GitGeneratorProps {
  generator: any;
}

const GitGenerator: React.FC<GitGeneratorProps> = ({ generator }) => {
  const generatorType = generator.files ? "File" : "Directory";
  
  return (
    <GeneratorView icon={<GitAltIcon />} title={`git (${generatorType})`}>
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
            <DescriptionListDescription>{generator.directories.length} directory(ies)</DescriptionListDescription>
          </DescriptionListGroup>
        )}
        {generator.files && (
          <DescriptionListGroup>
            <DescriptionListTerm>Files</DescriptionListTerm>
            <DescriptionListDescription>{generator.files.length} file(s)</DescriptionListDescription>
          </DescriptionListGroup>
        )}
      </DescriptionList>
    </GeneratorView>
  );
};

export default GitGenerator;
