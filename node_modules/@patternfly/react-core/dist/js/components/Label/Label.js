"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Label = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const react_1 = require("react");
const label_1 = tslib_1.__importDefault(require("@patternfly/react-styles/css/components/Label/label"));
const label_group_1 = tslib_1.__importDefault(require("@patternfly/react-styles/css/components/LabelGroup/label-group"));
const inline_edit_1 = tslib_1.__importDefault(require("@patternfly/react-styles/css/components/InlineEdit/inline-edit"));
const Button_1 = require("../Button");
const Tooltip_1 = require("../Tooltip");
const react_styles_1 = require("@patternfly/react-styles");
const times_icon_1 = tslib_1.__importDefault(require('@patternfly/react-icons/dist/js/icons/times-icon'));
const helpers_1 = require("../../helpers");
const colorStyles = {
    blue: label_1.default.modifiers.blue,
    cyan: label_1.default.modifiers.cyan,
    green: label_1.default.modifiers.green,
    orange: label_1.default.modifiers.orange,
    purple: label_1.default.modifiers.purple,
    red: label_1.default.modifiers.red,
    grey: ''
};
const Label = (_a) => {
    var { children, className = '', color = 'grey', variant = 'filled', isCompact = false, isEditable = false, editableProps, isTruncated = false, tooltipPosition, icon, onClose, onEditCancel, onEditComplete, closeBtn, closeBtnAriaLabel, closeBtnProps, href, isOverflowLabel, render } = _a, props = tslib_1.__rest(_a, ["children", "className", "color", "variant", "isCompact", "isEditable", "editableProps", "isTruncated", "tooltipPosition", "icon", "onClose", "onEditCancel", "onEditComplete", "closeBtn", "closeBtnAriaLabel", "closeBtnProps", "href", "isOverflowLabel", "render"]);
    const [isEditableActive, setIsEditableActive] = react_1.useState(false);
    const editableDivRef = React.createRef();
    React.useEffect(() => {
        document.addEventListener('click', onDocClick);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('click', onDocClick);
            document.removeEventListener('keydown', onKeyDown);
        };
    });
    const onDocClick = (event) => {
        if (isEditableActive &&
            editableDivRef &&
            editableDivRef.current &&
            !editableDivRef.current.contains(event.target)) {
            onEditComplete && onEditComplete(editableDivRef.current.textContent);
            setIsEditableActive(false);
        }
    };
    const onKeyDown = (event) => {
        const key = event.key;
        if (!editableDivRef || !editableDivRef.current || !editableDivRef.current.contains(event.target)) {
            return;
        }
        if (isEditableActive && (key === 'Enter' || key === 'Tab')) {
            event.preventDefault();
            event.stopImmediatePropagation();
            onEditComplete && onEditComplete(editableDivRef.current.textContent);
            setIsEditableActive(false);
        }
        if (isEditableActive && key === 'Escape') {
            event.preventDefault();
            event.stopImmediatePropagation();
            // Reset div text to initial children prop - pre-edit
            editableDivRef.current.textContent = children;
            onEditCancel && onEditCancel(children);
            setIsEditableActive(false);
        }
        if (!isEditableActive && key === 'Enter') {
            event.preventDefault();
            event.stopImmediatePropagation();
            setIsEditableActive(true);
            // Set cursor position to end of text
            const el = event.target;
            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(el);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    };
    const LabelComponent = (isOverflowLabel ? 'button' : 'span');
    const Component = href ? 'a' : 'span';
    const button = closeBtn ? (closeBtn) : (React.createElement(Button_1.Button, Object.assign({ type: "button", variant: "plain", onClick: onClose, "aria-label": closeBtnAriaLabel || `Close ${children}` }, closeBtnProps),
        React.createElement(times_icon_1.default, null)));
    const textRef = React.createRef();
    // ref to apply tooltip when rendered is used
    const componentRef = React.useRef();
    const [isTooltipVisible, setIsTooltipVisible] = React.useState(false);
    helpers_1.useIsomorphicLayoutEffect(() => {
        setIsTooltipVisible(textRef.current && textRef.current.offsetWidth < textRef.current.scrollWidth);
    }, []);
    let content = (React.createElement(React.Fragment, null,
        icon && React.createElement("span", { className: react_styles_1.css(label_1.default.labelIcon) }, icon),
        isTruncated && (React.createElement("span", { ref: textRef, className: react_styles_1.css(label_1.default.labelText) }, children)),
        !isTruncated && children));
    if (isEditable) {
        content = (React.createElement(React.Fragment, null,
            React.createElement("div", { className: react_styles_1.css(inline_edit_1.default.inlineEdit) },
                React.createElement("div", Object.assign({ tabIndex: 0, ref: editableDivRef, className: react_styles_1.css(inline_edit_1.default.inlineEditEditableText), role: "textbox" }, (isEditableActive && { contentEditable: true }), { suppressContentEditableWarning: true }, editableProps), children))));
    }
    let labelComponentChild = (React.createElement(Component, Object.assign({ className: react_styles_1.css(label_1.default.labelContent) }, (href && { href })), content));
    if (render) {
        labelComponentChild = (React.createElement(React.Fragment, null,
            isTooltipVisible && React.createElement(Tooltip_1.Tooltip, { reference: componentRef, content: children, position: tooltipPosition }),
            render({
                className: label_1.default.labelContent,
                content,
                componentRef
            })));
    }
    else if (isTooltipVisible) {
        labelComponentChild = (React.createElement(Tooltip_1.Tooltip, { content: children, position: tooltipPosition },
            React.createElement(Component, Object.assign({ className: react_styles_1.css(label_1.default.labelContent) }, (href && { href })), content)));
    }
    return (React.createElement(LabelComponent, Object.assign({}, props, { className: react_styles_1.css(label_1.default.label, colorStyles[color], variant === 'outline' && label_1.default.modifiers.outline, isOverflowLabel && label_1.default.modifiers.overflow, isCompact && label_1.default.modifiers.compact, isEditable && label_group_1.default.modifiers.editable, isEditableActive && label_1.default.modifiers.editableActive, className) }, (isEditable && {
        onClick: (evt) => {
            const isEvtFromButton = evt.target.closest('button');
            if (isEvtFromButton !== null) {
                return;
            }
            setIsEditableActive(true);
            editableDivRef.current.focus();
        }
    })),
        labelComponentChild,
        onClose && button));
};
exports.Label = Label;
exports.Label.displayName = 'Label';
//# sourceMappingURL=Label.js.map