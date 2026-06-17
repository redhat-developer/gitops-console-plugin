import { HealthStatus } from '@gitops/utils/constants';

import {
  kindToAbbr,
  getTopologyNodeStatus,
  getResourceNodeHealthStatus,
  createSpacerNode,
  getResourceNodeSyncStatus,
} from './utils';

describe('kindToAbbr', () => {
  it('extracts uppercase letters', () => {
    expect(kindToAbbr('Deployment')).toMatchInlineSnapshot(`"D"`);
  });

  it('handles all-lowercase', () => {
    expect(kindToAbbr('pod')).toMatchInlineSnapshot(`"POD"`);
  });

  it('truncates to 4 chars', () => {
    expect(kindToAbbr('CustomResourceDefinition')).toMatchInlineSnapshot(`"CRD"`);
  });

  it('single uppercase word', () => {
    expect(kindToAbbr('Service')).toMatchInlineSnapshot(`"S"`);
  });
});

describe('getTopologyNodeStatus', () => {
  it('Healthy → success', () => {
    expect(getTopologyNodeStatus(HealthStatus.HEALTHY)).toMatchInlineSnapshot(`"success"`);
  });

  it('Missing → warning', () => {
    expect(getTopologyNodeStatus(HealthStatus.MISSING)).toMatchInlineSnapshot(`"warning"`);
  });

  it('Progressing → info', () => {
    expect(getTopologyNodeStatus(HealthStatus.PROGRESSING)).toMatchInlineSnapshot(`"info"`);
  });

  it('Degraded → danger', () => {
    expect(getTopologyNodeStatus(HealthStatus.DEGRADED)).toMatchInlineSnapshot(`"danger"`);
  });

  it('Unknown → default', () => {
    expect(getTopologyNodeStatus(HealthStatus.UNKNOWN)).toMatchInlineSnapshot(`"default"`);
  });
});

describe('getResourceNodeHealthStatus', () => {
  it('Healthy → success', () => {
    expect(getResourceNodeHealthStatus(HealthStatus.HEALTHY)).toMatchInlineSnapshot(`"success"`);
  });

  it('Suspended → warning', () => {
    expect(getResourceNodeHealthStatus(HealthStatus.SUSPENDED)).toMatchInlineSnapshot(`"warning"`);
  });

  it('Degraded → danger', () => {
    expect(getResourceNodeHealthStatus(HealthStatus.DEGRADED)).toMatchInlineSnapshot(`"danger"`);
  });

  it('unknown string → default', () => {
    expect(getResourceNodeHealthStatus('SomethingElse')).toMatchInlineSnapshot(`"default"`);
  });
});

describe('createSpacerNode', () => {
  it('creates spacer with defaults', () => {
    expect(createSpacerNode(1, 'spacer-1')).toMatchInlineSnapshot(`
      {
        "data": {
          "rank": 1,
        },
        "id": "spacer-1",
        "style": {
          "padding": 0,
        },
        "type": "spacer-node",
      }
    `);
  });

  it('creates spacer with padding', () => {
    expect(createSpacerNode(2, 'spacer-2', 10)).toMatchInlineSnapshot(`
      {
        "data": {
          "rank": 2,
        },
        "id": "spacer-2",
        "style": {
          "padding": 10,
        },
        "type": "spacer-node",
      }
    `);
  });
});

describe('getResourceNodeSyncStatus', () => {
  it('Synced → success', () => {
    expect(getResourceNodeSyncStatus({ status: 'Synced' } as any)).toMatchInlineSnapshot(
      `"success"`,
    );
  });

  it('OutOfSync → warning', () => {
    expect(getResourceNodeSyncStatus({ status: 'OutOfSync' } as any)).toMatchInlineSnapshot(
      `"warning"`,
    );
  });

  it('Progressing → info', () => {
    expect(getResourceNodeSyncStatus({ status: 'Progressing' } as any)).toMatchInlineSnapshot(
      `"info"`,
    );
  });

  it('unknown → warning', () => {
    expect(getResourceNodeSyncStatus({ status: 'Unknown' } as any)).toMatchInlineSnapshot(
      `"warning"`,
    );
  });
});
