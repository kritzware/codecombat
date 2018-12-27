<template>
  <div id="world">
    <canvas id="c"></canvas>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { fabric } from "fabric";
import Level from "@/levels/types";

import Canvas from "@/entities/canvas";
import Sprite from "@/entities/sprite";
import Player from "@/entities/player";

import {
  CANVAS_BACKGROUND_COLOR,
  CANVAS_GRID_SCALE,
  CANVAS_GRID_ROWS,
  CANVAS_GRID_COLS
} from "@/entities/constants";

interface GridPlayerOptions {
  x: number;
  y: number;
}

interface PlayerTranslationOptions {
  x: number;
  y: number;
  shadow?: boolean;
}

@Component
export default class World extends Vue {
  private canvas!: Canvas;
  private player!: Player;

  private readonly grid: number = 50;
  private canvasWidth!: number;
  private canvasHeight!: number;

  private xPrevHover: number = 0;
  private yPrevHover: number = 0;

  // /**
  //  * @name fillSquare
  //  */
  // private fillSquare(x: number, y: number): void {
  //   this.canvas.add(
  //     new fabric.Rect({
  //       left: x,
  //       top: y,
  //       width: 50,
  //       height: 50,
  //       type: "rectangle",
  //       fill: "rgba(0, 255, 0, 0.1)",
  //       originX: "left",
  //       originY: "top",
  //       hasControls: false,
  //       centeredRotation: true,
  //       selectable: false
  //     })
  //   );
  // }

  /**
   * @name createMouseHoverWatcher
   */
  // private createMouseHoverWatcher(): void {
  //   this.canvas.on("mouse:move", (e: any) => {
  //     const { x, y } = e.pointer;
  //     const _x = Math.floor(x / 50) + 1;
  //     const _y = Math.floor(y / 50) + 1;

  //     if (_x !== this.xPrevHover) {
  //       this.xPrevHover = _x;
  //       this.$emit("hover:x", _x * 50);
  //     }
  //     if (_y !== this.yPrevHover) {
  //       this.yPrevHover = _y;
  //       this.$emit("hover:y", _y * 50);
  //     }
  //   });
  // }

  /**
   * @name load
   */
  public async load(level: Level) {
    // Create the canvas
    this.canvas = new Canvas("c", {
      gridScale: CANVAS_GRID_SCALE,
      gridRows: CANVAS_GRID_ROWS,
      gridCols: CANVAS_GRID_COLS,
      backgroundColor: CANVAS_BACKGROUND_COLOR
    });

    // Gridlines for debugging
    this.canvas.createGridLines();
    // TODO: Make this work with new canvas setup
    // this.createMouseHoverWatcher();

    // Create the player
    this.player = new Player({
      canvas: this.canvas,
      x: level.playerStartPosition[0] * CANVAS_GRID_SCALE,
      y: level.playerStartPosition[1] * CANVAS_GRID_SCALE
    });

    // Render to canvas
    this.player.load();

    // Move player
    // await player.move({
    //   x: 2,
    //   y: 0
    // });

    // setSprite("chest_full_open_anim_f0_50x50", 100, 50);
    // setSprite("knight_f_idle_anim_f0_50x50", 200, 200);

    // const xMax = this.canvasWidth - this.grid;
    // const yMax = this.canvasHeight - this.grid;

    // for (let i = 0; i < this.canvasWidth; i += this.grid) {
    //   for (let j = 0; j < this.canvasHeight; j += this.grid) {
    //     /* top wall */
    //     if (i === 50 && j === 0) {
    //       setSprite("wall_top_left_50x50", i, j);
    //     }
    //     if (i === xMax - 50 && j === 0) {
    //       setSprite("wall_top_right_50x50", i, j);
    //     }
    //     if (i >= 100 && i <= xMax - 100 && j === 0) {
    //       setSprite("wall_top_mid_50x50", i, j);
    //     }

    //     /* top wall corners */
    //     if (i === xMax - 50 && j === 50) {
    //       setSprite("wall_corner_right_50x50", i, j);
    //     }
    //     if (i === 50 && j === 50) {
    //       setSprite("wall_corner_left_50x50", i, j);
    //     }

    //     /* side walls */
    //     if (i === xMax - 50 && j >= 100 && j <= yMax - 100) {
    //       setSprite("wall_side_mid_left_50x50", i, j);
    //     }
    //     if (i === 50 && j >= 100 && j <= yMax - 100) {
    //       setSprite("wall_side_mid_right_50x50", i, j);
    //     }

    //     /* top wall side */
    //     if (i >= 100 && i <= xMax - 100 && j === 50) {
    //       setSprite("wall_mid_50x50", i, j);
    //     }

    //     /* front wall */
    //     if (i >= 100 && i <= xMax - 100 && j === yMax - 50) {
    //       setSprite("wall_mid_50x50", i, j);
    //     }

    //     /* mid floor */
    //     if (i >= 50 && i <= xMax - 50 && (j >= 100 && j <= yMax - 100)) {
    //       setSprite("floor_1_50x50", i, j, true);
    //     }
    //   }
    // }
  }

  public async updateWorld(event: string, data: any) {
    switch (event) {
      case "player:move:x":
        await this.player.move({
          x: data.x,
          y: 0
        });
        break;
      case "player:move:y":
        await this.player.move({
          x: 0,
          y: data.y
        });
        break;
      default:
        console.log(`Update world event ${event} not found.`);
    }
  }
}
</script>
