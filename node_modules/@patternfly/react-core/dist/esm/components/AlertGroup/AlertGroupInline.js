import { __rest } from "tslib";
import * as React from 'react';
import { css } from '@patternfly/react-styles';
import styles from '@patternfly/react-styles/css/components/AlertGroup/alert-group';
export const AlertGroupInline = (_a) => {
    var { className, children, isToast, isLiveRegion } = _a, rest = __rest(_a, ["className", "children", "isToast", "isLiveRegion"]);
    return (React.createElement("ul", Object.assign({ "aria-live": isLiveRegion ? 'polite' : null, "aria-atomic": isLiveRegion ? false : null, className: css(styles.alertGroup, className, isToast ? styles.modifiers.toast : '') }, rest), React.Children.toArray(children).map((Alert, index) => (React.createElement("li", { key: index }, Alert)))));
};
AlertGroupInline.displayName = 'AlertGroupInline';
//# sourceMappingURL=AlertGroupInline.js.map