import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom-v5-compat';

import {
  countTickFormat,
  errorState,
  getCountAxisConfig,
  getDayOfWeek,
  getNamespacePath,
  LinkedTSpan,
  loadingState,
  NoDataPointsFound,
  relativeTimeTickFormat,
} from './chartHelpers';

describe('relativeTimeTickFormat', () => {
  // `relativeTimeTickFormat` computes "time ago" labels relative to `Date.now()`, so pin it to a
  // fixed instant for deterministic assertions.
  const NOW = new Date('2024-01-01T12:00:00.000Z').getTime();

  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(NOW);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('formats sub-hour tick intervals as minutes-ago', () => {
    const ticks = [NOW - 10 * 60 * 1000, NOW - 5 * 60 * 1000, NOW];
    expect(relativeTimeTickFormat(NOW - 5 * 60 * 1000, 1, ticks)).toBe('-5m');
  });

  it('formats sub-hour (but not sub-minute) intervals as -h:mm', () => {
    // Interval between ticks is 20 minutes (< 1h), but the tick itself is 90 minutes in the past,
    // which is NOT "less than an hour away" overall -- hits the `-${mod}:${rem}` branch.
    const ticks = [NOW - 40 * MINUTE_MS(), NOW - 20 * MINUTE_MS(), NOW];
    expect(relativeTimeTickFormat(NOW - 90 * MINUTE_MS(), 1, ticks)).toBe('-1:30');
  });

  it('formats hour-or-longer tick intervals using a localized clock time', () => {
    const oneHourAgo = NOW - 60 * 60 * 1000;
    const ticks = [oneHourAgo, NOW];
    const t = new Date(oneHourAgo);
    const datePart =
      getDayOfWeek(t.getDay()) +
      ' ' +
      t.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
    expect(relativeTimeTickFormat(oneHourAgo, 0, ticks)).toBe(
      datePart + '\n' + t.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }),
    );
  });

  it('falls back to a 1-hour assumed interval when fewer than two ticks are given', () => {
    const t = new Date(NOW - 60 * 60 * 1000);
    const datePart =
      getDayOfWeek(t.getDay()) +
      ' ' +
      t.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
    expect(relativeTimeTickFormat(NOW - 60 * 60 * 1000, 0, [NOW - 60 * 60 * 1000])).toBe(
      datePart + '\n' + t.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }),
    );
  });
});

function MINUTE_MS() {
  return 60 * 1000;
}

describe('countTickFormat', () => {
  it('formats small counts verbatim', () => {
    expect(countTickFormat(0)).toBe('0');
    expect(countTickFormat(7)).toBe('7');
  });

  it('truncates fractional ticks to whole numbers', () => {
    expect(countTickFormat(4.8)).toBe('4');
  });

  it('compact-formats large counts', () => {
    expect(countTickFormat(1500)).toBe('1.5K');
    expect(countTickFormat(2_000_000)).toBe('2M');
  });
});

describe('getCountAxisConfig', () => {
  it('reserves headroom above the data max and lands the top tick exactly on it', () => {
    const { tickValues, domainMax } = getCountAxisConfig(8, 1.2, 5);

    expect(domainMax).toBe(tickValues[tickValues.length - 1]);
    expect(domainMax).toBeGreaterThanOrEqual(8 * 1.2);
  });

  it('produces evenly-spaced, whole-number ticks (no duplicate labels after truncation)', () => {
    const { tickValues } = getCountAxisConfig(7, 1.2, 5);

    for (let i = 1; i < tickValues.length; i += 1) {
      expect(Number.isInteger(tickValues[i])).toBe(true);
      expect(tickValues[i] - tickValues[i - 1]).toBe(tickValues[1] - tickValues[0]);
    }
    // Distinct after Number.parseInt-style truncation -- the bug this guards against.
    const truncated = tickValues.map((v) => Math.trunc(v));
    expect(new Set(truncated).size).toBe(truncated.length);
  });

  it('never produces a sub-1 step, even for a tiny data max', () => {
    const { tickValues } = getCountAxisConfig(1, 1.2, 5);
    const step = tickValues[1] - tickValues[0];

    expect(step).toBeGreaterThanOrEqual(1);
  });

  it('treats an all-zero data max the same as a max of 1 (still produces whole-number ticks)', () => {
    const { tickValues, domainMax } = getCountAxisConfig(0);

    expect(domainMax).toBeGreaterThan(0);
    expect(tickValues[0]).toBe(0);
  });

  it('picks a "nice" step from the 1/2/5 x 10^n family for larger domains', () => {
    const { tickValues } = getCountAxisConfig(950, 1.2, 5);
    const step = tickValues[1] - tickValues[0];
    const power = Math.floor(Math.log10(step));
    const normalized = step / Math.pow(10, power);

    expect([1, 2, 5, 10]).toContain(Math.round(normalized));
  });
});

describe('getNamespacePath', () => {
  it('returns the all-namespaces path when no namespace is given', () => {
    expect(getNamespacePath(undefined)).toBe('/all-namespaces');
    expect(getNamespacePath('')).toBe('/all-namespaces');
  });

  it('returns the namespaced path otherwise', () => {
    expect(getNamespacePath('openshift-gitops')).toBe('/ns/openshift-gitops');
  });
});

describe('NoDataPointsFound', () => {
  it('renders the empty-state message at the requested height', () => {
    const markup = renderToStaticMarkup(<NoDataPointsFound height={190} />);

    expect(markup).toContain('No datapoints found.');
    expect(markup).toContain('height:190px');
  });
});

describe('LinkedTSpan', () => {
  it('wraps the matching linkText tspan in a Link to the given destination', () => {
    // `Link`'s click handler calls `useNavigate`, which sets up a `useLayoutEffect` -- harmless,
    // but React logs a "useLayoutEffect does nothing on the server" warning under
    // `renderToStaticMarkup`. Silence just that expected noise for this one test.
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <svg>
          <text>
            <LinkedTSpan linkText="Synced" to="/some/path">
              Synced
            </LinkedTSpan>
          </text>
        </svg>
      </MemoryRouter>,
    );

    consoleError.mockRestore();

    expect(markup).toContain('<a class="gitops-dashboard__link" href="/some/path">');
    expect(markup).toContain('>Synced</tspan>');
  });

  it('renders non-matching tspan text as plain text, with no link', () => {
    const markup = renderToStaticMarkup(
      <svg>
        <text>
          <LinkedTSpan linkText="Synced" to="/some/path">
            : 3 (60%)
          </LinkedTSpan>
        </text>
      </svg>,
    );

    expect(markup).not.toContain('<a ');
    expect(markup).toContain('>: 3 (60%)</tspan>');
  });
});

describe('loadingState', () => {
  it('renders an EmptyState using a Spinner icon', () => {
    const markup = renderToStaticMarkup(loadingState());

    expect(markup).toContain('class="gitops-dashboard__half-size-empty-state"');
    expect(markup).toContain('data-status="custom"');
    expect(markup).toContain('role="progressbar"');
    expect(markup).toContain('Loading...');
  });
});

describe('errorState', () => {
  it('builds an ErrorState element with the given title and body text', () => {
    const element = errorState('Unable to retrieve applications', 'boom');

    expect(element.props.titleText).toBe('Unable to retrieve applications');
    expect(element.props.bodyText).toBe('boom');
    expect(element.props.status).toBe('danger');
  });
});
