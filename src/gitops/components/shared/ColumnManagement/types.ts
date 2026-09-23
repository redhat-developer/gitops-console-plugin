export const NAMESPACE_COLUMN_ID = 'namespace';

export const GITOPS_COLUMN_MANAGEMENT_SETTING_PREFIX = 'gitops.columnManagement.';

export const getGitOpsColumnManagementSettingKey = (columnManagementID: string): string =>
  `${GITOPS_COLUMN_MANAGEMENT_SETTING_PREFIX}${columnManagementID}`;

export type GitOpsManagedColumn = {
  id: string;
  title: string;
  isShownByDefault: boolean;
  isUntoggleable?: boolean;
  /** Listed under "Additional columns" in the Manage columns modal. */
  additional?: boolean;
  /** Always visible in the table; omitted from the modal (e.g. actions). */
  alwaysShown?: boolean;
};

export type GitOpsColumnManagementModalColumn = {
  id: string;
  title: string;
  isShown: boolean;
  isShownByDefault: boolean;
  isUntoggleable?: boolean;
  additional?: boolean;
};

export type ResolveActiveColumnIdsOptions = {
  columns: GitOpsManagedColumn[];
  savedColumnIds?: string[] | null;
  /** When false, omit the namespace column (project-scoped views). */
  includeNamespaceColumn?: boolean;
};
