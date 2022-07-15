import { __rest } from "tslib";
import * as React from 'react';
import styles from '@patternfly/react-styles/css/components/Card/card';
import { css } from '@patternfly/react-styles';
import { useOUIAProps } from '../../helpers';
export const CardContext = React.createContext({
    cardId: '',
    isExpanded: false
});
export const Card = (_a) => {
    var { children = null, id = '', className = '', component = 'article', isHoverable = false, isHoverableRaised = false, isCompact = false, isSelectable = false, isSelected = false, isSelectableRaised = false, isSelectedRaised = false, isFlat = false, isExpanded = false, isRounded = false, isLarge = false, isFullHeight = false, isPlain = false, ouiaId, ouiaSafe = true } = _a, props = __rest(_a, ["children", "id", "className", "component", "isHoverable", "isHoverableRaised", "isCompact", "isSelectable", "isSelected", "isSelectableRaised", "isSelectedRaised", "isFlat", "isExpanded", "isRounded", "isLarge", "isFullHeight", "isPlain", "ouiaId", "ouiaSafe"]);
    const Component = component;
    const ouiaProps = useOUIAProps(Card.displayName, ouiaId, ouiaSafe);
    if (isCompact && isLarge) {
        // eslint-disable-next-line no-console
        console.warn('Card: Cannot use isCompact with isLarge. Defaulting to isCompact');
        isLarge = false;
    }
    return (React.createElement(CardContext.Provider, { value: {
            cardId: id,
            isExpanded
        } },
        React.createElement(Component, Object.assign({ id: id, className: css(styles.card, isHoverable && styles.modifiers.hoverable, isHoverableRaised && styles.modifiers.hoverableRaised, isCompact && styles.modifiers.compact, isSelectable && !isSelectableRaised && styles.modifiers.selectable, isSelected && !isSelectedRaised && isSelectable && styles.modifiers.selected, isSelectableRaised && styles.modifiers.selectableRaised, isSelectedRaised && isSelectableRaised && styles.modifiers.selectedRaised, isExpanded && styles.modifiers.expanded, isFlat && styles.modifiers.flat, isRounded && styles.modifiers.rounded, isLarge && styles.modifiers.displayLg, isFullHeight && styles.modifiers.fullHeight, isPlain && styles.modifiers.plain, className), tabIndex: isSelectableRaised || isSelectable ? '0' : undefined }, props, ouiaProps), children)));
};
Card.displayName = 'Card';
//# sourceMappingURL=Card.js.map