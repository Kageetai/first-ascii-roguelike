import { useState } from "preact/hooks";

import "./app.css";

import { COLS, create, GameState, onKeyUp, ROWS } from "./game.ts";
import { swipeDetect } from "./swipeDetect.ts";

const initialState = create();

export function App() {
  const [game, setGame] = useState(initialState);

  swipeDetect(document.body);

  const onKeyUpEvent = (e: KeyboardEvent) => {
    e.preventDefault();
    const updatedDisplay = onKeyUp(e);
    setGame(updatedDisplay);
  };

  if (game.state !== GameState.PLAYING) {
    const dialog = document.getElementById("dialog") as HTMLDialogElement;
    dialog.showModal();
  }

  return (
    <>
      <style>
        {`:root {
            --map-rows: ${ROWS};
            --map-cols: ${COLS};
        }`}
      </style>

      <h1>First ASCII Roguelike</h1>

      <div class="grid" onKeyUp={onKeyUpEvent} tabIndex={0}>
        {game.map.map((r) => r.map((c) => <div data-cell={c}>{c}</div>))}
      </div>

      <dialog id="dialog">
        <h1>{game.state === GameState.VICTORY ? "Victory" : "Game Over"}</h1>

        <p>Restart with Ctrl/Cmd+R</p>
      </dialog>
    </>
  );
}
