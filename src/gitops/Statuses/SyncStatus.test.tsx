import { renderToStaticMarkup } from 'react-dom/server';
import SyncStatus from './SyncStatus';

describe('SyncStatus', () => {
  it('renders Synced', () => {
    expect(renderToStaticMarkup(<SyncStatus status="Synced" />)).toMatchInlineSnapshot(
      `"<span><svg data-icon="GreenCheckCircleIcon"></svg> Synced</span>"`,
    );
  });

  it('renders OutOfSync', () => {
    expect(renderToStaticMarkup(<SyncStatus status="OutOfSync" />)).toMatchInlineSnapshot(
      `"<span><svg data-icon="ArrowCircleUpIcon" style="color:var(--pf-v5-global--warning-color--100)"></svg> OutOfSync</span>"`,
    );
  });

  it('renders Unknown', () => {
    expect(renderToStaticMarkup(<SyncStatus status="Unknown" />)).toMatchInlineSnapshot(
      `"<span><svg data-icon="UnknownIcon" style="color:var(--pf-v5-global--disabled-color--100)"></svg> Unknown</span>"`,
    );
  });

  it('renders empty status', () => {
    expect(renderToStaticMarkup(<SyncStatus status="" />)).toMatchInlineSnapshot(
      `"<span> </span>"`,
    );
  });
});
