import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

import { useUserSettings } from '@openshift-console/dynamic-plugin-sdk';
import type { DataViewTh } from '@patternfly/react-data-view/dist/esm/DataViewTable';

import { getGitOpsDataViewColumnId } from './gitOpsDataViewColumnId';
import { isDataViewThObject } from './gitOpsDataViewGuards';
import {
  GITOPS_COLUMN_WIDTH_SETTING_KEY,
  useGitOpsDataViewResizableColumns,
  useGitOpsResetColumnWidths,
} from './useGitOpsDataViewResizableColumns';

jest.mock('@openshift-console/dynamic-plugin-sdk', () => ({
  ...jest.requireActual('@openshift-console/dynamic-plugin-sdk'),
  useUserSettings: jest.fn(),
}));

const mockUseUserSettings = useUserSettings as jest.Mock;

describe('getGitOpsDataViewColumnId', () => {
  it('prefers props.id then aria-label', () => {
    expect(getGitOpsDataViewColumnId({ cell: 'Name', props: { id: 'name' } }, 0)).toBe('name');
    expect(
      getGitOpsDataViewColumnId({ cell: 'Name', props: { 'aria-label': 'sync-status' } }, 1),
    ).toBe('sync-status');
  });

  it('skips actions aria-label so actions stay non-resizable in prefs', () => {
    expect(
      getGitOpsDataViewColumnId({ cell: '', props: { 'aria-label': 'actions' } }, 3),
    ).toBeUndefined();
  });

  it('falls back to column-${index}, never the translated title', () => {
    expect(getGitOpsDataViewColumnId({ cell: 'Historique' }, 2)).toBe('column-2');
  });
});

describe('GITOPS_COLUMN_WIDTH_SETTING_KEY', () => {
  it('uses a stable user-settings key', () => {
    expect(GITOPS_COLUMN_WIDTH_SETTING_KEY).toBe('gitops.tableColumnsWidth');
  });
});

type ResizableResult = ReturnType<typeof useGitOpsDataViewResizableColumns>;

const mountResizableHook = (
  props: Parameters<typeof useGitOpsDataViewResizableColumns>[0],
): {
  getResult: () => ResizableResult;
  rerender: (next: typeof props) => void;
  unmount: () => void;
} => {
  const container = document.createElement('div');
  let result: ResizableResult | undefined;
  let currentProps = props;

  const Probe: React.FC = () => {
    result = useGitOpsDataViewResizableColumns(currentProps);
    return null;
  };

  act(() => {
    render(<Probe />, container);
  });

  return {
    getResult: () => {
      if (!result) {
        throw new Error('hook did not render');
      }
      return result;
    },
    rerender: (next) => {
      currentProps = next;
      act(() => {
        render(<Probe />, container);
      });
    },
    unmount: () => {
      unmountComponentAtNode(container);
    },
  };
};

describe('useGitOpsDataViewResizableColumns', () => {
  const baseColumns: DataViewTh[] = [
    {
      cell: 'Name',
      props: { id: 'name', 'aria-label': 'name' },
      resizableProps: { isResizable: true, resizeButtonAriaLabel: 'Resize Name column' },
    },
    {
      cell: '',
      props: { 'aria-label': 'actions' },
    },
  ];

  beforeEach(() => {
    mockUseUserSettings.mockReset();
  });

  it('passes columns through when tableID is missing', () => {
    mockUseUserSettings.mockReturnValue([undefined, jest.fn(), true]);
    const { getResult, unmount } = mountResizableHook({
      columns: baseColumns,
      isResizable: true,
    });
    expect(getResult().columns).toBe(baseColumns);
    expect(getResult().widthsLoaded).toBe(true);
    expect(getResult().widthsReadyKey).toBe('none');
    unmount();
  });

  it('seeds resizableProps.width from saved settings and wires onResize', () => {
    const setColumnWidths = jest.fn();
    mockUseUserSettings.mockReturnValue([{ apps: { name: 240 } }, setColumnWidths, true]);
    const { getResult, unmount } = mountResizableHook({
      columns: baseColumns,
      tableID: 'apps',
      isResizable: true,
    });
    const { columns, widthsReadyKey } = getResult();
    expect(widthsReadyKey).toBe('ready');
    const [nameCol, actionsCol] = columns;
    if (!isDataViewThObject(nameCol) || !isDataViewThObject(actionsCol)) {
      throw new Error('expected object columns');
    }
    expect(nameCol.resizableProps?.width).toBe(240);
    expect(typeof nameCol.resizableProps?.onResize).toBe('function');
    expect(actionsCol.resizableProps).toBeUndefined();

    act(() => {
      nameCol.resizableProps?.onResize?.({} as React.MouseEvent<HTMLDivElement>, 'name', 300);
    });
    expect(setColumnWidths).toHaveBeenCalled();
    const updater = setColumnWidths.mock.calls[0][0];
    expect(updater({ apps: { name: 240 } })).toEqual({ apps: { name: 300 } });
    unmount();
  });

  it('bumps resetEpoch once when saved widths go from present to absent', () => {
    const setColumnWidths = jest.fn();
    let widths: Record<string, Record<string, number>> | undefined = { apps: { name: 200 } };
    mockUseUserSettings.mockImplementation(() => [widths, setColumnWidths, true]);

    const { getResult, rerender, unmount } = mountResizableHook({
      columns: baseColumns,
      tableID: 'apps',
      isResizable: true,
    });
    expect(getResult().resetEpoch).toBe(0);

    widths = undefined;
    rerender({ columns: baseColumns, tableID: 'apps', isResizable: true });
    expect(getResult().resetEpoch).toBe(1);

    rerender({ columns: baseColumns, tableID: 'apps', isResizable: true });
    expect(getResult().resetEpoch).toBe(1);
    unmount();
  });
});

describe('useGitOpsResetColumnWidths', () => {
  beforeEach(() => {
    mockUseUserSettings.mockReset();
  });

  it('removes the table entry and collapses to undefined when empty', () => {
    const setColumnWidths = jest.fn();
    mockUseUserSettings.mockReturnValue([
      { apps: { name: 200 }, other: { name: 100 } },
      setColumnWidths,
      true,
    ]);

    const container = document.createElement('div');
    let latest: ReturnType<typeof useGitOpsResetColumnWidths> | undefined;
    const Probe: React.FC = () => {
      latest = useGitOpsResetColumnWidths('apps');
      return null;
    };
    act(() => {
      render(<Probe />, container);
    });
    expect(latest?.canResetColumnWidths).toBe(true);

    act(() => {
      latest?.resetColumnWidths();
    });
    const updater = setColumnWidths.mock.calls[0][0];
    expect(updater({ apps: { name: 200 }, other: { name: 100 } })).toEqual({
      other: { name: 100 },
    });
    expect(updater({ apps: { name: 200 } })).toBeUndefined();
    unmountComponentAtNode(container);
  });
});
