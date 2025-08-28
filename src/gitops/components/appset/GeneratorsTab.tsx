import * as React from 'react';
import { ApplicationSetKind } from '../../models/ApplicationSetModel';
import { PageSection } from '@patternfly/react-core';
import Generators from './Generators';
import './GeneratorsTab.scss';

type GeneratorsTabProps = {
  obj?: ApplicationSetKind;
  namespace?: string;
  name?: string;
};

const GeneratorsTab: React.FC<GeneratorsTabProps> = ({ obj }) => {
  if (!obj) return null;

  return (
    <PageSection>
      {obj.spec?.generators && obj.spec.generators.length > 0 ? (
        <Generators generators={obj.spec.generators} />
      ) : (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '40px 20px',
          color: '#8a8d90',
          fontSize: '16px'
        }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            backgroundColor: '#393F44', 
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            fontSize: '24px'
          }}>
            ⚙️
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: '600', marginBottom: '8px' }}>No Generators</div>
            <div style={{ fontSize: '14px' }}>
              This ApplicationSet has no generators configured.
            </div>
          </div>
        </div>
      )}
    </PageSection>
  );
};

export default GeneratorsTab;
