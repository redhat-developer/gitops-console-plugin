import { __rest } from "tslib";
import * as React from 'react';
import styles from '@patternfly/react-styles/css/components/TextInputGroup/text-input-group';
import { css } from '@patternfly/react-styles';
export const TextInputGroupContext = React.createContext({
    isDisabled: false
});
export const TextInputGroup = (_a) => {
    var { children, className, isDisabled } = _a, props = __rest(_a, ["children", "className", "isDisabled"]);
    return (React.createElement(TextInputGroupContext.Provider, { value: { isDisabled } },
        React.createElement("div", Object.assign({ className: css(styles.textInputGroup, isDisabled && styles.modifiers.disabled, className) }, props), children)));
};
TextInputGroup.displayName = 'TextInputGroup';
//# sourceMappingURL=TextInputGroup.js.map