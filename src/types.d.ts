type Health = 3 | 2 | 1 | 0;

type Cell = "" | "." | "#" | "e" | Health;

type Actor = {
  x: number;
  y: number;
  hp: Health;
};

type Direction = {
  x: number;
  y: number;
};

type DirectionalEvent = {
  key: "ArrowLeft" | "ArrowRight" | "ArrowUp" | "ArrowDown";
};
