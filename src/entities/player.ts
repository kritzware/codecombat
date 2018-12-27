import Sprite from "@/entities/sprite";
import Canvas from "@/entities/canvas";

import { CANVAS_GRID_SCALE } from "@/entities/constants";

interface PlayerOptions {
  canvas: Canvas;
  x: number;
  y: number;
}

interface PlayerMoveOptions {
  x: number;
  y: number;
  absolute?: boolean;
}

export default class Player extends Sprite {
  constructor(options: PlayerOptions) {
    super("knight_f_idle_anim_f0_50x50", {
      canvas: options.canvas,
      x: options.x,
      y: options.y,
      name: "player",
    });
  }

  public async move(options: PlayerMoveOptions) {
    const { left, top } = this.getPosition();

    const x = options.absolute ? options.x : left + CANVAS_GRID_SCALE * options.x;
    const y = options.absolute ? options.y : top + CANVAS_GRID_SCALE * options.y;

    return this.animate({
      x,
      y,
      ms: 1500,
    });

    //       onComplete: () => {
    //         if (options.shadow) {
    //           if (options.x > 0) {
    //             for (let i = prevLeft; i < left; i += this.grid) {
    //               this.fillSquare(i, prevTop);
    //             }
    //           }
    //           if (options.y > 0) {
    //             for (let i = prevTop; i < top; i += this.grid) {
    //               this.fillSquare(prevLeft, i);
    //             }
    //           }
    //         }
    //         resolve();
    //       },
    //       abort: () => {
    //         const { left, top } = this.player;
    //         if ((left as number) >= this.canvasWidth - this.grid) {
    //           this.player.left = this.canvasWidth - this.grid;
    //           return true;
    //         }

    //         if ((top as number) >= this.canvasHeight - this.grid) {
    //           this.player.top = this.canvasHeight - this.grid;
    //           return true;
    //         }
    //       },
  }
}
