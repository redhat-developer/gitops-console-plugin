import * as React from 'react';
export interface PanelProps extends React.HTMLProps<HTMLDivElement> {
    /** Content rendered inside the panel */
    children?: React.ReactNode;
    /** Class to add to outer div */
    className?: string;
    /** Adds panel variant styles */
    variant?: 'raised' | 'bordered';
    /** Flag to add scrollable styling to the panel */
    isScrollable?: boolean;
}
export declare const Panel: React.FunctionComponent<PanelProps>;
//# sourceMappingURL=Panel.d.ts.map