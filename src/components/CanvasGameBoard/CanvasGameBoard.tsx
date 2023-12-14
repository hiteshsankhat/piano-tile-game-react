import React, { useEffect, useRef } from "react";

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
}

const CanvasGameBoard = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWidth = window.innerWidth; // Math.min(window.innerWidth * 0.95, 450);
  const canvasHeight = window.innerHeight; // Math.min(window.innerHeight, 600);

  const tiles = useRef<Tile[]>([]);

  useEffect(() => {
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
      const { x, y, w, h } = blocks[selectedIndex];
      tiles.current.push({
        x: x + 5,
        y: 0,
        w: blockWidth - 10,
        h: 100,
        color: "black",
      });
    };

    const animate = () => {
      let minHeight = Infinity;
      tiles.current.forEach((tile) => {
        tile.y += 0.5;
        minHeight = Math.min(minHeight, tile.y);
      });
      if (minHeight > 105) {
        minHeight = Infinity;
        addTile();
      }
      tiles.current = tiles.current.filter(
        (x: Tile) => x.y < canvasHeight - 105
      );
      if (tiles.current) {
        draw();
        requestAnimationFrame(animate);
      }
    };
    animate();
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const clickPosition: Point = { x: e.clientX, y: e.clientY };
    tiles.current.forEach((tile) => {
      if (
        tile.x < clickPosition.x &&
        tile.x + tile.w > clickPosition.x &&
        tile.y < clickPosition.y &&
        tile.x + tile.w > clickPosition.y
      ) {
        tile.color = "gray";
      }
    });
  };
  return (
    <canvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
      onClick={handleClick}
    />
  );
};

export default CanvasGameBoard;
