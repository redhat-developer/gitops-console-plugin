import { __rest } from "tslib";
import * as React from 'react';
import styles from '@patternfly/react-styles/css/components/Masthead/masthead';
import { css } from '@patternfly/react-styles';
import { formatBreakpointMods } from '../../helpers/util';
export const Masthead = (_a) => {
    var { children, className, backgroundColor = 'dark', display, inset } = _a, props = __rest(_a, ["children", "className", "backgroundColor", "display", "inset"]);
    return (React.createElement("header", Object.assign({ className: css(styles.masthead, formatBreakpointMods(display, styles, 'display-'), formatBreakpointMods(inset, styles), backgroundColor === 'light' && styles.modifiers.light, backgroundColor === 'light200' && styles.modifiers.light_200, className) }, props), children));
};
Masthead.displayName = 'Masthead';
//# sourceMappingURL=Masthead.js.map