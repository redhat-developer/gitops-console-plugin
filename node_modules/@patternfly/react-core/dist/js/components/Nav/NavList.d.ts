import * as React from 'react';
export interface NavListProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLUListElement>, HTMLUListElement> {
    /** Children nodes */
    children?: React.ReactNode;
    /** Additional classes added to the list */
    className?: string;
    /** Aria-label for the left scroll button */
    ariaLeftScroll?: string;
    /** Aria-label for the right scroll button */
    ariaRightScroll?: string;
}
export declare class NavList extends React.Component<NavListProps> {
    static displayName: string;
    static contextType: React.Context<{
        onSelect?: (event: React.FormEvent<HTMLInputElement>, groupId: string | number, itemId: string | number, to: string, preventDefault: boolean, onClick: (e: React.FormEvent<HTMLInputElement>, itemId: string | number, groupId: string | number, to: string) => void) => void;
        onToggle?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, groupId: string | number, expanded: boolean) => void;
        updateIsScrollable?: (isScrollable: boolean) => void;
        isHorizontal?: boolean;
        flyoutRef?: React.Ref<HTMLLIElement>;
        setFlyoutRef?: (ref: React.Ref<HTMLLIElement>) => void;
    }>;
    static defaultProps: NavListProps;
    state: {
        scrollViewAtStart: boolean;
        scrollViewAtEnd: boolean;
    };
    navList: React.RefObject<HTMLUListElement>;
    handleScrollButtons: () => void;
    scrollLeft: () => void;
    scrollRight: () => void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
//# sourceMappingURL=NavList.d.ts.map