import React from "react";
import { Counter } from "./Counter";

import "./App.css";

function App() {
  return (
    <div className="App">
      <Counter VALUE_UPDATED={(count: number) => {}} />
    </div>
  );
}

export default App;
