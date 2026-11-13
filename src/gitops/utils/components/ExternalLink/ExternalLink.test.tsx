import { renderToStaticMarkup } from 'react-dom/server';

import ExternalLink from './ExternalLink';

describe('ExternalLink', () => {
  it('renders with text', () => {
    expect(
      renderToStaticMarkup(<ExternalLink href="https://example.com" text="Example" />),
    ).toMatchInlineSnapshot(
      `"<a class="co-external-link" href="https://example.com" target="_blank" rel="noopener noreferrer">Example</a>"`,
    );
  });

  it('renders with children', () => {
    expect(
      renderToStaticMarkup(
        <ExternalLink href="https://example.com">
          <strong>Child</strong>
        </ExternalLink>,
      ),
    ).toMatchInlineSnapshot(
      `"<a class="co-external-link" href="https://example.com" target="_blank" rel="noopener noreferrer"><strong>Child</strong></a>"`,
    );
  });

  it('applies additionalClassName', () => {
    expect(
      renderToStaticMarkup(
        <ExternalLink href="https://example.com" text="Link" additionalClassName="extra" />,
      ),
    ).toMatchInlineSnapshot(
      `"<a class="co-external-link extra" href="https://example.com" target="_blank" rel="noopener noreferrer">Link</a>"`,
    );
  });

  it('sets data-test-id', () => {
    expect(
      renderToStaticMarkup(
        <ExternalLink href="https://example.com" text="Link" dataTestID="test-link" />,
      ),
    ).toMatchInlineSnapshot(
      `"<a class="co-external-link" href="https://example.com" target="_blank" rel="noopener noreferrer" data-test-id="test-link">Link</a>"`,
    );
  });

  it('renders href and target without text', () => {
    expect(renderToStaticMarkup(<ExternalLink href="https://example.com" />)).toMatchInlineSnapshot(
      `"<a class="co-external-link" href="https://example.com" target="_blank" rel="noopener noreferrer"></a>"`,
    );
  });

  it('uses children instead of text when both are set', () => {
    expect(
      renderToStaticMarkup(
        <ExternalLink href="https://example.com" text="Ignored">
          Visible
        </ExternalLink>,
      ),
    ).toMatchInlineSnapshot(
      `"<a class="co-external-link" href="https://example.com" target="_blank" rel="noopener noreferrer">Visible</a>"`,
    );
  });

  it('renders an empty link when children are empty', () => {
    expect(
      renderToStaticMarkup(<ExternalLink href="https://example.com">{''}</ExternalLink>),
    ).toMatchInlineSnapshot(
      `"<a class="co-external-link" href="https://example.com" target="_blank" rel="noopener noreferrer"></a>"`,
    );
  });

  describe('Observe/Metrics query params', () => {
    const observeMetricsHref = (queries: Record<string, string>) =>
      `/monitoring/query-browser?${new URLSearchParams({
        units: 'short',
        ...queries,
      }).toString()}`;

    const expectObserveMetricsRoundTrip = (href: string, queries: Record<string, string>) => {
      const params = new URL(href, 'http://localhost').searchParams;
      expect(params.get('units')).toBe('short');
      Object.entries(queries).forEach(([key, value]) => {
        expect(params.get(key)).toBe(value);
      });
    };

    it('encodes SyncActivityCard PromQL query params in the href', () => {
      const queries = {
        query0: "sum(increase(argocd_app_sync_total{namespace='argocd'}[24h])) or on() vector(0)",
        query1: "sum(argocd_app_info{sync_status='Synced', namespace='argocd'}) or on() vector(0)",
        query2:
          "sum(argocd_app_info{sync_status='OutOfSync', namespace='argocd'}) or on() vector(0)",
      };
      const href = observeMetricsHref(queries);

      expect(
        renderToStaticMarkup(<ExternalLink href={href}>View in Observe/Metrics</ExternalLink>),
      ).toMatchInlineSnapshot(
        `"<a class="co-external-link" href="/monitoring/query-browser?units=short&amp;query0=sum%28increase%28argocd_app_sync_total%7Bnamespace%3D%27argocd%27%7D%5B24h%5D%29%29+or+on%28%29+vector%280%29&amp;query1=sum%28argocd_app_info%7Bsync_status%3D%27Synced%27%2C+namespace%3D%27argocd%27%7D%29+or+on%28%29+vector%280%29&amp;query2=sum%28argocd_app_info%7Bsync_status%3D%27OutOfSync%27%2C+namespace%3D%27argocd%27%7D%29+or+on%28%29+vector%280%29" target="_blank" rel="noopener noreferrer">View in Observe/Metrics</a>"`,
      );
      expectObserveMetricsRoundTrip(href, queries);
    });

    it('encodes ReconciliationCard PromQL query params in the href', () => {
      const queries = {
        query0:
          "sum(increase(argocd_app_reconcile_count{namespace='argocd'}[24h])) or on() vector(0)",
      };
      const href = observeMetricsHref(queries);

      expect(
        renderToStaticMarkup(<ExternalLink href={href}>View in Observe/Metrics</ExternalLink>),
      ).toMatchInlineSnapshot(
        `"<a class="co-external-link" href="/monitoring/query-browser?units=short&amp;query0=sum%28increase%28argocd_app_reconcile_count%7Bnamespace%3D%27argocd%27%7D%5B24h%5D%29%29+or+on%28%29+vector%280%29" target="_blank" rel="noopener noreferrer">View in Observe/Metrics</a>"`,
      );
      expectObserveMetricsRoundTrip(href, queries);
    });

    it('encodes OperationalMetricsCard successful-syncs PromQL in the href', () => {
      const queries = {
        query0: "sum(argocd_app_sync_total{phase='Succeeded',namespace='argocd'})",
      };
      const href = observeMetricsHref(queries);

      expect(
        renderToStaticMarkup(<ExternalLink href={href}>View in Observe/Metrics</ExternalLink>),
      ).toMatchInlineSnapshot(
        `"<a class="co-external-link" href="/monitoring/query-browser?units=short&amp;query0=sum%28argocd_app_sync_total%7Bphase%3D%27Succeeded%27%2Cnamespace%3D%27argocd%27%7D%29" target="_blank" rel="noopener noreferrer">View in Observe/Metrics</a>"`,
      );
      expectObserveMetricsRoundTrip(href, queries);
    });

    it('encodes OperationalMetricsCard failed-syncs PromQL in the href', () => {
      const queries = {
        query0: "sum(increase(argocd_app_sync_total{phase!='Succeeded',namespace='argocd'}[24h]))",
      };
      const href = observeMetricsHref(queries);

      expect(
        renderToStaticMarkup(<ExternalLink href={href}>View in Observe/Metrics</ExternalLink>),
      ).toMatchInlineSnapshot(
        `"<a class="co-external-link" href="/monitoring/query-browser?units=short&amp;query0=sum%28increase%28argocd_app_sync_total%7Bphase%21%3D%27Succeeded%27%2Cnamespace%3D%27argocd%27%7D%5B24h%5D%29%29" target="_blank" rel="noopener noreferrer">View in Observe/Metrics</a>"`,
      );
      expectObserveMetricsRoundTrip(href, queries);
    });

    it('encodes OperationalMetricsCard orphaned-resources PromQL in the href', () => {
      const queries = {
        query0: "sum(argocd_app_orphaned_resources_count{namespace='argocd'})",
      };
      const href = observeMetricsHref(queries);

      expect(
        renderToStaticMarkup(<ExternalLink href={href}>View in Observe/Metrics</ExternalLink>),
      ).toMatchInlineSnapshot(
        `"<a class="co-external-link" href="/monitoring/query-browser?units=short&amp;query0=sum%28argocd_app_orphaned_resources_count%7Bnamespace%3D%27argocd%27%7D%29" target="_blank" rel="noopener noreferrer">View in Observe/Metrics</a>"`,
      );
      expectObserveMetricsRoundTrip(href, queries);
    });

    it('encodes OperationalMetricsCard autosync-enabled PromQL in the href', () => {
      const queries = {
        query0: "sum(argocd_app_info{autosync_enabled='true',namespace='argocd'})",
      };
      const href = observeMetricsHref(queries);

      expect(
        renderToStaticMarkup(<ExternalLink href={href}>View in Observe/Metrics</ExternalLink>),
      ).toMatchInlineSnapshot(
        `"<a class="co-external-link" href="/monitoring/query-browser?units=short&amp;query0=sum%28argocd_app_info%7Bautosync_enabled%3D%27true%27%2Cnamespace%3D%27argocd%27%7D%29" target="_blank" rel="noopener noreferrer">View in Observe/Metrics</a>"`,
      );
      expectObserveMetricsRoundTrip(href, queries);
    });

    it('encodes OperationalMetricsCard autosync-disabled PromQL in the href', () => {
      const queries = {
        query0: "sum(argocd_app_info{autosync_enabled='false',namespace='argocd'})",
      };
      const href = observeMetricsHref(queries);

      expect(
        renderToStaticMarkup(<ExternalLink href={href}>View in Observe/Metrics</ExternalLink>),
      ).toMatchInlineSnapshot(
        `"<a class="co-external-link" href="/monitoring/query-browser?units=short&amp;query0=sum%28argocd_app_info%7Bautosync_enabled%3D%27false%27%2Cnamespace%3D%27argocd%27%7D%29" target="_blank" rel="noopener noreferrer">View in Observe/Metrics</a>"`,
      );
      expectObserveMetricsRoundTrip(href, queries);
    });

    it('encodes OperationalMetricsCard repo-queue PromQL in the href', () => {
      const queries = {
        query0: "sum(argocd_repo_pending_request_total{namespace='argocd'})",
      };
      const href = observeMetricsHref(queries);

      expect(
        renderToStaticMarkup(<ExternalLink href={href}>View in Observe/Metrics</ExternalLink>),
      ).toMatchInlineSnapshot(
        `"<a class="co-external-link" href="/monitoring/query-browser?units=short&amp;query0=sum%28argocd_repo_pending_request_total%7Bnamespace%3D%27argocd%27%7D%29" target="_blank" rel="noopener noreferrer">View in Observe/Metrics</a>"`,
      );
      expectObserveMetricsRoundTrip(href, queries);
    });

    it('encodes OperationalMetricsCard git-fetch-failures PromQL in the href', () => {
      const queries = {
        query0: "sum(argocd_git_lsremote_fail_total{namespace='argocd'})",
      };
      const href = observeMetricsHref(queries);

      expect(
        renderToStaticMarkup(<ExternalLink href={href}>View in Observe/Metrics</ExternalLink>),
      ).toMatchInlineSnapshot(
        `"<a class="co-external-link" href="/monitoring/query-browser?units=short&amp;query0=sum%28argocd_git_lsremote_fail_total%7Bnamespace%3D%27argocd%27%7D%29" target="_blank" rel="noopener noreferrer">View in Observe/Metrics</a>"`,
      );
      expectObserveMetricsRoundTrip(href, queries);
    });
  });
});
