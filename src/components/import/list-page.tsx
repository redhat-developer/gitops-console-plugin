import { TextInput, TextInputProps } from "@patternfly/react-core";
import classNames from "classnames";

import * as React from "react";
import { useTranslation } from "react-i18next";

type TextFilterProps = Omit<TextInputProps, 'type' | 'tabIndex'> & {
label?: string;
parentClassName?: string;
};
export const KEYBOARD_SHORTCUTS = Object.freeze({
focusFilterInput: '/',
blurFilterInput: 'Escape',
focusNamespaceDropdown: 'n',
});

export const TextFilter: React.FC<TextFilterProps> = (props) => {
const {
    label,
    className,
    placeholder,
    autoFocus = false,
    parentClassName,
    ...otherInputProps
} = props;
// const { ref } = useDocumentListener<HTMLInputElement>();
const { t } = useTranslation();
const placeholderText = placeholder ?? t('public~Filter {{label}}...', { label });

return (
    <div className={classNames('has-feedback', parentClassName)}>
    <TextInput
        {...otherInputProps}
        className={classNames('co-text-filter', className)}
        data-test-id="item-filter"
        aria-label={placeholderText}
        placeholder={placeholderText}
    //   ref={ref}
        autoFocus={autoFocus}
        tabIndex={0}
        type="text"
    />
    <span className="co-text-filter-feedback">
        <kbd className="co-kbd co-kbd__filter-input">{KEYBOARD_SHORTCUTS.focusFilterInput}</kbd>
    </span>
    </div>
);
};
TextFilter.displayName = 'TextFilter';