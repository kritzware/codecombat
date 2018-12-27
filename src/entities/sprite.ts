import { fabric } from "fabric";

import Canvas from "@/entities/canvas";

interface SpriteOptions {
  canvas: Canvas;
  x: number;
  y: number;
  name?: string;
}

interface SpriteAnimateOptions {
  x: number;
  y: number;
  ms: number;
  onChange?(): void;
  onComplete?(): void;
  abort?(): boolean;
}

export default class Sprite {
  protected canvas: Canvas;
  protected image!: fabric.Image;
  private imageURL: string;
  private options: SpriteOptions;

  constructor(imageURL: string, options: SpriteOptions) {
    this.canvas = options.canvas;
    this.imageURL = imageURL;
    this.options = options;
  }

  public async load() {
    return new Promise(resolve => {
      fabric.Image.fromURL(`/sprites/${this.imageURL}.png`, img => {
        this.image = img.set({
          left: this.options.x,
          top: this.options.y,
          originX: "left",
          originY: "top",
          selectable: false,
          hasControls: false,
          centeredRotation: true,
          hoverCursor: "crosshair",
          name: this.options.name,
        });
        this.canvas.addObject(this.image);
        resolve();
      });
    });
  }

  protected animate(options: SpriteAnimateOptions): object {
    return new Promise(resolve => {
      this.image.animate(
        {
          left: options.x,
          top: options.y,
        },
        {
          duration: options.ms,
          onChange: () => {
            if (options.onChange) {
              options.onChange();
            }
            this.canvas.render();
          },
          onComplete: () => {
            if (options.onComplete) {
              options.onComplete();
            }
            resolve();
          },
          abort: options.abort,
          easing: fabric.util.ease.easeInOutQuad,
        }
      );
    });
  }

  protected getPosition(): { left: number; top: number } {
    return { left: this.image.left as number, top: this.image.top as number };
  }
}
