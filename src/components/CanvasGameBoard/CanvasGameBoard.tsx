import React, { useContext, useEffect, useRef } from "react";
import { Block, CanvasGameBoardProps, Tile, Point } from "../../types/types";
import {
  checkTileCollision,
  createTile,
  getBlockArray,
  getClickPosition,
  getLastTile,
  getTileHeightWithOffset,
  isPointInsideTile,
  moveTiles,
  removeOffscreenTiles,
  renderCanvas,
} from "../../utils/helpers";
import {
  NUMBER_OF_BLOCK,
  SPEED as defaultMovingSpeed,
} from "../../utils/constants";
import GameScoreContext from "../../context/GameScoreContext";

let SPEED = defaultMovingSpeed;

const CanvasGameBoard = ({
  isStarted,
  updateStartStatus,
}: CanvasGameBoardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { score, setScore } = useContext(GameScoreContext);
  const tiles = useRef<Tile[]>([]);
  const requestAnimationFrameId = useRef(0);

  const canvasWidth = Math.min(window.innerWidth * 0.95, 450);
  const canvasHeight = window.innerHeight - 50;
  const blocks: Block[] = getBlockArray(
    canvasWidth,
    canvasHeight,
    NUMBER_OF_BLOCK
  );

  const addTile = () => {
    tiles.current.push(createTile(blocks));
  };

  const animate = (context: CanvasRenderingContext2D) => {
    let minHeight = Infinity;

    minHeight = moveTiles(tiles.current, minHeight, SPEED);

    tiles.current = checkTileCollision(tiles.current, canvasHeight);

    if (minHeight > getTileHeightWithOffset()) {
      minHeight = Infinity;
      addTile();
    }
    const lastTile = getLastTile(tiles.current, canvasHeight);

    if (lastTile && !lastTile.isClicked) {
      cancelAnimationFrame(requestAnimationFrameId.current);
      tiles.current = [];
      return;
    }

    tiles.current = removeOffscreenTiles(tiles.current, canvasHeight);

    if (tiles.current) {
      renderCanvas(context, canvasWidth, canvasHeight, blocks, tiles.current);
      requestAnimationFrameId.current = requestAnimationFrame(() =>
        animate(context)
      );
    }
  };

  const gameLogic = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    addTile();
    animate(context);
  };

  useEffect(() => {
    tiles.current = [];
    setScore(0);
    gameLogic();
    if (!isStarted) {
      cancelAnimationFrame(requestAnimationFrameId.current);
      updateStartStatus();
    }
  }, [isStarted]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!canvasRef.current) return;
    let isTileClicked = false;
    const clickPosition: Point | null = getClickPosition(e, canvasRef.current);
    const copiedTiles: Tile[] = JSON.parse(JSON.stringify(tiles.current));
    copiedTiles.forEach((tile) => {
      if (clickPosition && isPointInsideTile(clickPosition, tile)) {
        const selectedTile = tiles.current.filter((x) => x.id === tile.id)[0];
        selectedTile.color = "#810CA8";
        selectedTile.isClicked = true;
        isTileClicked = true;
      }
    });

    if (isTileClicked) {
      setScore((prev) => {
        if ((prev + 1) % 5 == 0) {
          SPEED += 0.25;
        }
        return prev + 1;
      });
    } else {
      setScore(0);
      SPEED = defaultMovingSpeed;
      cancelAnimationFrame(requestAnimationFrameId.current);
      updateStartStatus();
    }
  };
  return (
    <>
      <p className="score-count">{score}</p>
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        onClick={handleClick}
      />
    </>
  );
};

export default CanvasGameBoard;
