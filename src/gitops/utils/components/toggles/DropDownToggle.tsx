import * as React from 'react';

import { MenuToggle, MenuToggleElement, MenuToggleProps } from '@patternfly/react-core';

const DropdownToggle =
  ({ children, ...props }: MenuToggleProps) =>
  (toggleRef: React.Ref<MenuToggleElement>) =>
    (
      <MenuToggle ref={toggleRef} {...props}>
        {children}
      </MenuToggle>
    );

export default DropdownToggle;
