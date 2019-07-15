import * as React from "react";

import "./style.css";

interface INumberProps {
  value: number;
}

export const Number = (props: INumberProps) => {
  return <div className="number">{props.value}</div>;
};
