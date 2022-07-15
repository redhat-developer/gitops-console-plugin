import * as React from 'react';
export interface MenuItemProps extends Omit<React.HTMLProps<HTMLLIElement>, 'onClick'> {
    /** Content rendered inside the menu list item. */
    children?: React.ReactNode;
    /** Additional classes added to the menu list item */
    className?: string;
    /** Identifies the component in the Menu onSelect or onActionClick callback */
    itemId?: any;
    /** Target navigation link */
    to?: string;
    /** Flag indicating whether the item is active */
    isActive?: boolean;
    /** Flag indicating if the item is favorited */
    isFavorited?: boolean;
    /** Flag indicating if the item causes a load */
    isLoadButton?: boolean;
    /** Flag indicating a loading state */
    isLoading?: boolean;
    /** Callback for item click */
    onClick?: (event?: any) => void;
    /** Component used to render the menu item */
    component?: React.ElementType<any> | React.ComponentType<any>;
    /** Render item as disabled option */
    isDisabled?: boolean;
    /** Render item with icon */
    icon?: React.ReactNode;
    /** Render item with one or more actions */
    actions?: React.ReactNode;
    /** Description of the menu item */
    description?: React.ReactNode;
    /** Render external link icon */
    isExternalLink?: boolean;
    /** Flag indicating if the option is selected */
    isSelected?: boolean;
    /** @beta Flyout menu */
    flyoutMenu?: React.ReactElement;
    /** @beta Callback function when mouse leaves trigger */
    onShowFlyout?: (event?: any) => void;
    /** @beta Drilldown menu of the item. Should be a Menu or DrilldownMenu type. */
    drilldownMenu?: React.ReactNode;
    /** @beta Sub menu direction */
    direction?: 'down' | 'up';
    /** @beta True if item is on current selection path */
    isOnPath?: boolean;
    /** Accessibility label */
    'aria-label'?: string;
}
export declare const MenuItem: React.FunctionComponent<MenuItemProps>;
//# sourceMappingURL=MenuItem.d.ts.map