import { __rest } from "tslib";
import * as React from 'react';
import styles from '@patternfly/react-styles/css/components/Panel/panel';
import { css } from '@patternfly/react-styles';
export const Panel = (_a) => {
    var { className, children, variant, isScrollable } = _a, props = __rest(_a, ["className", "children", "variant", "isScrollable"]);
    return (React.createElement("div", Object.assign({ className: css(styles.panel, variant === 'raised' && styles.modifiers.raised, variant === 'bordered' && styles.modifiers.bordered, isScrollable && styles.modifiers.scrollable, className) }, props), children));
};
Panel.displayName = 'Panel';
//# sourceMappingURL=Panel.js.map