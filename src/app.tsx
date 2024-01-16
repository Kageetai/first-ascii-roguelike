import { useState } from "preact/hooks";

import "./app.css";

import { COLS, create, onKeyUp, ROWS } from "./game.ts";

const initialState = create();

export function App() {
  const [asciiDisplay, setAsciiDisplay] = useState(initialState);

  const onKeyUp1 = (e: KeyboardEvent) => {
    const updatedDisplay = onKeyUp(e);
    setAsciiDisplay(updatedDisplay);
  };

  return (
    <>
      <style>
        {`:root {
            --map-rows: ${ROWS};
            --map-cols: ${COLS};
        }`}
      </style>

      <h1>First ASCII Roguelike</h1>

      <p>
        <small>Preact Version</small>
      </p>

      <div class="grid" onKeyUp={onKeyUp1} tabIndex={0}>
        {asciiDisplay.map((r) => r.map((c) => <div data-cell={c}>{c}</div>))}
      </div>
    </>
  );
}
