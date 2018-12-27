import { fabric } from "fabric";
import Sprite from "@/entities/sprite";

interface CanvasOptions {
  gridScale: number;
  gridRows: number;
  gridCols: number;
  backgroundColor: string;
}

export default class Canvas {
  private canvas: fabric.Canvas;
  private scale: number;
  private width: number;
  private height: number;

  constructor(el: string, options: CanvasOptions) {
    this.canvas = new fabric.Canvas(el, {
      backgroundColor: options.backgroundColor,
      selection: false,
      defaultCursor: "crosshair",
    });

    this.scale = options.gridScale;
    this.width = options.gridRows * options.gridScale;
    this.height = options.gridCols * options.gridScale;

    this.canvas.setWidth(this.width);
    this.canvas.setHeight(this.height);
  }

  public createGridLines() {
    for (let i = 0; i < this.width / this.scale; i++) {
      this.canvas.add(
        new fabric.Line([i * this.scale, 0, i * this.scale, this.height], {
          type: "line",
          stroke: "#ccc",
          selectable: false,
        })
      );
      this.canvas.add(
        new fabric.Line([0, i * this.scale, this.width, i * this.scale], {
          type: "line",
          stroke: "#ccc",
          selectable: false,
        })
      );
    }
  }

  // public addSprite(sprite: Sprite) {
  //   const obj = sprite.instance();
  //   this.canvas.add(obj);
  // }

  public render() {
    return this.canvas.renderAll();
  }

  public addObject(obj: fabric.Object) {
    this.canvas.add(obj);
  }

  // public animate(sprite: Sprite, options: any) {
  //   const obj = sprite.instance();
  //   obj.animate(
  //     {
  //       ...options.dest,
  //       onChange: () => {
  //         this.canvas.renderAll();
  //       },
  //     },
  //     ...options.options
  //   );
  // }
}
