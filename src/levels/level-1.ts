import Player from "@/entities/player";
import Level from "@/levels/types";

const level: Level = {
  playerStartPosition: [1, 1],
  init() {
    const player = new Player({ x: 1, y: 1 });
    return {
      player,
    };
  },
  code: `
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
