import { renderToStaticMarkup } from 'react-dom/server';

import SyncStatus from './SyncStatus';

describe('SyncStatus', () => {
  it('renders Synced', () => {
    expect(renderToStaticMarkup(<SyncStatus status="Synced" />)).toMatchInlineSnapshot(
      `"<span style="display:flex;align-items:center;gap:4px;flex-shrink:0"><svg data-icon="GreenCheckCircleIcon"></svg> Synced</span>"`,
    );
  });

  it('renders OutOfSync', () => {
    expect(renderToStaticMarkup(<SyncStatus status="OutOfSync" />)).toMatchInlineSnapshot(
      `"<span style="display:flex;align-items:center;gap:4px;flex-shrink:0"><svg data-icon="ArrowCircleUpIcon" style="color:var(--pf-t--global--icon--color--status--warning--default)"></svg> OutOfSync</span>"`,
    );
  });

  it('renders Unknown', () => {
    expect(renderToStaticMarkup(<SyncStatus status="Unknown" />)).toMatchInlineSnapshot(
      `"<span style="display:flex;align-items:center;gap:4px;flex-shrink:0"><svg data-icon="UnknownIcon" style="color:var(--pf-t--global--icon--color--disabled)"></svg> Unknown</span>"`,
    );
  });

  it('renders empty status', () => {
    expect(renderToStaticMarkup(<SyncStatus status="" />)).toMatchInlineSnapshot(
      `"<span style="display:flex;align-items:center;gap:4px;flex-shrink:0"> </span>"`,
    );
  });

  it('renders Unknown icon for undefined status', () => {
    expect(renderToStaticMarkup(<SyncStatus status={undefined as any} />)).toMatchInlineSnapshot(
      `"<span style="display:flex;align-items:center;gap:4px;flex-shrink:0"> </span>"`,
    );
  });
});
