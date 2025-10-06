import * as React from 'react';

import { ThLargeIcon } from '@patternfly/react-icons';

import Generators from '../Generators';

import GeneratorView from './GeneratorView';

interface MatrixGeneratorProps {
  generator: any;
}

const MatrixGenerator: React.FC<MatrixGeneratorProps> = ({ generator }) => {
  return (
    <>
      <GeneratorView icon={<ThLargeIcon />} title="Matrix" />
      <br />
      <div style={{ marginLeft: '32px' }}>
        <Generators generators={generator.generators} />
      </div>
    </>
  );
};

export default MatrixGenerator;
