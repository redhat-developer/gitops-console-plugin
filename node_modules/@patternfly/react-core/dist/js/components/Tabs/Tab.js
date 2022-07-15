"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tab = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const tabs_1 = tslib_1.__importDefault(require("@patternfly/react-styles/css/components/Tabs/tabs"));
const TabButton_1 = require("./TabButton");
const TabsContext_1 = require("./TabsContext");
const react_styles_1 = require("@patternfly/react-styles");
const TabBase = (_a) => {
    var { title, eventKey, tabContentRef, id: childId, tabContentId, className: childClassName = '', ouiaId: childOuiaId, isDisabled, isAriaDisabled, inoperableEvents = ['onClick', 'onKeyPress'], href, innerRef } = _a, props = tslib_1.__rest(_a, ["title", "eventKey", "tabContentRef", "id", "tabContentId", "className", "ouiaId", "isDisabled", "isAriaDisabled", "inoperableEvents", "href", "innerRef"]);
    const preventedEvents = inoperableEvents.reduce((handlers, eventToPrevent) => (Object.assign(Object.assign({}, handlers), { [eventToPrevent]: (event) => {
            event.preventDefault();
        } })), {});
    const { mountOnEnter, localActiveKey, unmountOnExit, uniqueId, handleTabClick } = React.useContext(TabsContext_1.TabsContext);
    let ariaControls = tabContentId ? `${tabContentId}` : `pf-tab-section-${eventKey}-${childId || uniqueId}`;
    if ((mountOnEnter || unmountOnExit) && eventKey !== localActiveKey) {
        ariaControls = undefined;
    }
    const isButtonElement = Boolean(!href);
    const getDefaultTabIdx = () => {
        if (isDisabled) {
            return isButtonElement ? null : -1;
        }
        else if (isAriaDisabled) {
            return null;
        }
    };
    return (React.createElement("li", { className: react_styles_1.css(tabs_1.default.tabsItem, eventKey === localActiveKey && tabs_1.default.modifiers.current, childClassName), ref: innerRef },
        React.createElement(TabButton_1.TabButton, Object.assign({ className: react_styles_1.css(tabs_1.default.tabsLink, isDisabled && href && tabs_1.default.modifiers.disabled, isAriaDisabled && tabs_1.default.modifiers.ariaDisabled), disabled: isButtonElement ? isDisabled : null, "aria-disabled": isDisabled || isAriaDisabled, tabIndex: getDefaultTabIdx(), onClick: (event) => handleTabClick(event, eventKey, tabContentRef) }, (isAriaDisabled ? preventedEvents : null), { id: `pf-tab-${eventKey}-${childId || uniqueId}`, "aria-controls": ariaControls, tabContentRef: tabContentRef, ouiaId: childOuiaId, href: href }, props), title)));
};
exports.Tab = React.forwardRef((props, ref) => React.createElement(TabBase, Object.assign({ innerRef: ref }, props)));
exports.Tab.displayName = 'Tab';
//# sourceMappingURL=Tab.js.map