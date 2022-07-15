import * as React from 'react';
export declare const variantIcons: {
    success: React.ComponentClass<any, any>;
    danger: React.ComponentClass<any, any>;
    warning: React.ComponentClass<any, any>;
    info: React.ComponentClass<any, any>;
    default: React.ComponentClass<any, any>;
};
export interface NotificationDrawerListItemHeaderProps extends React.HTMLProps<HTMLDivElement> {
    /**  Actions rendered inside the notification drawer list item header */
    children?: React.ReactNode;
    /**  Additional classes for notification drawer list item header. */
    className?: string;
    /**  Add custom icon for notification drawer list item header */
    icon?: React.ReactNode;
    /**  Notification drawer list item header screen reader title */
    srTitle?: string;
    /**  Notification drawer list item title */
    title: string;
    /**  Variant indicates the severity level */
    variant?: 'success' | 'danger' | 'warning' | 'info' | 'default';
    /** Truncate title to number of lines */
    truncateTitle?: number;
    /** Position of the tooltip which is displayed if text is truncated */
    tooltipPosition?: 'auto' | 'top' | 'bottom' | 'left' | 'right';
}
export declare const NotificationDrawerListItemHeader: React.FunctionComponent<NotificationDrawerListItemHeaderProps>;
//# sourceMappingURL=NotificationDrawerListItemHeader.d.ts.map