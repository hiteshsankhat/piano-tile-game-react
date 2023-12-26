export interface Point {
  x: number;
  y: number;
}

export interface Block {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Tile extends Block {
  color: "black" | "gray";
  id: string;
}

export type CanvasGameBoardProps = {
  isStarted: boolean;
  updateStartStatus: any;
};
