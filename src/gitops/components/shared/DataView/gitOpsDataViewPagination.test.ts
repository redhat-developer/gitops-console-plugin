import {
  getGitOpsPaginationResetKey,
  GITOPS_DEFAULT_PER_PAGE,
  GITOPS_PER_PAGE_OPTIONS,
  paginateItems,
} from './gitOpsDataViewPagination';

describe('paginateItems', () => {
  const items = ['a', 'b', 'c', 'd', 'e'];

  it('returns the first page', () => {
    expect(paginateItems(items, 1, 2)).toEqual(['a', 'b']);
  });

  it('returns a middle page', () => {
    expect(paginateItems(items, 2, 2)).toEqual(['c', 'd']);
  });

  it('returns a partial last page', () => {
    expect(paginateItems(items, 3, 2)).toEqual(['e']);
  });

  it('treats missing items as an empty list', () => {
    expect(paginateItems(undefined, 1, 50)).toEqual([]);
  });

  it('shows page 1 when the requested page is 0', () => {
    expect(paginateItems(items, 0, 2)).toEqual(['a', 'b']);
  });

  it('shows at least one item when items per page is 0', () => {
    expect(paginateItems(items, 1, 0)).toEqual(['a']);
  });

  it('returns an empty page past the end of the list', () => {
    expect(paginateItems(items, 10, 2)).toEqual([]);
  });
});

describe('getGitOpsPaginationResetKey', () => {
  it('ignores pagination and sort URL params', () => {
    const params = new URLSearchParams(
      'page=3&perPage=20&sortBy=name&direction=asc&q=guestbook&rowFilter-app-sync=Synced',
    );

    expect(getGitOpsPaginationResetKey('argocd', params)).toBe(
      'argocd|q=guestbook&rowFilter-app-sync=Synced',
    );
  });

  it('changes when namespace or filters change', () => {
    const params = new URLSearchParams('q=guestbook');

    expect(getGitOpsPaginationResetKey('argocd', params)).not.toBe(
      getGitOpsPaginationResetKey('openshift-gitops', params),
    );
    expect(getGitOpsPaginationResetKey('argocd', params)).not.toBe(
      getGitOpsPaginationResetKey('argocd', new URLSearchParams('q=other')),
    );
  });

  it('changes when health status chips change but not when only the page changes', () => {
    const health = new URLSearchParams('page=2&rowFilter-app-health=Healthy');
    const nextPage = new URLSearchParams('page=3&rowFilter-app-health=Healthy');
    const otherHealth = new URLSearchParams('page=2&rowFilter-app-health=Degraded');

    expect(getGitOpsPaginationResetKey('argocd', health)).toBe(
      getGitOpsPaginationResetKey('argocd', nextPage),
    );
    expect(getGitOpsPaginationResetKey('argocd', health)).not.toBe(
      getGitOpsPaginationResetKey('argocd', otherHealth),
    );
  });

  it('changes when name or label chips change but not when only the page changes', () => {
    const named = new URLSearchParams('page=2&name=appsss');
    const nextPage = new URLSearchParams('page=3&name=appsss');
    const otherName = new URLSearchParams('page=2&name=guestbook');
    const labeled = new URLSearchParams('page=2&labels=app=guestbook');

    expect(getGitOpsPaginationResetKey('argocd', named)).toBe(
      getGitOpsPaginationResetKey('argocd', nextPage),
    );
    expect(getGitOpsPaginationResetKey('argocd', named)).not.toBe(
      getGitOpsPaginationResetKey('argocd', otherName),
    );
    expect(getGitOpsPaginationResetKey('argocd', named)).not.toBe(
      getGitOpsPaginationResetKey('argocd', labeled),
    );
  });

  it('resets for Application Resources list filters but not for page changes', () => {
    const filtered = new URLSearchParams(
      'page=2&rowFilter-resource-sync=Synced&rowFilter-resource-kind=Deployment',
    );
    const nextPage = new URLSearchParams(
      'page=4&rowFilter-resource-sync=Synced&rowFilter-resource-kind=Deployment',
    );
    const otherKind = new URLSearchParams(
      'page=2&rowFilter-resource-sync=Synced&rowFilter-resource-kind=Service',
    );

    expect(getGitOpsPaginationResetKey('openshift-gitops', filtered)).toBe(
      getGitOpsPaginationResetKey('openshift-gitops', nextPage),
    );
    expect(getGitOpsPaginationResetKey('openshift-gitops', filtered)).not.toBe(
      getGitOpsPaginationResetKey('openshift-gitops', otherKind),
    );
  });
});

describe('GitOps detail-tab pagination contract', () => {
  it('uses Console-compatible page size defaults', () => {
    expect(GITOPS_DEFAULT_PER_PAGE).toBe(50);
    expect(GITOPS_PER_PAGE_OPTIONS.map((option) => option.value)).toEqual([10, 20, 50, 100]);
  });

  it('paginates AppProject roles after sort', () => {
    const roles = [
      { name: 'ci-role' },
      { name: 'read-only' },
      { name: 'admin' },
      { name: 'developer' },
    ].sort((a, b) => a.name.localeCompare(b.name));

    expect(paginateItems(roles, 1, 2).map((role) => role.name)).toEqual(['admin', 'ci-role']);
    expect(paginateItems(roles, 2, 2).map((role) => role.name)).toEqual([
      'developer',
      'read-only',
    ]);
  });

  it('paginates AppProject sync windows', () => {
    const windows = [
      { kind: 'allow', schedule: '0 9 * * 1-5' },
      { kind: 'deny', schedule: '0 22 * * *' },
      { kind: 'allow', schedule: '0 12 * * 6' },
    ];

    expect(paginateItems(windows, 1, 2)).toEqual([
      { kind: 'allow', schedule: '0 9 * * 1-5' },
      { kind: 'deny', schedule: '0 22 * * *' },
    ]);
    expect(paginateItems(windows, 2, 2)).toEqual([{ kind: 'allow', schedule: '0 12 * * 6' }]);
  });

  it('paginates ImageUpdater recent updates newest-first display lists', () => {
    const updates = [
      { alias: 'test-nginx', newVersion: '1.17.11' },
      { alias: 'test-memcached', newVersion: '1.6.12' },
      { alias: 'test-redis', newVersion: '7.2.0' },
    ];

    expect(paginateItems(updates, 1, 2).map((update) => update.alias)).toEqual([
      'test-nginx',
      'test-memcached',
    ]);
    expect(paginateItems(updates, 2, 2).map((update) => update.alias)).toEqual(['test-redis']);
  });

  it('paginates Application history after reversing for newest-first display', () => {
    const history = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
    // Default (no column sort): reverse source order, then paginate.
    const displayHistory = [...history].reverse();

    expect(paginateItems(displayHistory, 1, 2).map((entry) => entry.id)).toEqual([4, 3]);
    expect(paginateItems(displayHistory, 2, 2).map((entry) => entry.id)).toEqual([2, 1]);
  });

  it('keeps an explicit sort order when paginating history (no post-sort reverse)', () => {
    const sortedAsc = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

    expect(paginateItems(sortedAsc, 1, 2).map((entry) => entry.id)).toEqual([1, 2]);
    expect(paginateItems(sortedAsc, 2, 2).map((entry) => entry.id)).toEqual([3, 4]);
  });

  it('yields no rows for empty detail-tab tables (no pager expected)', () => {
    expect(paginateItems([], 1, GITOPS_DEFAULT_PER_PAGE)).toEqual([]);
    expect(paginateItems(undefined, 1, GITOPS_DEFAULT_PER_PAGE)).toEqual([]);
  });
});
