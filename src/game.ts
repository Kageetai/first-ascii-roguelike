// map dimensions
export const ROWS = 15;
export const COLS = 15;

export enum GameState {
  PLAYING,
  VICTORY,
  GAME_OVER,
}

// number of actors per level, including player
const ACTORS = 10;

// the structure of the map
const map: Cell[][] = [];

// the ascii display, combining map and actors
const asciiDisplay: Cell[][] = [];

// a list of all actors, 0 is the player
let player: Actor;
const enemyList: Actor[] = [];
let livingEnemies: number;

// points to each actor in its position, for quick searching
const actorMap: Record<string, Actor | null> = {};

// the state of the game
let state: GameState = GameState.PLAYING;

export function create() {
  // initialize map
  initMap();

  // initialize ascii display
  for (let y = 0; y < ROWS; y++) {
    const newRow: Cell[] = [];
    asciiDisplay.push(newRow);
    for (let x = 0; x < COLS; x++) newRow.push("");
  }

  // initialize actors
  initActors();

  // draw level
  drawMap();
  drawActors();

  return { map: asciiDisplay, state };
}

function initMap() {
  // create a new random map
  for (let y = 0; y < ROWS; y++) {
    const newRow: Cell[] = [];
    for (let x = 0; x < COLS; x++) {
      if (Math.random() > 0.8) newRow.push("#");
      else newRow.push(".");
    }
    map.push(newRow);
  }
}

function drawMap() {
  for (let y = 0; y < ROWS; y++)
    for (let x = 0; x < COLS; x++) asciiDisplay[y][x] = map[y][x];
}

function randomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function initActors() {
  // create actors at random locations
  for (let e = 0; e < ACTORS; e++) {
    // create new actor
    const actor: Actor = {
      x: 0,
      y: 0,
      hp: e === ACTORS - 1 ? 3 : 1, // player has 3 health, enemies only 1
    };
    do {
      // pick a random position that is both a floor and not occupied
      actor.y = randomInt(ROWS);
      actor.x = randomInt(COLS);
    } while (
      map[actor.y][actor.x] === "#" ||
      actorMap[actor.y + "_" + actor.x] != null
    );

    // add references to the actor to the actors list & map
    actorMap[actor.y + "_" + actor.x] = actor;
    enemyList.push(actor);
  }

  // the player is the last actor in the list
  player = enemyList.pop() as Actor;
  livingEnemies = ACTORS - 1;
}

function drawActors() {
  // draw the player
  asciiDisplay[player.y][player.x] = player.hp;

  // draw the enemies
  for (const a of enemyList) {
    if (a != null && a.hp > 0) asciiDisplay[a.y][a.x] = "e";
  }
}

function canGo(actor: Actor, dir: Direction) {
  return (
    actor.x + dir.x >= 0 &&
    actor.x + dir.x <= COLS - 1 &&
    actor.y + dir.y >= 0 &&
    actor.y + dir.y <= ROWS - 1 &&
    map[actor.y + dir.y][actor.x + dir.x] === "."
  );
}

function moveTo(actor: Actor, dir: Direction) {
  // check if actor can move in the given direction
  if (!canGo(actor, dir)) return false;

  // moves actor to the new location
  const newKey = actor.y + dir.y + "_" + (actor.x + dir.x);
  // if the destination tile has an actor in it
  const victim = actorMap[newKey];
  if (victim) {
    //decrement hit points of the actor at the destination tile
    victim.hp--;

    // if it's dead remove its reference
    if (victim.hp === 0) {
      actorMap[newKey] = null;
      enemyList.splice(enemyList.indexOf(victim), 1);
      if (victim != player) {
        livingEnemies--;
        if (livingEnemies === 0) {
          state = GameState.VICTORY;
        }
      }
    }
  } else {
    // remove reference to the actor's old position
    actorMap[actor.y + "_" + actor.x] = null;

    // update position
    actor.y += dir.y;
    actor.x += dir.x;

    // add reference to the actor's new position
    actorMap[actor.y + "_" + actor.x] = actor;
  }
  return true;
}

export function onKeyUp(event: DirectionalEvent) {
  // draw map to overwrite previous actors positions
  drawMap();

  // act on player input
  let acted = false;
  switch (event.key) {
    case "ArrowLeft":
      acted = moveTo(player, { x: -1, y: 0 });
      break;

    case "ArrowRight":
      acted = moveTo(player, { x: 1, y: 0 });
      break;

    case "ArrowUp":
      acted = moveTo(player, { x: 0, y: -1 });
      break;

    case "ArrowDown":
      acted = moveTo(player, { x: 0, y: 1 });
      break;
  }

  // enemies act every time the player does
  if (acted)
    for (const enemy of enemyList) {
      if (enemy != null) aiAct(enemy);
    }

  // draw actors in new positions
  drawActors();

  return { map: [...asciiDisplay], state };
}

function aiAct(actor: Actor) {
  const directions = [
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: -1 },
    { x: 0, y: 1 },
  ];
  const dx = player.x - actor.x;
  const dy = player.y - actor.y;

  // if player is far away, walk randomly
  if (Math.abs(dx) + Math.abs(dy) > 6) {
    // try to walk in random directions until you succeed once
    let moved = false;
    do {
      moved = moveTo(actor, directions[randomInt(directions.length)]);
    } while (!moved);
  }

  // otherwise walk towards player
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx < 0) {
      // left
      moveTo(actor, directions[0]);
    } else {
      // right
      moveTo(actor, directions[1]);
    }
  } else {
    if (dy < 0) {
      // up
      moveTo(actor, directions[2]);
    } else {
      // down
      moveTo(actor, directions[3]);
    }
  }
  if (player.hp < 1) {
    state = GameState.GAME_OVER;
  }
}
