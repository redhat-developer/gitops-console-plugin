import { renderToStaticMarkup } from 'react-dom/server';

import ApplicationSetStatus from './ApplicationSetStatus';

describe('ApplicationSetStatus', () => {
  it('renders Healthy', () => {
    expect(renderToStaticMarkup(<ApplicationSetStatus status="Healthy" />)).toMatchInlineSnapshot(
      `"<span><svg data-icon="HeartIcon" style="color:var(--pf-t--global--icon--color--status--success--default)"></svg> Healthy</span>"`,
    );
  });

  it('renders Error', () => {
    expect(renderToStaticMarkup(<ApplicationSetStatus status="Error" />)).toMatchInlineSnapshot(
      `"<span><svg data-icon="HeartBrokenIcon" style="color:var(--pf-t--global--icon--color--status--danger--default)"></svg> Error</span>"`,
    );
  });

  it('renders Unknown for unrecognised status', () => {
    expect(renderToStaticMarkup(<ApplicationSetStatus status="Unknown" />)).toMatchInlineSnapshot(
      `"<span><svg data-icon="UnknownIcon" style="color:var(--pf-t--global--icon--color--disabled)"></svg> Unknown</span>"`,
    );
  });

  it('renders Unknown icon for empty status', () => {
    expect(renderToStaticMarkup(<ApplicationSetStatus status="" />)).toMatchInlineSnapshot(
      `"<span><svg data-icon="UnknownIcon" style="color:var(--pf-t--global--icon--color--disabled)"></svg> </span>"`,
    );
  });
});
