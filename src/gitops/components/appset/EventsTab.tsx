import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { ApplicationSetKind } from '../../models/ApplicationSetModel';
import {
  Badge,
  PageSection,
  Title,
} from '@patternfly/react-core';
import './EventsTab.scss';

type EventsTabProps = RouteComponentProps<{ ns: string; name: string }> & {
  obj?: ApplicationSetKind;
  namespace?: string;
  name?: string;
};

const EventsTab: React.FC<EventsTabProps> = ({ obj }) => {
  if (!obj) return null;

  const status = obj.status || {};

  return (
    <PageSection>
      <Title headingLevel="h2" className="co-section-heading">
        Events
      </Title>
      {status.conditions && status.conditions.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {status.conditions.map((condition: any, index: number) => (
            <div key={index} style={{ 
              border: '1px solid #393F44', 
              borderRadius: '8px', 
              padding: '16px',
              backgroundColor: '#212427'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ 
                    width: '24px', 
                    height: '24px', 
                    backgroundColor: condition.status === 'True' ? '#3e8635' : '#c9190b', 
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '8px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: 'white'
                  }}>
                    {condition.status === 'True' ? '✓' : '✗'}
                  </div>
                  <span style={{ fontWeight: '600', fontSize: '16px' }}>
                    {condition.type}
                  </span>
                </div>
                <Badge isRead color={condition.status === 'True' ? 'green' : 'red'}>
                  {condition.status}
                </Badge>
              </div>
              <div style={{ fontSize: '14px', color: '#8a8d90', marginBottom: '8px' }}>
                {condition.message || 'No message available'}
              </div>
              {condition.lastTransitionTime && (
                <div style={{ fontSize: '12px', color: '#8a8d90' }}>
                  Last updated: {new Date(condition.lastTransitionTime).toLocaleString()}
                </div>
              )}
            </div>
          ))}
        </div>
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
            📊
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: '600', marginBottom: '8px' }}>No Events</div>
            <div style={{ fontSize: '14px' }}>
              No events have been recorded for this ApplicationSet.
            </div>
          </div>
        </div>
      )}
    </PageSection>
  );
};

export default EventsTab;
