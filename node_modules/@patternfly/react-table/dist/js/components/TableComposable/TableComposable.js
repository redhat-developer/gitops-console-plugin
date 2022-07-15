"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableComposable = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const table_1 = tslib_1.__importDefault(require("@patternfly/react-styles/css/components/Table/table"));
const table_grid_1 = tslib_1.__importDefault(require("@patternfly/react-styles/css/components/Table/table-grid"));
const table_tree_view_1 = tslib_1.__importDefault(require("@patternfly/react-styles/css/components/Table/table-tree-view"));
const react_styles_1 = require("@patternfly/react-styles");
const utils_1 = require("../Table/utils/utils");
const react_core_1 = require("@patternfly/react-core");
const TableTypes_1 = require("../Table/TableTypes");
const TableComposableBase = (_a) => {
    var _b, _c;
    var { children, className, variant, borders = true, isStickyHeader = false, gridBreakPoint = TableTypes_1.TableGridBreakpoint.gridMd, 'aria-label': ariaLabel, role = 'grid', innerRef, ouiaId, ouiaSafe = true, isTreeTable = false, isNested = false, nestedHeaderColumnSpans } = _a, props = tslib_1.__rest(_a, ["children", "className", "variant", "borders", "isStickyHeader", "gridBreakPoint", 'aria-label', "role", "innerRef", "ouiaId", "ouiaSafe", "isTreeTable", "isNested", "nestedHeaderColumnSpans"]);
    const tableRef = innerRef || React.useRef(null);
    React.useEffect(() => {
        document.addEventListener('keydown', handleKeys);
        // sets up roving tab-index to tree tables only
        if (tableRef && tableRef.current && tableRef.current.classList.contains('pf-m-tree-view')) {
            const tbody = tableRef.current.querySelector('tbody');
            tbody && react_core_1.setTabIndex(Array.from(tbody.querySelectorAll('button, a, input')));
        }
        return function cleanup() {
            document.removeEventListener('keydown', handleKeys);
        };
    }, [tableRef, tableRef.current]);
    const ouiaProps = react_core_1.useOUIAProps('Table', ouiaId, ouiaSafe);
    const grid = (_b = table_grid_1.default.modifiers) === null || _b === void 0 ? void 0 : _b[utils_1.toCamel(gridBreakPoint || '').replace(/-?2xl/, '_2xl')];
    const breakPointPrefix = `treeView${gridBreakPoint.charAt(0).toUpperCase() + gridBreakPoint.slice(1)}`;
    const treeGrid = (_c = table_tree_view_1.default.modifiers) === null || _c === void 0 ? void 0 : _c[utils_1.toCamel(breakPointPrefix || '').replace(/-?2xl/, '_2xl')];
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
        react_core_1.handleArrows(event, rows, (element) => element === activeElement.closest('tr'), getFocusableElement, ['button', 'input', 'a'], undefined, false, true, false);
    };
    return (React.createElement("table", Object.assign({ "aria-label": ariaLabel, role: role, className: react_styles_1.css(className, table_1.default.table, isTreeTable ? treeGrid : grid, table_1.default.modifiers[variant], !borders && table_1.default.modifiers.noBorderRows, isStickyHeader && table_1.default.modifiers.stickyHeader, isTreeTable && table_tree_view_1.default.modifiers.treeView, isNested && 'pf-m-nested'), ref: tableRef }, (isTreeTable && { role: 'treegrid' }), ouiaProps, props),
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
exports.TableComposable = React.forwardRef((props, ref) => (React.createElement(TableComposableBase, Object.assign({}, props, { innerRef: ref }))));
exports.TableComposable.displayName = 'TableComposable';
//# sourceMappingURL=TableComposable.js.map