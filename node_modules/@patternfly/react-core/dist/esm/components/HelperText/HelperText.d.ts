import * as React from 'react';
export interface HelperTextProps extends React.HTMLProps<HTMLDivElement | HTMLUListElement> {
    /** Content rendered inside the helper text container. */
    children?: React.ReactNode;
    /** Additional classes applied to the helper text container. */
    className?: string;
    /** Component type of the helper text container */
    component?: 'div' | 'ul';
}
export declare const HelperText: React.FunctionComponent<HelperTextProps>;
//# sourceMappingURL=HelperText.d.ts.map