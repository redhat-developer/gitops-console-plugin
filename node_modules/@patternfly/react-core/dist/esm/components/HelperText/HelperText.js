import { __rest } from "tslib";
import * as React from 'react';
import styles from '@patternfly/react-styles/css/components/HelperText/helper-text';
import { css } from '@patternfly/react-styles';
export const HelperText = (_a) => {
    var { children, className, component = 'div' } = _a, props = __rest(_a, ["children", "className", "component"]);
    const Component = component;
    return (React.createElement(Component, Object.assign({ className: css(styles.helperText, className) }, props), children));
};
HelperText.displayName = 'HelperText';
//# sourceMappingURL=HelperText.js.map