export const GITOPS_DEFAULT_PER_PAGE = 50;

export const GITOPS_PER_PAGE_OPTIONS = [
  { title: '10', value: 10 },
  { title: '20', value: 20 },
  { title: '50', value: 50 },
  { title: '100', value: 100 },
];

const PAGINATION_RESET_IGNORE_PARAMS = new Set(['page', 'perPage', 'sortBy', 'direction']);

export const paginateItems = <T>(items: T[] | undefined, page: number, perPage: number): T[] => {
  const list = items ?? [];
  const safePage = Math.max(page, 1);
  const safePerPage = Math.max(perPage, 1);
  const start = (safePage - 1) * safePerPage;
  return list.slice(start, start + safePerPage);
};

export const getGitOpsPaginationResetKey = (
  namespace: string | null | undefined,
  searchParams: URLSearchParams,
): string => {
  const filtered = [...searchParams.entries()]
    .filter(([key]) => !PAGINATION_RESET_IGNORE_PARAMS.has(key))
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  return `${namespace ?? ''}|${filtered}`;
};
