import { __rest } from "tslib";
import * as React from 'react';
import { Title, TitleSizes } from '../Title';
import { PopoverContext } from './PopoverContext';
export const PopoverHeader = (_a) => {
    var { children, id } = _a, props = __rest(_a, ["children", "id"]);
    return (React.createElement(PopoverContext.Consumer, null, ({ headerComponent }) => (React.createElement(Title, Object.assign({ headingLevel: headerComponent, size: TitleSizes.md, id: id }, props), children))));
};
PopoverHeader.displayName = 'PopoverHeader';
//# sourceMappingURL=PopoverHeader.js.map