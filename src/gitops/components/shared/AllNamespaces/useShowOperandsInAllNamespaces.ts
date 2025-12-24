import { useCallback } from 'react';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { action } from 'typesafe-actions';
type UseShowOperandsInAllNamespaces = () => [boolean, (value: boolean) => void];

// This hook can be used to consume and update the showOperandsInAllNamespaces redux state
export const useShowOperandsInAllNamespaces: UseShowOperandsInAllNamespaces = () => {
  const dispatch = useDispatch();
  const showOperandsInAllNamespaces = useSelector((state: RootStateOrAny) =>
    state.UI.get('showOperandsInAllNamespaces'),
  );
  const setShowOperandsInAllNamespaces = useCallback(
    (value: boolean) => dispatch(uiActionsSetShowOperandsInAllNamespaces(value)),
    [dispatch],
  );
  return [showOperandsInAllNamespaces, setShowOperandsInAllNamespaces];
};

export enum ActionType {
  SetShowOperandsInAllNamespaces = 'setShowOperandsInAllNamespaces',
}

export const uiActionsSetShowOperandsInAllNamespaces = (value: boolean) => {
  return action(ActionType.SetShowOperandsInAllNamespaces, { value });
};
