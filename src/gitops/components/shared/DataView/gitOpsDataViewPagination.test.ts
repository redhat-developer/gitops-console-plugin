import { getGitOpsPaginationResetKey, paginateItems } from './gitOpsDataViewPagination';

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
});
