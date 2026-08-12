import { renderToStaticMarkup } from 'react-dom/server';
import { OperationState } from './OperationState';

const makeApp = (phase?: string, operationType?: string) => ({
  metadata: {
    name: 'test-app',
    ...(operationType === 'Delete' ? { deletionTimestamp: '2024-01-01T00:00:00Z' } : {}),
  },
  status: {
    operationState: phase
      ? {
          phase,
          ...(operationType === 'Sync' ? { operation: { sync: {} } } : { operation: {} }),
        }
      : undefined,
  },
});

describe('OperationState', () => {
  it('renders nothing when no operationState', () => {
    expect(renderToStaticMarkup(<OperationState app={makeApp() as any} />)).toMatchInlineSnapshot(
      `""`,
    );
  });

  it('renders Syncing for Running phase', () => {
    expect(
      renderToStaticMarkup(<OperationState app={makeApp('Running', 'Sync') as any} />),
    ).toMatchInlineSnapshot(
      `"<svg data-icon="CircleNotchIcon" class="undefined fa-spin" style="color:var(--pf-v5-global--primary-color--200)"></svg> Syncing"`,
    );
  });

  it('renders Sync failed for Failed phase', () => {
    expect(
      renderToStaticMarkup(<OperationState app={makeApp('Failed', 'Sync') as any} />),
    ).toMatchInlineSnapshot(
      `"<svg data-icon="ExclamationCircleIcon" style="color:var(--pf-v5-global--danger-color--100)"></svg> Sync failed"`,
    );
  });

  it('renders Sync error for Error phase', () => {
    expect(
      renderToStaticMarkup(<OperationState app={makeApp('Error', 'Sync') as any} />),
    ).toMatchInlineSnapshot(
      `"<svg data-icon="ExclamationCircleIcon" style="color:var(--pf-v5-global--danger-color--100)"></svg> Sync error"`,
    );
  });

  it('renders Sync OK for Succeeded phase', () => {
    expect(
      renderToStaticMarkup(<OperationState app={makeApp('Succeeded', 'Sync') as any} />),
    ).toMatchInlineSnapshot(
      `"<svg data-icon="HeartIcon" style="color:var(--pf-v5-global--success-color--100)"></svg> Sync OK"`,
    );
  });

  it('renders Terminated for Terminating phase', () => {
    expect(
      renderToStaticMarkup(<OperationState app={makeApp('Terminating', 'Sync') as any} />),
    ).toMatchInlineSnapshot(
      `"<svg data-icon="BanIcon" style="color:var(--pf-v5-global--disabled-color--100)"></svg> Terminated"`,
    );
  });

  it('quiet mode hides Succeeded', () => {
    expect(
      renderToStaticMarkup(<OperationState app={makeApp('Succeeded', 'Sync') as any} quiet />),
    ).toMatchInlineSnapshot(`""`);
  });

  it('quiet mode shows Running', () => {
    expect(
      renderToStaticMarkup(<OperationState app={makeApp('Running', 'Sync') as any} quiet />),
    ).toMatchInlineSnapshot(
      `"<svg data-icon="CircleNotchIcon" class="undefined fa-spin" style="color:var(--pf-v5-global--primary-color--200)"></svg> Syncing"`,
    );
  });
});
