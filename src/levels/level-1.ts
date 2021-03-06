import Player from "@/entities/controller";
import Level from "@/levels/types";

const level: Level = {
  playerStartPosition: [2, 2],
  finishPosition: [11, 11],
  init() {
    const player = new Player({ x: 1, y: 1 });
    return {
      player,
    };
  },
  code: `
/*
  Modify the values below so the player
  moves over the yellow objective icon.

  Try pressing the "Run Code" button!

  Tip: If you like keyboard shortcuts, 
  you can press Ctrl+Enter to execute
  your code.
*/
player.moveX(2);
player.moveY(3);
`,
};

export default level;

// export const code = `
// player.moveX(2);
// player.moveY(3);
// `;

// // export const startPos = "e7";
// export const startY = 1;
// export const startX = 1;
// export const finishPos = "c3";

// export const objectives = ["c2"];

// export function init() {
//   const player = new Player({ x: startX, y: startY });

//   return {
//     player,
//   };
// }
