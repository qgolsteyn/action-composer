import React from "react";
import { Counter } from "./Counter";

import "./App.css";

function App() {
  return (
    <div className="App">
      <div className="cell">
        <Counter />
      </div>
      <div className="cell">
        <Counter />
      </div>
    </div>
  );
}

export default App;
