export default interface Level {
  playerStartPosition: [number, number];
  finishPosition: [number, number];
  init(): object;
  code: string;
}
