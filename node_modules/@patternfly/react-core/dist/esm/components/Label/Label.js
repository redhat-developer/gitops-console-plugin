import { __rest } from "tslib";
import * as React from 'react';
import { useState } from 'react';
import styles from '@patternfly/react-styles/css/components/Label/label';
import labelGrpStyles from '@patternfly/react-styles/css/components/LabelGroup/label-group';
import inlineEditStyles from '@patternfly/react-styles/css/components/InlineEdit/inline-edit';
import { Button } from '../Button';
import { Tooltip } from '../Tooltip';
import { css } from '@patternfly/react-styles';
import TimesIcon from '@patternfly/react-icons/dist/esm/icons/times-icon';
import { useIsomorphicLayoutEffect } from '../../helpers';
const colorStyles = {
    blue: styles.modifiers.blue,
    cyan: styles.modifiers.cyan,
    green: styles.modifiers.green,
    orange: styles.modifiers.orange,
    purple: styles.modifiers.purple,
    red: styles.modifiers.red,
    grey: ''
};
export const Label = (_a) => {
    var { children, className = '', color = 'grey', variant = 'filled', isCompact = false, isEditable = false, editableProps, isTruncated = false, tooltipPosition, icon, onClose, onEditCancel, onEditComplete, closeBtn, closeBtnAriaLabel, closeBtnProps, href, isOverflowLabel, render } = _a, props = __rest(_a, ["children", "className", "color", "variant", "isCompact", "isEditable", "editableProps", "isTruncated", "tooltipPosition", "icon", "onClose", "onEditCancel", "onEditComplete", "closeBtn", "closeBtnAriaLabel", "closeBtnProps", "href", "isOverflowLabel", "render"]);
    const [isEditableActive, setIsEditableActive] = useState(false);
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
    const button = closeBtn ? (closeBtn) : (React.createElement(Button, Object.assign({ type: "button", variant: "plain", onClick: onClose, "aria-label": closeBtnAriaLabel || `Close ${children}` }, closeBtnProps),
        React.createElement(TimesIcon, null)));
    const textRef = React.createRef();
    // ref to apply tooltip when rendered is used
    const componentRef = React.useRef();
    const [isTooltipVisible, setIsTooltipVisible] = React.useState(false);
    useIsomorphicLayoutEffect(() => {
        setIsTooltipVisible(textRef.current && textRef.current.offsetWidth < textRef.current.scrollWidth);
    }, []);
    let content = (React.createElement(React.Fragment, null,
        icon && React.createElement("span", { className: css(styles.labelIcon) }, icon),
        isTruncated && (React.createElement("span", { ref: textRef, className: css(styles.labelText) }, children)),
        !isTruncated && children));
    if (isEditable) {
        content = (React.createElement(React.Fragment, null,
            React.createElement("div", { className: css(inlineEditStyles.inlineEdit) },
                React.createElement("div", Object.assign({ tabIndex: 0, ref: editableDivRef, className: css(inlineEditStyles.inlineEditEditableText), role: "textbox" }, (isEditableActive && { contentEditable: true }), { suppressContentEditableWarning: true }, editableProps), children))));
    }
    let labelComponentChild = (React.createElement(Component, Object.assign({ className: css(styles.labelContent) }, (href && { href })), content));
    if (render) {
        labelComponentChild = (React.createElement(React.Fragment, null,
            isTooltipVisible && React.createElement(Tooltip, { reference: componentRef, content: children, position: tooltipPosition }),
            render({
                className: styles.labelContent,
                content,
                componentRef
            })));
    }
    else if (isTooltipVisible) {
        labelComponentChild = (React.createElement(Tooltip, { content: children, position: tooltipPosition },
            React.createElement(Component, Object.assign({ className: css(styles.labelContent) }, (href && { href })), content)));
    }
    return (React.createElement(LabelComponent, Object.assign({}, props, { className: css(styles.label, colorStyles[color], variant === 'outline' && styles.modifiers.outline, isOverflowLabel && styles.modifiers.overflow, isCompact && styles.modifiers.compact, isEditable && labelGrpStyles.modifiers.editable, isEditableActive && styles.modifiers.editableActive, className) }, (isEditable && {
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
Label.displayName = 'Label';
//# sourceMappingURL=Label.js.map