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
});
