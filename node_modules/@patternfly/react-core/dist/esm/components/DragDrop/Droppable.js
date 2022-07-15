import { __rest } from "tslib";
import * as React from 'react';
import { css } from '@patternfly/react-styles';
import styles from '@patternfly/react-styles/css/components/DragDrop/drag-drop';
import { DroppableContext } from './DroppableContext';
export const Droppable = (_a) => {
    var { className, children, zone = 'defaultZone', droppableId = 'defaultId', hasNoWrapper = false } = _a, props = __rest(_a, ["className", "children", "zone", "droppableId", "hasNoWrapper"]);
    const childProps = Object.assign({ 'data-pf-droppable': zone, 'data-pf-droppableid': droppableId, className: css(styles.droppable, className) }, props);
    return (React.createElement(DroppableContext.Provider, { value: { zone, droppableId } }, hasNoWrapper ? (React.cloneElement(children, childProps)) : (React.createElement("div", Object.assign({}, childProps), children))));
};
Droppable.displayName = 'Droppable';
//# sourceMappingURL=Droppable.js.map