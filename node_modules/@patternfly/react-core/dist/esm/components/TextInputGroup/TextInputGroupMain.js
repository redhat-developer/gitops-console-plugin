import { __rest } from "tslib";
import * as React from 'react';
import styles from '@patternfly/react-styles/css/components/TextInputGroup/text-input-group';
import { css } from '@patternfly/react-styles';
import { TextInputGroupContext } from './TextInputGroup';
export const TextInputGroupMain = (_a) => {
    var { children, className, icon, type = 'text', onChange = () => undefined, onFocus, onBlur, 'aria-label': ariaLabel = 'Type to filter', value: inputValue } = _a, props = __rest(_a, ["children", "className", "icon", "type", "onChange", "onFocus", "onBlur", 'aria-label', "value"]);
    const { isDisabled } = React.useContext(TextInputGroupContext);
    const handleChange = (event) => {
        onChange(event.currentTarget.value, event);
    };
    return (React.createElement("div", Object.assign({ className: css(styles.textInputGroupMain, icon && styles.modifiers.icon, className) }, props),
        children,
        React.createElement("span", { className: css(styles.textInputGroupText) },
            icon && React.createElement("span", { className: css(styles.textInputGroupIcon) }, icon),
            React.createElement("input", { type: type, className: css(styles.textInputGroupTextInput), "aria-label": ariaLabel, disabled: isDisabled, onChange: handleChange, onFocus: onFocus, onBlur: onBlur, value: inputValue }))));
};
TextInputGroupMain.displayName = 'TextInputGroupMain';
//# sourceMappingURL=TextInputGroupMain.js.map