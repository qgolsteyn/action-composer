import * as React from "react";
import { Number } from "./components/Number";
import { Button } from "./components/Button";
import { s, useState } from "./lib/semigroup";

const stateDefinition = {
  value: s("COUNTER_VALUE", 0, (a, b) => a + b)
};

export const Counter = () => {
  const [state, add] = useState(stateDefinition);

  return (
    <>
      <Button text="-" onClick={() => add.value("decrease", -1)} />
      <Number
        value={state.value}
        onWheelNegative={() => add.value("decrease_scroll", -1)}
        onWheelPositive={() => add.value("increase_scroll", 1)}
      />
      <Button text="+" onClick={() => add.value("increase", 1)} />
    </>
  );
};
