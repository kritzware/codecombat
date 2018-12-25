interface IPLayer {
  x: number;
  y: number;
}

export default class Player {
  private currentX: number;
  private currentY: number;

  constructor(options: IPLayer) {
    this.currentX = options.x;
    this.currentY = options.y;
  }

  public moveX(x: number) {
    this.currentX = x;
    (<any>self)._callPostMessage("player:move:x", { x });
  }

  public moveY(y: number) {
    this.currentY = y;
    (<any>self)._callPostMessage("player:move:y", { y });
  }

  public getPosition(): object {
    return { x: this.currentX, y: this.currentY };
  }
}
