import * as React from "react";
import { useActions, ActionDefinitions } from "./lib/actionHook";
import { Number } from "./components/Number";
import { Button } from "./components/Button";

interface IState {
  count: number;
}

type IExternals = {
  VALUE_UPDATED: (count: number) => void;
};

type IActions = {
  INCREASE: (inc: number) => void;
  DECREASE: (dec: number) => void;
  UPDATE_VALUE: (amount: number) => void;
};

const actionDefinitions: ActionDefinitions<IState, IActions, IExternals> = {
  INCREASE: ({ action }, inc) => action.UPDATE_VALUE(inc),
  DECREASE: ({ action }, dec) => action.UPDATE_VALUE(-dec),
  UPDATE_VALUE: ({ state, action }, amount) => [
    { ...state, count: state.count + amount },
    newState => action.VALUE_UPDATED(newState.count)
  ]
};

export const Counter = (props: IExternals) => {
  const [state, actions] = useActions(actionDefinitions, { count: 0 }, props);

  return (
    <>
      <Button text="-" onClick={() => actions.DECREASE(1)} />
      <Number value={state.count} />
      <Button text="+" onClick={() => actions.INCREASE(1)} />
    </>
  );
};
