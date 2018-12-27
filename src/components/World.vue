<template>
  <div id="world">
    <canvas id="c"></canvas>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { fabric } from "fabric";
import Level from "@/levels/types";

const CANVAS_BACKGROUND_COLOR: string = "#282a36";
const CANVAS_UNIT_SCALE: number = 10;
const CANVAS_UNIT_COUNT: number = 60;

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
  private canvas!: fabric.Canvas;
  private player!: fabric.Rect;

  private readonly grid: number = 50;
  private canvasWidth!: number;
  private canvasHeight!: number;

  private xPrevHover: number = 0;
  private yPrevHover: number = 0;

  /**
   * @name createCanvas
   */
  private createCanvas(): void {
    if (this.canvas) {
      this.canvas.dispose();
    }
    this.canvas = new fabric.Canvas("c", {
      backgroundColor: CANVAS_BACKGROUND_COLOR,
      selection: false,
      defaultCursor: "crosshair"
    });
    this.canvasWidth = CANVAS_UNIT_COUNT * CANVAS_UNIT_SCALE;
    this.canvasHeight = CANVAS_UNIT_COUNT * CANVAS_UNIT_SCALE;

    this.canvas.setWidth(this.canvasWidth);
    this.canvas.setHeight(this.canvasHeight);
  }

  /**
   * @name createGrid
   */
  private createGrid(): void {
    for (let i = 0; i < this.canvasWidth / this.grid; i++) {
      this.canvas.add(
        new fabric.Line([i * this.grid, 0, i * this.grid, this.canvasHeight], {
          type: "line",
          stroke: "#ccc",
          selectable: false
        })
      );
      this.canvas.add(
        new fabric.Line([0, i * this.grid, this.canvasWidth, i * this.grid], {
          type: "line",
          stroke: "#ccc",
          selectable: false
        })
      );
    }
  }

  /**
   * @name createPlayer
   */
  private createPlayer(options: GridPlayerOptions): void {
    this.player = new fabric.Rect({
      left: this.grid * options.x,
      top: this.grid * options.y,
      width: 50,
      height: 50,
      type: "rectangle",
      fill: "green",
      stroke: "",
      originX: "left",
      originY: "top",
      hasControls: false,
      centeredRotation: true,
      selectable: false,
      hoverCursor: "crosshair",
      name: "player"
    });
    this.canvas.add(this.player);
  }

  /**
   * @name fillSquare
   */
  private fillSquare(x: number, y: number): void {
    this.canvas.add(
      new fabric.Rect({
        left: x,
        top: y,
        width: 50,
        height: 50,
        type: "rectangle",
        fill: "rgba(0, 255, 0, 0.1)",
        originX: "left",
        originY: "top",
        hasControls: false,
        centeredRotation: true,
        selectable: false
      })
    );
  }

  /**
   * @name createMouseHoverWatcher
   */
  private createMouseHoverWatcher(): void {
    this.canvas.on("mouse:move", (e: any) => {
      const { x, y } = e.pointer;
      const _x = Math.floor(x / 50) + 1;
      const _y = Math.floor(y / 50) + 1;

      if (_x !== this.xPrevHover) {
        this.xPrevHover = _x;
        this.$emit("hover:x", _x);
      }
      if (_y !== this.yPrevHover) {
        this.yPrevHover = _y;
        this.$emit("hover:y", _y);
      }
    });
  }

  /**
   * @name movePlayer
   */
  public movePlayer(options: PlayerTranslationOptions): Promise<void> {
    const prevLeft = this.player.left as number;
    const prevTop = this.player.top as number;

    const left = (<any>this.player).left + this.grid * options.x;
    const top = (<any>this.player).top + this.grid * options.y;

    return new Promise(resolve => {
      this.player.animate(
        { left, top },
        {
          duration: 750,
          onChange: () => {
            this.canvas.renderAll();
          },
          onComplete: () => {
            if (options.shadow) {
              if (options.x > 0) {
                for (let i = prevLeft; i < left; i += this.grid) {
                  this.fillSquare(i, prevTop);
                }
              }
              if (options.y > 0) {
                for (let i = prevTop; i < top; i += this.grid) {
                  this.fillSquare(prevLeft, i);
                }
              }
            }
            resolve();
          },
          abort: () => {
            const { left, top } = this.player;
            if ((left as number) >= this.canvasWidth - this.grid) {
              this.player.left = this.canvasWidth - this.grid;
              return true;
            }

            if ((top as number) >= this.canvasHeight - this.grid) {
              this.player.top = this.canvasHeight - this.grid;
              return true;
            }
          },
          easing: fabric.util.ease.easeInOutQuad
        }
      );
    });
  }

  /**
   * @name getPlayerPosition
   */
  public getPlayerPosition() {
    const { left, top } = this.player;
    return {
      x: (left as number) / this.grid + 1,
      y: (top as number) / this.grid + 1
    };
  }

  /**
   * @name load
   */
  public load(level: Level) {
    this.createCanvas();
    this.createGrid();
    this.createMouseHoverWatcher();

    this.createPlayer({
      x: level.playerStartPosition[0],
      y: level.playerStartPosition[1]
    });

    const x = new fabric.Rect({
      left: this.grid * 10 + this.grid / 2,
      top: this.grid * 10 + this.grid / 2,
      width: 25,
      height: 25,
      type: "rectangle",
      fill: "gold",
      stroke: "black",
      originX: "center",
      originY: "center",
      padding: 10,
      hasControls: true,
      centeredRotation: true,
      selectable: true,
      hoverCursor: "crosshair",
      name: "objective-1"
    });
    this.canvas.add(x);
  }
}
</script>
