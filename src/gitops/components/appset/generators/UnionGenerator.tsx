import * as React from 'react';

import { ThIcon } from '@patternfly/react-icons';

import Generators from '../Generators';

import GeneratorView from './GeneratorView';

interface UnionGeneratorProps {
  generator: any;
}

const UnionGenerator: React.FC<UnionGeneratorProps> = ({ generator }) => {
  return (
    <>
      <GeneratorView icon={<ThIcon />} title="Union" />
      <br />
      <div style={{ marginLeft: '32px' }}>
        <Generators generators={generator.generators} />
      </div>
    </>
  );
};

export default UnionGenerator;
