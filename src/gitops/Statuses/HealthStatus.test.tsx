import { renderToStaticMarkup } from 'react-dom/server';
import HealthStatus, { HealthStatusIcon } from './HealthStatus';

describe('HealthStatus', () => {
  it('renders Healthy', () => {
    expect(renderToStaticMarkup(<HealthStatus status="Healthy" />)).toMatchInlineSnapshot(
      `"<div><div><svg data-icon="HeartIcon" style="color:var(--pf-v5-global--success-color--100)"></svg> Healthy</div></div>"`,
    );
  });

  it('renders Degraded', () => {
    expect(renderToStaticMarkup(<HealthStatus status="Degraded" />)).toMatchInlineSnapshot(
      `"<div><div><svg data-icon="HeartBrokenIcon" style="color:var(--pf-v5-global--danger-color--100)"></svg> Degraded</div></div>"`,
    );
  });

  it('renders Progressing', () => {
    expect(renderToStaticMarkup(<HealthStatus status="Progressing" />)).toMatchInlineSnapshot(
      `"<div><div><svg data-icon="CircleNotchIcon" class="undefined fa-spin" style="color:var(--pf-v5-global--primary-color--200)"></svg> Progressing</div></div>"`,
    );
  });

  it('renders Unknown for unrecognized status', () => {
    expect(renderToStaticMarkup(<HealthStatus status="SomethingElse" />)).toMatchInlineSnapshot(
      `"<div><div><svg data-icon="UnknownIcon" style="color:var(--pf-v5-global--disabled-color--100)"></svg> SomethingElse</div></div>"`,
    );
  });

  it('renders popover when message is provided', () => {
    expect(
      renderToStaticMarkup(<HealthStatus status="Degraded" message="Something broke" />),
    ).toMatchInlineSnapshot(
      `"<div><div><div data-testid="popover"><div data-testid="popover-header"><div>Degraded</div></div><div data-testid="popover-body"><div>Something broke</div></div><button data-variant="link"><svg data-icon="HeartBrokenIcon" style="color:var(--pf-v5-global--danger-color--100)"></svg> Degraded</button></div></div></div>"`,
    );
  });
});

describe('HealthStatusIcon', () => {
  it('renders Healthy icon', () => {
    expect(renderToStaticMarkup(<HealthStatusIcon status="Healthy" />)).toMatchInlineSnapshot(
      `"<i title="Healthy" class="fa fa-heart utils-health-status-icon" style="color:#18BE94"></i>"`,
    );
  });

  it('renders Degraded icon', () => {
    expect(renderToStaticMarkup(<HealthStatusIcon status="Degraded" />)).toMatchInlineSnapshot(
      `"<i title="Degraded" class="fa fa-heart-broken utils-health-status-icon" style="color:#E96D76"></i>"`,
    );
  });

  it('renders Suspended icon', () => {
    expect(renderToStaticMarkup(<HealthStatusIcon status="Suspended" />)).toMatchInlineSnapshot(
      `"<i title="Suspended" class="fa fa-pause-circle utils-health-status-icon" style="color:#766f94"></i>"`,
    );
  });

  it('renders Missing icon', () => {
    expect(renderToStaticMarkup(<HealthStatusIcon status="Missing" />)).toMatchInlineSnapshot(
      `"<i title="Missing" class="fa fa-ghost utils-health-status-icon" style="color:#f4c030"></i>"`,
    );
  });

  it('renders Progressing icon (spinning)', () => {
    expect(renderToStaticMarkup(<HealthStatusIcon status="Progressing" />)).toMatchInlineSnapshot(
      `"<svg data-icon="CircleNotchIcon" class="undefined fa-spin" style="color:#0DADEA" aria-label="Progressing"></svg>"`,
    );
  });
});
