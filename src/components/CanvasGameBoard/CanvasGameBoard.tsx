import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface Point {
  x: number;
  y: number;
}

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Tile extends Box {
  color: "black" | "gray";
  id: string;
}

type CanvasGameBoardProps = {
  isStarted: boolean;
  updateStartStatus: any;
};

let SPEED = 0.5;

const CanvasGameBoard = ({
  isStarted,
  updateStartStatus,
}: CanvasGameBoardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWidth = Math.min(window.innerWidth * 0.95, 450);
  const canvasHeight = Math.min(window.innerHeight, 600);

  const [score, setScore] = useState(0);

  const tiles = useRef<Tile[]>([]);
  let requestAnimationFrameId = useRef(0);
  const gameLogic = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const blockWidth = canvasWidth / 4;
    const blocks: Box[] = [];

    for (let i = 0; i < 4; i++) {
      blocks.push({
        x: blockWidth * i,
        y: 0,
        w: blockWidth * (i + 1),
        h: canvasHeight,
      });
    }

    const drawLine = (
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

    const draw = () => {
      context.clearRect(0, 0, canvasWidth, canvasHeight);
      context.fillStyle = "lightblue";
      context.fillRect(0, 0, canvasWidth, canvasHeight);

      blocks.forEach((block) => {
        drawLine(block.w, 0, block.w, block.h);
      });

      tiles.current.forEach((tile) => {
        drawTile(tile);
      });
    };

    const drawTile = (tile: Tile) => {
      context.fillStyle = tile.color;
      context.fillRect(tile.x, tile.y, tile.w, tile.h);
    };

    const addTile = () => {
      const selectedIndex = Math.floor(Math.random() * blocks.length);
      const { x } = blocks[selectedIndex];
      tiles.current.push({
        x: x + 5,
        y: 0,
        w: blockWidth - 10,
        h: 100,
        color: "black",
        id: uuidv4(),
      });
    };

    const animate = () => {
      let minHeight = Infinity;
      tiles.current.forEach((tile) => {
        tile.y += SPEED;
        minHeight = Math.min(minHeight, tile.y);
      });
      if (minHeight > 105) {
        minHeight = Infinity;
        addTile();
      }
      const lastTile = tiles.current.filter(
        (x: Tile) => x.y >= canvasHeight - 105
      );
      if (lastTile.length > 0 && lastTile[0].color !== "gray") {
        cancelAnimationFrame(requestAnimationFrameId.current);
        tiles.current = [];
        return;
      }
      tiles.current = tiles.current.filter(
        (x: Tile) => x.y < canvasHeight - 105
      );
      if (tiles.current) {
        draw();
        requestAnimationFrameId.current = requestAnimationFrame(animate);
      }
    };
    animate();
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
    const clickPosition: Point = {
      x: e.clientX - canvasRef.current.getBoundingClientRect().left,
      y: e.clientY - canvasRef.current.getBoundingClientRect().top,
    };
    let isTileClicked = false;
    const copiedTiles: Tile[] = JSON.parse(JSON.stringify(tiles.current));
    copiedTiles.forEach((tile) => {
      if (
        clickPosition.x >= tile.x &&
        clickPosition.x <= tile.x + tile.w &&
        clickPosition.y >= tile.y &&
        clickPosition.y <= tile.y + tile.h
      ) {
        const selectedTile = tiles.current.filter((x) => x.id === tile.id)[0];
        selectedTile.color = "gray";
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
      SPEED = 0.5;
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
