import "./app.css";

import { COLS, init, onKeyUp, ROWS } from "./game.ts";

export function App() {
  const map = init();

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

      <div class="grid" onKeyUp={onKeyUp} tabIndex={0}>
        {map.map((r) => r.map((c) => <div>{c}</div>))}
      </div>
    </>
  );
}
