import { renderToStaticMarkup } from 'react-dom/server';

import ApplicationSetStatus from './ApplicationSetStatus';

describe('ApplicationSetStatus', () => {
  it('renders Healthy', () => {
    expect(renderToStaticMarkup(<ApplicationSetStatus status="Healthy" />)).toMatchInlineSnapshot(
      `"<span><svg data-icon="HeartIcon" style="color:var(--pf-v5-global--success-color--100)"></svg> Healthy</span>"`,
    );
  });

  it('renders Error', () => {
    expect(renderToStaticMarkup(<ApplicationSetStatus status="Error" />)).toMatchInlineSnapshot(
      `"<span><svg data-icon="HeartBrokenIcon" style="color:var(--pf-v5-global--danger-color--100)"></svg> Error</span>"`,
    );
  });

  it('renders Unknown for unrecognised status', () => {
    expect(renderToStaticMarkup(<ApplicationSetStatus status="Unknown" />)).toMatchInlineSnapshot(
      `"<span><svg data-icon="UnknownIcon" style="color:var(--pf-v5-global--disabled-color--100)"></svg> Unknown</span>"`,
    );
  });

  it('renders Unknown icon for empty status', () => {
    expect(renderToStaticMarkup(<ApplicationSetStatus status="" />)).toMatchInlineSnapshot(
      `"<span><svg data-icon="UnknownIcon" style="color:var(--pf-v5-global--disabled-color--100)"></svg> </span>"`,
    );
  });
});
