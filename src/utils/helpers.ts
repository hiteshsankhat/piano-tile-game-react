import { Block, Point, Tile } from "../types/types";
import { v4 as uuidv4 } from "uuid";
import { TILE_HEIGHT, TILE_OFFSET } from "./constants";

const drawLine = (
  context: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number
) => {
  context.beginPath();
  context.moveTo(startX, startY);
  context.lineTo(endX, endY);
  context.lineWidth = 2;
  context.stroke();
  context.closePath();
};

const drawTile = (context: CanvasRenderingContext2D, tile: Tile) => {
  context.fillStyle = tile.color;
  context.fillRect(tile.x, tile.y, tile.w, tile.h);
};

export const renderCanvas = (
  context: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  blocks: Block[],
  tiles: Tile[]
) => {
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  context.fillStyle = "#E5B8F4";
  context.fillRect(0, 0, canvasWidth, canvasHeight);

  blocks.forEach((block) => {
    drawLine(context, block.x + block.w, 0, block.x + block.w, block.h);
  });

  tiles.forEach((tile) => {
    drawTile(context, tile);
  });
};

export const getBlockArray = (
  canvasWidth: number,
  canvasHeight: number,
  numberOfBlocks: number = 4
): Block[] => {
  const blockWidth = canvasWidth / numberOfBlocks;
  return Array.from({ length: numberOfBlocks }, (_, index) => ({
    x: blockWidth * index,
    y: 0,
    w: blockWidth,
    h: canvasHeight,
  }));
};

export const getTileHeightWithOffset = (shouldAddOffset = true) => {
  if (shouldAddOffset) return TILE_HEIGHT + TILE_OFFSET;
  return TILE_HEIGHT;
};

export const createTile = (blocks: Block[]): Tile => {
  const selectedIndex = Math.floor(Math.random() * blocks.length);
  const { x, w } = blocks[selectedIndex];
  return {
    x: x + 5,
    y: 0,
    w: w - 10,
    h: getTileHeightWithOffset(false),
    color: "#2D033B",
    id: uuidv4(),
    isClicked: false,
  };
};

export const moveTiles = (
  tiles: Tile[],
  minHeight: number,
  SPEED: number
): number => {
  tiles.forEach((tile: Tile) => {
    tile.y += SPEED;
    minHeight = Math.min(minHeight, tile.y);
  });
  return minHeight;
};

export const checkTileCollision = (
  tiles: Tile[],
  canvasHeight: number
): Tile[] => {
  return tiles.filter(
    (x: Tile) => x.y < canvasHeight - getTileHeightWithOffset()
  );
};

export const getLastTile = (
  tiles: Tile[],
  canvasHeight: number
): Tile | undefined => {
  return tiles.find(
    (tile: Tile) => tile.y >= canvasHeight - getTileHeightWithOffset()
  );
};

export const removeOffscreenTiles = (
  tiles: Tile[],
  canvasHeight: number
): Tile[] => {
  return tiles.filter(
    (x: Tile) => x.y < canvasHeight - getTileHeightWithOffset()
  );
};

export const isPointInsideTile = (point: Point, tile: Tile): boolean => {
  return (
    point.x >= tile.x &&
    point.x <= tile.x + tile.w &&
    point.y >= tile.y &&
    point.y <= tile.y + tile.h
  );
};

export const getClickPosition = (
  e: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
  canvas: HTMLCanvasElement
): Point | null => {
  if (!canvas) return null;

  const clickPosition: Point = {
    x: e.clientX - canvas.getBoundingClientRect().left,
    y: e.clientY - canvas.getBoundingClientRect().top,
  };

  return clickPosition;
};
