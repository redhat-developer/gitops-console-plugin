import { paginateItems } from './DataView/gitOpsDataViewPagination';
import {
  filterByConsoleNameAndLabels,
  filterResourcesByLabelQuery,
  fuzzySearch,
  getLabelsSortKey,
  matchesConsoleLabelFilter,
  matchesConsoleNameFilter,
  matchesLabelSearchQuery,
  parseLabelFilterParam,
} from './listPageTextFilters';

const resource = (name: string, labels?: Record<string, string>) => ({
  metadata: { name, labels },
});

describe('fuzzySearch (Console Name filter)', () => {
  it('matches when query letters appear in order, including the Application screenshot case', () => {
    expect(fuzzySearch('appsss', 'app-matrix-2-staging-us-east')).toBe(true);
    expect(fuzzySearch('appsss', 'app-matrix-2-staging-us-west')).toBe(true);
  });

  it('matches the ApplicationSet screenshot case', () => {
    expect(fuzzySearch('testss', 'test-sorting-appset')).toBe(true);
    expect(fuzzySearch('testss', 'test-sorting-single-generator')).toBe(true);
  });

  it('does not match when letters are missing or out of order', () => {
    expect(fuzzySearch('appsss', 'guestbook')).toBe(false);
    expect(fuzzySearch('zzz', 'app-matrix-2-staging-us-east')).toBe(false);
    expect(fuzzySearch('ssa', 'app')).toBe(false);
  });

  it('matches an exact or contiguous substring', () => {
    expect(fuzzySearch('guestbook', 'guestbook')).toBe(true);
    expect(fuzzySearch('book', 'guestbook')).toBe(true);
  });
});

describe('matchesConsoleNameFilter', () => {
  it('keeps every resource when the name query is empty', () => {
    expect(matchesConsoleNameFilter('', 'guestbook')).toBe(true);
    expect(matchesConsoleNameFilter(null, 'guestbook')).toBe(true);
  });

  it('is case-insensitive', () => {
    expect(matchesConsoleNameFilter('APP', 'app-matrix-2-staging-us-east')).toBe(true);
    expect(matchesConsoleNameFilter('TestSS', 'test-sorting-appset')).toBe(true);
  });
});

describe('matchesConsoleLabelFilter', () => {
  const labels = { app: 'guestbook', env: 'prod' };

  it('keeps every resource when no label chips are selected', () => {
    expect(matchesConsoleLabelFilter([], labels)).toBe(true);
    expect(matchesConsoleLabelFilter(undefined, labels)).toBe(true);
  });

  it('requires every chip to match a key=value label', () => {
    expect(matchesConsoleLabelFilter(['app=guestbook'], labels)).toBe(true);
    expect(matchesConsoleLabelFilter(['app=guestbook', 'env=prod'], labels)).toBe(true);
    expect(matchesConsoleLabelFilter(['app=guestbook', 'env=stage'], labels)).toBe(false);
    expect(matchesConsoleLabelFilter(['team=platform'], labels)).toBe(false);
  });

  it('parses Console labels query values', () => {
    expect(parseLabelFilterParam('app=guestbook,env=prod')).toEqual(['app=guestbook', 'env=prod']);
    expect(parseLabelFilterParam(null)).toEqual([]);
  });
});

describe('matchesLabelSearchQuery (GitOps q param)', () => {
  const labels = { app: 'guestbook', env: 'prod' };

  it('matches label keys and key=value, and ignores resource name', () => {
    expect(matchesLabelSearchQuery('', labels)).toBe(true);
    expect(matchesLabelSearchQuery('guestbook', labels)).toBe(true);
    expect(matchesLabelSearchQuery('GUESTBOOK', labels)).toBe(true);
    expect(matchesLabelSearchQuery('app=', labels)).toBe(true);
    expect(matchesLabelSearchQuery('env', labels)).toBe(true);
    expect(matchesLabelSearchQuery('missing', labels)).toBe(false);
    expect(matchesLabelSearchQuery('guestbook', undefined)).toBe(false);
  });
});

describe('getLabelsSortKey', () => {
  it('returns the same key regardless of label key insertion order', () => {
    const first = { app: 'foo', env: 'prod' };
    const second = { env: 'prod', app: 'foo' };
    expect(getLabelsSortKey(first)).toBe('app=foo,env=prod');
    expect(getLabelsSortKey(second)).toBe('app=foo,env=prod');
    expect(getLabelsSortKey(first)).toBe(getLabelsSortKey(second));
  });

  it('sorts keys alphabetically', () => {
    expect(getLabelsSortKey({ z: '1', a: '2', m: '3' })).toBe('a=2,m=3,z=1');
  });

  it('returns an empty string when labels are missing or empty', () => {
    expect(getLabelsSortKey(undefined)).toBe('');
    expect(getLabelsSortKey({})).toBe('');
  });
});

describe('name and label filters with pagination', () => {
  const items = [
    resource('app-matrix-2-staging-us-east', { app: 'matrix' }),
    resource('app-matrix-2-staging-us-west', { app: 'matrix' }),
    resource('guestbook', { app: 'guestbook' }),
    resource('test-sorting-appset'),
  ];

  it('filters by Console name then paginates the filtered set', () => {
    const named = filterByConsoleNameAndLabels(items, 'appsss', []);
    expect(named.map((item) => item.metadata.name)).toEqual([
      'app-matrix-2-staging-us-east',
      'app-matrix-2-staging-us-west',
    ]);
    expect(paginateItems(named, 1, 1).map((item) => item.metadata.name)).toEqual([
      'app-matrix-2-staging-us-east',
    ]);
    expect(paginateItems(named, 2, 1).map((item) => item.metadata.name)).toEqual([
      'app-matrix-2-staging-us-west',
    ]);
  });

  it('filters by Console labels then paginates', () => {
    const labeled = filterByConsoleNameAndLabels(items, '', ['app=guestbook']);
    expect(labeled.map((item) => item.metadata.name)).toEqual(['guestbook']);
    expect(paginateItems(labeled, 1, 50)).toHaveLength(1);
  });

  it('applies name and labels together', () => {
    const both = filterByConsoleNameAndLabels(items, 'appsss', ['app=matrix']);
    expect(both.map((item) => item.metadata.name)).toEqual([
      'app-matrix-2-staging-us-east',
      'app-matrix-2-staging-us-west',
    ]);
    expect(filterByConsoleNameAndLabels(items, 'appsss', ['app=guestbook'])).toEqual([]);
  });

  it('applies the q label search without matching names', () => {
    const byQ = filterResourcesByLabelQuery(items, 'guestbook');
    expect(byQ.map((item) => item.metadata.name)).toEqual(['guestbook']);
    expect(filterResourcesByLabelQuery(items, 'app-matrix')).toEqual([]);
  });
});
