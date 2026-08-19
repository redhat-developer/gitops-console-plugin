type LabeledResource = {
  metadata?: {
    name?: string;
    labels?: Record<string, string>;
  };
};

/**
 * Console ListPageFilter Name filter uses fuzzysearch on metadata.name
 * (case-insensitive). Letters of the query must appear in order, not as a
 * contiguous substring.
 */
export const fuzzySearch = (needle: string, haystack: string): boolean => {
  const needleLength = needle.length;
  const haystackLength = haystack.length;
  if (needleLength > haystackLength) {
    return false;
  }
  if (needleLength === haystackLength) {
    return needle === haystack;
  }
  let haystackIndex = 0;
  for (let needleIndex = 0; needleIndex < needleLength; needleIndex++) {
    const needleCode = needle.charCodeAt(needleIndex);
    let found = false;
    while (haystackIndex < haystackLength) {
      if (haystack.charCodeAt(haystackIndex++) === needleCode) {
        found = true;
        break;
      }
    }
    if (!found) {
      return false;
    }
  }
  return true;
};

export const matchesConsoleNameFilter = (
  query: string | null | undefined,
  name: string | undefined,
): boolean => {
  if (!query) {
    return true;
  }
  return fuzzySearch(query.toLowerCase(), (name || '').toLowerCase());
};

export const parseLabelFilterParam = (value: string | null | undefined): string[] =>
  (value ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

export const matchesConsoleLabelFilter = (
  selected: string[] | undefined,
  labels: Record<string, string> | undefined,
): boolean => {
  if (!selected?.length) {
    return true;
  }
  const labelStrings = Object.entries(labels || {}).map(([key, val]) => `${key}=${val ?? ''}`);
  return selected.every((chip) => labelStrings.some((label) => label.includes(chip)));
};

/** Extra GitOps `q` pass used by list pages: match label key or key=value. */
export const matchesLabelSearchQuery = (
  query: string,
  labels: Record<string, string> | undefined,
): boolean => {
  if (!query) {
    return true;
  }
  const normalizedQuery = query.toLowerCase();
  return Object.entries(labels || {}).some(([key, value]) => {
    const labelSelector = `${key}=${value}`;
    return (
      labelSelector.toLowerCase().includes(normalizedQuery) ||
      key.toLowerCase().includes(normalizedQuery)
    );
  });
};

export const filterByConsoleNameAndLabels = <T extends LabeledResource>(
  items: T[] | undefined,
  nameQuery: string | null | undefined,
  labelChips: string[] | undefined,
): T[] =>
  (items ?? []).filter(
    (item) =>
      matchesConsoleNameFilter(nameQuery, item.metadata?.name) &&
      matchesConsoleLabelFilter(labelChips, item.metadata?.labels),
  );

export const filterResourcesByLabelQuery = <T extends LabeledResource>(
  items: T[] | undefined,
  query: string,
): T[] => {
  if (!query) {
    return items ?? [];
  }
  return (items ?? []).filter((item) => matchesLabelSearchQuery(query, item.metadata?.labels));
};
