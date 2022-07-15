"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextInputGroupMain = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const text_input_group_1 = tslib_1.__importDefault(require("@patternfly/react-styles/css/components/TextInputGroup/text-input-group"));
const react_styles_1 = require("@patternfly/react-styles");
const TextInputGroup_1 = require("./TextInputGroup");
const TextInputGroupMain = (_a) => {
    var { children, className, icon, type = 'text', onChange = () => undefined, onFocus, onBlur, 'aria-label': ariaLabel = 'Type to filter', value: inputValue } = _a, props = tslib_1.__rest(_a, ["children", "className", "icon", "type", "onChange", "onFocus", "onBlur", 'aria-label', "value"]);
    const { isDisabled } = React.useContext(TextInputGroup_1.TextInputGroupContext);
    const handleChange = (event) => {
        onChange(event.currentTarget.value, event);
    };
    return (React.createElement("div", Object.assign({ className: react_styles_1.css(text_input_group_1.default.textInputGroupMain, icon && text_input_group_1.default.modifiers.icon, className) }, props),
        children,
        React.createElement("span", { className: react_styles_1.css(text_input_group_1.default.textInputGroupText) },
            icon && React.createElement("span", { className: react_styles_1.css(text_input_group_1.default.textInputGroupIcon) }, icon),
            React.createElement("input", { type: type, className: react_styles_1.css(text_input_group_1.default.textInputGroupTextInput), "aria-label": ariaLabel, disabled: isDisabled, onChange: handleChange, onFocus: onFocus, onBlur: onBlur, value: inputValue }))));
};
exports.TextInputGroupMain = TextInputGroupMain;
exports.TextInputGroupMain.displayName = 'TextInputGroupMain';
//# sourceMappingURL=TextInputGroupMain.js.map