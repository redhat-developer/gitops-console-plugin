import * as React from 'react';

import ClusterGenerator from './generators/ClusterGenerator';
import GenericGenerator from './generators/GenericGenerator';
import GitGenerator from './generators/GitGenerator';
import ListGenerator from './generators/ListGenerator';
import MatrixGenerator from './generators/MatrixGenerator';
import MergeGenerator from './generators/MergeGenerator';
import UnionGenerator from './generators/UnionGenerator';

interface GeneratorsProps {
  generators: any[];
}

const Generators: React.FC<GeneratorsProps> = ({ generators }) => {
  const renderGenerator = (generator: any, index: number) => {
    const generatorType = Object.keys(generator)[0];
    const generatorData = generator[generatorType];

    switch (generatorType) {
      case 'clusters':
        return <ClusterGenerator key={index} generator={generatorData} />;
      case 'git':
        return <GitGenerator key={index} generator={generatorData} />;
      case 'list':
        return <ListGenerator key={index} generator={generatorData} />;
      case 'merge':
        return <MergeGenerator key={index} generator={generatorData} />;
      case 'matrix':
        return <MatrixGenerator key={index} generator={generatorData} />;
      case 'union':
        return <UnionGenerator key={index} generator={generatorData} />;
      default:
        return <GenericGenerator key={index} gentype={generatorType} generator={generator} />;
    }
  };

  return (
    <div>
      {generators.map((generator, index) => (
        <div key={index}>
          {renderGenerator(generator, index)}
          <br />
        </div>
      ))}
    </div>
  );
};

export default Generators;
