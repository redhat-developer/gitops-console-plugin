import { __rest } from "tslib";
import * as React from 'react';
import { useOUIAProps } from '@patternfly/react-core';
import styles from '@patternfly/react-styles/css/components/Table/table';
import inlineStyles from '@patternfly/react-styles/css/components/InlineEdit/inline-edit';
import { css } from '@patternfly/react-styles';
const TrBase = (_a) => {
    var { children, className, isExpanded, isEditable, isHidden = false, isHoverable = false, isRowSelected = false, innerRef, ouiaId, ouiaSafe = true, resetOffset = false, onRowClick } = _a, props = __rest(_a, ["children", "className", "isExpanded", "isEditable", "isHidden", "isHoverable", "isRowSelected", "innerRef", "ouiaId", "ouiaSafe", "resetOffset", "onRowClick"]);
    const ouiaProps = useOUIAProps('TableRow', ouiaId, ouiaSafe);
    let onKeyDown = null;
    if (onRowClick) {
        onKeyDown = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                onRowClick(e);
                e.preventDefault();
            }
        };
    }
    return (React.createElement("tr", Object.assign({ className: css(className, isExpanded !== undefined && styles.tableExpandableRow, isExpanded && styles.modifiers.expanded, isEditable && inlineStyles.modifiers.inlineEditable, isHoverable && styles.modifiers.hoverable, isRowSelected && styles.modifiers.selected, resetOffset && styles.modifiers.firstCellOffsetReset), hidden: isHidden || (isExpanded !== undefined && !isExpanded) }, (isHoverable && { tabIndex: 0 }), { ref: innerRef }, (onRowClick && { onClick: onRowClick, onKeyDown }), ouiaProps, props), children));
};
export const Tr = React.forwardRef((props, ref) => (React.createElement(TrBase, Object.assign({}, props, { innerRef: ref }))));
Tr.displayName = 'Tr';
//# sourceMappingURL=Tr.js.map