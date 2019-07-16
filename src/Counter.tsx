import * as React from "react";
import { useActions, StateDefinition } from "./lib/actionHook";
import { Number } from "./components/Number";
import { Button } from "./components/Button";

interface ICounterState {
  value: number;
}

const stateDefinition: StateDefinition<ICounterState> = {
  value: [0, (val, next) => val + next]
};

export const Counter = () => {
  const [state, actions] = useActions(stateDefinition);

  return (
    <>
      <Button text="-" onClick={() => actions.value(-1)} />
      <Number
        value={state.value}
        onWheelNegative={() => actions.value(-1)}
        onWheelPositive={() => actions.value(1)}
      />
      <Button text="+" onClick={() => actions.value(1)} />
    </>
  );
};
