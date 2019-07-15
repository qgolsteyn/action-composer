import * as React from "react";

import "./style.css";

interface IButtonProps {
  text: string;
  onClick: () => void;
}

export const Button = (props: IButtonProps) => {
  return (
    <div className="button" onClick={props.onClick}>
      {props.text}
    </div>
  );
};
