export default interface Level {
  playerStartPosition: [number, number];
  init(): object;
  code: string;
}
