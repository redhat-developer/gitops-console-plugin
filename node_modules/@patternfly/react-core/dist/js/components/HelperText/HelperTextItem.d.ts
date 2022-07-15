import * as React from 'react';
export interface HelperTextItemProps extends React.HTMLProps<HTMLDivElement | HTMLLIElement> {
    /** Content rendered inside the helper text item. */
    children?: React.ReactNode;
    /** Additional classes applied to the helper text item. */
    className?: string;
    /** Sets the component type of the helper text item. */
    component?: 'div' | 'li';
    /** Variant styling of the helper text item. */
    variant?: 'default' | 'indeterminate' | 'warning' | 'success' | 'error';
    /** Custom icon prefixing the helper text. This property will override the default icon paired with each helper text variant. */
    icon?: React.ReactNode;
    /** Flag indicating the helper text item is dynamic. */
    isDynamic?: boolean;
    /** Flag indicating the helper text should have an icon. Dynamic helper texts include icons by default while static helper texts do not. */
    hasIcon?: boolean;
}
export declare const HelperTextItem: React.FunctionComponent<HelperTextItemProps>;
//# sourceMappingURL=HelperTextItem.d.ts.map