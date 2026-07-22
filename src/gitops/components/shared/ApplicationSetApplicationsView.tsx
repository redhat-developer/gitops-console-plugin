import * as React from 'react';

import { ApplicationKind } from '@gitops/models/ApplicationModel';
import { ApplicationSetKind } from '@gitops/models/ApplicationSetModel';
import { ListPageFilter, RowFilter, useUserSettings } from '@openshift-console/dynamic-plugin-sdk';
import { Flex, FlexItem, Stack, StackItem } from '@patternfly/react-core';
import { DataViewState } from '@patternfly/react-data-view/dist/esm/DataView';
import { DataViewTh, DataViewTr } from '@patternfly/react-data-view/dist/esm/DataViewTable';

import { ApplicationSetGraphView } from '../appset/graph/ApplicationSetGraphView';

import { GitOpsDataViewTable } from './DataView';
import GitOpsViewSwitcher from './GitOpsViewSwitcher';
import { APPLICATION_SET_APPLICATIONS_VIEW_SETTING_KEY, GitOpsViewType } from './GitOpsViewType';

import './GitOpsGraphListView.scss';

type ApplicationSetApplicationsViewProps = {
  applicationSet: ApplicationSetKind;
  ownedApps: ApplicationKind[];
  filteredApplications: ApplicationKind[];
  hideNameLabelFilters?: boolean;
  hasOwnedApplications: boolean;
  rowFilters: RowFilter[];
  listPageFilterData: ApplicationKind[];
  onFilterChange: (type: string, value: { selected?: string[]; all?: string[] }) => void;
  nameFilterPlaceholder: string;
  loaded: boolean;
  columns: DataViewTh[];
  rows: DataViewTr[];
  emptyState: React.ReactNode;
  errorState?: React.ReactNode;
  isError?: boolean;
  isEmpty: boolean;
};

const ApplicationSetApplicationsView: React.FC<ApplicationSetApplicationsViewProps> = ({
  applicationSet,
  ownedApps,
  filteredApplications,
  hideNameLabelFilters,
  hasOwnedApplications,
  rowFilters,
  listPageFilterData,
  onFilterChange,
  nameFilterPlaceholder,
  loaded,
  columns,
  rows,
  emptyState,
  errorState,
  isError,
  isEmpty,
}) => {
  const [savedViewType, setSavedViewType, viewSettingsLoaded] = useUserSettings<GitOpsViewType>(
    APPLICATION_SET_APPLICATIONS_VIEW_SETTING_KEY,
    GitOpsViewType.graph,
    false,
  );
  const [viewType, setViewType] = React.useState<GitOpsViewType>(GitOpsViewType.graph);

  React.useEffect(() => {
    if (viewSettingsLoaded) {
      setViewType(savedViewType ?? GitOpsViewType.graph);
    }
  }, [savedViewType, viewSettingsLoaded]);

  const onViewChange = React.useCallback(
    (newViewType: GitOpsViewType) => {
      setViewType(newViewType);
      setSavedViewType(newViewType);
    },
    [setSavedViewType],
  );

  const isListView = viewType === GitOpsViewType.list;

  if (!viewSettingsLoaded) {
    return null;
  }

  return (
    <div
      className="gitops-graph-list-view"
      data-test-id={
        viewType === GitOpsViewType.graph
          ? 'applicationset-applications-graph-view'
          : 'applicationset-applications-list-view'
      }
    >
      <Stack>
        <StackItem isFilled={false} className="gitops-graph-list-view__toolbar-row">
          <Flex alignItems={{ default: 'alignItemsCenter' }}>
            <FlexItem flex={{ default: 'flex_1' }}>
              {!hideNameLabelFilters && hasOwnedApplications && (
                <ListPageFilter
                  data={listPageFilterData}
                  loaded={loaded}
                  rowFilters={rowFilters}
                  onFilterChange={onFilterChange}
                  nameFilterPlaceholder={nameFilterPlaceholder}
                />
              )}
            </FlexItem>
            <FlexItem className="gitops-graph-list-view__header">
              <GitOpsViewSwitcher
                viewType={viewType}
                onViewChange={onViewChange}
                isDisabled={ownedApps.length === 0}
                testId="application-set-applications-view-switcher"
              />
            </FlexItem>
          </Flex>
        </StackItem>
        <StackItem isFilled className="gitops-graph-list-view__content">
          <div
            className={
              isListView ? 'gitops-graph-list-view__list-panel' : 'gitops-graph-list-view__panel'
            }
          >
            {isListView ? (
              <GitOpsDataViewTable
                columns={columns}
                rows={rows}
                isEmpty={isEmpty}
                emptyState={emptyState}
                errorState={errorState}
                isError={isError}
                activeState={isEmpty ? DataViewState.empty : null}
              />
            ) : (
              <div className="gitops-graph-list-view__graph">
                <ApplicationSetGraphView
                  applicationSet={applicationSet}
                  applications={filteredApplications}
                />
              </div>
            )}
          </div>
        </StackItem>
      </Stack>
    </div>
  );
};

export default ApplicationSetApplicationsView;
