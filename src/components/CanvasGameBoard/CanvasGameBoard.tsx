import React, { useContext, useEffect, useRef } from "react";
import { Block, CanvasGameBoardProps, Tile, Point } from "../../types/types";
import {
  createTile,
  drawCanvas,
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
  COLORS,
  NUMBER_OF_BLOCK,
  SPEED as defaultMovingSpeed,
} from "../../utils/constants";
import GameScoreContext from "../../context/GameScoreContext";
import { TileClickState } from "../../enums/enums";

let SPEED = defaultMovingSpeed;

const CanvasGameBoard = ({
  isStarted,
  updateStartStatus,
}: CanvasGameBoardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { score, setScore } = useContext(GameScoreContext);
  const tiles = useRef<Tile[]>([]);
  const requestAnimationFrameId = useRef(0);
  const requestAnimationFrameIdForError = useRef(0);

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

    if (minHeight > getTileHeightWithOffset()) {
      minHeight = Infinity;
      addTile();
    }
    const lastTile = getLastTile(tiles.current, canvasHeight);
    if (lastTile && !lastTile.isClicked) {
      tiles.current = [];
      errorAnimation();
      return;
    }
    // tiles.current = checkTileCollision(tiles.current, canvasHeight);

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
    renderCanvas(context, canvasWidth, canvasHeight, blocks, tiles.current);
    if (isStarted) {
      animate(context);
    }
  };

  const resetGame = () => {
    cancelAnimationFrame(requestAnimationFrameId.current);
    cancelAnimationFrame(requestAnimationFrameIdForError.current);
    updateStartStatus();
  };

  const errorAnimation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    let isVisible = true;
    let lastTime = performance.now();
    const draw = () => {
      const currentTime = performance.now();
      const elapsedTime = currentTime - lastTime;
      if (elapsedTime > 100) {
        drawCanvas(
          context,
          canvasWidth,
          canvasHeight,
          isVisible ? COLORS.errorBlinkColorOne : COLORS.errorBlinkColorTwo
        );
        isVisible = !isVisible;
        lastTime = currentTime;
      }
      requestAnimationFrameIdForError.current = requestAnimationFrame(draw);
    };
    requestAnimationFrameIdForError.current = requestAnimationFrame(draw);
    setTimeout(() => {
      resetGame();
      cancelAnimationFrame(requestAnimationFrameIdForError.current);
    }, 1000);
  };

  useEffect(() => {
    tiles.current = [];
    gameLogic();
    if (!isStarted) {
      resetGame();
    }
  }, [isStarted]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!canvasRef.current) return;
    let isTileClicked = TileClickState.NOT_CLICKED;
    const clickPosition: Point | null = getClickPosition(e, canvasRef.current);
    const copiedTiles: Tile[] = JSON.parse(JSON.stringify(tiles.current));
    copiedTiles.forEach((tile) => {
      if (clickPosition && isPointInsideTile(clickPosition, tile)) {
        const selectedTile = tiles.current.filter((x) => x.id === tile.id)[0];
        selectedTile.color = COLORS.selectedTileColor;
        isTileClicked = selectedTile.isClicked
          ? TileClickState.ALREADY_CLICKED
          : TileClickState.CLICKED;
        selectedTile.isClicked = true;
      }
    });

    if (isTileClicked === TileClickState.NOT_CLICKED) {
      SPEED = defaultMovingSpeed;
      cancelAnimationFrame(requestAnimationFrameId.current);
      errorAnimation();
    } else if (isTileClicked === TileClickState.CLICKED) {
      setScore((prev) => {
        if ((prev + 1) % 5 == 0) {
          SPEED += 0.25;
        }
        return prev + 1;
      });
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
