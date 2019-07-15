import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { overrideAddEventListener } from "./lib/overrideAddEventListener";

// The magic code
overrideAddEventListener();

ReactDOM.render(<App />, document.getElementById("root"));
