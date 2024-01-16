import "./app.css";

import { COLS, init, ROWS } from "./game.ts";

const map = init();

export function App() {
  return (
    <>
      <style>
        {`:root {
            --map-rows: ${ROWS};
            --map-cols: ${COLS};
        }`}
      </style>

      <h1>First ASCII Roguelike</h1>

      <div class="grid">{map.map((r) => r.map((c) => <div>{c}</div>))}</div>
    </>
  );
}
