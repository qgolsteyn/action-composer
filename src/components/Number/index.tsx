import * as React from "react";

import "./style.css";

interface INumberProps {
  onWheelPositive: () => void;
  onWheelNegative: () => void;
  value: number;
}

export const Number = (props: INumberProps) => {
  return (
    <div
      className="number"
      onWheel={e =>
        e.deltaY < 0 ? props.onWheelPositive() : props.onWheelNegative()
      }
    >
      {props.value}
    </div>
  );
};
