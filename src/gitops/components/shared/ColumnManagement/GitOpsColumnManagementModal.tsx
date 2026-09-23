import * as React from 'react';

import { useGitOpsTranslation } from '@gitops/utils/hooks/useGitOpsTranslation';
import {
  Button,
  ButtonVariant,
  DataList,
  DataListCell,
  DataListCheck,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  Form,
  Grid,
  GridItem,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from '@patternfly/react-core';

import type { GitOpsColumnManagementModalColumn } from './types';

import './GitOpsColumnManagementModal.scss';

export type GitOpsColumnManagementModalProps = {
  isOpen: boolean;
  onClose: () => void;
  appliedColumns: GitOpsColumnManagementModalColumn[];
  applyColumns: (columns: GitOpsColumnManagementModalColumn[]) => void;
  resourceType: string;
  showNamespaceHelp?: boolean;
};

const ColumnRow: React.FC<{
  column: GitOpsColumnManagementModalColumn;
  isChecked: boolean;
  onToggle: (columnId: string) => void;
}> = ({ column, isChecked, onToggle }) => {
  const checkboxId = `gitops-column-management-${column.id}`;
  return (
    <DataListItem aria-labelledby={`${checkboxId}-label`} id={column.id}>
      <DataListItemRow>
        <DataListCheck
          aria-labelledby={`${checkboxId}-label`}
          isChecked={isChecked}
          isDisabled={column.isUntoggleable}
          id={checkboxId}
          name={column.id}
          onChange={() => onToggle(column.id)}
        />
        <DataListItemCells
          dataListCells={[
            <DataListCell key={column.id}>
              <label id={`${checkboxId}-label`} htmlFor={checkboxId}>
                {column.title}
              </label>
            </DataListCell>,
          ]}
        />
      </DataListItemRow>
    </DataListItem>
  );
};

/**
 * Manage columns modal with Default / Additional sections (console list-page layout).
 */
export const GitOpsColumnManagementModal: React.FC<GitOpsColumnManagementModalProps> = ({
  isOpen,
  onClose,
  appliedColumns,
  applyColumns,
  resourceType,
  showNamespaceHelp = false,
}) => {
  const { t } = useGitOpsTranslation();
  const [checkedColumnIds, setCheckedColumnIds] = React.useState<Set<string>>(
    () => new Set(appliedColumns.filter((column) => column.isShown).map((column) => column.id)),
  );

  React.useEffect(() => {
    if (isOpen) {
      setCheckedColumnIds(
        new Set(appliedColumns.filter((column) => column.isShown).map((column) => column.id)),
      );
    }
  }, [isOpen, appliedColumns]);

  const defaultColumns = React.useMemo(
    () => appliedColumns.filter((column) => !column.additional),
    [appliedColumns],
  );
  const additionalColumns = React.useMemo(
    () => appliedColumns.filter((column) => column.additional),
    [appliedColumns],
  );

  const onToggle = React.useCallback((columnId: string) => {
    setCheckedColumnIds((previous) => {
      const next = new Set(previous);
      if (next.has(columnId)) {
        next.delete(columnId);
      } else {
        next.add(columnId);
      }
      return next;
    });
  }, []);

  const onSave = React.useCallback(
    (event: React.FormEvent | React.MouseEvent) => {
      event.preventDefault();
      applyColumns(
        appliedColumns.map((column) => ({
          ...column,
          isShown: column.isUntoggleable || checkedColumnIds.has(column.id),
        })),
      );
      onClose();
    },
    [applyColumns, appliedColumns, checkedColumnIds, onClose],
  );

  const onRestoreDefaults = React.useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      setCheckedColumnIds(
        new Set(
          appliedColumns
            .filter((column) => column.isShownByDefault || column.isUntoggleable)
            .map((column) => column.id),
        ),
      );
    },
    [appliedColumns],
  );

  return (
    <Modal
      className="gitops-column-management-modal"
      isOpen={isOpen}
      onClose={onClose}
      variant="medium"
      aria-labelledby="gitops-column-management-modal-title"
      data-test="gitops-column-management-modal"
    >
      <ModalHeader
        title={t('Manage columns')}
        labelId="gitops-column-management-modal-title"
        data-test-id="modal-title"
      />
      <ModalBody>
        <Form id="gitops-column-management-form" onSubmit={onSave}>
          <p className="gitops-column-management-modal__description">
            {t('Selected columns will appear in the table.')}
          </p>
          {showNamespaceHelp && (
            <p className="gitops-column-management-modal__namespace-help">
              {t('The namespace column is only shown when in "All projects"')}
            </p>
          )}
          <Grid hasGutter className="gitops-column-management-modal__grid">
            <GridItem sm={6}>
              <label className="gitops-column-management-modal__section-title">
                {t('Default {{resourceKind}} columns', { resourceKind: resourceType })}
              </label>
              <DataList
                aria-label={t('Default {{resourceKind}} columns', { resourceKind: resourceType })}
                isCompact
                className="gitops-column-management-modal__list"
              >
                {defaultColumns.map((column) => (
                  <ColumnRow
                    key={column.id}
                    column={column}
                    isChecked={checkedColumnIds.has(column.id)}
                    onToggle={onToggle}
                  />
                ))}
              </DataList>
            </GridItem>
            <GridItem sm={6}>
              <label className="gitops-column-management-modal__section-title">
                {t('Additional columns')}
              </label>
              <DataList
                aria-label={t('Additional columns')}
                isCompact
                className="gitops-column-management-modal__list"
              >
                {additionalColumns.length === 0 ? (
                  <DataListItem aria-labelledby="gitops-column-management-no-additional">
                    <DataListItemRow>
                      <DataListItemCells
                        dataListCells={[
                          <DataListCell key="empty" id="gitops-column-management-no-additional">
                            <span className="pf-v6-u-color-200">{t('None')}</span>
                          </DataListCell>,
                        ]}
                      />
                    </DataListItemRow>
                  </DataListItem>
                ) : (
                  additionalColumns.map((column) => (
                    <ColumnRow
                      key={column.id}
                      column={column}
                      isChecked={checkedColumnIds.has(column.id)}
                      onToggle={onToggle}
                    />
                  ))
                )}
              </DataList>
            </GridItem>
          </Grid>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button
          key="save"
          variant={ButtonVariant.primary}
          onClick={onSave}
          data-test="gitops-column-management-save"
        >
          {t('Save')}
        </Button>
        <Button
          key="cancel"
          variant={ButtonVariant.link}
          onClick={onClose}
          data-test="gitops-column-management-cancel"
        >
          {t('Cancel')}
        </Button>
        <Button
          key="restore"
          variant={ButtonVariant.link}
          onClick={onRestoreDefaults}
          data-test="gitops-column-management-restore"
        >
          {t('Restore default columns')}
        </Button>
      </ModalFooter>
    </Modal>
  );
};
