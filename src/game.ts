// map dimensions
export const ROWS = 15;
export const COLS = 15;

// number of actors per level, including player
const ACTORS = 10;

// the structure of the map
let map: Cell[][];

// the ascii display, as a 2d array of characters
// let asciiDisplay;

// a list of all actors, 0 is the player
let player: Actor;
let actorList: Actor[];
let livingEnemies: number;

// points to each actor in its position, for quick searching
let actorMap: Record<string, Actor | null>;

// initialize phaser, call create() once done
// var game = new Phaser.Game(COLS * FONT * 0.6, ROWS * FONT, Phaser.AUTO, null, {
//     create: create
// });

export function init() {
  // init keyboard commands
  // game.input.keyboard.addCallbacks(null, null, onKeyUp);

  // initialize map
  initMap();

  // initialize ascii display
  // asciiDisplay = [];
  // for (let y = 0; y < ROWS; y++) {
  //   const newRow: Cell[] = [];
  //   asciiDisplay.push(newRow);
  //   for (let x = 0; x < COLS; x++) newRow.push("");
  // }

  // initialize actors
  initActors();

  // draw level
  // drawMap();
  // drawActors();

  return map;
}

// function initCell(chr, x, y) {
//     // add a single cell in a given position to the ascii display
//     var style = {
//         font: FONT + "px monospace",
//         fill: "#fff"
//     };
//     return game.add.text(FONT * 0.6 * x, FONT * y, chr, style);
// }

function initMap() {
  // create a new random map
  map = [];
  for (let y = 0; y < ROWS; y++) {
    const newRow: Cell[] = [];
    for (let x = 0; x < COLS; x++) {
      if (Math.random() > 0.8) newRow.push("#");
      else newRow.push(".");
    }
    map.push(newRow);
  }
}

// function drawMap() {
//     for (var y = 0; y < ROWS; y++)
//         for (var x = 0; x < COLS; x++)
//             asciidisplay[y][x].content = map[y][x];
// }

function randomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function initActors() {
  // create actors at random locations
  actorList = [];
  actorMap = {};
  for (let e = 0; e < ACTORS; e++) {
    // create new actor
    const actor = {
      x: 0,
      y: 0,
      hp: e == 0 ? 3 : 1,
    };
    do {
      // pick a random position that is both a floor and not occupied
      actor.y = randomInt(ROWS);
      actor.x = randomInt(COLS);
    } while (
      map[actor.y][actor.x] == "#" ||
      actorMap[actor.y + "_" + actor.x] != null
    );

    // add references to the actor to the actors list & map
    actorMap[actor.y + "_" + actor.x] = actor;
    actorList.push(actor);
  }

  // the player is the first actor in the list
  player = actorList[0];
  livingEnemies = ACTORS - 1;

  console.log("initActors", actorList);
}

// function drawActors() {
//     for (var a in actorList) {
//         if (actorList[a] != null && actorList[a].hp > 0)
//             asciidisplay[actorList[a].y][actorList[a].x].content = a == 0 ? '' + player.hp : 'e';
//     }
// }

function canGo(actor: Actor, dir: Direction) {
  return (
    actor.x + dir.x >= 0 &&
    actor.x + dir.x <= COLS - 1 &&
    actor.y + dir.y >= 0 &&
    actor.y + dir.y <= ROWS - 1 &&
    map[actor.y + dir.y][actor.x + dir.x] == "."
  );
}

function moveTo(actor: Actor, dir: Direction) {
  // check if actor can move in the given direction
  if (!canGo(actor, dir)) return false;

  // moves actor to the new location
  const newKey = actor.y + dir.y + "_" + (actor.x + dir.x);
  // if the destination tile has an actor in it
  if (actorMap[newKey] != null) {
    //decrement hitpoints of the actor at the destination tile
    const victim = actorMap[newKey];
    victim.hp--;

    // if it's dead remove its reference
    if (victim.hp == 0) {
      actorMap[newKey] = null;
      actorList[actorList.indexOf(victim)] = null;
      if (victim != player) {
        livingEnemies--;
        if (livingEnemies == 0) {
          // victory message
          // const victory = game.add.text(
          //   game.world.centerX,
          //   game.world.centerY,
          //   "Victory!\nCtrl+r to restart",
          //   {
          //     fill: "#2e2",
          //     align: "center",
          //   },
          // );
          // victory.anchor.setTo(0.5, 0.5);
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

function onKeyUp(event) {
  // draw map to overwrite previous actors positions
  // drawMap();

  // act on player input
  let acted = false;
  switch (event.keyCode) {
    case Phaser.Keyboard.LEFT:
      acted = moveTo(player, { x: -1, y: 0 });
      break;

    case Phaser.Keyboard.RIGHT:
      acted = moveTo(player, { x: 1, y: 0 });
      break;

    case Phaser.Keyboard.UP:
      acted = moveTo(player, { x: 0, y: -1 });
      break;

    case Phaser.Keyboard.DOWN:
      acted = moveTo(player, { x: 0, y: 1 });
      break;
  }

  // enemies act every time the player does
  if (acted)
    for (const enemy in actorList) {
      // skip the player
      if (enemy == 0) continue;

      const e = actorList[enemy];
      if (e != null) aiAct(e);
    }

  // draw actors in new positions
  // drawActors();
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
  if (Math.abs(dx) + Math.abs(dy) > 6)
    // try to walk in random directions until you succeed once
    while (!moveTo(actor, directions[randomInt(directions.length)])) {}
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
    // game over message
    // const gameOver = game.add.text(
    //   game.world.centerX,
    //   game.world.centerY,
    //   "Game Over\nCtrl+r to restart",
    //   {
    //     fill: "#e22",
    //     align: "center",
    //   },
    // );
    // gameOver.anchor.setTo(0.5, 0.5);
  }
}
