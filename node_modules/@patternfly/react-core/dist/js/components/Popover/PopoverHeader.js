"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PopoverHeader = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const Title_1 = require("../Title");
const PopoverContext_1 = require("./PopoverContext");
const PopoverHeader = (_a) => {
    var { children, id } = _a, props = tslib_1.__rest(_a, ["children", "id"]);
    return (React.createElement(PopoverContext_1.PopoverContext.Consumer, null, ({ headerComponent }) => (React.createElement(Title_1.Title, Object.assign({ headingLevel: headerComponent, size: Title_1.TitleSizes.md, id: id }, props), children))));
};
exports.PopoverHeader = PopoverHeader;
exports.PopoverHeader.displayName = 'PopoverHeader';
//# sourceMappingURL=PopoverHeader.js.map