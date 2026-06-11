import * as React from 'react';

export const Button: React.FC<any> = ({ children, variant, isInline, component, ...rest }) => (
  <button data-variant={variant} {...rest}>{children}</button>
);

export const Popover: React.FC<any> = ({ headerContent, bodyContent, children }) => (
  <div data-testid="popover">
    <div data-testid="popover-header">{headerContent}</div>
    <div data-testid="popover-body">{bodyContent}</div>
    {children}
  </div>
);

export const MenuToggle = React.forwardRef<any, any>(({ children, variant, ...rest }, ref) => (
  <button ref={ref} data-variant={variant} {...rest}>{children}</button>
));
MenuToggle.displayName = 'MenuToggle';

export type MenuToggleElement = HTMLButtonElement;
export type MenuToggleProps = any;

export const Dropdown: React.FC<any> = ({ children, isOpen, toggle, ...props }) => (
  <div data-testid="dropdown" data-open={isOpen} {...props}>
    {typeof toggle === 'function' ? toggle(null) : toggle}
    {isOpen && children}
  </div>
);

export const DropdownList: React.FC<any> = ({ children }) => <ul>{children}</ul>;

export const DropdownItem: React.FC<any> = ({ children, description, isDisabled, ...props }) => (
  <li data-disabled={isDisabled} {...props}>{children}{description && <small>{description}</small>}</li>
);

export const Tooltip: React.FC<any> = ({ content, children }) => (
  <span data-testid="tooltip" data-tooltip={typeof content === 'string' ? content : undefined}>
    {children}
  </span>
);

export const TooltipPosition = {
  top: 'top',
  bottom: 'bottom',
  left: 'left',
  right: 'right',
};

export const Title: React.FC<any> = ({ children, headingLevel: Tag = 'h2', className }) => (
  <Tag className={className}>{children}</Tag>
);

export const Label: React.FC<any> = ({ children, className, color, href }) => (
  <span data-testid="label" className={className} data-color={color} data-href={href}>{children}</span>
);

export const LabelGroup: React.FC<any> = ({ children, className, numLabels }) => (
  <div data-testid="label-group" className={className} data-num-labels={numLabels}>{children}</div>
);

export const Icon: React.FC<any> = ({ children, size }) => (
  <span data-testid="icon" data-size={size}>{children}</span>
);
