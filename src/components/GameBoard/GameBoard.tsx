import { useEffect, useRef, useState } from "react";
import { Tile } from "../Tile/Tile";
import "./GameBoard.scss";

const GameBoard = () => {
  const gameBoardDivRef = useRef<HTMLDivElement>(null);
  const [boardHeight, setBoardHeight] = useState(500);

  const [tiles, setTiles] = useState<JSX.Element[]>([]);

  useEffect(() => {
    if (gameBoardDivRef.current) {
      setBoardHeight(gameBoardDivRef.current?.getBoundingClientRect().height);
    }
    // setInterval(() => {
    //   console.log(tiles);
    //   setTiles((prev) => [...prev, <Tile boardHeight={boardHeight} />]);
    // }, 2000);
  }, []);
  return (
    <div ref={gameBoardDivRef} className="board">
      <div className="line line-1">
        {tiles}
        {/* <Tile boardHeight={boardHeight} /> */}
      </div>
      <div className="line line-2">
        <Tile boardHeight={boardHeight} />
      </div>
      <div className="line line-3">
        <Tile boardHeight={boardHeight} />
      </div>
      <div className="line line-4">
        <Tile boardHeight={boardHeight} />
      </div>
    </div>
  );
};

export default GameBoard;
