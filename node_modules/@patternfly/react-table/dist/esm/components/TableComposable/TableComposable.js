import { __rest } from "tslib";
import * as React from 'react';
import styles from '@patternfly/react-styles/css/components/Table/table';
import stylesGrid from '@patternfly/react-styles/css/components/Table/table-grid';
import stylesTreeView from '@patternfly/react-styles/css/components/Table/table-tree-view';
import { css } from '@patternfly/react-styles';
import { toCamel } from '../Table/utils/utils';
import { useOUIAProps, handleArrows, setTabIndex } from '@patternfly/react-core';
import { TableGridBreakpoint } from '../Table/TableTypes';
const TableComposableBase = (_a) => {
    var _b, _c;
    var { children, className, variant, borders = true, isStickyHeader = false, gridBreakPoint = TableGridBreakpoint.gridMd, 'aria-label': ariaLabel, role = 'grid', innerRef, ouiaId, ouiaSafe = true, isTreeTable = false, isNested = false, nestedHeaderColumnSpans } = _a, props = __rest(_a, ["children", "className", "variant", "borders", "isStickyHeader", "gridBreakPoint", 'aria-label', "role", "innerRef", "ouiaId", "ouiaSafe", "isTreeTable", "isNested", "nestedHeaderColumnSpans"]);
    const tableRef = innerRef || React.useRef(null);
    React.useEffect(() => {
        document.addEventListener('keydown', handleKeys);
        // sets up roving tab-index to tree tables only
        if (tableRef && tableRef.current && tableRef.current.classList.contains('pf-m-tree-view')) {
            const tbody = tableRef.current.querySelector('tbody');
            tbody && setTabIndex(Array.from(tbody.querySelectorAll('button, a, input')));
        }
        return function cleanup() {
            document.removeEventListener('keydown', handleKeys);
        };
    }, [tableRef, tableRef.current]);
    const ouiaProps = useOUIAProps('Table', ouiaId, ouiaSafe);
    const grid = (_b = stylesGrid.modifiers) === null || _b === void 0 ? void 0 : _b[toCamel(gridBreakPoint || '').replace(/-?2xl/, '_2xl')];
    const breakPointPrefix = `treeView${gridBreakPoint.charAt(0).toUpperCase() + gridBreakPoint.slice(1)}`;
    const treeGrid = (_c = stylesTreeView.modifiers) === null || _c === void 0 ? void 0 : _c[toCamel(breakPointPrefix || '').replace(/-?2xl/, '_2xl')];
    const handleKeys = (event) => {
        if (isNested ||
            !(tableRef && tableRef.current && tableRef.current.classList.contains('pf-m-tree-view')) || // implements roving tab-index to tree tables only
            (tableRef && tableRef.current !== event.target.closest('.pf-c-table:not(.pf-m-nested)'))) {
            return;
        }
        const activeElement = document.activeElement;
        const key = event.key;
        const rows = Array.from(tableRef.current.querySelectorAll('tbody tr')).filter(el => !el.classList.contains('pf-m-disabled') && !el.hidden);
        if (key === 'Space' || key === 'Enter') {
            activeElement.click();
            event.preventDefault();
        }
        const getFocusableElement = (element) => element.querySelectorAll('button:not(:disabled), input:not(:disabled), a:not(:disabled)')[0];
        handleArrows(event, rows, (element) => element === activeElement.closest('tr'), getFocusableElement, ['button', 'input', 'a'], undefined, false, true, false);
    };
    return (React.createElement("table", Object.assign({ "aria-label": ariaLabel, role: role, className: css(className, styles.table, isTreeTable ? treeGrid : grid, styles.modifiers[variant], !borders && styles.modifiers.noBorderRows, isStickyHeader && styles.modifiers.stickyHeader, isTreeTable && stylesTreeView.modifiers.treeView, isNested && 'pf-m-nested'), ref: tableRef }, (isTreeTable && { role: 'treegrid' }), ouiaProps, props),
        nestedHeaderColumnSpans &&
            nestedHeaderColumnSpans.map((span, index) => {
                if (span === 1) {
                    return React.createElement("col", { key: index });
                }
                else {
                    return React.createElement("colgroup", { key: index, span: span });
                }
            }),
        children));
};
export const TableComposable = React.forwardRef((props, ref) => (React.createElement(TableComposableBase, Object.assign({}, props, { innerRef: ref }))));
TableComposable.displayName = 'TableComposable';
//# sourceMappingURL=TableComposable.js.map